"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLockKeyhole } from "react-icons/lu";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const { login } = useAuth();

  // Show custom popup
  const showCustomPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use the auth context login function
        login(data.data.session_token, data.data.user, data.data.role);
        showCustomPopup("Login berhasil!", 'success');
      } else {
        showCustomPopup(data.message || "Login gagal", 'error');
      }
    } catch (err) {
      showCustomPopup("Terjadi kesalahan saat login. Periksa koneksi internet Anda.", 'error');
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Info & Illustration */}
      <div className="w-1/2 h-screen bg-gradient-to-b from-[#FE5757] to-[#BE3E3E] flex flex-col justify-center items-center text-white relative">
        <Link
          href="/"
          className="absolute top-8 left-8 text-2xl font-bold hover:opacity-80"
        >
        <FaArrowLeft />
        </Link>
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold mb-2">Login</h1>
          <p className="text-base max-w-md mb-8">
            Silahkan login terlebih dahulu
          </p>
          <div className="flex justify-center">
            <Image
              src="/images/logos/illustration/Hero.png"
              alt="Hero"
              width={320}
              height={220}
            />
          </div>
        </div>
      </div>
      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-6 py-12">
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
            Login
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
            Masukkan username dan password yang telah kamu buat.
          </p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-6">
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.314 0-6 1.343-6 3v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1c0-1.657-2.686-3-6-3Z" />
                </svg>
              </span>
              <Input
                className="pl-10 rounded-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
              <Input
                className="pl-10 pr-12 rounded-full [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20 bg-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#1877F2] hover:bg-[#1256b0] text-white text-base font-semibold py-2"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
          <p className="text-center text-sm text-black">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Registrasi
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
                {popupType === 'success' ? 'Berhasil!' : 'Gagal Login'}
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
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
