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

import { useState, useEffect } from 'react';
import TokenTable from '@/components/dashboard-admin/token-lomba/TokenTable';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react';

// Types
type Token = {
  id: number;
  peserta: string;
  nomor_pendaftaran: string;
  kodeToken: string;
  cabor: string;
  tipe: string;
  status: string;
  created_at: string;
  expired_at: string;
  peserta_id: number;
};

type Lomba = {
  id: number;
  nama_cabang: string;
};

type Peserta = {
  id: number;
  nama_lengkap: string;
  nomor_pendaftaran: string;
};

export default function TokenPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLomba, setSelectedLomba] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Generate token form states
  const [generateForm, setGenerateForm] = useState({
    peserta_id: '',
    cabang_lomba_id: '',
    jumlah_token: 1
  });

  // Fetch data tokens
  const fetchTokens = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedLomba) params.append('lomba_id', selectedLomba);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`http://localhost:8000/api/admin/token?${params}`);
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

  // Fetch daftar peserta
  const fetchPesertaList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/peserta');
      const data = await response.json();
      
      if (data.success) {
        setPesertaList(data.data);
      }
    } catch (err) {
      console.error('Error fetching peserta:', err);
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
        alert('Token berhasil dihapus');
      } else {
        alert(data.message || 'Gagal menghapus token');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus token');
      console.error('Error deleting token:', err);
    }
  };

  // Generate tokens
  const generateTokens = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/token/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateForm),
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        setGenerateModalOpen(false);
        setGenerateForm({ peserta_id: '', cabang_lomba_id: '', jumlah_token: 1 });
        alert('Token berhasil dibuat');
      } else {
        alert(data.message || 'Gagal membuat token');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat membuat token');
      console.error('Error generating tokens:', err);
    }
  };

  // Mark selected tokens as expired
  const markTokensAsExpired = async () => {
    const selectedTokens = tokens.filter(token => 
      (token as any).isChecked && token.status !== 'digunakan'
    );
    
    if (selectedTokens.length === 0) {
      alert('Pilih token yang akan ditandai hangus');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/token/expire', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_ids: selectedTokens.map(token => token.id)
        }),
      });
      const data = await response.json();

      if (data.success) {
        fetchTokens();
        alert('Token berhasil ditandai sebagai hangus');
      } else {
        alert(data.message || 'Gagal menandai token sebagai hangus');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menandai token');
      console.error('Error marking tokens as expired:', err);
    }
  };

  useEffect(() => {
    fetchTokens();
    fetchLombaList();
    fetchPesertaList();
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
    const allChecked = tokens.every(token => (token as any).isChecked);
    setTokens(prev => prev.map(token => ({ ...token, isChecked: !allChecked } as any)));
  };

  const handleSelectItem = (id: number) => {
    setTokens(prev => 
      prev.map(token => 
        token.id === id ? { ...token, isChecked: !(token as any).isChecked } as any : token
      )
    );
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
          <button
            onClick={() => setGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} />
            Generate Token
          </button>
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
                onClick={handleSelectAll}
                className="w-full md:w-auto px-4 py-2 border rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                {tokens.every(token => (token as any).isChecked) ? 'Batal Pilih' : 'Pilih Semua'}
              </button>
              <button 
                onClick={markTokensAsExpired}
                disabled={!tokens.some(token => (token as any).isChecked)}
                className="w-full md:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400"
              >
                Tandai Hangus
              </button>
            </div>
          </div>

          {/* Tabel Token */}
          <TokenTable 
            tokens={tokens} 
            onDeleteItem={handleOpenDeleteModal}
            onSelectItem={handleSelectItem}
          />
        </div>
      </div>

      {/* Modal Generate Token */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Generate Token Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peserta
                </label>
                <select
                  value={generateForm.peserta_id}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, peserta_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Pilih Peserta</option>
                  {pesertaList.map(peserta => (
                    <option key={peserta.id} value={peserta.id.toString()}>
                      {peserta.nama_lengkap} - {peserta.nomor_pendaftaran}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cabang Lomba
                </label>
                <select
                  value={generateForm.cabang_lomba_id}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, cabang_lomba_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Pilih Lomba</option>
                  {lombaList.map(lomba => (
                    <option key={lomba.id} value={lomba.id.toString()}>
                      {lomba.nama_cabang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Token
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={generateForm.jumlah_token}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, jumlah_token: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setGenerateModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={generateTokens}
                disabled={!generateForm.peserta_id || !generateForm.cabang_lomba_id}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus token ini?"
      />
    </>
  );
}