"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// ==========================================
// 1. STYLING UNTUK PDF (@react-pdf/renderer)
// ==========================================
const styles = StyleSheet.create({
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

  // Durasi Kerja Styles
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

  // JSA Table Styles
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

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
const formatTanggal = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ==========================================
// 3. KOMPONEN DOKUMEN PDF (HALAMAN 1: WP, HALAMAN 2: JSA)
// ==========================================
const WorkPermitAndJsaPDF = ({ permit }: { permit: any }) => {
  // Ekstraksi data JSA sesuai skema jsaData Mongoose Anda
  const langkahKerjaList = permit.jsaData?.langkahKerja || [];
  const bahayaResikoList = permit.jsaData?.bahayaResiko || [];
  const pengendalianList = permit.jsaData?.pengendalian || [];

  // Mengambil nama pelaksana (asumsi backend sudah melakukan .populate("jsaData.pelaksana"))
  const pelaksanaList =
    permit.jsaData?.pelaksana?.map((p: any) =>
      typeof p === "object" ? p.nama : p,
    ) || [];

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

  return (
    <Document>
      {/* ── HALAMAN 1: WORK PERMIT ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>FORM IZIN PEKERJAAN</Text>
            <Text style={styles.docNumber}>
              NOMOR DOKUMEN: {permit.nomorWP}
            </Text>
          </View>

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

          <Text style={styles.sectionTitle}>B. DURASI PEKERJAAN</Text>
          <View style={styles.row}>
            <View style={styles.durasiHeader}>
              <Text>DURASI KERJA</Text>
            </View>
            <View style={styles.durasiContent}>
              <View
                style={[styles.durasiRow, { borderBottom: "1px solid black" }]}
              >
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

          <Text style={styles.sectionTitle}>C. KLASIFIKASI PEKERJAAN</Text>
          <View style={styles.contentBox}>
            <PdfDynamicList
              items={permit.workPermitData?.klasifikasiPekerjaan}
            />
          </View>

          <Text style={styles.sectionTitle}>
            D. PROSEDUR PEKERJAAN YANG TELAH DIJELASKAN KEPADA PEKERJA
          </Text>
          <View style={styles.contentBox}>
            <PdfDynamicList items={permit.workPermitData?.prosedurPekerjaan} />
          </View>

          <Text style={styles.sectionTitle}>E. LAMPIRAN IZIN KERJA</Text>
          <View style={[styles.contentBox, { borderBottom: "none" }]}>
            <PdfDynamicList items={permit.workPermitData?.lampiran} />
          </View>
        </View>

        {/* TANDA TANGAN WP */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              Diajukan Oleh,{"\n"}Pengawas Pekerjaan
            </Text>
            <Text style={styles.signatureName}>{permit.pjTeknik?.nama}</Text>
            <Text style={styles.signatureNote}>
              Telah disetujui secara digital
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              Diperiksa Oleh,{"\n"}Pengawas K3
            </Text>
            <Text style={styles.signatureName}>
              {permit.tenagaAhliK3?.nama}
            </Text>
            <Text style={styles.signatureNote}>
              Telah disetujui secara digital
            </Text>
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
      </Page>

      {/* ── HALAMAN 2: JOB SAFETY ANALYSIS (JSA) ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>JOB SAFETY ANALYSIS (JSA)</Text>
            <Text style={styles.docNumber}>
              NOMOR DOKUMEN: {permit.nomorWP}
            </Text>
          </View>

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

          {/* TABEL DATA JSA UTAMA (Gabungkan 3 Array berdasarkan Index) */}
          <Text style={styles.sectionTitle}>B. ANALISA KESELAMATAN KERJA</Text>
          <View style={[styles.row, { backgroundColor: "#f3f4f6" }]}>
            <Text style={styles.jsaThNo}>NO</Text>
            <Text style={styles.jsaThLangkah}>LANGKAH PEKERJAAN</Text>
            <Text style={styles.jsaThPotensi}>POTENSI BAHAYA & RISIKO</Text>
            <Text style={styles.jsaThKendali}>TINDAKAN PENGENDALIAN</Text>
          </View>

          {langkahKerjaList.length > 0 ? (
            langkahKerjaList.map((langkah: string, idx: number) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.jsaTdNo}>{idx + 1}</Text>
                <Text style={styles.jsaTdLangkah}>{langkah || "-"}</Text>
                <Text style={styles.jsaTdPotensi}>
                  {bahayaResikoList[idx] || "-"}
                </Text>
                <Text style={styles.jsaTdKendali}>
                  {pengendalianList[idx] || "-"}
                </Text>
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

        {/* TANDA TANGAN JSA */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              Disusun Oleh,{"\n"}Pengawas Pekerjaan
            </Text>
            <Text style={styles.signatureName}>{permit.pjTeknik?.nama}</Text>
            <Text style={styles.signatureNote}>
              Telah disetujui secara digital
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              Diperiksa Oleh,{"\n"}Pengawas K3
            </Text>
            <Text style={styles.signatureName}>
              {permit.tenagaAhliK3?.nama}
            </Text>
            <Text style={styles.signatureNote}>
              Telah disetujui secara digital
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              Disetujui Oleh,{"\n"}Manajemen / Direktur
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
      </Page>
    </Document>
  );
};

// ==========================================
// 4. MAIN PAGE (UI HTML)
// ==========================================
export default function WorkPermitPrintPage() {
  const params = useParams();
  const id = params?.id as string;

  const [permit, setPermit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/work-permits/${id}`);
        const result = await res.json();
        if (result.success) {
          setPermit(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center print:hidden">
        <p className="animate-pulse text-sm font-medium text-slate-500">
          Menyiapkan dokumen JSA & WP...
        </p>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="p-8 text-center text-slate-500 print:hidden">
        Dokumen tidak ditemukan.
      </div>
    );
  }

  // Pemetaan array dari jsaData sesuai skema Mongoose Anda
  const langkahKerjaList = permit.jsaData?.langkahKerja || [];
  const bahayaResikoList = permit.jsaData?.bahayaResiko || [];
  const pengendalianList = permit.jsaData?.pengendalian || [];

  const pelaksanaList =
    permit.jsaData?.pelaksana?.map((p: any) =>
      typeof p === "object" ? p.nama : p,
    ) || [];

  const DynamicListHTML = ({ items }: { items?: string[] }) => {
    if (!items || items.length === 0) {
      return (
        <span className="italic text-gray-500">
          - Tidak ada data terlampir -
        </span>
      );
    }
    return (
      <ul className="list-inside list-disc pl-2 leading-relaxed">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
      {/* ── TOMBOL AKSI LAYAR ── */}
      <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between px-8 print:hidden">
        <button
          onClick={() => window.close()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Tutup Tab
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-slate-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-700"
          >
            <Printer size={16} /> Cetak (Printer)
          </button>

          {isClient && (
            <PDFDownloadLink
              document={<WorkPermitAndJsaPDF permit={permit} />}
              fileName={`WP_JSA_${permit.nomorWP || "Doc"}.pdf`}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <Download size={16} />
                  {pdfLoading ? "Menyiapkan PDF..." : "Simpan PDF"}
                </>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* ── KERTAS DOKUMEN HTML (TAMPILAN DI LAYAR & PRINT) ── */}
      <div className="mx-auto max-w-4xl space-y-12">
        {/* KERTAS 1: WORK PERMIT */}
        <div className="bg-white p-10 shadow-lg print:m-0 print:max-w-none print:p-0 print:shadow-none">
          <div className="border-2 border-black text-xs text-black">
            <div className="border-b-2 border-black py-2 text-center">
              <h1 className="text-lg font-bold tracking-widest">
                FORM IZIN PEKERJAAN
              </h1>
              <p className="text-[10px] font-semibold mt-0.5">
                NOMOR DOKUMEN: {permit.nomorWP}
              </p>
            </div>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              A. INFORMASI PEKERJAAN
            </div>
            <table className="w-full border-b border-black">
              <tbody>
                <tr>
                  <td className="w-6 p-1.5 text-center align-top">1</td>
                  <td className="w-40 p-1.5 align-top">Tanggal</td>
                  <td className="w-2 p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {formatTanggal(permit.tanggalMulai)} -{" "}
                    {formatTanggal(permit.tanggalSelesai)}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">2</td>
                  <td className="p-1.5 align-top">Jenis Pekerjaan</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.pekerjaan?.namaPekerjaan}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">3</td>
                  <td className="p-1.5 align-top">Lokasi</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">{permit.lokasi}</td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">4</td>
                  <td className="p-1.5 align-top">Pengawas Pekerjaan</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>{permit.pjTeknik?.nama}</span>
                      <span className="pr-4">
                        No. Telp: {permit.noTelpPjTeknik || "-"}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">5</td>
                  <td className="p-1.5 align-top">Pengawas K3</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>{permit.tenagaAhliK3?.nama}</span>
                      <span className="pr-4">
                        No. Telp: {permit.noTelpTenagaAhliK3 || "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              B. DURASI PEKERJAAN
            </div>
            <table className="w-full border-b border-black">
              <tbody>
                <tr>
                  <td
                    rowSpan={2}
                    className="w-[180px] border-r border-black p-2 font-bold align-top"
                  >
                    DURASI KERJA
                  </td>
                  <td className="w-32 p-1.5 pl-3">TANGGAL MULAI</td>
                  <td className="w-2 p-1.5">:</td>
                  <td className="p-1.5 font-semibold">
                    {formatTanggal(permit.tanggalMulai)}
                  </td>
                  <td className="w-24 p-1.5">JAM MULAI</td>
                  <td className="w-2 p-1.5">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.waktuMulai} WIB
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 pl-3">TANGGAL SELESAI</td>
                  <td className="p-1.5">:</td>
                  <td className="p-1.5 font-semibold">
                    {formatTanggal(permit.tanggalSelesai)}
                  </td>
                  <td className="p-1.5">JAM SELESAI</td>
                  <td className="p-1.5">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.waktuSelesai} WIB
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              C. KLASIFIKASI PEKERJAAN
            </div>
            <div className="border-b border-black p-3">
              <DynamicListHTML
                items={permit.workPermitData?.klasifikasiPekerjaan}
              />
            </div>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              D. PROSEDUR PEKERJAAN YANG TELAH DIJELASKAN KEPADA PEKERJA
            </div>
            <div className="border-b border-black p-3">
              <DynamicListHTML
                items={permit.workPermitData?.prosedurPekerjaan}
              />
            </div>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              E. LAMPIRAN IZIN KERJA
            </div>
            <div className="p-3">
              <DynamicListHTML items={permit.workPermitData?.lampiran} />
            </div>
          </div>

          {/* Tanda Tangan WP */}
          <div className="mt-8">
            <div className="grid grid-cols-3 text-center text-xs text-black">
              <div>
                <p className="mb-16 font-bold">
                  Diajukan Oleh,
                  <br />
                  Pengawas Pekerjaan
                </p>
                <p className="font-bold uppercase underline">
                  {permit.pjTeknik?.nama}
                </p>
                <p className="text-[10px] italic text-slate-500">
                  Telah disetujui secara digital
                </p>
              </div>
              <div>
                <p className="mb-16 font-bold">
                  Diperiksa Oleh,
                  <br />
                  Pengawas K3
                </p>
                <p className="font-bold uppercase underline">
                  {permit.tenagaAhliK3?.nama}
                </p>
                <p className="text-[10px] italic text-slate-500">
                  Telah disetujui secara digital
                </p>
              </div>
              <div>
                <p className="mb-16 font-bold">
                  Disahkan Oleh,
                  <br />
                  Manajemen / Direktur
                </p>
                {permit.status === "approved_director" ? (
                  <>
                    <p className="font-bold uppercase underline">
                      BILAL YURINATA
                    </p>
                    <p className="font-semibold text-[11px] mt-0.5">
                      Direktur Utama
                    </p>
                    <p className="text-[10px] italic text-slate-500 mt-1">
                      Telah disetujui secara digital
                    </p>
                  </>
                ) : (
                  <p className="text-[10px] italic text-red-500">
                    (Belum Disahkan)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KERTAS 2: JOB SAFETY ANALYSIS (JSA) */}
        <div className="bg-white p-10 shadow-lg break-before-page print:m-0 print:max-w-none print:p-0 print:shadow-none">
          <div className="border-2 border-black text-xs text-black">
            <div className="border-b-2 border-black py-2 text-center">
              <h1 className="text-lg font-bold tracking-widest">
                JOB SAFETY ANALYSIS (JSA)
              </h1>
              <p className="text-[10px] font-semibold mt-0.5">
                NOMOR DOKUMEN: {permit.nomorWP}
              </p>
            </div>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              A. INFORMASI PEKERJAAN
            </div>
            <table className="w-full border-b border-black">
              <tbody>
                <tr>
                  <td className="w-6 p-1.5 text-center align-top">1</td>
                  <td className="w-40 p-1.5 align-top">Tanggal Pekerjaan</td>
                  <td className="w-2 p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {formatTanggal(permit.tanggalMulai)} -{" "}
                    {formatTanggal(permit.tanggalSelesai)}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">2</td>
                  <td className="p-1.5 align-top">Jenis Pekerjaan</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.pekerjaan?.namaPekerjaan}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">3</td>
                  <td className="p-1.5 align-top">Lokasi</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">{permit.lokasi}</td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">4</td>
                  <td className="p-1.5 align-top">Pengawas Pekerjaan</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.pjTeknik?.nama}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">5</td>
                  <td className="p-1.5 align-top">Pengawas K3</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {permit.tenagaAhliK3?.nama}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center align-top">6</td>
                  <td className="p-1.5 align-top">Pelaksana Pekerjaan</td>
                  <td className="p-1.5 align-top">:</td>
                  <td className="p-1.5 font-semibold">
                    {pelaksanaList.length > 0 ? pelaksanaList.join(", ") : "-"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
              B. ANALISA KESELAMATAN KERJA
            </div>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-black text-center font-bold">
                  <th className="w-[5%] border-r border-black p-1.5">NO</th>
                  <th className="w-[35%] border-r border-black p-1.5 text-left">
                    LANGKAH PEKERJAAN
                  </th>
                  <th className="w-[30%] border-r border-black p-1.5 text-left">
                    POTENSI BAHAYA & RISIKO
                  </th>
                  <th className="w-[30%] p-1.5 text-left">
                    TINDAKAN PENGENDALIAN
                  </th>
                </tr>
              </thead>
              <tbody>
                {langkahKerjaList.length > 0 ? (
                  langkahKerjaList.map((langkah: string, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-black last:border-b-0"
                    >
                      <td className="border-r border-black p-1.5 text-center align-top">
                        {idx + 1}
                      </td>
                      <td className="border-r border-black p-1.5 align-top whitespace-pre-line">
                        {langkah || "-"}
                      </td>
                      <td className="border-r border-black p-1.5 align-top whitespace-pre-line">
                        {bahayaResikoList[idx] || "-"}
                      </td>
                      <td className="p-1.5 align-top whitespace-pre-line">
                        {pengendalianList[idx] || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center italic text-gray-500"
                    >
                      Tidak ada data analisa JSA terlampir.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tanda Tangan JSA */}
          <div className="mt-8">
            <div className="grid grid-cols-3 text-center text-xs text-black">
              <div>
                <p className="mb-16 font-bold">
                  Disusun Oleh,
                  <br />
                  Pengawas Pekerjaan
                </p>
                <p className="font-bold uppercase underline">
                  {permit.pjTeknik?.nama}
                </p>
                <p className="text-[10px] italic text-slate-500">
                  Telah disetujui secara digital
                </p>
              </div>
              <div>
                <p className="mb-16 font-bold">
                  Diperiksa Oleh,
                  <br />
                  Pengawas K3
                </p>
                <p className="font-bold uppercase underline">
                  {permit.tenagaAhliK3?.nama}
                </p>
                <p className="text-[10px] italic text-slate-500">
                  Telah disetujui secara digital
                </p>
              </div>
              <div>
                <p className="mb-16 font-bold">
                  Disetujui Oleh,
                  <br />
                  Manajemen / Direktur
                </p>
                {permit.status === "approved_director" ? (
                  <>
                    <p className="font-bold uppercase underline">
                      BILAL YURINATA
                    </p>
                    <p className="font-semibold text-[11px] mt-0.5">
                      Direktur Utama
                    </p>
                    <p className="text-[10px] italic text-slate-500 mt-1">
                      Telah disetujui secara digital
                    </p>
                  </>
                ) : (
                  <p className="text-[10px] italic text-red-500">
                    (Belum Disahkan)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
