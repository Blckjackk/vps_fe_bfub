/**
 * File                         : page.tsx (page for data peserta in admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-08-04
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

'use client';

import { useState, useEffect, useRef } from 'react';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';
import SuccessDialog from '@/components/dashboard-admin/SuccessDialog';
import { Users, Plus, Upload, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

// API URL dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types untuk data dari API
interface Peserta {
  id: number;
  nama_lengkap: string;
  password_hash: string;
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

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function DataPesertaPage() {
  // States untuk data dinamis dari API
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const toastShownRef = useRef(false);

  
  // Modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);

  // Fetch data dari API
  const fetchPeserta = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
  
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      
      // Try multiple approaches to get all records
      params.append('all', 'true'); // Some APIs use this
      params.append('per_page', '9999'); // Very high limit as fallback
      params.append('page', '1');
  
      const response = await fetch(`${API_URL}/api/admin/peserta?${params}`);
      const data = await response.json();
  
      console.log('API Response:', data); // Debug log
      console.log('Records received:', data.data?.length, 'Total in stats:', data.stats?.total_peserta); // Debug log
  
      if (data.success) {
        setPeserta(data.data || []);
        setStats(data.stats || null);
        setPaginationInfo(data.pagination || null);
        setError('');
        
        // Log for debugging
        console.log(`Successfully loaded ${data.data?.length || 0} peserta records`);
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
    const fetchInitialData = async () => {
    await fetchPeserta();

    if (!toastShownRef.current) {
      toast.success('Halaman berhasil dimuat!');
      toastShownRef.current = true;
    }
  };

  fetchInitialData();
}, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPeserta();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus]);

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

  const handleConfirmDelete = async () => {
    try {
      if (itemToDelete === 'selected') {
        // Batch delete
        const response = await fetch(`${API_URL}/api/admin/peserta/delete-batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({
            ids: selectedIds
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setSelectedIds([]);
          setSuccessMessage(result.message);
          setSuccessModalOpen(true);
        } else {
          alert(result.message || 'Gagal menghapus peserta');
        }
      } else {
        // Single delete
        const response = await fetch(`${API_URL}/api/admin/peserta/${itemToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        const result = await response.json();
        
        if (result.success) {
          setSuccessMessage(result.message);
          setSuccessModalOpen(true);
        } else {
          alert(result.message || 'Gagal menghapus peserta');
        }
      }

      // Refresh data setelah delete
      fetchPeserta();
      
    } catch (error) {
      console.error('Error deleting peserta:', error);
      alert('Terjadi kesalahan saat menghapus peserta');
    }
    
    // Tutup modal setelah selesai
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
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
            className="flex items-center gap-2 bg-[#B94A48] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
            <Plus size={18} /> Tambah Peserta
          </Link>
          <Link
            href="/dashboard-admin/data-peserta/import"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors border">
            <Download size={18} /> Import
          </Link>
          <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-colors">
            <Upload size={18} /> Export
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
            <div className="flex items-center gap-4 w-full md:w-auto">
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
              {/* Show record count
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Menampilkan {peserta.length} dari {stats?.total_peserta || 0} peserta
              </div> */}
            </div>
            <div className="flex items-center gap-2">
              {/* Dropdown filter status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm text-gray-700"
              >
                <option value="">Semua Status</option>
                <option value="belum_mulai">Belum Mulai</option>
                <option value="sedang_ujian">Sedang Ujian</option>
                <option value="selesai">Selesai</option>
              </select>

              {/* Tombol reset filter */}
              {filterStatus && (
                <button
                  onClick={() => setFilterStatus('')}
                  className="px-3 py-2 border rounded-lg text-sm text-gray-500 hover:bg-gray-100"
                >
                  Reset
                </button>
              )}
              {/* Tombol hapus peserta terpilih */}
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
              <table className="w-full text-sm text-left text-gray-600 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="w-12 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === peserta.length && peserta.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </th>
                    <th className="w-16 px-3 py-3">No.</th>
                    <th className="w-48 px-3 py-3">Nama</th>
                    <th className="w-40 px-3 py-3">Cabang Lomba</th>
                    <th className="w-32 px-3 py-3">Password</th>
                    <th className="w-48 px-3 py-3">Asal Sekolah</th>
                    <th className="w-40 px-3 py-3">Kota/Provinsi</th>
                    <th className="w-32 px-3 py-3">Status</th>
                    <th className="w-24 px-3 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center">
                        Memuat data...
                      </td>
                    </tr>
                  ) : peserta.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data peserta
                      </td>
                    </tr>
                  ) : (
                    peserta.map((item, index) => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </td>
                        <td className="px-3 py-4">{index + 1}</td>
                        <td className="px-3 py-4 font-medium truncate" title={item.nama_lengkap}>
                          {item.nama_lengkap}
                        </td>
                        <td className="px-3 py-4 truncate" title={item.cabang_lomba?.nama_cabang}>
                          {item.cabang_lomba?.nama_cabang}
                        </td>
                        <td className="px-3 py-4">
                          <div className="truncate max-w-24" title={item.password_hash}>
                            {item.password_hash.length > 20 
                              ? `${item.password_hash.substring(0, 20)}...` 
                              : item.password_hash}
                          </div>
                        </td>
                        <td className="px-3 py-4 truncate" title={item.asal_sekolah}>
                          {item.asal_sekolah}
                        </td>
                        <td className="px-3 py-4 truncate" title={item.kota_provinsi}>
                          {item.kota_provinsi}
                        </td>
                        <td className="px-3 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            item.status_ujian === 'selesai' ? 'bg-green-100 text-green-800' :
                            item.status_ujian === 'sedang_ujian' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status_ujian === 'belum_mulai' ? 'Belum Mulai' :
                             item.status_ujian === 'sedang_ujian' ? 'Sedang Ujian' : 'Selesai'}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <button
                            onClick={() => handleOpenDeleteModal(item.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Hapus
                          </button>
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

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={
          itemToDelete === 'selected'
            ? `Apakah kamu yakin menghapus ${selectedIds.length} peserta yang dipilih?`
            : "Apakah kamu yakin menghapus data peserta tersebut?"
        }
      />

      <SuccessDialog
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          // Refresh data after closing success dialog
          fetchPeserta();
        }}
        title="Berhasil"
        message={successMessage}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}