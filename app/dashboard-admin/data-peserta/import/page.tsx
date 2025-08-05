/**
 * File                         : page.tsx (page for importing participant data)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/data-peserta/import
 * Description                  : Halaman dashboard admin untuk mengimpor file peserta lomba BFUB.
 *                                Memungkinkan admin untuk mengunggah dan memproses data peserta melalui file.
 * Functional                   :
 *      - Menyediakan antarmuka untuk mengunggah file (misal: CSV, Excel).
 *      - Melakukan validasi data dari file yang diunggah.
 *      - Memproses dan menyimpan banyak data peserta sekaligus ke sistem.
 *      - Menampilkan status dan hasil dari proses impor.
 *      - Auto-generate token untuk setiap peserta yang diimpor.
 * API Methods      / Endpoints :
 *      - POST      api/admin/import/peserta    (Untuk memproses file dan membuat data peserta secara massal)
 *      - GET       api/lomba                   (Untuk mendapatkan daftar lomba untuk assignment)
 * Table Activities             :
 *      - INSERT peserta ke tabel peserta (batch import)
 *      - INSERT token ke tabel token (auto-generate untuk peserta baru)
 *      - SELECT lomba dari tabel cabang_lomba untuk assignment
 */


/**
 * File                         : page.tsx (page for importing participant data)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-08-05
 * Url                          : /dashboard-admin/data-peserta/import
 * Description                  : Halaman dashboard admin untuk mengimpor file peserta lomba BFUB.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { UploadCloud } from 'lucide-react';

export default function ImportPesertaPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // TOAST MODAL NOTIFIKASI

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Silakan pilih file terlebih dahulu.');
      return;
    }

    console.log('File yang akan di-submit:', selectedFile);

    // Tampilkan popup notifikasi berhasil
    setShowSuccessModal(true);

    // Auto-close popup dan redirect
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push('/dashboard-admin/data-peserta');
    }, 700); // 2,5 detik
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard-admin/data-peserta" className="text-gray-500 hover:text-gray-800">
          <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Import File Peserta</h1>
      </div>

      <div className="flex justify-start mt-10 ml-10">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Informasi Format */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Format File Peserta</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>File harus berbentuk <span className="font-semibold text-gray-800">.csv</span></li>
                <li>Maksimal Ukuran file 100MB</li>
                <li>
                  Format penulisan:
                  <p className="text-xs bg-gray-100 p-2 rounded mt-1 font-mono">
                    no,nama,jenis_kelamin,email,no_hp,alamat,instansi
                  </p>
                </li>
              </ol>
              <a href="/template-peserta.csv" download className="text-blue-600 hover:underline mt-4 inline-block">
                Download template file
              </a>
            </div>

            {/* Card Upload File */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                *Masukkan file .csv
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">CSV up to 100MB</p>
                </div>
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-500 mt-4">
                  File terpilih: <span className="font-semibold">{selectedFile.name}</span>
                </p>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Link href="/dashboard-admin/data-peserta" className="flex-1">
                <button type="button" className="w-full bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
                  Batal
                </button>
              </Link>
              <button
                type="submit"
                className="flex-1 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60]"
              >
                Import Peserta
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========== POPUP MODAL BERHASIL IMPORT PESERTA ========== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-6 py-4 rounded-xl shadow-md w-full max-w-sm text-center animate-fade-in">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Berhasil!</h2>
            <p className="text-gray-700 text-sm">
              File <span className="font-semibold">{selectedFile?.name}</span> berhasil diimpor.
            </p>
          </div>
        </div>
      )}
      {/* ========== AKHIR DARI POPUP MODAL ========== */}

      {/* Optional animasi fade-in */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

