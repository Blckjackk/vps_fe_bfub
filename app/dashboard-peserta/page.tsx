"use client";

import { FaTimes } from "react-icons/fa";
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

import { useEffect, useState } from "react";

// State untuk popup dan input token
// Dideklarasikan di dalam komponen utama

export default function HalamanUjian() {
  const [showPopup, setShowPopup] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [cabangLomba, setCabangLomba] = useState<string>("Memuat...");
  const [durasiUjian, setDurasiUjian] = useState<number>(0);
  const [waktuMulaiUjian, setWaktuMulaiUjian] = useState<string>("--:--");
  const [waktuAkhirUjian, setWaktuAkhirUjian] = useState<string>("--:--");
  
  // Data statis untuk demo - akan diganti dengan data dari API
  const [namaPeserta, setNamaPeserta] = useState("Ahmad Izzudin Azzam");
  const [asalSekolah, setAsalSekolah] = useState("SMAN 2 Bandung");
  const token = "OSA-TOKEN-001";
  const [tokenAktif, setTokenAktif] = useState<string | null>("Memuat...");
  const jumlahToken = 5;
  const jumlahSoal = 100;

  // Fungsi untuk menghitung durasi dalam menit
  const hitungDurasi = (waktuMulai: string, waktuAkhir: string): number => {
    const mulai = new Date(waktuMulai);
    const akhir = new Date(waktuAkhir);
    const selisih = akhir.getTime() - mulai.getTime();
    return Math.round(selisih / (1000 * 60)); // Convert to minutes
  };

  // Fungsi untuk memformat waktu ke HH:MM
  const formatWaktu = (datetime: string): string => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      setNamaPeserta(user.nama_lengkap || "Ahmad Izzudin Azzam");
      setAsalSekolah(user.asal_sekolah || "SMAN 2 Bandung");
    }

    // Fungsi untuk mengambil data cabang lomba peserta
    const fetchCabangLomba = async () => {
      const storedUserData = localStorage.getItem("user_data");
      if (!storedUserData) {
        setCabangLomba("Belum login");
        return;
      }
      
      try {
        const user = JSON.parse(storedUserData);
        const pesertaId = user.id;
        
        if (!pesertaId) {
          setCabangLomba("ID peserta tidak ditemukan");
          return;
        }

        // Ambil data peserta lengkap dengan cabang lomba
        const response = await fetch(`http://localhost:8000/api/peserta/profile/${pesertaId}`);
        const data = await response.json();
        
        if (data.success && data.data.cabang_lomba) {
          const lomba = data.data.cabang_lomba;
          setCabangLomba(lomba.nama_cabang);
          
          // Hitung durasi dan format waktu jika data tersedia
          if (lomba.waktu_mulai_pengerjaan && lomba.waktu_akhir_pengerjaan) {
            const durasi = hitungDurasi(lomba.waktu_mulai_pengerjaan, lomba.waktu_akhir_pengerjaan);
            setDurasiUjian(durasi);
            setWaktuMulaiUjian(formatWaktu(lomba.waktu_mulai_pengerjaan));
            setWaktuAkhirUjian(formatWaktu(lomba.waktu_akhir_pengerjaan));
          }
        } else {
          setCabangLomba("Cabang lomba tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal fetch cabang lomba:", error);
        setCabangLomba("Gagal mengambil data lomba");
      }
    };

    // Ambil token aktif dari localStorage atau API
    const fetchTokenPeserta = async () => {
      const storedUserData = localStorage.getItem("user_data");
      if (!storedUserData) {
        setTokenAktif("Belum login");
        return;
      }
      const user = JSON.parse(storedUserData);
      const pesertaId = user.id;
      if (!pesertaId) {
        setTokenAktif("ID peserta tidak ditemukan");
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/peserta/ambil-token?peserta_id=${pesertaId}`);
        const data = await response.json();
        if (data.success) {
          setTokenAktif(data.data.kode_token || "Tidak ada token aktif");
        } else {
          setTokenAktif("Token tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal fetch token:", error);
        setTokenAktif("Gagal mengambil token");
      }
    };

    fetchCabangLomba();
    fetchTokenPeserta();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2">
        Selamat Datang {namaPeserta}
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Ujian - {cabangLomba}
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
              Durasi ujian selama {durasiUjian > 0 ? durasiUjian : "..."} menit termasuk pengerjaan tipe soal
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
                {cabangLomba}
              </h4>
              <div className="text-center text-sm mb-4">
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Token: {tokenAktif}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 text-center">
                <li>Waktu : {durasiUjian > 0 ? durasiUjian : "..."} Menit</li>
                <li>Jumlah Soal : {jumlahSoal}</li>
                <li>Mulai : {waktuMulaiUjian}</li>
                <li>Akhir : {waktuAkhirUjian}</li>
              </ul>
            </div>

            <button className="mt-6 bg-[#D84C3B] hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md transition"
            onClick={() => setShowPopup(true)}
            >
              Mulai
            </button>
          </div>
        </div>
      </div>

      {/* Popup Token */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
              aria-label="Tutup"
            >
              <FaTimes size={22} />
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">
              {cabangLomba}
            </h2>
            <div className="text-center text-sm mb-4">
              <div>Durasi : {durasiUjian > 0 ? durasiUjian : "..."} Menit</div>
              <div>Jumlah Soal : {jumlahSoal}</div>
              <div>Waktu Mulai : {waktuMulaiUjian}</div>
              <div>Waktu Akhir : {waktuAkhirUjian}</div>
            </div>
            <label className="block text-center text-gray-700 font-medium mb-2">
              Masukkan Token
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 mb-4 text-center"
              placeholder="Token Ujian"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
            />
            <button
              className="w-full bg-[#D84C3B] hover:bg-red-600 text-white font-semibold py-2 rounded-md shadow transition"
              onClick={() => {
                // Validasi token di sini
                setShowPopup(false);
                window.location.href = "/cbt";
                // Lanjut ke ujian...
              }}
            >
              Mulai
            </button>
          </div>
        </div>
      )}
    </>
  );
}
