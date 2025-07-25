import React from "react";
import { Button } from "@/components/ui/button";

interface SuccessNextSectionPopupProps {
  open: boolean;
  onClose: () => void;
  nama: string;
  pesan: string;
  sisaWaktu: string;
}

export default function SuccessNextSectionPopup({
  open,
  onClose,
  nama,
  pesan,
  sisaWaktu,
}: SuccessNextSectionPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>
        <div className="text-center mb-4">
          <h2 className="font-bold text-2xl mb-2">Selamat {nama}!</h2>
          <p className="mb-4 text-base text-gray-700 whitespace-pre-line">{pesan}</p>
          <div className="text-base text-gray-800 mb-2">Sisa Waktu : {sisaWaktu}</div>
        </div>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-10 py-2 rounded-full text-lg font-semibold shadow"
          onClick={onClose}
        >
          Ok
        </Button>
      </div>
    </div>
  );
} 