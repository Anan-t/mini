/**
 * Backend configuration.
 *
 * Change the URL here (or set VITE_API_BASE_URL in a .env file) and the whole
 * app follows. Nothing else in the frontend hardcodes a server address.
 *
 * No API keys or secrets belong in this file — the backend owns those.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://server-ten-jet-57.vercel.app';

export const ENDPOINTS = {
  verify: '/api/verify',
  chat: '/api/chat',
  voice: '/api/voice',
};

/** How long to wait before giving up on a verification request. */
export const REQUEST_TIMEOUT_MS = 45000;

/** Limits for the screenshot upload. */
export const UPLOAD = {
  maxBytes: 5 * 1024 * 1024,
  accept: 'image/png,image/jpeg,image/jpg,image/webp',
};

/** Limits for the voice-clip upload. */
export const AUDIO_UPLOAD = {
  maxBytes: 15 * 1024 * 1024,
  accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,audio/m4a',
};

export const buildUrl = (path) => `${API_BASE_URL}${path}`;
