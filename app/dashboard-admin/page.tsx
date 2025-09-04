/**
 * File                         : page.tsx (landing page for admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin
 * Description         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            Icon={Calendar}
            title="Belum Mulai Ujian"
            value={loading ? 'Loading...' : (pesertaStats?.belum_mulai?.toString() || '0')}
            iconColor="text-gray-500"
          />
        </div>   : Landing dashboard untuk admin aplikasi website perlombaan BFUB.
 *                                Menampilkan ringkasan data lomba, statistik peserta, dan navigasi fitur admin.
 * Functional                   :
 *      - Menampilkan statistik ringkasan (misal: jumlah lomba, total peserta).
 *      - Menampilkan daftar pendaftar terbaru atau aktivitas terakhir.
 *      - Menyediakan navigasi ke fitur-fitur admin lainnya.
 *      - Menampilkan grafik dan chart untuk visualisasi data.
 * API Methods      / Endpoints :
 *      - GET       api/stats/lomba            (Untuk mendapatkan data statistik jumlah lomba)
 *      - GET       api/stats/peserta          (Untuk mendapatkan data statistik jumlah peserta)
 *      - GET       api/stats/pendaftaran      (Untuk mendapatkan data statistik jumlah pendaftaran)
 *      - GET       api/stats/nilai            (Untuk mendapatkan data statistik hasil/nilai yang sudah masuk)
 * Table Activities             :
 *      - SELECT COUNT(*) lomba dari tabel cabang_lomba
 *      - SELECT COUNT(*) peserta dari tabel peserta
 *      - SELECT COUNT(*) pendaftaran dari tabel pendaftaran
 *      - SELECT COUNT(*) nilai dari tabel nilai
 *      - SELECT COUNT(*) token aktif dari tabel token
 *      - SELECT recent activities untuk dashboard feed
 * Anchor Links                 :
 *      - daftar_lomba.tsx      (untuk mengarahkan ke manajemen lomba)
 *      - data_peserta.tsx      (untuk mengarahkan ke manajemen peserta)
 *      - hasil_lomba.tsx       (untuk mengarahkan ke hasil lomba)
 *      - token_lomba.tsx       (untuk mengarahkan ke manajemen token)
 */


'use client';

