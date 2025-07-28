'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

type CabangLomba = {
  id: number;
  nama_cabang: string;
};

export default function RegisterPeserta() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cabangLombaList, setCabangLombaList] = useState<CabangLomba[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
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
      const response = await fetch('http://localhost:8000/api/lomba');
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

  // Show custom popup
  const showCustomPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      router.push('/login');
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        showCustomPopup('Registrasi berhasil! Silakan login dengan akun Anda.', 'success');
      } else {
        // Handle specific errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          showCustomPopup(data.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      showCustomPopup('Terjadi kesalahan saat mendaftar. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };
  const inputStyle =
    "w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B4FC5] focus:border-[#4B4FC5]";

  const passwordInputStyle =
    "w-full border border-gray-300 rounded-full py-2 pl-10 pr-12 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B4FC5] focus:border-[#4B4FC5]";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Kiri - Info */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-gradient-to-br from-[#4B4FC5] to-[#2B2E7A] text-white px-16 py-12 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 text-2xl font-bold hover:opacity-80"
        >
          &larr;
        </Link>
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold mb-2">Registrasi Peserta</h1>
          <p className="text-base max-w-md mb-8">
            Selamat datang peserta BFUB! Halaman ini khusus untuk pendaftaran akun. Belum punya akun? Yuk Registrasi terlebih dahulu.
          </p>
          <div className="flex justify-center">
            <Image
              src="/images/logos/illustration/illustration_2.png"
              alt="illustration_2"
              width={320}
              height={220}
            />
          </div>
        </div>
      </div>

      {/* Kanan - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-6 py-12">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
            Registrasi Peserta
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
            Lengkapi formulir berikut untuk membuat akun peserta dan mengikuti lomba.
          </p>

          <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Kolom Kiri */}
            <div className="flex flex-col gap-4">
              {/* Nama Lengkap */}
              <div className="relative">
                <FaRegAddressCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  name="nama_lengkap"
                  placeholder="Nama Lengkap" 
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  required 
                  className={`${inputStyle} ${errors.nama_lengkap ? 'border-red-500' : ''}`} 
                />
                {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>}
              </div>

              {/* No Pendaftaran */}
              <div className="relative">
                <LiaCalculatorSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input 
                  type="text" 
                  name="nomor_pendaftaran"
                  placeholder="No Pendaftaran" 
                  value={formData.nomor_pendaftaran}
                  onChange={handleInputChange}
                  required 
                  className={`${inputStyle} ${errors.nomor_pendaftaran ? 'border-red-500' : ''}`} 
                />
                {errors.nomor_pendaftaran && <p className="text-red-500 text-xs mt-1">{errors.nomor_pendaftaran}</p>}
              </div>

              {/* Asal Sekolah */}
              <div className="relative">
                <LiaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input 
                  type="text" 
                  name="asal_sekolah"
                  placeholder="Asal Sekolah" 
                  value={formData.asal_sekolah}
                  onChange={handleInputChange}
                  required 
                  className={`${inputStyle} ${errors.asal_sekolah ? 'border-red-500' : ''}`} 
                />
                {errors.asal_sekolah && <p className="text-red-500 text-xs mt-1">{errors.asal_sekolah}</p>}
              </div>

              {/* Cabang Lomba */}
              <div className="relative">
                <LiaBookOpenSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
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
                      {lomba.nama_cabang}
                    </option>
                  ))}
                </select>
                {errors.cabang_lomba_id && <p className="text-red-500 text-xs mt-1">{errors.cabang_lomba_id}</p>}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col gap-4">
              {/* Username */}
              <div className="relative">
                <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                  className={`${inputStyle} ${errors.username ? 'border-red-500' : ''}`} 
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  autoComplete="new-password"
                  className={`${passwordInputStyle} [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden ${errors.password ? 'border-red-500' : ''}`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20 bg-white rounded-full p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Konfirmasi Password */}
              <div className="relative">
                <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  placeholder="Konfirmasi Password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                  autoComplete="new-password"
                  className={`${passwordInputStyle} [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden ${errors.confirmPassword ? 'border-red-500' : ''}`} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20 bg-white rounded-full p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Kota/Provinsi */}
              <div className="relative">
                <IoHomeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  name="kota_provinsi"
                  placeholder="Kota/Provinsi" 
                  value={formData.kota_provinsi}
                  onChange={handleInputChange}
                  required 
                  className={`${inputStyle} ${errors.kota_provinsi ? 'border-red-500' : ''}`} 
                />
                {errors.kota_provinsi && <p className="text-red-500 text-xs mt-1">{errors.kota_provinsi}</p>}
              </div>
            </div>
          </form>

          {/* Tombol Submit */}
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-1/2 rounded-full bg-[#1877F2] hover:bg-[#1256b0] text-white text-base font-semibold py-2 mb-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mendaftar...
              </div>
            ) : (
              'Submit'
            )}
          </Button>

          <p className="text-center text-sm text-black">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all">
            <div className="text-center">
              {/* Icon */}
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                popupType === 'success' 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
              }`}>
                {popupType === 'success' ? (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-xl font-semibold mb-2 ${
                popupType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {popupType === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {popupMessage}
              </p>

              {/* Button */}
              <button
                onClick={closePopup}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                  popupType === 'success'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {popupType === 'success' ? 'Lanjut ke Login' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
