"use client";
import React, { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import TokenDetailModal from "./TokenDetailModal";
// Tipe data untuk setiap token
export type Token = {
  id: number;
  peserta: string;
  kodeToken: string;
  cabor: string; // Cabang Lomba
  tipe: string;
  status: string;
};

interface TokenTableProps {
  tokens: Token[];
}

export default function TokenTable({ tokens }: TokenTableProps) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);

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
                <th scope="col" className="px-6 py-3">
                  No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Peserta
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
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.peserta}
                  </td>
                  <td className="px-6 py-4">{item.kodeToken}</td>
                  <td className="px-6 py-4">{item.cabor}</td>
                  <td className="px-6 py-4">{item.tipe}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="text-gray-500 hover:text-blue-600"
                        title="Salin Token"
                        onClick={() => handleShowDetail(item)}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        className="text-[#B94A48] hover:text-[#a53e3c]"
                        title="Hapus Token"
                      >
                        <Trash2 size={18} />
                      </button>
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
