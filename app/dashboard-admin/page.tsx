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
import { Users, LayoutGrid, Wifi, Trophy, Clock, CheckCircle2, UserCheck, FileText, Activity } from 'lucide-react';
import { useState, useEffect, useRef} from 'react';
import { withAuth } from '@/lib/auth';
import { toast, Toaster } from 'sonner';
import { API_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  total_peserta: number;
  total_lomba: number;
  peserta_online: number;
  peserta_selesai: number;
  peserta_belum_mulai: number;
  token_aktif: number;
  token_terpakai: number;
  peserta_sedang_ujian: number;
  total_pendaftaran: number;
  rata_rata_nilai: number;
}

interface LombaInfo {
  id: number;
  nama_lomba: string;
  total_peserta: number;
  peserta_online: number;
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

interface RecentActivity {
  id: number;
  activity: string;
  user: string;
  timestamp: string;
  type: 'login' | 'logout' | 'ujian_mulai' | 'ujian_selesai' | 'pendaftaran';
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_peserta: 0,
    total_lomba: 0,
    peserta_online: 0,
    peserta_selesai: 0,
    peserta_belum_mulai: 0,
    token_aktif: 0,
    token_terpakai: 0,
    peserta_sedang_ujian: 0,
    total_pendaftaran: 0,
    rata_rata_nilai: 0
  });
  const [lombaInfo, setLombaInfo] = useState<LombaInfo[]>([]);
  const [onlinePeserta, setOnlinePeserta] = useState<OnlinePeserta[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
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
      toast.success('Dashboard berhasil dimuat! Auto-refresh setiap 30 detik');
      toastShownRef.current = true;
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      
      // Fetch all data in parallel
      const [statsRes, lombaRes, onlineRes, activitiesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard/stats`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/admin/dashboard/lomba-info`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/admin/dashboard/online-peserta`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/admin/dashboard/recent-activities`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      // Process stats
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      // Process lomba info
      if (lombaRes.ok) {
        const lombaData = await lombaRes.json();
        if (lombaData.success) {
          setLombaInfo(lombaData.data);
        }
      }

      // Process online peserta
      if (onlineRes.ok) {
        const onlineData = await onlineRes.json();
        if (onlineData.success) {
          setOnlinePeserta(onlineData.data);
        }
      }

      // Process recent activities
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) {
          setRecentActivities(activitiesData.data);
        }
      }

      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'logout': return <UserCheck className="w-4 h-4 text-red-500" />;
      case 'ujian_mulai': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'ujian_selesai': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pendaftaran': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
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

      {/* Main Stats */}
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
            Icon={Wifi}
            title="Peserta Online"
            value={loading ? 'Loading...' : stats.peserta_online}
            iconColor="text-green-500"
          />
          <StatCard
            Icon={Clock}
            title="Sedang Ujian"
            value={loading ? 'Loading...' : stats.peserta_sedang_ujian}
            iconColor="text-orange-500"
          />
        </div>
      </section>

      {/* Additional Stats */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Tambahan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            Icon={CheckCircle2}
            title="Ujian Selesai"
            value={loading ? 'Loading...' : stats.peserta_selesai}
            iconColor="text-green-600"
          />
          <StatCard
            Icon={FileText}
            title="Total Pendaftaran"
            value={loading ? 'Loading...' : stats.total_pendaftaran.toLocaleString()}
            iconColor="text-purple-500"
          />
          <StatCard
            Icon={Trophy}
            title="Token Aktif"
            value={loading ? 'Loading...' : stats.token_aktif}
            iconColor="text-yellow-500"
          />
          <StatCard
            Icon={Activity}
            title="Rata-rata Nilai"
            value={loading ? 'Loading...' : stats.rata_rata_nilai ? `${stats.rata_rata_nilai.toFixed(1)}` : '0.0'}
            iconColor="text-indigo-500"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Lomba Information */}
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
                        {lomba.total_peserta} peserta • {lomba.peserta_online} online
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

        {/* Online Peserta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-500" />
              Peserta Online ({onlinePeserta.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {loading ? (
                <p>Loading...</p>
              ) : onlinePeserta.length > 0 ? (
                onlinePeserta.map((peserta) => (
                  <div key={peserta.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">{peserta.nama_lengkap}</h3>
                      <p className="text-xs text-gray-600">{peserta.lomba}</p>
                      <p className="text-xs text-green-600">{peserta.duration_online}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        peserta.status_ujian === 'sedang_ujian' ? 'bg-orange-100 text-orange-800' :
                        peserta.status_ujian === 'selesai' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {peserta.status_ujian}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada peserta online</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loading ? (
              <p>Loading...</p>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-gray-600">oleh {activity.user}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Tidak ada aktivitas terbaru</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Toaster position="top-right" richColors />
    </div>
  );
}

// Protect this page with admin-only access
export default withAuth(AdminDashboardPage, ['admin']);