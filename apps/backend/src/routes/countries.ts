import { Router, Response } from 'express';
import { prisma } from '@careergpt/database';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// GET all countries
router.get('/', async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ countries });
  } catch (error) {
    console.error('Fetch countries error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create country (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Country name and ISO code are required' });
    }

    const country = await prisma.country.create({
      data: {
        name,
        code: code.toUpperCase(),
      },
    });

    return res.status(201).json({ country });
  } catch (error: any) {
    console.error('Create country error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A country with this name or code already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE country (Admin only)
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.country.delete({ where: { id } });
    return res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Delete country error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
