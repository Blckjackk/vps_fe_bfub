/**
 * File                         : page.tsx (page for data peserta in admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/data-peserta
 * Description                  : Halaman dashboard admin untuk manajemen data peserta BFUB.
 *                                Menampilkan daftar peserta, detail, serta fitur pencarian, filter, dan ekspor.
 * Functional                   :
 *      - Menampilkan daftar semua peserta dengan paginasi.
 *      - Menyediakan fitur pencarian dan filter peserta.
 *      - Memungkinkan admin untuk menambah, melihat detail, mengedit, dan menghapus data peserta.
 *      - Menyediakan fitur untuk ekspor data peserta (misal: ke format CSV/Excel).
 *      - Menampilkan status peserta (aktif, tidak aktif, dll).
 * API Methods      / Endpoints :
 *      - GET       api/admin/peserta          (Untuk menampilkan seluruh data peserta dengan pagination)
 *      - POST      api/admin/peserta          (Untuk membuat/menambah data peserta baru)
 *      - GET       api/admin/peserta/{id}     (Untuk menampilkan detail satu peserta)
 *      - PUT       api/admin/peserta/{id}     (Untuk mengupdate data peserta yang dipilih)
 *      - DELETE    api/admin/peserta/{id}     (Untuk menghapus data peserta yang dipilih)
 *      - GET       api/admin/export/excel     (Untuk ekspor data peserta ke Excel)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta dengan filter dan pagination
 *      - INSERT peserta ke tabel peserta
 *      - UPDATE peserta di tabel peserta
 *      - DELETE peserta dari tabel peserta
 *      - SELECT COUNT(*) untuk pagination
 * Anchor Links                 :
 *      - tambah_peserta.tsx
 *      - edit_peserta.tsx
 *      - import_file_peserta.tsx
 */


import StatCard from '@/components/dashboard-admin/StatCard';
import PesertaTable from '@/components/dashboard-admin/data-peserta/PesertaTable';
import { Users, Plus, Upload, Download, Search, Filter } from 'lucide-react';

// Data dummy. Di aplikasi nyata, data ini akan diambil dari API.
const mockPeserta = [
    { id: 1, nama: 'Asep', noPend: '091301231', asal: 'SMAN 1', cabor: 'OSN', username: 'asep123', pass: 'tes123', isChecked: true },
    { id: 2, nama: 'Budi', noPend: '123123123', asal: 'Smp', cabor: 'OBT', username: 'inibudi', pass: 'tes123', isChecked: false },
    { id: 3, nama: 'Andi', noPend: '13123123', asal: 'SD', cabor: 'OSN', username: 'andiil10', pass: 'tes123', isChecked: false },
    { id: 4, nama: 'Dimas', noPend: '12414', asal: 'Univ', cabor: 'OBT', username: 'dimas09', pass: 'tes123', isChecked: false },
    { id: 5, nama: 'Alfi', noPend: '12412414', asal: 'SD', cabor: 'OBT', username: 'affidingin', pass: 'tes123', isChecked: false },
    { id: 6, nama: 'Azam', noPend: '124124124', asal: 'SMP', cabor: 'OBT', username: 'azampkez', pass: 'tes123', isChecked: true },
    { id: 7, nama: 'Muklis', noPend: '5324234', asal: 'SMA', cabor: 'OBT', username: 'muklisss', pass: 'tes123', isChecked: false },
];

export default function DataPesertaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Data Peserta</h1>

      {/* Kartu Statistik Lomba */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard Icon={Users} title="OBI" value={99} />
        <StatCard Icon={Users} title="OSA" value={99} />
        <StatCard Icon={Users} title="OBN" value={99} />
        <StatCard Icon={Users} title="LCBT" value={99} />
      </div>

      {/* Tombol Aksi Utama */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
          <Plus size={18} />
          Tambah Peserta
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors border">
          <Upload size={18} />
          Import
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filter dan Tabel */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              <Filter size={16} />
              Filter
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              Pilih Semua
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Hapus Pilih
            </button>
          </div>
        </div>

        {/* Tabel Data Peserta */}
        <PesertaTable peserta={mockPeserta} />
      </div>
    </div>
  );
}