import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const sidebarMenu = [
  { label: "Ujian", icon: "📝", active: true },
  { label: "Profile", icon: "👤" },
  { label: "Hasil", icon: "📊" },
  { label: "Log Out", icon: "🚪" },
];
export default function DashboardPeserta() {
  return (
    <div className="min-h-screen flex bg-[#F7F8FA]">
      {/* Sidebar */}
      <aside className="w-[270px] bg-white border-r flex flex-col items-center py-8 gap-8 min-h-screen">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Image
            src="/images/logos/brand/logo-BFUB.png"
            alt="Logo BFUB"
            width={80}
            height={40}
          />
          <span className="text-xs text-gray-600 text-center leading-tight">
            Bakti Formica Untuk Bangsa (BFUB) XXVII
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="rounded-full border bg-gray-100 w-24 h-24 flex items-center justify-center">
            <Image
              src="/images/avatar-default.svg"
              alt="Avatar"
              width={64}
              height={64}
            />
          </div>
          <div className="font-semibold text-base">Ahmad Izzudin Azzam</div>
          <div className="text-xs text-gray-500">SMAN 2 Bandung</div>
        </div>
        <nav className="flex flex-col gap-2 w-full px-6">
          {sidebarMenu.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                item.active
                  ? "bg-red-100 text-red-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.active && <span className="ml-auto text-red-500">▶</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8 px-12 py-10">
        <h1 className="text-2xl font-bold mb-2">
          Selamat Datang Ahmad Izzudin Azzam!
        </h1>
        <h2 className="text-xl font-bold mb-1">Ujian - Olimpiade Biologi</h2>
        <p className="text-gray-700 mb-6">
          Silakan baca instruksi di bawah ini sebelum memulai ujian.
        </p>

        <div className="flex flex-col gap-8 md:flex-row md:gap-8">
          {/* Instruksi Pengerjaan */}
          <Card className="flex-1 p-6 shadow-md">
            <div className="font-semibold mb-2">Instruksi Pengerjaan</div>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
              <li>
                Durasi ujian selama 60 menit termasuk pengerjaan tipe soal PG
                dan Esai.
              </li>
              <li>
                Waktu akan berjalan otomatis sesuai jadwal yang telah di
                tentukan.
              </li>
              <li>
                Sistem akan mengumpulkan jawaban secara otomatis setelah waktu
                habis.
              </li>
              <li>
                Tidak diperkenankan membuka tab lain selama ujian berlangsung.
              </li>
              <li>
                Jika peserta membuka tab lain ketika ujian berlangsung sistem
                otomatis akan keluar dan meminta token baru.
              </li>
              <li>
                Pastikan koneksi internet stabil selama ujian berlangsung.
              </li>
              <li>
                Setiap peserta hanya diperbolehkan mengikuti ujian satu kali.
              </li>
            </ol>
          </Card>

          {/* Info Ujian & Token */}
          <div className="flex flex-col gap-8 w-full md:w-[340px]">
            <Card className="p-6 shadow-md mb-4">
              <div className="font-semibold mb-2">Informasi Token</div>
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                <li>Kamu diberikan 5 token untuk mengakses ujian.</li>
                <li>Hanya 1 token aktif yang akan ditampilkan saat ini.</li>
                <li>
                  Setelah token digunakan dan kamu menekan Mulai, token tersebut
                  akan hangus dan tidak bisa digunakan kembali.
                </li>
                <li>
                  Jika seluruh token telah digunakan, kamu wajib menghubungi
                  panitia untuk mendapatkan token baru.
                </li>
                <li>
                  Harap gunakan token dengan bijak dan pastikan kamu benar-benar
                  siap sebelum menggunakannya.
                </li>
              </ol>
            </Card>
            <Card className="p-6 shadow-md flex flex-col items-center text-center">
              <div className="font-bold text-lg mb-1">Olimpiade Biologi</div>
              <div className="mb-2">
                <span className="inline-block bg-blue-500 text-white rounded px-3 py-1 text-xs font-semibold">
                  Token : OSA-TOKEN-001
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                Waktu : 60 Menit
                <br />
                Jumlah Soal : 100
                <br />
                Mulai : 16.00
                <br />
                Akhir : 17.00
              </div>
              <Button className="w-full rounded-full bg-[#B63C3C] hover:bg-[#a12d2d] text-white text-base font-semibold py-2 mt-2 shadow-md">
                Mulai
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
/**
 * Fil * API Methods      / Endpoints :
 *      - GET       api/deskripsi-lomba/{id}   (Untuk menampilkan deskripsi lomba yang diikuti peserta)
 *      - GET       api/me                     (Untuk mendapatkan informasi peserta yang sedang login)
 *      - GET       api/peserta/ambil-token    (Untuk mendapatkan token peserta)
 *      - POST      api/peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)                 : landing_dashboard_peserta.tsx
 * Created                  : 2025-07-19
 * Last Updated             : 2025-07-19
 * Url                      : /dashboard-peserta
 * Description              : Landing dashboard untuk peserta aplikasi website perlombaan BFUB.
 *                            Menampilkan informasi lomba, dan informasi penting untuk peserta.
 * Functional               :
 *      - Menampilkan lomba yang diikuti peserta.
 *      - Menampilkan informasi penting terkait lomba untuk peserta.
 *      - Menyediakan tautan untuk mengakses halaman profil, logout, hasil lomba, dan pop up submit token CBT.
 * API Methods      / Endpoints  :
 *      - GET       /deskripsi-lomba/{id}   (Untuk menampilkan deskripsi lomba yang diikuti peserta)
 *      - GET       /me                     (Untuk mendapatkan informasi peserta yang sedang login)
 *      - GET       /peserta/ambil-token    (Untuk mendapatkan token peserta)
 *      - POST      /peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)
 * Table Activities         :
 *      - SELECT peserta dari aktivitas login untuk mendapatkan data peserta
 *      - SELECT lomba dari tabel cabang_lomba untuk menampilkan detail lomba
 *      - SELECT token dari tabel token untuk menampilkan dan memvalidasi token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan saat token digunakan
 * Anchor Links             :
 *      - profile_peserta.tsx   (untuk mengarahkan peserta ke halaman profil mereka)
 *      - hasil_lomba.tsx       (untuk mengarahkan peserta ke halaman hasil lomba)
 *      - soal_pg.tsx           (untuk mengarahkan peserta ke halaman soal cbt)
 */
