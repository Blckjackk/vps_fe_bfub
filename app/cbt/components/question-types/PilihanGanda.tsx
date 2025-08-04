/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/pg                (untuk mendapatkan daftar soal pilihan ganda)
 *      - GET       api/soal/pg/{nomor}        (untuk mendapatkan detail soal pilihan ganda spesifik)
 *      - POST      api/jawaban/pg             (untuk menyimpan jawaban pilihan ganda)
 *      - POST      api/ujian/mulai            (ketika pertama kali masuk ke halaman soal)
 *      - POST      api/peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)                      : soal_pg.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /cbt/components/question-types/PilihanGanda.tsx
 * Description                      : Halaman soal pilihan ganda (CBT) untuk aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal pilihan ganda dan interaksi pengguna untuk menjawab soal.
 * Functional                       : 
 *      - Menampilkan daftar soal pilihan ganda berdasarkan lomba/sesi.
 *      - Memungkinkan pengguna memilih jawaban.
 *      - Menyimpan atau mengupdate jawaban pengguna ke database.
 *      - Menampilkan timer ujian dan auto-save jawaban.
 * API Methods      / Endpoints     : 
 *      - GET       /durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/pg                (untuk mendapatkan daftar soal pilihan ganda)
 *      - GET       /soal/pg/{nomor}        (untuk mendapatkan detail soal pilihan ganda spesifik)
 *      - POST      /jawaban/pg             (untuk menyimpan jawaban pilihan ganda)
 *      - POST      /ujian/mulai            (ketika pertama kali masuk ke halaman soal)
 *      - POST      /peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus           (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT jumlah soal dari tabel soal
 *      - SELECT soal dari tabel soal
 *      - SELECT jawaban dari input peserta
 *      - INSERT jawaban di tabel jawaban
 *      - UPDATE jawaban di tabel jawaban untuk auto-save
 *      - INSERT timestamp di tabel peserta
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SidebarSoal from "@/components/cbt/SidebarSoal";

interface PilihanGandaProps {
  onSwitchType: (type: 'pg' | 'singkat' | 'esai') => void;
  markedQuestions?: number[];
  onMarkQuestion?: () => void;
  answeredQuestions?: number[];
  onSaveAnswer?: (answer: string) => void;
}

export default function PilihanGanda({ 
  onSwitchType, 
  markedQuestions = [], 
  onMarkQuestion,
  answeredQuestions = [],
  onSaveAnswer
}: PilihanGandaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 py-4 flex gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <Card className="p-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Soal No.{currentQuestion}</h2>
            <span className="text-[#B94A48] font-medium">{currentQuestion}/100</span>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <p className="text-gray-800 leading-relaxed">
                Seiring meningkatnya kebutuhan pangan dan ancaman perubahan iklim, para ilmuwan mengembangkan tanaman transgenik (GMO) yang tahan terhadap kekeringan dan hama. Namun, muncul kekhawatiran dari masyarakat mengenai dampak jangka panjang konsumsi GMO terhadap kesehatan dan lingkungan. Manakah pernyataan yang paling tepat mengenai penggunaan tanaman transgenik berdasarkan informasi di atas?
              </p>
            </div>

            <div className="space-y-4">
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
                  onClick={() => {
                    setSelectedOption(option.label);
                    // Auto-save immediately when option is selected
                    if (onSaveAnswer) {
                      onSaveAnswer(option.label);
                    }
                  }}
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
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline"
              className="px-6 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => router.push("/cbt")}
            >
              Back
            </Button>
            <Button 
              variant="secondary"
              className={`px-6 py-2 ${
                markedQuestions.includes(currentQuestion)
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={onMarkQuestion}
            >
              {markedQuestions.includes(currentQuestion) ? "Batal Tandai" : "Tandai Soal"}
            </Button>
            <Button 
              className="px-6 py-2 bg-[#B94A48] text-white hover:bg-[#A43D3B]"
              onClick={() => {
                // Simpan jawaban otomatis sebelum pindah
                if (selectedOption && onSaveAnswer) {
                  onSaveAnswer(selectedOption);
                }
                
                if (currentQuestion === 100) {
                  onSwitchType('singkat');
                } else {
                  setCurrentQuestion(prev => Math.min(prev + 1, 100));
                }
              }}
            >
              {currentQuestion === 100 ? "Lanjut ke Soal Singkat" : "Next"}
            </Button>
          </div>
        </Card>
      </div>

      <SidebarSoal 
        totalQuestions={100}
        currentQuestion={currentQuestion}
        onQuestionClick={setCurrentQuestion}
        answeredQuestions={answeredQuestions}
        markedQuestions={markedQuestions}
      />
    </div>
  );
}
