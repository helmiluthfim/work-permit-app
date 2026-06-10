// Contoh isi app/page.tsx (Opsi A)
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-black">
      <h1 className="text-4xl font-bold mb-2">Sistem Perizinan Kerja K3</h1>
      <p className="mb-8 text-lg text-gray-600">PT Eksavindo Mitra Mandiri</p>

      <Link
        href="/login"
        className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Silakan Login
      </Link>
    </div>
  );
}
