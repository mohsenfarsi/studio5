'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Calendar from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
      if (!error) setPlace(data);
      else setError('خطا در بارگذاری پلاتو');
    };

    const fetchDates = async () => {
      const { data } = await supabase.from('reservations').select('date').eq('place_id', id);
      const dates = data?.map(d => d.date);
      setBookedDates(dates || []);
    };

    fetchPlace();
    fetchDates();
  }, [id]);

  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!place) return <p className="text-center mt-6 text-gray-600">در حال بارگذاری...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="aspect-w-16 aspect-h-9 relative w-full h-[300px] rounded-xl overflow-hidden">
            <Image
              src={place.image}
              alt={place.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(place?.amenities || []).map((a, i) => (
              <span key={i} className="bg-gray-100 text-xs px-3 py-1 rounded-full text-gray-600 border">
                {a}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{place.description}</p>

          {place.latitude && place.longitude && (
            <div className="h-[300px] rounded-lg overflow-hidden">
              <Map lat={place.latitude} lng={place.longitude} />
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-indigo-700">{place.title}</h2>
          <p className="text-sm text-gray-500">📍 آدرس: {place.address}</p>
          <p className="text-sm text-gray-500">🗺 منطقه: {place.region || 'نامشخص'}</p>
          <p className="text-sm text-gray-700 font-semibold">💰 قیمت ساعتی: {place.price} تومان</p>

          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-1">🕒 زمان‌های کاری:</p>
            <ul className="list-disc ml-5">
              {(place.times || []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-sm">
            <p className="font-semibold text-indigo-700 mb-2">📅 تاریخ‌های رزرو شده:</p>
            <Calendar
              value={bookedDates}
              multiple
              disabled
              calendar={persian}
              locale={persian_fa}
              className="w-full"
            />
          </div>

          <div className="pt-4 border-t">
            <a href={`/place/${place.id}/reserve`} className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              رزرو آنلاین
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-2">⭐️ امتیاز کاربران</h3>
        <p className="text-sm text-gray-500">در آینده اینجا می‌تونین نظرات و امتیازها رو ببینین.</p>
      </div>
    </div>
  );
}