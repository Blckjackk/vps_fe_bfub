import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TokenPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (token: string) => void;
  message?: string;
  errorMessage?: string;
}

const defaultMessage =
  "Harap meminta token baru kepada panitia untuk dapat mengerjakan soal kembali.";

export default function TokenPopup({ open, onClose, onSubmit, message, errorMessage }: TokenPopupProps) {
  const [token, setToken] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4 relative">
        <h2 className="text-2xl font-bold text-center mb-2">Masukkan Token Baru</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          {message || defaultMessage}
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Masukkan Token
          </label>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Masukkan Token"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48]"
          />
        </div>
        
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </p>
        )}
        
        <Button
          className="w-full bg-[#B94A48] hover:bg-[#A43D3B] text-white text-lg font-semibold py-3 rounded-lg"
          onClick={() => onSubmit(token)}
          disabled={!token.trim()}
        >
          Mulai
        </Button>
      </div>
    </div>
  );
}
