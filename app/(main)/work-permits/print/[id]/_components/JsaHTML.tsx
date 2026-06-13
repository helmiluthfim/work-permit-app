// ==========================================
// KOMPONEN HTML: HALAMAN 2 - JSA
// ==========================================

import { Permit } from "../_lib/types";
import { formatTanggal, getPelaksanaList } from "../_lib/utils";

interface Props {
  permit: Permit;
}

const JsaSignaturesHTML = ({ permit }: { permit: Permit }) => (
  <div className="mt-8">
    <div className="grid grid-cols-3 text-center text-xs text-black">
      <div>
        <p className="mb-16 font-bold">
          Disusun Oleh,
          <br />
          Pengawas Pekerjaan
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
            <p className="font-bold uppercase underline">BILAL YURINATA</p>
            <p className="font-semibold text-[11px] mt-0.5">Direktur Utama</p>
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

export const JsaHTML = ({ permit }: Props) => {
  const langkahKerjaList = permit.jsaData?.langkahKerja ?? [];
  const bahayaResikoList = permit.jsaData?.bahayaResiko ?? [];
  const pengendalianList = permit.jsaData?.pengendalian ?? [];
  const pelaksanaList = getPelaksanaList(permit);

  return (
    <div className="bg-white p-10 shadow-lg break-before-page print:m-0 print:max-w-none print:p-0 print:shadow-none">
      <div className="border-2 border-black text-xs text-black">
        {/* Header */}
        <div className="border-b-2 border-black py-2 text-center">
          <h1 className="text-lg font-bold tracking-widest">
            JOB SAFETY ANALYSIS (JSA)
          </h1>
          <p className="text-[10px] font-semibold mt-0.5">
            NOMOR DOKUMEN: {permit.nomorWP}
          </p>
        </div>

        {/* A. Informasi Pekerjaan */}
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
              <td className="p-1.5 font-semibold">{permit.pjTeknik?.nama}</td>
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
            <tr>
              <td className="p-1.5 text-center align-top">7</td>
              <td className="p-1.5 align-top">Judul JSA</td>
              <td className="p-1.5 align-top">:</td>
              <td className="p-1.5 font-semibold">
                {permit.jsaData?.judulJsa || "-"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* B. Analisa Keselamatan Kerja */}
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
              <th className="w-[30%] p-1.5 text-left">TINDAKAN PENGENDALIAN</th>
            </tr>
          </thead>
          <tbody>
            {langkahKerjaList.length > 0 ? (
              langkahKerjaList.map((langkah: string, idx: number) => (
                <tr key={idx} className="border-b border-black last:border-b-0">
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

      <JsaSignaturesHTML permit={permit} />
    </div>
  );
};
