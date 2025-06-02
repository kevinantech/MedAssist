import {createContext} from 'react';
import {UseProfileHook} from '../hooks/useProfile';

export type AppContextValue = {
  profileHook: UseProfileHook;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);
