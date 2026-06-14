// ==========================================
// KOMPONEN HTML: HALAMAN HIRARC
// ==========================================

import { Permit } from "../_lib/types";
import { formatTanggal } from "../_lib/utils";

interface Props {
  permit: Permit;
}

// Matriks risiko untuk legenda
const RISK_MATRIX = [
  { kemungkinan: "A", cols: ["M", "M", "H", "E", "E"] },
  { kemungkinan: "B", cols: ["L", "M", "H", "E", "E"] },
  { kemungkinan: "C", cols: ["L", "M", "H", "H", "E"] },
  { kemungkinan: "D", cols: ["L", "L", "M", "H", "E"] },
  { kemungkinan: "E", cols: ["L", "L", "M", "H", "H"] },
];

const riskColor = (level: string) => {
  switch (level) {
    case "E":
      return "bg-red-600 text-white";
    case "H":
      return "bg-orange-400 text-white";
    case "M":
      return "bg-yellow-300 text-black";
    case "L":
      return "bg-green-400 text-white";
    default:
      return "bg-white text-black";
  }
};

const HirarcSignaturesHTML = ({ permit }: { permit: Permit }) => (
  <div className="mt-8">
    <div className="grid grid-cols-3 text-center text-xs text-black">
      <div>
        <p className="mb-16 font-bold">
          Disusun Oleh,
          <br />
          Penanggung Jawab Teknik
        </p>
        <p className="font-bold uppercase underline">{permit.pjTeknik?.nama}</p>
        <p className="text-[10px] italic text-slate-500">
          Telah disetujui secara digital
        </p>
      </div>
      <div>
        <p className="mb-16 font-bold">
          Diperiksa Oleh,
          <br />
          Tenaga Ahli K3
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
          Direktur
        </p>
        {permit.status === "approved_director" ? (
          <>
            <p className="font-bold uppercase underline">BILAL YURINATA</p>
            <p className="text-[10px] italic text-slate-500 mt-1">
              Telah disetujui secara digital
            </p>
          </>
        ) : (
          <p className="text-[10px] italic text-red-500">(Belum Disahkan)</p>
        )}
      </div>
    </div>
  </div>
);

