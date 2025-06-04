import { createContext } from 'react';
import { UseProfileHook } from '../hooks/useProfile';
import { UseMedicationsHook } from '../hooks/useMedications';

export type AppContextValue = {
  profileHook: UseProfileHook;
  medicationsHook: UseMedicationsHook;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);
