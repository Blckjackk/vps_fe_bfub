/**
 * File                         : page.tsx (page for token lomba in admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/token-lomba
 * Description                  : Halaman dashboard admin untuk manajemen token lomba BFUB.
 *                                Menampilkan daftar token lomba, pembuatan token baru, dan penghapusan token.
 * Functional                   :
 *      - Menampilkan daftar token yang telah dibuat untuk setiap lomba.
 *      - Menyediakan fitur untuk membuat (generate) token baru secara massal.
 *      - Menyediakan fitur untuk menghapus token yang sudah ada atau tidak valid.
 *      - Menampilkan status token (aktif, digunakan, hangus).
 * API Methods      / Endpoints :
 *      - GET       api/admin/token                (Untuk menampilkan daftar semua token)
 *      - POST      api/admin/token/generate       (Untuk membuat/generate token baru secara massal)
 *      - DELETE    api/admin/token/{id}           (Untuk menghapus token yang dipilih)
 *      - GET       api/lomba                      (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - SELECT token dari tabel token dengan join ke tabel peserta dan cabang_lomba
 *      - INSERT token ke tabel token (generate secara massal)
 *      - DELETE token dari tabel token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 */


import TokenTable from '@/components/dashboard-admin/token-lomba/TokenTable';
import { Search, Filter, ChevronDown } from 'lucide-react';

// Data dummy. Ganti dengan data dari API Anda.
const mockTokens = [
    { id: 1, peserta: 'Asep', kodeToken: 'OBI-TOKEN-001', cabor: 'OBI', tipe: 'Utama', status: 'Aktif' },
    { id: 2, peserta: 'Budi', kodeToken: 'OSA-TOKEN-001', cabor: 'OSA', tipe: 'Utama', status: 'Aktif' },
    { id: 3, peserta: 'Andi', kodeToken: 'CBN-TOKEN-001', cabor: 'CBN', tipe: 'Utama', status: 'Aktif' },
    { id: 4, peserta: 'Dimas', kodeToken: 'OBI-TOKEN-001', cabor: 'OBI', tipe: 'Utama', status: 'Aktif' },
    { id: 5, peserta: 'Alfi', kodeToken: 'OBI-TOKEN-001', cabor: 'OBI', tipe: 'Utama', status: 'Aktif' },
    { id: 6, peserta: 'Azam', kodeToken: 'CBN-TOKEN-001', cabor: 'CBN', tipe: 'Utama', status: 'Aktif' },
    { id: 7, peserta: 'Muklis', kodeToken: 'OSA-TOKEN-001', cabor: 'OSA', tipe: 'Utama', status: 'Aktif' },
];

export default function TokenPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Token Peserta</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Baris Filter dan Aksi */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari Token"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex w-full md:w-auto justify-between items-center gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
            <button className="w-full md:w-auto px-4 py-2 border rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
              Pilih Semua
            </button>
            <button className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Hapus Pilih
            </button>
          </div>
        </div>

        {/* Tabel Token */}
        <TokenTable tokens={mockTokens} />
      </div>
    </div>
  );
}