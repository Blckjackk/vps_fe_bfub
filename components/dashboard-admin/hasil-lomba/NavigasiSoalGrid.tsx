'use client';

interface NavigasiSoalGridProps {
  totalSoal: number;
  jawabanBenar: number[];
  jawabanSalah: number[];
}

export default function NavigasiSoalGrid({ totalSoal, jawabanBenar, jawabanSalah }: NavigasiSoalGridProps) {
  const getStatus = (nomor: number) => {
    if (jawabanBenar.includes(nomor)) return 'bg-green-500 text-white';
    if (jawabanSalah.includes(nomor)) return 'bg-red-500 text-white';
    return 'bg-gray-200';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Hasil Ujian - Pilihan Ganda</h3>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: totalSoal }, (_, i) => i + 1).map((nomor) => (
          <div
            key={nomor}
            className={`w-10 h-10 flex items-center justify-center rounded-md font-semibold ${getStatus(nomor)}`}
          >
            {nomor}
          </div>
        ))}
      </div>
    </div>
  );
}