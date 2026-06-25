import { Router, Response } from 'express';
import { prisma } from '@careergpt/database';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// GET all companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ companies });
  } catch (error) {
    console.error('Fetch companies error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET single company details + jobs
router.get('/:id', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { jobs: true },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.json({ company });
  } catch (error) {
    console.error('Fetch company error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create company (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, domain, logoUrl, techStack, remotePercent } = req.body;
    
    if (!name || !domain) {
      return res.status(400).json({ message: 'Company name and domain are required' });
    }

    const company = await prisma.company.create({
      data: {
        name,
        domain,
        logoUrl,
        techStack: techStack || [],
        remotePercent: remotePercent ? parseFloat(remotePercent) : 0,
      },
    });

    return res.status(201).json({ company });
  } catch (error: any) {
    console.error('Create company error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A company with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
