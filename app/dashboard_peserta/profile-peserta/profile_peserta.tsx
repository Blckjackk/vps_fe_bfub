/**
 * File                         : profile_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-peserta/profile
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