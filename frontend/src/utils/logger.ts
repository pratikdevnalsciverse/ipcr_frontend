/* eslint-disable no-console */
const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args: any[]) => {
    if (isDev) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (isDev) {
      console.error('[ERROR]', ...args);
    }
  },
};
