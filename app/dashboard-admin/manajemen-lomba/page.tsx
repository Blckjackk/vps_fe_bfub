'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LombaTable from '@/components/dashboard-admin/manajemen-lomba/LombaTable';
import { Plus, Search, Filter } from 'lucide-react';

// Interface untuk data lomba dari API
interface LombaData {
  id: number;
  nama_cabang: string;
  deskripsi_lomba: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
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

  // Fetch data lomba dari API
  const fetchLomba = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/lomba', {
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
    fetchLomba();
  }, []);

  // Convert data untuk kompatibilitas dengan LombaTable yang sudah ada
  const convertedLomba = lombaData.map(item => ({
    id: item.id,
    namaLomba: item.nama_cabang,
    durasi: '120 menit', // Default duration
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
    jumlahSoalPG: item.total_soal_pg || 0,
    jumlahSoalIsian: item.total_soal_isian || 0,
    jumlahSoalEsai: item.total_soal_essay || 0,
    isChecked: false
  }));

  // Filter data berdasarkan search term
  const filteredLomba = convertedLomba.filter(lomba =>
    lomba.namaLomba.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Daftar Lomba</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Tombol Aksi Utama */}
        <div>
          <Link 
            href="/dashboard-admin/manajemen-lomba/tambah-lomba"
            className="flex items-center gap-2 bg-[#B94A48] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#ac5555] transition-colors"
          >
            <Plus size={18} />
            Tambah Lomba
          </Link>
        </div>

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

        {/* Filter dan Aksi Tabel */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari Lomba"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <Filter size={16} />
              Filter
            </button>
           
          </div>
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
          <LombaTable lomba={filteredLomba} />
        )}
      </div>
    </div>
  );
}   