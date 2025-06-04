'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [region, setRegion] = useState('');
  const [amenity, setAmenity] = useState('');

  const regions = ['شمال تهران', 'مرکز تهران', 'جنوب تهران', 'شرق تهران', 'غرب تهران'];
  const amenities = ['پیانو', 'سیستم صوتی', 'آینه', 'کف‌پوش مخصوص', 'نورپردازی حرفه‌ای'];

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data } = await supabase.from('places').select('*');
      setPlaces(data || []);
      setLoading(false);
    };
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(p => {
    const titleMatch = p.title.toLowerCase().includes(query.toLowerCase().trim());
    const priceMatch = (!minPrice || p.price >= parseInt(minPrice)) && (!maxPrice || p.price <= parseInt(maxPrice));
    const regionMatch = !region || (p.region && p.region.includes(region));
    const amenityMatch = !amenity || (p.amenities && p.amenities.includes(amenity));
    return titleMatch && priceMatch && regionMatch && amenityMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-center text-2xl font-bold text-gray-800">پلاتو مناسب تمرین تئاتر و موسیقی رو پیدا کن</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="جستجوی عنوان"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="قیمت از"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="قیمت تا"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select value={region} onChange={e => setRegion(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">همه مناطق</option>
          {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
        </select>
        <select value={amenity} onChange={e => setAmenity(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">امکانات خاص</option>
          {amenities.map((a, i) => <option key={i} value={a}>{a}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredPlaces.map(place => (
            <div key={place.id} className="bg-white rounded-2xl border shadow hover:shadow-md transition-all overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">{place.title}</h2>
                <p className="text-sm text-gray-500">{place.address}</p>
                <p className="text-sm text-gray-600">{place.region || 'منطقه نامشخص'}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-indigo-600 font-bold">هر ساعت {place.price} تومان</p>
                  <Link href={'/place/' + place.id}>
                    <span className="bg-indigo-600 text-white text-xs rounded px-3 py-1 hover:bg-indigo-700">مشاهده</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredPlaces.length === 0 && (
            <p className="text-center col-span-full text-gray-500">نتیجه‌ای مطابق فیلترها پیدا نشد.</p>
          )}
        </div>
      )}
    </div>
  );
}