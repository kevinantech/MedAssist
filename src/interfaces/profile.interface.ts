import { z } from 'zod';
import { Gender } from './gender-enum';
import { RH } from './rh-enum';

export type Profile = z.infer<typeof PorfileSchema>;

export const PorfileSchema = z.object({
  name: z.string().min(1, 'Ingrese su nombre'),
  rh: z.nativeEnum(RH),
  nationalId: z.string().min(1, 'Ingrese su número de identificación'),
  birthdayDate: z.string().min(1, 'Ingrese su fecha de nacimiento'),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string().min(1, 'Ingrese su número de teléfono'),
  address: z.string().min(1, 'Ingrese su dirección'),
  departmentOfResidence: z
    .string()
    .min(1, 'Ingrese su departamento de residencia'),
  colombianHealthProvider: z.string().min(1, 'Ingrese su EPS'),
  diseases: z.string().optional(),
});
