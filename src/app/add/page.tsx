'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AddPlace() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [region, setRegion] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [times, setTimes] = useState(['']);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');

  const regions = ['شمال تهران', 'مرکز تهران', 'جنوب تهران', 'شرق تهران', 'غرب تهران'];
  const amenities = ['پیانو', 'سیستم صوتی', 'آینه', 'کف‌پوش مخصوص', 'نورپردازی حرفه‌ای'];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const newPlace = {
      title,
      description: desc,
      address,
      price: parseInt(price),
      image,
      times: times.filter(Boolean),
      region,
      amenities: selectedAmenities,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      user_id: user.id
    };

    const { error: insertError } = await supabase.from('places').insert(newPlace);
    if (insertError) {
      setError('مشکلی در ثبت پلاتو رخ داد.');
      console.error(insertError);
    } else {
      router.push('/dashboard');
    }
  };

  const toggleAmenity = (value) => {
    setSelectedAmenities(prev =>
      prev.includes(value)
        ? prev.filter(a => a !== value)
        : [...prev, value]
    );
  };

  const updateTime = (val, idx) => {
    const updated = [...times];
    updated[idx] = val;
    setTimes(updated);
  };

  const addTimeField = () => setTimes([...times, '']);
  const removeTime = (idx) => setTimes(times.filter((_, i) => i !== idx));

  if (!user) return <p className="text-center mt-10">در حال دریافت اطلاعات کاربر...</p>;

  return (
    <div className="bg-white p-6 max-w-xl mx-auto rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-indigo-700">ثبت پلاتو جدید</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" required placeholder="عنوان" className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea required placeholder="توضیحات" className="w-full border rounded px-3 py-2" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="text" required placeholder="آدرس" className="w-full border rounded px-3 py-2" value={address} onChange={e => setAddress(e.target.value)} />
        <input type="number" required placeholder="قیمت" className="w-full border rounded px-3 py-2" value={price} onChange={e => setPrice(e.target.value)} />
        <input type="text" required placeholder="لینک عکس" className="w-full border rounded px-3 py-2" value={image} onChange={e => setImage(e.target.value)} />

        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="عرض جغرافیایی (Latitude)" className="border rounded px-3 py-2" value={latitude} onChange={e => setLatitude(e.target.value)} />
          <input type="text" placeholder="طول جغرافیایی (Longitude)" className="border rounded px-3 py-2" value={longitude} onChange={e => setLongitude(e.target.value)} />
        </div>

        <select value={region} onChange={e => setRegion(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">انتخاب منطقه</option>
          {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
        </select>

        <div className="space-y-2">
          <p className="text-sm font-medium">امکانات:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {amenities.map((a, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">زمان‌های کاری:</p>
          {times.map((t, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={t} required className="flex-1 border rounded px-3 py-2" onChange={e => updateTime(e.target.value, idx)} />
              <button type="button" onClick={() => removeTime(idx)} className="text-red-500">حذف</button>
            </div>
          ))}
          <button type="button" onClick={addTimeField} className="text-sm text-indigo-600">+ زمان دیگر</button>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">ثبت پلاتو</button>
      </form>
    </div>
  );
}