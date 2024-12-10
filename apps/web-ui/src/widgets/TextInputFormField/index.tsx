import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@clean-stack/components/form';
import { Input } from '@clean-stack/components/input';
import { PasswordInput } from '@clean-stack/components/password-input';
import { Skeleton } from '@clean-stack/components/skeleton';
import { Control, Path } from 'react-hook-form';
interface TextInputFormFieldProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel' | 'search';
  isLoading?: boolean;
  rightElement?: React.ReactNode;
  autoComplete?:
    | 'on'
    | 'off'
    | 'name'
    | 'email'
    | 'username'
    | 'new-password'
    | 'current-password'
    | 'one-time-code'
    | 'organization-title'
    | 'street-address'
    | 'address-line1'
    | 'address-level1'
    | 'country'
    | 'country-name'
    | 'postal-code'
    | 'transaction-currency'
    | 'transaction-amount'
    | 'language'
    | 'bday'
    | 'bday-day'
    | 'bday-month'
    | 'bday-year'
    | 'sex'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-area-code'
    | 'tel-local'
    | 'tel-extension'
    | 'url'
    | 'photo';
}

export function TextInputFormField<T extends Record<string, any>>({
  control,
  name,
  label,
  type = 'text',
  isLoading = false,
  rightElement,
  autoComplete,
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
            {type === 'password' ? (
              <PasswordInput
                autoComplete={autoComplete}
                {...field}
              />
            ) : (
              <Input
                autoComplete={autoComplete}
                {...field}
                type={type}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
