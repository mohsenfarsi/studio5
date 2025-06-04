import './globals.css';

export const metadata = {
  title: 'استودیو ۵',
  description: 'پلتفرم رزرو پلاتوی تمرین تئاتر و موسیقی',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">استودیو ۵</h1>
            <nav className="space-x-4 rtl:space-x-reverse">
              <a href="/" className="text-sm hover:text-indigo-500">خانه</a>
              <a href="/add" className="text-sm hover:text-indigo-500">ثبت پلاتو</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}