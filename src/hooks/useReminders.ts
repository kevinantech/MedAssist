import { useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';

export type Reminder = {
  medicationName: string;
  time: Date;
};

export const useReminders = () => {
  const {
    medicationsHook: { medications },
  } = useContext(AppContext);

  const remindersForToday = useMemo(() => {
    const todayDate = new Date();
    const totalMinutesForToday =
      todayDate.getHours() * 60 + todayDate.getMinutes();

    const _items: Reminder[] = [];

    /**
     * Filtra las medicaciones para hoy (sin orden).
     */
    for (const medication of medications) {
      for (const customTime of medication.customTimes) {
        const customTimeConversion = customTime.hours * 60 + customTime.minutes;
        if (customTimeConversion > totalMinutesForToday) {
          _items.push({
            medicationName: medication.medicamentName,
            time: new Date(
              todayDate.getFullYear(),
              todayDate.getMonth(),
              todayDate.getDate(),
              customTime.hours,
              customTime.minutes,
              0,
              0
            ),
          });
          continue;
        }
      }
    }

    _items.sort((a, b) => a.time.getTime() - b.time.getTime());
    return _items;
  }, [medications]);

  return {
    remindersForToday,
  };
};
