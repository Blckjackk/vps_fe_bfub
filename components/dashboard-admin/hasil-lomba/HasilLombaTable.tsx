"use client";

import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';

// Tipe data untuk setiap baris hasil ujian
type HasilUjian = {
  id: number;
  noPendaftaran: string;
  nama: string;
  cabor: string;
  mulai: string;
  selesai: string;
  jumlahSoal: number;
  soalTerjawab: number;
  soalBenar: number;
  soalSalah: number;
  nilai: number;
  isChecked: boolean;
};

// Definisikan props yang diterima komponen
interface HasilLombaTableProps {
  hasil: HasilUjian[];
  onDeleteItem: (id: number) => void;
  onSelectItem?: (id: number) => void;
  onSelectAll?: () => void;
  allChecked?: boolean;
}

export default function HasilLombaTable({ hasil, onDeleteItem, onSelectItem, onSelectAll, allChecked }: HasilLombaTableProps) {
  return (
    <div className="mt-4 bg-white rounded-lg">
      <div className="w-full">
        <table className="w-full text-sm text-left text-gray-600 table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="w-12 p-4">
                <input 
                  type="checkbox" 
                  checked={allChecked || false}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded" 
                />
              </th>
              <th scope="col" className="w-12 px-2 py-3">No.</th>
              <th scope="col" className="w-32 px-2 py-3">Nama</th>
              <th scope="col" className="w-24 px-2 py-3 hidden lg:table-cell">Cabang Lomba</th>
              <th scope="col" className="w-20 px-2 py-3 hidden xl:table-cell">Mulai</th>
              <th scope="col" className="w-20 px-2 py-3 hidden xl:table-cell">Selesai</th>
              <th scope="col" className="w-16 px-2 py-3 hidden lg:table-cell">Jumlah Soal</th>
              <th scope="col" className="w-16 px-2 py-3 hidden lg:table-cell">Terjawab</th>
              <th scope="col" className="w-16 px-2 py-3 hidden md:table-cell">Benar</th>
              <th scope="col" className="w-16 px-2 py-3 hidden md:table-cell">Salah</th>
              <th scope="col" className="w-16 px-2 py-3">Nilai</th>
              <th scope="col" className="w-20 px-2 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map((item, index) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="w-12 p-4">
                  <input 
                    type="checkbox" 
                    checked={item.isChecked} 
                    onChange={() => onSelectItem?.(item.id)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="w-12 px-2 py-4 font-medium">{index + 1}</td>
                <td className="w-32 px-2 py-4 font-medium text-gray-900 truncate" title={item.nama}>{item.nama}</td>
                <td className="w-24 px-2 py-4 hidden lg:table-cell text-xs truncate" title={item.cabor}>{item.cabor}</td>
                <td className="w-20 px-2 py-4 hidden xl:table-cell text-xs">{item.mulai}</td>
                <td className="w-20 px-2 py-4 hidden xl:table-cell text-xs">{item.selesai}</td>
                <td className="w-16 px-2 py-4 hidden lg:table-cell text-center">{item.jumlahSoal}</td>
                <td className="w-16 px-2 py-4 hidden lg:table-cell text-center">{item.soalTerjawab}</td>
                <td className="w-16 px-2 py-4 hidden md:table-cell text-center">{item.soalBenar}</td>
                <td className="w-16 px-2 py-4 hidden md:table-cell text-center">{item.soalSalah}</td>
                <td className="w-16 px-2 py-4 font-bold text-gray-900 text-center">{item.nilai}</td>
                <td className="w-20 px-2 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/dashboard-admin/hasil-lomba/detail/${item.id}`}
                      className="text-gray-500 hover:text-blue-600"
                      title="Lihat Detail">
                      <FileText size={16} />
                    </Link>
                    <button 
                      onClick={() => onDeleteItem(item.id)} 
                      className="text-[#B94A48] hover:text-[#a53e3c]" 
                      title="Hapus Hasil Ujian"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
