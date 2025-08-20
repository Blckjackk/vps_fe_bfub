'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText, BookOpen, PenTool, ArrowLeft } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';

// Modal CRUD Tambah Soal
interface ModalTambahSoalProps {
  open: boolean;
  tipe: 'pg' | 'essay' | 'isian' | null;
  onClose: () => void;
  lombaId: string | null;
}

const ModalTambahSoal: React.FC<ModalTambahSoalProps> = ({ open, tipe, onClose, lombaId }) => {
  if (!open || !tipe) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        {tipe === 'pg' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tambah Soal Pilihan Ganda</h3>
            {/* TODO: Ganti dengan form PG asli jika sudah ada */}
            <p className="text-gray-600">Form tambah soal PG akan ditampilkan di sini.</p>
          </div>
        )}
        {tipe === 'essay' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tambah Soal Essay</h3>
            {/* TODO: Ganti dengan form Essay asli jika sudah ada */}
            <p className="text-gray-600">Form tambah soal Essay akan ditampilkan di sini.</p>
          </div>
        )}
        {tipe === 'isian' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tambah Soal Isian Singkat</h3>
            {/* TODO: Ganti dengan form Isian asli jika sudah ada */}
            <p className="text-gray-600">Form tambah soal Isian Singkat akan ditampilkan di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Interface untuk data lomba detail
interface LombaDetail {
  id: number;
  nama_cabang: string;
  deskripsi_lomba: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
}

interface SoalPG {
  id: number;
  nomor_soal: number;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: string;
  tipe_soal: string;
  media_soal?: string;
  opsi_a_media?: string;
  opsi_b_media?: string;
  opsi_c_media?: string;
  opsi_d_media?: string;
  opsi_e_media?: string;
  deskripsi_soal?: string;
}

interface SoalEssay {
  id: number;
  nomor_soal: number;
  pertanyaan_essay: string;
}

interface SoalIsian {
  id: number;
  nomor_soal: number;
  pertanyaan_isian: string;
  jawaban_benar: string;
}

interface LombaData {
  lomba: LombaDetail;
  soal_pg: SoalPG[];
  soal_essay: SoalEssay[];
  soal_isian_singkat: SoalIsian[];
  stats: {
    total_soal_pg: number;
    total_soal_essay: number;
    total_soal_isian: number;
    total_semua_soal: number;
  };
}

// Simple confirmation dialog component
interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 text-[#B94A48]">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#B94A48] rounded-md hover:bg-[#a53e3c] disabled:opacity-50"
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditLombaPage() {
  // Modal tambah soal
  const [modalTambah, setModalTambah] = useState<{ open: boolean; tipe: 'pg' | 'essay' | 'isian' | null }>({ open: false, tipe: null });
  const searchParams = useSearchParams();
  const router = useRouter();
  const lombaId = searchParams.get('id');

  const [lombaData, setLombaData] = useState<LombaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'pg' | 'essay' | 'isian'>('info');
  
  // Modal states
  const [editingSoal, setEditingSoal] = useState<any>(null);
  
  // Confirmation dialog states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    isLoading: false
  });

  // Fetch detail lomba berdasarkan ID
  const fetchLombaDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/lomba/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setLombaData(data.data);
        setError('');
        // Debug: Log the soal data to check media fields
        console.log('Soal PG data:', data.data.soal_pg);
      } else {
        setError(data.message || 'Gagal memuat detail lomba');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan saat memuat detail lomba');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lombaId) {
      fetchLombaDetail(lombaId);
    } else {
      setError('ID Lomba tidak ditemukan');
      setLoading(false);
    }
  }, [lombaId]);

  // Handle delete soal
  const handleDeleteSoal = (type: 'pg' | 'essay' | 'isian', id: number) => {
    setConfirmationConfig({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus soal ${type.toUpperCase()} ini?`,
      onConfirm: () => deleteSoal(type, id),
      isLoading: false
    });
    setShowConfirmation(true);
  };

  // Delete soal
  const deleteSoal = async (type: 'pg' | 'essay' | 'isian', id: number) => {
    try {
      setConfirmationConfig(prev => ({ ...prev, isLoading: true }));
      
      const endpoint = type === 'pg' ? 'pg' : type === 'essay' ? 'essay' : 'isian-singkat';
      const response = await fetch(`http://localhost:8000/api/admin/soal/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh data setelah delete
        if (lombaId) {
          await fetchLombaDetail(lombaId);
        }
        setShowConfirmation(false);
      } else {
        throw new Error(data.message || 'Gagal menghapus soal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus soal');
    } finally {
      setConfirmationConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Memuat data lomba...</p>
        </div>
      </div>
    );
  }

  if (error || !lombaData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/dashboard-admin/manajemen-lomba"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Kembali ke Daftar Lomba
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
             {/* Header */}
       <div className="flex items-center gap-4 mb-8">
         <Link href="/dashboard-admin/manajemen-lomba" className="text-gray-500 hover:text-gray-800">
           <FaArrowLeft size={24} />
         </Link>
         <div>
           <h1 className="text-2xl font-semibold text-gray-800">
             Edit Lomba: {lombaData.lomba.nama_cabang}
           </h1>
         </div>
       </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'info', label: 'Info Lomba', icon: FileText },
              { key: 'pg', label: `Soal PG (${lombaData.stats.total_soal_pg})`, icon: BookOpen },
              { key: 'essay', label: `Soal Essay (${lombaData.stats.total_soal_essay})`, icon: PenTool },
              { key: 'isian', label: `Soal Isian (${lombaData.stats.total_soal_isian})`, icon: Edit }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informasi Lomba</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Cabang
                  </label>
                  <p className="text-gray-800">{lombaData.lomba.nama_cabang}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Soal
                  </label>
                  <p className="text-gray-800">{lombaData.stats.total_semua_soal} soal</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Mulai
                  </label>
                  <p className="text-gray-800">
                    {lombaData.lomba.waktu_mulai_pengerjaan ? 
                      new Date(lombaData.lomba.waktu_mulai_pengerjaan).toLocaleString('id-ID') : 
                      'Belum ditentukan'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Akhir
                  </label>
                  <p className="text-gray-800">
                    {lombaData.lomba.waktu_akhir_pengerjaan ? 
                      new Date(lombaData.lomba.waktu_akhir_pengerjaan).toLocaleString('id-ID') : 
                      'Belum ditentukan'
                    }
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <p className="text-gray-800">
                    {lombaData.lomba.deskripsi_lomba || 'Tidak ada deskripsi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pg' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Soal Pilihan Ganda</h3>
                <Link
                  href={`/dashboard-admin/manajemen-lomba/tambah-soal?id=${lombaId}&tipe=pg`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Tambah Soal PG
                </Link>
              </div>

              {lombaData.soal_pg.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Belum ada soal pilihan ganda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lombaData.soal_pg.map((soal, index) => (
                    <div key={soal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Soal {soal.nomor_soal}</h4>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard-admin/manajemen-lomba/edit-soal?lombaId=${lombaId}&soalId=${soal.id}&tipe=pg`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteSoal('pg', soal.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-gray-700 mb-2">{soal.pertanyaan}</p>
                      
                      {/* Question Image */}
                      {soal.media_soal && (
                        <div className="mb-4">
                          <img 
                            src={`http://localhost:8000/${soal.media_soal}`} 
                            alt="Soal" 
                            className="w-full max-w-md h-48 object-contain rounded-md border bg-gray-50"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {['A', 'B', 'C', 'D', 'E'].map((option) => {
                          const optionKey = option.toLowerCase();
                          const optionText = soal[`opsi_${optionKey}` as keyof SoalPG] as string;
                          const optionMedia = soal[`opsi_${optionKey}_media` as keyof SoalPG] as string;

                          return (
                            <div key={option}>
                              <p><span className="font-medium">{option}.</span> {optionText}</p>
                              {/* Show option image if exists */}
                              {optionMedia && (
                                <div className="mt-1 ml-4">
                                  <img 
                                    src={`http://localhost:8000/${optionMedia}`} 
                                    alt={`Opsi ${option}`} 
                                    className="w-24 h-24 object-contain rounded border bg-gray-50"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <p className="text-green-600 md:col-span-2">
                          <span className="font-medium">Jawaban:</span> {soal.jawaban_benar}
                          <span className="ml-4 text-gray-500">
                            (Tipe: {soal.tipe_soal === 'gambar' ? 'Gambar' : 'Teks'})
                          </span>
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'essay' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Soal Essay</h3>
                <Link
                  href={`/dashboard-admin/manajemen-lomba/tambah-soal?id=${lombaId}&tipe=essay`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus size={16} />
                  Tambah Soal Essay
                </Link>
              </div>

              {lombaData.soal_essay.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PenTool size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Belum ada soal essay</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lombaData.soal_essay.map((soal, index) => (
                    <div key={soal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Soal {soal.nomor_soal}</h4>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard-admin/manajemen-lomba/edit-soal?lombaId=${lombaId}&soalId=${soal.id}&tipe=essay`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteSoal('essay', soal.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{soal.pertanyaan_essay}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'isian' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Soal Isian Singkat</h3>
                <Link
                  href={`/dashboard-admin/manajemen-lomba/tambah-soal?id=${lombaId}&tipe=isian`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus size={16} />
                  Tambah Soal Isian
                </Link>
              </div>

              {lombaData.soal_isian_singkat.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Edit size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Belum ada soal isian singkat</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lombaData.soal_isian_singkat.map((soal, index) => (
                    <div key={soal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Soal {soal.nomor_soal}</h4>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard-admin/manajemen-lomba/edit-soal?lombaId=${lombaId}&soalId=${soal.id}&tipe=isian`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteSoal('isian', soal.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{soal.pertanyaan_isian}</p>
                      <p className="text-green-600">
                        <span className="font-medium">Jawaban:</span> {soal.jawaban_benar}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Soal */}
      <ModalTambahSoal
        open={modalTambah.open}
        tipe={modalTambah.tipe}
        onClose={() => setModalTambah({ open: false, tipe: null })}
        lombaId={lombaId}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        onConfirm={confirmationConfig.onConfirm}
        onCancel={() => setShowConfirmation(false)}
        isLoading={confirmationConfig.isLoading}
      />
    </div>
  );
}
