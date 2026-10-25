
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from './services/api';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import ModulePlaceholder from './pages/ModulePlaceholder';
import Patients from './pages/Patients';

const languages = {
  en: 'ltr',
  fa: 'rtl',
  ps: 'rtl',
};

function RoutedApp() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = i18n.resolvedLanguage || i18n.language;
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language] || 'ltr';
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    api.get('/health').catch((error) => {
      console.error('Laravel API connection failed:', error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route
              path="/doctors"
              element={<ModulePlaceholder titleKey="doctors" />}
            />
            <Route
              path="/appointments"
              element={<ModulePlaceholder titleKey="appointments" />}
            />
            <Route
              path="/departments"
              element={<ModulePlaceholder titleKey="departments" />}
            />
            <Route
              path="/billing"
              element={<ModulePlaceholder titleKey="billing" />}
            />
            <Route
              path="/settings"
              element={<ModulePlaceholder titleKey="settings" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}
