import { Worker, Job as QueueJob } from 'bullmq';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve and load root monorepo .env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // local fallback

import { prisma } from '@careergpt/database';
import { getAdapterForCompany } from '@careergpt/crawler';
import { isDuplicateJob } from './utils/deduplicator.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisOptions = {
  connection: {
    url: REDIS_URL,
  },
};

console.log('🤖 CareerGPT Crawler Background Worker daemon initializing...');
console.log(`🔌 Connecting to Redis instance at: ${REDIS_URL}`);

// Initialize BullMQ Worker for the 'crawler-queue'
const worker = new Worker(
  'crawler-queue',
  async (queueJob: QueueJob) => {
    const { companyName, domain, url } = queueJob.data;
    console.log(`⚡ [Worker] Processing crawl task: ${companyName} (${url})`);

    const startTime = Date.now();
    let jobsFoundCount = 0;

    try {
      // 1. Resolve scraper adapter
      const adapter = getAdapterForCompany(companyName, domain);
      
      // 2. Fetch and parse job postings
      const scrapedListings = await adapter.scrape(url);
      console.log(`🔎 [Worker] Scraper returned ${scrapedListings.length} postings from ${companyName}`);

      // 3. Find or auto-create Company record
      let company = await prisma.company.findUnique({
        where: { name: companyName },
      });

      if (!company) {
        const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
        company = await prisma.company.create({
          data: {
            name: companyName,
            domain,
            hiringLocations: [],
          },
        });
      }

      // 4. Filter duplicates and insert new opportunities
      for (const listing of scrapedListings) {
        const isDuplicate = await isDuplicateJob(
          listing.url,
          listing.title,
          company.id,
          listing.location
        );

        if (isDuplicate) {
          console.log(`⏭️ [Worker] Skipping duplicate: "${listing.title}"`);
          continue;
        }

        // Insert listing
        await prisma.job.create({
          data: {
            title: listing.title,
            description: listing.description,
            url: listing.url,
            location: listing.location,
            type: listing.type,
            salaryRange: listing.salaryRange || null,
            experienceLevel: listing.experienceLevel || null,
            skills: listing.skills,
            companyId: company.id,
            isVerified: false, // flagged as raw scraped
            trackingStatus: 'POSTED',
          },
        });

        // Increment company jobs count & locations track
        await prisma.company.update({
          where: { id: company.id },
          data: {
            openRolesCount: { increment: 1 },
            hiringLocations: {
              set: Array.from(new Set([...company.hiringLocations, listing.location])),
            },
          },
        });

        jobsFoundCount++;
        console.log(`✅ [Worker] Inserted new opportunity: "${listing.title}"`);
      }

      const durationMs = Date.now() - startTime;
      
      // 5. Write log details to MongoDB CrawlerLogs
      await prisma.crawlerLog.create({
        data: {
          crawlerName: adapter.constructor.name,
          status: 'SUCCESS',
          jobsFound: jobsFoundCount,
          durationMs,
        },
      });

      console.log(`🎉 [Worker] Finished crawl task in ${durationMs}ms. Found ${jobsFoundCount} new jobs.`);
      return { success: true, newJobs: jobsFoundCount };

    } catch (error: any) {
      console.error(`❌ [Worker] Error processing crawl task:`, error);
      
      const durationMs = Date.now() - startTime;
      await prisma.crawlerLog.create({
        data: {
          crawlerName: 'CrawlerWorker',
          status: 'FAILED',
          jobsFound: 0,
          durationMs,
          errorMsg: error.message || 'Unknown processing warning',
        },
      });

      throw error;
    }
  },
  redisOptions
);

worker.on('active', (job) => {
  console.log(`🏃 Job ${job.id} has started processing`);
});

worker.on('completed', (job, result) => {
  console.log(`🏆 Job ${job.id} successfully completed:`, result);
});

worker.on('failed', (job, err) => {
  console.error(`💥 Job ${job?.id} failed with error:`, err.message);
});
