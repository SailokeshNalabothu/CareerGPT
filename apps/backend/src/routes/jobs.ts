import { Router, Response } from 'express';
import { prisma } from '@careergpt/database';
import { JobCreateSchema } from '@careergpt/shared';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// GET all jobs (with query filters)
router.get('/', async (req, res) => {
  try {
    const { search, location, type, companyId, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const take = parseInt(limit as string, 10);

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { skills: { hasSome: [search as string] } },
      ];
    }

    if (location) {
      where.location = { contains: location as string, mode: 'insensitive' };
    }

    if (type) {
      where.type = type as string;
    }

    if (companyId) {
      where.companyId = companyId as string;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.job.count({ where }),
    ]);

    return res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET single job
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.json({ job });
  } catch (error) {
    console.error('Fetch job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create job (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = JobCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    }

    const jobData = parseResult.data;

    // 1. Find or create company
    let company = await prisma.company.findUnique({
      where: { name: jobData.companyName },
    });

    if (!company) {
      const cleanName = jobData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      company = await prisma.company.create({
        data: {
          name: jobData.companyName,
          domain: `${cleanName}.com`,
          hiringLocations: [jobData.location],
        },
      });
    }

    // 2. Create job
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        description: jobData.description,
        url: jobData.url,
        location: jobData.location,
        type: jobData.type,
        salaryRange: jobData.salaryRange || null,
        experienceLevel: jobData.experienceLevel || null,
        skills: jobData.skills,
        companyId: company.id,
        isVerified: true,
      },
      include: { company: true },
    });

    // 3. Update company roles count
    await prisma.company.update({
      where: { id: company.id },
      data: {
        openRolesCount: { increment: 1 },
        hiringLocations: {
          set: Array.from(new Set([...company.hiringLocations, jobData.location])),
        },
      },
    });

    return res.status(201).json({ job });
  } catch (error: any) {
    console.error('Create job error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A job listing with this URL already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE job (Admin only)
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await prisma.job.delete({ where: { id: req.params.id } });

    // Decrement company roles count
    await prisma.company.update({
      where: { id: job.companyId },
      data: { openRolesCount: { decrement: 1 } },
    });

    return res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
