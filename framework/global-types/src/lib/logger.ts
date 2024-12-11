/**
 * The above type defines a Logger object with methods for logging information, warnings, errors, and
 * debugging messages.
 * @property info - The `info` property in the `Logger` type is a function that takes an arbitrary
 * number of parameters of type `unknown` and returns `void`. This function is typically used to log
 * informational messages.
 * @property warn - The `warn` property in the `Logger` type is a function that accepts any number of
 * parameters of type `unknown` and returns `void`. This function is typically used to log warning
 * messages in an application.
 * @property error - The `Logger` type you've defined includes four properties: `info`, `warn`,
 * `error`, and `debug`, each of which is a function that accepts a variable number of parameters of
 * type `unknown` and returns `void`.
 * @property debug - The `debug` property in the `Logger` type represents a function that accepts an
 * arbitrary number of parameters of type `unknown` and returns `void`. This function is typically used
 * for logging debug messages or information during development to help with troubleshooting and
 * debugging.
 */
export type Logger = {
  child(arg0: Record<string, unknown>): Logger;
  info: (...params: unknown[]) => void;
  warn: (...params: unknown[]) => void;
  error: (...params: unknown[]) => void;
  debug: (...params: unknown[]) => void;
};
