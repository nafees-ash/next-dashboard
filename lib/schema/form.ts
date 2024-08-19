import { z } from 'zod';

export const DoctorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  available: z.boolean(),
  specialty: z.string().min(1, { message: 'Specialization is required.' }),
  sub_specialties: z.array(z.string()).nullable(),
  hospital: z.string().min(1, { message: 'Hospital is required.' }),
  degree: z.string().min(1, { message: 'Degree is required.' }),
  experience: z
    .number()
    .min(0, { message: 'Experience must be a positive number.' }),
  phone_number: z.string().nullable(),
  office_number: z.string().nullable(),
  fee: z.number().min(0, { message: 'Fee must be a positive number.' }),
  profession: z
    .enum([
      'assistant proffesor',
      'associate proffesor',
      'professor',
      'consultant',
      'specialist',
      'senior specialist',
    ])
    .nullable(),
  days_of_week: z.string().nullable(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  limit: z.number().nullable(),
});
