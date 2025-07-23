import { X } from 'lucide-react';

interface DialogLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DialogLogout({ isOpen, onClose, onConfirm }: DialogLogoutProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // Modal box kini diposisikan fixed di tengah layar, tanpa backdrop gelap.
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Apakah kamu yakin mau logout?
      </h2>

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