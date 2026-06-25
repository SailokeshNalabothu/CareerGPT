import { z } from 'zod';

// User Roles Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// Authentication schemas
export const RegisterInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

// Job Ingestion schemas
export const JobCreateSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(10, 'Description must be detailed'),
  url: z.string().url('Must be a valid career link'),
  companyName: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'REMOTE', 'HYBRID', 'ONSITE']),
  salaryRange: z.string().optional(),
  experienceLevel: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export type JobCreateInput = z.infer<typeof JobCreateSchema>;
