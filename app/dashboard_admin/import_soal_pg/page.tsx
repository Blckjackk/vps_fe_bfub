"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ImportSoalPGPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle file upload
  };

  return (
    <div className="flex min-h-screen bg-[#FAFBFF]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center py-10 px-2 md:px-8">
        <div className="w-full max-w-3xl mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors mb-2"
          >
            <FaArrowLeft className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-bold mb-8">Import File Soal PG</h1>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="font-semibold mb-2">Format File Soal</div>
            <ol className="list-decimal list-inside text-sm text-gray-700 mb-2">
              <li>File harus berbentuk csv</li>
              <li>Maksimal Ukuran file 100MB</li>
              <li>Format penulisan:</li>
            </ol>
            <div className="text-sm text-gray-700 mb-2">Contoh: no,soal, a, b, c, d, e, jawaban</div>
            <Link href="#" className="text-[#2176FF] underline text-sm">Download template file</Link>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col gap-4">
            <label className="font-semibold mb-2">*Masukkan file .csv</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="border rounded px-3 py-2"
              required
            />
          </form>
          <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => router.back()}
                  className="px-8 bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="px-8 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60]"
                  disabled={!file}
                >
                  Upload
                </Button>
              </div>
        </div>
      </main>
    </div>
  );
}
