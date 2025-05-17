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

export const numberTransformSchema = z.coerce.number({
  invalid_type_error: 'Invalid number',
  required_error: 'Number is required',
});

export const booleanTransformSchema = z
  .string()
  .transform(val => {
    if (val === 'true' || val === 'True') return true;
    if (val === 'false' || val === 'False') return false;
    // if (val === 'yes' || val === 'Yes') return true;
    return val;
  })
  .refine(val => typeof val === 'boolean', { message: 'Invalid boolean' });
