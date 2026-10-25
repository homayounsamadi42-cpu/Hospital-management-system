
import { useTranslation } from 'react-i18next';

export default function ModulePlaceholder({ titleKey }) {
  const { t } = useTranslation();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        {t(titleKey)}
      </h1>
      <p className="mt-3 text-slate-600">
        {t('moduleComingSoon')}
      </p>
    </section>
  );
}
