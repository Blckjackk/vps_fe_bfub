/**
 * File                         : page.tsx (landing page for admin dashboard)
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin
 * Description                  : Landing dashboard untuk admin aplikasi website perlombaan BFUB.
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
import { Users, LayoutGrid, Trophy, Clock, CheckCircle2, FileText } from 'lucide-react';
import { useState, useEffect, useRef} from 'react';
import { withAuth } from '@/lib/auth';
import { toast, Toaster } from 'sonner';
import { API_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats  {
  total_peserta: number;
  total_lomba: number;
  peserta_selesai: number;
  peserta_belum_mulai: number;
  token_aktif: number;
  peserta_sedang_ujian: number;
}

interface LombaInfo {
  id: number;
  nama_lomba: string;
  total_peserta: number;
  status: 'aktif' | 'nonaktif' | 'selesai';
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
  const [stats, setStats] = useState<DashboardStats>({
    total_peserta: 0,
    total_lomba: 0,
    peserta_selesai: 0,
    peserta_belum_mulai: 0,
    token_aktif: 0,
    peserta_sedang_ujian: 0
  });
  const [lombaInfo, setLombaInfo] = useState<LombaInfo[]>([]);
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
      
      // Fetch data dari endpoints yang SUDAH ADA dan WORKING
      const lombaUrl = `${API_URL}/api/lomba`;
      const pesertaUrl = `${API_URL}/api/admin/peserta`;
      
      console.log('Fetching from:', lombaUrl);
      console.log('Fetching from:', pesertaUrl);
      
      const [lombaRes, pesertaRes] = await Promise.all([
        fetch(lombaUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => {
          console.error('Error fetching lomba:', err);
          return { ok: false, status: 500, error: err.message };
        }),
        fetch(pesertaUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => {
          console.error('Error fetching peserta:', err);
          return { ok: false, status: 500, error: err.message };
        })
      ]);

      console.log('Lomba response:', { ok: lombaRes.ok, status: lombaRes.status });
      console.log('Peserta response:', { ok: pesertaRes.ok, status: pesertaRes.status });

      let realStats = {
        total_peserta: 0,
        total_lomba: 0,
        peserta_selesai: 0,
        peserta_belum_mulai: 0,
        token_aktif: 0,
        peserta_sedang_ujian: 0
      };

      let realLombaInfo: LombaInfo[] = [];

      // Process lomba data (cabang lomba) - DATA REAL dari database
      if (lombaRes.ok && 'json' in lombaRes) {
        const lombaData = await lombaRes.json();
        console.log('Lomba data dari database:', lombaData);
        if (lombaData.success && lombaData.data) {
          const lombaList = Array.isArray(lombaData.data) ? lombaData.data : [lombaData.data];
          realStats.total_lomba = lombaList.length;
          
          realLombaInfo = lombaList.map((lomba: any, index: number) => ({
            id: lomba.id || index + 1,
            nama_lomba: lomba.nama_lomba || lomba.nama || `Lomba ${index + 1}`,
            total_peserta: 0, // Akan dihitung dari data peserta real
            status: (lomba.status === 'aktif' || lomba.is_active) ? 'aktif' : 'nonaktif' as const
          }));
        }
      } else {
        console.log('Lomba API failed');
        toast.error('Gagal mengambil data lomba dari database');
      }

      // Process peserta data - DATA REAL dari table peserta
      if (pesertaRes.ok && 'json' in pesertaRes) {
        const pesertaData = await pesertaRes.json();
        console.log('Peserta data dari database:', pesertaData);
        if (pesertaData.success && pesertaData.data) {
          if (Array.isArray(pesertaData.data)) {
            // HITUNG REAL dari database
            realStats.total_peserta = pesertaData.data.length;
            
            // Hitung peserta selesai dari status_ujian = 'selesai' - DATA REAL
            const selesai = pesertaData.data.filter((p: any) => 
              p.status_ujian === 'selesai'
            ).length;
            
            // Hitung peserta sedang ujian dari status_ujian = 'sedang_ujian' - DATA REAL
            const sedangUjian = pesertaData.data.filter((p: any) => 
              p.status_ujian === 'sedang_ujian'
            ).length;

            // Hitung peserta belum mulai dari status_ujian = 'belum_mulai' - DATA REAL
            const belumMulai = pesertaData.data.filter((p: any) => 
              p.status_ujian === 'belum_mulai' || !p.status_ujian
            ).length;
            
            realStats.peserta_selesai = selesai;
            realStats.peserta_sedang_ujian = sedangUjian;
            realStats.peserta_belum_mulai = belumMulai;

            // Update total peserta per lomba - DATA REAL
            realLombaInfo = realLombaInfo.map(lomba => {
              const pesertaLomba = pesertaData.data.filter((p: any) => 
                p.cabang_lomba_id === lomba.id
              ).length;
              
              return {
                ...lomba,
                total_peserta: pesertaLomba
              };
            });
            
          } else if (pesertaData.pagination) {
            realStats.total_peserta = pesertaData.pagination.total || 0;
          }
        }
      } else {
        console.log('Peserta API failed');
        toast.error('Gagal mengambil data peserta dari database');
      }

      // Fetch token aktif dari endpoint yang ada
      try {
        const tokenRes = await fetch(`${API_URL}/api/admin/token`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.success && Array.isArray(tokenData.data)) {
            // Hitung token yang aktif dari database
            realStats.token_aktif = tokenData.data.filter((t: any) => 
              t.status_token === 'aktif' || t.is_active === true
            ).length;
          }
        }
      } catch (error) {
        console.log('Token endpoint tidak tersedia');
      }

      setStats(realStats);
      setLombaInfo(realLombaInfo);
      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      
      if (realStats.total_peserta > 0 || realStats.total_lomba > 0) {
        toast.success('Data berhasil dimuat dari database');
      } else {
        toast.info('Tidak ada data di database');
      }
      
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
            value={loading ? 'Loading...' : stats.total_peserta.toLocaleString()}
            iconColor="text-red-500"
          />
          <StatCard
            Icon={LayoutGrid}
            title="Cabang Lomba"
            value={loading ? 'Loading...' : stats.total_lomba}
            iconColor="text-blue-500"
          />
          <StatCard
            Icon={CheckCircle2}
            title="Ujian Selesai"
            value={loading ? 'Loading...' : stats.peserta_selesai}
            iconColor="text-green-600"
          />
          <StatCard
            Icon={Clock}
            title="Sedang Ujian"
            value={loading ? 'Loading...' : stats.peserta_sedang_ujian}
            iconColor="text-orange-500"
          />
        </div>
      </section>

      {/* Additional Stats - HANYA DATA REAL */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Tambahan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            Icon={FileText}
            title="Belum Mulai"
            value={loading ? 'Loading...' : stats.peserta_belum_mulai}
            iconColor="text-blue-500"
          />
          <StatCard
            Icon={Trophy}
            title="Token Aktif"
            value={loading ? 'Loading...' : stats.token_aktif}
            iconColor="text-yellow-500"
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
                <p>Loading...</p>
              ) : lombaInfo.length > 0 ? (
                lombaInfo.map((lomba) => (
                  <div key={lomba.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{lomba.nama_lomba}</h3>
                      <p className="text-sm text-gray-600">
                        {lomba.total_peserta} peserta terdaftar
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lomba.status === 'aktif' ? 'bg-green-100 text-green-800' :
                      lomba.status === 'selesai' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lomba.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada data lomba</p>
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