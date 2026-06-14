// ==========================================
// PDF HALAMAN: SOP (Standar Operasional Prosedur)
// ==========================================

import { Page, View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Permit } from "../_lib/types";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    padding: 24,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    border: "2px solid black",
    borderBottom: "2px solid black",
    padding: 6,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  headerSub: {
    fontSize: 7,
    textAlign: "center",
    marginTop: 2,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  headerDoc: { fontSize: 7, textAlign: "center", marginTop: 1 },

  // Section rows
  sectionRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    borderLeft: "2px solid black",
    borderRight: "2px solid black",
  },
  sectionLabel: {
    width: 90,
    borderRight: "1px solid black",
    padding: 6,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textTransform: "uppercase",
  },
  sectionContent: { flex: 1, padding: 6 },

  // Equipment grid
  equipRow: { flexDirection: "row" },
  equipCol: { flex: 1 },
  equipItem: { flexDirection: "row", marginBottom: 2 },
  equipNum: {
    width: 14,
    textAlign: "right",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  equipText: { flex: 1, fontSize: 7, paddingLeft: 4 },

  // Uraian kegiatan
  uraianJudul: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    marginBottom: 1,
  },
  uraianItem: { fontSize: 7, paddingLeft: 8, marginBottom: 1, lineHeight: 1.4 },

  // Sub doc header (jika >1 SOP)
  subDocHeader: {
    borderLeft: "2px solid black",
    borderRight: "2px solid black",
    borderBottom: "1px solid black",
    backgroundColor: "#f9fafb",
    padding: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textTransform: "uppercase",
  },

  // Border bottom terakhir
  borderBottom: {
    borderBottom: "2px solid black",
    borderLeft: "2px solid black",
    borderRight: "2px solid black",
  },

  // Tanda tangan
  signatureSection: { flexDirection: "row", marginTop: 24 },
  signatureBox: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  signatureTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    textTransform: "uppercase",
  },
  signatureRole: { fontSize: 6, marginTop: 2, fontFamily: "Helvetica-Bold" },
  signatureNote: {
    fontSize: 6,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 2,
  },
});

// ── Helper: render equipment grid dua kolom ───────────────────────────────────
const EquipmentGrid = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    return (
      <Text style={{ fontSize: 7, fontStyle: "italic", color: "gray" }}>-</Text>
    );
  }
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);

  return (
    <View style={s.equipRow}>
      <View style={s.equipCol}>
        {col1.map((item, i) => (
          <View key={i} style={s.equipItem}>
            <Text style={s.equipNum}>{i + 1}</Text>
            <Text style={s.equipText}>{item}</Text>
          </View>
        ))}
      </View>
      {col2.length > 0 && (
        <View style={s.equipCol}>
          {col2.map((item, i) => (
            <View key={i} style={s.equipItem}>
              <Text style={s.equipNum}>{half + i + 1}</Text>
              <Text style={s.equipText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ── Tanda tangan ─────────────────────────────────────────────────────────────
const SopSignatures = ({ permit }: { permit: Permit }) => (
  <View style={s.signatureSection}>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>
        {"Disusun Oleh,\nPenanggung Jawab Teknik"}
      </Text>
      <Text style={s.signatureName}>{permit.pjTeknik?.nama}</Text>
      <Text style={s.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>{"Diperiksa Oleh,\nTenaga Ahli K3"}</Text>
      <Text style={s.signatureName}>{permit.tenagaAhliK3?.nama}</Text>
      <Text style={s.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>{"Disetujui Oleh,\nDirektur"}</Text>
      {permit.status === "approved_director" ? (
        <>
          <Text style={s.signatureName}>BILAL YURINATA</Text>
          <Text style={s.signatureNote}>Telah disetujui secara digital</Text>
        </>
      ) : (
        <Text style={[s.signatureNote, { color: "red" }]}>
          (Belum Disahkan)
        </Text>
      )}
    </View>
  </View>
);

// ── Main PDF Page ─────────────────────────────────────────────────────────────
export const SopPage = ({ permit }: { permit: Permit }) => {
  const sopDocs = Array.isArray(permit.sopData) ? permit.sopData : [];

  return (
    <Page size="A4" style={s.page}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Standar Operasional Prosedur (SOP)</Text>
        <Text style={s.headerSub}>{permit.pekerjaan?.namaPekerjaan}</Text>
        <Text style={s.headerDoc}>NOMOR DOKUMEN: {permit.nomorWP}</Text>
      </View>

      {sopDocs.length === 0 ? (
        <Text
          style={{
            padding: 12,
            textAlign: "center",
            fontStyle: "italic",
            color: "gray",
            fontSize: 8,
          }}
        >
          Tidak ada data SOP terlampir.
        </Text>
      ) : (
        sopDocs.map((sop, idx) => (
          <View key={idx}>
            {/* Sub-judul jika lebih dari 1 dokumen */}
            {sopDocs.length > 1 && (
              <View style={s.subDocHeader}>
                <Text>{sop.judulSop || `SOP #${idx + 1}`}</Text>
              </View>
            )}

            {/* Perlengkapan K3 */}
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Perlengkapan K3</Text>
              <View style={s.sectionContent}>
                <EquipmentGrid items={sop.perlengkapanKerja ?? []} />
              </View>
            </View>

            {/* Peralatan Ukur dan Uji */}
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>{"Peralatan Ukur\ndan Uji"}</Text>
              <View style={s.sectionContent}>
                <EquipmentGrid items={sop.peralatanUkur ?? []} />
              </View>
            </View>

            {/* Peralatan Kerja */}
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Peralatan Kerja</Text>
              <View style={s.sectionContent}>
                <EquipmentGrid items={sop.peralatanKerja ?? []} />
              </View>
            </View>

            {/* Uraian Kegiatan */}
            <View style={[s.sectionRow, s.borderBottom]}>
              <Text style={s.sectionLabel}>Uraian Kegiatan</Text>
              <View style={s.sectionContent}>
                {(sop.judulUraianKegiatan ?? []).length > 0
                  ? (sop.judulUraianKegiatan ?? []).map((judul, i) => {
                      const nextJudulIdx = (
                        sop.judulUraianKegiatan ?? []
                      ).findIndex((_, ji) => ji > i);
                      const uraianSlice = (sop.uraianKegiatan ?? []).slice(
                        i,
                        nextJudulIdx === -1 ? undefined : nextJudulIdx,
                      );
                      return (
                        <View key={i} style={{ marginTop: i > 0 ? 4 : 0 }}>
                          {/* ✅ Judul TEBAL */}
                          {judul ? (
                            <Text style={s.uraianJudul}>{judul}</Text>
                          ) : null}
                          {uraianSlice.map((uraian, ui) => (
                            <Text key={ui} style={s.uraianItem}>
                              {uraian}
                            </Text>
                          ))}
                        </View>
                      );
                    })
                  : // Fallback: render uraianKegiatan langsung dengan deteksi judul
                    (sop.uraianKegiatan ?? []).map((uraian, i) => {
                      const trimmed = uraian.trim();
                      const isJudul =
                        /^[A-Z]\.\s/.test(trimmed) ||
                        /^[A-Z]\d+\.\s/.test(trimmed);
                      return (
                        <Text
                          key={i}
                          style={isJudul ? s.uraianJudul : s.uraianItem}
                        >
                          {trimmed}
                        </Text>
                      );
                    })}
              </View>
            </View>
          </View>
        ))
      )}

      <SopSignatures permit={permit} />
    </Page>
  );
};
