/**
 * File                         : edit_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/edit-lomba/{id}
 * Description                  : Halaman dashboard admin untuk mengedit data lomba pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form untuk mengubah detail lomba yang sudah ada.
 * Functional                   :
 *      - Mengambil data lomba yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data lomba tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data lomba ke dalam sistem.
 *      - Redirect ke daftar lomba setelah berhasil update.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}             (Untuk mengambil data lomba yang akan diedit)
 *      - PUT       api/lomba/{id}             (Untuk menyimpan perubahan data lomba)
 *      - GET       api/kategori               (Untuk mendapatkan daftar kategori lomba)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - UPDATE lomba di tabel cabang_lomba
 *      - SELECT kategori dari tabel kategori untuk dropdown
 */
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaAngleDown, FaArrowLeft, FaFileImport, FaFileExport} from "react-icons/fa";

const dummyPG = [
  {
    id: 1,
    pertanyaan: "Asep...",
    kode: "091301231",
    tipe: "PG",
    media: "PG",
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    jawaban: "a",
  },
  {
    id: 2,
    pertanyaan: "Budi",
    kode: "123123123",
    tipe: "PG",
    media: "PG",
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    jawaban: "g",
  },
  {
    id: 3,
    pertanyaan: "Andi",
    kode: "13123123",
    tipe: "PG",
    media: "PG",
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    jawaban: "g",
  },
];
const dummyEsai = [
  { id: 1, soal: "Organel Sel ..", bobot: 100 },
  { id: 2, soal: "Ciri Makhluk ..", bobot: 100 },
];
const dummyIsian = [
  { id: 1, soal: "Organel Sel ..", bobot: 100 },
  { id: 2, soal: "Ciri Makhluk ..", bobot: 100 },
];

