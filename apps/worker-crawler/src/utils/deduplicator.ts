import { prisma } from '@careergpt/database';

/**
 * Validates if a scraped job listing represents a duplicate of an existing record.
 */
export async function isDuplicateJob(url: string, title: string, companyId: string, location: string): Promise<boolean> {
  // 1. Primary check: check by unique URL
  const existingJobByUrl = await prisma.job.findUnique({
    where: { url },
  });

  if (existingJobByUrl) {
    return true;
  }

  // 2. Semantic check: look for active job under same company, title, and location in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const existingSemanticJob = await prisma.job.findFirst({
    where: {
      companyId,
      location: { equals: location, mode: 'insensitive' },
      title: { equals: title, mode: 'insensitive' },
      createdAt: { gte: sevenDaysAgo },
    },
  });

  return !!existingSemanticJob;
}
