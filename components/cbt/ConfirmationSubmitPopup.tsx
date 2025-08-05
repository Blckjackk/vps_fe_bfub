import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationSubmitPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  soalPGDikerjakan: number;
  soalSingkatDikerjakan: number;
  soalEsaiDikerjakan: number;
  totalSoalPG: number;
  totalSoalSingkat: number;
  totalSoalEsai: number;
  sisaWaktu: string;
}

export default function ConfirmationSubmitPopup({
  open,
  onClose,
  onConfirm,
  soalPGDikerjakan,
  soalSingkatDikerjakan,
  soalEsaiDikerjakan,
  totalSoalPG,
  totalSoalSingkat,
  totalSoalEsai,
  sisaWaktu,
}: ConfirmationSubmitPopupProps) {
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
          <p className="font-semibold text-lg mb-2">
            Pastikan semua jawaban sudah diisi. Apakah Anda yakin ingin menyelesaikan ujian ini sekarang?
          </p>
          <div className="text-sm text-gray-700 mt-4 space-y-1">
            {totalSoalPG > 0 && (
              <div>Soal Pilihan Ganda: {soalPGDikerjakan}/{totalSoalPG}</div>
            )}
            {totalSoalSingkat > 0 && (
              <div>Soal Jawaban Singkat: {soalSingkatDikerjakan}/{totalSoalSingkat}</div>
            )}
            {totalSoalEsai > 0 && (
              <div>Soal Esai: {soalEsaiDikerjakan}/{totalSoalEsai}</div>
            )}
            <div className="pt-2">Sisa Waktu: {sisaWaktu}</div>
          </div>
        </div>
        <div className="flex gap-6 mt-6 w-full justify-center">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-full text-lg font-semibold shadow"
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button
            className="bg-[#B94A48] hover:bg-[#A43D3B] text-white px-8 py-2 rounded-full text-lg font-semibold shadow"
            onClick={onClose}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
} 