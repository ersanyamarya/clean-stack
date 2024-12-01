import { Button } from '@clean-stack/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@clean-stack/components/dropdown-menu';
import { useTypeSafeLocalStorage } from '@clean-stack/fe-utils';
import { SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { JSX } from 'react/jsx-runtime';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useTypeSafeLocalStorage('i18nextLng', 'en');
  const { t, i18n } = useTranslation('common');

  const onLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    setSelectedLanguage(lang);
    document.title = t('title');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2">
          <FlagIcon className="h-5 w-5" />
          <span>{languages.find(lang => lang.code === selectedLanguage)?.name}</span>
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-2"
            onSelect={() => onLanguageChange(lang.code)}>
            <CodeXmlIcon className="h-5 w-5" />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CodeXmlIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  );
}

function FlagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line
        x1="4"
        x2="4"
        y1="22"
        y2="15"
      />
    </svg>
  );
}
