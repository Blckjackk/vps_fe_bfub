/**
 * File                     : landing_dashboard_peserta.tsx
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
 *      - GET       /api/deskripsi-lomba/{id}   (Untuk menampilkan deskripsi lomba yang diikuti peserta)
 *      - GET       /api/me                     (Untuk mendapatkan informasi peserta yang sedang login)
 *      - GET       /api/peserta/ambil-token    (Untuk mendapatkan token peserta)
 *      - POST      /api/peserta/cek-token      (Untuk mengecek token peserta)
 * Table Activities         :
 *      - SELECT peserta dari aktivitas login
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT token dari tabel token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 * Anchor Links             :
 *      - profile_peserta.tsx   (untuk mengarahkan peserta ke halaman profil mereka)
 *      - hasil_lomba.tsx       (untuk mengarahkan peserta ke halaman hasil lomba)
 *      - soal_pg.tsx           (untuk mengarahkan peserta ke halaman soal cbt)
 */