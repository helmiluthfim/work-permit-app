// ==========================================
// PDF HALAMAN: HIRARC (PERBAIKAN HEADER TABEL)
// ==========================================

import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { Permit } from "../_lib/types";
import { formatTanggal } from "../_lib/utils";
import type { SignatureQrCodes } from "../_lib/qrcode";

const SignatureQr = ({ qrDataUrl }: { qrDataUrl?: string | null }) => {
  if (!qrDataUrl || qrDataUrl.trim() === "") return null;

  let formattedSrc = qrDataUrl;
  if (formattedSrc.startsWith("ey") || !formattedSrc.startsWith("data:")) {
    formattedSrc = `data:image/png;base64,${formattedSrc}`;
  }

  return (
    <View style={{ alignSelf: "center", alignItems: "center" }}>
      <Image
        src={formattedSrc}
        style={{
          width: 55,
          height: 55,
          alignSelf: "center",
        }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 6,
    padding: 20,
    backgroundColor: "#fff",
  },

  mainBox: {
    borderWidth: 1,
    borderColor: "#000",
  },

  // ── Header Dokumen ──
  header: {
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 6,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 2,
  },
  headerDoc: { fontSize: 6, textAlign: "center", marginTop: 2 },

  // ── Info Unit ──
  infoRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000" },
  infoLabel: { width: 75, padding: 3 },
  infoColon: { width: 10, padding: 3, textAlign: "center" },
  infoValue: { flex: 1, padding: 3, fontFamily: "Helvetica-Bold" },

  // ── Tabel Header Utama (DITINGGIKAN DENGAN PADDING & MIN-HEIGHT) ──
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    minHeight: 28, // Menjamin tinggi minimum header agar seimbang ke kanan
    alignItems: "stretch",
  },
  textBoldCenter: { fontFamily: "Helvetica-Bold", textAlign: "center" },

  // Komponen kolom utama ditinggikan pading-nya agar teks di dalamnya aman
  colKegiatan: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  colPotensi: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  colResiko: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  colPenilaianWrap: {
    width: "15%",
    borderRightWidth: 1,
    borderColor: "#000",
    flexDirection: "column",
  },
  colPengendalian: {
    width: "18%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  colStatus: {
    width: "6%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  colPJ: { width: "10%", padding: 4, justifyContent: "center" },

  // Sub-kolom Penilaian Resiko Header (DISESUAIKAN AGAR TIDAK NABRAK GARIS)
  penilaianTitle: {
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  penilaianCols: { flexDirection: "row", flex: 1, alignItems: "stretch" },

  // Ukuran font diturunkan ke 4.5px & lineHeight disesuaikan agar tulisan menumpuk rapi di dalam kotak
  subColKonsekuensi: {
    width: "33.33%",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 1,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  subColKemungkinan: {
    width: "33.33%",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 1,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  subColTingkat: {
    width: "33.34%",
    paddingHorizontal: 1,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  subHeaderText: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: 4.5,
    lineHeight: 1.1,
  },

  // ── Tabel Body ──
  bodyContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  bodyKegiatanMerged: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyRightSide: {
    width: "88%",
    flexDirection: "column",
  },
  bodySubRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  bodySubRowLast: { flexDirection: "row" },

  bcPotensi: {
    width: "13.64%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
  },
  bcResiko: {
    width: "13.64%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
  },
  bcPenilaianWrap: {
    width: "17.05%",
    borderRightWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
  },
  bcPengendalian: {
    width: "20.45%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
  },
  bcPenilaianWrap2: {
    width: "17.05%",
    borderRightWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
  },
  bcStatus: {
    width: "6.82%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    justifyContent: "center",
  },
  bcPJ: { width: "11.36%", padding: 3, justifyContent: "center" },

  // ── Legenda Section ──
  legendContainer: { flexDirection: "row" },
  legendSection: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  legendSectionLast: { flex: 1, padding: 4 },
  legendTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  legendText: { fontSize: 5.5, marginBottom: 1.5 },

  // ── Tabel Matriks Full Width ──
  matrixTable: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000",
    marginTop: 2,
  },
  matrixRow: { flexDirection: "row" },
  matrixCellFirst: {
    width: "30%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  matrixCellSpan: {
    width: "70%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  matrixCellData: {
    width: "14%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  matrixTextBold: { fontFamily: "Helvetica-Bold", fontSize: 5 },

  // ── Pewarnaan Risiko ──
  riskE: { backgroundColor: "#dc2626", color: "#fff" },
  riskH: { backgroundColor: "#fb923c", color: "#fff" },
  riskM: { backgroundColor: "#fde047", color: "#000" },
  riskL: { backgroundColor: "#4ade80", color: "#fff" },

  // ── Tanda Tangan ──
  signatureSection: { flexDirection: "row", marginTop: 16 },
  signatureBox: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  signatureTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 30,
  },
  signatureName: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    textTransform: "uppercase",
  },
  signatureRole: { fontSize: 6, marginTop: 2, fontFamily: "Helvetica-Bold" },
  signatureNote: {
    fontSize: 5.5,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 2,
  },
});

// Helper Warna Risiko
const getRiskStyle = (level: string) => {
  switch (level) {
    case "E":
      return s.riskE;
    case "H":
      return s.riskH;
    case "M":
      return s.riskM;
    case "L":
      return s.riskL;
    default:
      return {};
  }
};

const RISK_MATRIX = [
  { kemungkinan: "A", cols: ["M", "M", "H", "E", "E"] },
  { kemungkinan: "B", cols: ["L", "M", "H", "E", "E"] },
  { kemungkinan: "C", cols: ["L", "M", "H", "H", "E"] },
  { kemungkinan: "D", cols: ["L", "L", "M", "H", "E"] },
  { kemungkinan: "E", cols: ["L", "L", "M", "H", "H"] },
];

const HirarcSignatures = ({
  permit,
  qrCodes,
}: {
  permit: Permit;
  qrCodes?: SignatureQrCodes;
}) => (
  <View style={s.signatureSection}>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>
        {"Disusun Oleh,\nPenanggung Jawab Teknik"}
      </Text>
      <SignatureQr qrDataUrl={qrCodes?.pjTeknik} />
      <Text style={s.signatureName}>{permit.pjTeknik?.nama}</Text>
      <Text style={s.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>{"Diperiksa Oleh,\nTenaga Ahli K3"}</Text>
      <SignatureQr qrDataUrl={qrCodes?.tenagaAhliK3} />
      <Text style={s.signatureName}>{permit.tenagaAhliK3?.nama}</Text>
      <Text style={s.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={s.signatureBox}>
      <Text style={s.signatureTitle}>{"Disetujui Oleh,\nDirektur"}</Text>
      {permit.status === "approved_director" ? (
        <>
          <SignatureQr qrDataUrl={qrCodes?.direktur} />
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

export const HirarcPage = ({
  permit,
  qrCodes,
}: {
  permit: Permit;
  qrCodes?: SignatureQrCodes;
}) => {
  const h = permit.hirarcData;
  const rows = h?.potensiBahaya ?? [];

  return (
    <Page size="A4" orientation="landscape" style={s.page}>
      <View style={s.mainBox}>
        {/* 1. Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>
            Hazard Identification, Risk Assessment and Risk Control (HIRARC)
          </Text>
          <Text style={s.headerSub}>
            Identifikasi Bahaya, Penilaian, dan Pengendalian Resiko (IBPPR)
          </Text>
          <Text style={s.headerDoc}>NOMOR DOKUMEN: {permit.nomorWP}</Text>
        </View>

        {/* 2. Info Unit */}
        <View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nama Unit</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={[s.infoValue, { flex: 2 }]}>
              PT PLN (Persero) UID Lampung UP3 Metro ULP Sukadana
            </Text>
            <Text style={s.infoLabel}>Tanggal</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={s.infoValue}>
              {formatTanggal(permit.tanggalMulai)} –{" "}
              {formatTanggal(permit.tanggalSelesai)}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Bidang</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={[s.infoValue, { flex: 2 }]}>
              Distribusi Tegangan Rendah
            </Text>
            <Text style={s.infoLabel}>Pengawas K3</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={s.infoValue}>{permit.tenagaAhliK3?.nama}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Jenis Pekerjaan</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={[s.infoValue, { flex: 2 }]}>
              {permit.pekerjaan?.namaPekerjaan}
            </Text>
            <Text style={s.infoLabel}>Pengawas Pekerjaan</Text>
            <Text style={s.infoColon}>:</Text>
            <Text style={s.infoValue}>{permit.pjTeknik?.nama}</Text>
          </View>
        </View>

        {/* 3. Header Tabel HIRARC (Pembaruan Gaya Struktur) */}
        <View style={s.tableHeaderRow}>
          <View style={s.colKegiatan}>
            <Text style={s.textBoldCenter}>Kegiatan</Text>
          </View>
          <View style={s.colPotensi}>
            <Text style={s.textBoldCenter}>Potensi Bahaya</Text>
          </View>
          <View style={s.colResiko}>
            <Text style={s.textBoldCenter}>Resiko</Text>
          </View>

          <View style={s.colPenilaianWrap}>
            <View style={s.penilaianTitle}>
              <Text style={s.textBoldCenter}>Penilaian Resiko</Text>
            </View>
            <View style={s.penilaianCols}>
              <View style={s.subColKonsekuensi}>
                <Text style={s.subHeaderText}>
                  Konsekuensi /{"\n"}Keparahan
                </Text>
              </View>
              <View style={s.subColKemungkinan}>
                <Text style={s.subHeaderText}>Kemung-{"\n"}kinan</Text>
              </View>
              <View style={s.subColTingkat}>
                <Text style={s.subHeaderText}>Tingkat{"\n"}Resiko</Text>
              </View>
            </View>
          </View>

          <View style={s.colPengendalian}>
            <Text style={s.textBoldCenter}>Pengendalian Resiko</Text>
          </View>

          <View style={s.colPenilaianWrap}>
            <View style={s.penilaianTitle}>
              <Text style={s.textBoldCenter}>Penilaian Resiko</Text>
            </View>
            <View style={s.penilaianCols}>
              <View style={s.subColKonsekuensi}>
                <Text style={s.subHeaderText}>
                  Konsekuensi /{"\n"}Keparahan
                </Text>
              </View>
              <View style={s.subColKemungkinan}>
                <Text style={s.subHeaderText}>Kemung-{"\n"}kinan</Text>
              </View>
              <View style={s.subColTingkat}>
                <Text style={s.subHeaderText}>Tingkat{"\n"}Resiko</Text>
              </View>
            </View>
          </View>

          <View style={s.colStatus}>
            <Text style={s.textBoldCenter}>Status{"\n"}Pengendalian</Text>
          </View>
          <View style={s.colPJ}>
            <Text style={s.textBoldCenter}>Penanggung Jawab</Text>
          </View>
        </View>

        {/* 4. Body Tabel HIRARC */}
        {rows.length > 0 ? (
          <View style={s.bodyContainer}>
            <View style={s.bodyKegiatanMerged}>
              <Text style={s.textBoldCenter}>
                {permit.pekerjaan?.namaPekerjaan}
              </Text>
            </View>

            <View style={s.bodyRightSide}>
              {rows.map((potensi: string, i: number) => {
                const isLast = i === rows.length - 1;
                return (
                  <View
                    key={i}
                    style={isLast ? s.bodySubRowLast : s.bodySubRow}
                  >
                    <Text style={s.bcPotensi}>{potensi || "-"}</Text>
                    <Text style={s.bcResiko}>{h?.resiko?.[i] || "-"}</Text>

                    {/* Penilaian Awal */}
                    <View style={s.bcPenilaianWrap}>
                      <View style={s.subColKonsekuensi}>
                        <Text style={{ textAlign: "center" }}>
                          {h?.konsekuensiKeparahan?.[i] || "-"}
                        </Text>
                      </View>
                      <View style={s.subColKemungkinan}>
                        <Text style={{ textAlign: "center" }}>
                          {h?.kemungkinanTerjadi?.[i] || "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          s.subColTingkat,
                          getRiskStyle(h?.tingkatResiko?.[i] || ""),
                        ]}
                      >
                        <Text style={s.textBoldCenter}>
                          {h?.tingkatResiko?.[i] || "-"}
                        </Text>
                      </View>
                    </View>

                    <Text style={s.bcPengendalian}>
                      {h?.pengendalian?.[i] || "-"}
                    </Text>

                    {/* Penilaian Setelah Pengendalian */}
                    <View style={s.bcPenilaianWrap2}>
                      <View style={s.subColKonsekuensi}>
                        <Text style={{ textAlign: "center" }}>
                          {h?.konsekuensiSetelahPengendalian?.[i] || "-"}
                        </Text>
                      </View>
                      <View style={s.subColKemungkinan}>
                        <Text style={{ textAlign: "center" }}>
                          {h?.kemungkinanTerjadiSetelahPengendalian?.[i] || "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          s.subColTingkat,
                          getRiskStyle(
                            h?.tingkatResikoSetelahPengendalian?.[i] || "",
                          ),
                        ]}
                      >
                        <Text style={s.textBoldCenter}>
                          {h?.tingkatResikoSetelahPengendalian?.[i] || "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={s.bcStatus}>
                      <Text style={s.textBoldCenter}>
                        {h?.statusPengendalian || "Open"}
                      </Text>
                    </View>
                    <View style={s.bcPJ}>
                      <Text>{h?.penanggungJawab?.[i] || "-"}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View
            style={[
              s.bodyContainer,
              { borderBottomWidth: 1, padding: 8, justifyContent: "center" },
            ]}
          >
            <Text style={{ fontStyle: "italic" }}>
              Tidak ada data HIRARC terlampir.
            </Text>
          </View>
        )}

        {/* 5. Legenda & Matriks */}
        <View style={s.legendContainer}>
          <View style={s.legendSection}>
            <View style={s.matrixTable}>
              <View style={s.matrixRow}>
                <View style={s.matrixCellFirst}>
                  <Text style={s.matrixTextBold}>Kemungkinan</Text>
                </View>
                <View style={s.matrixCellSpan}>
                  <Text style={s.matrixTextBold}>Konsekuensi</Text>
                </View>
              </View>
              <View style={s.matrixRow}>
                <View style={s.matrixCellFirst} />
                {[1, 2, 3, 4, 5].map((n) => (
                  <View key={n} style={s.matrixCellData}>
                    <Text style={s.matrixTextBold}>{n}</Text>
                  </View>
                ))}
              </View>
              {RISK_MATRIX.map(({ kemungkinan, cols }) => (
                <View key={kemungkinan} style={s.matrixRow}>
                  <View style={s.matrixCellFirst}>
                    <Text style={s.matrixTextBold}>{kemungkinan}</Text>
                  </View>
                  {cols.map((level, ci) => (
                    <View
                      key={ci}
                      style={[s.matrixCellData, getRiskStyle(level)]}
                    >
                      <Text style={s.matrixTextBold}>{level}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={s.legendSection}>
            <Text style={s.legendTitle}>PENJELASAN</Text>
            <Text style={[s.legendTitle, { marginTop: 2 }]}>
              TINGKAT RESIKO
            </Text>
            {[
              ["E", "Extreme Risk"],
              ["H", "High Risk"],
              ["M", "Moderate Risk"],
              ["L", "Low Risk"],
            ].map(([k, v]) => (
              <Text key={k} style={s.legendText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{k}</Text> = {v}
              </Text>
            ))}
            <Text style={[s.legendTitle, { marginTop: 4 }]}>KEMUNGKINAN</Text>
            {[
              ["A", "Hampir pasti akan terjadi / almost certain"],
              ["B", "Cenderung untuk terjadi / likely"],
              ["C", "Mungkin dapat terjadi / moderate"],
              ["D", "Kecil kemungkinan terjadi / unlikely"],
              ["E", "Jarang terjadi / rare"],
            ].map(([k, v]) => (
              <Text key={k} style={s.legendText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{k}</Text> = {v}
              </Text>
            ))}
          </View>

          <View style={s.legendSectionLast}>
            <Text style={s.legendTitle}>KONSEKUENSI</Text>
            {[
              ["1", "Tidak ada cedera, kerugian materi kecil"],
              ["2", "Cedera ringan / P3K, kerugian materi sedang"],
              ["3", "Hilang hari kerja, kerugian cukup besar"],
              ["4", "Cacat, kerugian materi besar"],
              ["5", "Kematian, kerugian materi sangat besar"],
            ].map(([k, v]) => (
              <Text key={k} style={s.legendText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{k}</Text> = {v}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <HirarcSignatures permit={permit} qrCodes={qrCodes} />
    </Page>
  );
};
