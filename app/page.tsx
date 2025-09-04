"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

const competitions = [
  {
    name: "Microteaching ghifarii",
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
  const [activeSection, setActiveSection] = useState("home");
  const { user, isAuthenticated, isAdmin, isPeserta, logout } = useAuth();

  useEffect(() => {
    // Check if we're in the browser before using document
    if (typeof window === 'undefined') return;

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white scroll-smooth">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-2.5 shadow-sm bg-white sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-2 h-full">
          <div className="h-12 w-auto flex items-center">
            <Image
              src="/images/logos/brand/logo-BFUB-Polos.png"
              alt="BFUB Logo"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium leading-none transition-colors duration-200">
          <Link
            href="#"
            className={`${
              activeSection === "home"
                ? "text-[#7e5252]"
                : "text-[#a18a8a] hover:text-[#7e5252]"
            }`}
          >
            Home
          </Link>
          <Link
            href="#about"
            className={`${
              activeSection === "about"
                ? "text-[#7e5252]"
                : "text-[#a18a8a] hover:text-[#7e5252]"
            }`}
          >
            About
          </Link>
          <Link
            href="#cabang-lomba"
            className={`${
              activeSection === "cabang-lomba"
                ? "text-[#7e5252]"
                : "text-[#a18a8a] hover:text-[#7e5252]"
            }`}
          >
            Cabang Lomba
          </Link>
        </nav>
        <div className="flex gap-2 items-center">
          {!isAuthenticated ? (
            // Tampilkan tombol Login dan Register jika belum login
            <>
              <Link href="/login">
                <Button className="bg-[#C13F3F] text-white rounded-full px-6 py-2 min-w-[120px] hover:bg-[#ac5555]  hover:border-[#a03030]">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-transparent border border-[#C13F3F] text-[#C13F3F] rounded-full px-6 py-2 min-w-[120px] hover:bg-[#fceaea] hover:text-[#a03030] hover:border-[#a03030]">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            // Tampilkan tombol Dashboard dan Logout jika sudah login
            <div className="flex items-center gap-2 md:gap-3">
            
              <Link href={isAdmin ? '/dashboard-admin' : '/dashboard-peserta'}>
                <Button className="bg-[#C13F3F] text-white rounded-full px-4 md:px-6 py-2 text-sm md:text-base min-w-[100px] md:min-w-[120px] hover:bg-[#ac5555] hover:border-[#a03030]">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={logout}
                className="bg-transparent border border-[#C13F3F] text-[#C13F3F] rounded-full px-4 md:px-6 py-2 text-sm md:text-base min-w-[80px] md:min-w-[100px] hover:bg-[#fceaea] hover:text-[#a03030] hover:border-[#a03030]"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-8 bg-white"
      >
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Selamat Datang di Website{" "}
            <span className="text-primary">BFUB XXVII</span>
          </h1>
          {!isAuthenticated ? (
            <>
              <p className="text-gray-600 max-w-md">
                Untuk mengikuti lomba, silakan login terlebih dahulu dengan menekan
                tombol di bawah.
              </p>
              <div className="w-fit">
                <Link href="/login">
                  <Button className="bg-[#C13F3F] text-white rounded-full px-6 py-2 min-w-[120px] hover:bg-[#ac5555] hover:border-[#a03030]">
                    Login
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 max-w-md">
                Selamat datang kembali{user?.nama_lengkap && `, ${user.nama_lengkap}`}! 
                {isAdmin 
                  ? ' Anda dapat mengelola sistem lomba melalui dashboard admin.' 
                  : ' Anda dapat mengikuti lomba dan melihat hasil melalui dashboard peserta.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-fit">
                <Link href={isAdmin ? '/dashboard-admin' : '/dashboard-peserta'}>
                  <Button className="bg-[#C13F3F] text-white rounded-full px-6 py-2 min-w-[140px] hover:bg-[#ac5555] hover:border-[#a03030]">
                    Buka Dashboard
                  </Button>
                </Link>
                <Link href="#cabang-lomba">
                  <Button className="bg-transparent border border-[#C13F3F] text-[#C13F3F] rounded-full px-6 py-2 min-w-[140px] hover:bg-[#fceaea] hover:text-[#a03030] hover:border-[#a03030]">
                    Lihat Lomba
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/logos/illustration/Hero.png"
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
        <div className="w-16 h-[2px] bg-primary mx-auto mt-8 mb-6 rounded-full" />
        <p className="text-center text-gray-600 mb-10">
          Buktikan kemampuanmu di berbagai cabang lomba yang ditawarkan di BFUB
          XXVII!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {competitions.map((comp) => (
            <Card
              key={comp.name}
              className="items-center text-center shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <CardHeader className="flex flex-col items-center gap-4">
                <div className="w-[180px] h-[180px] relative">
                  <Image
                    src={comp.img}
                    alt={comp.name}
                    fill
                    className="object-contain"
                  />
                </div>
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
        className="min-h-screen px-8 md:px-24 py-16 flex flex-col items-center bg-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">About</h2>
        <div className="w-16 h-[2px] bg-primary mx-auto mt-4 mb-10 rounded-full " />
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
              kategori lomba yang dipertandingkan di antaranya Olimpiade Sains
              (OSA) untuk siswa-siswi SD se-Jawa Barat, Olimpiade Biologi (OBI)
              untuk siswa-siswi SMP se-Indonesia, Lomba Cepat Tepat Biologi
              (LCTB) untuk siswa-siswi SMA se-Indonesia, Karya Tulis Ilmiah
              Nasional (LKTIN) untuk siswa-siswi SMA se-Indonesia,
              Microteaching, dan Olimpiade Biologi Nasional (OBN) untuk
              mahasiswa/i angkatan aktif se-Indonesia.
            </p>
            <p>
              Dengan mengangkat tema "One Step for Education: Empowering Minds,
              Enriching the Nation", kami percaya bahwa satu langkah kecil dari
              mahasiswa dapat memberikan dampak besar bagi masa depan bangsa.
              Kami berharap kegiatan ini dapat terlaksana dengan lancar,
              didukung oleh berbagai pihak yang memiliki kepedulian terhadap
              kemajuan pendidikan Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#FF5959] to-[#BE3E3E] text-white px-6 py-12 md:px-20">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 max-w-6xl mx-auto">
          {/* Kolom Kiri – Logo & Deskripsi */}
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

          {/* Kolom Kanan – Navigate & Contact Us */}
          <div className="flex-1 flex flex-col md:flex-row justify-end gap-x-40 pr-30">
            {/* Navigate */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold mb-1">Navigate</span>
              <Link
                href="#"className="text-primary-foreground/80 text-xs hover:underline">Home
              </Link>
              <Link
                href="#about"
                className="text-primary-foreground/80 text-xs hover:underline"
              >
                About
              </Link>
              <Link
                href="#cabang-lomba"className="text-primary-foreground/80 text-xs hover:underline">Cabang Lomba</Link>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold mb-1">Contact Us</span>
              <a
                href="mailto:bfubxxvii@gmail.com"
                className="text-xs hover:underline"
              >
                bfubxxvii@gmail.com
              </a>
              <a href="https://wa.me/6282119890414"target="_blank"rel="noopener noreferrer"className="text-xs hover:underline"> 0821 1989 0414 (Shafa)</a>
              <a href="https://instagram.com/bfub_formica" target="_blank" rel="noopener noreferrer"className="text-xs hover:underline">@bfub_formica</a>
              <a href="https://instagram.com/hmbfupi"target="_blank"rel="noopener noreferrer"className="text-xs hover:underline"> @hmbfupi</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-xs text-center text-primary-foreground/60">
          ©BFUB XXVII 2025. All rights reserved
        </div>
      </footer>
    </div>
  );
}
