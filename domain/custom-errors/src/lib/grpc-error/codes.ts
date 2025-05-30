import { status } from '@grpc/grpc-js';
import httpStatusCodes from 'http-status-codes';

export type GrpcErrorCode = Record<
  status,
  {
    en: string;
    de: string;
    statusCode: number;
  }
>;

export const grpcErrorCodes: GrpcErrorCode = {
  [status.OK]: {
    en: 'OK',
    de: 'OK',
    statusCode: httpStatusCodes.OK,
  },
  [status.CANCELLED]: {
    en: 'Cancelled',
    de: 'Abgebrochen',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
  [status.UNKNOWN]: {
    en: 'Unknown error',
    de: 'Unbekannter Fehler',
    statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
  },
  [status.INVALID_ARGUMENT]: {
    en: 'Invalid argument',
    de: 'Ungültiges Argument',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
  [status.DEADLINE_EXCEEDED]: {
    en: 'Deadline exceeded',
    de: 'Frist überschritten',
    statusCode: httpStatusCodes.REQUEST_TIMEOUT,
  },
  [status.NOT_FOUND]: {
    en: 'Not found',
    de: 'Nicht gefunden',
    statusCode: httpStatusCodes.NOT_FOUND,
  },
  [status.ALREADY_EXISTS]: {
    en: 'Already exists',
    de: 'Bereits vorhanden',
    statusCode: httpStatusCodes.CONFLICT,
  },
  [status.PERMISSION_DENIED]: {
    en: 'Permission denied',
    de: 'Zugriff verweigert',
    statusCode: httpStatusCodes.FORBIDDEN,
  },
  [status.UNAUTHENTICATED]: {
    en: 'Unauthenticated',
    de: 'Nicht authentifiziert',
    statusCode: httpStatusCodes.UNAUTHORIZED,
  },
  [status.RESOURCE_EXHAUSTED]: {
    en: 'Resource exhausted',
    de: 'Ressource erschöpft',
    statusCode: httpStatusCodes.INSUFFICIENT_STORAGE,
  },
  [status.FAILED_PRECONDITION]: {
    en: 'Failed precondition',
    de: 'Voraussetzung fehlgeschlagen',
    statusCode: httpStatusCodes.PRECONDITION_FAILED,
  },
  [status.ABORTED]: {
    en: 'Aborted',
    de: 'Abgebrochen',
    statusCode: httpStatusCodes.CONFLICT,
  },
  [status.OUT_OF_RANGE]: {
    en: 'Out of range',
    de: 'Außerhalb des Bereichs',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
  [status.UNIMPLEMENTED]: {
    en: 'Unimplemented',
    de: 'Nicht implementiert',
    statusCode: httpStatusCodes.NOT_IMPLEMENTED,
  },
  [status.INTERNAL]: {
    en: 'Internal error',
    de: 'Interner Fehler',
    statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
  },
  [status.UNAVAILABLE]: {
    en: 'Service unavailable',
    de: 'Dienst nicht verfügbar',
    statusCode: httpStatusCodes.SERVICE_UNAVAILABLE,
  },
  [status.DATA_LOSS]: {
    en: 'Data loss',
    de: 'Datenverlust',
    statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
  },
};

export const defaultGrpcErrorCode: GrpcErrorCode[status] = grpcErrorCodes[status.UNKNOWN];
