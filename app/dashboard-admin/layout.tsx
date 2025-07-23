'use client'; // <-- WAJIB! Menjadikan layout ini Client Component agar bisa pakai state.

import type { Metadata } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/dashboard-admin/Sidebar';
import DialogLogout from '@/components/dashboard-admin/DialogLogout';

// Metadata tidak bisa diekspor dari Client Component,
// Anda bisa memindahkannya ke page.tsx atau menghapusnya jika tidak terlalu krusial.
/*
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard untuk BFUB',
};
*/

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State untuk mengontrol modal sekarang ada di sini (pusat kendali).
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  // Fungsi untuk menangani proses logout.
  const handleLogout = () => {
    console.log("Berhasil logout!");
    setShowLogoutModal(false); // Tutup modal
    router.push('/login'); // Arahkan ke halaman login
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar menerima fungsi untuk membuka modal */}
      <Sidebar onLogoutClick={() => setShowLogoutModal(true)} />

      {/* 2. Main content akan blur jika modal terbuka */}
      <main className={`flex-1 p-8 transition-all duration-300 ${showLogoutModal ? 'blur-sm pointer-events-none' : ''}`}>
        {children}
      </main>

      {/* 3. Dialog dirender di sini, dikontrol oleh state di layout */}
      <DialogLogout
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}