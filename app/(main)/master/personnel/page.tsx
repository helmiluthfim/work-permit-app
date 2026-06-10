"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Personnel {
  _id: string;
  nama: string;
  jabatan: string;
  aktif: boolean;
  createdAt: string;
}

export default function PersonnelPage() {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonnels = async () => {
    try {
      const res = await fetch("/api/personnel");

      const result = await res.json();

      if (result.success) {
        setPersonnels(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus personel ini?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!result.success) {
        alert("Gagal menghapus data");
        return;
      }

      fetchPersonnels();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Master Personel</h1>

          <p className="text-sm text-gray-500">Data PJ Teknik dan Pelaksana</p>
        </div>

        <Link
          href="/master/personnel/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Tambah Personel
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Jabatan</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {personnels.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Belum ada data personel
                </td>
              </tr>
            ) : (
              personnels.map((personnel) => (
                <tr key={personnel._id} className="border-t">
                  <td className="p-3">{personnel.nama}</td>

                  <td className="p-3">{personnel.jabatan}</td>

                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        personnel.aktif
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {personnel.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/master/personnel/${personnel._id}/edit`}
                        className="rounded bg-yellow-500 px-3 py-1 text-sm text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(personnel._id)}
                        className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
