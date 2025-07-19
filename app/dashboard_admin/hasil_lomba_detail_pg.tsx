/**
 * File                         : hasil_lomba_detail_pg.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba-detail-pg
 * Description                  : Halaman detail hasil lomba untuk admin pada aplikasi website perlombaan BFUB.
 *                                Menampilkan detail hasil perlombaan, peserta, dan peringkat.
 * Functional                   :
 *      - Menampilkan informasi detail tentang satu lomba spesifik.
 *      - Menampilkan daftar semua peserta lomba tersebut beserta nilai dan peringkatnya.
 *      - Menyediakan fitur pencarian atau filter pada daftar peserta.
 * API Methods      / Endpoints :
 *      - GET       /api/v1/lomba/:id                  (Untuk mendapatkan detail informasi lomba)
 *      - GET       /api/v1/pendaftaran/lomba/:id      (Untuk mendapatkan daftar peserta yang terdaftar di lomba ini)
 *      - GET       /api/v1/nilai                      (Untuk mendapatkan data nilai yang kemudian dicocokkan dengan peserta)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT pendaftaran dari tabel pendaftaran
 *      - SELECT nilai dari tabel nilai
 *      - SELECT peserta dari tabel peserta
 */