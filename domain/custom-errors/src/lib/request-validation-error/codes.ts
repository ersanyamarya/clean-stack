import httpStatusCodes from 'http-status-codes';

export const requestValidationErrorCodes = {
  INVALID_QUERY_PARAMS: {
    en: 'Invalid query parameters',
    de: 'Ungültige Abfrageparameter',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
  INVALID_ROUTE_PARAMS: {
    en: 'Invalid route parameters',
    de: 'Ungültige Routenparameter',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
  INVALID_REQUEST_BODY: {
    en: 'Invalid request body',
    de: 'Ungültiger Anforderungskörper',
    statusCode: httpStatusCodes.BAD_REQUEST,
  },
};

export type REQUEST_VALIDATION_ERROR_CODES = keyof typeof requestValidationErrorCodes;
