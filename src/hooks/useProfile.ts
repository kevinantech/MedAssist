import {useEffect, useState} from 'react';
import {PorfileSchema, Profile} from '../interfaces/profile.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PROFILE_KEY = '@MedAssit:Profile';

export type UseProfileHook = ReturnType<typeof useProfile>;

const recoverProfile = async (): Promise<Profile | void> => {
  try {
    const profileString = await AsyncStorage.getItem(PROFILE_KEY);
    if (!profileString) return;
    const profile = JSON.parse(profileString);
    const {data} = PorfileSchema.safeParse(profile);
    return data;
  } catch (error) {
    console.log('🚀 ~ recoverProfile ~ error:', error);
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    (async () => {
      const recoveredProfile = await recoverProfile();
      if (recoveredProfile) setProfile(recoveredProfile);
    })();
  }, []);

  const handleNewProfile = async (input: Profile) => {
    try {
      const stringify = JSON.stringify(input);
      await AsyncStorage.setItem(PROFILE_KEY, stringify);
    } catch (error) {
      console.log('🚀 ~ handleNewProfile ~ error:', error);
    }
    setProfile(input);
  };

  const handleUpdateProfile = async (payload: Partial<Profile>) => {
    if (!profile) return;

    const updatedProfile = {...profile, ...payload};
    try {
      const stringify = JSON.stringify(updatedProfile);
      await AsyncStorage.setItem(PROFILE_KEY, stringify);
    } catch (error) {
      console.log('🚀 ~ handleUpdateProfile ~ error:', error);
    }
    setProfile(updatedProfile);
  };

  return {
    profile,
    handleNewProfile,
    handleUpdateProfile,
  };
};
