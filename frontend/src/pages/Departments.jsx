
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  RefreshCw,
  Building2,
  X,
  Pencil,
  Archive,
} from 'lucide-react';
import api from '../services/api';

const translations = {
  en: {
    title: 'Departments',
    subtitle: 'Create and manage hospital departments.',
    add: 'Add department',
    editTitle: 'Edit department',
    code: 'Department code',
    name: 'Department name',
    description: 'Description',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    head: 'Head of department',
    active: 'Active',
    inactive: 'Inactive',
    save: 'Save department',
    update: 'Update department',
    cancel: 'Cancel',
    search: 'Search by code, name, location, or head...',
    loading: 'Loading departments...',
    empty: 'No departments found.',
    archivedEmpty: 'No archived departments found.',
    activeView: 'Active departments',
    archivedView: 'Archived departments',
    restore: 'Restore',
    archive: 'Archive',
    edit: 'Edit',
    actions: 'Actions',
    status: 'Status',
    total: 'departments found',
    saving: 'Saving...',
    created: 'Department created successfully.',
    updated: 'Department updated successfully.',
    archived: 'Department archived successfully.',
    restored: 'Department restored successfully.',
    failed: 'Unable to load departments. Check the Laravel server.',
    required: 'Department code and name are required.',
    archiveConfirm: 'Are you sure you want to archive this department?',
    restoreConfirm: 'Restore this department?',
    notProvided: 'Not provided',
    codePlaceholder: 'e.g. DEPT-002',
    namePlaceholder: 'e.g. Emergency',
    descriptionPlaceholder: 'Describe the department...',
    locationPlaceholder: 'e.g. Ground floor',
    headPlaceholder: 'e.g. Dr. Ahmad',
    yes: 'Yes',
    no: 'No',
  },
  fa: {
    title: 'بخش‌ها',
    subtitle: 'ایجاد و مدیریت بخش‌های شفاخانه.',
    add: 'افزودن بخش',
    editTitle: 'ویرایش بخش',
    code: 'کد بخش',
    name: 'نام بخش',
    description: 'توضیحات',
    location: 'موقعیت',
    phone: 'شماره تلفن',
    email: 'ایمیل',
    head: 'مسئول بخش',
    active: 'فعال',
    inactive: 'غیرفعال',
    save: 'ذخیره بخش',
    update: 'به‌روزرسانی بخش',
    cancel: 'لغو',
    search: 'جستجو بر اساس کد، نام، موقعیت یا مسئول...',
    loading: 'در حال بارگذاری بخش‌ها...',
    empty: 'بخشی یافت نشد.',
    archivedEmpty: 'بخش بایگانی‌شده‌ای یافت نشد.',
    activeView: 'بخش‌های فعال',
    archivedView: 'بخش‌های بایگانی‌شده',
    restore: 'بازیابی',
    archive: 'بایگانی',
    edit: 'ویرایش',
    actions: 'عملیات',
    status: 'وضعیت',
    total: 'بخش یافت شد',
    saving: 'در حال ذخیره...',
    created: 'بخش با موفقیت ایجاد شد.',
    updated: 'بخش با موفقیت به‌روزرسانی شد.',
    archived: 'بخش با موفقیت بایگانی شد.',
    restored: 'بخش با موفقیت بازیابی شد.',
    failed: 'بارگذاری بخش‌ها ناموفق بود. سرور Laravel را بررسی کنید.',
    required: 'کد و نام بخش الزامی است.',
    archiveConfirm: 'آیا مطمئن هستید که می‌خواهید این بخش را بایگانی کنید؟',
    restoreConfirm: 'آیا این بخش را بازیابی می‌کنید؟',
    notProvided: 'ثبت نشده',
    codePlaceholder: 'مثلاً DEPT-002',
    namePlaceholder: 'مثلاً عاجل',
    descriptionPlaceholder: 'توضیحات بخش...',
    locationPlaceholder: 'مثلاً منزل همکف',
    headPlaceholder: 'مثلاً داکتر احمد',
    yes: 'بلی',
    no: 'نخیر',
  },
  ps: {
    title: 'څانګې',
    subtitle: 'د روغتون څانګې جوړې او مدیریت کړئ.',
    add: 'څانګه اضافه کړئ',
    editTitle: 'د څانګې سمون',
    code: 'د څانګې کوډ',
    name: 'د څانګې نوم',
    description: 'توضیحات',
    location: 'ځای',
    phone: 'ټیلیفون',
    email: 'برېښنالیک',
    head: 'د څانګې مشر',
    active: 'فعاله',
    inactive: 'غیرفعاله',
    save: 'څانګه خوندي کړئ',
    update: 'څانګه تازه کړئ',
    cancel: 'لغوه',
    search: 'د کوډ، نوم، ځای یا مشر له مخې لټون...',
    loading: 'څانګې پورته کېږي...',
    empty: 'څانګه ونه موندل شوه.',
    archivedEmpty: 'آرشیف شوې څانګه ونه موندل شوه.',
    activeView: 'فعالې څانګې',
    archivedView: 'آرشیف شوې څانګې',
    restore: 'بېرته راګرځول',
    archive: 'آرشیف',
    edit: 'سمون',
    actions: 'کړنې',
    status: 'حالت',
    total: 'څانګې وموندل شوې',
    saving: 'خوندي کېږي...',
    created: 'څانګه په بریالیتوب جوړه شوه.',
    updated: 'څانګه په بریالیتوب تازه شوه.',
    archived: 'څانګه په بریالیتوب آرشیف شوه.',
    restored: 'څانګه په بریالیتوب بېرته راوګرځول شوه.',
    failed: 'د څانګو پورته کول ناکام شول. د Laravel سرور وګورئ.',
    required: 'د څانګې کوډ او نوم اړین دي.',
    archiveConfirm: 'ایا ډاډه یاست چې دا څانګه آرشیف کړئ؟',
    restoreConfirm: 'ایا دا څانګه بېرته راګرځوئ؟',
    notProvided: 'نه دي ثبت شوي',
    codePlaceholder: 'لکه DEPT-002',
    namePlaceholder: 'لکه بیړنۍ څانګه',
    descriptionPlaceholder: 'د څانګې توضیحات...',
    locationPlaceholder: 'لکه ځمکنی پوړ',
    headPlaceholder: 'لکه ډاکټر احمد',
    yes: 'هو',
    no: 'نه',
  },
};

