import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaRegAddressCard,
  FaRegUser
} from "react-icons/fa";
import { LuLockKeyhole } from "react-icons/lu";
import {
  LiaCalculatorSolid,
  LiaBuilding,
  LiaBookOpenSolid,
} from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";

export default function RegisterPeserta() {
  const inputStyle =
    "w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B4FC5] focus:border-[#4B4FC5]";

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

          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Kolom Kiri */}
            <div className="flex flex-col gap-4">
              {/* Nama Lengkap */}
              <div className="relative">
                <FaRegAddressCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input type="text" placeholder="Nama Lengkap" required className={inputStyle} />
              </div>

              {/* No Pendaftaran */}
              <div className="relative">
                <LiaCalculatorSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input type="text" placeholder="No Pendaftaran" required className={inputStyle} />
              </div>

              {/* Asal Sekolah */}
              <div className="relative">
                <LiaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input type="text" placeholder="Asal Sekolah" required className={inputStyle} />
              </div>

              {/* Cabang Lomba */}
              <div className="relative">
                <LiaBookOpenSolid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <select required defaultValue="" className={inputStyle + " bg-white appearance-none"}>
                  <option value="" disabled>
                    Pilih Cabang Lomba
                  </option>
                  <option value="obi">OBI</option>
                  <option value="obn">OBN</option>
                  <option value="osa">OSA</option>
                  <option value="lctb">LCTB</option>
                </select>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col gap-4">
              {/* Username */}
              <div className="relative">
                <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input type="text" placeholder="Username" required className={inputStyle} />
              </div>

              {/* Password */}
              <div className="relative">
                <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input type="password" placeholder="Password" required className={inputStyle} />
              </div>

              {/* Konfirmasi Password */}
              <div className="relative">
                <LuLockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input type="password" placeholder="Konfirmasi Password" required className={inputStyle} />
              </div>
              <div className="relative">
                <IoHomeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input type="text" placeholder="Kota/Provinsi" required className={inputStyle} />
              </div>
            </div>
          </form>

          {/* Tombol Submit */}
          <Button className="w-full md:w-1/2 rounded-full bg-[#1877F2] hover:bg-[#1256b0] text-white text-base font-semibold py-2 mb-2">
            Submit
          </Button>

          <p className="text-center text-sm text-black">
            Sudah memiliki akun?{" "}
            <Link href="/page_auth/login" className="text-primary font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
