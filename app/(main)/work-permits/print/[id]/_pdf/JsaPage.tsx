// ==========================================
// PDF HALAMAN 2: JOB SAFETY ANALYSIS (JSA)
// ==========================================

import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "../_lib/pdfStyles";
import { Permit } from "../_lib/types";
import { formatTanggal, getPelaksanaList } from "../_lib/utils";

// ── Sub-komponen: Tanda tangan JSA ──
const JsaSignatures = ({ permit }: { permit: Permit }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>
        Disusun Oleh,{"\n"}Penanggung Jawab Teknik
      </Text>
      <Text style={styles.signatureName}>{permit.pjTeknik?.nama}</Text>
      <Text style={styles.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>
        Diperiksa Oleh,{"\n"}Tenaga Ahli K3
      </Text>
      <Text style={styles.signatureName}>{permit.tenagaAhliK3?.nama}</Text>
      <Text style={styles.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>Disetujui Oleh,{"\n"}Direktur</Text>
      {permit.status === "approved_director" ? (
        <>
          <Text style={styles.signatureName}>BILAL YURINATA</Text>
          <Text style={styles.signatureNote}>
            Telah disetujui secara digital
          </Text>
        </>
      ) : (
        <Text style={[styles.signatureNote, { color: "red" }]}>
          (Belum Disahkan)
        </Text>
      )}
    </View>
  </View>
);

// ── Halaman PDF: JSA ──
export const JsaPage = ({ permit }: { permit: Permit }) => {
  const pelaksanaList = getPelaksanaList(permit);
  const jsaDocs = permit.jsaData
    ? Array.isArray(permit.jsaData)
      ? permit.jsaData
      : [permit.jsaData]
    : [];

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>JOB SAFETY ANALYSIS (JSA)</Text>
          <Text style={styles.docNumber}>NOMOR DOKUMEN: {permit.nomorWP}</Text>
        </View>

        {/* A. Informasi Pekerjaan */}
        <Text style={styles.sectionTitle}>A. INFORMASI PEKERJAAN</Text>
        <View style={styles.row}>
          <Text style={styles.col1}>1</Text>
          <Text style={styles.col2}>Tanggal Pekerjaan</Text>
          <Text style={styles.col3}>:</Text>
          <Text style={styles.col4}>
            {formatTanggal(permit.tanggalMulai)} -{" "}
            {formatTanggal(permit.tanggalSelesai)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col1}>2</Text>
          <Text style={styles.col2}>Jenis Pekerjaan</Text>
          <Text style={styles.col3}>:</Text>
          <Text style={styles.col4}>{permit.pekerjaan?.namaPekerjaan}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col1}>3</Text>
          <Text style={styles.col2}>Lokasi</Text>
          <Text style={styles.col3}>:</Text>
          <Text style={styles.col4}>{permit.lokasi}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col1}>4</Text>
          <Text style={styles.col2}>Pengawas Pekerjaan</Text>
          <Text style={styles.col3}>:</Text>
          <Text style={styles.col4}>{permit.pjTeknik?.nama}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col1}>5</Text>
          <Text style={styles.col2}>Pengawas K3</Text>
          <Text style={styles.col3}>:</Text>
          <Text style={styles.col4}>{permit.tenagaAhliK3?.nama}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col1}>6</Text>
          <Text style={styles.col2}>Pelaksana Pekerjaan</Text>
          <Text style={styles.col3}>:</Text>
          <View style={styles.col4}>
            {pelaksanaList.length > 0 ? (
              <Text>{pelaksanaList.join(", ")}</Text>
            ) : (
              <Text style={styles.emptyNote}>-</Text>
            )}
          </View>
        </View>

        {/* B. Analisa Keselamatan Kerja */}
        <Text style={styles.sectionTitle}>B. ANALISA KESELAMATAN KERJA</Text>

        {/* Header tabel */}
        <View style={[styles.row, { backgroundColor: "#f3f4f6" }]}>
          <Text style={styles.jsaThNo}>NO</Text>
          <Text style={styles.jsaThLangkah}>LANGKAH PEKERJAAN</Text>
          <Text style={styles.jsaThPotensi}>POTENSI BAHAYA & RISIKO</Text>
          <Text style={styles.jsaThKendali}>TINDAKAN PENGENDALIAN</Text>
        </View>

        {jsaDocs.length > 0 ? (
          jsaDocs.map((jsa: any, jsaIdx: number) => (
            <View key={jsaIdx}>
              {/* ✅ Baris judul JSA — bernomor, bold */}
              <View style={[styles.row, { backgroundColor: "#f9fafb" }]}>
                <Text style={[styles.jsaTdNo, { fontWeight: "bold" }]}>
                  {jsaIdx + 1}
                </Text>
                <Text
                  style={[
                    styles.jsaTdLangkah,
                    {
                      fontWeight: "bold",
                      width: "95%", // span sisa 3 kolom
                      textTransform: "uppercase",
                    },
                  ]}
                >
                  {jsa.judulJsa || `JSA #${jsaIdx + 1}`}
                </Text>
              </View>

              {/* ✅ Baris langkah kerja — tanpa nomor */}
              {(jsa.langkahKerja ?? []).map((langkah: string, idx: number) => (
                <View key={idx} style={styles.row}>
                  <Text style={styles.jsaTdNo} />
                  <Text style={styles.jsaTdLangkah}>{langkah || "-"}</Text>
                  <Text style={styles.jsaTdPotensi}>
                    {jsa.bahayaResiko?.[idx] || "-"}
                  </Text>
                  <Text style={styles.jsaTdKendali}>
                    {jsa.pengendalian?.[idx] || "-"}
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text
              style={[
                styles.jsaTdNo,
                {
                  width: "100%",
                  padding: 10,
                  textAlign: "center",
                  fontStyle: "italic",
                },
              ]}
            >
              Tidak ada data analisa JSA terlampir.
            </Text>
          </View>
        )}
      </View>

      <JsaSignatures permit={permit} />
    </Page>
  );
};
