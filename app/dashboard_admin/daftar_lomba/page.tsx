/**
 * File                         : daftar_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard_admin/daftar_lomba
 * Description                  : Halaman dashboard admin untuk daftar lomba pada aplikasi website perlombaan BFUB.
 *                                Menampilkan daftar lomba yang terdaftar dan fitur manajemen lomba.
 * Functional                   :
 *      - Menampilkan daftar semua lomba dengan paginasi.
 *      - Menyediakan fitur pencarian dan filter lomba.
 *      - Memungkinkan admin untuk menambah, melihat detail, mengedit, dan menghapus data lomba.
 *      - Menyediakan fitur bulk actions untuk operasi massal.
 * API Methods      / Endpoints :
 *      - GET       api/lomba                  (Untuk menampilkan seluruh data lomba dengan pagination)
 *      - POST      api/lomba                  (Untuk membuat/menambah data lomba baru)
 *      - GET       api/lomba/{id}             (Untuk menampilkan detail dari satu lomba)
 *      - PUT       api/lomba/{id}             (Untuk mengupdate data lomba yang dipilih)
 *      - DELETE    api/lomba/{id}             (Untuk menghapus data lomba yang dipilih)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba dengan filter dan pagination
 *      - INSERT lomba ke tabel cabang_lomba
 *      - UPDATE lomba di tabel cabang_lomba
 *      - DELETE lomba dari tabel cabang_lomba
 *      - SELECT COUNT(*) untuk pagination
 */

"use client";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaTrashAlt, FaEdit} from "react-icons/fa";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

const lombaDummy = [
  { id: 1, nama: "OBN", kode: "091301231", kategori: "PG dan Esai", durasi: "00:00", mulai: "00:00", akhir: "00:00", jumlah: 110 },
  { id: 2, nama: "OBI", kode: "123123123", kategori: "PG dan Esai", durasi: "00:00", mulai: "00:00", akhir: "00:00", jumlah: 110 },
  { id: 3, nama: "OSA", kode: "13123123", kategori: "PG dan Esai", durasi: "00:00", mulai: "00:00", akhir: "00:00", jumlah: 105 },
];

export default function DaftarLomba() {
  const [selected, setSelected] = useState<number[]>([1, 2]);
  const allSelected = selected.length === lombaDummy.length;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAFBFF]">
      <div className="hidden md:block"><AdminSidebar /></div>
      <main className="flex-1 p-8 md:p-12">
        <h1 className="text-2xl font-bold mb-8">Manajemen Lomba</h1>
        <Link href="/dashboard_admin/tambah_lomba" className="inline-flex items-center gap-2 w-fit bg-[#B94A48] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c] mb-4">
          <span className="text-lg">+</span> Tambah Lomba
        </Link>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 w-full">
            <input type="text" placeholder="Cari Ujian" className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B94A48]" />
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center bg-[#2176FF] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#185bb5]"
                onClick={() => setShowDropdown((prev) => !prev)}
                type="button"
              >
                Filter <span className="ml-1"><FaAngleDown /></span>
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Filter 1</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Filter 2</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Filter 3</button>
                </div>
              )}
            </div>
            <button className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-500">Pilih Semua</button>
            <button className="bg-[#B94A48] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#a53e3c]">Hapus Pilih</button>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="p-4"><input type="checkbox" checked={allSelected} onChange={e => setSelected(e.target.checked ? lombaDummy.map(l => l.id) : [])} /></th>
                <th className="p-4">No.</th>
                <th className="p-4">Nama Lomba</th>
                <th className="p-4">Kode Grup</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Durasi</th>
                <th className="p-4">Mulai</th>
                <th className="p-4">Akhir</th>
                <th className="p-4">Jumlah Soal</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lombaDummy.map((lomba, idx) => (
                <tr key={lomba.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(lomba.id)}
                      onChange={e => setSelected(e.target.checked ? [...selected, lomba.id] : selected.filter(id => id !== lomba.id))}
                      className="accent-[#6C63FF] w-4 h-4 rounded"
                    />
                  </td>
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-semibold">{lomba.nama}</td>
                  <td className="p-4">{lomba.kode}</td>
                  <td className="p-4">{lomba.kategori}</td>
                  <td className="p-4">{lomba.durasi}</td>
                  <td className="p-4">{lomba.mulai}</td>
                  <td className="p-4">{lomba.akhir}</td>
                  <td className="p-4">{lomba.jumlah}</td>
                  <td className="p-4 flex gap-2">
                    <Link href="/dashboard_admin/edit_lomba" className="text-[#223A5F] hover:text-[#185bb5]" title="Edit">
                      <FaEdit />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-[#B94A48] hover:text-[#a53e3c]" title="Hapus"><FaTrashAlt /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus data lomba ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                        <div className="flex justify-end gap-2 mt-4">
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction /* onClick={handleDelete} */>Hapus</AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}