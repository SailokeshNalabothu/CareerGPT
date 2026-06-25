import { Router, Response } from 'express';
import { prisma } from '@careergpt/database';
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ skills });
  } catch (error) {
    console.error('Fetch skills error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create skill (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const skill = await prisma.skill.create({
      data: { name, slug },
    });

    return res.status(201).json({ skill });
  } catch (error: any) {
    console.error('Create skill error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A skill with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE skill (Admin only)
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    return res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
