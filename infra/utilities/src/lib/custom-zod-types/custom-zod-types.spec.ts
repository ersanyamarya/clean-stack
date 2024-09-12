import { describe, expect, it } from 'vitest';
import { booleanTransformSchema, numberTransformSchema, stringArrayTransformSchema } from '.';
// Define a schema with Zod

// Set up the test suite
describe('Custom Zod types', () => {
  describe('configNumberSchema', () => {
    it('should parse valid numeric strings', () => {
      const result = numberTransformSchema.safeParse('123');
      expect(result.success).toBe(true);
      expect(result.data).toBe(123);
    });

    it('should fail on non-numeric strings', () => {
      const result = numberTransformSchema.safeParse('abc');
      expect(result.success).toBe(false);
    });

    it('should fail on negative numbers', () => {
      const result = numberTransformSchema.safeParse('-123');
      expect(result.success).toBe(false);
    });
  });
  describe('configBooleanSchema', () => {
    it('should parse "true" and "True" as true', () => {
      expect(booleanTransformSchema.safeParse('true').data).toBe(true);
      expect(booleanTransformSchema.safeParse('True').data).toBe(true);
    });

    it('should parse "false" and "False" as false', () => {
      expect(booleanTransformSchema.safeParse('false').data).toBe(false);
      expect(booleanTransformSchema.safeParse('False').data).toBe(false);
    });

    it('should fail on non-boolean strings', () => {
      const result = booleanTransformSchema.safeParse('yes');
      expect(result.success).toBe(false);
    });
  });
  describe('stringArrayTransformSchema', () => {
    it('should parse a comma-separated string into an array', () => {
      const result = stringArrayTransformSchema.safeParse('item1,item2,item3');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(['item1', 'item2', 'item3']);
    });

    it('should handle leading and trailing spaces', () => {
      const result = stringArrayTransformSchema.safeParse(' item1 , item2 , item3 ');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(['item1', 'item2', 'item3']);
    });

    it('should return an empty array for an empty string', () => {
      const result = stringArrayTransformSchema.safeParse('');
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle single item without commas', () => {
      const result = stringArrayTransformSchema.safeParse('singleItem');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(['singleItem']);
    });

    it('should throw an error for malformed input', () => {
      const result = stringArrayTransformSchema.safeParse(null);
      expect(result.success).toBe(false);
    });
  });
});
