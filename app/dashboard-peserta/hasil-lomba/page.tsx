"use client";

import React from "react";

const hasilUjian = [
  {
    no: 1,
    jenis: "Pilihan Ganda",
    mulai: "16.00",
    selesai: "17.30",
    jumlah: 100,
    dijawab: 100,
    benar: 70,
    salah: 30,
    nilai: 70,
  },
  {
    no: 2,
    jenis: "Esai",
    mulai: "17.30",
    selesai: "18.00",
    jumlah: 20,
    dijawab: 20,
    benar: 10,
    salah: 10,
    nilai: 10,
  },
];

export default function HasilLombaPage() {
  const namaPeserta = "Ahmad Izzudin Azzam";
  const asalSekolah = "SMAN 2 Bandung";
  const totalNilai = hasilUjian.reduce((acc, cur) => acc + cur.nilai, 0);

  const handleLogout = () => {
    alert("Logout berhasil!");
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Hasil Lomba</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Jenis Soal</th>
                <th className="px-4 py-2 border">Waktu Mulai</th>
                <th className="px-4 py-2 border">Waktu Selesai</th>
                <th className="px-4 py-2 border">Jumlah Soal</th>
                <th className="px-4 py-2 border">Jumlah Soal Dijawab</th>
                <th className="px-4 py-2 border">Jumlah Soal Benar</th>
                <th className="px-4 py-2 border">Jumlah Soal Salah</th>
                <th className="px-4 py-2 border">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {hasilUjian.map((row) => (
                <tr key={row.no} className="text-center text-gray-800">
                  <td className="px-4 py-2 border">{row.no}</td>
                  <td className="px-4 py-2 border">{row.jenis}</td>
                  <td className="px-4 py-2 border">{row.mulai}</td>
                  <td className="px-4 py-2 border">{row.selesai}</td>
                  <td className="px-4 py-2 border">{row.jumlah}</td>
                  <td className="px-4 py-2 border">{row.dijawab}</td>
                  <td className="px-4 py-2 border">{row.benar}</td>
                  <td className="px-4 py-2 border">{row.salah}</td>
                  <td className="px-4 py-2 border font-bold">{row.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <div className="bg-[#3DC9A7] text-white font-bold px-6 py-3 rounded-lg shadow text-lg">
            Total Nilai : {totalNilai}
          </div>
        </div>
      </main>
    </div>
  );
}
