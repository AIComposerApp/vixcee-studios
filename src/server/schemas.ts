import { z } from 'zod';

export const BookingRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address format'),
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateString must follow YYYY-MM-DD format'),
  timeSlot: z.string().min(1, 'timeSlot is required'),
  location: z.string().optional().default('Google Meet'),
  guests: z.string().optional(),
  currentWebsite: z.string().optional(),
  projectNotes: z.string().optional(),
  foreseenChallenges: z.string().optional(),
  estimatedBudget: z.string().optional(),
  additionalInterests: z.array(z.string()).optional().default([]),
  phone: z.string().optional(),
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;

export const EarlyAccessRequestSchema = z.object({
  email: z.string().trim().email('Valid email address is required'),
});

export type EarlyAccessRequest = z.infer<typeof EarlyAccessRequestSchema>;
