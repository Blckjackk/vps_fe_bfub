"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function EditSoalEsaiPage() {
  const router = useRouter();
  // Dummy data, ganti dengan fetch data soal jika sudah ada API
  const [soal, setSoal] = useState("");
  const [bobot, setBobot] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Update API call
    setLoading(false);
    router.back();
  };

  return (
    <div className="flex min-h-screen bg-[#FAFBFF]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-2 md:px-8">
        <div className="w-full max-w-5xl flex flex-col gap-y-2 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors mb-2"
          >
            <FaArrowLeft className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-bold ml-1 mb-2">Edit Soal Esai</h1>
        </div>
        <Card className="w-full max-w-5xl shadow-lg">
          <CardHeader>
            <CardTitle>Edit Soal Esai</CardTitle>
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
              <div className="flex items-center gap-2">
                <label className="font-semibold">Bobot :</label>
                <input
                  type="number"
                  min="1"
                  className="border rounded px-3 py-1 w-32"
                  value={bobot}
                  onChange={e => setBobot(e.target.value)}
                  required
                />
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
                  Update
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
