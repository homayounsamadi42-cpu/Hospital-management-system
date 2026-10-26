
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Archive,
  RotateCcw,
  X,
  Stethoscope,
  RefreshCw,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const translations = {
  en: {
    title: 'Doctors',
    subtitle: 'Manage your hospital medical staff.',
    add: 'Add Doctor',
    search: 'Search by name, ID, phone, or specialization...',
    active: 'Active Doctors',
    archived: 'Archived Doctors',
    doctorNumber: 'Doctor ID',
    firstName: 'First Name',
    lastName: 'Last Name',
    specialization: 'Specialization',
    phone: 'Phone',
    email: 'Email',
    gender: 'Gender',
    qualification: 'Qualification',
    license: 'License Number',
    department: 'Department',
    fee: 'Consultation Fee',
    address: 'Address',
    actions: 'Actions',
    save: 'Save Doctor',
    update: 'Update Doctor',
    cancel: 'Cancel',
    edit: 'Edit',
    archive: 'Archive',
    restore: 'Restore',
    noDoctors: 'No doctors found.',
    loading: 'Loading doctors...',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    required: 'Please fill in all required fields.',
    loadError: 'Could not load doctors.',
    saveError: 'Could not save the doctor.',
    actionError: 'The action could not be completed.',
    saved: 'Doctor saved successfully.',
    archivedSuccess: 'Doctor archived successfully.',
    restoredSuccess: 'Doctor restored successfully.',
    confirmArchive: 'Are you sure you want to archive this doctor?',
    activeCount: 'Active doctors',
    archivedCount: 'Archived doctors',
    close: 'Close',
  },
  fa: {
    title: 'داکتران',
    subtitle: 'مدیریت کارمندان طبی شفاخانه.',
    add: 'افزودن داکتر',
    search: 'جستجو بر اساس نام، شناسه، شماره تماس یا تخصص...',
    active: 'داکتران فعال',
    archived: 'داکتران آرشیف‌شده',
    doctorNumber: 'شماره داکتر',
    firstName: 'نام',
    lastName: 'تخلص',
    specialization: 'تخصص',
    phone: 'شماره تماس',
    email: 'ایمیل',
    gender: 'جنسیت',
    qualification: 'مدرک تحصیلی',
    license: 'شماره جواز',
    department: 'بخش',
    fee: 'فیس معاینه',
    address: 'آدرس',
    actions: 'عملیات',
    save: 'ثبت داکتر',
    update: 'به‌روزرسانی داکتر',
    cancel: 'لغو',
    edit: 'ویرایش',
    archive: 'آرشیف',
    restore: 'بازیابی',
    noDoctors: 'داکتری پیدا نشد.',
    loading: 'در حال بارگذاری داکتران...',
    male: 'مرد',
    female: 'زن',
    other: 'سایر',
    required: 'لطفاً تمام فیلدهای ضروری را تکمیل کنید.',
    loadError: 'بارگذاری داکتران انجام نشد.',
    saveError: 'ذخیره داکتر انجام نشد.',
    actionError: 'اجرای عملیات انجام نشد.',
    saved: 'اطلاعات داکتر با موفقیت ذخیره شد.',
    archivedSuccess: 'داکتر به آرشیف انتقال یافت.',
    restoredSuccess: 'داکتر با موفقیت بازیابی شد.',
    confirmArchive: 'آیا مطمئن هستید که می‌خواهید این داکتر را آرشیف کنید؟',
    activeCount: 'داکتران فعال',
    archivedCount: 'داکتران آرشیف‌شده',
    close: 'بستن',
  },
  ps: {
    title: 'ډاکټران',
    subtitle: 'د روغتون د طبي کارکوونکو مدیریت.',
    add: 'ډاکټر زیات کړئ',
    search: 'د نوم، پېژندشمېرې، ټیلیفون یا تخصص له مخې لټون...',
    active: 'فعال ډاکټران',
    archived: 'آرشیف شوي ډاکټران',
    doctorNumber: 'د ډاکټر شمېره',
    firstName: 'نوم',
    lastName: 'تخلص',
    specialization: 'تخصص',
    phone: 'د ټیلیفون شمېره',
    email: 'برېښنالیک',
    gender: 'جنسیت',
    qualification: 'تحصیلي درجه',
    license: 'د جواز شمېره',
    department: 'څانګه',
    fee: 'د معاینې فیس',
    address: 'پته',
    actions: 'کړنې',
    save: 'ډاکټر ثبت کړئ',
    update: 'ډاکټر تازه کړئ',
    cancel: 'لغوه',
    edit: 'سمون',
    archive: 'آرشیف',
    restore: 'بېرته راګرځول',
    noDoctors: 'ډاکټر ونه موندل شو.',
    loading: 'ډاکټران بارېږي...',
    male: 'نارینه',
    female: 'ښځینه',
    other: 'نور',
    required: 'مهرباني وکړئ اړین معلومات بشپړ کړئ.',
    loadError: 'د ډاکټرانو معلومات نه شول ترلاسه کېدای.',
    saveError: 'ډاکټر نه شو ثبتېدای.',
    actionError: 'کړنه ترسره نه شوه.',
    saved: 'د ډاکټر معلومات په بریالیتوب ثبت شول.',
    archivedSuccess: 'ډاکټر آرشیف شو.',
    restoredSuccess: 'ډاکټر بېرته را وګرځول شو.',
    confirmArchive: 'ایا غواړئ دا ډاکټر آرشیف کړئ؟',
    activeCount: 'فعال ډاکټران',
    archivedCount: 'آرشیف شوي ډاکټران',
    close: 'بندول',
  },
};

