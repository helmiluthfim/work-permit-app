"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePersonnelPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");

  const [jabatan, setJabatan] = useState("Pelaksana");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/personnel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        jabatan,
      }),
    });

    if (res.ok) {
      router.push("/master/personnel");
    }
  };

  return (
    <div className="max-w-xl p-6">
      <h1 className="mb-5 text-2xl font-bold">Tambah Personel</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama"
          className="w-full rounded border p-2"
        />

        <select
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option>PJ Teknik</option>

          <option>Pelaksana</option>

          <option>Tenaga Ahli K3</option>
        </select>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
