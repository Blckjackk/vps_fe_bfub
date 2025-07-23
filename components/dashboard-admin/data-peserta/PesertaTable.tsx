import { Pencil, Trash2 } from 'lucide-react';

// Tipe data untuk setiap peserta agar kode lebih aman dan mudah dibaca
type Peserta = {
  id: number;
  nama: string;
  noPend: string;
  asal: string;
  cabor: string; // Cabang Lomba
  username: string;
  pass: string;
  isChecked: boolean;
};

interface PesertaTableProps {
  peserta: Peserta[];
}

export default function PesertaTable({ peserta }: PesertaTableProps) {
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
              <th scope="col" className="px-6 py-3">Cabor</th>
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
                    readOnly // Hapus readOnly jika ingin fungsional
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
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
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