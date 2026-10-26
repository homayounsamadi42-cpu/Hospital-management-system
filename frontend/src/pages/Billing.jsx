
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  FilePlus2,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const today = () => new Date().toLocaleDateString('en-CA');

const emptyItem = () => ({
  description: '',
  quantity: '1',
  unit_price: '',
});

const emptyInvoice = () => ({
  invoice_number: '',
  patient_id: '',
  appointment_id: '',
  invoice_date: today(),
  due_date: '',
  discount_amount: '0',
  tax_amount: '0',
  currency: 'AFN',
  notes: '',
  items: [emptyItem()],
});

const emptyPayment = () => ({
  payment_reference: '',
  amount: '',
  payment_method: 'cash',
  payment_date: today(),
  notes: '',
});

const messages = {
  en: {
    title: 'Billing & Payments',
    subtitle: 'Manage patient invoices and payment records.',
    invoices: 'Invoices',
    payments: 'Payments',
    totalBilled: 'Total billed',
    totalPaid: 'Total collected',
    outstanding: 'Outstanding',
    search: 'Search invoice or patient...',
    newInvoice: 'Create invoice',
    refresh: 'Refresh',
    invoiceNumber: 'Invoice number',
    patient: 'Patient',
    appointment: 'Appointment (optional)',
    invoiceDate: 'Invoice date',
    dueDate: 'Due date',
    currency: 'Currency',
    discount: 'Discount',
    tax: 'Tax',
    notes: 'Notes',
    items: 'Invoice items',
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit price',
    lineTotal: 'Line total',
    addItem: 'Add item',
    subtotal: 'Subtotal',
    total: 'Total',
    cancel: 'Cancel',
    saveInvoice: 'Save invoice',
    recordPayment: 'Record payment',
    amount: 'Payment amount',
    method: 'Payment method',
    reference: 'Payment reference (optional)',
    date: 'Payment date',
    cash: 'Cash',
    card: 'Card',
    bank: 'Bank transfer',
    mobile: 'Mobile money',
    status: 'Status',
    paid: 'Paid',
    partial: 'Partially paid',
    unpaid: 'Unpaid',
    cancelled: 'Cancelled',
    balance: 'Balance due',
    actions: 'Actions',
    noInvoices: 'No invoices found.',
    loading: 'Loading billing records...',
    save: 'Save payment',
    close: 'Close',
    successInvoice: 'Invoice created successfully.',
    successPayment: 'Payment recorded successfully.',
    loadError: 'Unable to load billing records.',
    genericError: 'Something went wrong. Please try again.',
    required: 'Please complete all required fields.',
    noPatients: 'No active patients found. Register a patient first.',
    selectPatient: 'Select patient',
    noAppointment: 'No appointment',
    confirm: 'Confirm',
    paymentsHistory: 'Payments History',
    paymentsHistoryDescription: 'Review all payments recorded in the system.',
    paymentReference: 'Payment Reference',
    noPayments: 'No payments have been recorded yet.',
  },
  fa: {
    title: 'صورت‌حساب و پرداخت‌ها',
    subtitle: 'مدیریت صورت‌حساب‌ها و پرداخت‌های بیماران.',
    invoices: 'صورت‌حساب‌ها',
    payments: 'پرداخت‌ها',
    totalBilled: 'مجموع صورت‌حساب',
    totalPaid: 'مجموع دریافت‌شده',
    outstanding: 'باقی‌مانده',
    search: 'جستجوی صورت‌حساب یا بیمار...',
    newInvoice: 'ایجاد صورت‌حساب',
    refresh: 'تازه‌سازی',
    invoiceNumber: 'شماره صورت‌حساب',
    patient: 'بیمار',
    appointment: 'نوبت (اختیاری)',
    invoiceDate: 'تاریخ صورت‌حساب',
    dueDate: 'تاریخ سررسید',
    currency: 'واحد پول',
    discount: 'تخفیف',
    tax: 'مالیات',
    notes: 'یادداشت',
    items: 'اقلام صورت‌حساب',
    description: 'شرح',
    quantity: 'تعداد',
    unitPrice: 'قیمت واحد',
    lineTotal: 'مجموع',
    addItem: 'افزودن قلم',
    subtotal: 'جمع فرعی',
    total: 'مجموع کل',
    cancel: 'لغو',
    saveInvoice: 'ذخیره صورت‌حساب',
    recordPayment: 'ثبت پرداخت',
    amount: 'مبلغ پرداخت',
    method: 'روش پرداخت',
    reference: 'شماره پرداخت (اختیاری)',
    date: 'تاریخ پرداخت',
    cash: 'نقدی',
    card: 'کارت',
    bank: 'انتقال بانکی',
    mobile: 'پول موبایلی',
    status: 'وضعیت',
    paid: 'پرداخت‌شده',
    partial: 'پرداخت جزئی',
    unpaid: 'پرداخت‌نشده',
    cancelled: 'لغوشده',
    balance: 'باقی‌مانده',
    actions: 'عملیات',
    noInvoices: 'صورت‌حسابی یافت نشد.',
    loading: 'در حال بارگذاری...',
    save: 'ذخیره پرداخت',
    close: 'بستن',
    successInvoice: 'صورت‌حساب با موفقیت ایجاد شد.',
    successPayment: 'پرداخت با موفقیت ثبت شد.',
    loadError: 'بارگذاری اطلاعات ناموفق بود.',
    genericError: 'خطایی رخ داد. دوباره تلاش کنید.',
    required: 'لطفاً فیلدهای ضروری را تکمیل کنید.',
    noPatients: 'بیمار فعالی یافت نشد. ابتدا بیمار ثبت کنید.',
    selectPatient: 'انتخاب بیمار',
    noAppointment: 'بدون نوبت',
    confirm: 'تأیید',
    paymentsHistory: 'تاریخچه پرداخت‌ها',
    paymentsHistoryDescription: 'تمام پرداخت‌های ثبت‌شده در سیستم را بررسی کنید.',
    paymentReference: 'شماره مرجع پرداخت',
    noPayments: 'هنوز هیچ پرداختی ثبت نشده است.',
  },
  ps: {
    title: 'بلونه او تادیات',
    subtitle: 'د ناروغانو بلونه او تادیات اداره کړئ.',
    invoices: 'بلونه',
    payments: 'تادیات',
    totalBilled: 'ټول بلونه',
    totalPaid: 'ټولې ترلاسه شوې پیسې',
    outstanding: 'پاتې پیسې',
    search: 'بل یا ناروغ ولټوئ...',
    newInvoice: 'نوی بل جوړول',
    refresh: 'تازه کول',
    invoiceNumber: 'د بل شمېره',
    patient: 'ناروغ',
    appointment: 'وخت (اختیاري)',
    invoiceDate: 'د بل نېټه',
    dueDate: 'د ورکړې وروستۍ نېټه',
    currency: 'پولي واحد',
    discount: 'تخفیف',
    tax: 'مالیه',
    notes: 'یادښتونه',
    items: 'د بل توکي',
    description: 'تشریح',
    quantity: 'اندازه',
    unitPrice: 'د یوه توکي بیه',
    lineTotal: 'ټول قیمت',
    addItem: 'توکی زیاتول',
    subtotal: 'فرعي مجموعه',
    total: 'ټولټال',
    cancel: 'لغوه کول',
    saveInvoice: 'بل خوندي کول',
    recordPayment: 'تادیه ثبتول',
    amount: 'د تادیې اندازه',
    method: 'د تادیې طریقه',
    reference: 'د تادیې شمېره (اختیاري)',
    date: 'د تادیې نېټه',
    cash: 'نغدې',
    card: 'کارت',
    bank: 'بانکي لېږد',
    mobile: 'موبایل پیسې',
    status: 'حالت',
    paid: 'تادیه شوی',
    partial: 'نیمه تادیه',
    unpaid: 'نه دی تادیه شوی',
    cancelled: 'لغوه شوی',
    balance: 'پاتې پیسې',
    actions: 'کړنې',
    noInvoices: 'بلونه ونه موندل شول.',
    loading: 'معلومات بارېږي...',
    save: 'تادیه خوندي کول',
    close: 'بندول',
    successInvoice: 'بل په بریالیتوب جوړ شو.',
    successPayment: 'تادیه په بریالیتوب ثبت شوه.',
    loadError: 'د معلوماتو بارول ناکام شول.',
    genericError: 'ستونزه رامنځته شوه. بیا هڅه وکړئ.',
    required: 'اړین معلومات بشپړ کړئ.',
    noPatients: 'فعال ناروغ نشته. لومړی ناروغ ثبت کړئ.',
    selectPatient: 'ناروغ وټاکئ',
    noAppointment: 'وخت نشته',
    confirm: 'تایید',
    paymentsHistory: 'د تادیاتو تاریخچه',
    paymentsHistoryDescription: 'په سیستم کې ټول ثبت شوي تادیات وګورئ.',
    paymentReference: 'د تادیې د حوالې شمېره',
    noPayments: 'تر اوسه هېڅ تادیه نه ده ثبت شوې.',
  },
};

