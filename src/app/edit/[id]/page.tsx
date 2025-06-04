'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EditPlace() {
  const { id } = useParams();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', address: '', image: '', price: '', times: [''] });

  useEffect(() => {
    const fetchPlace = async () => {
      const { data } = await supabase.from('places').select('*').eq('id', id).single();
      setPlace(data);
      setForm({
        title: data.title,
        description: data.description,
        address: data.address,
        image: data.image,
        price: data.price,
        times: data.times || ['']
      });
    };
    fetchPlace();
  }, [id]);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const updateTime = (val, idx) => {
    const updated = [...form.times];
    updated[idx] = val;
    setForm(prev => ({ ...prev, times: updated }));
  };
  const addTime = () => setForm(prev => ({ ...prev, times: [...prev.times, ''] }));
  const removeTime = (idx) => setForm(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('places').update({
      ...form,
      price: parseInt(form.price),
      times: form.times.filter(Boolean)
    }).eq('id', id);
    router.push('/dashboard');
  };

  if (!place) return <p className="text-center text-gray-600">در حال بارگذاری...</p>;

  return (
    <div className="bg-white p-6 max-w-xl mx-auto rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-indigo-700">ویرایش پلاتو</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" required value={form.title} onChange={e => updateForm('title', e.target.value)} className="w-full border px-3 py-2 rounded" />
        <textarea required value={form.description} onChange={e => updateForm('description', e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="text" required value={form.address} onChange={e => updateForm('address', e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="number" required value={form.price} onChange={e => updateForm('price', e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="text" required value={form.image} onChange={e => updateForm('image', e.target.value)} className="w-full border px-3 py-2 rounded" />

        <div className="space-y-2">
          {form.times.map((t, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={t} onChange={e => updateTime(e.target.value, idx)} className="flex-1 border px-3 py-2 rounded" />
              <button type="button" onClick={() => removeTime(idx)} className="text-red-600">حذف</button>
            </div>
          ))}
          <button type="button" onClick={addTime} className="text-sm text-indigo-600">+ زمان دیگر</button>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">ذخیره تغییرات</button>
      </form>
    </div>
  );
}