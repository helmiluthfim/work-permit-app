"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPersonnelPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [aktif, setAktif] = useState(true);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await fetch(`/api/personnel/${id}`);

      const result = await res.json();

      if (result.success) {
        const data = result.data;

        setNama(data.nama);
        setJabatan(data.jabatan);
        setAktif(data.aktif);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          jabatan,
          aktif,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        alert("Gagal memperbarui data");
        return;
      }

      alert("Data berhasil diperbarui");

      router.push("/master/personnel");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Personel</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>

          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jabatan</label>

          <select
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="PJ Teknik">PJ Teknik</option>

            <option value="Pelaksana">Pelaksana</option>

            <option value="Tenaga Ahli K3">Tenaga Ahli K3</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
            />
            Aktif
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Simpan
          </button>

          <button
            type="button"
            onClick={() => router.push("/master/personnel")}
            className="rounded bg-gray-500 px-4 py-2 text-white"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
