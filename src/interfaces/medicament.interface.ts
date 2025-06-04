import z from 'zod';

export enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export type MedicationBody = z.infer<typeof MedicationBodySchema>;

export const MedicationBodySchema = z
  .object({
    medicamentName: z.string(),
    doseNumberPerDay: z.number().min(1),
    treatmentDays: z.number().min(1),
    customTimes: z.array(
      z.object({
        hours: z.number().min(0).max(23),
        minutes: z.number().min(0).max(59),
        value: z.string(),
      })
    ),
    administrationsDone: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.nativeEnum(MedicationStatus),
  })
  .refine(data => data.customTimes.length === data.doseNumberPerDay, {
    path: ['customTimes'],
    message:
      'El horario de administración debe coincidir con el número de dosis por día.',
  });
