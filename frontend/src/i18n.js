
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Hospital Management System',
      welcome: 'Welcome',
      subtitle: 'Manage hospital operations in one place.',
      backendStatus: 'Backend connection status',
      language: 'Language',
      dashboard: 'Dashboard',
      patients: 'Patients',
      doctors: 'Doctors',
      appointments: 'Appointments',
      departments: 'Departments',
      billing: 'Billing',
      settings: 'Settings',
      moduleComingSoon: 'This module is under development.',
    },
  },

  fa: {
    translation: {
      appName: 'سیستم مدیریت شفاخانه',
      welcome: 'خوش آمدید',
      subtitle: 'امور شفاخانه را در یک مکان مدیریت کنید.',
      backendStatus: 'وضعیت اتصال به سرور',
      language: 'زبان',
      dashboard: 'داشبورد',
      patients: 'مریضان',
      doctors: 'داکتران',
      appointments: 'قرار ملاقات‌ها',
      departments: 'بخش‌ها',
      billing: 'صورت‌حساب',
      settings: 'تنظیمات',
      moduleComingSoon: 'این بخش در حال توسعه است.',
    },
  },

  ps: {
    translation: {
      appName: 'د روغتون د مدیریت سیسټم',
      welcome: 'ښه راغلاست',
      subtitle: 'د روغتون چارې په یوه ځای کې تنظیم کړئ.',
      backendStatus: 'له سرور سره د اړیکې حالت',
      language: 'ژبه',
      dashboard: 'ډشبورډ',
      patients: 'ناروغان',
      doctors: 'ډاکټران',
      appointments: 'د ملاقاتونو وختونه',
      departments: 'څانګې',
      billing: 'بلونه',
      settings: 'تنظیمات',
      moduleComingSoon: 'دا برخه د جوړېدو په حال کې ده.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
