import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import useAuthState from '../../global-state';
export function useLoginForm() {
  const { t } = useTranslation('authentication');

  const { loginWithEmail, isAuthLoading } = useAuthState();

  const loginFormSchema = z.object({
    email: getEmailSchema(t),
    password: getPasswordSchema(t),
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: 'er.sanyam.arya@gmail.com',
      password: 'SuperSonic@2024',
    },
  });

  async function onLogin(values: z.infer<typeof loginFormSchema>) {
    const { email, password } = values;
    await loginWithEmail(email, password, {
      onSuccess: () => {
        window.location.href = '/';
      },
      onError: error => {
        loginForm.reset();
      },
    });
  }

  return { loginForm, onLogin, isAuthLoading, loginFormSchema };
}

export function useRegister() {
  const { t } = useTranslation('authentication');
  const formSchema = z.object({
    name: z.string({ message: t('nameRequired') }),
    email: getEmailSchema(t),
    password: getPasswordSchema(t),
    confirmPassword: z.string({ message: t('confirmPasswordRequired') }),
  });

  const registerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onRegister(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return { registerForm, onRegister };
}

function getEmailSchema(t: TFunction<'authentication'>) {
  return z
    .string({})
    .min(1, { message: t('emailRequired') })
    .email({
      message: t('emailInvalid'),
    });
}

function getPasswordSchema(t: TFunction<'authentication'>) {
  return z
    .string({ message: t('passwordRequired') })
    .min(6, {
      message: t('passwordMinLength'),
    })
    .regex(/[A-Z]/, {
      message: t('passwordOneUppercase'),
    })
    .regex(/[a-z]/, {
      message: t('passwordOneLowercase'),
    })
    .regex(/[0-9]/, {
      message: t('passwordOneNumber'),
    })
    .regex(/[^A-Za-z0-9]/, {
      message: t('passwordOneSpecialCharacter'),
    });
}
