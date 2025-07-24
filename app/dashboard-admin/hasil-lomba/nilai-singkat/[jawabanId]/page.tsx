/**
 * File                         : page.tsx (page for penilaian isian singkat)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba/nilai-singkat/[jawabanId]
 * Description                  : Halaman detail hasil lomba kategori singkat pada dashboard admin BFUB.
 *                                Menampilkan informasi detail peserta, nilai, dan status lomba esai.
 * Functional                   :
 *      - Menampilkan detail peserta lomba singkat berdasarkan ID lomba.
 *      - Menampilkan nilai dan status hasil lomba untuk setiap peserta.
 *      - Menyediakan fitur untuk verifikasi dan mengupdate nilai atau status hasil lomba (misal: "diverifikasi").
 *      - Download file jawaban singkat peserta untuk review.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}                 (Untuk mendapatkan detail informasi lomba)
 *      - GET       api/pendaftaran/lomba/{id}     (Untuk mendapatkan daftar peserta di lomba ini)
 *      - GET       api/nilai                      (Untuk mendapatkan data nilai yang akan ditampilkan dan diedit)
 *      - PUT       api/nilai/{id}                 (Untuk mengupdate/memverifikasi nilai atau status hasil seorang peserta)
 *      - GET       api/admin/export/files         (Untuk download file jawaban singkat)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - SELECT pendaftaran dari tabel pendaftaran dengan filter lomba_id
 *      - SELECT peserta dari tabel peserta
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - UPDATE nilai di tabel nilai untuk verifikasi
 *      - SELECT file jawaban dari storage untuk download
 * Anchor Links                 :
 *      - hasil_lomba.tsx       (untuk kembali ke daftar hasil lomba)
 *      - data_peserta.tsx      (untuk melihat detail peserta)
 */


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PenilaianSingkatPage({ params }: { params: { jawabanId: string } }) {
  const router = useRouter();
  const [dataSoal, setDataSoal] = useState({ soal: '', jawaban: '' });
  const [score, setScore] = useState('');

  useEffect(() => {
    // Simulasi fetch data isian singkat berdasarkan params.jawabanId
    setDataSoal({
      soal: 'Organel sel yang berfungsi sebagai tempat respirasi sel dan penghasil energi dalam bentuk ATP adalah',
      jawaban: 'Mitokondria',
    });
  }, [params.jawabanId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Menyimpan score ${score} untuk jawaban singkat ID ${params.jawabanId}`);
    alert('Score berhasil disimpan!');
    router.back();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Penilaian - Soal Isian Singkat</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-4xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soal</label>
            <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">{dataSoal.soal}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">{dataSoal.jawaban}</div>
          </div>
          <div>
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <input id="score" type="number" value={score} onChange={(e) => setScore(e.target.value)} className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8 max-w-4xl mx-auto">
          <button type="submit" className="px-10 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">Submit</button>
        </div>
      </form>
    </div>
  );
}