// ==========================================
// KOMPONEN HTML: HALAMAN 1 - WORK PERMIT
// ==========================================

import { Permit } from "../_lib/types";
import { formatTanggal } from "../_lib/utils";

interface Props {
  permit: Permit;
}

const DynamicListHTML = ({ items }: { items?: string[] }) => {
  if (!items || items.length === 0) {
    return (
      <span className="italic text-gray-500">- Tidak ada data terlampir -</span>
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

const WorkPermitSignaturesHTML = ({ permit }: { permit: Permit }) => (
  <div className="mt-8">
    <div className="grid grid-cols-3 text-center text-xs text-black">
      <div>
        <p className="mb-16 font-bold">
          Diajukan Oleh,
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
          Disahkan Oleh,
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

export const WorkPermitHTML = ({ permit }: Props) => (
  <div className="bg-white p-10 shadow-lg print:m-0 print:max-w-none print:p-0 print:shadow-none">
    <div className="border-2 border-black text-xs text-black">
      {/* Header */}
      <div className="border-b-2 border-black py-2 text-center">
        <h1 className="text-lg font-bold tracking-widest">
          FORM IZIN PEKERJAAN
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

      {/* B. Durasi Pekerjaan */}
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
            <td className="p-1.5 font-semibold">{permit.waktuMulai} WIB</td>
          </tr>
          <tr>
            <td className="p-1.5 pl-3">TANGGAL SELESAI</td>
            <td className="p-1.5">:</td>
            <td className="p-1.5 font-semibold">
              {formatTanggal(permit.tanggalSelesai)}
            </td>
            <td className="p-1.5">JAM SELESAI</td>
            <td className="p-1.5">:</td>
            <td className="p-1.5 font-semibold">{permit.waktuSelesai} WIB</td>
          </tr>
        </tbody>
      </table>

      {/* C. Klasifikasi Pekerjaan */}
      <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
        C. KLASIFIKASI PEKERJAAN
      </div>
      <div className="border-b border-black p-3">
        <DynamicListHTML items={permit.workPermitData?.klasifikasiPekerjaan} />
      </div>

      {/* D. Prosedur Pekerjaan */}
      <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
        D. PROSEDUR PEKERJAAN YANG TELAH DIJELASKAN KEPADA PEKERJA
      </div>
      <div className="border-b border-black p-3">
        <DynamicListHTML items={permit.workPermitData?.prosedurPekerjaan} />
      </div>

      {/* E. Lampiran */}
      <div className="border-b border-black bg-gray-100 px-2 py-1 font-bold">
        E. LAMPIRAN IZIN KERJA
      </div>
      <div className="p-3">
        <DynamicListHTML items={permit.workPermitData?.lampiran} />
      </div>
    </div>

    <WorkPermitSignaturesHTML permit={permit} />
  </div>
);
