'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';

type Jawaban = {
  id: number;
  soal: string;
  jawabanPeserta: string;
  bobot: number;
  score: number;
  isChecked: boolean;
};

interface JawabanTableProps {
  title: string;
  data: Jawaban[];
  tipeSoal: 'esai' | 'singkat'; // <-- PROPERTI BARU
}

export default function JawabanTable({ title, data, tipeSoal }: JawabanTableProps) {
  // Tentukan path URL berdasarkan tipe soal
  const basePath = tipeSoal === 'esai' ? 'nilai-esai' : 'nilai-singkat';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4"><input type="checkbox" /></th>
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">Soal</th>
              <th scope="col" className="px-6 py-3">Jawaban Peserta</th>
              <th scope="col" className="px-6 py-3">Bobot</th>
              <th scope="col" className="px-6 py-3">Score</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="p-4"><input type="checkbox" checked={item.isChecked} readOnly /></td>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.soal}</td>
                <td className="px-6 py-4">{item.jawabanPeserta}</td>
                <td className="px-6 py-4">{item.bobot}</td>
                <td className="px-6 py-4 font-bold">{item.score}</td>
                <td className="px-6 py-4">
                  {/* 👇 PERBAIKAN POSISI IKON DI SINI 👇 */}
                  <div className="flex items-center justify-center">
                    <Link
                      href={`/dashboard-admin/hasil-lomba/${basePath}/${item.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Beri Penilaian"
                    >
                      <Pencil size={18} />
                    </Link>
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