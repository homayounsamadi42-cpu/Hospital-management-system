
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarClock,
  History,
  CheckCircle2,
  LoaderCircle,
  Package,
  PackageX,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const translations = {
  en: {
    title: 'Pharmacy Management',
    subtitle: 'Manage medicines, stock levels, and expiry dates.',
    total: 'Total medicines',
    lowStock: 'Low stock',
    expiring: 'Expiring soon',
    outOfStock: 'Out of stock',
    search: 'Search by medicine name or code...',
    add: 'Add medicine',
    edit: 'Edit medicine',
    name: 'Medicine name',
    code: 'Medicine code',
    category: 'Category',
    strength: 'Strength',
    form: 'Dosage form',
    manufacturer: 'Manufacturer',
    supplier: 'Supplier',
    quantity: 'Quantity',
    reorder: 'Reorder level',
    purchase: 'Purchase price',
    selling: 'Selling price',
    expiry: 'Expiry date',
    batch: 'Batch number',
    description: 'Description',
    actions: 'Actions',
    save: 'Save medicine',
    cancel: 'Cancel',
    editAction: 'Edit',
    archive: 'Archive',
    restore: 'Restore',
    archived: 'Archived medicines',
    active: 'Active medicines',
    stockStatus: 'Stock status',
    inStock: 'In stock',
    low: 'Low stock',
    expired: 'Expired',
    noMedicines: 'No medicines found.',
    loading: 'Loading medicines...',
    loadError: 'Could not load pharmacy data.',
    saveError: 'Could not save medicine.',
    saved: 'Medicine saved successfully.',
    archivedSuccess: 'Medicine archived successfully.',
    restoredSuccess: 'Medicine restored successfully.',
    confirmArchive: 'Archive this medicine?',
    required: 'Please fill in the medicine code and name.',
    currency: 'Currency',
    noExpiry: 'No expiry date',
    expiredSoon: 'Expired',
    days: 'days',
    stockIn: 'Stock In',
    stockOut: 'Stock Out',
    adjustmentHistory: 'Stock Adjustment History',
    adjustmentType: 'Adjustment type',
    adjustmentQuantity: 'Adjustment quantity',
    reason: 'Reason',
    reference: 'Reference number',
    submitAdjustment: 'Save adjustment',
    stockInReason: 'New stock received',
    stockOutReason: 'Medicine dispensed',
    before: 'Before',
    after: 'After',
    noAdjustments: 'No stock adjustments recorded yet.',
    adjustmentSaved: 'Stock adjustment saved successfully.',
    adjustmentError: 'Could not save stock adjustment.',
    medicine: 'Medicine',
    date: 'Date',
  },
  fa: {
    title: 'مدیریت دواخانه',
    subtitle: 'مدیریت دواها، موجودی و تاریخ انقضا.',
    total: 'مجموع دواها',
    lowStock: 'موجودی کم',
    expiring: 'نزدیک به انقضا',
    outOfStock: 'تمام‌شده',
    search: 'جستجو بر اساس نام یا کد دوا...',
    add: 'افزودن دوا',
    edit: 'ویرایش دوا',
    name: 'نام دوا',
    code: 'کد دوا',
    category: 'دسته‌بندی',
    strength: 'قدرت دوا',
    form: 'شکل دوا',
    manufacturer: 'تولیدکننده',
    supplier: 'تأمین‌کننده',
    quantity: 'تعداد',
    reorder: 'حد سفارش مجدد',
    purchase: 'قیمت خرید',
    selling: 'قیمت فروش',
    expiry: 'تاریخ انقضا',
    batch: 'شماره بچ',
    description: 'توضیحات',
    actions: 'عملیات',
    save: 'ذخیره دوا',
    cancel: 'لغو',
    editAction: 'ویرایش',
    archive: 'بایگانی',
    restore: 'بازیابی',
    archived: 'دواهای بایگانی‌شده',
    active: 'دواهای فعال',
    stockStatus: 'وضعیت موجودی',
    inStock: 'موجود',
    low: 'موجودی کم',
    expired: 'منقضی‌شده',
    noMedicines: 'دوا پیدا نشد.',
    loading: 'در حال بارگذاری دواها...',
    loadError: 'بارگذاری اطلاعات دواخانه ناموفق بود.',
    saveError: 'ذخیره دوا ناموفق بود.',
    saved: 'دوا با موفقیت ذخیره شد.',
    archivedSuccess: 'دوا با موفقیت بایگانی شد.',
    restoredSuccess: 'دوا با موفقیت بازیابی شد.',
    confirmArchive: 'آیا این دوا بایگانی شود؟',
    required: 'لطفاً کد و نام دوا را وارد کنید.',
    currency: 'واحد پول',
    noExpiry: 'بدون تاریخ انقضا',
    expiredSoon: 'منقضی‌شده',
    days: 'روز',
    stockIn: 'افزودن به موجودی',
    stockOut: 'کاهش موجودی',
    adjustmentHistory: 'تاریخچه تغییرات موجودی',
    adjustmentType: 'نوع تغییر',
    adjustmentQuantity: 'مقدار تغییر',
    reason: 'دلیل',
    reference: 'شماره مرجع',
    submitAdjustment: 'ذخیره تغییر',
    stockInReason: 'دریافت موجودی جدید',
    stockOutReason: 'تحویل دوا',
    before: 'قبل',
    after: 'بعد',
    noAdjustments: 'هنوز تغییری در موجودی ثبت نشده است.',
    adjustmentSaved: 'تغییر موجودی با موفقیت ذخیره شد.',
    adjustmentError: 'ذخیره تغییر موجودی ناموفق بود.',
    medicine: 'دوا',
    date: 'تاریخ',
  },
  ps: {
    title: 'د درملتون مدیریت',
    subtitle: 'درمل، موجودي او د ختمېدو نېټې اداره کړئ.',
    total: 'ټول درمل',
    lowStock: 'کم موجودي',
    expiring: 'د ختمېدو نېټه نږدې',
    outOfStock: 'ذخیره ختمه ده',
    search: 'د درمل نوم یا کوډ ولټوئ...',
    add: 'درمل زیات کړئ',
    edit: 'درمل سم کړئ',
    name: 'د درمل نوم',
    code: 'د درمل کوډ',
    category: 'کټګوري',
    strength: 'قوت',
    form: 'د درمل بڼه',
    manufacturer: 'جوړوونکی',
    supplier: 'عرضه کوونکی',
    quantity: 'اندازه',
    reorder: 'د بیا فرمایش حد',
    purchase: 'د پېرود بیه',
    selling: 'د پلور بیه',
    expiry: 'د ختمېدو نېټه',
    batch: 'د بچ شمېره',
    description: 'توضیحات',
    actions: 'کړنې',
    save: 'درمل خوندي کړئ',
    cancel: 'لغوه',
    editAction: 'سمون',
    archive: 'آرشیف',
    restore: 'بیا راګرځول',
    archived: 'آرشیف شوي درمل',
    active: 'فعال درمل',
    stockStatus: 'د موجودۍ حالت',
    inStock: 'موجود',
    low: 'کم موجودي',
    expired: 'ختم شوي',
    noMedicines: 'درمل ونه موندل شول.',
    loading: 'درمل بارېږي...',
    loadError: 'د درملتون معلومات نه شول ترلاسه کېدای.',
    saveError: 'درمل خوندي نه شول.',
    saved: 'درمل په بریالیتوب خوندي شول.',
    archivedSuccess: 'درمل په بریالیتوب آرشیف شول.',
    restoredSuccess: 'درمل په بریالیتوب بېرته راستانه شول.',
    confirmArchive: 'دا درمل آرشیف کړئ؟',
    required: 'د درمل کوډ او نوم ولیکئ.',
    currency: 'پولي واحد',
    noExpiry: 'د ختمېدو نېټه نشته',
    expiredSoon: 'ختم شوي',
    days: 'ورځې',
    stockIn: 'موجودي زیاته کړئ',
    stockOut: 'موجودي کمه کړئ',
    adjustmentHistory: 'د موجودۍ د بدلونونو تاریخچه',
    adjustmentType: 'د بدلون ډول',
    adjustmentQuantity: 'د بدلون اندازه',
    reason: 'لامل',
    reference: 'د مرجع شمېره',
    submitAdjustment: 'بدلون خوندي کړئ',
    stockInReason: 'نوې موجودي ترلاسه شوه',
    stockOutReason: 'درمل ورکړل شول',
    before: 'مخکې',
    after: 'وروسته',
    noAdjustments: 'تر اوسه د موجودۍ بدلون نه دی ثبت شوی.',
    adjustmentSaved: 'د موجودۍ بدلون په بریالیتوب خوندي شو.',
    adjustmentError: 'د موجودۍ بدلون خوندي نه شو.',
    medicine: 'درمل',
    date: 'نېټه',
  },
};

