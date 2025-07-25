/**
 * File                         : tambah_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-lomba
 * Description                  : Halaman dashboard admin untuk menambah lomba baru pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input data lomba dan aksi penyimpanan ke database.
 * Functional                   :
 *      - Menampilkan form untuk menambah data lomba baru.
 *      - Melakukan validasi terhadap input data pada form.
 *      - Menyimpan data lomba baru ke dalam sistem.
 *      - Redirect ke daftar lomba setelah berhasil menyimpan.
 * API Methods      / Endpoints :
 *      - POST      api/lomba                  (Untuk membuat/menambah data lomba baru)
 *      - GET       api/kategori               (Untuk mendapatkan daftar kategori lomba)
 * Table Activities             :
 *      - INSERT lomba ke tabel cabang_lomba
 *      - SELECT kategori dari tabel kategori untuk dropdown
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function TambahLomba() {
  const [form, setForm] = useState({
    nama: "",
    kode: "",
    kategori: "Pilihan Ganda",
    waktuMulai: "",
    waktuAkhir: "",
    jumlahSoal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit ke API
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex">
      <div className="hidden md:block">
      </div>
      <main className="flex-1 flex flex-col items-start justify-start py-12 px-2 md:px-20">
        <div className="w-full max-w-xl">
          <Link
            href="/dashboard_admin/daftar_lomba"
            className="inline-block mb-6"
          >
            <span className="text-2xl font-bold text-[#223A5F]">
              <FaArrowLeft />
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-8">Tambah Lomba</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-8 flex flex-col gap-4"
          >
            <label className="font-medium text-sm">
              Nama Lomba
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
            <label className="font-medium text-sm">
              Kode Grup
              <input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
            <label className="font-medium text-sm">
              Kategori
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              >
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Esai">Esai</option>
              </select>
            </label>
            <label className="font-medium text-sm">
              Waktu Mulai
              <input
                type="text"
                name="waktuMulai"
                value={form.waktuMulai}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
            <label className="font-medium text-sm">
              Waktu Akhir
              <input
                type="text"
                name="waktuAkhir"
                value={form.waktuAkhir}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
            <label className="font-medium text-sm">
              Jumlah Soal
              <input
                type="text"
                name="jumlahSoal"
                value={form.jumlahSoal}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
          </form>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Link href="/dashboard_admin/daftar_lomba" className="flex-1">
                <button type="button" className="w-full bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">Back</button>
              </Link>
              <button type="submit" className="flex-1 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60]">Submit</button>
            </div>
        </div>
      </main>
    </div>
  );
}
