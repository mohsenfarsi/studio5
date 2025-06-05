export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head />
      <body className="min-h-screen flex flex-col">
        <header className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <img src="/logo.png" alt="Studio 5 Logo" className="h-10" />
            <nav className="space-x-4">
              <a href="/" className="text-blue-600">خانه</a>
              <a href="/places" className="text-blue-600">پلاتوها</a>
              <a href="/bookings" className="text-blue-600">رزروها</a>
              <a href="/contact" className="text-blue-600">تماس</a>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="bg-gray-100 text-center text-sm p-4 mt-8">
          © 2025 استودیو ۵. تمامی حقوق محفوظ است.
        </footer>
      </body>
    </html>
  );
}
