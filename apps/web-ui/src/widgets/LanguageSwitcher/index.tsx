import { Button } from '@clean-stack/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@clean-stack/components/dropdown-menu';
import { FlagIcon, GlobeIcon } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिंदी' },
];

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('i18nextLng') || 'en';
    }
    return 'en';
  });
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
    document.title = t('title');
  }, [selectedLanguage, t]);

  const onLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-4">
          <GlobeIcon className="h-5 w-5" />
          <span>{languages.find(lang => lang.code === selectedLanguage)?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center gap-2 ${lang.code === selectedLanguage ? 'bg-accent text-accent-foreground' : ''}`}
            onSelect={() => onLanguageChange(lang.code)}>
            <FlagIcon className="h-4 w-4" />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
