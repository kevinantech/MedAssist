import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import uuid from 'react-native-uuid';
import { z } from 'zod';
import {
  Medication,
  MedicationBody,
  MedicationSchema,
  MedicationStatus,
  ScheduledMedication,
  ScheduledMedicationSchema,
  ScheduledMedicationStatus,
} from '../interfaces/medicament.interface';
import { scheduleNotification } from '../../lib/notifications';
const MEDICATIONS_KEY = '@MedAssist:Medications';
const SCHEDULED_MEDICATIONS_KEY = '@MedAssist:ScheduledMedications';

export type UseMedicationsHook = ReturnType<typeof useMedications>;

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [scheduledMedications, setScheduledMedications] = useState<
    ScheduledMedication[]
  >([]);

  const reminders: ScheduledMedication[] = useMemo(() => {
    const today = new Date();

    // Filtra las medicaciones programadas para el día actual.
    const filteredScheduledMedications = scheduledMedications.filter(
      scheduledMedication => {
        const scheduledMedicationDate = new Date(scheduledMedication.date);
        return (
          scheduledMedication.status === ScheduledMedicationStatus.SCHEDULED &&
          scheduledMedicationDate.getFullYear() === today.getFullYear() &&
          scheduledMedicationDate.getMonth() === today.getMonth() &&
          scheduledMedicationDate.getDate() === today.getDate() &&
          (scheduledMedicationDate.getHours() > today.getHours() ||
            (scheduledMedicationDate.getHours() === today.getHours() &&
              scheduledMedicationDate.getMinutes() > today.getMinutes()))
        );
      }
    );

    // Filtra las medicaciones que tengan medicación activa.
    const activeMedicationsIds = medications
      .filter(medication => medication.status === MedicationStatus.ACTIVE)
      .map(({ id }) => id);

    const remindersForToday = filteredScheduledMedications
      .filter(reminder => activeMedicationsIds.includes(reminder.medicationId))
      .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
    return remindersForToday;
  }, [medications, scheduledMedications]);

  console.log({
    medications,
    scheduledMedications,
    reminders,
  });

  // Carga las medicaciones.
  useEffect(() => {
    (async () => {
      const _medicaments = await getMedicationsFromStorage();
      setMedications(_medicaments);
    })();
  }, []);

  // Carga las medicaciones programadas.
  useEffect(() => {
    (async () => {
      const _scheduledMedications = await getScheduledMedicationsFromStorage();
      setScheduledMedications(_scheduledMedications);
    })();
  }, []);

  // Elimina los medicamentos y las medicaciones programados
  useEffect(() => {
    true // Activador
      ? (async () => {
          await AsyncStorage.removeItem(MEDICATIONS_KEY);
          await AsyncStorage.removeItem(SCHEDULED_MEDICATIONS_KEY);
        })()
      : null;
  }, []);

  const handleNewMedication = async (input: MedicationBody) => {
    const medication: Medication = {
      id: uuid.v4(),
      ...input,
    };

    try {
      // Almacea la medicación.
      const _medicatons = [...medications, medication];
      setMedications(_medicatons);
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(_medicatons));

      // Genera las medicaciones programadas.
      const _scheduledMedications = [
        ...scheduledMedications,
        ...generateScheduledMedications(medication),
      ];
      setScheduledMedications(_scheduledMedications);

      // Programar las notificaciones.
      await Promise.all(
        _scheduledMedications.map(({ date, medicamentName }) => {
          scheduleNotification({
            date,
            title: `Hora de tomar ${medicamentName}`,
            body: `Es hora de tomar tu medicamento ${medicamentName}`,
          });
        })
      );

      // Almacena las medicaciones programadas.
      await AsyncStorage.setItem(
        SCHEDULED_MEDICATIONS_KEY,
        JSON.stringify(_scheduledMedications)
      );
    } catch (error) {
      console.log('🚀 ~ handleNewMedicament ~ error:', error);
    }
  };

  return { medications, scheduledMedications, reminders, handleNewMedication };
};

const generateScheduledMedications = (
  medication: Medication
): ScheduledMedication[] => {
  const {
    id: medicationId,
    medicamentName,
    customTimes,
    doseNumberPerDay,
    treatmentDays,
  } = medication;
  const scheduledDates: Date[] = [];
  let remainingDoses = doseNumberPerDay * treatmentDays;
  const today = new Date();

  /**
   * Genera las fechas de programación para el primer dia, teniendo en cuenta la hora actual.
   * Cuenta las dosis que faltan para el primer dia. (Para programarlas al final)
   */
  customTimes.forEach(customTime => {
    if (
      customTime.hours * 60 + customTime.minutes >
      today.getHours() * 60 + today.getMinutes()
    ) {
      scheduledDates.push(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          customTime.hours,
          customTime.minutes
        )
      );
      remainingDoses--;
    }
  });

  /**
   * Genera las fechas de programación para los dias restantes.
   */
  let dateCounter = 0;
  while (remainingDoses > 0) {
    customTimes.forEach(customTime => {
      dateCounter++;
      scheduledDates.push(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + dateCounter,
          customTime.hours,
          customTime.minutes
        )
      );
      remainingDoses--;
    });
  }

  const _scheduledMedications: ScheduledMedication[] = scheduledDates.map(
    date => ({
      id: uuid.v4(),
      medicationId,
      medicamentName,
      date: date.toISOString(),
      status: ScheduledMedicationStatus.SCHEDULED,
    })
  );

  return _scheduledMedications;
};

const getMedicationsFromStorage = async (): Promise<Medication[]> => {
  try {
    const storedMedicaments = await AsyncStorage.getItem(MEDICATIONS_KEY);
    const storedMedicamentsParsed = storedMedicaments
      ? JSON.parse(storedMedicaments)
      : [];

    const { data } = z
      .array(MedicationSchema)
      .safeParse(storedMedicamentsParsed);
    return data ? data : [];
  } catch (error) {
    return [];
  }
};

const getScheduledMedicationsFromStorage = async (): Promise<
  ScheduledMedication[]
> => {
  try {
    const storedScheduledMedications = await AsyncStorage.getItem(
      SCHEDULED_MEDICATIONS_KEY
    );
    const storedScheduledMedicationsParsed = storedScheduledMedications
      ? JSON.parse(storedScheduledMedications)
      : [];

    console.log(
      '🚀 ~ storedScheduledMedicationsParsed:',
      storedScheduledMedicationsParsed
    );
    const { data } = z
      .array(ScheduledMedicationSchema)
      .safeParse(storedScheduledMedicationsParsed);
    return data ? data : [];
  } catch (error) {
    return [];
  }
};
