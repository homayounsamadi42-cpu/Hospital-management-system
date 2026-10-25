
import { Bell, Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Topbar() {
  const { t } = useTranslation();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => window.dispatchEvent(new Event('hospital:toggle-sidebar'))}
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t('dashboard')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:flex">
          <Search size={17} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
            className="w-28 bg-transparent text-sm outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
        >
          <Bell size={19} />
        </button>

        <LanguageSelector />
      </div>
    </header>
  );
}
