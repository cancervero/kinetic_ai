import type { CalibrationProfile } from '../pose/calibration';

export interface UserProfile {
  alias: string;
  calibration: CalibrationProfile | null;
  createdAt: string;
  lastUsed: string;
}

const STORAGE_KEY = 'kinetic_ai_profiles';
const CURRENT_PROFILE_KEY = 'kinetic_ai_current_profile';

function getProfiles(): Record<string, UserProfile> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveProfiles(profiles: Record<string, UserProfile>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getAllProfiles(): UserProfile[] {
  const profiles = getProfiles();
  return Object.values(profiles).sort(
    (a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
  );
}

export function getProfile(alias: string): UserProfile | null {
  const profiles = getProfiles();
  return profiles[alias] ?? null;
}

export function createProfile(alias: string): UserProfile {
  const profiles = getProfiles();

  if (profiles[alias]) {
    throw new Error(`Profile "${alias}" already exists`);
  }

  const profile: UserProfile = {
    alias,
    calibration: null,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  };

  profiles[alias] = profile;
  saveProfiles(profiles);

  return profile;
}

export function updateCalibration(
  alias: string,
  calibration: CalibrationProfile
): void {
  const profiles = getProfiles();
  const profile = profiles[alias];

  if (!profile) {
    throw new Error(`Profile "${alias}" not found`);
  }

  profile.calibration = calibration;
  profile.lastUsed = new Date().toISOString();

  profiles[alias] = profile;
  saveProfiles(profiles);
}

export function setCurrentProfile(alias: string): void {
  const profile = getProfile(alias);
  if (!profile) {
    throw new Error(`Profile "${alias}" not found`);
  }

  localStorage.setItem(CURRENT_PROFILE_KEY, alias);

  const profiles = getProfiles();
  profile.lastUsed = new Date().toISOString();
  profiles[alias] = profile;
  saveProfiles(profiles);
}

export function getCurrentProfile(): UserProfile | null {
  const alias = localStorage.getItem(CURRENT_PROFILE_KEY);
  if (!alias) return null;

  return getProfile(alias);
}

export function clearCurrentProfile(): void {
  localStorage.removeItem(CURRENT_PROFILE_KEY);
}

export function deleteProfile(alias: string): void {
  const profiles = getProfiles();
  delete profiles[alias];
  saveProfiles(profiles);

  const current = localStorage.getItem(CURRENT_PROFILE_KEY);
  if (current === alias) {
    clearCurrentProfile();
  }
}
