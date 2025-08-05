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

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import HasilLombaTable from '@/components/dashboard-admin/hasil-lomba/HasilLombaTable';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';

// Tipe data untuk hasil ujian
type HasilUjian = {
  id: number;
  noPendaftaran: string;
  nama: string;
  cabor: string;
  mulai: string;
  selesai: string;
  jumlahSoal: number;
  soalTerjawab: number;
  soalBenar: number;
  soalSalah: number;
  nilai: number;
  asal_sekolah: string;
  waktu_pengerjaan: string;
  isChecked: boolean;
};

type Lomba = {
  id: number;
  nama_cabang: string;
};

export default function HasilUjianPage() {
  // State utama
  const [hasilUjian, setHasilUjian] = useState<HasilUjian[]>([]);
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLomba, setSelectedLomba] = useState<string>('');
  const [sortBy, setSortBy] = useState('nilai');

  // Modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);

  // Ambil hasil lomba dari API
  const fetchHasilLomba = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedLomba) params.append('lomba_id', selectedLomba);

      const response = await fetch(`http://localhost:8000/api/admin/hasil/lomba?${params}`);
      const data = await response.json();

      if (data.success) {
        let hasil = data.data;

        // Sorting
        hasil.sort((a: HasilUjian, b: HasilUjian) => {
          switch (sortBy) {
            case 'nilai':
              return b.nilai - a.nilai;
            case 'nama':
              return a.nama.localeCompare(b.nama);
            case 'waktu':
              return new Date(b.selesai).getTime() - new Date(a.selesai).getTime();
            default:
              return b.nilai - a.nilai;
          }
        });

        setHasilUjian(hasil);
      } else {
        setError(data.message || 'Gagal mengambil data hasil lomba');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ambil daftar cabang lomba
  const fetchLombaList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/lomba');
      const data = await response.json();
      if (data.success) setLombaList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Pertama kali load data dan tampilkan toast sukses
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchHasilLomba();
      await fetchLombaList();
      toast.success('Halaman berhasil dimuat!');
    };
    fetchInitialData();
  }, []);

  // Re-fetch data jika filter/sort berubah
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchHasilLomba();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedLomba, sortBy]);

  // Hapus data peserta (satu atau banyak)
  const deleteHasilPeserta = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/hasil/peserta/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Berhasil menghapus data.');
        fetchHasilLomba();
      } else {
        toast.error('Gagal menghapus data.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat menghapus data.');
      console.error(err);
    }
  };

  const handleOpenDeleteModal = (id: number | string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (typeof itemToDelete === 'number') {
      deleteHasilPeserta(itemToDelete);
    } else if (itemToDelete === 'selected') {
      const selectedIds = hasilUjian.filter(item => item.isChecked).map(item => item.id);
      Promise.all(
        selectedIds.map(id =>
          fetch(`http://localhost:8000/api/admin/hasil/peserta/${id}`, { method: 'DELETE' }).then(res => res.json())
        )
      ).then(results => {
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
          toast.success(`${successCount} data berhasil dihapus!`);
          fetchHasilLomba();
        } else {
          toast.error('Gagal menghapus data.');
        }
      });
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Checkbox (semua / satuan)
  const handleSelectAll = () => {
    const allChecked = hasilUjian.every(item => item.isChecked);
    setHasilUjian(prev => prev.map(item => ({ ...item, isChecked: !allChecked })));
  };

  const handleSelectItem = (id: number) => {
    setHasilUjian(prev =>
      prev.map(item => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  };

  // Loading atau error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error: {error}</p>
        <button
          onClick={fetchHasilLomba}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-6 transition-all duration-300 ${isDeleteModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <h1 className="text-2xl font-semibold text-gray-800">Hasil Lomba</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Filter dan aksi */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari Nama atau No. Pendaftaran"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 bg-white"
            >
              <option value="nilai">Nilai Tertinggi</option>
              <option value="nama">Nama A-Z</option>
              <option value="waktu">Waktu Selesai</option>
            </select>

            <select
              value={selectedLomba}
              onChange={(e) => setSelectedLomba(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 bg-white"
            >
              <option value="">Semua Lomba</option>
              {lombaList.map(lomba => (
                <option key={lomba.id} value={lomba.id.toString()}>
                  {lomba.nama_cabang}
                </option>
              ))}
            </select>

            <div className="flex-grow hidden md:block"></div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => handleOpenDeleteModal('selected')}
                disabled={!hasilUjian.some(item => item.isChecked)}
                className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                Hapus Pilih
              </button>
            </div>
          </div>

          <HasilLombaTable
            hasil={hasilUjian}
            onDeleteItem={handleOpenDeleteModal}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            allChecked={hasilUjian.length > 0 && hasilUjian.every(item => item.isChecked)}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={
          typeof itemToDelete === 'number'
            ? "Apakah kamu yakin ingin menghapus hasil ujian peserta tersebut?"
            : "Apakah kamu yakin ingin menghapus semua hasil ujian yang dipilih?"
        }
      />

      <Toaster position="top-right" richColors />
    </>
  );
}
