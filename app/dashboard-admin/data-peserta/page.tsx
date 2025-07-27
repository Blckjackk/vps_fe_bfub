/**
 * File                       import { useState, useEffect } from 'react';
// 👇 PERBAIKAN UTAMA ADA DI 3 BARIS IMPORT DI BAWAH INI 👇
// import StatCard from '@/components/dashboard-admin/StatCard'; // Sementara dinonaktifkan
// import PesertaTable from '@/components/dashboard-admin/data-peserta/PesertaTable'; // Sementara dinonaktifkan
// import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog'; // Sementara dinonaktifkan
import { Users, Plus, Upload, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link'; // Pastikan Link di-importe.tsx (page for data peserta in admin dashboard)
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


'use client'; // Wajib ada untuk menggunakan state (useState)

import { useState, useEffect } from 'react';
// 👇 PERBAIKAN UTAMA ADA DI 3 BARIS IMPORT DI BAWAH INI 👇
// import StatCard from '@/components/dashboard-admin/StatCard'; // Temporary disabled
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';
import { Users, Plus, Upload, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link'; // Pastikan Link di-import

// Types untuk data dari API
interface Peserta {
  id: number;
  nama_lengkap: string;
  nomor_pendaftaran: string;
  asal_sekolah: string;
  kota_provinsi?: string;
  username: string;
  status_ujian: string;
  cabang_lomba?: {
    id: number;
    nama_cabang: string;
    deskripsi_lomba: string;
  };
  nilai_total?: number;
  waktu_mulai: string;
  waktu_selesai: string;
}

interface Stats {
  total_peserta: number;
  belum_mulai: number;
  sedang_ujian: number;
  selesai: number;
  per_cabang: Record<string, number>;
}

export default function DataPesertaPage() {
  // States untuk data dinamis dari API
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);

  // Fetch data dari API
  const fetchPeserta = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`http://localhost:8000/api/admin/peserta?${params}`);
      const data = await response.json();

      console.log('API Response:', data); // Debug log

      if (data.success) {
        setPeserta(data.data || []);
        setStats(data.stats || null);
        setError('');
      } else {
        setError(data.message || 'Gagal memuat data peserta');
        setPeserta([]);
      }
    } catch (err) {
      console.error('Error fetching peserta:', err);
      setError('Terjadi kesalahan saat memuat data. Pastikan backend server berjalan.');
      setPeserta([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    fetchPeserta();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPeserta();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectItem = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === peserta.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(peserta.map(p => p.id));
    }
  };

  const handleOpenDeleteModal = (id: number | string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Di sini letakkan logika untuk menghapus data dari database
    console.log(`Menghapus item: ${itemToDelete}`);
    
    // Refresh data setelah delete
    fetchPeserta();
    
    // Tutup modal setelah selesai
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="p-6">
      <div className={`space-y-6 transition-all duration-300 ${isDeleteModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <h1 className="text-2xl font-semibold text-gray-800">Data Peserta</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Temporary simple cards instead of StatCard */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-red-500" />
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-2xl font-bold">{loading ? "..." : (stats?.total_peserta || 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-gray-500" />
              <div>
                <p className="text-gray-500">Belum Mulai</p>
                <p className="text-2xl font-bold">{loading ? "..." : (stats?.belum_mulai || 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-yellow-500" />
              <div>
                <p className="text-gray-500">Sedang Ujian</p>
                <p className="text-2xl font-bold">{loading ? "..." : (stats?.sedang_ujian || 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-green-500" />
              <div>
                <p className="text-gray-500">Selesai</p>
                <p className="text-2xl font-bold">{loading ? "..." : (stats?.selesai || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard-admin/data-peserta/tambah"
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
            <Plus size={18} /> Tambah Peserta
          </Link>
          <Link
            href="/dashboard-admin/data-peserta/import"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors border">
            <Upload size={18} /> Import
          </Link>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
            <Download size={18} /> Export
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari peserta..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
                <Filter size={16} /> Filter
              </button>
              <button 
                onClick={handleSelectAll}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {selectedIds.length === peserta.length ? 'Batal Pilih' : 'Pilih Semua'}
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={() => handleOpenDeleteModal('selected')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Hapus Pilih ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Temporary simple table instead of PesertaTable untuk debug */}
          <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">No.</th>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">No. Pendaftaran</th>
                    <th className="px-6 py-3">Asal Sekolah</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        Memuat data...
                      </td>
                    </tr>
                  ) : peserta.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data peserta
                      </td>
                    </tr>
                  ) : (
                    peserta.map((item, index) => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium">{item.nama_lengkap}</td>
                        <td className="px-6 py-4">{item.nomor_pendaftaran}</td>
                        <td className="px-6 py-4">{item.asal_sekolah}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status_ujian === 'selesai' ? 'bg-green-100 text-green-800' :
                            item.status_ujian === 'sedang_ujian' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status_ujian === 'belum_mulai' ? 'Belum Mulai' :
                             item.status_ujian === 'sedang_ujian' ? 'Sedang Ujian' : 'Selesai'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ConfirmationDialog sementara dinonaktifkan untuk debug */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              {itemToDelete === 'selected' 
                ? `Apakah kamu yakin menghapus ${selectedIds.length} peserta yang dipilih?`
                : "Apakah kamu yakin menghapus data peserta tersebut?"
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}