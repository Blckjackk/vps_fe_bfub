import { Pencil, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';

// Tipe data untuk setiap Lomba
type Lomba = {
  id: number;
  namaLomba: string;
  durasi: string;
  mulai: string;
  akhir: string;
  tanggalRilisNilai: string;
  jumlahSoalPG: number;
  jumlahSoalIsian: number;
  jumlahSoalEsai: number;
  isChecked: boolean;
};

interface LombaTableProps {
  lomba: Lomba[];
  selectedItems?: number[];
  onItemSelection?: (id: number) => void;
  onDeleteSingle?: (id: number, namaLomba: string) => void;
  onSetTanggalRilis?: (id: number, namaLomba: string) => void;
}

export default function LombaTable({ lomba, selectedItems = [], onItemSelection, onDeleteSingle, onSetTanggalRilis }: LombaTableProps) {
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
              <th scope="col" className="px-6 py-3">Tanggal Rilis Nilai</th>
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
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    item.tanggalRilisNilai === 'Belum diset' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.tanggalRilisNilai}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium">
                    {item.jumlahSoalPG}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium">
                    {item.jumlahSoalIsian}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium">
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
                    
                    <button 
                      className="text-green-600 hover:text-green-800"
                      title="Set Tanggal Rilis Nilai"
                      onClick={() => onSetTanggalRilis && onSetTanggalRilis(item.id, item.namaLomba)}
                    >
                      <Clock size={18} />
                    </button>
                    
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      title="Hapus Lomba"
                      onClick={() => onDeleteSingle && onDeleteSingle(item.id, item.namaLomba)}
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