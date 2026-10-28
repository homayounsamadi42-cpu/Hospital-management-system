
import { NavLink } from 'react-router-dom';
import { Pill } from 'lucide-react';
import {
  Activity,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navigation = [
  { label: 'dashboard', path: '/', icon: LayoutDashboard },
  { label: 'patients', path: '/patients', icon: Users },
  { label: 'doctors', path: '/doctors', icon: Stethoscope },
  { label: 'appointments', path: '/appointments', icon: CalendarDays },
  { label: 'departments', path: '/departments', icon: ClipboardList },
  { label: 'billing', path: '/billing', icon: CreditCard },
  { label: 'pharmacy',path: '/pharmacy',icon: Pill,},
  { label: 'settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-e">
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="rounded-xl bg-blue-600 p-2 text-white">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">{t('appName')}</h1>
          <p className="text-xs text-slate-500">Hospital Portal</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto md:flex-col">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon size={19} />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
