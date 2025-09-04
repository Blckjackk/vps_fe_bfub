'use client'; // Client Component untuk menangani state dan functions

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarPeserta from "@/components/dashboard-peserta/sidebar-peserta";
import AuthWrapper from "@/components/auth/AuthWrapper";
import LogoutConfirmationDialog from "@/components/dashboard-peserta/LogoutConfirmationDialog";
import { useHeartbeat } from "@/lib/useHeartbeat";

export default function LayoutPeserta({ children }: { children: React.ReactNode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [namaPeserta, setNamaPeserta] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const router = useRouter();
  
  // Initialize heartbeat system for online detection
  useHeartbeat();

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      setNamaPeserta(user.nama_lengkap || "Ahmad Izzudin Azzam");
      setAsalSekolah(user.asal_sekolah || "SMAN 2 Bandung");
    }
  }, []);

  const handleLogout = async () => {
    console.log("Berhasil logout!");
    
    // Send offline heartbeat before logout
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        const token = localStorage.getItem('session_token');
        
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/peserta/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            peserta_id: user.id,
            is_active: false,
            event_type: 'logout',
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Failed to send logout heartbeat:', error);
    }
    
    // Hapus data dari localStorage
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    localStorage.removeItem("token_aktif");
    localStorage.removeItem("waktu_mulai");
    localStorage.removeItem("durasi_ujian");
    
    setShowLogoutModal(false);
    router.push('/'); // Arahkan ke halaman utama
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
