// ==========================================
// HELPER FUNCTIONS
// ==========================================

import { Permit } from "./types";

export const formatTanggal = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ✅ Pelaksana sekarang di root level, fallback ke jsaData[0].pelaksana untuk data lama
export const getPelaksanaList = (permit: Permit): string[] => {
  const rootPelaksana = permit.pelaksana ?? [];
  if (Array.isArray(rootPelaksana) && rootPelaksana.length > 0) {
    return rootPelaksana.map((p) => (typeof p === "object" ? p.nama : p));
  }
  return [];
};

// ✅ Helper warna tingkat risiko untuk HTML
export const getRiskColorClass = (level: string): string => {
  switch (level?.toUpperCase()) {
    case "E":
      return "bg-red-600 text-white";
    case "H":
      return "bg-orange-400 text-white";
    case "M":
      return "bg-yellow-300 text-black";
    case "L":
      return "bg-green-400 text-white";
    default:
      return "";
  }
};

// ✅ Helper style tingkat risiko untuk PDF
export const getRiskStyleKey = (
  level: string,
): "hirarcRiskE" | "hirarcRiskH" | "hirarcRiskM" | "hirarcRiskL" | null => {
  switch (level?.toUpperCase()) {
    case "E":
      return "hirarcRiskE";
    case "H":
      return "hirarcRiskH";
    case "M":
      return "hirarcRiskM";
    case "L":
      return "hirarcRiskL";
    default:
      return null;
  }
};
