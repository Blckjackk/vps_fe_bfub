'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Trophy, FileText, Ticket, LogOut, CircleUserRound
} from 'lucide-react';

// Array ini adalah kunci dari semua navigasi.
const navItems = [
  { href: '/dashboard-admin', icon: LayoutDashboard, label: 'Dashboard' }, // <-- Menargetkan /app/dashboard-admin/page.tsx
  { href: '/dashboard-admin/data-peserta', icon: Users, label: 'Data Peserta' }, // <-- Menargetkan /app/dashboard-admin/data-peserta/
  { href: '/dashboard-admin/manajemen-lomba', icon: Trophy, label: 'Manajemen Lomba' }, // <-- Menargetkan /app/dashboard-admin/manajemen-lomba/
  { href: '/dashboard-admin/hasil-lomba', icon: FileText, label: 'Hasil Ujian' }, // <-- Menargetkan /app/dashboard-admin/hasil-lomba/
  { href: '/dashboard-admin/token-lomba', icon: Ticket, label: 'Token' }, // <-- Menargetkan /app/dashboard-admin/token-lomba/
];

interface SidebarProps {
  onLogoutClick: () => void;
}

export default function Sidebar({ onLogoutClick }: SidebarProps) {
  const pathname = usePathname();

  // ... sisa kode sidebar (profile, logo, tombol logout, dll) tetap sama ...
  // Anda tidak perlu mengubah apa pun di sini jika sudah benar.
  // Pastikan bagian navigasinya seperti ini:

  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-md flex flex-col p-4">
      <div className="text-center py-4 border-b mb-4">
        <h1 className="font-bold text-lg">Bakti Formica Untuk Bangsa</h1>
        <p className="text-sm">BFUB XXVII</p>
      </div>
      <div className="flex flex-col items-center text-center my-4">
        <CircleUserRound size={80} className="text-gray-400 mb-2" />
        <p className="font-semibold">Admin</p>
        <p className="text-sm text-gray-500">Admin BFUB</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            // Logika di bawah ini yang membuat menu aktif menjadi merah secara otomatis
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}