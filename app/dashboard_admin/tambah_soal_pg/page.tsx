"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft  } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const initialOptions = ["A", "B", "C", "D", "E"];

export default function TambahSoalPGPage() {
  const router = useRouter();
  const [soal, setSoal] = useState("");
  const [options, setOptions] = useState(Array(5).fill(""));
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === idx ? value : opt)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Ganti dengan API call sesuai kebutuhan
    // await fetch(...)
    setLoading(false);
    router.back();
  };

  return (
    <div className="flex min-h-screen bg-[#FAFBFF]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-2 md:px-8">
        <div className="w-full max-w-5xl mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors mb-6"
          >
            <FaArrowLeft className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-bold ml-1">Tambah Soal PG</h1>
        </div>
        <Card className="w-full max-w-5xl shadow-lg">
          <CardHeader>
            <CardTitle>Tambah Soal PG</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="min-w-0">
                <label className="font-semibold mb-2 block">Soal</label>
                <Editor
                  apiKey="no-api-key"
                  value={soal}
                  onEditorChange={setSoal}
                  init={{
                    height: 120,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime table paste help wordcount",
                      "image"
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help",
                    images_upload_url: undefined,
                    automatic_uploads: true,
                    images_upload_handler: undefined,
                    file_picker_types: 'image',
                    images_dataimg_filter: () => true,
                    image_title: true,
                    paste_data_images: true,
                  }}
                  className="w-full"
                />
              </div>
              {initialOptions.map((label, idx) => (
                <div key={label} className="min-w-0">
                  <label className="font-semibold mb-2 block">{label}</label>
                  <Editor
                    apiKey="no-api-key"
                    value={options[idx]}
                    onEditorChange={(val) => handleOptionChange(idx, val)}
                    init={{
                      height: 80,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime table paste help wordcount",
                        "image"
                      ],
                      toolbar:
                        "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help",
                      images_upload_url: undefined,
                      automatic_uploads: true,
                      images_upload_handler: undefined,
                      file_picker_types: 'image',
                      images_dataimg_filter: () => true,
                      image_title: true,
                      paste_data_images: true,
                    }}
                    className="w-full"
                  />
                </div>
              ))}
              <div>
                <label className="font-semibold mb-2 block">Jawaban</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={jawaban}
                  onChange={(e) => setJawaban(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih jawaban benar
                  </option>
                  {initialOptions.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
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
                  disabled={loading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 