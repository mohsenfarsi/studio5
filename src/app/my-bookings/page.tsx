'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MyBookings() {
  const [reservations, setReservations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data: placesData } = await supabase.from('places').select('*');
      setPlaces(placesData || []);

      const { data: resData } = await supabase.from('reservations').select('*').eq('user_email', user?.email);
      setReservations(resData || []);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const findPlace = (id) => places.find(p => p.id === id);

  if (loading) return <p className="text-center mt-10 text-gray-600">در حال دریافت اطلاعات...</p>;
  if (!user) return (
    <div className="text-center mt-8 text-red-600">
      لطفاً ابتدا وارد شوید. <Link href="/auth" className="text-blue-500 underline">صفحه ورود</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">رزروهای من</h1>
      {reservations.length === 0 ? (
        <p className="text-gray-600">شما هنوز رزروی ثبت نکرده‌اید.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r, idx) => {
            const place = findPlace(r.place_id);
            return (
              <div key={idx} className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800">{place?.title || '---'}</h2>
                <p className="text-sm text-gray-600">آدرس: {place?.address}</p>
                <p className="text-sm text-gray-600">🕒 زمان رزرو: {r.time}</p>
                <p className="text-sm text-gray-600">📅 تاریخ: {new Date(r.created_at).toLocaleString('fa-IR')}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}