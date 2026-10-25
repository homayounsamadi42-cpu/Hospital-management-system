
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fa', label: 'دری' },
  { code: 'ps', label: 'پښتو' },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">{t('language')}</span>
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
        aria-label={t('language')}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
