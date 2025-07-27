'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function EditLombaPage() {
  const searchParams = useSearchParams();
  const lombaId = searchParams.get('id');

  const [lombaData, setLombaData] = useState<LombaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'pg' | 'essay' | 'isian'>('info');

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
  }, [lombaId]);

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
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
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
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
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
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
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
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
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
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
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
    </div>
  );
}

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

export default function EditLombaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lombaId = searchParams.get('id');

  const [lombaData, setLombaData] = useState<LombaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'pg' | 'essay' | 'isian'>('info');
  
  // Modal states
  const [showPGForm, setShowPGForm] = useState(false);
  const [showEssayForm, setShowEssayForm] = useState(false);
  const [showIsianForm, setShowIsianForm] = useState(false);
  const [editingSoal, setEditingSoal] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
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
  }, [lombaId]);

  // Handle tambah soal PG
  const handleAddPG = () => {
    setEditingSoal(null);
    setShowPGForm(true);
  };

  // Handle edit soal PG
  const handleEditPG = (soal: SoalPG) => {
    setEditingSoal(soal);
    setShowPGForm(true);
  };

  // Handle tambah soal Essay
  const handleAddEssay = () => {
    setEditingSoal(null);
    setShowEssayForm(true);
  };

  // Handle edit soal Essay
  const handleEditEssay = (soal: SoalEssay) => {
    setEditingSoal(soal);
    setShowEssayForm(true);
  };

  // Handle tambah soal Isian
  const handleAddIsian = () => {
    setEditingSoal(null);
    setShowIsianForm(true);
  };

  // Handle edit soal Isian
  const handleEditIsian = (soal: SoalIsian) => {
    setEditingSoal(soal);
    setShowIsianForm(true);
  };

  // Handle delete soal
  const handleDeleteSoal = (type: 'pg' | 'essay' | 'isian', id: number) => {
    setDeletingId(id);
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

  // Handle form success
  const handleFormSuccess = () => {
    setShowPGForm(false);
    setShowEssayForm(false);
    setShowIsianForm(false);
    setEditingSoal(null);
    
    // Refresh data
    if (lombaId) {
      fetchLombaDetail(lombaId);
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
            Kelola soal PG, Essay, dan Isian Singkat
          </p>
        </div>
        <Link 
          href="/dashboard-admin/manajemen-lomba"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
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
                  onClick={handleAddPG}
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
                            onClick={() => handleEditPG(soal)}
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
                  onClick={handleAddEssay}
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
                            onClick={() => handleEditEssay(soal)}
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
                  onClick={handleAddIsian}
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
                            onClick={() => handleEditIsian(soal)}
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

      {/* Modal Forms */}
      {showPGForm && (
        <SoalPGForm
          isOpen={showPGForm}
          onClose={() => setShowPGForm(false)}
          onSuccess={handleFormSuccess}
          cabangLombaId={lombaData.lomba.id}
          editData={editingSoal}
        />
      )}

      {showEssayForm && (
        <SoalEssayForm
          isOpen={showEssayForm}
          onClose={() => setShowEssayForm(false)}
          onSuccess={handleFormSuccess}
          cabangLombaId={lombaData.lomba.id}
          editData={editingSoal}
        />
      )}

      {showIsianForm && (
        <SoalIsianForm
          isOpen={showIsianForm}
          onClose={() => setShowIsianForm(false)}
          onSuccess={handleFormSuccess}
          cabangLombaId={lombaData.lomba.id}
          editData={editingSoal}
        />
      )}

      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          onConfirm={confirmationConfig.onConfirm}
          onCancel={() => setShowConfirmation(false)}
          isLoading={confirmationConfig.isLoading}
        />
      )}
    </div>
  );
}
