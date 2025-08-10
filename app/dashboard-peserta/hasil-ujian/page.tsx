"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User, Book } from 'lucide-react';
import Link from 'next/link';
// import { withAuth } from '@/lib/auth';

interface HasilUjian {
  id: number;
  peserta_id: number;
  cabang_lomba_id: number;
  cabang_lomba_name: string;
  nilai_pg: number;
  nilai_essay: number;
  nilai_isian_singkat: number;
  nilai_total: number;
  status: string;
  waktu_mulai: string;
  waktu_selesai: string;
  durasi_ujian: number;
}

function HasilUjianPage() {
  const [hasilUjian, setHasilUjian] = useState<HasilUjian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHasilUjian();
  }, []);

  const fetchHasilUjian = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch('http://localhost:8000/api/peserta/hasil-ujian', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHasilUjian(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching hasil ujian:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selesai':
        return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" />Selesai</Badge>;
      case 'berlangsung':
        return <Badge className="bg-yellow-500"><Clock className="w-4 h-4 mr-1" />Berlangsung</Badge>;
      default:
        return <Badge variant="secondary"><XCircle className="w-4 h-4 mr-1" />Belum Mulai</Badge>;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hasil Ujian</h1>
        <Link href="/dashboard-peserta">
          <Button variant="outline">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      {hasilUjian.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Belum Ada Hasil Ujian
            </h3>
            <p className="text-gray-500 mb-4">
              Anda belum mengikuti ujian apapun atau hasil ujian belum tersedia.
            </p>
            <Link href="/dashboard-peserta">
              <Button>
                Mulai Ujian
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {hasilUjian.map((hasil) => (
            <Card key={hasil.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-blue-600">
                      {hasil.cabang_lomba_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        ID Peserta: {hasil.peserta_id}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(hasil.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nilai Section */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Nilai</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pilihan Ganda:</span>
                        <span className="font-medium">{hasil.nilai_pg || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Essay:</span>
                        <span className="font-medium">{hasil.nilai_essay || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Isian Singkat:</span>
                        <span className="font-medium">{hasil.nilai_isian_singkat || 0}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-700">Total:</span>
                        <span className="font-bold text-lg text-blue-600">
                          {hasil.nilai_total || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Ujian Section */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Informasi Ujian</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Waktu Mulai:</span>
                        <span className="text-sm">
                          {hasil.waktu_mulai ? new Date(hasil.waktu_mulai).toLocaleString() : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Waktu Selesai:</span>
                        <span className="text-sm">
                          {hasil.waktu_selesai ? new Date(hasil.waktu_selesai).toLocaleString() : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Durasi:</span>
                        <span className="text-sm">
                          {hasil.durasi_ujian ? formatDuration(hasil.durasi_ujian) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {hasil.status === 'selesai' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      Lihat Detail Jawaban
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Protect this page with peserta-only access
// const ProtectedHasilUjianPage = withAuth(HasilUjianPage, ['peserta']);
export default HasilUjianPage;
