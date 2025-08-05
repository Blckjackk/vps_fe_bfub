'use client';

import { Check, X } from 'lucide-react';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessDialog({
  isOpen,
  onClose,
  title,
  message,
}: SuccessDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-center text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#B94A48] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
