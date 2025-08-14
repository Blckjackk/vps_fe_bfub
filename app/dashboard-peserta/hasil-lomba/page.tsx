"use client";

import React, { useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationTriangle } from "react-icons/fa";

interface HasilNilai {
  no: number;
  jenis: string;
  mulai: string;
  selesai: string;
  jumlah: number;
  dijawab: number;
  benar: number;
  salah: number;
  nilai: number;
}

type StatusRilis = 'belum_ujian' | 'menunggu_admin' | 'menunggu_rilis' | 'nilai_tersedia' | 'loading';

export default function HasilLombaPage() {
  const [statusRilis, setStatusRilis] = useState<StatusRilis>('loading');
  const [hasilNilai, setHasilNilai] = useState<HasilNilai[]>([]);
  const [infoRilis, setInfoRilis] = useState<any>(null);
  const [countdown, setCountdown] = useState<any>(null);
  const [pesertaInfo, setPesertaInfo] = useState({
    nama: "Loading...",
    sekolah: "Loading...",
    lomba: "Loading...",
    tanggalUjian: "Loading..."
  });

  // Fetch status rilis dan data peserta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserData = localStorage.getItem("user_data");
        if (!storedUserData) {
          console.error("User data tidak ditemukan");
          return;
        }

        const user = JSON.parse(storedUserData);
        const pesertaId = user.id;

        // Fetch profile peserta untuk info dasar
        const profileResponse = await fetch(`http://localhost:8000/api/peserta/profile/${pesertaId}`);
        const profileData = await profileResponse.json();

        if (profileData.success && profileData.data) {
          const peserta = profileData.data;
          setPesertaInfo({
            nama: peserta.nama_lengkap || "Nama tidak tersedia",
            sekolah: peserta.asal_sekolah || "Sekolah tidak tersedia", 
            lomba: peserta.cabang_lomba?.nama_cabang || "Lomba tidak tersedia",
            tanggalUjian: peserta.cabang_lomba?.waktu_mulai_pengerjaan ? 
              new Date(peserta.cabang_lomba.waktu_mulai_pengerjaan).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : "Tanggal tidak tersedia"
          });
        }

        // Fetch status rilis nilai
        const statusResponse = await fetch(`http://localhost:8000/api/peserta/cek-status-rilis?peserta_id=${pesertaId}`);
        const statusData = await statusResponse.json();

        if (statusData.success && statusData.data) {
          const data = statusData.data;
          setStatusRilis(data.status);
          setInfoRilis(data);
          
          if (data.status === 'menunggu_rilis' && data.countdown) {
            setCountdown(data.countdown);
          }

          // Jika nilai sudah tersedia, fetch hasil ujian
          if (data.status === 'nilai_tersedia') {
            await fetchHasilUjian(pesertaId);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setStatusRilis('belum_ujian');
      }
    };

    fetchData();
  }, []);

  // Fetch hasil ujian dari endpoint admin
  const fetchHasilUjian = async (pesertaId: number) => {
    try {
      const hasilResponse = await fetch(`http://localhost:8000/api/admin/hasil/peserta/${pesertaId}`);
      const hasilData = await hasilResponse.json();

      if (hasilData.success && hasilData.data) {
        const hasil = hasilData.data;
        const pesertaInfo = hasil.peserta;
        const jawabanPG = hasil.jawaban_pg || [];
        const jawabanEsai = hasil.jawaban_essay || [];
        const jawabanSingkat = hasil.jawaban_isian_singkat || [];
        const statistik = hasil.statistik || {};

        // Convert ke format yang dibutuhkan
        const dataHasil: HasilNilai[] = [];

        // Data Pilihan Ganda
        if (jawabanPG.length > 0 || (statistik.total_soal_pg && statistik.total_soal_pg > 0)) {
          const pgBenar = statistik.jawaban_pg_benar || 0;
          const pgSalah = statistik.jawaban_pg_salah || 0;
          const pgDijawab = statistik.jawaban_pg_dijawab || 0;
          const totalPG = statistik.total_soal_pg || jawabanPG.length;
          
          dataHasil.push({
            no: 1,
            jenis: 'Pilihan Ganda',
            mulai: pesertaInfo.waktu_mulai ? new Date(pesertaInfo.waktu_mulai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            selesai: pesertaInfo.waktu_selesai ? new Date(pesertaInfo.waktu_selesai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            jumlah: totalPG,
            dijawab: pgDijawab,
            benar: pgBenar,
            salah: pgSalah,
            nilai: pgBenar
          });
        }

        // Data Esai
        const jumlahSoalEsai = statistik.total_soal_essay || 0;
        if (jawabanEsai.length > 0 || jumlahSoalEsai > 0) {
          const esaiDinilai = jawabanEsai.filter((j: any) => j.score !== null && j.score !== undefined).length;
          const totalNilaiEsai = jawabanEsai.reduce((acc: number, j: any) => acc + (j.score || 0), 0);
          
          dataHasil.push({
            no: 2,
            jenis: 'Esai',
            mulai: pesertaInfo.waktu_mulai ? new Date(pesertaInfo.waktu_mulai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            selesai: pesertaInfo.waktu_selesai ? new Date(pesertaInfo.waktu_selesai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            jumlah: jumlahSoalEsai,
            dijawab: jawabanEsai.filter((j: any) => j.jawaban_peserta && j.jawaban_peserta.trim() !== '').length,
            benar: esaiDinilai,
            salah: 0,
            nilai: totalNilaiEsai
          });
        }

        // Data Isian Singkat
        const jumlahSoalSingkat = statistik.total_soal_isian || 0;
        if (jawabanSingkat.length > 0 || jumlahSoalSingkat > 0) {
          const singkatDinilai = jawabanSingkat.filter((j: any) => j.score !== null && j.score !== undefined).length;
          const totalNilaiSingkat = jawabanSingkat.reduce((acc: number, j: any) => acc + (j.score || 0), 0);
          
          dataHasil.push({
            no: 3,
            jenis: 'Isian Singkat',
            mulai: pesertaInfo.waktu_mulai ? new Date(pesertaInfo.waktu_mulai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            selesai: pesertaInfo.waktu_selesai ? new Date(pesertaInfo.waktu_selesai).toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit'
            }) : '-',
            jumlah: jumlahSoalSingkat,
            dijawab: jawabanSingkat.filter((j: any) => j.jawaban_peserta && j.jawaban_peserta.trim() !== '').length,
            benar: singkatDinilai,
            salah: 0,
            nilai: totalNilaiSingkat
          });
        }

        setHasilNilai(dataHasil);
      }
    } catch (error) {
      console.error("Error fetching hasil ujian:", error);
    }
  };

  // Update countdown setiap detik
  useEffect(() => {
    if (statusRilis === 'menunggu_rilis' && countdown) {
      const interval = setInterval(() => {
        setCountdown((prev: any) => {
          if (!prev) return null;
          
          let { hari, jam, menit, detik } = prev;
          
          if (detik > 0) {
            detik--;
          } else if (menit > 0) {
            menit--;
            detik = 59;
          } else if (jam > 0) {
            jam--;
            menit = 59;
            detik = 59;
          } else if (hari > 0) {
            hari--;
            jam = 23;
            menit = 59;
            detik = 59;
          } else {
            // Countdown selesai - refresh status
            window.location.reload();
            return null;
          }
          
          return { hari, jam, menit, detik };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [statusRilis, countdown]);

  const renderStatusCard = () => {
    switch(statusRilis) {
      case 'loading':
        return (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mb-8">
            <div className="flex items-center">
              <FaHourglassHalf className="text-gray-400 text-2xl mr-4 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Memuat Data...</h3>
                <p className="text-gray-700 mt-1">Sedang mengambil informasi status ujian Anda</p>
              </div>
            </div>
          </div>
        );

      case 'belum_ujian':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-400 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Belum Melaksanakan Ujian</h3>
                <p className="text-yellow-700 mt-1">
                  Anda belum melaksanakan ujian untuk lomba <strong>{infoRilis?.nama_lomba}</strong>. 
                  Silakan ikuti ujian terlebih dahulu untuk melihat hasil.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'menunggu_admin':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <div className="flex items-center">
              <FaClock className="text-blue-400 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Ujian Sudah Selesai</h3>
                <p className="text-blue-700 mt-1">
                  Selamat! Anda telah menyelesaikan ujian <strong>{infoRilis?.nama_lomba}</strong>.
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  Admin sedang mempersiapkan jadwal rilis nilai. Harap tunggu pengumuman lebih lanjut.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'menunggu_rilis':
        return (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-8">
            <div className="flex items-center">
              <FaHourglassHalf className="text-orange-400 text-2xl mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800">Nilai Akan Dirilis</h3>
                <p className="text-orange-700 mt-1">
                  Ujian <strong>{infoRilis?.nama_lomba}</strong> telah selesai. 
                  Nilai akan dirilis pada <strong>{infoRilis?.tanggal_rilis_formatted}</strong>
                </p>
                {countdown && (
                  <div className="mt-4 flex gap-4">
                    <div className="text-center">
                      <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
                        {countdown.hari}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Hari</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
                        {countdown.jam}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Jam</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
                        {countdown.menit}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Menit</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
                        {countdown.detik}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Detik</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'nilai_tersedia':
        return (
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-400 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Hasil Ujian Tersedia</h3>
                <p className="text-green-700 mt-1">
                  Selamat! Hasil ujian <strong>{infoRilis?.nama_lomba}</strong> sudah tersedia dan dapat dilihat di bawah ini.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderTabelHasil = () => {
    if (statusRilis !== 'nilai_tersedia') {
      return null;
    }

    const totalNilai = hasilNilai.reduce((acc, cur) => acc + cur.nilai, 0);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Jenis Soal</th>
              <th className="px-4 py-2 border">Waktu Mulai</th>
              <th className="px-4 py-2 border">Waktu Selesai</th>
              <th className="px-4 py-2 border">Jumlah Soal</th>
              <th className="px-4 py-2 border">Jumlah Soal Dijawab</th>
              <th className="px-4 py-2 border">Jumlah Soal Benar</th>
              <th className="px-4 py-2 border">Jumlah Soal Salah</th>
              <th className="px-4 py-2 border">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {hasilNilai.length > 0 ? (
              hasilNilai.map((row) => (
                <tr key={row.no} className="text-center text-gray-800">
                  <td className="px-4 py-2 border">{row.no}</td>
                  <td className="px-4 py-2 border">{row.jenis}</td>
                  <td className="px-4 py-2 border">{row.mulai}</td>
                  <td className="px-4 py-2 border">{row.selesai}</td>
                  <td className="px-4 py-2 border">{row.jumlah}</td>
                  <td className="px-4 py-2 border">{row.dijawab}</td>
                  <td className="px-4 py-2 border">{row.benar}</td>
                  <td className="px-4 py-2 border">{row.salah}</td>
                  <td className="px-4 py-2 border font-bold">{row.nilai}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Belum ada hasil nilai yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-6">
          <div className="bg-[#3DC9A7] text-white font-bold px-6 py-3 rounded-lg shadow text-lg">
            Total Nilai : {totalNilai}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hasil Lomba</h1>
          <div className="text-sm text-gray-600">
            <p>Peserta: <span className="font-semibold">{pesertaInfo.nama}</span></p>
            <p>Asal Sekolah: <span className="font-semibold">{pesertaInfo.sekolah}</span></p>
            <p>Lomba: <span className="font-semibold">{pesertaInfo.lomba}</span></p>
            <p>Tanggal Ujian: <span className="font-semibold">{pesertaInfo.tanggalUjian}</span></p>
          </div>
        </div>

        {renderStatusCard()}
        {renderTabelHasil()}
      </main>
    </div>
  );
}
