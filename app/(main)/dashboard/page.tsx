"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Struktur data dummy untuk sementara (nanti diganti fetch dari API)
interface WorkPermitSummary {
  _id: string;
  nomorWP: string;
  namaPekerjaan: string;
  lokasi: string;
  tanggalMulai: string;
  status:
    | "draft"
    | "submitted"
    | "approved_k3"
    | "approved_director"
    | "rejected";
  catatanPenolakan?: string;
}

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // State untuk menyimpan daftar Work Permit
  const [workPermits, setWorkPermits] = useState<WorkPermitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [router, sessionStatus]);

  // Fungsi fetch data dari API (sementara pakai data dummy jika API belum siap)
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (sessionStatus !== "authenticated") return;

      setIsLoading(true); // Pastikan loading dimulai
      try {
        const res = await fetch("/api/work-permits");
        const result = await res.json();

        if (result.success) {
          // Langsung gunakan data dari API dan HAPUS data dummy
          setWorkPermits(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
        // Tambahkan notifikasi error jika diperlukan
      } finally {
        setIsLoading(false); // Matikan loading setelah selesai
      }
    };

    fetchDashboardData();
  }, [sessionStatus]);

  // Helper untuk menentukan warna dan ikon badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: FileText,
          label: "Draft",
        };
      case "submitted":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Clock,
          label: "Menunggu Review K3",
        };
      case "approved_k3":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          label: "Disetujui K3",
        };
      case "approved_director":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: CheckCircle,
          label: "Disetujui Direktur",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
          label: "Ditolak",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: AlertCircle,
          label: status,
        };
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === "authenticated") {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen w-full animate-in fade-in duration-300">
        {/* HEADER AREA: Sapaan & Tombol Aksi Utama */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Halo, {session?.user?.username || "Pengguna"} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Pantau dan kelola seluruh pengajuan Work Permit Anda di sini.
            </p>
          </div>

          {/* Tombol Buat Work Permit (Hanya untuk PJ_TEKNIK) */}
          {session?.user?.role === "PJ_TEKNIK" && (
            <button
              onClick={() => router.push("/work-permits/create")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Izin Kerja Baru</span>
            </button>
          )}
        </div>

        {/* AREA DAFTAR WORK PERMIT */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">
              Daftar Pengajuan Terakhir
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : workPermits.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p>Belum ada dokumen Work Permit yang diajukan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Nomor WP</th>
                    <th className="px-6 py-4">Pekerjaan</th>
                    <th className="px-6 py-4">Pelaksanaan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {workPermits.map((wp) => {
                    const badge = getStatusBadge(wp.status);
                    const StatusIcon = badge.icon;

                    return (
                      <tr
                        key={wp._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-medium text-gray-600">
                          {wp.nomorWP}
                        </td>
                        <td className="px-6 py-4">
                          {/* Perhatikan akses properti: wp.pekerjaan.namaPekerjaan */}
                          <p className="font-bold text-gray-900">
                            {wp.pekerjaan?.namaPekerjaan ||
                              "Pekerjaan Tidak Ditemukan"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {wp.lokasi}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {wp.tanggalMulai}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {badge.label}
                          </span>

                          {wp.status === "rejected" && wp.catatanPenolakan && (
                            <p
                              className="text-[10px] text-red-500 mt-1.5 max-w-[200px] truncate"
                              title={wp.catatanPenolakan}
                            >
                              Catatan: {wp.catatanPenolakan}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              router.push(`/work-permits/${wp._id}`)
                            }
                            className="inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
