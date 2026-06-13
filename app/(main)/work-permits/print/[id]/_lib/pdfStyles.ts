// ==========================================
// STYLING UNTUK PDF (@react-pdf/renderer)
// ==========================================

import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: "Helvetica" },
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

  // Durasi Kerja
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

  // JSA Table
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
  jsaTdLangkah: { width: "35%", padding: 4, borderRight: "1px solid black" },
  jsaTdPotensi: { width: "30%", padding: 4, borderRight: "1px solid black" },
  jsaTdKendali: { width: "30%", padding: 4 },

  // Signatures
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
