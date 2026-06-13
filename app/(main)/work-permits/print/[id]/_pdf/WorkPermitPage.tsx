// ==========================================
// PDF HALAMAN 1: WORK PERMIT
// ==========================================

import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "../_lib/pdfStyles";
import { Permit } from "../_lib/types";
import { formatTanggal } from "../_lib/utils";

// ── Sub-komponen: Daftar bullet untuk PDF ──
const PdfDynamicList = ({ items }: { items?: string[] }) => {
  if (!items || items.length === 0) {
    return <Text style={styles.emptyNote}>- Tidak ada data terlampir -</Text>;
  }
  return (
    <View>
      {items.map((item, idx) => (
        <View key={idx} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={{ flex: 1 }}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

// ── Sub-komponen: Tanda tangan WP ──
const WorkPermitSignatures = ({ permit }: { permit: Permit }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>
        Diajukan Oleh,{"\n"}Pengawas Pekerjaan
      </Text>
      <Text style={styles.signatureName}>{permit.pjTeknik?.nama}</Text>
      <Text style={styles.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>
        Diperiksa Oleh,{"\n"}Pengawas K3
      </Text>
      <Text style={styles.signatureName}>{permit.tenagaAhliK3?.nama}</Text>
      <Text style={styles.signatureNote}>Telah disetujui secara digital</Text>
    </View>
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>
        Disahkan Oleh,{"\n"}Manajemen / Direktur
      </Text>
      {permit.status === "approved_director" ? (
        <>
          <Text style={styles.signatureName}>BILAL YURINATA</Text>
          <Text style={styles.signatureRole}>Direktur Utama</Text>
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

// ── Halaman PDF: Work Permit ──
export const WorkPermitPage = ({ permit }: { permit: Permit }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FORM IZIN PEKERJAAN</Text>
        <Text style={styles.docNumber}>NOMOR DOKUMEN: {permit.nomorWP}</Text>
      </View>

      {/* A. Informasi Pekerjaan */}
      <Text style={styles.sectionTitle}>A. INFORMASI PEKERJAAN</Text>
      <View style={styles.row}>
        <Text style={styles.col1}>1</Text>
        <Text style={styles.col2}>Tanggal</Text>
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
        <View
          style={[
            styles.col4,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <Text>{permit.pjTeknik?.nama}</Text>
          <Text>No. Telp: {permit.noTelpPjTeknik || "-"}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.col1}>5</Text>
        <Text style={styles.col2}>Pengawas K3</Text>
        <Text style={styles.col3}>:</Text>
        <View
          style={[
            styles.col4,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <Text>{permit.tenagaAhliK3?.nama}</Text>
          <Text>No. Telp: {permit.noTelpTenagaAhliK3 || "-"}</Text>
        </View>
      </View>

      {/* B. Durasi Pekerjaan */}
      <Text style={styles.sectionTitle}>B. DURASI PEKERJAAN</Text>
      <View style={styles.row}>
        <View style={styles.durasiHeader}>
          <Text>DURASI KERJA</Text>
        </View>
        <View style={styles.durasiContent}>
          <View style={[styles.durasiRow, { borderBottom: "1px solid black" }]}>
            <Text style={styles.durasiLabel}>TANGGAL MULAI</Text>
            <Text style={styles.col3}>:</Text>
            <Text style={styles.durasiVal}>
              {formatTanggal(permit.tanggalMulai)}
            </Text>
            <Text style={styles.durasiLabel}>JAM MULAI</Text>
            <Text style={styles.col3}>:</Text>
            <Text style={styles.durasiVal}>{permit.waktuMulai} WIB</Text>
          </View>
          <View style={styles.durasiRow}>
            <Text style={styles.durasiLabel}>TANGGAL SELESAI</Text>
            <Text style={styles.col3}>:</Text>
            <Text style={styles.durasiVal}>
              {formatTanggal(permit.tanggalSelesai)}
            </Text>
            <Text style={styles.durasiLabel}>JAM SELESAI</Text>
            <Text style={styles.col3}>:</Text>
            <Text style={styles.durasiVal}>{permit.waktuSelesai} WIB</Text>
          </View>
        </View>
      </View>

      {/* C. Klasifikasi Pekerjaan */}
      <Text style={styles.sectionTitle}>C. KLASIFIKASI PEKERJAAN</Text>
      <View style={styles.contentBox}>
        <PdfDynamicList items={permit.workPermitData?.klasifikasiPekerjaan} />
      </View>

      {/* D. Prosedur Pekerjaan */}
      <Text style={styles.sectionTitle}>
        D. PROSEDUR PEKERJAAN YANG TELAH DIJELASKAN KEPADA PEKERJA
      </Text>
      <View style={styles.contentBox}>
        <PdfDynamicList items={permit.workPermitData?.prosedurPekerjaan} />
      </View>

      {/* E. Lampiran */}
      <Text style={styles.sectionTitle}>E. LAMPIRAN IZIN KERJA</Text>
      <View style={[styles.contentBox, { borderBottom: "none" }]}>
        <PdfDynamicList items={permit.workPermitData?.lampiran} />
      </View>
    </View>

    <WorkPermitSignatures permit={permit} />
  </Page>
);
