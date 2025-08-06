"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { FaUser, FaClipboardList} from "react-icons/fa";
import { HiNewspaper } from "react-icons/hi2";
import { toast, Toaster } from 'sonner';
import { useRef, useEffect } from 'react';

export default function ExportPage() {
  const [fileFormat, setFileFormat] = useState("csv");
  const [selected, setSelected] = useState({
    peserta: false,
    soal: false,
    hasil_lomba: false,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const toastShownRef = useRef(false);

  const handleSelectAll = () => {
    setSelected({
      peserta: true,
      soal: true,
      hasil_lomba: true,
    });
  };

  useEffect(() => {
  if (!toastShownRef.current) {
    toast.success('Halaman berhasil dimuat!');
    toastShownRef.current = true;
  }
}, []);


  return (
      <div className="space-y-6">
        {/* Header with back button and title */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-800">Ekspor File</h1>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Table Selection */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Pilih Tabel untuk Diekspor</h2>
              <button
                onClick={handleSelectAll}
                className="text-[#2176FF] font-medium text-sm hover:underline"
              >
                Pilih Semua
              </button>
            </div>

            <div className="space-y-4">
              {/* Data Peserta */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.peserta}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, peserta: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <FaUser />
                    <span className="font-medium">Data Peserta</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel data peserta menampilkan informasi lengkap mengenai peserta yang terdaftar dalam sebuah lomba. Setiap baris pada tabel mewakili satu peserta, dengan kolom-kolom yang mencakup nomor urut, nama lengkap, nomor pendaftaran, asal sekolah atau institusi.
                </p>
              </div>

              {/* Soal */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.soal}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, soal: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <HiNewspaper />
                    <span className="font-medium">Soal</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel data soal yang diekspor mencakup tiga jenis utama, yaitu soal pilihan ganda (PG), soal esai, dan soal isian singkat. Soal PG terdiri dari pertanyaan dengan beberapa opsi jawaban, disertai kunci jawaban untuk memudahkan penilaian otomatis. Soal esai dan soal isian singkat.
                </p>
              </div>

              {/* Hasil Lomba */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.hasil_lomba}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, hasil_lomba: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <FaClipboardList/>
                    <span className="font-medium">Hasil Lomba</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel hasil lomba menampilkan rekapitulasi lengkap dari seluruh peserta yang telah mengikuti kompetisi. Setiap entri dalam tabel memuat informasi penting seperti nama peserta, nomor pendaftaran, asal sekolah atau institusi, serta skor akhir yang diperoleh.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Export Options */}
          <div className="w-80 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Opsi Ekspor</h2>

            {/* Format File */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format File
              </label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Waktu
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                />
              </div>
            </div>

            {/* Information Format */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Informasi Format
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>Excel (.xlsx): Data dalam bentuk tabel, mudah dibaca dan dianalisis secara visual</li>
                <li>CSV (.csv): Format ringan dan sederhana, cocok untuk ekspor cepat dan kompatibel dengan banyak sistem</li>
                <li>JSON (.json): Format data terstruktur, umum digunakan untuk pertukaran data antarsistem dan API</li>
                <li>ZIP (.zip): Menggabungkan beberapa file dalam satu arsip, memudahkan distribusi dan penyimpanan</li>
                <li>PDF (.pdf): Dokumen siap cetak dan dibagikan, isi tidak mudah diubah</li>
                <li>DOCX (.docx): Dokumen yang dapat diedit, cocok untuk laporan atau draf dokumen</li>

              </ul>
            </div>

            {/* Export Button */}
            <Button
              className="w-full bg-[#2ECC8B] hover:bg-[#27ae60] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              type="submit"
            >
              Export
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </div>
  );
}
