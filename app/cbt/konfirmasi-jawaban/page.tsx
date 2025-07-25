"use client";

import HeaderExam from "@/components/cbt/HeaderExam";
import { Button } from "@/components/ui/button";
import ConfirmationSubmitPopup from "@/components/cbt/ConfirmationSubmitPopup";
import SuccessNextSectionPopup from "@/components/cbt/SuccessNextSectionPopup";
import { useState } from "react";
import { useRouter } from "next/navigation";

// 40 soal, status acak
const dummyStatus = Array.from({ length: 40 }, (_, i) => i % 3 !== 0);

export default function KonfirmasiJawabanPage() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();
  const jumlahSoal = dummyStatus.filter(Boolean).length;
  const totalSoal = dummyStatus.length;
  const sisaWaktu = "30:00"; // dummy
  const nama = "Azzam";
  const pesan = "kamu telah menyelesaikan soal Pilihan Ganda, silahkan melanjutkan pengerjaan soal Isian Singkat";

  const handleConfirmYes = () => {
    setShowConfirmPopup(false);
    setTimeout(() => setShowSuccessPopup(true), 200); // delay for smoothness
  };

  const isBlur = showConfirmPopup || showSuccessPopup;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <div className={isBlur ? "blur-sm pointer-events-none select-none" : ""}>
        <HeaderExam examTitle="Olimpiade Sains" timeLeft="59:36" />
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
          <div className="bg-white rounded-lg shadow border border-gray-200 mt-8 mb-8 max-h-[440px] overflow-y-auto w-full max-w-xl">
            <table className="min-w-[400px] w-full text-center">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="px-8 py-3 text-lg font-semibold border-b border-gray-200">Nomor Soal</th>
                  <th className="px-8 py-3 text-lg font-semibold border-b border-gray-200">Soal yang sudah di isi</th>
                </tr>
              </thead>
              <tbody>
                {dummyStatus.map((filled, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 text-lg">{idx + 1}</td>
                    <td className="py-2">
                      {filled ? (
                        <span className="text-green-600 text-2xl font-bold">&#10003;</span>
                      ) : (
                        <span className="text-red-500 text-2xl font-bold">&#10007;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-12">
          <Button className="bg-[#B94A48] hover:bg-[#A43D3B] text-white px-10 py-2 rounded-full text-lg font-semibold shadow" style={{marginLeft: 0}}>
            Back
          </Button>
          <Button className="bg-[#0070F3] hover:bg-blue-700 text-white px-10 py-2 rounded-full text-lg font-semibold shadow" style={{marginRight: 0}}
            onClick={() => setShowConfirmPopup(true)}>
            Submit
          </Button>
        </div>
      </div>
      <ConfirmationSubmitPopup
        open={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={handleConfirmYes}
        jumlahSoal={jumlahSoal}
        totalSoal={totalSoal}
        sisaWaktu={sisaWaktu}
      />
      <SuccessNextSectionPopup
        open={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          router.push("/dashboard-peserta");
        }}
        nama={nama}
        pesan={pesan}
        sisaWaktu={sisaWaktu}
      />
    </div>
  );
} 