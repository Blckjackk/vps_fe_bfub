/**
 * File                         : page.tsx (page for editing participant data)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/data-peserta/edit/[id]
 * Description                  : Halaman dashboard admin untuk mengedit data peserta perlombaan BFUB.
 *                                Menampilkan form edit data peserta dan aksi penyimpanan perubahan.
 * Functional                   :
 *      - Mengambil data peserta yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data peserta tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data peserta ke dalam sistem.
 *      - Redirect ke daftar peserta setelah berhasil update.
 * API Methods      / Endpoints :
 *      - GET       api/admin/peserta/{id}     (Untuk mengambil data peserta yang akan diedit)
 *      - PUT       api/admin/peserta/{id}     (Untuk menyimpan perubahan data peserta)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta berdasarkan ID
 *      - UPDATE peserta di tabel peserta
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PesertaForm from '@/components/dashboard-admin/data-peserta/PesertaForm';

export default function EditPesertaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // State untuk menampung data awal yang akan diedit
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Simulasi pengambilan data peserta berdasarkan ID dari URL
    console.log(`Mengambil data untuk peserta dengan ID: ${params.id}`);
    if (params.id) {
      // Di aplikasi nyata, ini adalah panggilan API fetch(`/api/peserta/${params.id}`)
      const fetchedData = {
        namaLengkap: 'Asep (dari DB)',
        noPendaftaran: '091301231',
        asalSekolah: 'SMAN 1',
        cabangLomba: 'OSN',
        username: 'asep123',
        password: '', // Password dikosongkan untuk keamanan
      };
      setInitialData(fetchedData);
    }
  }, [params.id]);

  const handleUpdatePeserta = (data: any) => {
    // Di sini letakkan logika untuk mengirim data yang sudah diupdate ke API
    console.log(`Mengirim update untuk ID ${params.id}:`, data);
    alert('Data peserta berhasil diupdate!');
    router.push('/dashboard-admin/data-peserta');
  };

  // Tampilkan loading atau pesan jika data belum siap
  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard-admin/data-peserta" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Peserta</h1>
      </div>

      <PesertaForm
        onSubmit={handleUpdatePeserta}
        initialData={initialData}
        isEditMode={true}
      />
    </div>
  );
}