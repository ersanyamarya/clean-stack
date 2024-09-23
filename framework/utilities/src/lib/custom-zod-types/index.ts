import { z } from 'zod';

/* This code snippet is defining a Zod schema called `stringArrayTransformSchema` for transforming a
string into an array of strings. Here's a breakdown of what each part of the schema does: */
export const stringArrayTransformSchema = z
  .string()
  .transform(val => {
    if (val === '') return [];
    return val.split(',').map(item => item.trim());
  })
  .refine(val => Array.isArray(val), { message: 'Invalid string array' });

/* This code snippet is defining a Zod schema called `numberTransformSchema` for transforming a string
into a number. Here's a breakdown of what each part of the schema does: */
export const numberTransformSchema = z
  .string()
  .regex(/^\d+$/, { message: 'Invalid number' })
  .transform(val => parseInt(val, 10))
  .refine(val => !isNaN(val), { message: 'Invalid number' });

/* This code snippet is defining a Zod schema called `booleanTransformSchema` that transforms a string
into a boolean value. Here's a breakdown of what each part of the schema does: */
export const booleanTransformSchema = z
  .string()
  .transform(val => {
    if (val === 'true' || val === 'True') return true;
    if (val === 'false' || val === 'False') return false;
    return val;
  })
  .refine(val => typeof val === 'boolean', { message: 'Invalid boolean' });
