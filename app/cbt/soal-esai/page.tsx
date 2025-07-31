/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/essay             (Untuk mendapatkan daftar soal esai)
 *      - GET       api/soal/esai/{id}         (Untuk mendapatkan detail soal esai spesifik)
 *      - POST      api/jawaban/esai/{id}      (Untuk menyimpan jawaban esai dalam bentuk teks)
 *      - POST      api/jawaban/essay/upload   (Untuk upload file jawaban esai)
 *      - GET       api/jawaban/essay          (Untuk preview file jawaban esai)
 *      - POST      api/peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)                     : soal_esai.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /cbt/soal-esai
 * Description                      : Halaman soal esai untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal esai dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal esai.
 *      - Menyediakan form untuk menjawab soal esai.
 *      - Menyimpan atau mengupdate jawaban esai peserta.
 *      - Upload file jawaban esai dalam format tertentu.
 * API Methods      / Endpoints     :
 *      - GET       /durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/essay             (Untuk mendapatkan daftar soal esai)
 *      - GET       /soal/esai/{id}         (Untuk mendapatkan detail soal esai spesifik)
 *      - POST      /jawaban/esai/{id}      (Untuk menyimpan jawaban esai dalam bentuk teks)
 *      - POST      /jawaban/essay/upload   (Untuk upload file jawaban esai)
 *      - GET       /jawaban/essay          (Untuk preview file jawaban esai)
 *      - POST      /peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus           (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT soal dari tabel soal_essay
 *      - SELECT jawaban tersimpan dari tabel jawaban_essay
 *      - INSERT jawaban di tabel jawaban_essay
 *      - UPDATE jawaban di tabel jawaban_essay
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */



"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeaderExam from "@/components/cbt/HeaderExam";
import SidebarSoal from "@/components/cbt/SidebarSoal";
import TokenPopup from "@/components/cbt/TokenPopup";
export default function Page() {
  // Masuk fullscreen jika belum
  // Ambil nama lomba dari API
  const [namaLomba, setNamaLomba] = useState<string>("-");
  useEffect(() => {
    // Fetch nama lomba dari API
    const fetchNamaLomba = async () => {
      if (typeof window === "undefined") return;
      const storedUserData = localStorage.getItem("user_data");
      if (!storedUserData) return;
      try {
        const user = JSON.parse(storedUserData);
        const pesertaId = user.id;
        if (!pesertaId) return;
        const response = await fetch(`http://localhost:8000/api/peserta/profile/${pesertaId}`);
        const data = await response.json();
        setNamaLomba(
          (data.data.cabangLomba && data.data.cabangLomba.nama_cabang) ||
          (data.data.cabang_lomba && data.data.cabang_lomba.nama_cabang) ||
          "-"
        );
      } catch (error) {
        setNamaLomba("-");
      }
    };
    fetchNamaLomba();
    // Fullscreen logic
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (document.fullscreenElement) return;
    const el = document.documentElement;
    const goFullscreen = () => {
      if (el.requestFullscreen) {
        return el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        return (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        return (el as any).msRequestFullscreen();
      }
      return Promise.resolve();
    };
    try {
      const result = goFullscreen();
      if (result && typeof result.then === "function") {
        result.catch(() => {
          // Optionally, show a warning or ignore
        });
      }
    } catch (e) {
      // Ignore permission errors or unsupported
    }
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [errorToken, setErrorToken] = useState("");
  const [tokenAktif, setTokenAktif] = useState<string>("");
  const router = useRouter();
  const tokenRef = useRef<string>("");

  useEffect(() => {
    if (showTokenPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showTokenPopup]);

  // Ambil token aktif dari localStorage (atau API jika perlu)
  useEffect(() => {
    const storedToken = localStorage.getItem("token_aktif");
    if (storedToken) {
      setTokenAktif(storedToken);
      tokenRef.current = storedToken;
      // Pakai token ulang jika reload (web restart)
      fetch("http://localhost:8000/api/peserta/pakai-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode_token: storedToken }),
      });
    }
  }, []);

  // Deteksi keluar tab dan hanguskan token
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        const kodeToken = tokenRef.current;
        if (kodeToken) {
          await fetch("http://localhost:8000/api/peserta/hanguskan-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kode_token: kodeToken }),
          });
          localStorage.removeItem("token_aktif");
        }
      }
      if (document.visibilityState === "visible") {
        setShowTokenPopup(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleBack = () => {
    setShowTokenPopup(true);
  };

  const handleTokenSubmit = async () => {
    setErrorToken("");
    // Validasi token ke backend
    const res = await fetch("http://localhost:8000/api/peserta/pakai-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kode_token: inputToken }),
    });
    const data = await res.json();
    if (data.success) {
      setShowTokenPopup(false);
      setInputToken("");
      setErrorToken("");
      setTokenAktif(inputToken);
      tokenRef.current = inputToken;
      localStorage.setItem("token_aktif", inputToken);
    } else {
      setErrorToken("Kode token tidak valid atau sudah hangus. Minta token baru ke admin.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className={showTokenPopup ? "blur-sm pointer-events-none select-none" : ""}>
        <HeaderExam 
          examTitle={`Ujian - ${namaLomba}`} 
          timeLeft="59:36" 
        />

        <div className="container mx-auto px-6 py-8 flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-8 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Soal No.{currentQuestion}</h2>
                <span className="text-[#B94A48] font-medium">{currentQuestion}/20</span>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <p className="text-gray-800 leading-relaxed">
                    Jelaskan proses terjadinya fotosintesis pada tumbuhan dan sebutkan faktor-faktor yang mempengaruhi proses tersebut!
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tulis jawaban esai Anda di sini..."
                    className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] resize-none"
                  />
                  <Button 
                    onClick={() => {}} 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Simpan
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  className="px-6 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  variant="secondary"
                  className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Tandai Soal
                </Button>
                <Button 
                  className="px-6 py-2 bg-[#B94A48] text-white hover:bg-[#A43D3B]"
                  onClick={() => router.push("/cbt/konfirmasi-jawaban")}
                >
                  Next
                </Button>
              </div>
            </Card>
          </div>

          <SidebarSoal 
            totalQuestions={20}
            currentQuestion={currentQuestion}
            onQuestionClick={setCurrentQuestion}
          />
        </div>
      </div>
      {/* Popup Token Ulang */}
      {showTokenPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowTokenPopup(false)}
              aria-label="Tutup"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L16 16M16 6L6 16" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-2">Masukan Token Baru</h2>
            <div className="text-center text-gray-600 text-sm mb-4">Harap meminta token baru kepada panitia untuk dapat mengerjakan soal kembali</div>
            <label className="block text-center text-gray-700 font-medium mb-2">Masukkan Token</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 mb-4 text-center"
              placeholder="Token Ujian"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
            />
            {errorToken && (
              <div className="w-full text-center text-red-600 text-sm mb-2">{errorToken}</div>
            )}
            <Button
              className="w-full bg-[#D84C3B] hover:bg-red-600 text-white font-semibold py-2 rounded-md shadow transition text-lg"
              style={{ minHeight: 48 }}
              onClick={handleTokenSubmit}
            >
              Mulai
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
