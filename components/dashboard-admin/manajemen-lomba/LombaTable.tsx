import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Tipe data untuk setiap Lomba
type Lomba = {
  id: number;
  namaLomba: string;
  durasi: string;
  mulai: string;
  akhir: string;
  jumlahSoalPG: number;
  jumlahSoalIsian: number;
  jumlahSoalEsai: number;
  isChecked: boolean;
};

interface LombaTableProps {
  lomba: Lomba[];
  selectedItems?: number[];
  onItemSelection?: (id: number) => void;
}

export default function LombaTable({ lomba, selectedItems = [], onItemSelection }: LombaTableProps) {
  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedItems.length === lomba.length && lomba.length > 0}
                  onChange={() => {
                    if (onItemSelection) {
                      lomba.forEach(item => onItemSelection(item.id));
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">Nama Lomba</th>
              <th scope="col" className="px-6 py-3">Durasi</th>
              <th scope="col" className="px-6 py-3">Waktu Mulai</th>
              <th scope="col" className="px-6 py-3">Waktu Berakhir</th>
              <th scope="col" className="px-6 py-3">Soal PG</th>
              <th scope="col" className="px-6 py-3">Soal Isian</th>
              <th scope="col" className="px-6 py-3">Soal Esai</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lomba.map((item, index) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onItemSelection && onItemSelection(item.id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4">{item.namaLomba}</td>
                <td className="px-6 py-4">{item.durasi}</td>
                <td className="px-6 py-4">{item.mulai}</td>
                <td className="px-6 py-4">{item.akhir}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.jumlahSoalPG > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {item.jumlahSoalPG}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.jumlahSoalIsian > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {item.jumlahSoalIsian}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.jumlahSoalEsai > 0 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                    {item.jumlahSoalEsai}
                  </span>
                </td>
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