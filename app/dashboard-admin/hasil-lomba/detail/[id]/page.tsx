/**
 * File                         : page.tsx (for hasil lomba detail)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba/detail/[id]
 * Description                  : Halaman detail hasil lomba pilihan ganda untuk admin pada aplikasi website perlombaan BFUB.
 *                                Menampilkan detail hasil perlombaan, peserta, dan peringkat.
 * Functional                   :
 *      - Menampilkan informasi detail tentang satu lomba spesifik.
 *      - Menampilkan daftar semua peserta lomba tersebut beserta nilai dan peringkatnya.
 *      - Menyediakan fitur pencarian atau filter pada daftar peserta.
 *      - Menampilkan analisis jawaban dan statistik soal.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}                 (Untuk mendapatkan detail informasi lomba)
 *      - GET       api/pendaftaran/lomba/{id}     (Untuk mendapatkan daftar peserta yang terdaftar di lomba ini)
 *      - GET       api/nilai                      (Untuk mendapatkan data nilai yang kemudian dicocokkan dengan peserta)
 *      - GET       api/admin/jawaban/peserta      (Untuk analisis jawaban peserta)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - SELECT pendaftaran dari tabel pendaftaran dengan filter lomba_id
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - SELECT peserta dari tabel peserta
 *      - SELECT jawaban dari tabel jawaban untuk analisis
 * Anchor Links                 :
 *      - hasil_lomba.tsx       (untuk kembali ke daftar hasil lomba)
 *      - data_peserta.tsx      (untuk melihat detail peserta)
 */


'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import JawabanTable from '@/components/dashboard-admin/hasil-lomba/JawabanTable';
import NavigasiSoalGrid from '@/components/dashboard-admin/hasil-lomba/NavigasiSoalGrid';

// Data dummy untuk simulasi
const detailHasil = {
  infoPeserta: { nama: 'Asep', noPendaftaran: '091301231', asalSekolah: 'SMAN 1', lomba: 'OBN' },
  infoUjian: { mulai: '08:00', selesai: '09:30', waktuTotal: '90 Menit' },
  nilai: { skor: 99, total: 100 },
  pilihanGanda: { total: 100, benar: [1, 2, 4, 5, 6, 7, 8, 9, 10, /* ... */], salah: [3] },
  summary: { benar: 98, salah: 1, tidakDijawab: 1 },
  jawabanEsai: [
    { id: 1, soal: 'Organel Sel...', jawabanPeserta: 'Nukleus', bobot: 10, score: 10, isChecked: true },
    // ...data esai lainnya
  ],
  jawabanIsianSingkat: [
    { id: 1, soal: 'Organel Sel...', jawabanPeserta: 'Nukleus', bobot: 5, score: 5, isChecked: true },
    // ...data isian singkat lainnya
  ],
};


export default function DetailHasilPage({ params }: { params: { id: string } }) {
  // Di aplikasi nyata, Anda akan fetch data berdasarkan params.id
  // dan memasukkannya ke dalam state.

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-admin/hasil-lomba" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Hasil Lomba</h1>
      </div>

      {/* Bagian Atas: Info & Nilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-2 gap-6">
          {/* Kolom Info Peserta */}
          <div className="space-y-4">
            <div><label className="text-sm text-gray-500">Nama Lengkap</label><p className="font-semibold">{detailHasil.infoPeserta.nama}</p></div>
            <div><label className="text-sm text-gray-500">No. Pendaftaran</label><p className="font-semibold">{detailHasil.infoPeserta.noPendaftaran}</p></div>
            <div><label className="text-sm text-gray-500">Asal Sekolah</label><p className="font-semibold">{detailHasil.infoPeserta.asalSekolah}</p></div>
            <div><label className="text-sm text-gray-500">Lomba</label><p className="font-semibold">{detailHasil.infoPeserta.lomba}</p></div>
          </div>
          {/* Kolom Info Ujian */}
          <div className="space-y-4">
            <div><label className="text-sm text-gray-500">Mulai</label><p className="font-semibold">{detailHasil.infoUjian.mulai}</p></div>
            <div><label className="text-sm text-gray-500">Selesai</label><p className="font-semibold">{detailHasil.infoUjian.selesai}</p></div>
            <div><label className="text-sm text-gray-500">Waktu Total</label><p className="font-semibold">{detailHasil.infoUjian.waktuTotal}</p></div>
          </div>
        </div>
        {/* Kolom Nilai */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">Nilai</p>
          <p className="text-5xl font-bold text-gray-800">{detailHasil.nilai.skor}<span className="text-2xl text-gray-400">/{detailHasil.nilai.total}</span></p>
        </div>
      </div>

      {/* Bagian Pilihan Ganda */}
      <NavigasiSoalGrid 
        totalSoal={detailHasil.pilihanGanda.total}
        jawabanBenar={detailHasil.pilihanGanda.benar}
        jawabanSalah={detailHasil.pilihanGanda.salah}
      />

      {/* Bagian Summary Jawaban */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">Benar: {detailHasil.summary.benar}</div>
        <div className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-full">Salah: {detailHasil.summary.salah}</div>
        <div className="bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-full">Tidak Dijawab: {detailHasil.summary.tidakDijawab}</div>
      </div>

      {/* Bagian Tabel Jawaban */}
      <JawabanTable title="Hasil Ujian - Esai" data={detailHasil.jawabanEsai} tipeSoal="esai" />
      <JawabanTable title="Hasil Ujian - Soal Isian Singkat" data={detailHasil.jawabanIsianSingkat} tipeSoal="singkat" />
    </div>
  );
}