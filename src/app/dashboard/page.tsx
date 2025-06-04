'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: placesData } = await supabase.from('places').select('*').eq('user_id', user.id);
        const { data: resData } = await supabase.from('reservations').select('*');
        setPlaces(placesData || []);
        setReservations(resData || []);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const getReservationsGrouped = (placeId) => {
    const grouped = {};
    reservations.filter(r => r.place_id === placeId).forEach(r => {
      if (!grouped[r.time]) grouped[r.time] = [];
      grouped[r.time].push(r);
    });
    return grouped;
  };

  const deletePlace = async (id) => {
    if (!confirm('آیا از حذف این پلاتو مطمئن هستید؟')) return;
    await supabase.from('reservations').delete().eq('place_id', id);
    await supabase.from('places').delete().eq('id', id);
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <p className="text-center text-gray-600">در حال بارگذاری...</p>;
  if (!user) return (
    <div className="text-center mt-8 text-red-600">
      لطفاً ابتدا وارد شوید. <Link href="/auth" className="text-blue-500 underline">صفحه ورود</Link>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">پنل مدیریت پلاتوها</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">خروج</button>
      </div>

      {places.length === 0 && <p className="text-gray-600">هنوز پلاتویی ثبت نکرده‌اید.</p>}

      {places.map(place => (
        <div key={place.id} className="bg-white rounded-xl shadow p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{place.title}</h2>
            <div className="flex gap-4 text-sm">
              <Link href={'/place/' + place.id} className="text-indigo-500 hover:underline">مشاهده</Link>
              <Link href={'/edit/' + place.id} className="text-blue-500 hover:underline">ویرایش</Link>
              <button onClick={() => deletePlace(place.id)} className="text-red-600 hover:underline">حذف</button>
            </div>
          </div>
          <p className="text-sm text-gray-600">📍 {place.address}</p>
          <div className="text-sm text-gray-700">
            <p className="font-medium">رزروها به تفکیک زمان:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(getReservationsGrouped(place.id)).map(([time, entries], idx) => (
                <div key={idx} className="bg-gray-100 p-3 rounded">
                  <p className="text-sm font-semibold mb-1">🕒 {time}</p>
                  <ul className="text-xs text-gray-800 space-y-1">
                    {entries.map((r, i) => (
                      <li key={i}>- {r.name} ({r.phone})</li>
                    ))}
                  </ul>
                </div>
              ))}
              {Object.keys(getReservationsGrouped(place.id)).length === 0 && (
                <p className="text-sm text-gray-500">بدون رزرو</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}