const emptyForm = {
  doctor_number: '',
  first_name: '',
  last_name: '',
  specialization: '',
  phone: '',
  email: '',
  gender: '',
  qualification: '',
  license_number: '',
  department: '',
  consultation_fee: '0',
  address: '',
};

const fields = [
  { name: 'doctor_number', key: 'doctorNumber', required: true },
  { name: 'first_name', key: 'firstName', required: true },
  { name: 'last_name', key: 'lastName', required: true },
  { name: 'specialization', key: 'specialization', required: true },
  { name: 'phone', key: 'phone' },
  { name: 'email', key: 'email', type: 'email' },
  { name: 'qualification', key: 'qualification' },
  { name: 'license_number', key: 'license' },
  { name: 'department', key: 'department' },
  { name: 'consultation_fee', key: 'fee', type: 'number' },
  { name: 'address', key: 'address', full: true },
];

function getErrorMessage(error, fallback) {
  const errors = error?.response?.data?.errors;

  if (errors) {
    return Object.values(errors).flat().join(' ');
  }

  return error?.response?.data?.message || fallback;
}

export default function Doctors() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const t = translations[language] || translations.en;

  const [doctors, setDoctors] = useState([]);
  const [archivedDoctors, setArchivedDoctors] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const [activeResponse, archivedResponse] = await Promise.all([
        api.get('/doctors'),
        api.get('/doctors/archived'),
      ]);

      setDoctors(activeResponse.data.data || []);
      setArchivedDoctors(archivedResponse.data.data || []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, t.loadError));
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const visibleDoctors = useMemo(() => {
    const source = showArchived ? archivedDoctors : doctors;
    const term = search.trim().toLowerCase();

    if (!term) return source;

    return source.filter((doctor) =>
      [
        doctor.doctor_number,
        doctor.first_name,
        doctor.last_name,
        doctor.specialization,
        doctor.phone,
      ].some((value) => String(value || '').toLowerCase().includes(term)),
    );
  }, [doctors, archivedDoctors, showArchived, search]);

  function openAddModal() {
    setEditingDoctor(null);
    setForm({ ...emptyForm });
    setNotice('');
    setErrorMessage('');
    setModalOpen(true);
  }

  function openEditModal(doctor) {
    setEditingDoctor(doctor);
    setForm({
      ...emptyForm,
      ...doctor,
      consultation_fee: doctor.consultation_fee ?? '0',
      address: doctor.address ?? '',
    });
    setNotice('');
    setErrorMessage('');
    setModalOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setNotice('');

    const payload = { ...form };

    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    payload.consultation_fee = Number(payload.consultation_fee || 0);

    for (const key of [
      'phone',
      'email',
      'gender',
      'qualification',
      'license_number',
      'department',
      'address',
    ]) {
      if (!payload[key]) payload[key] = null;
    }

    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, payload);
      } else {
        await api.post('/doctors', payload);
      }

      setModalOpen(false);
      setNotice(t.saved);
      await loadDoctors();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, t.saveError));
    } finally {
      setSaving(false);
    }
  }

  async function archiveDoctor(doctor) {
    if (!window.confirm(t.confirmArchive)) return;

    setErrorMessage('');
    setNotice('');

    try {
      await api.delete(`/doctors/${doctor.id}`);
      setNotice(t.archivedSuccess);
      await loadDoctors();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, t.actionError));
    }
  }

  async function restoreDoctor(doctor) {
    setErrorMessage('');
    setNotice('');

    try {
      await api.patch(`/doctors/${doctor.id}/restore`);
      setNotice(t.restoredSuccess);
      await loadDoctors();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, t.actionError));
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Stethoscope size={25} />
            </span>
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{t.activeCount}</p>
            <Users className="text-blue-600" size={21} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-800">
            {doctors.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{t.archivedCount}</p>
            <Archive className="text-amber-600" size={21} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-800">
            {archivedDoctors.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                !showArchived
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.active}
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                showArchived
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.archived}
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1 lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.search}
                className={`${inputClass} pl-10`}
              />
            </div>
            <button
              type="button"
              onClick={loadDoctors}
              title="Refresh"
              className="rounded-lg border border-slate-200 px-3 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {notice && (
          <div className="m-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {notice}
          </div>
        )}

        {errorMessage && (
          <div className="m-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            {t.loading}
          </div>
        ) : visibleDoctors.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            {t.noDoctors}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t.doctorNumber}</th>
                  <th className="px-5 py-4">{t.firstName}</th>
                  <th className="px-5 py-4">{t.lastName}</th>
                  <th className="px-5 py-4">{t.specialization}</th>
                  <th className="px-5 py-4">{t.phone}</th>
                  <th className="px-5 py-4">{t.department}</th>
                  <th className="px-5 py-4">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-blue-700">
                      {doctor.doctor_number}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {doctor.first_name}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {doctor.last_name}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {doctor.specialization}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {doctor.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {doctor.department || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {showArchived ? (
                          <button
                            type="button"
                            onClick={() => restoreDoctor(doctor)}
                            title={t.restore}
                            className="rounded-lg p-2 text-green-700 hover:bg-green-50"
                          >
                            <RotateCcw size={17} />
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(doctor)}
                              title={t.edit}
                              className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => archiveDoctor(doctor)}
                              title={t.archive}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            >
                              <Archive size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          {visibleDoctors.length} /{' '}
          {showArchived ? archivedDoctors.length : doctors.length}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-form-title"
            className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2
                id="doctor-form-title"
                className="text-lg font-bold text-slate-800"
              >
                {editingDoctor ? t.update : t.add}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label={t.close}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className={`block ${field.full ? 'sm:col-span-2' : ''}`}
                  >
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      {t[field.key]}
                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </span>
                    {field.name === 'address' ? (
                      <textarea
                        name={field.name}
                        value={form[field.name] ?? ''}
                        onChange={handleChange}
                        rows={2}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        name={field.name}
                        type={field.type || 'text'}
                        value={form[field.name] ?? ''}
                        onChange={handleChange}
                        required={field.required}
                        min={field.type === 'number' ? '0' : undefined}
                        step={field.type === 'number' ? '0.01' : undefined}
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t.gender}
                  </span>
                  <select
                    name="gender"
                    value={form.gender || ''}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </label>
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t.loading : editingDoctor ? t.update : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
