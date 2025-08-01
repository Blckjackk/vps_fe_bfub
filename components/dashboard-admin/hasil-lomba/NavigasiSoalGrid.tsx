'use client';

interface NavigasiSoalGridProps {
  totalSoal: number;
  jawabanBenar: number[];
  jawabanSalah: number[];
  jawabanDijawab: number[]; // Semua nomor soal yang dijawab
}

export default function NavigasiSoalGrid({ totalSoal, jawabanBenar, jawabanSalah, jawabanDijawab }: NavigasiSoalGridProps) {
  // Debug logging
  console.log('NavigasiSoalGrid Props:', {
    totalSoal,
    jawabanBenar,
    jawabanSalah,
    jawabanDijawab,
    benarLength: jawabanBenar.length,
    salahLength: jawabanSalah.length,
    dijawabLength: jawabanDijawab.length
  });

  const getStatus = (nomor: number) => {
    if (jawabanBenar.includes(nomor)) {
      return 'bg-green-500 text-white border-2 border-green-600'; // Hijau untuk benar
    }
    if (jawabanSalah.includes(nomor)) {
      return 'bg-red-500 text-white border-2 border-red-600'; // Merah untuk salah
    }
    // Jika tidak ada di array dijawab, berarti tidak dijawab
    return 'bg-gray-300 text-gray-700 border-2 border-gray-400'; // Abu-abu untuk tidak dijawab
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Hasil Ujian - Pilihan Ganda</h3>
      
      {/* Grid Soal */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {Array.from({ length: totalSoal }, (_, i) => i + 1).map((nomor) => (
          <div
            key={nomor}
            className={`w-12 h-12 flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${getStatus(nomor)}`}
          >
            {nomor}
          </div>
        ))}
      </div>

      {/* Summary Jawaban PG */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">
          Benar: {jawabanBenar.length}
        </div>
        <div className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-full">
          Salah: {jawabanSalah.length}
        </div>
        <div className="bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-full">
          Tidak Dijawab: {totalSoal - jawabanDijawab.length}
        </div>
      </div>
    </div>
  );
}