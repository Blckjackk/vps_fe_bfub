'use client';

import Link from 'next/link'; // <-- IMPORT Link
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
}

export default function HasilLombaTable({ hasil, onDeleteItem, onSelectItem }: HasilLombaTableProps) {
  return (
    <div className="mt-4 bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <input type="checkbox" className="w-4 h-4 rounded" />
              </th>
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">No.Pendaftaran</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Cabang Lomba</th>
              <th scope="col" className="px-6 py-3">Mulai</th>
              <th scope="col" className="px-6 py-3">Selesai</th>
              <th scope="col" className="px-6 py-3">Jumlah Soal</th>
              <th scope="col" className="px-6 py-3">Soal Terjawab</th>
              <th scope="col" className="px-6 py-3">Soal Benar</th>
              <th scope="col" className="px-6 py-3">Soal Salah</th>
              <th scope="col" className="px-6 py-3">Nilai</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map((item, index) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="w-4 p-4">
                  <input 
                    type="checkbox" 
                    checked={item.isChecked} 
                    onChange={() => onSelectItem?.(item.id)}
                    className="w-4 h-4 rounded" 
                  />
                </td>
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4">{item.noPendaftaran}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.nama}</td>
                <td className="px-6 py-4">{item.cabor}</td>
                <td className="px-6 py-4">{item.mulai}</td>
                <td className="px-6 py-4">{item.selesai}</td>
                <td className="px-6 py-4">{item.jumlahSoal}</td>
                <td className="px-6 py-4">{item.soalTerjawab}</td>
                <td className="px-6 py-4">{item.soalBenar}</td>
                <td className="px-6 py-4">{item.soalSalah}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{item.nilai}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/dashboard-admin/hasil-lomba/detail/${item.id}`}
                      className="text-gray-500 hover:text-blue-600"
                      title="Lihat Detail">
                      <FileText size={18} />
                    </Link>
                    {/* 👇 PERUBAHAN DI SINI 👇 */}
                    <button 
                      onClick={() => onDeleteItem(item.id)} 
                      className="text-[#B94A48] hover:text-[#a53e3c]" 
                      title="Hapus Hasil Ujian"
                    >
                      <Trash2 size={18} />
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