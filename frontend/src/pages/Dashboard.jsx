
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  ClipboardList,
  Stethoscope,
  Users,
} from 'lucide-react';

const statistics = [
  {
    label: 'patients',
    value: '—',
    description: 'Registered patients',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'doctors',
    value: '—',
    description: 'Medical staff',
    icon: Stethoscope,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'appointments',
    value: '—',
    description: 'Scheduled visits',
    icon: CalendarDays,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'departments',
    value: '—',
    description: 'Hospital departments',
    icon: ClipboardList,
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          {t('welcome')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('subtitle')}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ label, value, description, icon: Icon, color }) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{t(label)}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t('appointments')}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Appointment information will appear here once the appointment module is connected.
        </p>
      </section>
    </div>
  );
}