const emptyForm = {
  medicine_code: '',
  name: '',
  category: '',
  strength: '',
  dosage_form: '',
  manufacturer: '',
  supplier: '',
  quantity: '0',
  reorder_level: '10',
  purchase_price: '0',
  selling_price: '0',
  currency: 'AFN',
  expiry_date: '',
  batch_number: '',
  description: '',
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

function getDateValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function getStockStatus(medicine, t) {
  if (
    medicine.expiry_date &&
    getDateValue(medicine.expiry_date) <
      new Date().toISOString().slice(0, 10)
  ) {
    return { label: t.expired, className: 'bg-red-100 text-red-700' };
  }

  if (Number(medicine.quantity) <= Number(medicine.reorder_level)) {
    return { label: t.low, className: 'bg-amber-100 text-amber-800' };
  }

  return { label: t.inStock, className: 'bg-emerald-100 text-emerald-700' };
}

export default function Pharmacy() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'en')
    .split('-')[0];
  const t = translations[language] || translations.en;
  const isRtl = language === 'fa' || language === 'ps';

  const [medicines, setMedicines] = useState([]);
  const [archivedMedicines, setArchivedMedicines] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [adjustments, setAdjustments] = useState([]);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [adjustmentSaving, setAdjustmentSaving] = useState(false);
  const [adjustmentMedicine, setAdjustmentMedicine] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustment_type: 'stock_in',
    quantity: '1',
    reason: '',
    reference_number: '',
  });

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError('');

    try {
      const [
        medicinesResponse,
        archivedResponse,
        lowStockResponse,
        expiringResponse,
        adjustmentsResponse,
      ] = await Promise.all([
        api.get('/medicines'),
        api.get('/medicines/archived'),
        api.get('/medicines/low-stock'),
        api.get('/medicines/expiring-soon?days=30'),
        api.get('/stock-adjustments'),
      ]);

      const unwrap = (response) =>
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

      setMedicines(unwrap(medicinesResponse));
      setArchivedMedicines(unwrap(archivedResponse));
      setLowStockMedicines(unwrap(lowStockResponse));
      setExpiringMedicines(unwrap(expiringResponse));
      setAdjustments(unwrap(adjustmentsResponse));
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.loadError));
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visibleMedicines = useMemo(() => {
    const source = showArchived ? archivedMedicines : medicines;
    const term = search.trim().toLowerCase();

    if (!term) return source;

    return source.filter((medicine) =>
      [
        medicine.name,
        medicine.medicine_code,
        medicine.category,
        medicine.strength,
        medicine.manufacturer,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [medicines, archivedMedicines, search, showArchived]);

  const money = (value, currency = 'AFN') =>
    `${Number(value || 0).toLocaleString(
      language === 'en' ? 'en-US' : language === 'ps' ? 'ps-AF' : 'fa-AF',
      { maximumFractionDigits: 2 },
    )} ${currency}`;

  const formatDate = (value) => {
    if (!value) return t.noExpiry;

    const dateValue = getDateValue(value);
    const parsed = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return dateValue;

    return new Intl.DateTimeFormat(
      language === 'en' ? 'en-US' : language === 'ps' ? 'ps-AF' : 'fa-AF',
      { year: 'numeric', month: 'short', day: 'numeric' },
    ).format(parsed);
  };

  const openCreate = () => {
    setEditingMedicine(null);
    setForm(emptyForm);
    setError('');
    setNotice('');
    setModalOpen(true);
  };

  const openEdit = (medicine) => {
    setEditingMedicine(medicine);
    setForm({
      ...emptyForm,
      ...medicine,
      quantity: String(medicine.quantity ?? 0),
      reorder_level: String(medicine.reorder_level ?? 10),
      purchase_price: String(medicine.purchase_price ?? 0),
      selling_price: String(medicine.selling_price ?? 0),
      expiry_date: getDateValue(medicine.expiry_date),
    });
    setError('');
    setNotice('');
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveMedicine = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!form.medicine_code.trim() || !form.name.trim()) {
      setError(t.required);
      return;
    }

    const payload = {
      ...form,
      medicine_code: form.medicine_code.trim(),
      name: form.name.trim(),
      quantity: Number(form.quantity),
      reorder_level: Number(form.reorder_level),
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      expiry_date: form.expiry_date || null,
    };

    setSaving(true);

    try {
      if (editingMedicine) {
        await api.put(`/medicines/${editingMedicine.id}`, payload);
      } else {
        await api.post('/medicines', payload);
      }

      setModalOpen(false);
      setNotice(t.saved);
      await loadData(false);
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(firstValidationError || getErrorMessage(requestError, t.saveError));
    } finally {
      setSaving(false);
    }
  };

  const archiveMedicine = async (medicine) => {
    if (!window.confirm(t.confirmArchive)) return;

    setError('');
    setNotice('');

    try {
      await api.delete(`/medicines/${medicine.id}`);
      setNotice(t.archivedSuccess);
      await loadData(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.saveError));
    }
  };

  const restoreMedicine = async (medicine) => {
    setError('');
    setNotice('');

    try {
      await api.patch(`/medicines/${medicine.id}/restore`);
      setNotice(t.restoredSuccess);
      await loadData(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.saveError));
    }
  };

  const openAdjustment = (medicine, adjustmentType) => {
    setAdjustmentMedicine(medicine);
    setAdjustmentForm({
      adjustment_type: adjustmentType,
      quantity: '1',
      reason: adjustmentType === 'stock_in' ? t.stockInReason : t.stockOutReason,
      reference_number: '',
    });
    setError('');
    setNotice('');
    setAdjustmentModalOpen(true);
  };

  const saveAdjustment = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const quantity = Number(adjustmentForm.quantity);
    if (!adjustmentMedicine || !Number.isInteger(quantity) || quantity < 1) {
      setError(t.adjustmentError);
      return;
    }

    setAdjustmentSaving(true);
    try {
      await api.post('/stock-adjustments', {
        medicine_id: adjustmentMedicine.id,
        adjustment_type: adjustmentForm.adjustment_type,
        quantity,
        reason: adjustmentForm.reason.trim(),
        reference_number: adjustmentForm.reference_number.trim() || null,
      });
      setAdjustmentModalOpen(false);
      setNotice(t.adjustmentSaved);
      await loadData(false);
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;
      setError(firstValidationError || getErrorMessage(requestError, t.adjustmentError));
    } finally {
      setAdjustmentSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  const stats = [
    {
      label: t.total,
      value: medicines.length,
      icon: Package,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: t.lowStock,
      value: lowStockMedicines.length,
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: t.expiring,
      value: expiringMedicines.length,
      icon: CalendarClock,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: t.outOfStock,
      value: medicines.filter((medicine) => Number(medicine.quantity) <= 0).length,
      icon: PackageX,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadData()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            <span>{language === 'en' ? 'Refresh' : language === 'ps' ? 'تازه کول' : 'تازه‌سازی'}</span>
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={17} />
            {t.add}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button type="button" className="ms-auto" onClick={() => setError('')} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button type="button" className="ms-auto" onClick={() => setNotice('')} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                !showArchived
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {t.active} ({medicines.length})
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                showArchived
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Archive size={14} className="me-1 inline" />
              {t.archived} ({archivedMedicines.length})
            </button>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <Search size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              className={`${inputClass} ps-9`}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-start text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start">{t.name}</th>
                <th className="px-4 py-3 text-start">{t.code}</th>
                <th className="px-4 py-3 text-start">{t.category}</th>
                <th className="px-4 py-3 text-start">{t.quantity}</th>
                <th className="px-4 py-3 text-start">{t.selling}</th>
                <th className="px-4 py-3 text-start">{t.expiry}</th>
                <th className="px-4 py-3 text-start">{t.stockStatus}</th>
                <th className="px-4 py-3 text-start">{t.actions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                    <LoaderCircle size={22} className="mx-auto mb-2 animate-spin" />
                    {t.loading}
                  </td>
                </tr>
              ) : visibleMedicines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                    {t.noMedicines}
                  </td>
                </tr>
              ) : (
                visibleMedicines.map((medicine) => {
                  const status = getStockStatus(medicine, t);

                  return (
                    <tr key={medicine.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{medicine.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{medicine.strength || '—'} · {medicine.dosage_form || '—'}</div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-600">{medicine.medicine_code}</td>
                      <td className="px-4 py-4 text-slate-600">{medicine.category || '—'}</td>
                      <td className="px-4 py-4">
                        <span className={`font-semibold ${Number(medicine.quantity) <= Number(medicine.reorder_level) ? 'text-amber-700' : 'text-slate-800'}`}>
                          {medicine.quantity}
                        </span>
                        <div className="mt-1 text-xs text-slate-400">{t.reorder}: {medicine.reorder_level}</div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {money(medicine.selling_price, medicine.currency)}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(medicine.expiry_date)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {showArchived ? (
                            <button
                              type="button"
                              onClick={() => restoreMedicine(medicine)}
                              className="rounded-md border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              {t.restore}
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => openAdjustment(medicine, 'stock_in')}
                                className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                                title={t.stockIn}
                              >
                                <ArrowDownToLine size={13} />
                                {t.stockIn}
                              </button>
                              <button
                                type="button"
                                onClick={() => openAdjustment(medicine, 'stock_out')}
                                className="inline-flex items-center gap-1 rounded-md border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                                title={t.stockOut}
                              >
                                <ArrowUpFromLine size={13} />
                                {t.stockOut}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEdit(medicine)}
                                className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                {t.editAction}
                              </button>
                              <button
                                type="button"
                                onClick={() => archiveMedicine(medicine)}
                                className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                {t.archive}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
          <History size={18} className="text-blue-600" />
          <h2 className="font-semibold text-slate-900">{t.adjustmentHistory}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-start text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start">{t.date}</th>
                <th className="px-4 py-3 text-start">{t.medicine}</th>
                <th className="px-4 py-3 text-start">{t.adjustmentType}</th>
                <th className="px-4 py-3 text-start">{t.adjustmentQuantity}</th>
                <th className="px-4 py-3 text-start">{t.before}</th>
                <th className="px-4 py-3 text-start">{t.after}</th>
                <th className="px-4 py-3 text-start">{t.reason}</th>
                <th className="px-4 py-3 text-start">{t.reference}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adjustments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    {t.noAdjustments}
                  </td>
                </tr>
              ) : adjustments.slice(0, 10).map((adjustment) => (
                <tr key={adjustment.id} className="hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {adjustment.created_at
                      ? new Intl.DateTimeFormat(
                          language === 'en' ? 'en-US' : language === 'ps' ? 'ps-AF' : 'fa-AF',
                          { dateStyle: 'medium', timeStyle: 'short' },
                        ).format(new Date(adjustment.created_at))
                      : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {adjustment.medicine?.name || medicines.find((m) => m.id === adjustment.medicine_id)?.name || `#${adjustment.medicine_id}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      adjustment.adjustment_type === 'stock_in'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {adjustment.adjustment_type === 'stock_in' ? t.stockIn : t.stockOut}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{adjustment.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{adjustment.quantity_before}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{adjustment.quantity_after}</td>
                  <td className="px-4 py-3 text-slate-600">{adjustment.reason}</td>
                  <td className="px-4 py-3 text-slate-500">{adjustment.reference_number || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(lowStockMedicines.length > 0 || expiringMedicines.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {lowStockMedicines.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <AlertTriangle size={18} />
                {t.lowStock} ({lowStockMedicines.length})
              </div>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {lowStockMedicines.map((medicine) => (
                  <li key={medicine.id} className="flex justify-between gap-3">
                    <span>{medicine.name}</span>
                    <span className="font-semibold">{medicine.quantity} / {medicine.reorder_level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expiringMedicines.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <div className="flex items-center gap-2 font-semibold text-rose-900">
                <CalendarClock size={18} />
                {t.expiring} ({expiringMedicines.length})
              </div>
              <ul className="mt-3 space-y-2 text-sm text-rose-900">
                {expiringMedicines.map((medicine) => (
                  <li key={medicine.id} className="flex justify-between gap-3">
                    <span>{medicine.name}</span>
                    <span className="font-semibold">{formatDate(medicine.expiry_date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {adjustmentModalOpen && adjustmentMedicine && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !adjustmentSaving) {
              setAdjustmentModalOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {adjustmentForm.adjustment_type === 'stock_in' ? t.stockIn : t.stockOut}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {adjustmentMedicine.name} · {t.quantity}: {adjustmentMedicine.quantity}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustmentModalOpen(false)}
                disabled={adjustmentSaving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={saveAdjustment} className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t.adjustmentType}</span>
                <select
                  value={adjustmentForm.adjustment_type}
                  onChange={(event) => setAdjustmentForm((current) => ({
                    ...current,
                    adjustment_type: event.target.value,
                    reason: event.target.value === 'stock_in' ? t.stockInReason : t.stockOutReason,
                  }))}
                  className={inputClass}
                >
                  <option value="stock_in">{t.stockIn}</option>
                  <option value="stock_out">{t.stockOut}</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t.adjustmentQuantity} *</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={adjustmentForm.quantity}
                  onChange={(event) => setAdjustmentForm((current) => ({ ...current, quantity: event.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t.reason} *</span>
                <input
                  type="text"
                  maxLength={255}
                  required
                  value={adjustmentForm.reason}
                  onChange={(event) => setAdjustmentForm((current) => ({ ...current, reason: event.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t.reference}</span>
                <input
                  type="text"
                  maxLength={100}
                  value={adjustmentForm.reference_number}
                  onChange={(event) => setAdjustmentForm((current) => ({ ...current, reference_number: event.target.value }))}
                  className={inputClass}
                />
              </label>
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                {t.before}: <strong>{adjustmentMedicine.quantity}</strong>
                {' · '}
                {t.after}: <strong>
                  {adjustmentForm.quantity && Number.isInteger(Number(adjustmentForm.quantity)) && Number(adjustmentForm.quantity) > 0
                    ? adjustmentForm.adjustment_type === 'stock_in'
                      ? Number(adjustmentMedicine.quantity) + Number(adjustmentForm.quantity)
                      : Number(adjustmentMedicine.quantity) - Number(adjustmentForm.quantity)
                    : '—'}
                </strong>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAdjustmentModalOpen(false)}
                  disabled={adjustmentSaving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={adjustmentSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {adjustmentSaving && <LoaderCircle size={16} className="animate-spin" />}
                  {t.submitAdjustment}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setModalOpen(false);
          }}
        >
          <div className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMedicine ? t.edit : t.add}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveMedicine} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['medicine_code', t.code, true, 'text'],
                  ['name', t.name, true, 'text'],
                  ['category', t.category, false, 'text'],
                  ['strength', t.strength, false, 'text'],
                  ['dosage_form', t.form, false, 'text'],
                  ['manufacturer', t.manufacturer, false, 'text'],
                  ['supplier', t.supplier, false, 'text'],
                  ['quantity', t.quantity, true, 'number'],
                  ['reorder_level', t.reorder, true, 'number'],
                  ['purchase_price', t.purchase, true, 'number'],
                  ['selling_price', t.selling, true, 'number'],
                  ['currency', t.currency, true, 'text'],
                  ['expiry_date', t.expiry, false, 'date'],
                  ['batch_number', t.batch, false, 'text'],
                ].map(([name, label, required, type]) => (
                  <label key={name} className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      {label}{required ? ' *' : ''}
                    </span>
                    <input
                      name={name}
                      type={type}
                      value={form[name] ?? ''}
                      onChange={handleFormChange}
                      required={required}
                      min={type === 'number' ? 0 : undefined}
                      step={name.includes('price') ? '0.01' : type === 'number' ? '1' : undefined}
                      maxLength={type === 'text' ? 255 : undefined}
                      className={inputClass}
                    />
                  </label>
                ))}

                <label className="block sm:col-span-2 lg:col-span-3">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t.description}
                  </span>
                  <textarea
                    name="description"
                    value={form.description ?? ''}
                    onChange={handleFormChange}
                    rows={3}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && <LoaderCircle size={16} className="animate-spin" />}
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
