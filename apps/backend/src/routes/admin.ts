import { Router, Response } from 'express';
import { Queue } from 'bullmq';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize BullMQ Queue connected to local Redis
const crawlerQueue = new Queue('crawler-queue', {
  connection: {
    url: REDIS_URL,
  },
});

// POST trigger crawler enqueuing
router.post('/crawl', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { companyName, domain, url } = req.body;

    if (!companyName || !domain || !url) {
      return res.status(400).json({ message: 'companyName, domain, and url are required fields' });
    }

    // Push task onto Redis crawler-queue
    const job = await crawlerQueue.add('crawl-task', {
      companyName,
      domain,
      url,
    });

    console.log(`📡 [API Gateway] Enqueued crawl task for ${companyName} (${url}) - Job ID: ${job.id}`);

    return res.status(202).json({
      message: 'Crawl task successfully enqueued in Redis queue',
      jobId: job.id,
    });
  } catch (error: any) {
    console.error('Trigger crawl endpoint error:', error);
    return res.status(500).json({ message: 'Internal server error enqueuing crawl task' });
  }
});

// GET crawler logs (for system health / admin dashboard queries)
import { prisma } from '@careergpt/database';
router.get('/crawler-logs', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const logs = await prisma.crawlerLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ logs });
  } catch (error) {
    console.error('Fetch crawler logs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
