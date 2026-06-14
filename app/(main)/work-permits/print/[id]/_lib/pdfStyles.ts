// ==========================================
// STYLING UNTUK PDF (@react-pdf/renderer)
// ==========================================

import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  // ── Halaman ──────────────────────────────
  page: { padding: 24, fontSize: 9, fontFamily: "Helvetica" },
  pageLandscape: { padding: 15, fontSize: 6, fontFamily: "Helvetica" },

  container: { border: "2px solid black" },
  header: { borderBottom: "2px solid black", padding: 8, textAlign: "center" },
  title: { fontSize: 13, fontWeight: "bold", letterSpacing: 1 },
  docNumber: { fontSize: 8, marginTop: 4, fontWeight: "bold" },

  sectionTitle: {
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid black",
    padding: 4,
    fontWeight: "bold",
    fontSize: 9,
  },

  // ── Baris & Kolom Info ───────────────────
  row: { flexDirection: "row", borderBottom: "1px solid black" },
  col1: {
    width: "5%",
    padding: 4,
    textAlign: "center",
    borderRight: "1px solid black",
  },
  col2: { width: "25%", padding: 4 },
  col3: { width: "2%", padding: 4 },
  col4: { width: "68%", padding: 4, fontWeight: "bold" },

  // ── Durasi Kerja ─────────────────────────
  durasiHeader: {
    width: "25%",
    padding: 6,
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  durasiContent: { width: "75%" },
  durasiRow: { flexDirection: "row" },
  durasiLabel: { width: "30%", padding: 4 },
  durasiVal: { width: "40%", padding: 4, fontWeight: "bold" },

  contentBox: { padding: 8, borderBottom: "1px solid black" },
  listItem: { flexDirection: "row", marginBottom: 3 },
  bullet: { width: 15, textAlign: "center" },

  // ── Tabel JSA ────────────────────────────
  jsaThNo: {
    width: "5%",
    padding: 4,
    textAlign: "center",
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  jsaThLangkah: {
    width: "35%",
    padding: 4,
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  jsaThPotensi: {
    width: "30%",
    padding: 4,
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  jsaThKendali: { width: "30%", padding: 4, fontWeight: "bold" },

  jsaTdNo: {
    width: "5%",
    padding: 4,
    textAlign: "center",
    borderRight: "1px solid black",
  },
  jsaTdJudulJsa: { width: "35%", padding: 4, borderRight: "1px solid black" },
  jsaTdLangkah: { width: "35%", padding: 4, borderRight: "1px solid black" },
  jsaTdPotensi: { width: "30%", padding: 4, borderRight: "1px solid black" },
  jsaTdKendali: { width: "30%", padding: 4 },

  // ── Tabel HIRARC ─────────────────────────
  // Header grup
  hirarcHeaderGroup: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
    fontSize: 6,
    textAlign: "center",
  },

  // Kolom-kolom HIRARC
  hirarcColKegiatan: {
    width: "12%",
    padding: 3,
    borderRight: "1px solid black",
  },
  hirarcColPotensi: {
    width: "12%",
    padding: 3,
    borderRight: "1px solid black",
  },
  hirarcColResiko: { width: "12%", padding: 3, borderRight: "1px solid black" },
  hirarcColPenilaian: { width: "15%", borderRight: "1px solid black" },
  hirarcColPengendalian: {
    width: "18%",
    padding: 3,
    borderRight: "1px solid black",
  },
  hirarcColPenilaian2: { width: "15%", borderRight: "1px solid black" },
  hirarcColStatus: {
    width: "6%",
    padding: 3,
    borderRight: "1px solid black",
    textAlign: "center",
  },
  hirarcColPJ: { width: "10%", padding: 3 },

  // Sub-kolom penilaian (di dalam hirarcColPenilaian)
  hirarcSubKonsekuensi: {
    width: "33.33%",
    padding: 2,
    borderRight: "1px solid black",
    textAlign: "center",
  },
  hirarcSubKemungkinan: {
    width: "33.33%",
    padding: 2,
    borderRight: "1px solid black",
    textAlign: "center",
  },
  hirarcSubTingkat: {
    width: "33.34%",
    padding: 2,
    textAlign: "center",
    fontWeight: "bold",
  },

  // Warna tingkat risiko
  hirarcRiskE: { backgroundColor: "#dc2626", color: "#fff" },
  hirarcRiskH: { backgroundColor: "#fb923c", color: "#fff" },
  hirarcRiskM: { backgroundColor: "#fde047", color: "#000" },
  hirarcRiskL: { backgroundColor: "#4ade80", color: "#fff" },

  // Legenda HIRARC
  hirarcLegendContainer: {
    flexDirection: "row",
    borderTop: "1px solid black",
    fontSize: 5.5,
  },
  hirarcLegendSection: {
    flex: 1,
    borderRight: "1px solid black",
    padding: 4,
  },
  hirarcLegendSectionLast: {
    flex: 1,
    padding: 4,
  },
  hirarcLegendTitle: {
    fontWeight: "bold",
    fontSize: 6,
    marginBottom: 2,
  },
  hirarcLegendText: {
    fontSize: 5.5,
    marginBottom: 1,
  },

  // Matriks risiko kecil
  hirarcMatrixRow: { flexDirection: "row" },
  hirarcMatrixCell: {
    width: 14,
    height: 11,
    border: "0.5px solid black",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 5,
    fontWeight: "bold",
  },
  hirarcMatrixCellWide: {
    width: 20,
    height: 11,
    border: "0.5px solid black",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 5,
    backgroundColor: "#f3f4f6",
  },

  // Info baris HIRARC
  hirarcInfoRow: {
    flexDirection: "row",
    borderBottom: "0.5px solid black",
    fontSize: 7,
  },
  hirarcInfoLabel: { width: 75, padding: 3 },
  hirarcInfoColon: { width: 8, padding: 3 },
  hirarcInfoValue: { flex: 1, padding: 3, fontWeight: "bold" },

  // ── Tanda Tangan ─────────────────────────
  signatureSection: { flexDirection: "row", marginTop: 25 },
  signatureBox: { flex: 1, textAlign: "center" },
  signatureTitle: { marginBottom: 45, fontWeight: "bold" },
  signatureName: {
    fontWeight: "bold",
    textDecoration: "underline",
    textTransform: "uppercase",
  },
  signatureRole: { fontSize: 8, marginTop: 2, fontWeight: "bold" },
  signatureNote: {
    fontSize: 7,
    color: "gray",
    fontStyle: "italic",
    marginTop: 2,
  },

  emptyNote: { fontStyle: "italic", color: "gray" },
});
