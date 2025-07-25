"use client";
import React from "react";
import { X } from "lucide-react";
import { type Token } from "./TokenTable";

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
  if (!open || !token) return null;

  // Data dummy detail token sesuai desain Figma
  const detailTokens = [
    {
      kodeToken: "OBI-TOKEN-001",
      status: "Non-aktif",
      tipe: "Cadangan",
      aksi: "Token Sudah Hangus",
    },
    {
      kodeToken: "OBI-TOKEN-002",
      status: "Aktif",
      tipe: "Utama",
      aksi: "Utama",
    },
    {
      kodeToken: "OBI-TOKEN-003",
      status: "Non-aktif",
      tipe: "Cadangan",
      aksi: "Jadikan Utama",
    },
    {
      kodeToken: "OBI-TOKEN-004",
      status: "Non-aktif",
      tipe: "Cadangan",
      aksi: "Jadikan Utama",
    },
    {
      kodeToken: "OBI-TOKEN-005",
      status: "Non-aktif",
      tipe: "Cadangan",
      aksi: "Jadikan Utama",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-center mb-6">Daftar Token</h2>
        <div className="overflow-x-auto">
          <table
            className="w-auto bg-white rounded-lg border border-gray-200"
            style={{ minWidth: 700 }}
          >
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-2 border">No.</th>
                <th className="px-4 py-2 border">Kode Token</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Utama atau Tidak</th>
                <th className="px-4 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {detailTokens.map((row, idx) => (
                <tr key={row.kodeToken} className="text-center text-gray-800">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{row.kodeToken}</td>
                  <td className="px-4 py-2 border">{row.status}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.tipe === "Utama"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {row.tipe}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {row.aksi === "Utama" ? (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Utama
                      </span>
                    ) : row.aksi === "Token Sudah Hangus" ? (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Token Sudah Hangus
                      </span>
                    ) : (
                      <button className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200 transition">
                        {row.aksi}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
