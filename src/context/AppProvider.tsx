import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { bhajanTracks } from '../data/content';
import type {
  AgeGroup,
  BhajanTrack,
  LanguageOption,
  PersistedState,
  PlaybackState,
} from '../types/models';

const STORAGE_KEY = 'digital-mandir-state';

const defaultState: PersistedState = {
  auth: {
    isLoggedIn: false,
    pendingPhoneNumber: '',
    otpCode: '123456',
  },
  onboarding: {
    selectedDeityId: 'krishna',
    aartiSchedule: {
      morning: '07:00',
      evening: '19:00',
    },
    language: 'hi',
  },
  profile: {
    mandirName: '',
    ageGroup: '30to50',
    location: 'Delhi, India',
    phoneNumber: '',
  },
  settings: {
    notificationsEnabled: true,
  },
};

type AppContextValue = {
  hydrated: boolean;
  state: PersistedState;
  playbackState: PlaybackState;
  currentTrack: BhajanTrack | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateDeity: (deityId: string) => void;
  updateAartiTime: (phase: 'morning' | 'evening', value: string) => void;
  updateLanguage: (language: LanguageOption) => void;
  updateProfile: (payload: {
    mandirName: string;
    ageGroup: AgeGroup;
    location: string;
  }) => void;
  completeOnboarding: () => void;
  toggleNotifications: () => void;
  playTrack: (trackId: string) => void;
  togglePlayback: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentTrackId: null,
    isPlaying: false,
  });
  const playerRef = useRef(createAudioPlayer(null));

  const currentTrack =
    bhajanTracks.find((track) => track.id === playbackState.currentTrackId) ?? null;

  useEffect(() => {
    async function bootstrap() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'duckOthers',
        shouldPlayInBackground: false,
      });

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        setState(parsed);
      }
      setHydrated(true);
    }

    bootstrap().catch(() => {
      setHydrated(true);
    });

    return () => {
      playerRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  useEffect(() => {
    const subscription = playerRef.current.addListener(
      'playbackStatusUpdate',
      (status) => {
        setPlaybackState((current) => ({
          ...current,
          isPlaying: status.playing,
        }));
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  async function sendOtp(phoneNumber: string) {
    if (phoneNumber.length < 10) {
      return false;
    }

    setState((current) => ({
      ...current,
      auth: {
        ...current.auth,
        pendingPhoneNumber: phoneNumber,
        otpCode: '123456',
      },
    }));
    return true;
  }

  async function verifyOtp(otp: string) {
    if (otp !== state.auth.otpCode) {
      return false;
    }

    setState((current) => ({
      ...current,
      auth: {
        ...current.auth,
        isLoggedIn: true,
      },
      profile: {
        ...current.profile,
        phoneNumber: current.auth.pendingPhoneNumber,
      },
    }));
    return true;
  }

  async function logout() {
    playerRef.current.pause();
    setPlaybackState({
      currentTrackId: null,
      isPlaying: false,
    });
    setState(defaultState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  function updateDeity(deityId: string) {
    setState((current) => ({
      ...current,
      onboarding: {
        ...current.onboarding,
        selectedDeityId: deityId,
      },
    }));
  }

  function updateAartiTime(phase: 'morning' | 'evening', value: string) {
    setState((current) => ({
      ...current,
      onboarding: {
        ...current.onboarding,
        aartiSchedule: {
          ...current.onboarding.aartiSchedule,
          [phase]: value,
        },
      },
    }));
  }

  function updateLanguage(language: LanguageOption) {
    setState((current) => ({
      ...current,
      onboarding: {
        ...current.onboarding,
        language,
      },
    }));
  }

  function updateProfile(payload: {
    mandirName: string;
    ageGroup: AgeGroup;
    location: string;
  }) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        ...payload,
      },
    }));
  }

  function completeOnboarding() {
    setState((current) => ({
      ...current,
    }));
  }

  function toggleNotifications() {
    setState((current) => ({
      ...current,
      settings: {
        notificationsEnabled: !current.settings.notificationsEnabled,
      },
    }));
  }

  function playTrack(trackId: string) {
    const track = bhajanTracks.find((entry) => entry.id === trackId);

    if (!track?.audioUrl) {
      return;
    }

    playerRef.current.replace(track.audioUrl);
    playerRef.current.play();
    setPlaybackState({
      currentTrackId: trackId,
      isPlaying: true,
    });
  }

  function togglePlayback() {
    if (!currentTrack) {
      return;
    }

    if (playbackState.isPlaying) {
      playerRef.current.pause();
      setPlaybackState((current) => ({
        ...current,
        isPlaying: false,
      }));
      return;
    }

    if (currentTrack.audioUrl) {
      playerRef.current.replace(currentTrack.audioUrl);
      playerRef.current.play();
      setPlaybackState((current) => ({
        ...current,
        isPlaying: true,
      }));
    }
  }

  return (
    <AppContext.Provider
      value={{
        hydrated,
        state,
        playbackState,
        currentTrack,
        sendOtp,
        verifyOtp,
        logout,
        updateDeity,
        updateAartiTime,
        updateLanguage,
        updateProfile,
        completeOnboarding,
        toggleNotifications,
        playTrack,
        togglePlayback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }

  return context;
}
