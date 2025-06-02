import {z} from 'zod';
import {Gender} from './gender-enum';
import {RH} from './rh-enum';

export type Profile = z.infer<typeof PorfileSchema>;

export const PorfileSchema = z.object({
  name: z.string(),
  rh: z.nativeEnum(RH),
  nationalId: z.string(),
  birthdayDate: z.string(),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string(),
  address: z.string(),
  departmentOfResidence: z.string(),
  colombianHealthProvider: z.string(),
  diseases: z.string(),
});
