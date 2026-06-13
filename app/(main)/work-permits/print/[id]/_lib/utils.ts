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

export const getPelaksanaList = (permit: Permit): string[] =>
  permit.jsaData?.pelaksana?.map((p) => (typeof p === "object" ? p.nama : p)) ??
  [];
