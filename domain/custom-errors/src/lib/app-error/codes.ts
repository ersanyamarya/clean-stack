import httpStatusCodes from 'http-status-codes';
import { z } from 'zod';

export const appErrorCodes = {
  RESOURCE_NOT_FOUND: {
    en: '{resource} not found',
    de: '{resource} nicht gefunden',
    statusCode: httpStatusCodes.NOT_FOUND,
    metaData: z.object({
      resource: z.string(),
    }),
  },
  RESOURCE_ALREADY_EXISTS: {
    en: '{resource} already exists',
    de: '{resource} existiert bereits',
    statusCode: httpStatusCodes.CONFLICT,
    metaData: z.object({
      resource: z.string(),
    }),
  },
  USER_UNAUTHENTICATED: {
    en: 'User unauthenticated',
    de: 'Benutzer nicht authentifiziert',
    statusCode: httpStatusCodes.UNAUTHORIZED,
    metaData: z.object({}),
  },
  USER_UNAUTHORIZED: {
    en: 'User unauthorized',
    de: 'Benutzer nicht autorisiert',
    statusCode: httpStatusCodes.FORBIDDEN,
    metaData: z.object({}),
  },
};

/**
 * Represents the keys of the `errorCodes` object.
 * This type is derived from the keys of the `errorCodes` object,
 * ensuring that only valid error code keys are used.
 */
export type APP_ERROR_CODE_KEYS = keyof typeof appErrorCodes;
