"use client";
import React, { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import TokenDetailModal from "./TokenDetailModal";
// Tipe data untuk setiap token
export type Token = {
  id: number;
  peserta: string;
  nomor_pendaftaran?: string;
  kodeToken: string;
  cabor: string; // Cabang Lomba
  tipe: string;
  status: string;
  created_at?: string;
  expired_at?: string;
  peserta_id?: number;
  isChecked?: boolean;
};

interface TokenTableProps {
  tokens: Token[];
  onDeleteItem?: (id: number) => void;
  onSelectItem?: (id: number) => void;
}

export default function TokenTable({ tokens, onDeleteItem, onSelectItem }: TokenTableProps) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'digunakan':
        return 'bg-blue-100 text-blue-800';
      case 'hangus':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fungsi untuk mendapatkan warna tipe
  const getTipeColor = (tipe: string) => {
    return tipe.toLowerCase() === 'utama' 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700';
  };

  const handleShowDetail = (token: Token) => {
    setSelectedToken(token);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedToken(null);
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </th>
                <th scope="col" className="px-6 py-3">
                  No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Peserta
                </th>
                <th scope="col" className="px-6 py-3">
                  No. Pendaftaran
                </th>
                <th scope="col" className="px-6 py-3">
                  Kode Token
                </th>
                <th scope="col" className="px-6 py-3">
                  Cabang Lomba
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="w-4 p-4">
                    <input 
                      type="checkbox" 
                      checked={item.isChecked || false} 
                      onChange={() => onSelectItem?.(item.id)}
                      className="w-4 h-4 rounded" 
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.peserta}
                  </td>
                  <td className="px-6 py-4">{item.nomor_pendaftaran || '-'}</td>
                  <td className="px-6 py-4 font-mono text-sm">{item.kodeToken}</td>
                  <td className="px-6 py-4">{item.cabor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipeColor(item.tipe)}`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="text-gray-500 hover:text-blue-600"
                        title="Lihat Detail Token"
                        onClick={() => handleShowDetail(item)}
                      >
                        <Copy size={18} />
                      </button>
                      {onDeleteItem && (
                        <button
                          className="text-[#B94A48] hover:text-[#a53e3c]"
                          title="Hapus Token"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Token */}
      <TokenDetailModal
        open={showDetail}
        onClose={handleCloseDetail}
        token={selectedToken}
      />
    </>
  );
}
