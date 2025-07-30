"use client";

import { X } from "lucide-react";

interface LogoutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function LogoutConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Logout",
  message = "Apakah Anda yakin ingin keluar dari akun peserta?",
}: LogoutConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6 text-center">{message}</p>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-[#B94A48] text-white hover:bg-[#ac5555] transition-colors"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
