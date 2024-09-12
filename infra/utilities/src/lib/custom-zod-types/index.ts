import { z } from 'zod';

export const stringArrayTransformSchema = z
  .string()
  .transform(val => {
    if (val === '') return [];
    return val.split(',').map(item => item.trim());
  })
  .refine(val => Array.isArray(val), { message: 'Invalid string array' });

export const numberTransformSchema = z
  .string()
  .regex(/^\d+$/, { message: 'Invalid number' })
  .transform(val => parseInt(val, 10))
  .refine(val => !isNaN(val), { message: 'Invalid number' });

export const booleanTransformSchema = z
  .string()
  .transform(val => {
    if (val === 'true' || val === 'True') return true;
    if (val === 'false' || val === 'False') return false;
    return val;
  })
  .refine(val => typeof val === 'boolean', { message: 'Invalid boolean' });
