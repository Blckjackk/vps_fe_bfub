import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaBorderAll, FaClipboardList, FaKey, FaDoorOpen, FaFileExport} from "react-icons/fa";

const menu = [
  { name: "Dashboard", icon: <FaHome />, href: "/dashboard_admin" },
  { name: "Data Peserta", icon: <FaUsers />, href: "/dashboard_admin/data_peserta" },
  { name: "Manajemen Lomba", icon: <FaBorderAll />, href: "/dashboard_admin/daftar_lomba" },
  { name: "Hasil Ujian", icon: <FaClipboardList />, href: "/dashboard_admin/hasil_ujian" },
  { name: "Token", icon: <FaKey />, href: "/dashboard_admin/token" },
  { name: "Ekspor File", icon: <FaFileExport />, href: "/dashboard_admin/export" },
  { name: "Log Out", icon: <FaDoorOpen />, href: "/logout" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-80 h-screen bg-white border-r flex flex-col px-6 py-8 gap-8 overflow-y-auto">
      <div className="flex flex-row items-center gap-x-3 mb-8">
        <Image src="/images/logos/brand/logo-BFUB.png" alt="BFUB Logo" width={48} height={48} />      
        <div className="text-xs text-gray-700 font-semibold text-left leading-tight">
          Bakti Formica Untuk Bangsa<br /> (BFUB) XXVII
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="18" r="9" stroke="#BDBDBD" strokeWidth="2"/><ellipse cx="24" cy="36" rx="14" ry="8" stroke="#BDBDBD" strokeWidth="2"/></svg>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800">Admin</div>
          <div className="text-xs text-gray-500">Admin BFUB</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {menu.map((item) => {
          const isActive =
            (item.href === "/dashboard_admin" && pathname === "/dashboard_admin") ||
            (item.href !== "/dashboard_admin" && item.href !== "/logout" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${isActive ? "bg-[#B94A48] text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
