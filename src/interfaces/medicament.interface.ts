import z from 'zod';

export enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export enum ScheduledMedicationStatus {
  TAKEN = 'TAKEN', // El usuario ya tomó el medicamento
  MISSED = 'MISSED', // Pasó el tiempo y no se tomó
  SCHEDULED = 'SCHEDULED', // Está programado (pero no es hora aún)
}

export type MedicationBody = z.infer<typeof MedicationBodySchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type ScheduledMedication = z.infer<typeof ScheduledMedicationSchema>;

export const MedicationBodySchema = z.object({
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
  startDate: z.string().optional(),
  status: z.nativeEnum(MedicationStatus),
});

export const MedicationBodyBusinessRulesSchema = MedicationBodySchema.refine(
  data => data.customTimes.length === data.doseNumberPerDay,
  {
    path: ['customTimes'],
    message:
      'El horario de administración debe coincidir con el número de dosis por día.',
  }
);

export const MedicationSchema = MedicationBodySchema.extend({
  id: z.string().min(1),
  administrationsDone: z.number().optional(),
  endDate: z.string().optional(),
});

export const ScheduledMedicationSchema = z.object({
  id: z.string().min(1),
  medicationId: z.string().min(1),
  medicamentName: z.string().min(1),
  date: z.string().datetime(),
  status: z.nativeEnum(ScheduledMedicationStatus),
});
