'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/dashboard-admin/Sidebar';
import ConfirmationDialog from '@/components/dashboard-admin/ConfirmationDialog';
import AuthWrapper from "@/components/auth/AuthWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    console.log("Berhasil logout!");
    // Hapus data dari localStorage
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    
    setShowLogoutModal(false);
    router.push('/login');
  };

  return (
    <AuthWrapper requiredRole="admin">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <div className="fixed top-0 left-0 h-full">
          <Sidebar onLogoutClick={() => setShowLogoutModal(true)} />
        </div>

        <div className="flex-1 ml-64"> {/* Sesuaikan margin-left dengan lebar sidebar */}
          <main className={`h-screen overflow-y-auto p-8 transition-all duration-300 ${showLogoutModal ? 'blur-sm pointer-events-none' : ''}`}>
            {children}
          </main>
        </div>

        {/* 👇 PERUBAHAN DI SINI 👇 */}
        <ConfirmationDialog
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title="Konfirmasi Logout"
          message="Apakah kamu yakin mau logout?"
        />
      </div>
    </AuthWrapper>
  );
}