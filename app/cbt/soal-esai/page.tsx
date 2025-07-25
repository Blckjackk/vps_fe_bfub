"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeaderExam from "@/components/cbt/HeaderExam";
import SidebarSoal from "@/components/cbt/SidebarSoal";
import TokenPopup from "@/components/cbt/TokenPopup";

export default function SoalEsaiPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const router = useRouter();

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

  const handleBack = () => {
    setShowTokenPopup(true);
  };

  const handleTokenSubmit = (token: string) => {
    setShowTokenPopup(false);
    // Token handling logic here (demo: just close)
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className={showTokenPopup ? "blur-sm pointer-events-none select-none" : ""}>
        <HeaderExam 
          examTitle="Olimpiade Biologi" 
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
      <TokenPopup 
        open={showTokenPopup} 
        onClose={() => setShowTokenPopup(false)} 
        onSubmit={handleTokenSubmit}
      />
    </div>
  );
}
