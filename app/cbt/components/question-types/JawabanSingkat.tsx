/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                     (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/isian-singkat         (Untuk mendapatkan daftar soal isian singkat)
 *      - GET       api/soal/isian-singkat/{nomor} (Untuk mendapatkan detail soal isian singkat spesifik)
 *      - POST      api/jawaban/isian-singkat      (Untuk menyimpan jawaban isian singkat)
 *      - GET       api/jawaban/isian-singkat      (Untuk mendapatkan jawaban yang sudah disimpan)
 *      - POST      api/peserta/cek-token          (Untuk mengecek dan memvalidasi token peserta)                      : soal_isian_singkat.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /cbt/components/question-types/JawabanSingkat.tsx
 * Description                      : Halaman soal isian singkat untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal isian singkat dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal isian singkat.
 *      - Menyediakan form input untuk menjawab soal isian singkat.
 *      - Menyimpan atau mengupdate jawaban isian singkat peserta.
 *      - Menampilkan timer ujian dan auto-save jawaban.
 * API Methods      / Endpoints     :
 *      - GET       /durasi                     (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/isian-singkat         (Untuk mendapatkan daftar soal isian singkat)
 *      - GET       /soal/isian-singkat/{nomor} (Untuk mendapatkan detail soal isian singkat spesifik)
 *      - POST      /jawaban/isian-singkat      (Untuk menyimpan jawaban isian singkat)
 *      - GET       /jawaban/isian-singkat      (Untuk mendapatkan jawaban yang sudah disimpan)
 *      - POST      /peserta/cek-token          (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus               (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT soal dari tabel soal_isian_singkat
 *      - SELECT jawaban tersimpan dari tabel jawaban_isian_singkat
 *      - INSERT jawaban di tabel jawaban_isian_singkat
 *      - UPDATE jawaban di tabel jawaban_isian_singkat untuk auto-save
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
import SidebarSoal from "@/components/cbt/SidebarSoal";

interface JawabanSingkatProps {
  onSwitchType: (type: 'pg' | 'singkat' | 'esai') => void;
  markedQuestions?: number[];
  onMarkQuestion?: () => void;
  answeredQuestions?: number[];
  onSaveAnswer?: (answer: string) => void;
}

export default function JawabanSingkat({ 
  onSwitchType, 
  markedQuestions = [], 
  onMarkQuestion,
  answeredQuestions = [],
  onSaveAnswer
}: JawabanSingkatProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save dengan debounce ketika user mengetik
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (answer.trim() && onSaveAnswer) {
      timeoutRef.current = setTimeout(() => {
        onSaveAnswer(answer.trim());
      }, 1000); // Save after 1 second of no typing
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [answer, onSaveAnswer]);

  return (
    <div className="container mx-auto px-6 py-4 flex gap-8">
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
                Sebutkan nama ilmiah dari tanaman padi!
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tulis jawaban singkat Anda di sini..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48]"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline"
              className="px-6 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                if (currentQuestion === 1) {
                  onSwitchType('pg');
                } else {
                  setCurrentQuestion(prev => Math.max(prev - 1, 1));
                }
              }}
            >
              {currentQuestion === 1 ? "Kembali ke Soal PG" : "Back"}
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
                if (answer.trim() && onSaveAnswer) {
                  onSaveAnswer(answer.trim());
                }
                
                if (currentQuestion === 20) {
                  onSwitchType('esai');
                } else {
                  setCurrentQuestion(prev => Math.min(prev + 1, 20));
                }
              }}
            >
              {currentQuestion === 20 ? "Lanjut ke Soal Esai" : "Next"}
            </Button>
          </div>
        </Card>
      </div>

      <SidebarSoal 
        totalQuestions={20}
        currentQuestion={currentQuestion}
        onQuestionClick={setCurrentQuestion}
        answeredQuestions={answeredQuestions}
        markedQuestions={markedQuestions}
      />
    </div>
  );
}
