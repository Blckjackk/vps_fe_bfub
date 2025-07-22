import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const competitions = [
  {
    name: "Microteaching",
    desc: "Untuk mahasiswa/i S1 yang ingin menunjukkan bakat mengajar dan berbagai ilmu secara kreatif.",
    img: "/images/logos/competitions/logo-lomba-Microteaching.png",
  },
  {
    name: "OSA",
    desc: "Untuk siswa/i SD di seluruh pulau Jawa dalam ajang kompetisi sains seru.",
    img: "/images/logos/competitions/logo-lomba-OSA.png",
  },
  {
    name: "OBI",
    desc: "Untuk siswa/i SMP se-Pulau Jawa yang ingin menguji logika dan pengetahuan biologi lewat soal seru.",
    img: "/images/logos/competitions/logo-lomba-OBI.png",
  },
  {
    name: "LCTB",
    desc: "Untuk siswa/i SMA dalam ajang adu cepat dan tepat seputar pengetahuan biologi.",
    img: "/images/logos/competitions/logo-lomba-LCTB.png",
  },
  {
    name: "LKTIN",
    desc: "Untuk siswa dan siswi SMA yang ingin menyalurkan kreativitas & kemampuan menulis di bidang sains.",
    img: "/images/logos/competitions/logo-lomba-LKTN.png",
  },
  {
    name: "OBN",
    desc: "Untuk mahasiswa/i S1 untuk kemampuan biologi, pecahkan soal menantang.",
    img: "/images/logos/competitions/logo-lomba-OBN.png",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logos/brand/logo-BFUB.png"
            alt="BFUB Logo"
            width={56}
            height={56}
          />
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="text-black">
            Home
          </Link>
          <Link href="#about">About</Link>
          <Link href="#cabang-lomba">Cabang Lomba</Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/page_auth/login">
            <Button variant="destructive" className="px-6">
              Login
            </Button>
          </Link>
          <Link href="/page_auth/register">
            <Button variant="outline" className="px-6">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-8 bg-white">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Selamat Datang di Website{" "}
            <span className="text-primary">BFUB XXVII</span>
          </h1>
          <p className="text-gray-600 max-w-md">
            Untuk mengikuti lomba, silakan login terlebih dahulu dengan menekan
            tombol di bawah.
          </p>
          <Link href="/page_auth/login">
            <Button variant="destructive" className="mt-2 w-fit shadow-md">
              Login Peserta
            </Button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/landing-hero.svg"
            alt="Hero"
            width={350}
            height={260}
            className="max-w-full h-auto"
          />
        </div>
      </section>

      {/* Cabang Lomba */}
      <section id="cabang-lomba" className="px-8 md:px-24 py-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Cabang Lomba
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
        <p className="text-center text-gray-600 mb-10">
          Buktikan kemampuanmu di berbagai cabang lomba yang ditawarkan di BFUB
          XXVII!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {competitions.map((comp) => (
            <Card
              key={comp.name}
              className="items-center text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center gap-2">
                <Image src={comp.img} alt={comp.name} width={80} height={80} />
                <CardTitle className="text-lg font-semibold">
                  {comp.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{comp.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="px-8 md:px-24 py-16 flex flex-col items-center bg-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">About</h2>
        <div className="w-16 h-1 bg-primary mb-6 rounded-full" />
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl">
          <Image
            src="/images/logos/brand/logo-BFUB-Polos.png"
            alt="BFUB Logo"
            width={160}
            height={120}
          />
          <div className="text-gray-700 text-justify text-sm md:text-base">
            <p className="mb-2">
              Bakti Formica Untuk Bangsa (BFUB) XXVII merupakan salah satu
              program kerja tahunan BEM HMBF FPMIPA UPI. Terdapat berbagai
              kategori lomba yang dipertandingkan, di antaranya Olimpiade Sains
              (OSA), Olimpiade Biologi (OBI), Lomba Cepat Tepat Biologi (LCTB),
              Karya Tulis Ilmiah Nasional (LKTIN), Microteaching, dan Olimpiade
              Biologi Nasional (OBN).
            </p>
            <p>
              BFUB XXV diselenggarakan pada tanggal 10-12 November 2023. Tema
              yang diusung "Let's Start Living as Sustainable Minimalist: Live
              Simply and Wasteless", diikuti oleh peserta yang terdiri atas
              Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), Sekolah
              Menengah Atas (SMA), dan mahasiswa dari perguruan tinggi di
              seluruh Indonesia, dengan kategori cabang lomba yang telah
              ditentukan untuk masing-masing strata pendidikannya.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-10 px-8 md:px-24 mt-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 max-w-6xl mx-auto">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/images/logos/brand/logo-BFUB-Polos.png"
                alt="BFUB Logo"
                width={48}
                height={48}
              />
              <span className="font-bold text-lg">BFUB XXVII</span>
            </div>
            <p className="text-xs text-primary-foreground/80 max-w-xs">
              BFUB XXVII merupakan ajang tahunan BEM HMBF FPMIPA UPI yang
              terdiri dari berbagai lomba di bidang sains dan biologi, mulai
              dari OSA hingga OBN.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <span className="font-semibold mb-1">Navigate</span>
            <Link
              href="#about"
              className="text-primary-foreground/80 text-xs hover:underline"
            >
              About
            </Link>
            <Link
              href="#cabang-lomba"
              className="text-primary-foreground/80 text-xs hover:underline"
            >
              Cabang Lomba
            </Link>
            <Link
              href="/page_auth/login"
              className="text-primary-foreground/80 text-xs hover:underline"
            >
              Peserta
            </Link>
            <Link
              href="/admin"
              className="text-primary-foreground/80 text-xs hover:underline"
            >
              Admin
            </Link>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <span className="font-semibold mb-1">Contact Us</span>
            <span className="text-xs">bfubformica@gmail.com</span>
            <span className="text-xs">+623 1231 213</span>
            <span className="text-xs">@bfub_formica</span>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-xs text-center text-primary-foreground/60">
          ©BFUB XXVII 2025. All rights reserved
        </div>
      </footer>
    </div>
  );
}
