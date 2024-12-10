import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@clean-stack/components/form';
import { Input } from '@clean-stack/components/input';
import { Skeleton } from '@clean-stack/components/skeleton';
import { Control, Path } from 'react-hook-form';

interface TextInputFormFieldProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  isLoading?: boolean;
  rightElement?: React.ReactNode;
}

export function TextInputFormField<T extends Record<string, any>>({
  control,
  name,
  label,
  type = 'text',
  isLoading = false,
  rightElement,
}: TextInputFormFieldProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            <FormLabel>{label}</FormLabel>
            {rightElement && <div className="ml-auto">{rightElement}</div>}
          </div>
          <FormControl>
            <Input
              {...field}
              type={type}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
