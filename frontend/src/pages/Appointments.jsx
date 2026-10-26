
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const emptyForm = {
  appointment_number: '',
  patient_id: '',
  doctor_id: '',
  appointment_date: '',
  appointment_time: '',
  reason: '',
  status: 'scheduled',
  notes: '',
};
const getArrayData = (response) => {
  const data = response?.data;

  // Direct array, as returned by the appointments API
  if (Array.isArray(data)) {
    return data;
  }

  // Paginated Laravel response, as returned by the patients API
  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

export default function Appointments() {
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');


const loadData = useCallback(async () => {
  setLoading(true);
  setError('');

  try {
    const appointmentsUrl = showArchived
      ? '/appointments/archived'
      : '/appointments';

    const [
      appointmentsResponse,
      patientsResponse,
      doctorsResponse,
    ] = await Promise.all([
      api.get(appointmentsUrl),
      api.get('/patients'),
      api.get('/doctors'),
    ]);

    setAppointments(getArrayData(appointmentsResponse));
    setPatients(getArrayData(patientsResponse));
    setDoctors(getArrayData(doctorsResponse));
  } catch (err) {
    console.error('Failed to load appointment data:', err);

    setError(
      err.response?.data?.message ||
        'Could not load appointments. Check that Laravel is running.'
    );
  } finally {
    setLoading(false);
  }
}, [showArchived]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      patient_id: Number(form.patient_id),
      doctor_id: Number(form.doctor_id),
    };

    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, payload);
        setMessage('Appointment updated successfully.');
      } else {
        await api.post('/appointments', payload);
        setMessage('Appointment created successfully.');
      }

      resetForm();
      await loadData();
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.errors) {
        setError(
          Object.values(responseData.errors).flat().join(' ')
        );
      } else {
        setError(
          responseData?.message || 'Failed to save appointment.'
        );
      }
    } finally {
      setSaving(false);
    }
  }

  function startEditing(appointment) {
    setForm({
      appointment_number: appointment.appointment_number || '',
      patient_id: String(appointment.patient_id),
      doctor_id: String(appointment.doctor_id),
      appointment_date: String(appointment.appointment_date || '').slice(0, 10),
      appointment_time: String(appointment.appointment_time || '').slice(0, 5),
      reason: appointment.reason || '',
      status: appointment.status || 'scheduled',
      notes: appointment.notes || '',
    });

    setEditingId(appointment.id);
    setMessage('');
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function archiveAppointment(id) {
    if (!window.confirm('Archive this appointment?')) return;

    setError('');
    setMessage('');

    try {
      await api.delete(`/appointments/${id}`);
      setMessage('Appointment archived successfully.');
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to archive appointment.'
      );
    }
  }

  
async function restoreAppointment(id) {
  setError('');
  setMessage('');

  try {
    await api.patch(`/appointments/${id}/restore`);

    setMessage('Appointment restored successfully.');

    await loadData();
  } catch (err) {
    console.error('Failed to restore appointment:', err);

    setError(
      err.response?.data?.message ||
        'Failed to restore appointment.'
    );
  }
}


  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {t('appointments', 'Appointments')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage patient appointments and schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowArchived((current) => !current);
            resetForm();
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {showArchived ? 'View active appointments' : 'View archived'}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {!showArchived && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800">
            {editingId ? 'Edit appointment' : 'Register appointment'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Appointment number">
              <input
                name="appointment_number"
                value={form.appointment_number}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="APT-001"
                className="field-input"
              />
            </Field>

            <Field label="Patient">
              <select
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                required
                className="field-input"
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {[
                      patient.first_name,
                      patient.last_name,
                    ].filter(Boolean).join(' ') ||
                      patient.patient_number ||
                      `Patient #${patient.id}`}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Doctor">
              <select
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
                required
                className="field-input"
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {[
                      doctor.first_name,
                      doctor.last_name,
                    ].filter(Boolean).join(' ') ||
                      doctor.doctor_number ||
                      `Doctor #${doctor.id}`}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Appointment date">
              <input
                type="date"
                name="appointment_date"
                value={form.appointment_date}
                onChange={handleChange}
                required
                className="field-input"
              />
            </Field>

            <Field label="Appointment time">
              <input
                type="time"
                name="appointment_time"
                value={form.appointment_time}
                onChange={handleChange}
                required
                className="field-input"
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="field-input"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Reason for appointment">
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="field-input"
                  placeholder="General consultation"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Notes">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="field-input"
                  placeholder="Optional notes"
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Create appointment'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            {showArchived ? 'Archived appointments' : 'All appointments'}
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No appointments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Appointment</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Date & time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {appointment.appointment_number}
                      <p className="mt-1 text-xs font-normal text-slate-500">
                        {appointment.reason}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {appointment.patient
                        ? [
                            appointment.patient.first_name,
                            appointment.patient.last_name,
                          ].filter(Boolean).join(' ') ||
                          appointment.patient.patient_number
                        : `Patient #${appointment.patient_id}`}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {appointment.doctor
                        ? [
                            appointment.doctor.first_name,
                            appointment.doctor.last_name,
                          ].filter(Boolean).join(' ') ||
                          appointment.doctor.doctor_number
                        : `Doctor #${appointment.doctor_id}`}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {String(appointment.appointment_date || '').slice(0, 10)}
                      <p className="mt-1 text-xs text-slate-500">
                        {String(appointment.appointment_time || '').slice(0, 5)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {showArchived ? (
                        <button
                          type="button"
                          onClick={() => restoreAppointment(appointment.id)}
                          className="font-semibold text-green-700 hover:underline"
                        >
                          Restore
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(appointment)}
                            className="font-semibold text-blue-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => archiveAppointment(appointment.id)}
                            className="font-semibold text-red-700 hover:underline"
                          >
                            Archive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
