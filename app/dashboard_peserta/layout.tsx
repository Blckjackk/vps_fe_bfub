'use client';

import SidebarPeserta from "@/components/dashboard-peserta/sidebar-peserta";

export default function LayoutPeserta({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    console.log("Logging out...");
    // tambahkan logika logout kalau perlu
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8FA]">
      <SidebarPeserta
        onLogoutClick={handleLogout}
        namaPeserta="Aurylia"
        asalSekolah="SMA Negeri 1 Bandung"
      />
      <main className="flex-1 flex flex-col gap-8 px-12 py-10">
        {children}
      </main>
    </div>
  );
}
