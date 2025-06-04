'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function ReservePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', time: '', date: null });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('places').select('*').eq('id', id).single();
      setPlace(data);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) return setError('لطفاً ابتدا وارد شوید.');
    if (!form.date) return setError('تاریخ را انتخاب کنید.');

    const dateStr = form.date.format("YYYY/MM/DD");
    const { data: existing } = await supabase
      .from('reservations')
      .select('*')
      .eq('place_id', place.id)
      .eq('time', form.time)
      .eq('date', dateStr);

    if (existing.length > 0) {
      return setError('این بازه زمانی قبلاً رزرو شده است.');
    }

    const { error } = await supabase.from('reservations').insert({
      ...form,
      place_id: place.id,
      user_email: user.email,
      date: dateStr
    });

    if (error) {
      setError('خطا در ثبت رزرو.');
    } else {
      setSuccess(true);
    }
  };

  if (!place) return <p className="text-center mt-8 text-gray-600">در حال دریافت اطلاعات پلاتو...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6 space-y-4 mt-6">
      <h1 className="text-xl font-bold text-indigo-700">رزرو پلاتو: {place.title}</h1>
      {success ? (
        <div className="text-green-600">رزرو شما با موفقیت ثبت شد ✅</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <input type="text" required placeholder="نام کامل شما"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
          <input type="text" required placeholder="شماره تماس"
            className="w-full border px-3 py-2 rounded"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
          <select required value={form.time}
            onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
            className="w-full border px-3 py-2 rounded">
            <option value="">انتخاب زمان</option>
            {place.times.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600">
            <p className="mb-1">انتخاب تاریخ (شمسی):</p>
            <DatePicker
              value={form.date}
              onChange={(date) => setForm(prev => ({ ...prev, date }))}
              calendar={persian}
              locale={persian_fa}
              className="border rounded"
              calendarPosition="bottom-right"
            />
          </div>
          <button type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">ثبت رزرو</button>
        </form>
      )}
    </div>
  );
}