const initialForm = {
  department_code: '',
  name: '',
  description: '',
  location: '',
  phone: '',
  email: '',
  head_of_department: '',
  is_active: true,
};

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function Departments() {
  const { i18n } = useTranslation();
  const language = (
    i18n.resolvedLanguage || i18n.language || 'en'
  ).split('-')[0];
  const t = translations[language] || translations.en;

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('active');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint =
        view === 'archived'
          ? '/departments/archived'
          : '/departments';

      const response = await api.get(endpoint);

      // This API returns an array directly.
      // The fallback also supports Laravel's { data: [...] } format.
      const data = response.data;
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setDepartments(records);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError(err.response?.data?.message || t.failed);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [view, t.failed]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return departments;

    return departments.filter((department) =>
      [
        department.department_code,
        department.name,
        department.location,
        department.head_of_department,
        department.email,
        department.phone,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [departments, search]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function openCreateForm() {
    setEditingDepartment(null);
    setForm({ ...initialForm });
    setShowForm(true);
    setError('');
    setMessage('');
  }

  function handleEdit(department) {
    setEditingDepartment(department);
    setForm({
      ...initialForm,
      ...department,
      description: department.description || '',
      location: department.location || '',
      phone: department.phone || '',
      email: department.email || '',
      head_of_department: department.head_of_department || '',
      is_active: Boolean(department.is_active),
    });
    setShowForm(true);
    setError('');
    setMessage('');
  }

  function closeForm() {
    setShowForm(false);
    setEditingDepartment(null);
    setForm({ ...initialForm });
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.department_code.trim() || !form.name.trim()) {
      setError(t.required);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        department_code: form.department_code.trim(),
        name: form.name.trim(),
      };

      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'string') {
          payload[key] = payload[key].trim();

          if (payload[key] === '') {
            payload[key] = null;
          }
        }
      });

      // Keep the checkbox value as a Boolean.
      payload.is_active = Boolean(form.is_active);

      const wasEditing = Boolean(editingDepartment);

      const response = wasEditing
        ? await api.put(
            `/departments/${editingDepartment.id}`,
            payload,
          )
        : await api.post('/departments', payload);

      closeForm();
      setMessage(
        response.data.message ||
          (wasEditing ? t.updated : t.created),
      );

      await loadDepartments();
    } catch (err) {
      console.error('Failed to save department:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
            'Unable to save this department. Please try again.',
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(department) {
    if (!window.confirm(t.archiveConfirm)) return;

    setError('');
    setMessage('');

    try {
      const response = await api.delete(
        `/departments/${department.id}`,
      );

      setMessage(response.data.message || t.archived);
      await loadDepartments();
    } catch (err) {
      console.error('Failed to archive department:', err);
      setError(
        err.response?.data?.message ||
          'Unable to archive this department.',
      );
    }
  }

  async function handleRestore(department) {
    if (!window.confirm(t.restoreConfirm)) return;

    setError('');
    setMessage('');

    try {
      const response = await api.patch(
        `/departments/${department.id}/restore`,
      );

      setMessage(response.data.message || t.restored);
      await loadDepartments();
    } catch (err) {
      console.error('Failed to restore department:', err);
      setError(
        err.response?.data?.message ||
          'Unable to restore this department.',
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setView('active');
              setError('');
              setMessage('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === 'active'
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.activeView}
          </button>

          <button
            type="button"
            onClick={() => {
              setView('archived');
              setError('');
              setMessage('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === 'archived'
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.archivedView}
          </button>

          {view === 'active' && (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              {t.add}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {showForm && view === 'active' && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingDepartment ? t.editTitle : t.add}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              aria-label={t.cancel}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              {t.code} *
              <input
                className={inputClass}
                name="department_code"
                value={form.department_code}
                onChange={updateField}
                placeholder={t.codePlaceholder}
                maxLength={255}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.name} *
              <input
                className={inputClass}
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder={t.namePlaceholder}
                maxLength={255}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.location}
              <input
                className={inputClass}
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder={t.locationPlaceholder}
                maxLength={255}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.phone}
              <input
                className={inputClass}
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                maxLength={50}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.email}
              <input
                className={inputClass}
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                maxLength={255}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.head}
              <input
                className={inputClass}
                name="head_of_department"
                value={form.head_of_department}
                onChange={updateField}
                placeholder={t.headPlaceholder}
                maxLength={255}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-3">
              {t.description}
              <textarea
                className={inputClass}
                name="description"
                value={form.description}
                onChange={updateField}
                placeholder={t.descriptionPlaceholder}
                rows={3}
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={updateField}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {t.active}
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? t.saving
                : editingDepartment
                  ? t.update
                  : t.save}
            </button>

            <button
              type="button"
              onClick={closeForm}
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
            <Building2 size={19} />
            <span className="font-semibold">
              {filteredDepartments.length} {t.total}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1 sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
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
              onClick={loadDepartments}
              disabled={loading}
              title="Refresh departments"
              className="rounded-lg border border-slate-300 px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t.code}</th>
                <th className="px-5 py-3 font-semibold">{t.name}</th>
                <th className="px-5 py-3 font-semibold">{t.location}</th>
                <th className="px-5 py-3 font-semibold">{t.head}</th>
                <th className="px-5 py-3 font-semibold">{t.phone}</th>
                <th className="px-5 py-3 font-semibold">{t.status}</th>
                <th className="px-5 py-3 font-semibold">{t.actions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    {t.loading}
                  </td>
                </tr>
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    {view === 'archived' ? t.archivedEmpty : t.empty}
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-blue-700">
                      {department.department_code}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div>{department.name}</div>
                      {department.description && (
                        <p className="mt-1 max-w-xs truncate text-xs font-normal text-slate-500">
                          {department.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {department.location || '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {department.head_of_department || '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {department.phone || '—'}
                    </td>

                    <td className="px-5 py-4">
                      {view === 'archived' ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {t.archivedView}
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            department.is_active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {department.is_active ? t.active : t.inactive}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {view === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => handleRestore(department)}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                        >
                          <RefreshCw size={15} />
                          {t.restore}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(department)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50"
                          >
                            <Pencil size={15} />
                            {t.edit}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleArchive(department)}
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
    </section>
  );
}
