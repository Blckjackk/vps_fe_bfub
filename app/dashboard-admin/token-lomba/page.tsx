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


'use client';

import { useState, useEffect, useRef } from 'react';
import GroupedTokenTable from '@/components/dashboard-admin/token-lomba/GroupedTokenTable';
import type { GroupedToken } from '@/components/dashboard-admin/token-lomba/GroupedTokenTable';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';
import { StatusAlertDialog } from '@/components/dashboard-admin/token-lomba/StatusAlertDialog';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Types
type Lomba = {
  id: number;
  nama_cabang: string;
};

export default function TokenPage() {
  const [tokens, setTokens] = useState<GroupedToken[]>([]);
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toastShownRef = useRef(false);
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLomba, setSelectedLomba] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [statusAlert, setStatusAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'success'
  });

  // Fetch data tokens
  const fetchTokens = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedLomba) params.append('lomba_id', selectedLomba);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`http://localhost:8000/api/admin/token/grouped?${params}`);
      const data = await response.json();

      if (data.success) {
        setTokens(data.data);
      } else {
        setError(data.message || 'Gagal mengambil data token');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daftar lomba
  const fetchLombaList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/lomba');
      const data = await response.json();
      
      if (data.success) {
        setLombaList(data.data);
      }
    } catch (err) {
      console.error('Error fetching lomba:', err);
    }
  };

  // Delete token
  const deleteToken = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/token/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Token berhasil dihapus',
          variant: 'success'
        });
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal menghapus token',
          variant: 'error'
        });
      }
    } catch (err) {
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus token',
        variant: 'error'
      });
      console.error('Error deleting token:', err);
    }
  };



  // Mark selected tokens as expired
  const markTokensAsExpired = async () => {
    const selectedPeserta = tokens.filter(peserta => 
      (peserta as any).isChecked
    );
    
    if (selectedPeserta.length === 0) {
      setStatusAlert({
        isOpen: true,
        title: 'Peringatan',
        message: 'Pilih peserta yang tokennya akan ditandai hangus',
        variant: 'error'
      });
      return;
    }

    // Collect all token IDs from selected peserta
    const tokenIds: number[] = [];
    selectedPeserta.forEach(peserta => {
      if (peserta.token_utama) {
        tokenIds.push(peserta.token_utama.id);
      }
      peserta.token_cadangan.forEach(token => {
        tokenIds.push(token.id);
      });
    });

    try {
      const response = await fetch('http://localhost:8000/api/admin/token/expire', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_ids: tokenIds
        }),
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Token berhasil ditandai sebagai hangus',
          variant: 'success'
        });
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal menandai token sebagai hangus',
          variant: 'error'
        });
      }
    } catch (err) {
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menandai token',
        variant: 'error'
      });
      console.error('Error marking tokens as expired:', err);
    }
  };

  // Delete selected tokens
  const deleteSelectedTokens = async () => {
    const selectedPeserta = tokens.filter(peserta => 
      (peserta as any).isChecked
    );
    
    if (selectedPeserta.length === 0) {
      setStatusAlert({
        isOpen: true,
        title: 'Peringatan',
        message: 'Pilih peserta yang tokennya akan dihapus',
        variant: 'error'
      });
      return;
    }

    // Collect all token IDs from selected peserta
    const tokenIds: number[] = [];
    selectedPeserta.forEach(peserta => {
      if (peserta.token_utama) {
        tokenIds.push(peserta.token_utama.id);
      }
      peserta.token_cadangan.forEach(token => {
        tokenIds.push(token.id);
      });
    });

    try {
      const response = await fetch('http://localhost:8000/api/admin/token/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_ids: tokenIds
        }),
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Token berhasil dihapus',
          variant: 'success'
        });
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal menghapus token',
          variant: 'error'
        });
      }
    } catch (err) {
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus token',
        variant: 'error'
      });
      console.error('Error deleting tokens:', err);
    }
  };

useEffect(() => {
  const loadData = async () => {
    await fetchTokens();
    await fetchLombaList();

    if (!toastShownRef.current) {
      toast.success("Halaman berhasil dimuat!");
      toastShownRef.current = true;
    }
  };

  loadData();
}, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchTokens();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedLomba, selectedStatus]);

  const handleOpenDeleteModal = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteToken(itemToDelete);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSelectAll = () => {
    const allChecked = tokens.every(peserta => (peserta as any).isChecked);
    setTokens(prev => prev.map(peserta => ({ ...peserta, isChecked: !allChecked } as any)));
  };

  const handleSelectItem = (peserta_id: number) => {
    setTokens(prev => 
      prev.map(peserta => 
        peserta.peserta_id === peserta_id ? { ...peserta, isChecked: !(peserta as any).isChecked } as any : peserta
      )
    );
  };

  // Update token status
  const updateTokenStatus = async (token_id: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/token/${token_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Status token berhasil diubah',
          variant: 'success'
        });
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal mengubah status token',
          variant: 'error'
        });
      }
    } catch (err) {
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status token',
        variant: 'error'
      });
      console.error('Error updating token status:', err);
    }
  };

  // Set token as primary
  const setPrimaryToken = async (token_id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/token/${token_id}/primary`, {
        method: 'PUT',
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Token berhasil dijadikan sebagai token utama',
          variant: 'success'
        });
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal mengatur token utama',
          variant: 'error'
        });
      }
    } catch (err) {
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengatur token utama',
        variant: 'error'
      });
      console.error('Error setting primary token:', err);
    }
  };

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
          onClick={fetchTokens}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Token Peserta</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Baris Filter dan Aksi */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari Token atau Peserta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 bg-white"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="digunakan">Digunakan</option>
              <option value="hangus">Hangus</option>
            </select>

            <div className="flex-grow hidden md:block"></div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button 
                onClick={markTokensAsExpired}
                disabled={!tokens.some(peserta => (peserta as any).isChecked)}
                className="w-full md:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400"
              >
                Tandai Hangus
              </button>
              <button 
                onClick={deleteSelectedTokens}
                disabled={!tokens.some(peserta => (peserta as any).isChecked)}
                className="w-full md:w-auto px-4 py-2 bg-[#B94A48] text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                Hapus Dipilih
              </button>
            </div>
          </div>

          {/* Tabel Token */}
          <GroupedTokenTable 
            tokens={tokens} 
            onDeleteItem={handleOpenDeleteModal}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            allChecked={tokens.length > 0 && tokens.every(peserta => (peserta as any).isChecked)}
            onUpdateTokenStatus={updateTokenStatus}
            onSetPrimaryToken={setPrimaryToken}
          />
        </div>
      </div>



      {/* Modal Konfirmasi Hapus */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus token ini?"
      />

      {/* Status Alert Dialog */}
      <StatusAlertDialog
        isOpen={statusAlert.isOpen}
        onClose={() => setStatusAlert(prev => ({ ...prev, isOpen: false }))}
        title={statusAlert.title}
        message={statusAlert.message}
        variant={statusAlert.variant}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}