'use client';

import React, { useState, useEffect } from 'react';
// Modal CRUD Tambah Soal
interface ModalTambahSoalProps {
  open: boolean;
  tipe: 'pg' | 'essay' | 'isian' | null;
  onClose: () => void;
  lombaId: string | null;
}

interface ModalTambahSoalProps {
  open: boolean;
  tipe: 'pg' | 'essay' | 'isian' | null;
  onClose: () => void;
  lombaId: string | null;
  editData?: any | null;
}

const ModalTambahSoal: React.FC<ModalTambahSoalProps> = ({ open, tipe, onClose, lombaId, editData }) => {
  const [form, setForm] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      if (editData) {
        setForm(editData);
      } else {
        setForm({});
      }
    }
    setLoading(false); // Always set loading to false when modal opens or changes
    // eslint-disable-next-line
  }, [open, tipe, editData]);

  if (!open || !tipe) return null;

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let endpoint = '';
    let body: any = {};
    let method = 'POST';
    let url = '';
    if (!lombaId) {
      setError('Cabang lomba ID tidak ditemukan. Silakan akses halaman dari menu manajemen lomba.');
      setLoading(false);
      return;
    }
    if (tipe === 'pg') {
      endpoint = 'pg';
      body = {
        lomba_id: lombaId,
        pertanyaan: form.pertanyaan,
        opsi_a: form.opsi_a,
        opsi_b: form.opsi_b,
        opsi_c: form.opsi_c,
        opsi_d: form.opsi_d,
        opsi_e: form.opsi_e,
        jawaban_benar: form.jawaban_benar,
      };
    } else if (tipe === 'essay') {
      endpoint = 'essay';
      body = {
        lomba_id: lombaId,
        pertanyaan_essay: form.pertanyaan_essay,
      };
    } else if (tipe === 'isian') {
      endpoint = 'isian-singkat';
      body = {
        lomba_id: lombaId,
        pertanyaan_isian: form.pertanyaan_isian,
        jawaban_benar: form.jawaban_benar,
      };
    }
    if (editData && editData.id) {
      // Edit mode
      method = 'PUT';
      url = `http://localhost:8000/api/admin/soal/${endpoint}/${editData.id}`;
    } else {
      // Add mode
      url = `http://localhost:8000/api/admin/soal/${endpoint}`;
    }
    try {
      const res = await fetch(url,
        {
          method,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (data.success) {
        onClose();
      } else {
        setError(data.message || (editData ? 'Gagal mengedit soal' : 'Gagal menambah soal'));
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred overlay, darker and less blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur pointer-events-auto transition-all" />
      <div className="relative z-10 w-full max-w-md mx-4 pointer-events-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl px-8 py-7 w-full">
          <button onClick={onClose} type="button" className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl focus:outline-none">&times;</button>
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-1">{editData ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
            <p className="text-gray-500 text-sm mb-3">{tipe === 'pg' ? 'Buat atau edit soal pilihan ganda' : tipe === 'essay' ? 'Buat atau edit soal essay' : 'Buat atau edit soal isian singkat'}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          {tipe === 'pg' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none" placeholder="Tulis pertanyaan..." value={form.pertanyaan||''} onChange={e=>setForm(f=>({...f, pertanyaan:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opsi A</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Opsi A" value={form.opsi_a||''} onChange={e=>setForm(f=>({...f, opsi_a:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opsi B</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Opsi B" value={form.opsi_b||''} onChange={e=>setForm(f=>({...f, opsi_b:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opsi C</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Opsi C" value={form.opsi_c||''} onChange={e=>setForm(f=>({...f, opsi_c:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opsi D</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Opsi D" value={form.opsi_d||''} onChange={e=>setForm(f=>({...f, opsi_d:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opsi E</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Opsi E" value={form.opsi_e||''} onChange={e=>setForm(f=>({...f, opsi_e:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="A/B/C/D/E" value={form.jawaban_benar||''} onChange={e=>setForm(f=>({...f, jawaban_benar:e.target.value}))} />
              </div>
            </>
          )}
          {tipe === 'essay' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan Essay</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Tulis pertanyaan essay..." value={form.pertanyaan_essay||''} onChange={e=>setForm(f=>({...f, pertanyaan_essay:e.target.value}))} />
              </div>
            </>
          )}
          {tipe === 'isian' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan Isian</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Tulis pertanyaan isian..." value={form.pertanyaan_isian||''} onChange={e=>setForm(f=>({...f, pertanyaan_isian:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Tulis jawaban benar..." value={form.jawaban_benar||''} onChange={e=>setForm(f=>({...f, jawaban_benar:e.target.value}))} />
              </div>
            </>
          )}
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <div className="flex flex-row-reverse gap-2 pt-2">
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Simpan')}</button>
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-lg font-medium bg-white hover:bg-gray-50">Batal</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText, BookOpen, PenTool, ArrowLeft } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditLombaPage() {
  // Modal tambah/edit soal
  const [modalTambah, setModalTambah] = useState<{ open: boolean; tipe: 'pg' | 'essay' | 'isian' | null; editData?: any | null }>({ open: false, tipe: null });
  const searchParams = useSearchParams();
  const router = useRouter();
  const lombaId = searchParams.get('id');

  const [lombaData, setLombaData] = useState<LombaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'pg' | 'essay' | 'isian'>('info');
  
  // Modal states
  // const [editingSoal, setEditingSoal] = useState<any>(null);
  
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
  }, [lombaId, modalTambah.open]); // refresh after modal close

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Lomba: {lombaData.lomba.nama_cabang}
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola soal PG, Essay, dan Isian Singkat (ID: {lombaId})
          </p>
        </div>
        <Link 
          href="/dashboard-admin/manajemen-lomba"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          passHref
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
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
                <button
                  onClick={() => setModalTambah({ open: true, tipe: 'pg' })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Tambah Soal PG
                </button>
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
                          <button
                            onClick={() => setModalTambah({ open: true, tipe: 'pg', editData: soal })}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSoal('pg', soal.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{soal.pertanyaan}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="font-medium">A.</span> {soal.opsi_a}</p>
                        <p><span className="font-medium">B.</span> {soal.opsi_b}</p>
                        <p><span className="font-medium">C.</span> {soal.opsi_c}</p>
                        <p><span className="font-medium">D.</span> {soal.opsi_d}</p>
                        <p><span className="font-medium">E.</span> {soal.opsi_e}</p>
                        <p className="text-green-600">
                          <span className="font-medium">Jawaban:</span> {soal.jawaban_benar}
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
                <button
                  onClick={() => setModalTambah({ open: true, tipe: 'essay' })}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus size={16} />
                  Tambah Soal Essay
                </button>
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
                          <button
                            onClick={() => setModalTambah({ open: true, tipe: 'essay', editData: soal })}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
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
                <button
                  onClick={() => setModalTambah({ open: true, tipe: 'isian' })}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus size={16} />
                  Tambah Soal Isian
                </button>
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
                          <button
                            onClick={() => setModalTambah({ open: true, tipe: 'isian', editData: soal })}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
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
        editData={modalTambah.editData}
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