export const HirarcHTML = ({ permit }: Props) => {
  const h = permit.hirarcData;
  const rows = h?.potensiBahaya ?? [];

  return (
    <div className="bg-white p-10 shadow-lg break-before-page print:m-0 print:max-w-none print:p-0 print:shadow-none">
      <div className="border-2 border-black text-xs text-black">
        {/* ── Header ── */}
        <div className="border-b-2 border-black py-2 text-center">
          <h1 className="text-sm font-bold tracking-widest uppercase">
            Hazard Identification, Risk Assessment and Risk Control (HIRARC)
          </h1>
          <p className="text-[10px] font-semibold mt-0.5">
            Identifikasi Bahaya, Penilaian, dan Pengendalian Resiko (IBPPR)
          </p>
          <p className="text-[10px] mt-0.5">NOMOR DOKUMEN: {permit.nomorWP}</p>
        </div>

        {/* ── Info Unit ── */}
        <table className="w-full border-b border-black text-[10px]">
          <tbody>
            <tr>
              <td className="w-28 px-2 py-1">Nama Unit</td>
              <td className="w-2">:</td>
              <td className="px-2 py-1 font-semibold">
                PT PLN (Persero) UID Lampung UP3 Metro ULP Sukadana
              </td>
              <td className="w-28 px-2 py-1">Tanggal</td>
              <td className="w-2">:</td>
              <td className="px-2 py-1 font-semibold">
                {formatTanggal(permit.tanggalMulai)} –{" "}
                {formatTanggal(permit.tanggalSelesai)}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1">Bidang</td>
              <td>:</td>
              <td className="px-2 py-1 font-semibold">
                Distribusi Tegangan Rendah
              </td>
              <td className="px-2 py-1">Pengawas K3</td>
              <td>:</td>
              <td className="px-2 py-1 font-semibold">
                {permit.tenagaAhliK3?.nama}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1">Jenis Pekerjaan</td>
              <td>:</td>
              <td className="px-2 py-1 font-semibold">
                {permit.pekerjaan?.namaPekerjaan}
              </td>
              <td className="px-2 py-1">Pengawas Pekerjaan</td>
              <td>:</td>
              <td className="px-2 py-1 font-semibold">
                {permit.pjTeknik?.nama}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── Tabel HIRARC Utama ── */}
        <table className="w-full table-fixed border-collapse text-[9px]">
          <thead>
            {/* Baris 1: Grup header */}
            <tr className="bg-gray-100 border-b border-black text-center font-bold">
              <th
                rowSpan={2}
                className="border-r border-black p-1 w-[12%] align-middle"
              >
                Kegiatan
              </th>
              <th
                rowSpan={2}
                className="border-r border-black p-1 w-[12%] align-middle"
              >
                Potensi Bahaya
              </th>
              <th
                rowSpan={2}
                className="border-r border-black p-1 w-[12%] align-middle"
              >
                Resiko
              </th>
              <th colSpan={3} className="border-r border-black p-1">
                Penilaian Resiko
              </th>
              <th
                rowSpan={2}
                className="border-r border-black p-1 w-[18%] align-middle"
              >
                Pengendalian Resiko
              </th>
              <th colSpan={3} className="border-r border-black p-1">
                Penilaian Resiko
              </th>
              <th
                rowSpan={2}
                className="border-r border-black p-1 w-[6%] align-middle"
              >
                Status Pengendalian
              </th>
              <th rowSpan={2} className="p-1 w-[10%] align-middle">
                Penanggung Jawab
              </th>
            </tr>
            {/* Baris 2: Sub-header penilaian */}
            <tr className="bg-gray-100 border-b border-black text-center font-bold">
              <th className="border-r border-black p-1 w-[5%]">
                Konsekuensi / Keparahan
              </th>
              <th className="border-r border-black p-1 w-[5%]">
                Kemung- kinan
              </th>
              <th className="border-r border-black p-1 w-[5%]">
                Tingkat Resiko
              </th>
              <th className="border-r border-black p-1 w-[5%]">
                Konsekuensi / Keparahan
              </th>
              <th className="border-r border-black p-1 w-[5%]">
                Kemung- kinan
              </th>
              <th className="border-r border-black p-1 w-[5%]">
                Tingkat Resiko
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((potensi: string, i: number) => (
                <tr
                  key={i}
                  className="border-b border-black last:border-b-0 align-top"
                >
                  {/* Kolom Kegiatan — hanya di baris pertama dengan rowSpan */}
                  {i === 0 && (
                    <td
                      rowSpan={rows.length}
                      className="border-r border-black p-1.5 align-middle text-center font-semibold"
                    >
                      {permit.pekerjaan?.namaPekerjaan}
                    </td>
                  )}
                  <td className="border-r border-black p-1.5 whitespace-pre-line">
                    {potensi || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 whitespace-pre-line">
                    {h?.resiko?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center">
                    {h?.konsekuensiKeparahan?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center">
                    {h?.kemungkinanTerjadi?.[i] || "-"}
                  </td>
                  <td
                    className={`border-r border-black p-1.5 text-center font-bold ${riskColor(h?.tingkatResiko?.[i] || "")}`}
                  >
                    {h?.tingkatResiko?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 whitespace-pre-line">
                    {h?.pengendalian?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center">
                    {h?.konsekuensiSetelahPengendalian?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center">
                    {h?.kemungkinanTerjadiSetelahPengendalian?.[i] || "-"}
                  </td>
                  <td
                    className={`border-r border-black p-1.5 text-center font-bold ${riskColor(h?.tingkatResikoSetelahPengendalian?.[i] || "")}`}
                  >
                    {h?.tingkatResikoSetelahPengendalian?.[i] || "-"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center font-semibold">
                    {h?.statusPengendalian || "OK"}
                  </td>
                  <td className="p-1.5">{h?.penanggungJawab?.[i] || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="p-4 text-center italic text-gray-500"
                >
                  Tidak ada data HIRARC terlampir.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── Legenda ── */}
        <div className="border-t border-black grid grid-cols-3 gap-0 text-[8px]">
          {/* Matriks kemungkinan x konsekuensi */}
          <div className="border-r border-black p-2">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="border border-black p-0.5">Kemungkinan</th>
                  <th colSpan={5} className="border border-black p-0.5">
                    Konsekuensi
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-0.5" />
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th key={n} className="border border-black p-0.5">
                      {n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RISK_MATRIX.map(({ kemungkinan, cols }) => (
                  <tr key={kemungkinan}>
                    <td className="border border-black p-0.5 font-bold">
                      {kemungkinan}
                    </td>
                    {cols.map((level, ci) => (
                      <td
                        key={ci}
                        className={`border border-black p-0.5 font-bold ${riskColor(level)}`}
                      >
                        {level}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tingkat Resiko & Kemungkinan */}
          <div className="border-r border-black p-2 space-y-1">
            <p className="font-bold mb-1">PENJELASAN</p>
            <p className="font-bold">TINGKAT RESIKO</p>
            {[
              ["E", "Extreme Risk"],
              ["H", "High Risk"],
              ["M", "Moderate Risk"],
              ["L", "Low Risk"],
            ].map(([k, v]) => (
              <p key={k}>
                <span className="font-bold">{k}</span> = {v}
              </p>
            ))}
            <p className="font-bold mt-2">KEMUNGKINAN</p>
            {[
              ["A", "Hampir pasti akan terjadi / almost certain"],
              ["B", "Cenderung untuk terjadi / likely"],
              ["C", "Mungkin dapat terjadi / moderate"],
              ["D", "Kecil kemungkinan terjadi / unlikely"],
              ["E", "Jarang terjadi / rare"],
            ].map(([k, v]) => (
              <p key={k}>
                <span className="font-bold">{k}</span> = {v}
              </p>
            ))}
          </div>

          {/* Konsekuensi */}
          <div className="p-2 space-y-1">
            <p className="font-bold mb-1">KONSEKUENSI</p>
            {[
              ["1", "Tidak ada cedera, kerugian materi kecil"],
              ["2", "Cedera ringan / P3K, kerugian materi sedang"],
              ["3", "Hilang hari kerja, kerugian cukup besar"],
              ["4", "Cacat, kerugian materi besar"],
              ["5", "Kematian, kerugian materi sangat besar"],
            ].map(([k, v]) => (
              <p key={k}>
                <span className="font-bold">{k}</span> = {v}
              </p>
            ))}
          </div>
        </div>
      </div>

      <HirarcSignaturesHTML permit={permit} />
    </div>
  );
};
