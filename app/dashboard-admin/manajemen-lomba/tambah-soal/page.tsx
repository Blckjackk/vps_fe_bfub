'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TambahSoalProps {
  jenisSoal: 'pg' | 'essay' | 'isian';
  lombaId: string;
}

export default function TambahSoalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jenisSoal = searchParams.get('tipe') as 'pg' | 'essay' | 'isian';
  const lombaId = searchParams.get('id');

  // Tipe soal (teks/gambar) berbeda dengan jenis soal (pg/essay/isian)
  const [formatSoal, setFormatSoal] = useState<'text' | 'gambar'>('text');
  
  const [tipeSoal, setTipeSoal] = useState<'text' | 'gambar'>('text');
  const [soal, setSoal] = useState('');
  const [mediaSoal, setMediaSoal] = useState<File | null>(null);
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [opsiE, setOpsiE] = useState('');
  const [opsiAMedia, setOpsiAMedia] = useState<File | null>(null);
  const [opsiBMedia, setOpsiBMedia] = useState<File | null>(null);
  const [opsiCMedia, setOpsiCMedia] = useState<File | null>(null);
  const [opsiDMedia, setOpsiDMedia] = useState<File | null>(null);
  const [opsiEMedia, setOpsiEMedia] = useState<File | null>(null);
  const [jawabanBenar, setJawabanBenar] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Preview URLs untuk gambar yang diupload
  const [mediaSoalPreview, setMediaSoalPreview] = useState<string>('');
  const [opsiAMediaPreview, setOpsiAMediaPreview] = useState<string>('');
  const [opsiBMediaPreview, setOpsiBMediaPreview] = useState<string>('');
  const [opsiCMediaPreview, setOpsiCMediaPreview] = useState<string>('');
  const [opsiDMediaPreview, setOpsiDMediaPreview] = useState<string>('');
  const [opsiEMediaPreview, setOpsiEMediaPreview] = useState<string>('');

  // Handle file upload dan preview
  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (url: string) => void
  ) => {
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setFile(null);
      setPreview('');
    }
  };

  if (!jenisSoal || !lombaId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Parameter tidak lengkap</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cabang_lomba_id', lombaId);

      // Handle different question types
      if (jenisSoal === 'pg') {
        // For PG: validate at least text or image is provided
        if (!soal && !mediaSoal) {
          alert('Mohon isi setidaknya teks soal atau upload gambar soal');
          return;
        }

        formData.append('tipe_soal', formatSoal);
        formData.append('pertanyaan', soal || '');
        formData.append('jawaban_benar', jawabanBenar);
        
        if (mediaSoal) {
          formData.append('media_soal', mediaSoal);
        }
        
        // Add options and their media based on format
        formData.append('opsi_a', opsiA);
        formData.append('opsi_b', opsiB);
        formData.append('opsi_c', opsiC);
        formData.append('opsi_d', opsiD);
        formData.append('opsi_e', opsiE);
        
        if (formatSoal === 'gambar') {
          if (opsiAMedia) formData.append('opsi_a_media', opsiAMedia);
          if (opsiBMedia) formData.append('opsi_b_media', opsiBMedia);
          if (opsiCMedia) formData.append('opsi_c_media', opsiCMedia);
          if (opsiDMedia) formData.append('opsi_d_media', opsiDMedia);
          if (opsiEMedia) formData.append('opsi_e_media', opsiEMedia);
        }
      } 
      else if (jenisSoal === 'essay') {
        // For Essay: only text question
        if (!soal) {
          alert('Mohon isi pertanyaan essay');
          return;
        }
        formData.append('pertanyaan_essay', soal);
      }
      else if (jenisSoal === 'isian') {
        // For Isian: text question and answer
        if (!soal) {
          alert('Mohon isi pertanyaan isian singkat');
          return;
        }
        if (!jawabanBenar) {
          alert('Mohon isi jawaban benar');
          return;
        }
        formData.append('pertanyaan_isian', soal);
        formData.append('jawaban_benar', jawabanBenar);
      }

      const endpoint = jenisSoal === 'pg' 
        ? 'pg'
        : jenisSoal === 'essay'
        ? 'essay'
        : 'isian-singkat';

      const response = await fetch(`http://localhost:8000/api/admin/soal/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Soal berhasil ditambahkan!');
        router.push(`/dashboard-admin/manajemen-lomba/edit?id=${lombaId}`);
      } else {
        // Show detailed error message
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          alert(`Validation Error:\n${errorMessages}`);
        } else {
          alert(data.message || 'Gagal menambah soal');
        }
        console.error('Error response:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Terjadi kesalahan saat menambah soal: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Tambah Soal {jenisSoal.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-600">
              Tambahkan soal baru untuk ujian
            </p>
          </div>
          <Link 
            href={`/dashboard-admin/manajemen-lomba/edit?id=${lombaId}`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PG: Tipe Soal */}
            {jenisSoal === 'pg' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Soal
                  </label>
                  <select
                    value={formatSoal}
                    onChange={(e) => setFormatSoal(e.target.value as 'text' | 'gambar')}
                    className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="text">Teks</option>
                    <option value="gambar">Gambar</option>
                  </select>
                </div>

                {/* PG: Soal Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soal (Text)
                  </label>
                  <textarea
                    value={soal}
                    onChange={(e) => setSoal(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    placeholder="Tuliskan pertanyaan soal di sini..."
                  />
                </div>

                {/* PG: Soal Gambar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soal (Gambar - Opsional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(
                      e.target.files?.[0] || null,
                      setMediaSoal,
                      setMediaSoalPreview
                    )}
                    className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {mediaSoalPreview && (
                    <div className="mt-2">
                      <img
                        src={mediaSoalPreview}
                        alt="Preview soal"
                        className="max-h-40 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Essay: Soal Text Only */}
            {jenisSoal === 'essay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soal Essay
                </label>
                <textarea
                  value={soal}
                  onChange={(e) => setSoal(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Tuliskan pertanyaan essay di sini..."
                  required
                />
              </div>
            )}

            {/* Isian: Soal Text Only */}
            {jenisSoal === 'isian' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soal Isian Singkat
                </label>
                <textarea
                  value={soal}
                  onChange={(e) => setSoal(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Tuliskan pertanyaan isian singkat di sini..."
                  required
                />
              </div>
            )}

            {/* Opsi untuk Pilihan Ganda */}
            {jenisSoal === 'pg' && (
              <div className="space-y-3">
                {['A', 'B', 'C', 'D', 'E'].map((opsi) => (
                  <div key={opsi}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opsi {opsi}
                    </label>
                    {formatSoal === 'text' ? (
                      <textarea
                        value={
                          opsi === 'A' ? opsiA :
                          opsi === 'B' ? opsiB :
                          opsi === 'C' ? opsiC :
                          opsi === 'D' ? opsiD :
                          opsiE
                        }
                        onChange={(e) => {
                          if (opsi === 'A') setOpsiA(e.target.value);
                          if (opsi === 'B') setOpsiB(e.target.value);
                          if (opsi === 'C') setOpsiC(e.target.value);
                          if (opsi === 'D') setOpsiD(e.target.value);
                          if (opsi === 'E') setOpsiE(e.target.value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder={`Tuliskan opsi ${opsi} di sini...`}
                        required
                      />
                    ) : (
                      <textarea
                        value={
                          opsi === 'A' ? opsiA :
                          opsi === 'B' ? opsiB :
                          opsi === 'C' ? opsiC :
                          opsi === 'D' ? opsiD :
                          opsiE
                        }
                        onChange={(e) => {
                          if (opsi === 'A') setOpsiA(e.target.value);
                          if (opsi === 'B') setOpsiB(e.target.value);
                          if (opsi === 'C') setOpsiC(e.target.value);
                          if (opsi === 'D') setOpsiD(e.target.value);
                          if (opsi === 'E') setOpsiE(e.target.value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder={`Teks tambahan untuk opsi ${opsi} (opsional)`}
                      />
                    )}
                    {/* File upload untuk opsi */}
                    {formatSoal === 'gambar' && (
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            switch(opsi) {
                              case 'A': handleFileChange(file, setOpsiAMedia, setOpsiAMediaPreview); break;
                              case 'B': handleFileChange(file, setOpsiBMedia, setOpsiBMediaPreview); break;
                              case 'C': handleFileChange(file, setOpsiCMedia, setOpsiCMediaPreview); break;
                              case 'D': handleFileChange(file, setOpsiDMedia, setOpsiDMediaPreview); break;
                              case 'E': handleFileChange(file, setOpsiEMedia, setOpsiEMediaPreview); break;
                            }
                          }}
                          className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {/* Preview gambar */}
                        {(() => {
                          const preview = 
                            opsi === 'A' ? opsiAMediaPreview :
                            opsi === 'B' ? opsiBMediaPreview :
                            opsi === 'C' ? opsiCMediaPreview :
                            opsi === 'D' ? opsiDMediaPreview :
                            opsiEMediaPreview;
                          
                          return preview && (
                            <div className="mt-2">
                              <img
                                src={preview}
                                alt={`Preview opsi ${opsi}`}
                                className="max-h-32 rounded-md"
                              />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jawaban Benar
                  </label>
                  <select
                    value={jawabanBenar}
                    onChange={(e) => setJawabanBenar(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Jawaban</option>
                    {['A', 'B', 'C', 'D', 'E'].map((opsi) => (
                      <option key={opsi} value={opsi}>
                        Opsi {opsi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Jawaban Benar untuk Isian Singkat */}
            {jenisSoal === 'isian' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jawaban Benar
                </label>
                <input
                  type="text"
                  value={jawabanBenar}
                  onChange={(e) => setJawabanBenar(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 text-sm"
                onClick={() => router.push(`/dashboard-admin/manajemen-lomba/edit?id=${lombaId}`)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-black hover:bg-gray-800"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
