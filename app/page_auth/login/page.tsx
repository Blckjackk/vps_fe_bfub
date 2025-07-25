import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLockKeyhole } from "react-icons/lu";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Info & Illustration */}
      <div className="w-1/2 h-screen bg-gradient-to-b from-[#FE5757] to-[#BE3E3E] flex flex-col justify-center items-center text-white relative">
        <Link
          href="/"
          className="absolute top-8 left-8 text-2xl font-bold hover:opacity-80"
        >
          <span>&larr;</span>
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
          <form className="w-full flex flex-col gap-4 mb-6">
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
                required
              />
            </div>
            <div className="relative">
              <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <Input
                className="pl-10 rounded-full"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button className="w-full rounded-full bg-[#1877F2] hover:bg-[#1256b0] text-white text-base font-semibold py-2">
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-black">
            Belum memiliki akun?{" "}
            <Link
              href="/page_auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Registrasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
