import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TokenPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (token: string) => void;
  message?: string;
}

const defaultMessage =
  "Harap meminta token baru kepada panitia untuk dapat mengerjakan soal kembali.";

export default function TokenPopup({ open, onClose, onSubmit, message }: TokenPopupProps) {
  const [token, setToken] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-2">Masukan Token Baru</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          {message || defaultMessage}
        </p>
        <input
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Masukkan Token"
          className="w-full p-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48]"
        />
        <Button
          className="w-full bg-[#B94A48] hover:bg-[#A43D3B] text-white text-lg font-semibold shadow"
          onClick={() => onSubmit(token)}
        >
          Mulai
        </Button>
      </div>
    </div>
  );
}