import StatCard from '@/components/dashboard-admin/StatCard';
import { Users, LayoutGrid, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { useState, useEffect, useRef} from 'react';
import { withAuth } from '@/lib/auth';
import { toast, Toaster } from 'sonner';
import { API_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Interface untuk stats peserta yang REAL dari database
interface PesertaStats {
  total_peserta: number;
  belum_mulai: number;
  sedang_ujian: number;
  selesai: number;
  per_cabang: Record<string, number>;
}

// Interface untuk cabang lomba yang REAL dari database
interface CabangLomba {
  id: number;
  nama_cabang: string;
  deskripsi_lomba: string;
  status?: string;
  total_peserta?: number; // Akan dihitung dari stats
}

interface OnlinePeserta {
  id: number;
  nama_lengkap: string;
  email: string;
  status_ujian: string;
  lomba: string;
  last_activity: string;
  duration_online: string;
}

function AdminDashboardPage() {
  const [pesertaStats, setPesertaStats] = useState<PesertaStats | null>(null);
  const [cabangLomba, setCabangLomba] = useState<CabangLomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const toastShownRef = useRef(false);

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toastShownRef.current) {
      toast.success('Dashboard berhasil dimuat!');
      toastShownRef.current = true;
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      
      console.log('=== DASHBOARD DEBUG INFO ===');
      console.log('API_URL:', API_URL);
      console.log('Token available:', !!token);
      
      // Fetch data REAL dari endpoint yang sama dengan data-peserta
      const pesertaUrl = `${API_URL}/api/admin/peserta?all=true&per_page=9999&page=1`;
      const lombaUrl = `${API_URL}/api/lomba`;
      
      console.log('Fetching peserta from:', pesertaUrl);
      console.log('Fetching lomba from:', lombaUrl);
      
      const [pesertaRes, lombaRes] = await Promise.all([
        fetch(pesertaUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => {
          console.error('Peserta fetch error:', err);
          return { ok: false, status: 500 };
        }),
        fetch(lombaUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => {
          console.error('Lomba fetch error:', err);
          return { ok: false, status: 500 };
        })
      ]);

      console.log('Peserta response:', { ok: pesertaRes.ok, status: pesertaRes.status });
      console.log('Lomba response:', { ok: lombaRes.ok, status: lombaRes.status });

      // Process peserta data - DATA REAL dari endpoint yang sama dengan data-peserta
      if (pesertaRes.ok && 'json' in pesertaRes) {
        try {
          const pesertaData = await pesertaRes.json();
          console.log('Peserta API Response:', pesertaData);
          
          if (pesertaData.success) {
            // Gunakan stats langsung dari API yang sama dengan data-peserta
            const realStats = pesertaData.stats;
            console.log('Real stats from API:', realStats);
            
            setPesertaStats(realStats);
            
            toast.success('Data berhasil dimuat dari database!');
          } else {
            console.log('Peserta API returned success=false:', pesertaData.message);
            toast.error('Gagal memuat data peserta: ' + pesertaData.message);
          }
        } catch (jsonError) {
          console.error('Error parsing peserta JSON:', jsonError);
        }
      } else {
        console.log('Peserta API request failed:', pesertaRes.status);
        toast.error('Endpoint peserta tidak dapat diakses');
      }

      // Process lomba data - DATA REAL dari database
      if (lombaRes.ok && 'json' in lombaRes) {
        try {
          const lombaData = await lombaRes.json();
          console.log('Lomba API Response:', lombaData);
          
          if (lombaData.success && lombaData.data) {
            const lombaList = Array.isArray(lombaData.data) ? lombaData.data : [lombaData.data];
            
            // Konversi ke format CabangLomba dan hitung total peserta per cabang
            const realCabangLomba: CabangLomba[] = lombaList.map((lomba: any) => ({
              id: lomba.id,
              nama_cabang: lomba.nama_lomba || lomba.nama_cabang || 'Unknown',
              deskripsi_lomba: lomba.deskripsi_lomba || lomba.deskripsi || 'Tidak ada deskripsi',
              status: lomba.status || 'aktif',
              total_peserta: pesertaStats?.per_cabang?.[lomba.nama_lomba || lomba.nama_cabang] || 0
            }));
            
            setCabangLomba(realCabangLomba);
            console.log('Real cabang lomba set:', realCabangLomba);
          } else {
            console.log('Lomba API returned success=false or no data');
          }
        } catch (jsonError) {
          console.error('Error parsing lomba JSON:', jsonError);
        }
      } else {
        console.log('Lomba API request failed:', lombaRes.status);
      }

      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Selamat Datang Admin!</h1>
        <div className="text-sm text-gray-500">
          Last update: {lastUpdate}
          <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Main Stats - HANYA DATA REAL */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            Icon={Users}
            title="Total Peserta"
            value={loading ? 'Loading...' : (pesertaStats?.total_peserta?.toLocaleString() || '0')}
            iconColor="text-red-500"
          />
          <StatCard
            Icon={LayoutGrid}
            title="Cabang Lomba"
            value={loading ? 'Loading...' : cabangLomba.length.toString()}
            iconColor="text-blue-500"
          />
          <StatCard
            Icon={CheckCircle2}
            title="Ujian Selesai"
            value={loading ? 'Loading...' : (pesertaStats?.selesai?.toString() || '0')}
            iconColor="text-green-600"
          />
          <StatCard
            Icon={Clock}
            title="Sedang Ujian"
            value={loading ? 'Loading...' : (pesertaStats?.sedang_ujian?.toString() || '0')}
            iconColor="text-orange-500"
          />
        </div>
      </section>

      {/* Additional Stats - HANYA DATA REAL */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Tambahan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            Icon={Calendar}
            title="Belum Mulai Ujian"
            value={loading ? 'Loading...' : (pesertaStats?.belum_mulai?.toString() || '0')}
            iconColor="text-gray-500"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-8">
        {/* Lomba Information - DATA REAL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              Informasi Cabang Lomba
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p>Memuat data lomba...</p>
              ) : cabangLomba.length > 0 ? (
                cabangLomba.map((lomba: CabangLomba) => (
                  <div key={lomba.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{lomba.nama_cabang}</h3>
                      <p className="text-sm text-gray-600">
                        {lomba.total_peserta || 0} peserta terdaftar
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lomba.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lomba.status || 'aktif'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada data lomba tersedia</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

// Protect this page with admin-only access
export default withAuth(AdminDashboardPage, ['admin']);