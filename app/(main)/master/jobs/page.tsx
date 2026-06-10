"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// 1. Perbarui Interface agar mencakup semua data dokumen
interface JobTemplate {
  _id: string;
  kodePekerjaan: string;
  namaPekerjaan: string;
  status: string;
  createdAt: string;
  workPermitTemplate?: any;
  jsaTemplate?: any;
  hirarcTemplate?: any;
  sopTemplate?: any;
  ikTemplate?: any;
}

export default function JobTemplatePage() {
  const [jobs, setJobs] = useState<JobTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol Modal Detail
  const [selectedJob, setSelectedJob] = useState<JobTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/job-templates");
      const result = await res.json();
      setJobs(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus template ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/job-templates/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  // Fungsi untuk membuka Modal Detail
  const handleViewDetail = (job: JobTemplate) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Fungsi pembantu untuk merender array (daftar) jadi elemen <li>
  const renderList = (arr?: string[]) => {
    if (!arr || arr.length === 0)
      return <p className="text-gray-400 italic text-sm">- Tidak ada data -</p>;
    return (
      <ul className="list-disc list-inside text-sm text-gray-700">
        {arr.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Memuat data template...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Master Pekerjaan K3
        </h1>
        <Link
          href="/master/jobs/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          + Tambah Template
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-700">
              <th className="p-4 text-left font-semibold">Kode</th>
              <th className="p-4 text-left font-semibold">Nama Pekerjaan</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Dibuat</th>
              <th className="p-4 text-center font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{job.kodePekerjaan}</td>
                <td className="p-4">{job.namaPekerjaan}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}
                  >
                    {job.status || "active"}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(job.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {/* Tombol Detail Baru */}
                    <button
                      onClick={() => handleViewDetail(job)}
                      className="rounded bg-teal-500 px-3 py-1 text-white hover:bg-teal-600 transition text-sm"
                    >
                      Detail
                    </button>

                    <Link
                      href={`/master/jobs/${job._id}/edit`}
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 transition text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Belum ada template pekerjaan yang dibuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================= */}
      {/* MODAL / DIALOG DETAIL */}
      {/* ========================================= */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* Box Modal */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detail Template K3
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedJob.kodePekerjaan} - {selectedJob.namaPekerjaan}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition text-2xl font-bold p-2"
              >
                &times;
              </button>
            </div>

            {/* Area Scrollable Konten Modal */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Seksi Work Permit */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-2 mb-3">
                  1. Work Permit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Klasifikasi Pekerjaan
                    </span>
                    {renderList(
                      selectedJob.workPermitTemplate?.klasifikasiPekerjaan,
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Prosedur Pekerjaan
                    </span>
                    {renderList(
                      selectedJob.workPermitTemplate?.prosedurPekerjaan,
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Lampiran
                    </span>
                    {renderList(selectedJob.workPermitTemplate?.lampiran)}
                  </div>
                </div>
              </div>

              {/* Seksi JSA */}
              <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                <h3 className="font-bold text-indigo-800 border-b border-indigo-200 pb-2 mb-3">
                  2. Job Safety Analysis (JSA)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Langkah Kerja
                    </span>
                    {renderList(selectedJob.jsaTemplate?.langkahKerja)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Bahaya & Resiko
                    </span>
                    {renderList(selectedJob.jsaTemplate?.bahayaResiko)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Pengendalian
                    </span>
                    {renderList(selectedJob.jsaTemplate?.pengendalian)}
                  </div>
                </div>
              </div>

              {/* Seksi HIRARC */}
              <div className="bg-red-50/40 p-5 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-800 border-b border-red-200 pb-3 mb-4 text-lg">
                  3. Identifikasi Bahaya & Pengendalian Resiko (HIRARC)
                </h3>

                {!selectedJob.hirarcTemplate?.potensiBahaya ||
                selectedJob.hirarcTemplate.potensiBahaya.length === 0 ? (
                  <p className="text-sm text-gray-500 italic bg-white p-4 rounded border border-gray-200 text-center">
                    Data HIRARC belum tersedia untuk template ini.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.hirarcTemplate.potensiBahaya.map(
                      (potensi: string, index: number) => {
                        // Alias untuk mempersingkat pemanggilan object
                        const h = selectedJob.hirarcTemplate;

                        // Handle array status (jika di DB tersimpan sbg string digabung koma, kita pecah)
                        const statusArray =
                          h.statusPengendalian &&
                          typeof h.statusPengendalian === "string"
                            ? h.statusPengendalian.split(", ")
                            : Array.isArray(h.statusPengendalian)
                              ? h.statusPengendalian
                              : [];

                        return (
                          <div
                            key={index}
                            className="bg-white border border-red-100 rounded-xl p-5 shadow-sm relative transition-all hover:shadow-md"
                          >
                            {/* Badge Nomor */}
                            <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-black w-7 h-7 flex items-center justify-center rounded-full">
                              {index + 1}
                            </div>

                            {/* Baris 1: Detail Bahaya */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 pr-10">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                  Potensi Bahaya
                                </span>
                                <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">
                                  {potensi || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                  Resiko
                                </span>
                                <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">
                                  {h.resiko?.[index] || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                  Tindakan Pengendalian
                                </span>
                                <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">
                                  {h.pengendalian?.[index] || "-"}
                                </p>
                              </div>
                            </div>

                            {/* Baris 2: Kotak Skor */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 flex justify-between items-center text-sm">
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                  Skor Awal
                                </span>
                                <p className="text-gray-700">
                                  S:{" "}
                                  <span className="font-semibold">
                                    {h.konsekuensiKeparahan?.[index] || "-"}
                                  </span>{" "}
                                  <span className="text-gray-300 mx-1">|</span>
                                  P:{" "}
                                  <span className="font-semibold">
                                    {h.kemungkinanTerjadi?.[index] || "-"}
                                  </span>{" "}
                                  <span className="text-gray-300 mx-1">|</span>
                                  Lvl:{" "}
                                  <span className="font-black text-red-600">
                                    {h.tingkatResiko?.[index] || "-"}
                                  </span>
                                </p>
                              </div>

                              <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 flex justify-between items-center text-sm">
                                <span className="text-[10px] font-bold text-green-600 uppercase">
                                  Skor Sbl. Pengendalian
                                </span>
                                <p className="text-gray-700">
                                  S:{" "}
                                  <span className="font-semibold">
                                    {h.konsekuensiSetelahPengendalian?.[
                                      index
                                    ] || "-"}
                                  </span>{" "}
                                  <span className="text-gray-300 mx-1">|</span>
                                  P:{" "}
                                  <span className="font-semibold">
                                    {h.kemungkinanTerjadiSetelahPengendalian?.[
                                      index
                                    ] || "-"}
                                  </span>{" "}
                                  <span className="text-gray-300 mx-1">|</span>
                                  Lvl:{" "}
                                  <span className="font-black text-green-600">
                                    {h.tingkatResikoSetelahPengendalian?.[
                                      index
                                    ] || "-"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Baris 3: PIC dan Status */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-xs">
                              <p>
                                <span className="font-bold text-gray-400 uppercase mr-1">
                                  Penanggung Jawab:
                                </span>
                                <span className="font-semibold text-blue-700">
                                  {h.penanggungJawab?.[index] || "-"}
                                </span>
                              </p>
                              <p>
                                <span className="font-bold text-gray-400 uppercase mr-1">
                                  Status:
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {statusArray[index] || "-"}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Seksi SOP */}
              <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                <h3 className="font-bold text-green-800 border-b border-green-200 pb-2 mb-3">
                  4. SOP
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Perlengkapan Kerja
                    </span>
                    {renderList(selectedJob.sopTemplate?.perlengkapanKerja)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Peralatan Ukur
                    </span>
                    {renderList(selectedJob.sopTemplate?.peralatanUkur)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Peralatan Kerja
                    </span>
                    {renderList(selectedJob.sopTemplate?.peralatanKerja)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Uraian Kegiatan
                    </span>
                    {renderList(selectedJob.sopTemplate?.uraianKegiatan)}
                  </div>
                </div>
              </div>

              {/* Seksi IK */}
              <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
                <h3 className="font-bold text-yellow-800 border-b border-yellow-200 pb-2 mb-3">
                  5. Instruksi Kerja
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Perlengkapan Kerja
                    </span>
                    {renderList(selectedJob.ikTemplate?.perlengkapanKerja)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Peralatan Kerja
                    </span>
                    {renderList(selectedJob.ikTemplate?.peralatanKerja)}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Uraian Kegiatan
                    </span>
                    {renderList(selectedJob.ikTemplate?.uraianKegiatan)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
