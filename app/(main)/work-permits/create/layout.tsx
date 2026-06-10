"use client";

import { createContext, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FileText,
  ShieldAlert,
  Activity,
  ClipboardList,
  BookOpen,
  Lock,
} from "lucide-react";

// 1. Buat Context untuk menyimpan seluruh data form
export const WorkPermitFormContext = createContext<any>(null);

const TABS = [
  {
    name: "Work Permit",
    path: "/work-permits/create/work-permit",
    icon: FileText,
  },
  { name: "JSA", path: "/work-permits/create/jsa", icon: ShieldAlert },
  { name: "HIRARC", path: "/work-permits/create/hirarc", icon: Activity },
  { name: "SOP", path: "/work-permits/create/sop", icon: ClipboardList },
  { name: "Instruksi Kerja", path: "/work-permits/create/ik", icon: BookOpen },
];

export default function CreateWorkPermitLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // 2. State Global untuk SEMUA Tab (Sudah lengkap sesuai Model Mongoose)
  const [formData, setFormData] = useState({
    // --- Data WP Utama ---
    pekerjaanId: "",
    lokasi: "",
    tanggalMulai: "",
    waktuMulai: "",
    tanggalSelesai: "",
    waktuSelesai: "",
    pjTeknik: "",
    noTelpPjTeknik: "",
    tenagaAhliK3: "",
    noTelpTenagaAhliK3: "",

    // --- Data Dokumen (Template Autofill) ---
    wpKlasifikasi: "",
    wpProsedur: "",
    wpLampiran: "",

    // PENAMBAHAN: State untuk menyimpan Array pekerja yang dicentang
    jsaPelaksana: [],
    jsaLangkah: "",
    jsaBahaya: "",
    jsaPengendalian: "",

    hirarcPotensi: "",
    hirarcResiko: "",
    hirarcPengendalian: "",
    hirarcPenanggungJawab: "",
    hirarcKeparahan: "",
    hirarcKemungkinan: "",
    hirarcTingkat: "",
    hirarcKeparahanSetelah: "",
    hirarcKemungkinanSetelah: "",
    hirarcTingkatSetelah: "",
    hirarcStatusPengendalian: "",

    sopPerlengkapan: "",
    sopAlatUkur: "",
    sopAlatKerja: "",
    sopUraian: "",

    ikPerlengkapan: "",
    ikAlatUkur: "",
    ikAlatKerja: "",
    ikUraian: "",
  });

  // ======================================================================
  // FUNGSI VALIDASI AKSES TAB (PENJAGA KEAMANAN ROUTING)
  // ======================================================================

  // Syarat Lulus Tab 1 (Work Permit)
  const isWpValid = () => {
    return !!(
      formData.pekerjaanId &&
      formData.lokasi &&
      formData.tanggalMulai &&
      formData.waktuMulai &&
      formData.tanggalSelesai &&
      formData.waktuSelesai &&
      formData.pjTeknik &&
      formData.noTelpPjTeknik &&
      formData.tenagaAhliK3 &&
      formData.noTelpTenagaAhliK3
    );
  };

  // Syarat Lulus Tab 2 (JSA)
  const isJsaValid = () => {
    return (
      isWpValid() && formData.jsaPelaksana && formData.jsaPelaksana.length > 0
    );
  };

  // Fungsi master untuk mengecek apakah sebuah tab index boleh diakses
  const canAccessTab = (index: number) => {
    if (index === 0) return true; // Tab WP selalu bisa diakses
    if (index === 1) return isWpValid(); // Tab JSA butuh form WP terisi
    if (index >= 2) return isJsaValid(); // Tab HIRARC, SOP, IK butuh form WP dan Pelaksana terisi
    return false;
  };

  return (
    <WorkPermitFormContext.Provider value={{ formData, setFormData }}>
      <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Buat Work Permit
          </h1>
          <p className="text-gray-500 mt-1">
            Lengkapi dokumen K3 secara berurutan.
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = pathname.includes(tab.path);
            const isUnlocked = canAccessTab(index);

            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => isUnlocked && router.push(tab.path)}
                disabled={!isUnlocked} // Mengunci tombol jika belum valid
                className={`flex items-center gap-2 py-3 px-6 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : isUnlocked
                      ? "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
                      : "border-transparent text-gray-300 cursor-not-allowed bg-gray-50/30"
                }`}
                title={
                  !isUnlocked ? "Lengkapi tab sebelumnya untuk membuka" : ""
                }
              >
                <Icon
                  className={`w-4 h-4 ${!isUnlocked ? "text-gray-300" : ""}`}
                />
                {tab.name}

                {/* Menampilkan Ikon Gembok jika tab belum bisa diakses */}
                {!isUnlocked && <Lock className="w-3 h-3 text-gray-300 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* AREA KONTEN FOLDER */}
        <div>{children}</div>
      </div>
    </WorkPermitFormContext.Provider>
  );
}
