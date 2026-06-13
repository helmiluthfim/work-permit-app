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

export const getPelaksanaList = (permit: Permit): string[] => {
  const rootPelaksana = permit.pelaksana ?? [];
  if (Array.isArray(rootPelaksana) && rootPelaksana.length > 0) {
    return rootPelaksana.map((p) => (typeof p === "object" ? p.nama : p));
  }

  const legacyPelaksana = permit.jsaData?.[0]?.pelaksana ?? [];
  return Array.isArray(legacyPelaksana)
    ? legacyPelaksana.map((p) => (typeof p === "object" ? p.nama : p))
    : [];
};
