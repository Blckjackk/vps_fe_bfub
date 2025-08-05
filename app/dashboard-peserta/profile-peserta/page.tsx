/**
 * File                         : profile_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-peserta/profile-peserta
 * Description                  : Halaman profil peserta pada aplikasi website perlombaan BFUB.
 *                                Menampilkan informasi detail peserta dan memungkinkan edit profil.
 * Functional                   : 
 *      - Menampilkan informasi detail peserta.
 *      - Menyediakan form untuk mengedit profil peserta.
 *      - Memvalidasi dan menyimpan perubahan data profil.
 * API Methods      / Endpoints :
 *      - GET       api/me                     (Untuk mendapatkan informasi peserta yang sedang login)
 *      - PUT       api/peserta/update         (Untuk mengupdate data profil peserta)
 * Table Activities             :
 *      - SELECT peserta dari aktivitas login untuk menampilkan data profil
 *      - UPDATE peserta di tabel peserta untuk menyimpan perubahan profil
 * Anchor Links                 :
 *      - landing_dashboard_peserta.tsx (Untuk mengarahkan peserta ke halaman dashboard mereka)
 *      - hasil_lomba.tsx               (Untuk mengarahkan peserta ke halaman hasil lomba)
 */



'use client';

export default function ProfilePesertaPage() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFF] text-gray-800">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-16 px-8">
        <h1 className="text-2xl font-bold mb-10">Profile</h1>

         {/* Icon Avatar */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="18" r="9" stroke="#BDBDBD" strokeWidth="2" />
              <ellipse
                cx="24"
                cy="36"
                rx="14"
                ry="8"
                stroke="#BDBDBD"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
          <ProfileItem label="Nama" value="Ahmad Izzudin Azzam" />
          <ProfileItem label="No. Pendaftaran" value="202531489796" />
          <ProfileItem label="Asal Sekolah" value="SMAN 2 Bandung" />
          <ProfileItem label="Username" value="izzudin20" />
          <ProfileItem label="Password" value="**********" />
        </div>
      </main>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}
