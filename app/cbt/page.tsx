"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeaderExam from "@/components/cbt/HeaderExam";
import SidebarSoal from "@/components/cbt/SidebarSoal";
import TokenPopup from "@/components/cbt/TokenPopup";
import ConfirmationSubmitPopup from "@/components/cbt/ConfirmationSubmitPopup";
import SuccessNextSectionPopup from "@/components/cbt/SuccessNextSectionPopup";

type QuestionType = 'pg' | 'singkat' | 'esai';

export default function CBTPage() {
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [errorToken, setErrorToken] = useState("");
  const [tokenAktif, setTokenAktif] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>('pg');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();
  const tokenRef = useRef<string>("");

  // Masuk fullscreen jika belum
  useEffect(() => {
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

  useEffect(() => {
    if (showTokenPopup || showConfirmationPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showTokenPopup, showConfirmationPopup]);

  // Reset currentQuestion when switching question types
  useEffect(() => {
    setCurrentQuestion(1);
    setAnswer("");
    setSelectedOption(null);
  }, [questionType]);

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

  const handleBack = () => {
    if (currentQuestion === 1) {
      switch (questionType) {
        case 'singkat':
          setQuestionType('pg');
          setCurrentQuestion(100); // Kembali ke soal PG terakhir
          break;
        case 'esai':
          setQuestionType('singkat');
          setCurrentQuestion(20); // Kembali ke soal singkat terakhir
          break;
      }
    } else {
      setCurrentQuestion(prev => Math.max(prev - 1, 1));
    }
  };

  const handleNext = () => {
    const maxQuestions = questionType === 'pg' ? 100 : 20;
    
    if (currentQuestion === maxQuestions) {
      switch (questionType) {
        case 'pg':
          setQuestionType('singkat');
          break;
        case 'singkat':
          setQuestionType('esai');
          break;
        case 'esai':
          setShowConfirmationPopup(true);
          break;
      }
    } else {
      setCurrentQuestion(prev => Math.min(prev + 1, maxQuestions));
    }
  };

  const getNextButtonText = () => {
    if (currentQuestion === (questionType === 'pg' ? 100 : 20)) {
      switch (questionType) {
        case 'pg':
          return "Lanjut ke Soal Singkat";
        case 'singkat':
          return "Lanjut ke Soal Esai";
        case 'esai':
          return "Submit Ujian";
        default:
          return "Next";
      }
    }
    return "Next";
  };

  const getBackButtonText = () => {
    if (currentQuestion === 1) {
      switch (questionType) {
        case 'singkat':
          return "Kembali ke Soal PG";
        case 'esai':
          return "Kembali ke Soal Singkat";
        default:
          return "Back";
      }
    }
    return "Back";
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className={`${(showTokenPopup || showConfirmationPopup) ? "blur-sm pointer-events-none select-none" : ""}`}>
        <HeaderExam 
          examTitle="Olimpiade Biologi" 
          timeLeft="59:36" 
        />

        <div className="container mx-auto px-6 pt-4">
          <div className="flex gap-4 mb-4">
            <Button 
              variant={questionType === 'pg' ? 'default' : 'outline'}
              className={questionType === 'pg' 
                ? "bg-[#B94A48] text-white hover:bg-[#A43D3B] font-medium"
                : "text-gray-700 hover:bg-gray-50 font-medium"
              }
              onClick={() => setQuestionType('pg')}
            >
              Pilihan Ganda
            </Button>
            <Button 
              variant={questionType === 'singkat' ? 'default' : 'outline'}
              className={questionType === 'singkat'
                ? "bg-[#B94A48] text-white hover:bg-[#A43D3B] font-medium"
                : "text-gray-700 hover:bg-gray-50 font-medium"
              }
              onClick={() => setQuestionType('singkat')}
            >
              Jawaban Singkat
            </Button>
            <Button 
              variant={questionType === 'esai' ? 'default' : 'outline'}
              className={questionType === 'esai'
                ? "bg-[#B94A48] text-white hover:bg-[#A43D3B] font-medium"
                : "text-gray-700 hover:bg-gray-50 font-medium"
              }
              onClick={() => setQuestionType('esai')}
            >
              Esai
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-6 py-4 flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-8 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Soal No.{currentQuestion}</h2>
                <span className="text-[#B94A48] font-medium">
                  {currentQuestion}/{questionType === 'pg' ? 100 : 20}
                </span>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  {questionType === 'pg' && (
                    <p className="text-gray-800 leading-relaxed">
                      Seiring meningkatnya kebutuhan pangan dan ancaman perubahan iklim, para ilmuwan mengembangkan tanaman transgenik (GMO) yang tahan terhadap kekeringan dan hama. Namun, muncul kekhawatiran dari masyarakat mengenai dampak jangka panjang konsumsi GMO terhadap kesehatan dan lingkungan. Manakah pernyataan yang paling tepat mengenai penggunaan tanaman transgenik berdasarkan informasi di atas?
                    </p>
                  )}
                  {questionType === 'singkat' && (
                    <p className="text-gray-800 leading-relaxed">
                      Sebutkan nama ilmiah dari tanaman padi!
                    </p>
                  )}
                  {questionType === 'esai' && (
                    <p className="text-gray-800 leading-relaxed">
                      Jelaskan proses terjadinya fotosintesis pada tumbuhan dan sebutkan faktor-faktor yang mempengaruhi proses tersebut!
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {questionType === 'pg' && (
                    <>
                      {[
                        {
                          label: "a",
                          text: "Tanaman transgenik hanya memberi dampak positif tanpa risiko terhadap keanekaragaman hayati"
                        },
                        {
                          label: "b",
                          text: "Produksi tanaman transgenik sepenuhnya bebas dari kontroversi etika dan lingkungan"
                        },
                        {
                          label: "c",
                          text: "Tanaman transgenik dapat meningkatkan hasil panen, namun penggunaannya harus diawasi karena dapat menimbulkan dampak ekologis"
                        },
                        {
                          label: "d",
                          text: "Semua tanaman hasil rekayasa genetika tidak dapat dikonsumsi manusia karena beracun"
                        },
                        {
                          label: "e",
                          text: "Kekhawatiran terhadap GMO hanya disebabkan oleh kurangnya hasil panen petani tradisional"
                        }
                      ].map((option) => (
                        <div
                          key={option.label}
                          className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                            selectedOption === option.label
                              ? "bg-[#B94A48] bg-opacity-10 border-2 border-[#B94A48]"
                              : "bg-white border border-gray-200 hover:border-[#B94A48] hover:border-opacity-50"
                          }`}
                          onClick={() => setSelectedOption(option.label)}
                        >
                          <div className={`w-7 h-7 rounded flex items-center justify-center text-sm font-medium
                            ${selectedOption === option.label 
                              ? "bg-[#B94A48] text-white border border-[#B94A48]" 
                              : "border border-gray-300 text-gray-600"}
                          `}>
                            {option.label}
                          </div>
                          <p className={`text-gray-700 ${selectedOption === option.label ? "text-[#B94A48] font-medium" : ""}`}>
                            {option.text}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                  {questionType === 'singkat' && (
                    <>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Tulis jawaban singkat Anda di sini..."
                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48]"
                      />
                      <Button 
                        onClick={() => {}} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Simpan
                      </Button>
                    </>
                  )}
                  {questionType === 'esai' && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  className="px-6 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={handleBack}
                >
                  {getBackButtonText()}
                </Button>
                <Button 
                  variant="secondary"
                  className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Tandai Soal
                </Button>
                <Button 
                  className={`px-6 py-2 text-white ${
                    questionType === 'esai' && currentQuestion === 20
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-[#B94A48] hover:bg-[#A43D3B]"
                  }`}
                  onClick={handleNext}
                >
                  {getNextButtonText()}
                </Button>
              </div>
            </Card>
          </div>

          <SidebarSoal 
            totalQuestions={questionType === 'pg' ? 100 : 20}
            currentQuestion={currentQuestion}
            onQuestionClick={setCurrentQuestion}
          />
        </div>
      </div>

      {/* Popup Token Ulang */}
      {showTokenPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4">Masukkan Token Ujian</h2>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2 text-center"
              placeholder="Token Ujian"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
            />
            {errorToken && (
              <div className="w-full text-center text-red-600 text-sm mb-2">{errorToken}</div>
            )}
            <Button
              className="w-full bg-[#D84C3B] hover:bg-red-600 text-white font-semibold py-2 rounded-md shadow transition"
              onClick={handleTokenSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Background blur saat popup muncul */}
      <div className={`fixed inset-0 transition-all ${(showConfirmationPopup || showSuccessPopup) ? 'bg-black/40 backdrop-blur-sm' : 'pointer-events-none'}`} />

      {/* Popup Konfirmasi Submit */}
      <ConfirmationSubmitPopup
        open={showConfirmationPopup}
        onClose={() => setShowConfirmationPopup(false)}
        onConfirm={() => {
          setShowConfirmationPopup(false);
          setShowSuccessPopup(true);
        }}
        soalPGDikerjakan={85} // TODO: Track actual answered PG questions
        soalSingkatDikerjakan={15} // TODO: Track actual answered Singkat questions
        soalEsaiDikerjakan={18} // TODO: Track actual answered Esai questions
        sisaWaktu="59:36" // TODO: Use actual time remaining
      />

      {/* Popup Selamat */}
      <SuccessNextSectionPopup 
        open={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          router.push('/dashboard-peserta/hasil-lomba/');
        }}
        nama="John Doe" // TODO: Use actual user name
        pesan="Selamat! Anda telah menyelesaikan ujian dengan baik. Hasil ujian Anda akan segera diproses dan dapat dilihat di halaman hasil ujian."
        sisaWaktu="59:36" // TODO: Use actual time remaining
      />
    </div>
  );
}