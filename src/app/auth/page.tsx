'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error(error);
      setError('ارسال ایمیل با مشکل مواجه شد.');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-indigo-700">ورود با ایمیل</h2>
      {submitted ? (
        <p className="text-green-600">لینک ورود برای شما ایمیل شد. لطفاً ایمیل خود را بررسی کنید.</p>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="ایمیل شما"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">ارسال لینک ورود</button>
        </form>
      )}
    </div>
  );
}