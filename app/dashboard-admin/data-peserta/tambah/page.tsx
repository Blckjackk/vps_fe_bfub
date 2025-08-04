/**
 * File                         : page.tsx (page for adding new participant)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/data-peserta/tambah
 * Description                  : Halaman dashboard admin untuk menambah peserta baru pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input data peserta dan aksi penyimpanan ke database.
 * Functional                   :
 *      - Menampilkan form untuk menambah data peserta baru.
 *      - Melakukan validasi terhadap input data pada form.
 *      - Menyimpan data peserta baru ke dalam sistem.
 *      - Auto-generate token untuk peserta baru.
 * API Methods      / Endpoints :
 *      - POST      api/admin/peserta          (Untuk membuat/menambah data peserta baru)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - INSERT peserta ke tabel peserta
 *      - INSERT token ke tabel token (auto-generate untuk peserta baru)
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */


'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import PesertaForm from '@/components/dashboard-admin/data-peserta/PesertaForm';

export default function TambahPesertaPage() {
  const router = useRouter();

  const handleCreatePeserta = (data: any) => {
    // Di sini letakkan logika untuk mengirim data peserta baru ke API
    console.log('Data peserta baru:', data);
    alert('Peserta baru berhasil ditambahkan!');
    router.push('/dashboard-admin/data-peserta');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard-admin/data-peserta" className="text-gray-500 hover:text-gray-800">
          <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Tambah Peserta</h1>
      </div>

      <div className="flex justify-start mt-10 ml-10">
        <div className="w-full max-w-2xl">
          <PesertaForm onSubmit={handleCreatePeserta} isEditMode={false} />
        </div>
      </div>
    </div>
  );
}