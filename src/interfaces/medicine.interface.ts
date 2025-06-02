import z from 'zod';

export type Medicine = z.infer<typeof MedicineSchema>;

export const MedicineSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  hours: z.array(z.string()),
});