export default function EditLomba() {
  const [selectedPG, setSelectedPG] = useState<number[]>([]);
  const [selectedEsai, setSelectedEsai] = useState<number[]>([]);
  const [selectedIsian, setSelectedIsian] = useState<number[]>([]);
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
    <div className="min-h-screen bg-[#FAFBFF] flex">
      <div className="hidden md:block">
      </div>
      <main className="flex-1 flex flex-col items-start justify-start py-12 px-2 md:px-0">
        <div className="w-full max-w-xl ml-0 md:ml-16">
          <Link
            href="/dashboard_admin/daftar_lomba"
            className="inline-block mb-6"
          >
            <span className="text-2xl font-bold text-[#223A5F]">
              <FaArrowLeft />
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-8">Edit Lomba</h1>
          <form className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
            <label className="font-medium text-sm">
              Nama Lomba
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="Muklis"
                disabled
              />
            </label>
            <label className="font-medium text-sm">
              Kode Grup
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="OIN-11123"
                disabled
              />
            </label>
            <label className="font-medium text-sm">
              Kategori
              <select
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                defaultValue="PG, Esai, Isian Singkat"
              >
                <option>PG, Esai, Isian Singkat</option>
                <option>PG</option>
                <option>Esai</option>
                <option>Isian Singkat</option>
              </select>
            </label>
            <label className="font-medium text-sm">
              Durasi pengerjaan Soal
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="1 jam"
              />
            </label>
            <label className="font-medium text-sm">
              Waktu Mulai
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="08:00"
              />
            </label>
            <label className="font-medium text-sm">
              Waktu Akhir
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="09:00"
              />
            </label>
            <label className="font-medium text-sm">
              Jumlah Soal
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#B94A48]"
                value="10"
              />
            </label>
          </form>
          <div className="flex flex-col md:flex-row gap-4 mt-6 items-center">
            {/* Dropdown Filter */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center bg-[#2176FF] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#185bb5]"
                onClick={() => setShowDropdown((prev: boolean) => !prev)}
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
            {/* Tombol lain jika ada */}
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Link href="/dashboard_admin/daftar_lomba" className="flex-1">
              <button type="button" className="w-full bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">Back</button>
            </Link>
            <button type="submit" className="flex-1 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60]">Update</button>
          </div>
        </div>
        {/* Section Soal PG */}
        <SectionSoal
          title="Soal PG"
          data={dummyPG}
          selected={selectedPG}
          setSelected={setSelectedPG}
          type="pg"
        />
        {/* Section Soal Esai */}
        <SectionSoal
          title="Soal Esai"
          data={dummyEsai}
          selected={selectedEsai}
          setSelected={setSelectedEsai}
          type="esai"
        />
        {/* Section Soal Isian Singkat */}
        <SectionSoal
          title="Soal Isian Singkat"
          data={dummyIsian}
          selected={selectedIsian}
          setSelected={setSelectedIsian}
          type="isian"
        />
      </main>
    </div>
  );
}

function SectionSoal({ title, data, selected, setSelected, type }: any) {
  const allSelected = selected.length === data.length && data.length > 0;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full max-w-6xl mt-12 ml-0 md:ml-16">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/dashboard_admin/tambah_soal_pg">
          <button className="flex items-center gap-2 bg-[#B94A48] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
            <FaPlus /> Tambah PG
          </button>
        </Link>
        <Link href="/dashboard_admin/tambah_soal_esai">
          <button className="flex items-center gap-2 bg-[#B94A48] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
            <FaPlus /> Tambah Esai
          </button>
        </Link>
        <Link href="/dashboard_admin/tambah_soal_isian_singkat">
          <button className="flex items-center gap-2 bg-[#B94A48] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
            <FaPlus /> Tambah Isian Singkat
          </button>
        </Link>
        {type === "pg" && (
          <Link href="/dashboard_admin/import_soal_pg">
            <button className="flex items-center gap-2 bg-[#F6C23E] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#e0b12d]">
              <span className="text-lg"><FaFileImport /></span> Import
            </button>
          </Link>
        )}
        {type === "esai" && (
          <Link href="/dashboard_admin/import_soal_esai">
            <button className="flex items-center gap-2 bg-[#F6C23E] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#e0b12d]">
              <span className="text-lg"><FaFileImport /></span> Import
            </button>
          </Link>
        )}
        {type === "isian" && (
          <Link href="/dashboard_admin/import_soal_isian_singkat">
            <button className="flex items-center gap-2 bg-[#F6C23E] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#e0b12d]">
              <span className="text-lg"><FaFileImport /></span> Import
            </button>
          </Link>
        )}
        <Link href="/dashboard_admin/export">
          <button className="flex items-center gap-2 bg-[#2176FF] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#185bb5]">
            <span className="text-lg"><FaFileExport /></span> Export
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input type="text" placeholder="Cari Ujian" className="w-full md:w-80 px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B94A48]" />
        {/* Ganti tombol Filter menjadi dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center bg-[#2176FF] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#185bb5]"
            onClick={() => setShowDropdown((prev: boolean) => !prev)}
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
      <div className="overflow-x-auto pr-8">
        <table className="w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="text-gray-500 text-left">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? data.map((d: any) => d.id) : []
                    )
                  }
                />
              </th>
              <th className="p-4">No.</th>
              <th className="p-4">{type === "pg" ? "Pertanyaan" : "Soal"}</th>
              {type === "pg" && (
                <>
                  <th className="p-4">Tipe Soal</th>
                  <th className="p-4">Media Soal</th>
                  <th className="p-4">a</th>
                  <th className="p-4">b</th>
                  <th className="p-4">c</th>
                  <th className="p-4">d</th>
                  <th className="p-4">e</th>
                  <th className="p-4">Jawaban</th>
                </>
              )}
              {type !== "pg" && <th className="p-4">Bobot</th>}
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, idx: number) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, item.id]
                          : selected.filter((id: number) => id !== item.id)
                      )
                    }
                    className="accent-[#6C63FF] w-4 h-4 rounded"
                  />
                </td>
                <td className="p-4">{idx + 1}</td>
                <td className="p-4 font-semibold">
                  {type === "pg" ? item.pertanyaan : item.soal}
                </td>
                {type === "pg" && (
                  <>
                    <td className="p-4">{item.tipe}</td>
                    <td className="p-4">{item.media}</td>
                    <td className="p-4">{item.a}</td>
                    <td className="p-4">{item.b}</td>
                    <td className="p-4">{item.c}</td>
                    <td className="p-4">{item.d}</td>
                    <td className="p-4">{item.e}</td>
                    <td className="p-4">{item.jawaban}</td>
                  </>
                )}
                {type !== "pg" && <td className="p-4">{item.bobot}</td>}
                <td className="p-4 flex gap-2">
                  {type === "pg" && (
                    <Link href={`/dashboard_admin/edit_soal_pg?id=${item.id}`}>
                      <button className="text-[#223A5F] hover:text-[#185bb5]" title="Edit"><FaEdit /></button>
                    </Link>
                  )}
                  {type === "esai" && (
                    <Link href={`/dashboard_admin/edit_soal_esai?id=${item.id}`}>
                      <button className="text-[#223A5F] hover:text-[#185bb5]" title="Edit"><FaEdit /></button>
                    </Link>
                  )}
                  {type === "isian" && (
                    <Link href={`/dashboard_admin/edit_soal_isian_singkat?id=${item.id}`}>
                      <button className="text-[#223A5F] hover:text-[#185bb5]" title="Edit"><FaEdit /></button>
                    </Link>
                  )}
                  <button className="text-[#B94A48] hover:text-[#a53e3c]" title="Hapus"><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
