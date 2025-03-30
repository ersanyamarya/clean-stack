import { Logger } from '../utils/logger';

export type Module<OptionsT, ResultT> = {
  name: string;
  description: string;
  run: (options: OptionsT) => Promise<ResultT>;
  validate: (options: OptionsT) => Promise<boolean>;
};

export class ModuleError extends Error {
  public moduleName: string;
  public where: string | undefined;
  public context: Record<string, unknown>;

  constructor(moduleName: string, message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ModuleError';
    Object.setPrototypeOf(this, ModuleError.prototype);
    Error.captureStackTrace(this, this.constructor);

    const stack = this.stack?.split('\n');
    const where = stack?.[1]?.trim().replace('at ', '');

    this.moduleName = moduleName;
    this.context = context;
    this.where = where;
  }
  toString(): string {
    return `${this.name}: ${this.message} (Module: ${this.moduleName})`;
  }
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      moduleName: this.moduleName,
      context: this.context,
    };
  }

  toJSONString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  toError(): Error {
    return new Error(this.toString());
  }
}

export const isModuleError = (error: unknown): error is ModuleError => {
  return error instanceof ModuleError;
};

export type ModuleFactory<OptionsT, ResultT> = (logger: Logger) => Module<OptionsT, ResultT>;
