'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutGrid,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard-admin',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    name: 'Data Peserta',
    href: '/dashboard-admin/data-peserta',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Manajemen Lomba',
    href: '/dashboard-admin/manajemen-lomba',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: 'Hasil Ujian',
    href: '/dashboard-admin/hasil-ujian',
    icon: <FileText className="w-5 h-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    // Redirect to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 border-r">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/images/logo-bfub.png"
              alt="BFUB Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 text-base rounded-lg hover:bg-gray-100 group ${
                    pathname.startsWith(item.href)
                      ? 'bg-gray-100 text-blue-600'
                      : 'text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-base text-red-600 rounded-lg hover:bg-red-50 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
