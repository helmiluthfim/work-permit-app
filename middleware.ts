import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Halaman yang bisa diakses tanpa login
const publicRoutes = ["/", "/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cek apakah route ini termasuk public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Ambil token JWT dari cookie — secret harus sama dengan di authOption
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Jika belum login dan mencoba akses halaman protected → redirect ke /login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba buka /login → redirect ke /dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua route KECUALI:
     * - api/auth  → wajib dilewati agar NextAuth bisa bekerja (login, session, dll.)
     * - _next/static  (file statis Next.js)
     * - _next/image   (optimasi gambar Next.js)
     * - favicon.ico
     * - file dengan ekstensi (png, jpg, svg, dll.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
