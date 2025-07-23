/**
 * File                         : page.tsx (page for manajemen lomba in admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/daftar-lomba
 * Description                  : Halaman dashboard admin untuk daftar lomba pada aplikasi website perlombaan BFUB.
 *                                Menampilkan daftar lomba yang terdaftar dan fitur manajemen lomba.
 * Functional                   :
 *      - Menampilkan daftar semua lomba dengan paginasi.
 *      - Menyediakan fitur pencarian dan filter lomba.
 *      - Memungkinkan admin untuk menambah, melihat detail, mengedit, dan menghapus data lomba.
 *      - Menyediakan fitur bulk actions untuk operasi massal.
 * API Methods      / Endpoints :
 *      - GET       api/lomba                  (Untuk menampilkan seluruh data lomba dengan pagination)
 *      - POST      api/lomba                  (Untuk membuat/menambah data lomba baru)
 *      - GET       api/lomba/{id}             (Untuk menampilkan detail dari satu lomba)
 *      - PUT       api/lomba/{id}             (Untuk mengupdate data lomba yang dipilih)
 *      - DELETE    api/lomba/{id}             (Untuk menghapus data lomba yang dipilih)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba dengan filter dan pagination
 *      - INSERT lomba ke tabel cabang_lomba
 *      - UPDATE lomba di tabel cabang_lomba
 *      - DELETE lomba dari tabel cabang_lomba
 *      - SELECT COUNT(*) untuk pagination
 */


import LombaTable from '@/components/dashboard-admin/manajemen-lomba/LombaTable';
import { Plus, Search, Filter } from 'lucide-react';

// Data dummy. Di aplikasi nyata, data ini akan diambil dari API.
const mockLomba = [
    { id: 1, namaLomba: 'OBN', kodeGrup: '091301231', kategori: 'PG dan Esai', durasi: '00:00', mulai: '00:00', akhir: '00:00', jumlahSoal: 110, isChecked: true },
    { id: 2, namaLomba: 'OBI', kodeGrup: '123123123', kategori: 'PG dan Esai', durasi: '00:00', mulai: '00:00', akhir: '00:00', jumlahSoal: 110, isChecked: true },
    { id: 3, namaLomba: 'OSA', kodeGrup: '13123123', kategori: 'PG dan Esai', durasi: '00:00', mulai: '00:00', akhir: '00:00', jumlahSoal: 105, isChecked: false },
];


export default function ManajemenLombaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Daftar Lomba</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Tombol Aksi Utama */}
        <div>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
            <Plus size={18} />
            Tambah Lomba
          </button>
        </div>

        {/* Filter dan Aksi Tabel */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari Ujian"
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <Filter size={16} />
              Filter
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
              Pilih Semua
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Hapus Pilih
            </button>
          </div>
        </div>

        {/* Tabel Data Lomba */}
        <LombaTable lomba={mockLomba} />
      </div>
    </div>
  )
}