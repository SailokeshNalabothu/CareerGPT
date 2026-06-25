import { Router, Response } from 'express';
import { prisma } from '@careergpt/database';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// GET all roles
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.jobRole.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ roles });
  } catch (error) {
    console.error('Fetch roles error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create role (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const role = await prisma.jobRole.create({
      data: { name, slug },
    });

    return res.status(201).json({ role });
  } catch (error: any) {
    console.error('Create role error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A role with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE role (Admin only)
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.jobRole.delete({ where: { id } });
    return res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
