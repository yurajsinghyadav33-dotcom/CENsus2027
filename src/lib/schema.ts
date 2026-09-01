import * as z from 'zod';

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().min(0).max(120),
  gender: z.string().min(1, 'Gender is required'),
  maritalStatus: z.string().min(1, 'Marital status required'),
  religion: z.string().min(1, 'Religion required'),
  education: z.string().min(1, 'Education required'),
  occupation: z.string().min(1, 'Occupation required'),
});

export const formSchema = z.object({
  headName: z.string().min(1, 'Head of household name is required'),
  address: z.string().min(5, 'Address is required'),
  memberCount: z.coerce.number().min(1, 'At least 1 member required').max(50),
  members: z.array(memberSchema),
  houseOwnership: z.enum(['owned', 'rented', 'other']),
  amenities: z.array(z.string()),
  migrated: z.enum(['yes', 'no']),
  migrationReason: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type Member = z.infer<typeof memberSchema>;
