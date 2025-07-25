'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

// Tipe data untuk setiap peserta
type Peserta = {
  id: number;
  nama: string;
  noPend: string;
  asal: string;
  cabor: string;
  username: string;
  pass: string;
  isChecked: boolean;
};

// Tipe untuk properti (props) yang diterima komponen ini
interface PesertaTableProps {
  peserta: Peserta[];
  onDeleteItem: (id: number) => void; // Fungsi untuk menangani klik hapus
}

export default function PesertaTable({ peserta, onDeleteItem }: PesertaTableProps) {
  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
              </th>
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">No. Pend</th>
              <th scope="col" className="px-6 py-3">Asal</th>
              <th scope="col" className="px-6 py-3">Cabang Lomba</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Password</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peserta.map((item, index) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="w-4 p-4">
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    readOnly
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4">{item.nama}</td>
                <td className="px-6 py-4">{item.noPend}</td>
                <td className="px-6 py-4">{item.asal}</td>
                <td className="px-6 py-4">{item.cabor}</td>
                <td className="px-6 py-4">{item.username}</td>
                <td className="px-6 py-4">{item.pass}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/dashboard-admin/data-peserta/edit/${item.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Peserta"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-[#B94A48] hover:text-[#a53e3c]"
                      title="Hapus Peserta"
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