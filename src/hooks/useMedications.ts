import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import { z } from 'zod';
import {
  Medication,
  MedicationBody,
  MedicationSchema,
} from '../interfaces/medicament.interface';
const MEDICAMENTS_KEY = '@MedAssist:Medications';

export type UseMedicationsHook = ReturnType<typeof useMedications>;

const getMedicationsFromStorage = async (): Promise<Medication[]> => {
  try {
    const storedMedicaments = await AsyncStorage.getItem(MEDICAMENTS_KEY);
    const storedMedicamentsParsed = storedMedicaments
      ? JSON.parse(storedMedicaments)
      : [];

    const { success } = z
      .array(MedicationSchema)
      .safeParse(storedMedicamentsParsed);
    return success ? storedMedicamentsParsed : [];
  } catch (error) {
    return [];
  }
};

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    (async () => {
      const _medicaments = await getMedicationsFromStorage();
      setMedications(_medicaments);
    })();
  }, []);

  const handleNewMedication = async (input: MedicationBody) => {
    try {
      const _medicatons = [
        ...medications,
        {
          id: uuid.v4(),
          ...input,
        },
      ];
      setMedications(_medicatons);
      await AsyncStorage.setItem(MEDICAMENTS_KEY, JSON.stringify(_medicatons));
    } catch (error) {
      console.log('🚀 ~ handleNewMedicament ~ error:', error);
    }
  };

  return { medications, handleNewMedication };
};
