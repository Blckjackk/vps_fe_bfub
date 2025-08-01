/**
 * File                         : page.tsx (for hasil lomba detail)
 * Created                      : 2025-08-01
 * Last Updated                 : 2025-08-01
 * Url                          : /dashboard-admin/hasil-lomba/detail?id={peserta_id}
 * Description                  : Halaman detail hasil lomba pilihan ganda untuk admin pada aplikasi website perlombaan BFUB.
 *                                Menampilkan detail hasil perlombaan, peserta, dan peringkat.
 * Functional                   :
 *      - Menampilkan informasi detail tentang satu lomba spesifik.
 *      - Menampilkan daftar semua peserta lomba tersebut beserta nilai dan peringkatnya.
 *      - Menyediakan fitur pencarian atau filter pada daftar peserta.
 *      - Menampilkan analisis jawaban dan statistik soal.
 * API Methods      / Endpoints :
 *      - GET       api/admin/hasil/peserta/{id}     (Untuk mendapatkan detail hasil peserta)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta berdasarkan ID
 *      - SELECT jawaban dari tabel jawaban dengan join ke soal
 *      - SELECT jawaban_essay dari tabel jawaban_essay dengan join ke soal_essay
 *      - SELECT jawaban_isian_singkat dari tabel jawaban_isian_singkat dengan join ke soal_isian_singkat
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  jawaban_peserta: string | null;
  benar: boolean;
  waktu_jawab: string | null;
};

type JawabanEssay = {
  nomor_soal: number;
  pertanyaan: string;
  jawaban_peserta: string | null;
  file_path?: string;
  file_name?: string;
  waktu_jawab: string | null;
  score: number; // Tambah field score
  jawaban_id: number | null; // Tambah jawaban ID
};

type JawabanIsianSingkat = {
  nomor_soal: number;
  pertanyaan: string;
  jawaban_peserta: string | null;
  jawaban_benar: string;
  benar: boolean;
  waktu_jawab: string | null;
  score: number; // Tambah field score
  jawaban_id: number | null; // Tambah jawaban ID
};

type Statistik = {
  total_soal_pg: number;
  total_soal_essay: number;
  total_soal_isian: number;
  jawaban_pg_benar: number;
  jawaban_pg_salah: number;
  jawaban_pg_dijawab: number;
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
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [detailHasil, setDetailHasil] = useState<DetailHasil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handler untuk update nilai essay dan isian singkat
  const handleUpdateNilai = (id: number, nilai: number, tipeSoal: 'esai' | 'singkat') => {
    if (!detailHasil) return;

    if (tipeSoal === 'esai') {
      const updatedEssay = detailHasil.jawaban_essay.map(item =>
        item.nomor_soal === id ? { ...item, score: nilai } : item
      );
      setDetailHasil({
        ...detailHasil,
        jawaban_essay: updatedEssay as any
      });
    } else if (tipeSoal === 'singkat') {
      const updatedIsian = detailHasil.jawaban_isian_singkat.map(item =>
        item.nomor_soal === id ? { ...item, score: nilai } : item
      );
      setDetailHasil({
        ...detailHasil,
        jawaban_isian_singkat: updatedIsian as any
      });
    }
  };

  // Fetch detail hasil peserta
  const fetchDetailHasil = async () => {
    if (!id) {
      setError('ID peserta tidak ditemukan');
      setLoading(false);
      return;
    }

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
    fetchDetailHasil();
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
    // Ensure jawaban_pg is an array before filtering
    const jawabanPG = Array.isArray(detailHasil.jawaban_pg) ? detailHasil.jawaban_pg : [];
    
    console.log('Raw jawaban_pg data:', jawabanPG);
    
    const benar = jawabanPG
      .filter(j => j.benar && j.jawaban_peserta !== null)
      .map(j => j.nomor_soal);
    
    const salah = jawabanPG
      .filter(j => !j.benar && j.jawaban_peserta !== null)
      .map(j => j.nomor_soal);

    // Semua nomor soal yang dijawab (baik benar maupun salah)
    const dijawab = jawabanPG
      .filter(j => j.jawaban_peserta !== null)
      .map(j => j.nomor_soal);

    console.log('Processed jawaban data:', { benar, salah, dijawab });

    return { benar, salah, dijawab };
  };

  // Convert data untuk JawabanTable Essay
  const getEssayTableData = () => {
    // Ensure jawaban_essay is an array before mapping
    const jawabanEssay = Array.isArray(detailHasil.jawaban_essay) ? detailHasil.jawaban_essay : [];
    
    return jawabanEssay.map(jawaban => ({
      id: jawaban.nomor_soal,
      soal: jawaban.pertanyaan,
      jawabanPeserta: jawaban.jawaban_peserta || '', // Kosong jika tidak dijawab
      filePath: jawaban.file_path,
      fileName: jawaban.file_name,
      waktuJawab: jawaban.waktu_jawab ?? undefined,
      bobot: 10, // Default bobot
      score: jawaban.score || 0, // Gunakan score dari database
      isChecked: false,
      jawabanId: jawaban.jawaban_id || undefined // Tambah jawaban ID untuk update
    }));
  };

  // Convert data untuk JawabanTable Isian Singkat
  const getIsianSingkatTableData = () => {
    // Ensure jawaban_isian_singkat is an array before mapping
    const jawabanIsianSingkat = Array.isArray(detailHasil.jawaban_isian_singkat) ? detailHasil.jawaban_isian_singkat : [];
    
    return jawabanIsianSingkat.map(jawaban => ({
      id: jawaban.nomor_soal,
      soal: jawaban.pertanyaan,
      jawabanPeserta: jawaban.jawaban_peserta || '', // Kosong jika tidak dijawab
      jawabanBenar: jawaban.jawaban_benar,
      benar: jawaban.benar,
      waktuJawab: jawaban.waktu_jawab ?? undefined,
      bobot: 5, // Default bobot
      score: jawaban.score || 0, // Gunakan score dari database
      isChecked: false,
      jawabanId: jawaban.jawaban_id || undefined // Tambah jawaban ID untuk update
    }));
  };

  const jawabanData = getJawabanData();
  const totalSoalPG = detailHasil.statistik?.total_soal_pg || 0;
  const totalSoalEssay = detailHasil.statistik?.total_soal_essay || 0;
  const totalSoalIsian = detailHasil.statistik?.total_soal_isian || 0;
  
  // Use statistik for accurate count of answered questions
  const jawabanPGDijawab = detailHasil.statistik?.jawaban_pg_dijawab || 0;

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
            Ketepatan: {detailHasil.statistik?.persentase_ketepatan || 0}%
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
            jawabanDijawab={jawabanData.dijawab}
          />
        </>
      )}

      {/* Bagian Tabel Jawaban Essay - Hanya tampil jika ada soal essay */}
      {totalSoalEssay > 0 && (
        <JawabanTable 
          title="Hasil Ujian - Essay" 
          data={getEssayTableData()} 
          tipeSoal="esai"
          onUpdateNilai={(id, nilai) => handleUpdateNilai(id, nilai, 'esai')}
        />
      )}

      {/* Bagian Tabel Jawaban Isian Singkat - Hanya tampil jika ada soal isian */}
      {totalSoalIsian > 0 && (
        <JawabanTable 
          title="Hasil Ujian - Isian Singkat" 
          data={getIsianSingkatTableData()} 
          tipeSoal="singkat"
          onUpdateNilai={(id, nilai) => handleUpdateNilai(id, nilai, 'singkat')}
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
