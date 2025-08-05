"use client";
import React, { useState } from "react";
import { Copy, Trash2, Edit, Eye, Settings } from "lucide-react";
import { StatusAlertDialog } from "./StatusAlertDialog";

// Tipe data untuk token individual
export type TokenDetail = {
  id: number;
  kode_token: string;
  status: string;
  created_at: string;
  expired_at: string;
};

// Tipe data untuk peserta yang dikelompokkan
export type GroupedToken = {
  peserta_id: number;
  peserta: string;
  nomor_pendaftaran: string;
  cabor: string;
  cabang_lomba_id: number;
  token_utama: TokenDetail | null;
  token_cadangan: TokenDetail[];
  total_tokens: number;
  aktif_tokens: number;
  digunakan_tokens: number;
  hangus_tokens: number;
  isChecked?: boolean;
};

interface GroupedTokenTableProps {
  tokens: GroupedToken[];
  onDeleteItem?: (id: number) => void;
  onSelectItem?: (peserta_id: number) => void;
  onSelectAll?: () => void;
  allChecked?: boolean;
  onUpdateTokenStatus?: (token_id: number, status: string) => void;
  onSetPrimaryToken?: (token_id: number) => void;
}

export default function GroupedTokenTable({ 
  tokens, 
  onDeleteItem, 
  onSelectItem, 
  onSelectAll,
  allChecked,
  onUpdateTokenStatus, 
  onSetPrimaryToken 
}: GroupedTokenTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTokenForStatus, setSelectedTokenForStatus] = useState<TokenDetail | null>(null);
  const [copyAlert, setCopyAlert] = useState<{
    isOpen: boolean;
    token: string;
  }>({
    isOpen: false,
    token: ''
  });

  // Toggle expand/collapse row
  const toggleRow = (pesertaId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(pesertaId)) {
      newExpanded.delete(pesertaId);
    } else {
      newExpanded.add(pesertaId);
    }
    setExpandedRows(newExpanded);
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800 font-medium';
      case 'digunakan':
        return 'bg-blue-100 text-blue-800 font-medium';
      case 'hangus':
        return 'bg-red-100 text-red-800 font-medium';
      default:
        return 'bg-gray-100 text-gray-800 font-medium';
    }
  };

  // Copy token ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyAlert({
      isOpen: true,
      token: text
    });
  };

  // Handle status update
  const handleStatusUpdate = (newStatus: string) => {
    if (selectedTokenForStatus && onUpdateTokenStatus) {
      onUpdateTokenStatus(selectedTokenForStatus.id, newStatus);
      setShowStatusModal(false);
      setSelectedTokenForStatus(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-4 font-medium text-gray-700">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={allChecked || false}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left p-4 font-medium text-gray-700">Peserta</th>
              <th className="text-left p-4 font-medium text-gray-700">No. Pendaftaran</th>
              <th className="text-left p-4 font-medium text-gray-700">Cabang Lomba</th>
              <th className="text-left p-4 font-medium text-gray-700">Token Utama</th>
              <th className="text-left p-4 font-medium text-gray-700">Status Tokens</th>
              <th className="text-left p-4 font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((pesertaToken) => (
              <React.Fragment key={pesertaToken.peserta_id}>
                {/* Main Row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={pesertaToken.isChecked || false}
                      onChange={() => onSelectItem?.(pesertaToken.peserta_id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {pesertaToken.peserta}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {pesertaToken.nomor_pendaftaran}
                  </td>
                  <td className="p-4 text-gray-600">
                    {pesertaToken.cabor}
                  </td>
                  <td className="p-4">
                    {pesertaToken.token_utama ? (
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {pesertaToken.token_utama.kode_token}
                        </code>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pesertaToken.token_utama.status)}`}>
                          {pesertaToken.token_utama.status}
                        </span>
                        <button
                          onClick={() => copyToClipboard(pesertaToken.token_utama!.kode_token)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy token"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Belum ada token utama</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Aktif: {pesertaToken.aktif_tokens}</span>
                      <span className="text-gray-600">Terpakai: {pesertaToken.digunakan_tokens}</span>
                      <span className="text-gray-600">Hangus: {pesertaToken.hangus_tokens}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRow(pesertaToken.peserta_id)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        {expandedRows.has(pesertaToken.peserta_id) ? 'Tutup' : 'Detail'}
                      </button>
                      {pesertaToken.token_utama && (
                        <button
                          onClick={() => {
                            setSelectedTokenForStatus(pesertaToken.token_utama!);
                            setShowStatusModal(true);
                          }}
                          className="text-orange-500 hover:text-orange-700"
                          title="Update Status"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Row - Token Details */}
                {expandedRows.has(pesertaToken.peserta_id) && (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="bg-gray-50 p-4 border-l-4 border-blue-200">
                        <h4 className="font-medium text-gray-700 mb-3">Semua Token untuk {pesertaToken.peserta}</h4>
                        
                        {/* Token Utama Detail */}
                        {pesertaToken.token_utama && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-blue-600 mb-2">Token Utama</h5>
                            <div className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <code className="bg-blue-100 px-2 py-1 rounded">
                                    {pesertaToken.token_utama.kode_token}
                                  </code>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pesertaToken.token_utama.status)}`}>
                                    {pesertaToken.token_utama.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Dibuat: {new Date(pesertaToken.token_utama.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => copyToClipboard(pesertaToken.token_utama!.kode_token)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedTokenForStatus(pesertaToken.token_utama!);
                                      setShowStatusModal(true);
                                    }}
                                    className="text-orange-500 hover:text-orange-700"
                                  >
                                    <Edit size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Token Cadangan */}
                        {pesertaToken.token_cadangan.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Token Cadangan ({pesertaToken.token_cadangan.length})</h5>
                            <div className="space-y-2">
                              {pesertaToken.token_cadangan.map((token) => (
                                <div key={token.id} className="bg-white p-3 rounded border">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <code className="bg-gray-100 px-2 py-1 rounded">
                                        {token.kode_token}
                                      </code>
                                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(token.status)}`}>
                                        {token.status}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Dibuat: {new Date(token.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => copyToClipboard(token.kode_token)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <Copy size={14} />
                                      </button>
                                      <button
                                        onClick={() => onSetPrimaryToken?.(token.id)}
                                        className="text-blue-500 hover:text-blue-700 text-xs"
                                        title="Jadikan Token Utama"
                                      >
                                        Set Utama
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedTokenForStatus(token);
                                          setShowStatusModal(true);
                                        }}
                                        className="text-orange-500 hover:text-orange-700"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      <button
                                        onClick={() => onDeleteItem?.(token.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {tokens.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data token
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedTokenForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Update Status Token</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Token:</p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                {selectedTokenForStatus.kode_token}
              </code>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Status saat ini:</p>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTokenForStatus.status)}`}>
                {selectedTokenForStatus.status}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Pilih status baru:</p>
              <div className="space-y-2">
                {['aktif', 'digunakan', 'hangus'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={status === selectedTokenForStatus.status.toLowerCase()}
                    className={`w-full p-3 text-left rounded-lg border ${
                      status === selectedTokenForStatus.status.toLowerCase()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedTokenForStatus(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Alert Dialog */}
      <StatusAlertDialog
        isOpen={copyAlert.isOpen}
        onClose={() => setCopyAlert(prev => ({ ...prev, isOpen: false }))}
        title="Token Disalin"
        message={`Token ${copyAlert.token} berhasil disalin ke clipboard!`}
        variant="success"
      />
    </>
  );
}
