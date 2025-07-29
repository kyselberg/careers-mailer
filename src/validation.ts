import { z } from 'zod';

// Zod validation schemas
export const formDataSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  contactWay: z.string().min(2, 'Contact way must be at least 2 characters').max(200, 'Contact way must be less than 200 characters'),
  experience: z.string().min(10, 'Experience must be at least 10 characters').max(2000, 'Experience must be less than 2000 characters'),
});

export type FormData = z.infer<typeof formDataSchema>;