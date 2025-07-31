'use client'; // Client Component untuk menangani state dan functions

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarPeserta from "@/components/dashboard-peserta/sidebar-peserta";
import AuthWrapper from "@/components/auth/AuthWrapper";
import LogoutConfirmationDialog from "@/components/dashboard-peserta/LogoutConfirmationDialog";

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
      
      <LogoutConfirmationDialog 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
    </AuthWrapper>
  );
}
