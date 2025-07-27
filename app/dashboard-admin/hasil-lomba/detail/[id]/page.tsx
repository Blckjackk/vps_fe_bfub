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

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import JawabanTable from '@/components/dashboard-admin/hasil-lomba/JawabanTable';
import NavigasiSoalGrid from '@/components/dashboard-admin/hasil-lomba/NavigasiSoalGrid';

// Types
type PesertaInfo = {
  nama_lengkap: string;
  nomor_pendaftaran: string;
  asal_sekolah: string;
  cabang_lomba: string;
  waktu_mulai: string;
  waktu_selesai: string;
  waktu_pengerjaan_total: string;
  nilai_total: number;
  status_ujian: string;
};

type JawabanPG = {
  nomor_soal: number;
  pertanyaan: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
  jawaban_benar: string;
  jawaban_peserta: string;
  benar: boolean;
  waktu_jawab: string;
};

type JawabanEssay = {
  nomor_soal: number;
  pertanyaan: string;
  jawaban_peserta: string;
  file_path?: string;
  file_name?: string;
  waktu_jawab: string;
};

type JawabanIsianSingkat = {
  nomor_soal: number;
  pertanyaan: string;
  jawaban_peserta: string;
  jawaban_benar: string;
  benar: boolean;
  waktu_jawab: string;
};

type Statistik = {
  total_soal_pg: number;
  total_soal_essay: number;
  total_soal_isian: number;
  jawaban_pg_benar: number;
  jawaban_pg_salah: number;
  jawaban_essay_count: number;
  jawaban_isian_count: number;
  persentase_ketepatan: number;
};

type DetailHasil = {
  peserta: PesertaInfo;
  jawaban_pg: JawabanPG[];
  jawaban_essay: JawabanEssay[];
  jawaban_isian_singkat: JawabanIsianSingkat[];
  statistik: Statistik;
};

