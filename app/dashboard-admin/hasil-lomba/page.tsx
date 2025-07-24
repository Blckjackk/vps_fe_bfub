/**
 * File                         : page.tsx (page for hasil lomba)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba
 * Description                  : Halaman dashboard admin untuk melihat hasil lomba pada aplikasi website perlombaan BFUB.
 *                                Menampilkan ringkasan hasil perlombaan dan ranking peserta.
 * Functional                   :
 *      - Menampilkan daftar lomba yang sudah selesai.
 *      - Menampilkan ringkasan hasil dan statistik per lomba.
 *      - Menyediakan fitur untuk melihat detail hasil lomba.
 *      - Menampilkan ranking peserta secara keseluruhan.
 *      - Export hasil lomba ke berbagai format.
 * API Methods      / Endpoints :
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba)
 *      - GET       api/admin/hasil/lomba/{id} (Untuk mendapatkan hasil lomba spesifik)
 *      - GET       api/admin/ranking          (Untuk mendapatkan ranking peserta)
 *      - GET       api/admin/export/excel     (Untuk export hasil ke Excel)
 *      - GET       api/admin/export/files     (Untuk download file jawaban)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - SELECT jawaban dari tabel jawaban untuk analisis
 *      - SELECT COUNT dan AVG untuk statistik
 * Anchor Links                 :
 *      - hasil_lomba_detail_pg.tsx
 *      - hasil_lomba_detail_esai.tsx
 */


'use client';

import { useState } from 'react';
import { Search, Filter, Download, ChevronDown, Trash2, FileText } from 'lucide-react';
import HasilLombaTable from '@/components/dashboard-admin/hasil-lomba/HasilLombaTable';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';

// Data dummy. Di aplikasi nyata, data ini akan diambil dari API.
const mockHasilUjian = [
    { id: 1, noPendaftaran: '091301231', nama: 'Asep', cabor: 'OBN', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 90, soalSalah: 10, nilai: 90, isChecked: true },
    { id: 2, noPendaftaran: '123123123', nama: 'Budi', cabor: 'OSA', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 40, soalSalah: 60, nilai: 40, isChecked: true },
    { id: 3, noPendaftaran: '123123123', nama: 'Andi', cabor: 'CBN', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 80, soalSalah: 20, nilai: 80, isChecked: false },
    { id: 4, noPendaftaran: '124124', nama: 'Dimas', cabor: 'OSA', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 50, soalSalah: 50, nilai: 50, isChecked: false },
    { id: 5, noPendaftaran: '12412414', nama: 'Alfi', cabor: 'OBN', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 80, soalSalah: 20, nilai: 80, isChecked: false },
    { id: 6, noPendaftaran: '124124124', nama: 'Azam', cabor: 'OBI', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 70, soalSalah: 30, nilai: 70, isChecked: true },
    { id: 7, noPendaftaran: '5324234', nama: 'Muklis', cabor: 'OBN', mulai: '00:00', selesai: '00:00', jumlahSoal: 100, soalTerjawab: 100, soalBenar: 40, soalSalah: 60, nilai: 40, isChecked: false },
];

export default function HasilUjianPage() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);

  const handleOpenDeleteModal = (id: number | string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Menghapus hasil ujian dengan ID: ${itemToDelete}`);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <div className={`space-y-6 transition-all duration-300 ${isDeleteModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <h1 className="text-2xl font-semibold text-gray-800">Hasil Lomba</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Baris Filter dan Aksi */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari Ujian"
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
              />
            </div>
            <button className="flex justify-between items-center w-full md:w-auto gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <span>Nilai Tertinggi</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex justify-between items-center w-full md:w-auto gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
            <div className="flex-grow hidden md:block"></div> {/* Spacer */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="w-full md:w-auto px-4 py-2 border rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
                Pilih Semua
              </button>
              <button 
                onClick={() => handleOpenDeleteModal('selected')}
                className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus Pilih
              </button>
              <button className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <HasilLombaTable hasil={mockHasilUjian} onDeleteItem={handleOpenDeleteModal} />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah kamu yakin ingin menghapus hasil ujian peserta tersebut?"
      />
    </>
  );
}