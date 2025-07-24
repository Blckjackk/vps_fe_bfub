'use client';

import { X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={24} />
      </button>

      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-green-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-600 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-red-600 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
}