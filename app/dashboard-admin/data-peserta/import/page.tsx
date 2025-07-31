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


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud } from 'lucide-react';

export default function ImportPesertaPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    // Di aplikasi nyata, di sini Anda akan memproses file CSV
    // menggunakan FormData untuk dikirim ke API
    console.log('File yang akan di-submit:', selectedFile);
    alert(`File "${selectedFile.name}" berhasil di-submit.`);
    router.push('/dashboard-admin/data-peserta');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard-admin/data-peserta" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Import File Peserta</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
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
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
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
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/dashboard-admin/data-peserta" className="px-10 py-2.5 bg-[#D14D42] text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors">
            Back
          </Link>
          <button type="submit" className="px-10 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}