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
import { Users, LayoutGrid, Wifi } from 'lucide-react';
import { useState, useEffect, useRef} from 'react';
import { withAuth } from '@/lib/auth';
import { toast, Toaster } from 'sonner';

interface DashboardStats {
  total_peserta: number;
  total_lomba: number;
  peserta_online: number;
  peserta_selesai: number;
  peserta_belum_mulai: number;
  token_aktif: number;
  token_terpakai: number;
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_peserta: 0,
    total_lomba: 0,
    peserta_online: 0,
    peserta_selesai: 0,
    peserta_belum_mulai: 0,
    token_aktif: 0,
    token_terpakai: 0
  });
  const [loading, setLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
  if (!toastShownRef.current) {
    toast.success('Halaman berhasil dimuat!');
    toastShownRef.current = true;
  }
}, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Selamat Datang Admin!</h1>

      <section className="mt-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <StatCard
            Icon={Users}
            title="Peserta"
            value={loading ? 'Loading...' : stats.total_peserta}
          />
          <StatCard
            Icon={LayoutGrid}
            title="Lomba"
            value={loading ? 'Loading...' : stats.total_lomba}
            iconColor="text-blue-500"
          />
          <StatCard
            Icon={Wifi}
            title="Peserta Online"
            value={loading ? 'Loading...' : stats.peserta_online}
            iconColor="text-green-500"
          />
        </div>
      </section>

      {/* Anda bisa menambahkan konten atau komponen lain di sini */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

// Protect this page with admin-only access
export default withAuth(AdminDashboardPage, ['admin']);