'use client'; // Client Component untuk menangani state dan functions

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarPeserta from "@/components/dashboard-peserta/sidebar-peserta";
import AuthWrapper from "@/components/auth/AuthWrapper";

export default function LayoutPeserta({ children }: { children: React.ReactNode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [namaPeserta, setNamaPeserta] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      setNamaPeserta(user.nama_lengkap || "Ahmad Izzudin Azzam");
      setAsalSekolah(user.asal_sekolah || "SMAN 2 Bandung");
    }
  }, []);

  const handleLogout = () => {
    console.log("Berhasil logout!");
    // Hapus data dari localStorage
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    
    setShowLogoutModal(false);
    router.push('/login'); // Arahkan ke halaman login
  };

  return (
    <AuthWrapper requiredRole="peserta">
      <div className="min-h-screen flex bg-[#F7F8FA]">
        <SidebarPeserta
          onLogoutClick={() => setShowLogoutModal(true)}
          namaPeserta={namaPeserta}
          asalSekolah={asalSekolah}
        />
        <main className={`flex-1 p-10 transition-all duration-300 ${showLogoutModal ? 'blur-sm pointer-events-none' : ''}`}>
          {children}
        </main>
      
      {/* Modal Logout - bisa dibuat komponen terpisah seperti di admin */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari sistem?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthWrapper>
  );
}
