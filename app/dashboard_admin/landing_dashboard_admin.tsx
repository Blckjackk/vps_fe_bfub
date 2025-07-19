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
 * API Methods      / Endpoints :
 *      - GET       /api/v1/lomba         (Untuk mendapatkan data statistik jumlah lomba)
 *      - GET       /api/v1/peserta       (Untuk mendapatkan data statistik jumlah peserta)
 *      - GET       /api/v1/pendaftaran   (Untuk mendapatkan data statistik jumlah pendaftaran)
 *      - GET       /api/v1/nilai         (Untuk mendapatkan data statistik hasil/nilai yang sudah masuk)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT peserta dari tabel peserta
 *      - SELECT pendaftaran dari tabel pendaftaran
 *      - SELECT nilai dari tabel nilai
 *      - SELECT token dari tabel token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 */