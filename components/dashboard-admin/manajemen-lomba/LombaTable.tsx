import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Tipe data untuk setiap Lomba
type Lomba = {
  id: number;
  namaLomba: string;
  kodeGrup: string;
  kategori: string;
  durasi: string;
  mulai: string;
  akhir: string;
  jumlahSoal: number;
  isChecked: boolean;
};

interface LombaTableProps {
  lomba: Lomba[];
}

export default function LombaTable({ lomba }: LombaTableProps) {
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
              <th scope="col" className="px-6 py-3">Nama Lomba</th>
              <th scope="col" className="px-6 py-3">Kode Grup</th>
              <th scope="col" className="px-6 py-3">Kategori</th>
              <th scope="col" className="px-6 py-3">Durasi</th>
              <th scope="col" className="px-6 py-3">Mulai</th>
              <th scope="col" className="px-6 py-3">Akhir</th>
              <th scope="col" className="px-6 py-3">Jumlah Soal</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lomba.map((item, index) => (
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
                <td className="px-6 py-4">{item.namaLomba}</td>
                <td className="px-6 py-4">{item.kodeGrup}</td>
                <td className="px-6 py-4">{item.kategori}</td>
                <td className="px-6 py-4">{item.durasi}</td>
                <td className="px-6 py-4">{item.mulai}</td>
                <td className="px-6 py-4">{item.akhir}</td>
                <td className="px-6 py-4">{item.jumlahSoal}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link 
                      href={`/dashboard-admin/manajemen-lomba/edit?id=${item.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Lomba"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button className="text-red-600 hover:text-red-800" title="Hapus Lomba">
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