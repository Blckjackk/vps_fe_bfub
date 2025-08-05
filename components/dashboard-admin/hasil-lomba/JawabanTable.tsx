'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, X } from 'lucide-react';
import { StatusAlertDialog } from '@/components/dashboard-admin/token-lomba/StatusAlertDialog';

type Jawaban = {
  id: number;
  soal: string;
  jawabanPeserta: string;
  jawabanBenar?: string; // Untuk isian singkat
  benar?: boolean; // Untuk isian singkat
  filePath?: string; // Untuk essay
  fileName?: string; // Untuk essay
  waktuJawab?: string;
  bobot: number;
  score: number;
  isChecked: boolean;
  jawabanId?: number; // ID dari jawaban di database untuk update
};

interface JawabanTableProps {
  title: string;
  data: Jawaban[];
  tipeSoal: 'esai' | 'singkat';
  onUpdateNilai?: (id: number, nilai: number) => void; // Callback untuk update nilai
}

interface ModalPenilaianProps {
  isOpen: boolean;
  onClose: () => void;
  jawaban: Jawaban;
  tipeSoal: 'esai' | 'singkat';
  onSaveNilai?: (id: number, nilai: number) => void; // Callback untuk save nilai
}

function ModalPenilaian({ isOpen, onClose, jawaban, tipeSoal, onSaveNilai }: ModalPenilaianProps) {
  const [nilai, setNilai] = useState(jawaban.score);
  const [loading, setLoading] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'success'
  });

  if (!isOpen) return null;

  const handleSaveNilai = async () => {
    if (nilai < 0 || nilai > jawaban.bobot) {
      setStatusAlert({
        isOpen: true,
        title: 'Peringatan',
        message: `Nilai harus antara 0 - ${jawaban.bobot}`,
        variant: 'error'
      });
      return;
    }

    if (!jawaban.jawabanId) {
      setStatusAlert({
        isOpen: true,
        title: 'Peringatan',
        message: 'Tidak ada jawaban untuk dinilai',
        variant: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Tentukan endpoint berdasarkan tipe soal
      const endpoint = tipeSoal === 'esai' 
        ? `http://localhost:8000/api/admin/nilai/essay/${jawaban.jawabanId}`
        : `http://localhost:8000/api/admin/nilai/isian-singkat/${jawaban.jawabanId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nilai })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Nilai berhasil disimpan:', data);
        
        // Update nilai di parent component
        if (onSaveNilai) {
          onSaveNilai(jawaban.id, nilai);
        }
        
        setStatusAlert({
          isOpen: true,
          title: 'Berhasil',
          message: 'Nilai berhasil disimpan',
          variant: 'success'
        });
        
        onClose();
      } else {
        setStatusAlert({
          isOpen: true,
          title: 'Gagal',
          message: data.message || 'Gagal menyimpan nilai',
          variant: 'error'
        });
      }
      
    } catch (error) {
      console.error('Error saving nilai:', error);
      setStatusAlert({
        isOpen: true,
        title: 'Error',
        message: 'Gagal menyimpan nilai',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Penilaian Soal No. {jawaban.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soal:</label>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">{jawaban.soal}</p>
            </div>
          </div>

          {tipeSoal === 'singkat' && jawaban.jawabanBenar && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban Benar:</label>
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">{jawaban.jawabanBenar}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban Peserta:</label>
            <div className="p-3 bg-blue-50 rounded-md">
              {jawaban.jawabanPeserta ? (
                <p className="text-sm text-blue-800">{jawaban.jawabanPeserta}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Tidak dijawab</p>
              )}
            </div>
          </div>

          {jawaban.filePath && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Lampiran:</label>
              <a 
                href={jawaban.filePath} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {jawaban.fileName || 'Download File'}
              </a>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nilai (Max: {jawaban.bobot})
            </label>
            <input
              type="number"
              min="0"
              max={jawaban.bobot}
              value={nilai}
              onChange={(e) => setNilai(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={handleSaveNilai}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Nilai'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Alert Dialog */}
      <StatusAlertDialog
        isOpen={statusAlert.isOpen}
        onClose={() => setStatusAlert(prev => ({ ...prev, isOpen: false }))}
        title={statusAlert.title}
        message={statusAlert.message}
        variant={statusAlert.variant}
      />
    </div>
  );
}

export default function JawabanTable({ title, data, tipeSoal, onUpdateNilai }: JawabanTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJawaban, setSelectedJawaban] = useState<Jawaban | null>(null);
  const [tableData, setTableData] = useState<Jawaban[]>(data);

  // Update tableData when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleOpenModal = (jawaban: Jawaban) => {
    setSelectedJawaban(jawaban);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJawaban(null);
  };

  const handleSaveNilai = (id: number, nilai: number) => {
    // Update local state
    setTableData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, score: nilai } : item
      )
    );
    
    // Call parent callback if provided
    if (onUpdateNilai) {
      onUpdateNilai(id, nilai);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" /></th>
                <th scope="col" className="px-6 py-3">No.</th>
                <th scope="col" className="px-6 py-3">Soal</th>
                <th scope="col" className="px-6 py-3">Jawaban Peserta</th>
                <th scope="col" className="px-6 py-3">Bobot</th>
                <th scope="col" className="px-6 py-3">Score</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" checked={item.isChecked} readOnly /></td>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={item.soal}>{item.soal}</td>
                  <td className="px-6 py-4">
                    {item.jawabanPeserta ? (
                      <span className="max-w-xs truncate block" title={item.jawabanPeserta}>
                        {item.jawabanPeserta}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Tidak dijawab</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{item.bobot}</td>
                  <td className="px-6 py-4 font-bold">{item.score}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Beri Penilaian"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJawaban && (
        <ModalPenilaian
          isOpen={modalOpen}
          onClose={handleCloseModal}
          jawaban={selectedJawaban}
          tipeSoal={tipeSoal}
          onSaveNilai={handleSaveNilai}
        />
      )}
    </>
  );
}