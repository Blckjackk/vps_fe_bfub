import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPeserta() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Info & Illustration */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-gradient-to-br from-[#4B4FC5] to-[#2B2E7A] text-white px-16 py-12 relative">
        <Link
          href="/page_auth/login"
          className="absolute top-8 left-8 text-2xl font-bold hover:opacity-80"
        >
          <span>&larr;</span>
        </Link>
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold mb-2">Registrasi Peserta</h1>
          <p className="text-base max-w-md mb-8">
            Selamat datang peserta BFUB! Halaman ini khusus untuk pendaftaran
            akun. Belum punya akun? Yuk Registrasi terlebih dahulu.
          </p>
          <div className="flex justify-center">
            <Image
              src="/images/landing-hero.svg"
              alt="Ilustrasi Register"
              width={320}
              height={220}
            />
          </div>
        </div>
      </div>
      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-6 py-12">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
            Registrasi Peserta
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
            Lengkapi formulir berikut untuk membuat akun peserta dan mengikuti
            lomba.
          </p>
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-4">
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
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 10h12M4 6h12M4 14h12" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  placeholder="No Pendaftaran"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 17V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10M16 17v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  placeholder="Asal Sekolah"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 6h16M4 10h16M4 14h16" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  placeholder="Cabang Lomba"
                  required
                  readOnly
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.66-5.33-4-8-4Z" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 17a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v5a5 5 0 0 0 5 5Zm0 0v2m-4-2a4 4 0 0 0 8 0" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 17a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v5a5 5 0 0 0 5 5Zm0 0v2m-4-2a4 4 0 0 0 8 0" />
                  </svg>
                </span>
                <Input
                  className="pl-10 rounded-full"
                  type="password"
                  placeholder="Konfirmasi Password"
                  required
                />
              </div>
            </div>
          </form>
          <Button className="w-full md:w-1/2 rounded-full bg-[#1877F2] hover:bg-[#1256b0] text-white text-base font-semibold py-2 mb-2">
            Submit
          </Button>
          <p className="text-center text-sm text-gray-700">
            Sudah memiliki akun?{" "}
            <Link
              href="/page_auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
