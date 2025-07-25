'use client';

import SidebarPeserta from './sidebar-peserta';

export default function SidebarWithLogout() {
  const handleLogout = () => {
    console.log("Logging out...");
    // tambahkan logika logout disini
  };

  return (
    <SidebarPeserta
      onLogoutClick={handleLogout}
      namaPeserta="Aurylia"
      asalSekolah="SMA Negeri 1 Bandung"
    />
  );
}
