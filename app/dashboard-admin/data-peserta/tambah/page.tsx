'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import {
  FaRegAddressCard,
  FaRegUser,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { LuLockKeyhole } from "react-icons/lu";
import {
  LiaCalculatorSolid,
  LiaBuilding,
  LiaBookOpenSolid,
} from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";

// API URL dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type CabangLomba = {
  id: number;
  nama_lomba: string;
  nama_cabang: string;
};

export default function TambahPesertaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cabangLombaList, setCabangLombaList] = useState<CabangLomba[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_pendaftaran: '',
    asal_sekolah: '',
    kota_provinsi: '',
    username: '',
    password: '',
    confirmPassword: '',
    cabang_lomba_id: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch cabang lomba list
  const fetchCabangLomba = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(`${API_URL}/api/lomba`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCabangLombaList(data.data);
      }
    } catch (err) {
      console.error('Error fetching cabang lomba:', err);
    }
  };

  useEffect(() => {
    fetchCabangLomba();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = 'Nama lengkap harus diisi';
    }

    if (!formData.nomor_pendaftaran.trim()) {
      newErrors.nomor_pendaftaran = 'Nomor pendaftaran harus diisi';
    }

    if (!formData.asal_sekolah.trim()) {
      newErrors.asal_sekolah = 'Asal sekolah harus diisi';
    }

    if (!formData.kota_provinsi.trim()) {
      newErrors.kota_provinsi = 'Kota/Provinsi harus diisi';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.cabang_lomba_id) {
      newErrors.cabang_lomba_id = 'Cabang lomba harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(`${API_URL}/api/admin/peserta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          nomor_pendaftaran: formData.nomor_pendaftaran,
          asal_sekolah: formData.asal_sekolah,
          kota_provinsi: formData.kota_provinsi,
          username: formData.username,
          password: formData.password,
          cabang_lomba_id: parseInt(formData.cabang_lomba_id)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Peserta berhasil ditambahkan!');
        setTimeout(() => {
          router.push('/dashboard-admin/data-peserta');
        }, 1500);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        
        const errorMessage = data.message || 'Gagal menambahkan peserta';
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating peserta:', err);
      toast.error('Terjadi kesalahan saat menambahkan peserta');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B94A48] focus:border-[#B94A48]";
  const passwordInputStyle = "w-full border border-gray-300 rounded-lg py-3 pl-12 pr-12 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B94A48] focus:border-[#B94A48]";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard-admin/data-peserta" className="text-gray-500 hover:text-gray-800 transition-colors">
            <FaArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tambah Peserta Baru</h1>
            <p className="text-gray-600">Admin dapat menambahkan peserta baru ke dalam sistem</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <FaRegAddressCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type="text" 
                    name="nama_lengkap"
                    placeholder="Masukkan nama lengkap peserta" 
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} ${errors.nama_lengkap ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>}
              </div>

              {/* No Pendaftaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Pendaftaran</label>
                <div className="relative">
                  <LiaCalculatorSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input 
                    type="text" 
                    name="nomor_pendaftaran"
                    placeholder="Masukkan nomor pendaftaran" 
                    value={formData.nomor_pendaftaran}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} ${errors.nomor_pendaftaran ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.nomor_pendaftaran && <p className="text-red-500 text-xs mt-1">{errors.nomor_pendaftaran}</p>}
              </div>

              {/* Asal Sekolah */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asal Sekolah</label>
                <div className="relative">
                  <LiaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input 
                    type="text" 
                    name="asal_sekolah"
                    placeholder="Masukkan nama sekolah" 
                    value={formData.asal_sekolah}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} ${errors.asal_sekolah ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.asal_sekolah && <p className="text-red-500 text-xs mt-1">{errors.asal_sekolah}</p>}
              </div>

              {/* Cabang Lomba */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cabang Lomba</label>
                <div className="relative">
                  <LiaBookOpenSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <select 
                    name="cabang_lomba_id"
                    value={formData.cabang_lomba_id}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} bg-white appearance-none ${errors.cabang_lomba_id ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Cabang Lomba</option>
                    {cabangLombaList.map(lomba => (
                      <option key={lomba.id} value={lomba.id.toString()}>
                        {lomba.nama_lomba || lomba.nama_cabang}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.cabang_lomba_id && <p className="text-red-500 text-xs mt-1">{errors.cabang_lomba_id}</p>}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type="text" 
                    name="username"
                    placeholder="Masukkan username untuk login" 
                    value={formData.username}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} ${errors.username ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Masukkan password (min. 6 karakter)" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    className={`${passwordInputStyle} ${errors.password ? 'border-red-500' : ''}`} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="Ulangi password yang sama" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                    className={`${passwordInputStyle} ${errors.confirmPassword ? 'border-red-500' : ''}`} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Kota/Provinsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota/Provinsi</label>
                <div className="relative">
                  <IoHomeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type="text" 
                    name="kota_provinsi"
                    placeholder="Masukkan kota/provinsi asal" 
                    value={formData.kota_provinsi}
                    onChange={handleInputChange}
                    required 
                    className={`${inputStyle} ${errors.kota_provinsi ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.kota_provinsi && <p className="text-red-500 text-xs mt-1">{errors.kota_provinsi}</p>}
              </div>
            </div>
          </form>

          {/* Tombol Action */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/dashboard-admin/data-peserta" 
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-600 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#B94A48] text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </div>
              ) : (
                'Simpan Peserta'
              )}
            </button>
          </div>
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}