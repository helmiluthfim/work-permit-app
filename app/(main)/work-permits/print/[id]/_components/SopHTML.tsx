// ==========================================
// KOMPONEN HTML: HALAMAN SOP
// ==========================================

import { Permit } from "../_lib/types";

interface Props {
  permit: Permit;
}

// ── Helper: render uraian kegiatan ────────────────────────────────────────────
// Judul (huruf kapital semua / diawali huruf besar diikuti titik) → bold
// Item biasa → normal
function UraianKegiatanItem({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Deteksi judul: diawali huruf kapital tunggal diikuti titik (A. B. C. D.)
  // atau teks ALL CAPS, atau diawali C.1 / C.2 dst
  const isJudul =
    /^[A-Z]\.\s/.test(trimmed) || // A. B. C. D.
    /^[A-Z]\d+\.\s/.test(trimmed) || // C.1. C.2.
    /^[A-Z0-9]+\.[0-9]+\.\s/.test(trimmed); // C.1. format lain

  return (
    <p
      className={`text-xs leading-relaxed ${isJudul ? "font-bold mt-3 first:mt-0" : "pl-2"}`}
    >
      {trimmed}
    </p>
  );
}

// ── Helper: render list peralatan dua kolom ───────────────────────────────────
function EquipmentGrid({ items }: { items: string[] }) {
  if (!items || items.length === 0)
    return <p className="text-xs italic text-gray-400">-</p>;

  // Bagi jadi dua kolom
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-0.5">
        {col1.map((item, i) => (
          <div key={i} className="flex gap-1.5 text-xs">
            <span className="w-4 shrink-0 text-right font-semibold">
              {i + 1}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      {col2.length > 0 && (
        <div className="flex-1 space-y-0.5">
          {col2.map((item, i) => (
            <div key={i} className="flex gap-1.5 text-xs">
              <span className="w-4 shrink-0 text-right font-semibold">
                {half + i + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tanda tangan ─────────────────────────────────────────────────────────────
const SopSignaturesHTML = ({ permit }: { permit: Permit }) => (
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

// ── Main Component ────────────────────────────────────────────────────────────
export const SopHTML = ({ permit }: Props) => {
  const sopDocs = Array.isArray(permit.sopData) ? permit.sopData : [];

  return (
    <div className="bg-white p-10 shadow-lg break-before-page print:m-0 print:max-w-none print:p-0 print:shadow-none">
      <div className="border-2 border-black text-xs text-black">
        {/* ── Header ── */}
        <div className="border-b-2 border-black py-2 text-center">
          <h1 className="text-sm font-bold tracking-widest uppercase">
            Standar Operasional Prosedur (SOP)
          </h1>
          <p className="text-[10px] font-semibold mt-0.5 uppercase">
            {permit.pekerjaan?.namaPekerjaan}
          </p>
          <p className="text-[10px] mt-0.5">NOMOR DOKUMEN: {permit.nomorWP}</p>
        </div>

        {sopDocs.length === 0 ? (
          <p className="p-6 text-center italic text-gray-400">
            Tidak ada data SOP terlampir.
          </p>
        ) : (
          sopDocs.map((sop, idx) => (
            <div key={idx}>
              {/* Judul SOP jika lebih dari satu */}
              {sopDocs.length > 1 && (
                <div className="border-b border-black bg-gray-50 px-3 py-1.5 font-bold text-xs uppercase">
                  {sop.judulSop || `SOP #${idx + 1}`}
                </div>
              )}

              {/* ── Perlengkapan K3 ── */}
              <table className="w-full border-b border-black">
                <tbody>
                  <tr>
                    <td className="w-36 border-r border-black px-3 py-3 font-bold align-top text-xs uppercase">
                      Perlengkapan K3
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentGrid items={sop.perlengkapanKerja ?? []} />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Peralatan Ukur dan Uji ── */}
              <table className="w-full border-b border-black">
                <tbody>
                  <tr>
                    <td className="w-36 border-r border-black px-3 py-3 font-bold align-top text-xs uppercase">
                      Peralatan Ukur
                      <br />
                      dan Uji
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentGrid items={sop.peralatanUkur ?? []} />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Peralatan Kerja ── */}
              <table className="w-full border-b border-black">
                <tbody>
                  <tr>
                    <td className="w-36 border-r border-black px-3 py-3 font-bold align-top text-xs uppercase">
                      Peralatan Kerja
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentGrid items={sop.peralatanKerja ?? []} />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Uraian Kegiatan ── */}
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-36 border-r border-black px-3 py-3 font-bold align-top text-xs uppercase">
                      Uraian Kegiatan
                    </td>
                    <td className="px-4 py-3 space-y-0.5">
                      {/* judulUraianKegiatan = judul bold, uraianKegiatan = isi */}
                      {(sop.judulUraianKegiatan ?? []).map((judul, i) => (
                        <div key={i}>
                          {/* ✅ Judul dicetak TEBAL */}
                          {judul && (
                            <p className="text-xs font-bold mt-3 first:mt-0">
                              {judul}
                            </p>
                          )}
                          {/* Isi uraian yang berkaitan dengan judul ini */}
                          {(sop.uraianKegiatan ?? [])
                            .filter((_, ui) => {
                              // Cek apakah item uraian ini termasuk grup judul ke-i
                              // Berdasarkan posisi relatif terhadap judul
                              const judulIndices = (
                                sop.judulUraianKegiatan ?? []
                              ).map((_, ji) => ji);
                              const nextJudulPos = judulIndices.find(
                                (ji) => ji > i,
                              );
                              return (
                                ui >= i &&
                                (nextJudulPos === undefined ||
                                  ui < nextJudulPos)
                              );
                            })
                            .map((uraian, ui) => (
                              <p
                                key={ui}
                                className="text-xs pl-2 leading-relaxed"
                              >
                                {uraian}
                              </p>
                            ))}
                        </div>
                      ))}

                      {/* Fallback: jika tidak ada judulUraianKegiatan, tampilkan uraianKegiatan langsung */}
                      {(!sop.judulUraianKegiatan ||
                        sop.judulUraianKegiatan.length === 0) &&
                        (sop.uraianKegiatan ?? []).map((uraian, i) => (
                          <UraianKegiatanItem key={i} text={uraian} />
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <SopSignaturesHTML permit={permit} />
    </div>
  );
};