const statusColors = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  partial: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  unpaid: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.errors) {
    return Object.values(data.errors).flat().join(' ');
  }
  return data?.message || fallback;
}

function amountValue(value) {
  return Number(value || 0);
}

export default function Billing() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
  const t = messages[language] || messages.en;

  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState('');
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoice);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payments, setPayments] = useState([]);

  const money = useCallback((value, currency = 'AFN') => {
    try {
      return new Intl.NumberFormat(
        language === 'fa' ? 'fa-AF' : language === 'ps' ? 'ps-AF' : 'en-US',
        { style: 'currency', currency, maximumFractionDigits: 2 },
      ).format(amountValue(value));
    } catch {
      return `${amountValue(value).toFixed(2)} ${currency}`;
    }
  }, [language]);

  const date = useCallback((value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat(
      language === 'fa' ? 'fa-AF' : language === 'ps' ? 'ps-AF' : 'en-GB',
      { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' },
    ).format(parsed);
  }, [language]);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError('');
    try {
      const [
        invoiceResponse,
        patientResponse,
        appointmentResponse,
        paymentResponse,
        ] = await Promise.all([
        api.get('/invoices'),
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/payments'),
        ]);

        setPayments(paymentResponse.data);
      setInvoices(Array.isArray(invoiceResponse.data) ? invoiceResponse.data : invoiceResponse.data.data || []);
      setPatients(Array.isArray(patientResponse.data) ? patientResponse.data : patientResponse.data.data || []);
      setAppointments(Array.isArray(appointmentResponse.data) ? appointmentResponse.data : appointmentResponse.data.data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.loadError));
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return invoices;
    return invoices.filter((invoice) => {
      const patientName = `${invoice.patient?.first_name || ''} ${invoice.patient?.last_name || ''}`;
      return [invoice.invoice_number, patientName, invoice.patient?.patient_number]
        .some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [invoices, search]);

  const totals = useMemo(() => invoices.reduce((acc, invoice) => {
    acc.billed += amountValue(invoice.total_amount);
    acc.paid += amountValue(invoice.paid_amount);
    acc.balance += Math.max(0, amountValue(invoice.total_amount) - amountValue(invoice.paid_amount));
    return acc;
  }, { billed: 0, paid: 0, balance: 0 }), [invoices]);

  const updateInvoiceField = (field, value) => {
    setInvoiceForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setInvoiceForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item),
    }));
  };

  const computedSubtotal = invoiceForm.items.reduce(
    (sum, item) => sum + amountValue(item.quantity) * amountValue(item.unit_price), 0,
  );
  const computedTotal = Math.max(
    0,
    computedSubtotal - amountValue(invoiceForm.discount_amount) + amountValue(invoiceForm.tax_amount),
  );

  const openInvoiceModal = () => {
    setError('');
    setNotice('');
    setInvoiceForm({
      ...emptyInvoice(),
      invoice_number: `INV-${Date.now().toString().slice(-8)}`,
    });
    setModal('invoice');
  };

  const createInvoice = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!invoiceForm.invoice_number.trim() || !invoiceForm.patient_id ||
        !invoiceForm.invoice_date || invoiceForm.items.length === 0 ||
        invoiceForm.items.some((item) =>
          !item.description.trim() || amountValue(item.quantity) <= 0 ||
          item.unit_price === '' || amountValue(item.unit_price) < 0)) {
      setError(t.required);
      return;
    }

    setBusy(true);
    try {
      await api.post('/invoices', {
        ...invoiceForm,
        patient_id: Number(invoiceForm.patient_id),
        appointment_id: invoiceForm.appointment_id ? Number(invoiceForm.appointment_id) : null,
        discount_amount: amountValue(invoiceForm.discount_amount),
        tax_amount: amountValue(invoiceForm.tax_amount),
        items: invoiceForm.items.map((item) => ({
          description: item.description.trim(),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
        due_date: invoiceForm.due_date || null,
      });
      setModal('');
      setNotice(t.successInvoice);
      await loadData(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.genericError));
    } finally {
      setBusy(false);
    }
  };

  const openPaymentModal = (invoice) => {
    setError('');
    setNotice('');
    setSelectedInvoice(invoice);
    const balance = Math.max(
      0, amountValue(invoice.total_amount) - amountValue(invoice.paid_amount),
    );
    setPaymentForm({ ...emptyPayment(), amount: balance.toFixed(2) });
    setModal('payment');
  };

  const recordPayment = async (event) => {
    event.preventDefault();
    if (!selectedInvoice) return;
    setError('');
    setNotice('');

    const amount = Number(paymentForm.amount);
    const balance = Math.max(
      0, amountValue(selectedInvoice.total_amount) - amountValue(selectedInvoice.paid_amount),
    );

    if (!Number.isFinite(amount) || amount <= 0 || amount > balance) {
      setError(`Amount must be greater than zero and no more than ${money(balance, selectedInvoice.currency)}.`);
      return;
    }

    setBusy(true);
    try {
      await api.post(`/invoices/${selectedInvoice.id}/payments`, {
        ...paymentForm,
        amount,
        payment_reference: paymentForm.payment_reference.trim() || null,
      });
      setModal('');
      setNotice(t.successPayment);
      await loadData(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t.genericError));
    } finally {
      setBusy(false);
    }
  };

  const closeModal = () => {
    if (busy) return;
    setModal('');
    setError('');
  };

  const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
  const labelClass = 'block text-sm font-medium text-slate-700';
  const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <section className="space-y-6" dir={language === 'fa' || language === 'ps' ? 'rtl' : 'ltr'}>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => loadData()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw size={16} /> {t.refresh}
          </button>
          <button type="button" onClick={openInvoiceModal} className={buttonClass}>
            <FilePlus2 size={17} /> {t.newInvoice}
          </button>
        </div>
      </header>

      {error && !modal && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {notice}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: t.totalBilled, value: totals.billed, icon: FilePlus2, tone: 'text-blue-600 bg-blue-50' },
          { label: t.totalPaid, value: totals.paid, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
          { label: t.outstanding, value: totals.balance, icon: CreditCard, tone: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className={`rounded-lg p-2 ${tone}`}><Icon size={19} /></span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{money(value)}</p>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{t.invoices}</h2>
          <label className="relative block w-full sm:max-w-xs">
            <Search size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} className={`${inputClass} !mt-0 ps-9`} />
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
            <LoaderCircle size={18} className="animate-spin" /> {t.loading}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">{t.noInvoices}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-start text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start">{t.invoiceNumber}</th>
                  <th className="px-4 py-3 text-start">{t.patient}</th>
                  <th className="px-4 py-3 text-start">{t.invoiceDate}</th>
                  <th className="px-4 py-3 text-start">{t.total}</th>
                  <th className="px-4 py-3 text-start">{t.paid}</th>
                  <th className="px-4 py-3 text-start">{t.balance}</th>
                  <th className="px-4 py-3 text-start">{t.status}</th>
                  <th className="px-4 py-3 text-start">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => {
                  const balance = Math.max(
                    0, amountValue(invoice.total_amount) - amountValue(invoice.paid_amount),
                  );
                  const patientName = [invoice.patient?.first_name, invoice.patient?.last_name]
                    .filter(Boolean).join(' ') || '—';

                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">{invoice.invoice_number}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-800">{patientName}</div>
                        <div className="text-xs text-slate-400">{invoice.patient?.patient_number}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{date(invoice.invoice_date)}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium">{money(invoice.total_amount, invoice.currency)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-emerald-700">{money(invoice.paid_amount, invoice.currency)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-amber-700">{money(balance, invoice.currency)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusColors[invoice.status] || statusColors.unpaid}`}>
                          {t[invoice.status] || invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {balance > 0 && invoice.status !== 'cancelled' && (
                          <button type="button" onClick={() => openPaymentModal(invoice)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                            <CreditCard size={14} /> {t.recordPayment}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                {messages[language].paymentsHistory}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                {messages[language].paymentsHistoryDescription}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-start text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].paymentReference}
                    </th>
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].invoiceNumber}
                    </th>
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].patient}
                    </th>
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].amount}
                    </th>
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].method}
                    </th>
                    <th className="px-3 py-3 text-start font-medium">
                        {messages[language].date}
                    </th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((payment) => (
                    <tr
                        key={payment.id}
                        className="border-b border-slate-100 last:border-0"
                    >
                        <td className="px-3 py-4 font-medium text-slate-900">
                        {payment.payment_reference}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                        {payment.invoice?.invoice_number ?? `#${payment.invoice_id}`}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                        {payment.invoice?.patient
                            ? `${payment.invoice.patient.first_name} ${payment.invoice.patient.last_name}`
                            : '—'}
                        </td>

                        <td className="px-3 py-4 font-medium text-slate-900">
                        {money(
                        payment.amount,
                        payment.invoice?.currency || 'AFN',
                        )}
                        </td>

                        <td className="px-3 py-4 capitalize text-slate-600">
                        {payment.payment_method}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                        {date(payment.payment_date)}
                        </td>
                    </tr>
                    ))}

                    {payments.length === 0 && (
                    <tr>
                        <td
                        colSpan={6}
                        className="px-3 py-8 text-center text-slate-500"
                        >
                        {messages[language].noPayments}
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">
          <div role="dialog" aria-modal="true" className="my-4 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {modal === 'invoice' ? t.newInvoice : `${t.recordPayment} — ${selectedInvoice?.invoice_number || ''}`}
              </h2>
              <button type="button" onClick={closeModal} disabled={busy} aria-label={t.close} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50">
                <X size={19} />
              </button>
            </div>

            {error && (
              <div role="alert" className="mx-5 mt-4 flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <AlertCircle size={18} className="shrink-0" /> {error}
              </div>
            )}

            {modal === 'invoice' ? (
              <form onSubmit={createInvoice} className="space-y-5 p-5">
                {patients.length === 0 && (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{t.noPatients}</p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    {t.invoiceNumber} *
                    <input required value={invoiceForm.invoice_number} onChange={(event) => updateInvoiceField('invoice_number', event.target.value)} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.patient} *
                    <select required value={invoiceForm.patient_id} onChange={(event) => updateInvoiceField('patient_id', event.target.value)} className={inputClass}>
                      <option value="">{t.selectPatient}</option>
                      {patients.filter((patient) => !patient.deleted_at).map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.patient_number} — {patient.first_name} {patient.last_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={labelClass}>
                    {t.appointment}
                    <select value={invoiceForm.appointment_id} onChange={(event) => updateInvoiceField('appointment_id', event.target.value)} className={inputClass}>
                      <option value="">{t.noAppointment}</option>
                      {appointments.filter((appointment) =>
                        !appointment.deleted_at &&
                        (!invoiceForm.patient_id || Number(appointment.patient_id) === Number(invoiceForm.patient_id))
                      ).map((appointment) => (
                        <option key={appointment.id} value={appointment.id}>
                          {appointment.appointment_number} — {appointment.appointment_date}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={labelClass}>
                    {t.invoiceDate} *
                    <input type="date" required value={invoiceForm.invoice_date} onChange={(event) => updateInvoiceField('invoice_date', event.target.value)} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.dueDate}
                    <input type="date" min={invoiceForm.invoice_date} value={invoiceForm.due_date} onChange={(event) => updateInvoiceField('due_date', event.target.value)} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.currency}
                    <select value={invoiceForm.currency} onChange={(event) => updateInvoiceField('currency', event.target.value)} className={inputClass}>
                      <option value="AFN">AFN — Afghan Afghani</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                    </select>
                  </label>
                  <label className={labelClass}>
                    {t.discount}
                    <input type="number" min="0" step="0.01" value={invoiceForm.discount_amount} onChange={(event) => updateInvoiceField('discount_amount', event.target.value)} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.tax}
                    <input type="number" min="0" step="0.01" value={invoiceForm.tax_amount} onChange={(event) => updateInvoiceField('tax_amount', event.target.value)} className={inputClass} />
                  </label>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{t.items}</h3>
                    <button type="button" onClick={() => setInvoiceForm((current) => ({ ...current, items: [...current.items, emptyItem()] }))} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <Plus size={14} /> {t.addItem}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {invoiceForm.items.map((item, index) => (
                      <div key={index} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(0,1fr)_100px_140px_auto] sm:items-end">
                        <label className={labelClass}>
                          {t.description} *
                          <input required value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} className={inputClass} />
                        </label>
                        <label className={labelClass}>
                          {t.quantity} *
                          <input required type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} className={inputClass} />
                        </label>
                        <label className={labelClass}>
                          {t.unitPrice} *
                          <input required type="number" min="0" step="0.01" value={item.unit_price} onChange={(event) => updateItem(index, 'unit_price', event.target.value)} className={inputClass} />
                        </label>
                        <div className="flex items-center justify-between gap-2 sm:block">
                          <span className="text-xs text-slate-500">{t.lineTotal}</span>
                          <p className="font-semibold text-slate-800">{money(amountValue(item.quantity) * amountValue(item.unit_price), invoiceForm.currency)}</p>
                          {invoiceForm.items.length > 1 && (
                            <button type="button" onClick={() => setInvoiceForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))} className="text-xs font-medium text-rose-600 hover:text-rose-700">
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <label className={labelClass}>
                  {t.notes}
                  <textarea rows={2} value={invoiceForm.notes} onChange={(event) => updateInvoiceField('notes', event.target.value)} className={inputClass} />
                </label>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between gap-4 text-sm text-slate-600">
                    <span>{t.subtotal}</span>
                    <span>{money(computedSubtotal, invoiceForm.currency)}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4 text-sm text-slate-600">
                    <span>{t.discount}</span>
                    <span>− {money(invoiceForm.discount_amount, invoiceForm.currency)}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4 text-sm text-slate-600">
                    <span>{t.tax}</span>
                    <span>{money(invoiceForm.tax_amount, invoiceForm.currency)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4 border-t border-slate-200 pt-3 font-bold text-slate-900">
                    <span>{t.total}</span>
                    <span>{money(computedTotal, invoiceForm.currency)}</span>
                  </div>
                </div>

                <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                  <button type="button" onClick={closeModal} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">{t.cancel}</button>
                  <button type="submit" disabled={busy || patients.length === 0} className={buttonClass}>
                    {busy && <LoaderCircle size={16} className="animate-spin" />}
                    {t.saveInvoice}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={recordPayment} className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{t.total}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{money(selectedInvoice?.total_amount, selectedInvoice?.currency)}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">{t.balance}</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">
                      {money(Math.max(0, amountValue(selectedInvoice?.total_amount) - amountValue(selectedInvoice?.paid_amount)), selectedInvoice?.currency)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    {t.amount} *
                    <input required type="number" min="0.01" max={Math.max(0, amountValue(selectedInvoice?.total_amount) - amountValue(selectedInvoice?.paid_amount))} step="0.01" value={paymentForm.amount} onChange={(event) => setPaymentForm((current) => ({ ...current, amount: event.target.value }))} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.method} *
                    <select required value={paymentForm.payment_method} onChange={(event) => setPaymentForm((current) => ({ ...current, payment_method: event.target.value }))} className={inputClass}>
                      <option value="cash">{t.cash}</option>
                      <option value="card">{t.card}</option>
                      <option value="bank_transfer">{t.bank}</option>
                      <option value="mobile_money">{t.mobile}</option>
                    </select>
                  </label>
                  <label className={labelClass}>
                    {t.reference}
                    <input value={paymentForm.payment_reference} onChange={(event) => setPaymentForm((current) => ({ ...current, payment_reference: event.target.value }))} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    {t.date} *
                    <input type="date" required value={paymentForm.payment_date} onChange={(event) => setPaymentForm((current) => ({ ...current, payment_date: event.target.value }))} className={inputClass} />
                  </label>
                </div>

                <label className={labelClass}>
                  {t.notes}
                  <textarea rows={2} value={paymentForm.notes} onChange={(event) => setPaymentForm((current) => ({ ...current, notes: event.target.value }))} className={inputClass} />
                </label>

                <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                  <button type="button" onClick={closeModal} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">{t.cancel}</button>
                  <button type="submit" disabled={busy} className={buttonClass}>
                    {busy && <LoaderCircle size={16} className="animate-spin" />}
                    {t.save}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
