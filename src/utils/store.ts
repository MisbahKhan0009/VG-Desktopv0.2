import { Store } from '@tauri-apps/plugin-store';

export type StoreLike = {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
  delete: (key: string) => Promise<void>;
  save: () => Promise<void>;
};

function isTauriEnv(): boolean {
  // Tauri v2 exposes __TAURI_INTERNALS__ on window
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

class LocalStorageStore implements StoreLike {
  private ns = 'app-store:';
  async get(key: string) {
    try {
      const raw = localStorage.getItem(this.ns + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  async set(key: string, value: any) {
    localStorage.setItem(this.ns + key, JSON.stringify(value));
  }
  async delete(key: string) {
    localStorage.removeItem(this.ns + key);
  }
  async save() {
    // no-op for localStorage
  }
}

let storePromise: Promise<StoreLike> | null = null;
export function getStore(): Promise<StoreLike> {
  if (!storePromise) {
    storePromise = isTauriEnv()
      ? (async () => {
          const s = await Store.load('.app-data.dat');
          const adapter: StoreLike = {
            get: (key) => s.get(key),
            set: (key, value) => s.set(key, value),
            delete: async (key) => {
              await s.delete(key);
            },
            save: () => s.save(),
          };
          return adapter;
        })()
      : Promise.resolve(new LocalStorageStore());
  }
  return storePromise as Promise<StoreLike>;
}

export const KEYS = {
  USERS: 'users',
  SESSION: 'session',
  HISTORY: 'history',
  settingsFor: (userId: string) => `settings_${userId}`,
} as const;

export interface HistoryItem {
  id: string;
  userId: string | null;
  fileName: string;
  query: string;
  anomalyType?: string; // one-word type like robbery, arson
  time: string; // ISO
  status: 'completed' | 'in-progress' | 'failed';
}

export type SettingsData = {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    analysisComplete: boolean;
    anomalyDetected: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    dataRetention: string;
    anonymizeData: boolean;
    shareAnalytics: boolean;
    cookiesEnabled: boolean;
  };
  processing: {
    maxConcurrentAnalyses: string;
    autoProcessing: boolean;
    qualityPreset: string;
    compressionEnabled: boolean;
  };
  display: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
  };
};

export const DEFAULT_SETTINGS: SettingsData = {
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    analysisComplete: true,
    anomalyDetected: true,
    systemUpdates: false,
  },
  privacy: {
    dataRetention: '30',
    anonymizeData: true,
    shareAnalytics: false,
    cookiesEnabled: true,
  },
  processing: {
    maxConcurrentAnalyses: '3',
    autoProcessing: false,
    qualityPreset: 'high',
    compressionEnabled: true,
  },
  display: {
    theme: 'auto',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  },
};
