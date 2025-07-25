/**
 * File                         : page.tsx (landing page for peserta dashboard)
 * Created                      : 2025-07-24
 * Last Updated                 : 2025-07-25
 * Url                          : /dashboard-peserta
 * Description                  : Landing dashboard untuk peserta aplikasi website perlombaan BFUB.
 *                                Menampilkan halaman utama ujian dengan instruksi, info token, dan tombol mulai ujian.
 * Functional                   :
 *      - Menampilkan informasi peserta dan ujian.
 *      - Menampilkan instruksi pengerjaan ujian.
 *      - Menampilkan informasi token dan cara penggunaannya.
 *      - Menyediakan tombol untuk memulai ujian.
 * API Methods      / Endpoints :
 *      - GET       api/peserta/me             (Untuk mendapatkan data peserta yang sedang login)
 *      - GET       api/peserta/token          (Untuk mendapatkan token aktif peserta)
 *      - GET       api/lomba/{id}             (Untuk mendapatkan detail lomba)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta berdasarkan session login
 *      - SELECT token aktif dari tabel token berdasarkan peserta_id
 *      - SELECT lomba dari tabel cabang_lomba untuk menampilkan info ujian
 * Anchor Links                 :
 *      - profile-peserta/page.tsx (untuk mengarahkan ke halaman profile peserta)
 *      - hasil-lomba/page.tsx (untuk mengarahkan ke halaman hasil lomba)
 *      - page_cbt/soal_pg.tsx (untuk memulai ujian)
 */

"use client";

import { useEffect, useState } from "react";

export default function HalamanUjian() {
  const [userData, setUserData] = useState<any>(null);
  
  // Data statis untuk demo - akan diganti dengan data dari API
  const [namaPeserta, setNamaPeserta] = useState("Ahmad Izzudin Azzam");
  const [asalSekolah, setAsalSekolah] = useState("SMAN 2 Bandung");
  const token = "OSA-TOKEN-001";
  const jumlahToken = 5;
  const jumlahSoal = 100;
  const waktu = 60;
  const waktuMulai = "16.00";
  const waktuAkhir = "17.00";

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      setNamaPeserta(user.nama_lengkap || "Ahmad Izzudin Azzam");
      setAsalSekolah(user.asal_sekolah || "SMAN 2 Bandung");
    }
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2">
        Selamat Datang {namaPeserta}!
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Ujian - Olimpiade Biologi
      </h2>
      <p className="text-gray-600 mb-8">
        Silakan baca instruksi di bawah ini sebelum memulai ujian.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Instruksi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-4">Instruksi Pengerjaan</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>
              Durasi ujian selama {waktu} menit termasuk pengerjaan tipe soal
              PG dan Esai.
            </li>
            <li>
              Waktu akan berjalan otomatis sesuai jadwal yang telah di
              tentukan.
            </li>
            <li>
              Sistem akan mengunci jawaban secara otomatis setelah waktu
              habis.
            </li>
            <li>
              Tidak diperkenankan membuka tab lain selama ujian berlangsung.
            </li>
            <li>
              Jika peserta membuka tab lain ketika ujian berlangsung sistem
              otomatis akan keluar dan meminta token baru.
            </li>
            <li>
              Pastikan koneksi internet stabil selama ujian berlangsung.
            </li>
            <li>
              Setiap peserta hanya diperbolehkan mengikuti ujian satu kali.
            </li>
          </ol>
        </div>

        {/* Box Token & Info */}
        <div className="flex flex-col gap-6">
          {/* Informasi Token */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-4">Informasi Token</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>
                Kamu diberikan {jumlahToken} token untuk mengakses ujian.
              </li>
              <li>Hanya 1 token aktif yang akan ditampilkan saat ini.</li>
              <li>
                Setelah token digunakan dan kamu menekan <b>Mulai</b>, token
                tersebut akan hangus dan tidak bisa digunakan kembali.
              </li>
              <li>
                Jika seluruh token telah digunakan, kamu wajib menghubungi
                panitia untuk mendapatkan token baru.
              </li>
              <li>
                Harap gunakan token dengan bijak dan pastikan kamu benar-benar
                siap sebelum menggunakannya.
              </li>
            </ol>
          </div>

          {/* Box Info Ujian */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
            <div>
              <h4 className="text-center font-bold text-md text-gray-800 mb-2">
                Olimpiade Biologi
              </h4>
              <div className="text-center text-sm mb-4">
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Token : {token}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 text-center">
                <li>Waktu : {waktu} Menit</li>
                <li>Jumlah Soal : {jumlahSoal}</li>
                <li>Mulai : {waktuMulai}</li>
                <li>Akhir : {waktuAkhir}</li>
              </ul>
            </div>

            <button className="mt-6 bg-[#D84C3B] hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md transition">
              Mulai
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
