'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe untuk data form
type FormData = {
  namaLengkap: string;
  noPendaftaran: string;
  asalSekolah: string;
  cabangLomba: string;
  username: string;
  password: string;
};

interface PesertaFormProps {
  initialData?: Partial<FormData>; // Data awal untuk mode edit (opsional)
  onSubmit: (data: FormData) => void; // Fungsi yang dipanggil saat submit
  isEditMode?: boolean; // Flag untuk menentukan mode (tambah/edit)
}

export default function PesertaForm({ initialData, onSubmit, isEditMode = false }: PesertaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: '',
    noPendaftaran: '',
    asalSekolah: '',
    cabangLomba: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" name="namaLengkap" id="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="noPendaftaran" className="block text-sm font-medium text-gray-700 mb-1">No. Pendaftaran</label>
            <input type="text" name="noPendaftaran" id="noPendaftaran" value={formData.noPendaftaran} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          
          <div>
            <label htmlFor="asalSekolah" className="block text-sm font-medium text-gray-700 mb-1">Asal Sekolah</label>
            <input type="text" name="asalSekolah" id="asalSekolah" value={formData.asalSekolah} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          
          <div>
            <label htmlFor="cabangLomba" className="block text-sm font-medium text-gray-700 mb-1">Cabang Lomba</label>
            <select name="cabangLomba" id="cabangLomba" value={formData.cabangLomba} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Pilih Cabang Lomba</option>
              <option value="OSN">OSN</option>
              <option value="OBT">OBT</option>
              <option value="OBI">OBI</option>
              <option value="OSA">OSA</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah" : ""} required={!isEditMode} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Link href="/dashboard-admin/data-peserta" className="flex-1">
          <button type="button" className="w-full bg-[#B94A48] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#a53e3c]">
            Batal
          </button>
        </Link>
        <button 
          type="submit" 
          className="flex-1 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60]"
        >
          {isEditMode ? 'Update' : 'Simpan Peserta'}
        </button>
      </div>  
    </form>
  );
}