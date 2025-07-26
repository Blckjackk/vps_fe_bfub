'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome, FaUsers, FaBorderAll, FaClipboardList, FaKey, FaDoorOpen, FaUserCircle, FaDownload
} from 'react-icons/fa'; // <-- GANTI DARI lucide-react KE react-icons/fa

// Array navigasi dengan ikon dari react-icons - MENU LENGKAP TANPA DUPLIKASI
const navItems = [
  { href: '/dashboard-admin', icon: FaHome, label: 'Dashboard' },
  { href: '/dashboard-admin/data-peserta', icon: FaUsers, label: 'Data Peserta' },
  { href: '/dashboard-admin/manajemen-lomba', icon: FaBorderAll, label: 'Manajemen Lomba' },
  { href: '/dashboard-admin/hasil-lomba', icon: FaClipboardList, label: 'Hasil Ujian' },
  { href: '/dashboard-admin/token-lomba', icon: FaKey, label: 'Token' },
  { href: '/dashboard-admin/export', icon: FaDownload, label: 'Ekspor File' },
];

interface SidebarProps {
  onLogoutClick: () => void;
}

export default function Sidebar({ onLogoutClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-md flex flex-col p-4">
      <div className="flex items-center gap-x-3 mb-4">
        <img src="/images/logos/brand/logo-BFUB.png" alt="BFUB Logo" className="w-20 h-20 object-contain"/>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-gray-700 leading-tight">Bakti Formica Untuk Bangsa</span>
          <span className="text-xs text-gray-500 leading-tight">(BFUB) XXVII</span>
        </div>
      </div>

         {/* Profil Admin */}
      <div className="flex flex-col items-center gap-4 mb-6 mt-2">
        <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="18" r="9" stroke="#BDBDBD" strokeWidth="2" />
            <ellipse cx="24" cy="36" rx="14" ry="8" stroke="#BDBDBD" strokeWidth="2" />
          </svg>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800">Admin</div>
          <div className="text-xs text-gray-500">Admin BFUB</div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          // Check if current path starts with item href for better matching
          const isActive = item.href === '/dashboard-admin' 
            ? pathname === '/dashboard-admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#B94A48] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Tombol Logout langsung di dalam nav */}
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors mt-4"
        >
          <FaDoorOpen size={20} />
          <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
}