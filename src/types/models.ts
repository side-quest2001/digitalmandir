export type LanguageOption = 'hi' | 'en';
export type AgeGroup = 'under30' | '30to50' | '50plus';

export type DeityOption = {
  id: string;
  name: string;
  symbol: string;
  accent: string;
  glow: string;
  description: string;
  mantra: string;
};

export type AartiSchedule = {
  morning: string;
  evening: string;
};

export type OnboardingPreferences = {
  selectedDeityId: string;
  aartiSchedule: AartiSchedule;
  language: LanguageOption;
};

export type UserProfile = {
  mandirName: string;
  ageGroup: AgeGroup;
  location: string;
  phoneNumber: string;
};

export type SettingsState = {
  notificationsEnabled: boolean;
};

export type BhajanTrack = {
  id: string;
  title: string;
  deityId: string;
  category: string;
  durationLabel: string;
  subtitle: string;
  playable: boolean;
  audioUrl?: string;
  accent: string;
  glow: string;
};

export type TempleStream = {
  id: string;
  name: string;
  location: string;
  headline: string;
  nextAarti: string;
  liveUrl: string;
  channelLabel: string;
  accent: string;
  glow: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  pendingPhoneNumber: string;
  otpCode: string;
};

export type PersistedState = {
  auth: AuthState;
  onboarding: OnboardingPreferences;
  profile: UserProfile;
  settings: SettingsState;
};

export type PlaybackState = {
  currentTrackId: string | null;
  isPlaying: boolean;
};
