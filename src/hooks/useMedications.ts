import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import {
  MedicationSchedule,
  MedicationScheduleSchema,
} from '../interfaces/medicament.interface';
const MEDICAMENTS_KEY = '@MedAssist:Medicaments';

export type UseMedicationsHook = ReturnType<typeof useMedications>;

const getMedicationsFromStorage = async (): Promise<MedicationSchedule[]> => {
  try {
    const storedMedicaments = await AsyncStorage.getItem(MEDICAMENTS_KEY);
    const storedMedicamentsParsed = storedMedicaments
      ? JSON.parse(storedMedicaments)
      : [];

    const { success } = z
      .array(MedicationScheduleSchema)
      .safeParse(storedMedicamentsParsed);
    return success ? storedMedicamentsParsed : [];
  } catch (error) {
    return [];
  }
};

export const useMedications = () => {
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);

  useEffect(() => {
    (async () => {
      const _medicaments = await getMedicationsFromStorage();
      setMedications(_medicaments);
    })();
  }, []);

  const handleNewMedication = async (input: MedicationSchedule) => {
    const _medicaments = [...medications, { ...input }];
    setMedications(_medicaments);
    try {
      await AsyncStorage.setItem(MEDICAMENTS_KEY, JSON.stringify(_medicaments));
    } catch (error) {
      console.log('🚀 ~ handleNewMedicament ~ error:', error);
    }
  };

  return { medications, handleNewMedication };
};
