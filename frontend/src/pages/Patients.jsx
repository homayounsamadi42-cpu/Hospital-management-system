
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  RefreshCw,
  Users,
  X,
  Pencil,
  Archive,
  Eye,
} from 'lucide-react';
import api from '../services/api';


const translations = {
  en: {
    title: 'Patients',
    subtitle: 'Register and manage hospital patients.',
    add: 'Register patient',
    search: 'Search by name, patient number, or phone...',
    number: 'Patient number',
    first: 'First name',
    last: 'Last name',
    dob: 'Date of birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    blood: 'Blood group',
    emergencyName: 'Emergency contact name',
    emergencyPhone: 'Emergency contact phone',
    allergies: 'Allergies',
    notes: 'Medical notes',
    save: 'Save patient',
    cancel: 'Cancel',
    loading: 'Loading patients...',
    empty: 'No patients found.',
    name: 'Full name',
    actions: 'Patient details',
    success: 'Patient registered successfully.',
    failed: 'Unable to load patients. Check that the Laravel server is running.',
    required: 'Patient number, first name, and last name are required.',
    saving: 'Saving...',
    total: 'patients found',
    edit: 'Edit',
    update: 'Update patient',
    editTitle: 'Edit patient details',
    archive: 'Archive',
    archiveConfirm: 'Are you sure you want to archive this patient?',
    archiveSuccess: 'Patient archived successfully.',
    viewActive: 'Active patients',
    viewArchived: 'Archived patients',
    restore: 'Restore',
    restoreConfirm: 'Restore this patient?',
    restoreSuccess: 'Patient restored successfully.',
    archiveViewEmpty: 'No archived patients found.',
    viewDetails: 'View details',
    patientDetails: 'Patient details',
    personalInfo: 'Personal information',
    contactInfo: 'Contact information',
    medicalInfo: 'Medical information',
    notProvided: 'Not provided',
    close: 'Close',
  },
  fa: {
    title: 'بیماران',
    subtitle: 'ثبت و مدیریت بیماران شفاخانه.',
    add: 'ثبت بیمار',
    search: 'جستجو با نام، شماره بیمار یا تلفن...',
    number: 'شماره بیمار',
    first: 'نام',
    last: 'تخلص',
    dob: 'تاریخ تولد',
    gender: 'جنسیت',
    male: 'مرد',
    female: 'زن',
    other: 'دیگر',
    phone: 'شماره تلفن',
    email: 'ایمیل',
    address: 'آدرس',
    blood: 'گروه خون',
    emergencyName: 'نام شخص تماس اضطراری',
    emergencyPhone: 'تلفن تماس اضطراری',
    allergies: 'حساسیت‌ها',
    notes: 'یادداشت‌های طبی',
    save: 'ثبت بیمار',
    cancel: 'لغو',
    loading: 'در حال بارگذاری بیماران...',
    empty: 'بیماری یافت نشد.',
    name: 'نام کامل',
    actions: 'مشخصات بیمار',
    success: 'بیمار با موفقیت ثبت شد.',
    failed: 'بارگذاری بیماران ناموفق بود. سرور Laravel را بررسی کنید.',
    required: 'شماره بیمار، نام و تخلص الزامی است.',
    saving: 'در حال ذخیره...',
    total: 'بیمار یافت شد',
    edit: 'ویرایش',
    update: 'به‌روزرسانی بیمار',
    editTitle: 'ویرایش مشخصات بیمار',
    archive: 'بایگانی',
    archiveConfirm: 'آیا مطمئن هستید که می‌خواهید این بیمار را بایگانی کنید؟',
    archiveSuccess: 'بیمار با موفقیت بایگانی شد.',
    viewActive: 'بیماران فعال',
    viewArchived: 'بیماران بایگانی‌شده',
    restore: 'بازیابی',
    restoreConfirm: 'آیا این بیمار را بازیابی می‌کنید؟',
    restoreSuccess: 'بیمار با موفقیت بازیابی شد.',
    archiveViewEmpty: 'بیمار بایگانی‌شده‌ای یافت نشد.',
    viewDetails: 'مشاهده جزئیات',
    patientDetails: 'مشخصات بیمار',
    personalInfo: 'اطلاعات شخصی',
    contactInfo: 'اطلاعات تماس',
    medicalInfo: 'اطلاعات طبی',
    notProvided: 'ثبت نشده',
    close: 'بستن',
  },
  ps: {
    title: 'ناروغان',
    subtitle: 'د روغتون ناروغان ثبت او مدیریت کړئ.',
    add: 'ناروغ ثبت کړئ',
    search: 'د نوم، د ناروغ شمېرې یا ټیلیفون له مخې لټون...',
    number: 'د ناروغ شمېره',
    first: 'نوم',
    last: 'تخلص',
    dob: 'د زېږېدو نېټه',
    gender: 'جنسیت',
    male: 'نارینه',
    female: 'ښځینه',
    other: 'نور',
    phone: 'ټیلیفون',
    email: 'برېښنالیک',
    address: 'پته',
    blood: 'د وینې ګروپ',
    emergencyName: 'د بېړني تماس نوم',
    emergencyPhone: 'د بېړني تماس ټیلیفون',
    allergies: 'حساسیتونه',
    notes: 'طبي یادښتونه',
    save: 'ناروغ ثبت کړئ',
    cancel: 'لغوه',
    loading: 'ناروغان پورته کېږي...',
    empty: 'ناروغ ونه موندل شو.',
    name: 'بشپړ نوم',
    actions: 'د ناروغ معلومات',
    success: 'ناروغ په بریالیتوب ثبت شو.',
    failed: 'د ناروغانو پورته کول ناکام شول. د Laravel سرور وګورئ.',
    required: 'د ناروغ شمېره، نوم او تخلص اړین دي.',
    saving: 'زېرمه کېږي...',
    total: 'ناروغان وموندل شول',
    edit: 'سمون',
    update: 'د ناروغ معلومات تازه کړئ',
    editTitle: 'د ناروغ معلومات سمول',
    archive: 'آرشیف',
    archiveConfirm: 'ایا ډاډه یاست چې دا ناروغ آرشیف کړئ؟',
    archiveSuccess: 'ناروغ په بریالیتوب سره آرشیف شو.',
    viewActive: 'فعال ناروغان',
    viewArchived: 'آرشیف شوي ناروغان',
    restore: 'بېرته راګرځول',
    restoreConfirm: 'ایا دا ناروغ بېرته راګرځوئ؟',
    restoreSuccess: 'ناروغ په بریالیتوب بېرته راوګرځول شو.',
    archiveViewEmpty: 'آرشیف شوی ناروغ ونه موندل شو.',
    viewDetails: 'د معلوماتو کتل',
    patientDetails: 'د ناروغ معلومات',
    personalInfo: 'شخصي معلومات',
    contactInfo: 'د اړیکو معلومات',
    medicalInfo: 'طبي معلومات',
    notProvided: 'نه دي ثبت شوي',
    close: 'بندول',
  },
};

