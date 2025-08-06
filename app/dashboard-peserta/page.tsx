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
import { withAuth } from '@/lib/auth';

// State untuk popup dan input token
// Dideklarasikan di dalam komponen utama

function HalamanUjian() {
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [cabangLomba, setCabangLomba] = useState<string>("Memuat...");
  const [durasiUjian, setDurasiUjian] = useState<number>(0);
  const [waktuMulaiUjian, setWaktuMulaiUjian] = useState<string>("--:--");
  const [waktuAkhirUjian, setWaktuAkhirUjian] = useState<string>("--:--");
  const [waktuMulaiPengerjaan, setWaktuMulaiPengerjaan] = useState<Date | null>(null); // Waktu mulai actual
  const [waktuAkhirPengerjaan, setWaktuAkhirPengerjaan] = useState<Date | null>(null); // Waktu akhir actual
  const [countdown, setCountdown] = useState<string>(''); // Countdown timer
  const [statusUjian, setStatusUjian] = useState<string>("belum_mulai"); // Tambah state untuk status ujian
  
  // Data statis untuk demo - akan diganti dengan data dari API
  const [namaPeserta, setNamaPeserta] = useState("Ahmad Izzudin Azzam");
  const [asalSekolah, setAsalSekolah] = useState("SMAN 2 Bandung");
  const token = "OSA-TOKEN-001";
  const [tokenAktif, setTokenAktif] = useState<string | null>("Memuat...");
  const [namaLomba, setNamaLomba] = useState<string>("-");
  const [lombaId, setLombaId] = useState<string | null>(null);
  const [jumlahToken] = useState<number>(5);
  const [jumlahSoal, setJumlahSoal] = useState<number>(0);


  // Fungsi untuk validasi dan menggunakan token
  const validateAndUseToken = async (token: string) => {
    const storedUserData = localStorage.getItem("user_data");
    if (!storedUserData) {
      throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
    }

    const user = JSON.parse(storedUserData);
    
    if (!user.id || !lombaId) {
      throw new Error("Data peserta atau lomba tidak lengkap. Silakan refresh halaman.");
    }

    console.log("Mengirim data token:", {
      kode_token: token,
      peserta_id: user.id,
      cabang_lomba_id: lombaId
    });

    const res = await fetch("http://localhost:8000/api/peserta/pakai-token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        kode_token: token,
        peserta_id: user.id,
        cabang_lomba_id: lombaId
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Response validasi token:", data);
    return data;
  };

  // Fungsi untuk mengecek apakah ujian sudah boleh dimulai
  // Fungsi untuk format countdown
  const formatCountdown = (targetDate: Date): string => {
    const sekarang = new Date();
    const selisih = targetDate.getTime() - sekarang.getTime();
    
    if (selisih <= 0) {
      return '';
    }
    
    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);
    
    if (hari > 0) {
      return `${hari} hari ${jam} jam ${menit} menit`;
    } else if (jam > 0) {
      return `${jam} jam ${menit} menit ${detik} detik`;
    } else {
      return `${menit} menit ${detik} detik`;
    }
  };

  const isUjianBolehDimulai = (): boolean => {
    if (!waktuMulaiPengerjaan || !waktuAkhirPengerjaan) return false;
    
    const sekarang = new Date();
    return sekarang >= waktuMulaiPengerjaan && sekarang <= waktuAkhirPengerjaan;
  };

  // Fungsi untuk mengecek apakah waktu ujian sudah lewat
  const isWaktuUjianLewat = (): boolean => {
    if (!waktuAkhirPengerjaan) return false;
    
    const sekarang = new Date();
    return sekarang > waktuAkhirPengerjaan;
  };

  // Fungsi untuk mendapatkan pesan status ujian
  const getStatusUjianMessage = (): string => {
    if (!waktuMulaiPengerjaan || !waktuAkhirPengerjaan) return "Memuat informasi ujian...";
    
    const sekarang = new Date();
    
    if (sekarang < waktuMulaiPengerjaan) {
      const selisihMenit = Math.ceil((waktuMulaiPengerjaan.getTime() - sekarang.getTime()) / (1000 * 60));
      if (selisihMenit < 60) {
        return `Ujian akan dimulai dalam ${selisihMenit} menit`;
      } else {
        const selisihJam = Math.ceil(selisihMenit / 60);
        return `Ujian akan dimulai dalam ${selisihJam} jam`;
      }
    } else if (sekarang > waktuAkhirPengerjaan) {
      return "Waktu ujian sudah berakhir";
    } else {
      const sisaMenit = Math.floor((waktuAkhirPengerjaan.getTime() - sekarang.getTime()) / (1000 * 60));
      return `Ujian sedang berlangsung (sisa ${sisaMenit} menit)`;
    }
  };

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
      setStatusUjian(user.status_ujian || "belum_mulai"); // Set status ujian dari user data

      // Cek apakah peserta memiliki token yang sedang digunakan
      const checkActiveToken = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/peserta/pakai-token", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({ 
              kode_token: "", // kosong karena hanya mengecek
              peserta_id: user.id,
              cabang_lomba_id: user.cabang_lomba_id
            }),
          });

          const data = await res.json();
          if (data.success && data.data?.token) {
            // Jika ada token yang sedang digunakan, redirect ke CBT
            localStorage.setItem("token_aktif", data.data.token);
            localStorage.setItem("waktu_mulai", data.data.waktu_mulai);
            window.location.href = "/cbt";
          }
        } catch (error) {
          console.error("Error checking active token:", error);
        }
      };

      checkActiveToken();
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
          console.log("Masuk ke fetchCabangLomba");
          const lomba = data.data.cabang_lomba;
          const peserta = data.data;
          console.log("Data cabang_lomba dari API:", lomba);
          const totalSoal = (lomba.soal_pg || 0) +(lomba.soal_isian || 0) +(lomba.soal_esai || 0);
          
          setJumlahSoal(totalSoal);
          setCabangLomba(lomba.nama_cabang);
          setStatusUjian(peserta.status_ujian || "belum_mulai"); // Update status ujian dari API

          // Hitung durasi dan format waktu jika data tersedia
          if (lomba.waktu_mulai_pengerjaan && lomba.waktu_akhir_pengerjaan) {
            const durasi = hitungDurasi(lomba.waktu_mulai_pengerjaan, lomba.waktu_akhir_pengerjaan);
            setDurasiUjian(durasi);
            setWaktuMulaiUjian(formatWaktu(lomba.waktu_mulai_pengerjaan));
            setWaktuAkhirUjian(formatWaktu(lomba.waktu_akhir_pengerjaan));
            
            // Simpan waktu sebagai Date objects untuk validasi
            setWaktuMulaiPengerjaan(new Date(lomba.waktu_mulai_pengerjaan));
            setWaktuAkhirPengerjaan(new Date(lomba.waktu_akhir_pengerjaan));
            
            // Set initial countdown jika ujian belum dimulai
            const sekarang = new Date();
            const waktuMulai = new Date(lomba.waktu_mulai_pengerjaan);
            if (sekarang < waktuMulai) {
              setCountdown(formatCountdown(waktuMulai));
            }
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
        // Pertama ambil data profil peserta untuk mendapatkan cabang lomba
        const profileResponse = await fetch(`http://localhost:8000/api/peserta/profile/${pesertaId}`);
        const profileData = await profileResponse.json();
        
        if (profileData.success && profileData.data.cabang_lomba) {
          setNamaLomba(profileData.data.cabang_lomba.nama_cabang);
          setLombaId(profileData.data.cabang_lomba.id);
        }

        // Kemudian ambil token aktif
        const response = await fetch(`http://localhost:8000/api/peserta/ambil-token?peserta_id=${pesertaId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setTokenAktif(data.data.kode_token || "Tidak ada token aktif");
          // Update nama lomba jika belum diset dari profile
          if (!profileData.success && data.data.cabang_lomba) {
            setNamaLomba(data.data.cabang_lomba.nama_cabang);
            setLombaId(data.data.cabang_lomba.id);
          }
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

  // Update status ujian secara real-time setiap menit
  useEffect(() => {
    if (!waktuMulaiPengerjaan || !waktuAkhirPengerjaan) return;

    const interval = setInterval(() => {
      const sekarang = new Date();
      
      // Update countdown
      if (sekarang < waktuMulaiPengerjaan) {
        setCountdown(formatCountdown(waktuMulaiPengerjaan));
      } else if (sekarang >= waktuMulaiPengerjaan && sekarang <= waktuAkhirPengerjaan) {
        setCountdown('');
      } else {
        setCountdown('');
      }
      
      // Update status ujian berdasarkan waktu
      if (sekarang > waktuAkhirPengerjaan && statusUjian !== 'selesai') {
        setStatusUjian('selesai');
      }
    }, 1000); // Update setiap detik untuk countdown yang akurat

    return () => clearInterval(interval);
  }, [waktuMulaiPengerjaan, waktuAkhirPengerjaan, statusUjian]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2">
        Selamat Datang {namaPeserta}
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Lomba - {namaLomba}
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
              Durasi pengerjaan sesuai dengan ketentuan yang telah di tetapkan panitia yang mencakup seluruh jenis soal.
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
                Kamu dapat menghubungi panitia untuk mendapatkan token baru.
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
                {namaLomba}
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

            {/* Status Waktu Real-time */}
            <div className="mt-4 p-3 rounded-lg border-l-4 text-sm">
              {isWaktuUjianLewat() ? (
                <div className="border-l-red-500 bg-red-50 text-red-700">
                  <strong>Status:</strong> Waktu ujian sudah berakhir
                </div>
              ) : !isUjianBolehDimulai() ? (
                <div className="border-l-yellow-500 bg-yellow-50 text-yellow-700">
                  <strong>Status:</strong> {getStatusUjianMessage()}
                  {countdown && (
                    <div className="mt-2 text-lg font-mono font-bold text-yellow-800">
                      Ujian dimulai dalam: {countdown}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-l-green-500 bg-green-50 text-green-700">
                  <strong>Status:</strong> Ujian sedang berlangsung - Anda dapat memulai
                </div>
              )}
            </div>

            <button 
              className={`mt-6 text-sm font-medium py-2 rounded-md transition ${
                statusUjian === 'selesai' || isWaktuUjianLewat() || !isUjianBolehDimulai()
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-[#D84C3B] hover:bg-red-600 text-white'
              }`}
              onClick={() => {
                if (statusUjian !== 'selesai' && isUjianBolehDimulai() && !isWaktuUjianLewat()) {
                  setShowPopup(true);
                } else if (!isUjianBolehDimulai() && !isWaktuUjianLewat()) {
                  setErrorMessage("Ujian belum dimulai. Silakan tunggu hingga waktu yang ditentukan.");
                  setShowErrorPopup(true);
                } else if (isWaktuUjianLewat()) {
                  setErrorMessage("Waktu ujian sudah berakhir. Anda tidak dapat lagi mengikuti ujian.");
                  setShowErrorPopup(true);
                }
              }}
              disabled={statusUjian === 'selesai' || isWaktuUjianLewat() || !isUjianBolehDimulai()}
            >
              {statusUjian === 'selesai' 
                ? 'Ujian Sudah Selesai' 
                : isWaktuUjianLewat() 
                ? 'Waktu Ujian Sudah Berakhir'
                : !isUjianBolehDimulai() 
                ? getStatusUjianMessage()
                : 'Mulai'
              }
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
              {namaLomba}
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
              onClick={async () => {
                // Validasi waktu ujian dulu sebelum validasi token
                if (!isUjianBolehDimulai()) {
                  setShowPopup(false);
                  setErrorMessage("Ujian belum dimulai. Silakan tunggu hingga waktu yang ditentukan.");
                  setShowErrorPopup(true);
                  return;
                }

                if (isWaktuUjianLewat()) {
                  setShowPopup(false);
                  setErrorMessage("Waktu ujian sudah berakhir. Anda tidak dapat lagi mengikuti ujian.");
                  setShowErrorPopup(true);
                  return;
                }

                // Validasi dan pakai token ke backend
                if (!inputToken) {
                  alert("Mohon masukkan token");
                  return;
                }

                const userData = localStorage.getItem("user_data");
                if (!userData) {
                  alert("Sesi login tidak ditemukan. Silakan login ulang.");
                  return;
                }

                const user = JSON.parse(userData);
                
                try {
                  const res = await fetch("http://localhost:8000/api/peserta/pakai-token", {
                    method: "POST",
                    headers: { 
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                    },
                    body: JSON.stringify({ 
                      kode_token: inputToken,
                      peserta_id: user.id,
                      cabang_lomba_id: lombaId
                    }),
                  });

                  const data = await res.json();
                  console.log("Response pakai token:", data); // Debug response

                  if (data.success) {
                    // Simpan informasi token dan redirect
                    setShowPopup(false);
                    localStorage.setItem("token_aktif", inputToken);
                    localStorage.setItem("waktu_mulai", new Date().toISOString());
                    localStorage.setItem("durasi_ujian", String(durasiUjian));
                    window.location.href = "/cbt";
                  } else {
                    setErrorMessage(data.message || "Token tidak valid atau sudah digunakan/hangus. Minta token baru ke panitia.");
                    setShowErrorPopup(true);
                  }
                } catch (err) {
                  console.error("Error validasi token:", err);
                  setErrorMessage("Gagal menghubungi server. Coba lagi.");
                  setShowErrorPopup(true);
                }
              }}
            >
              Mulai
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowErrorPopup(false)}
              aria-label="Tutup"
            >
              <FaTimes size={22} />
            </button>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <FaTimes className="text-[#D84C3B] text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Token Tidak Valid</h2>
            </div>
            <p className="text-center text-gray-600 mb-6">{errorMessage}</p>
            <button
              className="w-full bg-[#D84C3B] hover:bg-red-600 text-white font-semibold py-2 rounded-md shadow transition"
              onClick={() => setShowErrorPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Protect this page with peserta-only access
export default withAuth(HalamanUjian, ['peserta']);
