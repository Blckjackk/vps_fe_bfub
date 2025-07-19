/**
 * File                         : landing_dashboard_admin.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin
 * Description                  : Landing dashboard untuk admin aplikasi website perlombaan BFUB.
 *                                Menampilkan ringkasan data lomba, statistik peserta, dan navigasi fitur admin.
 * Functional                   :
 *      - Menampilkan statistik ringkasan (misal: jumlah lomba, total peserta).
 *      - Menampilkan daftar pendaftar terbaru atau aktivitas terakhir.
 *      - Menyediakan navigasi ke fitur-fitur admin lainnya.
 *      - Menampilkan grafik dan chart untuk visualisasi data.
 * API Methods      / Endpoints :
 *      - GET       api/stats/lomba            (Untuk mendapatkan data statistik jumlah lomba)
 *      - GET       api/stats/peserta          (Untuk mendapatkan data statistik jumlah peserta)
 *      - GET       api/stats/pendaftaran      (Untuk mendapatkan data statistik jumlah pendaftaran)
 *      - GET       api/stats/nilai            (Untuk mendapatkan data statistik hasil/nilai yang sudah masuk)
 * Table Activities             :
 *      - SELECT COUNT(*) lomba dari tabel cabang_lomba
 *      - SELECT COUNT(*) peserta dari tabel peserta
 *      - SELECT COUNT(*) pendaftaran dari tabel pendaftaran
 *      - SELECT COUNT(*) nilai dari tabel nilai
 *      - SELECT COUNT(*) token aktif dari tabel token
 *      - SELECT recent activities untuk dashboard feed
 * Anchor Links                 :
 *      - daftar_lomba.tsx      (untuk mengarahkan ke manajemen lomba)
 *      - data_peserta.tsx      (untuk mengarahkan ke manajemen peserta)
 *      - hasil_lomba.tsx       (untuk mengarahkan ke hasil lomba)
 *      - token_lomba.tsx       (untuk mengarahkan ke manajemen token)
 */