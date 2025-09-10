'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LombaTable from '@/components/dashboard-admin/manajemen-lomba/LombaTable';
import SetTanggalRilisModal from '@/components/dashboard-admin/SetTanggalRilisModal';
import { Plus, Search, Filter } from 'lucide-react';
import { FaAngleDown } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { API_URL } from '@/lib/api';

// Interface untuk data lomba dari API
interface LombaData {
  id: number;
  nama_cabang: string;
  deskripsi_lomba: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
  tanggal_rilis_nilai: string | null;
  total_peserta: number;
  total_soal_pg: number;
  total_soal_essay: number;
  total_soal_isian: number;
}

export default function ManajemenLombaPage() {
  const [lombaData, setLombaData] = useState<LombaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterType, setFilterType] = useState('semua');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toastShownRef = useRef(false);
  
  // State untuk modal set tanggal rilis
  const [showSetTanggalModal, setShowSetTanggalModal] = useState(false);
  const [selectedLombaForRilis, setSelectedLombaForRilis] = useState<{id: number, nama: string} | null>(null);

  // Fetch data lomba dari API
  const fetchLomba = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/lomba`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setLombaData(data.data);
        setError('');
      } else {
        setError(data.message || 'Gagal memuat data lomba');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadLombaWithToast = async () => {
    await fetchLomba();

    if (!toastShownRef.current) {
      toast.success("Halaman berhasil dimuat!");
      toastShownRef.current = true;
    }
  };

  loadLombaWithToast();
}, []);


  // Function to calculate duration in minutes
  const calculateDuration = (waktuMulai: string, waktuAkhir: string): string => {
    if (!waktuMulai || !waktuAkhir) return '-';
    
    const startTime = new Date(waktuMulai);
    const endTime = new Date(waktuAkhir);
    
    // Calculate difference in milliseconds
    const diffMs = endTime.getTime() - startTime.getTime();
    
    // Convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} menit`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
    }
  };

  // Convert data untuk kompatibilitas dengan LombaTable yang sudah ada
  const convertedLomba = lombaData.map(item => ({
    id: item.id,
    namaLomba: item.nama_cabang,
    durasi: calculateDuration(item.waktu_mulai_pengerjaan, item.waktu_akhir_pengerjaan),
    mulai: item.waktu_mulai_pengerjaan ? new Date(item.waktu_mulai_pengerjaan).toLocaleString('id-ID', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' -') : '-',
    akhir: item.waktu_akhir_pengerjaan ? new Date(item.waktu_akhir_pengerjaan).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' -') : '-',
    tanggalRilisNilai: item.tanggal_rilis_nilai ? new Date(item.tanggal_rilis_nilai).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' -') : 'Belum diset',
    jumlahSoalPG: item.total_soal_pg || 0,
    jumlahSoalIsian: item.total_soal_isian || 0,
    jumlahSoalEsai: item.total_soal_essay || 0,
    isChecked: selectedItems.includes(item.id)
  }));

  // Filter data berdasarkan search term dan filter type
  let filteredLomba = convertedLomba.filter(lomba =>
    lomba.namaLomba.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply date-based filtering
  if (filterType !== 'semua') {
    const now = new Date();
    filteredLomba = filteredLomba.filter(lomba => {
      const startDate = new Date(lomba.mulai.split(' - ')[0]);
      const endDate = new Date(lomba.akhir.split(' - ')[0]);
      
      switch (filterType) {
        case 'terbaru':
          return startDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        case 'aktif':
          return startDate <= now && endDate >= now;
        case 'selesai':
          return endDate < now;
        case 'akan_datang':
          return startDate > now;
        default:
          return true;
      }
    });
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredLomba.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredLomba.map(item => item.id));
    }
  };

  // Handle individual item selection
  const handleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} lomba yang dipilih? Tindakan ini tidak dapat dibatalkan.`);
    
    if (!confirmDelete) return;

    try {
      const deletePromises = selectedItems.map(id => 
        fetch(`${API_URL}/api/lomba/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
      );

      const results = await Promise.all(deletePromises);
      const responses = await Promise.all(results.map(res => res.json()));
      
      const successCount = responses.filter(res => res.success).length;
      const failCount = responses.length - successCount;

      if (successCount > 0) {
        alert(`Berhasil menghapus ${successCount} lomba${failCount > 0 ? `, gagal menghapus ${failCount} lomba` : ''}`);
        setSelectedItems([]);
        fetchLomba(); // Refresh data
      } else {
        alert('Gagal menghapus lomba yang dipilih');
      }
    } catch (error) {
      console.error('Error deleting lomba:', error);
      alert('Terjadi kesalahan saat menghapus lomba');
    }
  };

  // Handle delete single lomba
  const handleDeleteSingle = async (id: number, namaLomba: string) => {
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus lomba "${namaLomba}"? Tindakan ini tidak dapat dibatalkan.`);
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/lomba/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        fetchLomba(); // Refresh data
      } else {
        alert(result.message || 'Gagal menghapus lomba');
      }
    } catch (error) {
      console.error('Error deleting lomba:', error);
      alert('Terjadi kesalahan saat menghapus lomba');
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
    setShowDropdown(false);
  };

  // Handle set tanggal rilis
  const handleSetTanggalRilis = (id: number, namaLomba: string) => {
    setSelectedLombaForRilis({id, nama: namaLomba});
    setShowSetTanggalModal(true);
  };

  const handleSetTanggalSuccess = () => {
    toast.success('Tanggal rilis nilai berhasil ditetapkan!');
    fetchLomba(); // Refresh data jika diperlukan
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Manajemen Lomba</h1>
      
      {/* Tombol Aksi Utama */}
      <div>
      <Link 
        href="/dashboard-admin/manajemen-lomba/tambah-lomba" 
        className="inline-flex items-center gap-2 w-fit bg-[#B94A48] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#B94A48]"
      >
        <span className="text-lg">+</span> Tambah Lomba
      </Link>

      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchLomba}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 w-full">
          <input 
            type="text" 
            placeholder="Cari Lomba" 
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B94A48]" 
          />
          {selectedItems.length > 0 && (
            <button 
              className="bg-[#B94A48] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#a53e3c]"
              onClick={handleDeleteSelected}
            >
              Hapus Pilih ({selectedItems.length})
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Memuat data lomba...</p>
          </div>
        )}

        {/* Tabel Data Lomba */}
        {!loading && (
          <LombaTable 
            lomba={filteredLomba} 
            selectedItems={selectedItems}
            onItemSelection={handleItemSelection}
            onDeleteSingle={handleDeleteSingle}
            onSetTanggalRilis={handleSetTanggalRilis}
          />
        )}
      </div>
      
      {/* Modal Set Tanggal Rilis */}
      {selectedLombaForRilis && (
        <SetTanggalRilisModal
          isOpen={showSetTanggalModal}
          onClose={() => {
            setShowSetTanggalModal(false);
            setSelectedLombaForRilis(null);
          }}
          lombaId={selectedLombaForRilis.id}
          namaLomba={selectedLombaForRilis.nama}
          onSuccess={handleSetTanggalSuccess}
        />
      )}
      
      <Toaster position="top-right" richColors />
    </div>
  );
}   