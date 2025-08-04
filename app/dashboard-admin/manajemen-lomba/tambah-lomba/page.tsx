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
import { useRouter } from "next/navigation";

export default function TambahLomba() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama_cabang: "",
    deskripsi_lomba: "",
    waktu_mulai_pengerjaan: "",
    waktu_akhir_pengerjaan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending form data:', form); // Debug log
      
      const response = await fetch('http://localhost:8000/api/lomba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();
      console.log('API Response:', result); // Debug log

      if (result.success) {
        alert('Lomba berhasil dibuat!');
        router.push('/dashboard-admin/manajemen-lomba');
      } else {
        // Show detailed error message
        let errorMessage = result.message || 'Gagal membuat lomba';
        
        // If there are validation errors, show them
        if (result.errors) {
          const errorList = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          errorMessage += '\n\nDetail error:\n' + errorList;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error creating lomba:', error);
      alert('Terjadi kesalahan saat membuat lomba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex">
      <div className="hidden md:block">
      </div>
      <main className="flex-1 flex flex-col items-start justify-start py-12 px-2 md:px-20">
        <div className="w-full max-w-xl">
          <Link
            href="/dashboard-admin/manajemen-lomba"
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
              Nama Cabang Lomba
              <input
                type="text"
                name="nama_cabang"
                value={form.nama_cabang}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
                placeholder="Contoh: Matematika, Fisika, Kimia"
              />
            </label>
            
            <label className="font-medium text-sm">
              Deskripsi Lomba
              <textarea
                name="deskripsi_lomba"
                value={form.deskripsi_lomba}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                placeholder="Deskripsi singkat tentang lomba ini..."
              />
            </label>
            
            <label className="font-medium text-sm">
              Waktu Mulai Pengerjaan
              <input
                type="datetime-local"
                name="waktu_mulai_pengerjaan"
                value={form.waktu_mulai_pengerjaan}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>
            
            <label className="font-medium text-sm">
              Waktu Akhir Pengerjaan
              <input
                type="datetime-local"
                name="waktu_akhir_pengerjaan"
                value={form.waktu_akhir_pengerjaan}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                required
              />
            </label>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Link href="/dashboard-admin/manajemen-lomba" className="flex-1">
                <button type="button" className="w-full bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
                  Batal
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Lomba'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
