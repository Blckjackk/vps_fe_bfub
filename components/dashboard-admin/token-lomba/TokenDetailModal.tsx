"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { type Token } from "./TokenTable";
import API_URL from "@/lib/api";
// Type untuk detail token peserta
type DetailToken = {
  id: number;
  kode_token: string;
  cabor: string;
  tipe: string;
  status: string;
  created_at: string;
  expired_at: string;
  can_be_primary: boolean;
};

interface TokenDetailModalProps {
  open: boolean;
  onClose: () => void;
  token: Token | null;
}

export default function TokenDetailModal({
  open,
  onClose,
  token,
}: TokenDetailModalProps) {
  const [detailTokens, setDetailTokens] = useState<DetailToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detail tokens by peserta
  const fetchDetailTokens = async () => {
    if (!token?.peserta_id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/token/peserta/${token.peserta_id}`);
      const data = await response.json();

      if (data.success) {
        setDetailTokens(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail token');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching detail tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set token as primary
  const setTokenAsPrimary = async (tokenId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/token/${tokenId}/primary`, {
        method: 'PUT',
      });
      const data = await response.json();

      if (data.success) {
        fetchDetailTokens(); // Refresh data
        alert('Token berhasil dijadikan sebagai token utama');
      } else {
        alert(data.message || 'Gagal mengatur token utama');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengatur token utama');
      console.error('Error setting primary token:', err);
    }
  };

  // Copy token to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Token berhasil disalin ke clipboard');
    }).catch(() => {
      alert('Gagal menyalin token');
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'text-green-600';
      case 'digunakan':
        return 'text-blue-600';
      case 'hangus':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (open && token) {
      fetchDetailTokens();
    }
  }, [open, token]);

  if (!open || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={24} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-center">Daftar Token</h2>
          <p className="text-center text-gray-600 mt-2">
            Peserta: <span className="font-semibold">{token.peserta}</span> - {token.nomor_pendaftaran}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data token...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="px-4 py-3 border text-left">No.</th>
                  <th className="px-4 py-3 border text-left">Kode Token</th>
                  <th className="px-4 py-3 border text-center">Status</th>
                  <th className="px-4 py-3 border text-center">Tipe</th>
                  <th className="px-4 py-3 border text-center">Dibuat</th>
                  <th className="px-4 py-3 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {detailTokens.map((row, idx) => (
                  <tr key={row.id} className="text-gray-800 hover:bg-gray-50">
                    <td className="px-4 py-3 border font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 border">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {row.kode_token}
                        </code>
                        <button
                          onClick={() => copyToClipboard(row.kode_token)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          title="Salin token"
                        >
                          Salin
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <span className={`font-medium ${getStatusColor(row.status)}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.tipe === "utama"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {row.tipe.charAt(0).toUpperCase() + row.tipe.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border text-center text-sm">
                      {new Date(row.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      {row.tipe === "utama" ? (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Token Utama
                        </span>
                      ) : row.status === "hangus" ? (
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Token Hangus
                        </span>
                      ) : row.can_be_primary ? (
                        <button 
                          onClick={() => setTokenAsPrimary(row.id)}
                          className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200 transition"
                        >
                          Jadikan Utama
                        </button>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                          Tidak Tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {detailTokens.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada token yang ditemukan untuk peserta ini.
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
