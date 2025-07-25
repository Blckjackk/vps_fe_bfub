"use client";

interface HeaderExamProps {
  examTitle: string;
  timeLeft: string;
}

export default function HeaderExam({ examTitle, timeLeft }: HeaderExamProps) {
  return (
    <div className="bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo dan Nama BFUB */}
        <div className="flex items-center gap-4">
          <img 
            src="/images/logos/brand/logo-BFUB-Polos.png" 
            alt="BFUB Logo" 
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <h2 className="text-gray-900 font-semibold">BFUB XXVII</h2>
            <p className="text-sm text-gray-600">Bakti Formica Untuk Bangsa</p>
          </div>
        </div>

        {/* Judul di Tengah */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-[#B94A48]">
          {examTitle}
        </h1>

        {/* Timer */}
        <div className="bg-[#B94A48] text-white px-6 py-2 rounded-lg font-semibold">
          {timeLeft}
        </div>
      </div>
    </div>
  );
}
