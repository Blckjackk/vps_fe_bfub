/**
 * File                         : profile_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-peserta/profile-peserta
 * Description                  : Halaman profil peserta pada aplikasi website perlombaan BFUB.
 *                                Menampilkan informasi detail peserta dan memungkinkan edit profil.
 * Functional                   : 
 *      - Menampilkan informasi detail peserta.
 *      - Menyediakan form untuk mengedit profil peserta.
 *      - Memvalidasi dan menyimpan perubahan data profil.
 * API Methods      / Endpoints :
 *      - GET       api/me                     (Untuk mendapatkan informasi peserta yang sedang login)
 *      - PUT       api/peserta/update         (Untuk mengupdate data profil peserta)
 * Table Activities             :
 *      - SELECT peserta dari aktivitas login untuk menampilkan data profil
 *      - UPDATE peserta di tabel peserta untuk menyimpan perubahan profil
 * Anchor Links                 :
 *      - landing_dashboard_peserta.tsx (Untuk mengarahkan peserta ke halaman dashboard mereka)
 *      - hasil_lomba.tsx               (Untuk mengarahkan peserta ke halaman hasil lomba)
 */



'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import icon mata
import API_URL from '@/lib/api';
interface UserData {
  id: number;
  nama_lengkap: string;
  nomor_pendaftaran: string;
  asal_sekolah: string;
  username: string;
  password?: string; // Password field
  password_hash?: string; // Password hash dari database
  kota_provinsi?: string; // Tambahkan field yang ada di localStorage
  email?: string;
  nomor_telepon?: string;
  cabang_lomba?: {
    nama_cabang: string;
  };
  status_ujian?: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  nilai_total?: number;
}

export default function ProfilePesertaPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Ambil data user dari localStorage terlebih dahulu
        const storedUserData = localStorage.getItem("user_data");
        if (!storedUserData) {
          setError("Sesi login tidak ditemukan. Silakan login ulang.");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(storedUserData);
        
        // Debug: log data user untuk melihat struktur
        console.log('User data from localStorage:', user);
        
        // Fetch data profil lengkap dari API
        const response = await fetch(`${API_URL}/api/peserta/profile/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Debug: log hasil API
        console.log('API response:', result);
        
        if (result.success && result.data) {
          // Gabungkan data dari API dengan data localStorage
          const combinedData = {
            ...result.data, // Langsung gunakan semua data dari API
            kota_provinsi: user.kota_provinsi, // Hanya tambahkan field yang tidak ada di API
            password_hash: user.password || user.password_hash // Gunakan password dari localStorage
          };
          console.log('Combined user data:', combinedData);
          console.log('Password_hash from API:', result.data.password_hash);
          console.log('Password from localStorage:', user.password);
          console.log('All API data keys:', Object.keys(result.data));
          setUserData(combinedData);
        } else {
          // Fallback ke data localStorage jika API gagal
          console.log('Using localStorage fallback data:', user);
          setUserData(user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Fallback ke data localStorage jika ada error
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          console.log('Using localStorage fallback data:', user);
          setUserData(user);
        } else {
          setError("Gagal mengambil data profil. Silakan refresh halaman.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFF] text-gray-800">
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFF] text-gray-800">
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "Data tidak ditemukan"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Halaman
            </button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-[#F9FAFF] text-gray-800">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-16 px-8">
        <h1 className="text-2xl font-bold mb-10">Profile</h1>

         {/* Icon Avatar */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="18" r="9" stroke="#BDBDBD" strokeWidth="2" />
              <ellipse
                cx="24"
                cy="36"
                rx="14"
                ry="8"
                stroke="#BDBDBD"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
          <ProfileItem 
            label="Nama" 
            value={userData.nama_lengkap || "Tidak tersedia"} 
          />
          <ProfileItem 
            label="No. Pendaftaran" 
            value={userData.nomor_pendaftaran || userData.id?.toString() || "Tidak tersedia"} 
          />
          <ProfileItem 
            label="Asal Sekolah" 
            value={userData.asal_sekolah || "Tidak tersedia"} 
          />
          <ProfileItem 
            label="Username" 
            value={userData.username || "Tidak tersedia"} 
          />
          <PasswordItem 
            label="Password" 
            value={userData.password_hash || "Tidak tersedia"} // Langsung gunakan password_hash seperti field lain
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          {userData.email && (
            <ProfileItem 
              label="Email" 
              value={userData.email} 
            />
          )}
          {userData.nomor_telepon && (
            <ProfileItem 
              label="No. Telepon" 
              value={userData.nomor_telepon} 
            />
          )}
          {userData.cabang_lomba?.nama_cabang && (
            <ProfileItem 
              label="Cabang Lomba" 
              value={userData.cabang_lomba.nama_cabang} 
            />
          )}
        </div>

        {/* Tombol Edit Profil (opsional untuk future enhancement) */}
        <div className="mt-6">
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              // Future: implement edit profile functionality
              alert("Fitur edit profil akan segera tersedia!");
            }}
          >
            Edit Profil
          </button>
        </div>
      </main>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PasswordItem({ 
  label, 
  value, 
  showPassword, 
  onTogglePassword 
}: { 
  label: string; 
  value: string; 
  showPassword: boolean; 
  onTogglePassword: () => void; 
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-mono">
          {showPassword ? value : '*'.repeat(value.length)}
        </span>
        <button
          onClick={onTogglePassword}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          type="button"
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? (
            <EyeOff size={16} className="text-gray-500" />
          ) : (
            <Eye size={16} className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