export default function DetailHasilPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [detailHasil, setDetailHasil] = useState<DetailHasil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch detail hasil peserta
  const fetchDetailHasil = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/admin/hasil/peserta/${id}`);
      const data = await response.json();

      if (data.success) {
        setDetailHasil(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail hasil');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching detail hasil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailHasil();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error: {error}</p>
        <button 
          onClick={fetchDetailHasil}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!detailHasil) {
    return (
      <div className="text-center p-8">
        <p>Data tidak ditemukan</p>
      </div>
    );
  }

  // Format waktu
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '00:00';
    return new Date(timeString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Hitung durasi pengerjaan
  const calculateDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return '0 Menit';
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours} Jam ${minutes} Menit`;
    }
    return `${minutes} Menit`;
  };

  // Convert jawaban PG untuk NavigasiSoalGrid
  const getJawabanData = () => {
    const benar = detailHasil.jawaban_pg
      .filter(j => j.benar)
      .map(j => j.nomor_soal);
    
    const salah = detailHasil.jawaban_pg
      .filter(j => !j.benar)
      .map(j => j.nomor_soal);

    return { benar, salah };
  };

  // Convert data untuk JawabanTable Essay
  const getEssayTableData = () => {
    return detailHasil.jawaban_essay.map(jawaban => ({
      id: jawaban.nomor_soal,
      soal: jawaban.pertanyaan,
      jawabanPeserta: jawaban.jawaban_peserta || 'Belum dijawab',
      filePath: jawaban.file_path,
      fileName: jawaban.file_name,
      waktuJawab: jawaban.waktu_jawab,
      bobot: 10, // Default bobot
      score: 0, // Perlu penilaian manual
      isChecked: false
    }));
  };

  // Convert data untuk JawabanTable Isian Singkat
  const getIsianSingkatTableData = () => {
    return detailHasil.jawaban_isian_singkat.map(jawaban => ({
      id: jawaban.nomor_soal,
      soal: jawaban.pertanyaan,
      jawabanPeserta: jawaban.jawaban_peserta || 'Belum dijawab',
      jawabanBenar: jawaban.jawaban_benar,
      benar: jawaban.benar,
      waktuJawab: jawaban.waktu_jawab,
      bobot: 5, // Default bobot
      score: jawaban.benar ? 5 : 0,
      isChecked: false
    }));
  };

  const jawabanData = getJawabanData();
  const totalSoalPG = detailHasil.statistik.total_soal_pg;
  const totalSoalEssay = detailHasil.statistik.total_soal_essay;
  const totalSoalIsian = detailHasil.statistik.total_soal_isian;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-admin/hasil-lomba" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Detail Hasil Lomba</h1>
      </div>

      {/* Bagian Atas: Info & Nilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-2 gap-6">
          {/* Kolom Info Peserta */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nama Lengkap</label>
              <p className="font-semibold">{detailHasil.peserta.nama_lengkap}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">No. Pendaftaran</label>
              <p className="font-semibold">{detailHasil.peserta.nomor_pendaftaran}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Asal Sekolah</label>
              <p className="font-semibold">{detailHasil.peserta.asal_sekolah}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Lomba</label>
              <p className="font-semibold">{detailHasil.peserta.cabang_lomba}</p>
            </div>
          </div>
          {/* Kolom Info Ujian */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Mulai</label>
              <p className="font-semibold">{formatTime(detailHasil.peserta.waktu_mulai)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Selesai</label>
              <p className="font-semibold">{formatTime(detailHasil.peserta.waktu_selesai)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Waktu Total</label>
              <p className="font-semibold">
                {calculateDuration(detailHasil.peserta.waktu_mulai, detailHasil.peserta.waktu_selesai)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p className={`font-semibold ${
                detailHasil.peserta.status_ujian === 'selesai' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {detailHasil.peserta.status_ujian === 'selesai' ? 'Selesai' : 'Belum Selesai'}
              </p>
            </div>
          </div>
        </div>
        {/* Kolom Nilai */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">Nilai</p>
          <p className="text-5xl font-bold text-gray-800">
            {Math.round(detailHasil.peserta.nilai_total || 0)}
            <span className="text-2xl text-gray-400">/100</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ketepatan: {detailHasil.statistik.persentase_ketepatan}%
          </p>
        </div>
      </div>

      {/* Bagian Pilihan Ganda - Hanya tampil jika ada soal PG */}
      {totalSoalPG > 0 && (
        <>
          <NavigasiSoalGrid 
            totalSoal={totalSoalPG}
            jawabanBenar={jawabanData.benar}
            jawabanSalah={jawabanData.salah}
          />

          {/* Bagian Summary Jawaban PG */}
          <div className="flex items-center justify-center gap-4">
            <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">
              Benar: {detailHasil.statistik.jawaban_pg_benar}
            </div>
            <div className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-full">
              Salah: {detailHasil.statistik.jawaban_pg_salah}
            </div>
            <div className="bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-full">
              Tidak Dijawab: {totalSoalPG - detailHasil.jawaban_pg.length}
            </div>
          </div>
        </>
      )}

      {/* Bagian Tabel Jawaban Essay - Hanya tampil jika ada soal essay */}
      {totalSoalEssay > 0 && (
        <JawabanTable 
          title="Hasil Ujian - Essay" 
          data={getEssayTableData()} 
          tipeSoal="esai" 
        />
      )}

      {/* Bagian Tabel Jawaban Isian Singkat - Hanya tampil jika ada soal isian */}
      {totalSoalIsian > 0 && (
        <JawabanTable 
          title="Hasil Ujian - Isian Singkat" 
          data={getIsianSingkatTableData()} 
          tipeSoal="singkat" 
        />
      )}

      {/* Info jika tidak ada soal Essay atau Isian Singkat */}
      {totalSoalEssay === 0 && totalSoalIsian === 0 && totalSoalPG > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
          <p>Lomba ini hanya memiliki soal pilihan ganda.</p>
        </div>
      )}
    </div>
  );
}