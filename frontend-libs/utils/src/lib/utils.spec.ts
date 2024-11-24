import { cn } from './utils';

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('p-2 bg-red-500', 'p-3')).toBe('bg-red-500 p-3');
    expect(cn('px-2 py-1', 'p-3')).toBe('p-3');
    expect(cn('text-sm font-bold', 'font-normal')).toBe('text-sm font-normal');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
    expect(cn('base', !isActive && 'inactive')).toBe('base');
  });
});