const initialForm = {
  patient_number: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  blood_group: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  allergies: '',
  medical_notes: '',
};

const fields = [
  { name: 'patient_number', key: 'number', required: true },
  { name: 'first_name', key: 'first', required: true },
  { name: 'last_name', key: 'last', required: true },
  { name: 'date_of_birth', key: 'dob', type: 'date' },
  { name: 'phone', key: 'phone', type: 'tel' },
  { name: 'email', key: 'email', type: 'email' },
  { name: 'address', key: 'address', wide: true },
  { name: 'emergency_contact_name', key: 'emergencyName' },
  { name: 'emergency_contact_phone', key: 'emergencyPhone', type: 'tel' },
  { name: 'allergies', key: 'allergies', wide: true },
  { name: 'medical_notes', key: 'notes', wide: true },
];

export default function Patients() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
  const t = translations[language] || translations.en;

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingPatient, setEditingPatient] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('active');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint =
      view === 'archived' ? '/patients/archived' : '/patients';

      const response = await api.get(endpoint, {
      params: search.trim() ? { search: search.trim() } : {},
      });

setPatients(response.data.data || []);
    } catch (err) {
      console.error('Failed to load patients:', err);
      setError(t.failed);
    } finally {
      setLoading(false);
    }
    }, [search, view, t.failed]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(patient) {
  setEditingPatient(patient);

  setForm({
    ...initialForm,
    ...patient,
    date_of_birth: patient.date_of_birth
      ? patient.date_of_birth.slice(0, 10)
      : '',
    gender: patient.gender || '',
    blood_group: patient.blood_group || '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
    emergency_contact_name: patient.emergency_contact_name || '',
    emergency_contact_phone: patient.emergency_contact_phone || '',
    allergies: patient.allergies || '',
    medical_notes: patient.medical_notes || '',
  });

  setShowForm(true);
  setError('');
  setMessage('');
}

  async function handleArchive(patient) {
  const confirmed = window.confirm(t.archiveConfirm);

  if (!confirmed) return;

  setError('');
  setMessage('');

  try {
    await api.delete(`/patients/${patient.id}`);

    setMessage(t.archiveSuccess);
    await loadPatients();
  } catch (err) {
    console.error('Failed to archive patient:', err);

    setError(
      err.response?.data?.message ||
      'Unable to archive this patient. Please try again.'
    );
  }
}

  async function handleRestore(patient) {
    if (!window.confirm(t.restoreConfirm)) return;

    setError('');
    setMessage('');

    try {
      await api.patch(`/patients/${patient.id}/restore`);

      setMessage(t.restoreSuccess);
      await loadPatients();
    } catch (err) {
      console.error('Failed to restore patient:', err);

      setError(
        err.response?.data?.message ||
        'Unable to restore this patient. Please try again.'
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.patient_number.trim() || !form.first_name.trim() || !form.last_name.trim()) {
      setError(t.required);
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form };

      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'string') {
          payload[key] = payload[key].trim();
          if (!payload[key]) payload[key] = null;
        }
      });

      const wasEditing = Boolean(editingPatient);
      const response = wasEditing
        ? await api.put(`/patients/${editingPatient.id}`, payload)
        : await api.post('/patients', payload);

      setForm(initialForm);
      setEditingPatient(null);
      setShowForm(false);
      setMessage(response.data.message || (wasEditing ? t.update : t.success));
      await loadPatients();
    } catch (err) {
      console.error('Failed to register patient:', err);

      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || t.failed);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView('active')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === 'active'
              ? 'bg-blue-600 text-white'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {t.viewActive}
        </button>

        <button
          type="button"
          onClick={() => setView('archived')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === 'archived'
              ? 'bg-blue-600 text-white'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {t.viewArchived}
        </button>
      </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError('');
            setMessage('');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? t.cancel : t.add}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            {editingPatient ? t.editTitle : t.add}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label
                key={field.name}
                className={`block text-sm font-medium text-slate-700 ${field.wide ? 'sm:col-span-2 lg:col-span-3' : ''}`}
              >
                {t[field.key]}{field.required ? ' *' : ''}
                <input
                  className={inputClass}
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={updateField}
                  required={field.required}
                />
              </label>
            ))}

            <label className="block text-sm font-medium text-slate-700">
              {t.gender}
              <select className={inputClass} name="gender" value={form.gender} onChange={updateField}>
                <option value="">—</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.blood}
              <select className={inputClass} name="blood_group" value={form.blood_group} onChange={updateField}>
                <option value="">—</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? t.saving : editingPatient ? t.update : t.save}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPatient(null);
                setForm(initialForm);
                setError('');
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <Users size={19} />
            <span className="font-semibold">{patients.length} {t.total}</span>
          </div>

          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1 sm:w-80">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder={t.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label={t.search}
              />
            </div>
            <button
              type="button"
              onClick={loadPatients}
              disabled={loading}
              title="Refresh patients"
              className="rounded-lg border border-slate-300 px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t.number}</th>
                <th className="px-5 py-3 font-semibold">{t.name}</th>
                <th className="px-5 py-3 font-semibold">{t.phone}</th>
                <th className="px-5 py-3 font-semibold">{t.email}</th>
                <th className="px-5 py-3 font-semibold">{t.blood}</th>
                <th className="px-5 py-3 font-semibold">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-500">{t.loading}</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500">{view === 'archived' ? t.archiveViewEmpty : t.empty}</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-blue-700">{patient.patient_number}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{patient.phone || '—'}</td>
                    <td className="px-5 py-4 text-slate-600">{patient.email || '—'}</td>
                    <td className="px-5 py-4 text-slate-600">{patient.blood_group || '—'}</td>
                    <td className="px-5 py-4">
                      {view === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => handleRestore(patient)}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                        >
                          <RefreshCw size={15} />
                          {t.restore}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPatient(patient)}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                          >
                            <Eye size={15} />
                            {t.viewDetails}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(patient)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50"
                          >
                            <Pencil size={15} />
                            {t.edit}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleArchive(patient)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                          >
                            <Archive size={15} />
                            {t.archive}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-details-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 id="patient-details-title" className="text-xl font-bold text-slate-900">
                  {t.patientDetails}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{selectedPatient.patient_number}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                aria-label={t.close}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">{t.personalInfo}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailField label={t.number} value={selectedPatient.patient_number} fallback={t.notProvided} />
                  <DetailField label={t.name} value={`${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim()} fallback={t.notProvided} />
                  <DetailField label={t.dob} value={selectedPatient.date_of_birth?.slice(0, 10)} fallback={t.notProvided} />
                  <DetailField
                    label={t.gender}
                    value={selectedPatient.gender ? ({ male: t.male, female: t.female, other: t.other }[selectedPatient.gender] || selectedPatient.gender) : ''}
                    fallback={t.notProvided}
                  />
                  <DetailField label={t.blood} value={selectedPatient.blood_group} fallback={t.notProvided} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">{t.contactInfo}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailField label={t.phone} value={selectedPatient.phone} fallback={t.notProvided} />
                  <DetailField label={t.email} value={selectedPatient.email} fallback={t.notProvided} />
                  <DetailField label={t.address} value={selectedPatient.address} fallback={t.notProvided} />
                  <DetailField label={t.emergencyName} value={selectedPatient.emergency_contact_name} fallback={t.notProvided} />
                  <DetailField label={t.emergencyPhone} value={selectedPatient.emergency_contact_phone} fallback={t.notProvided} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">{t.medicalInfo}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <DetailField label={t.allergies} value={selectedPatient.allergies} fallback={t.notProvided} />
                  <DetailField label={t.notes} value={selectedPatient.medical_notes} fallback={t.notProvided} />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailField({ label, value, fallback }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value || fallback}
      </p>
    </div>
  );
}
