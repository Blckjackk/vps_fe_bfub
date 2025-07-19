/**
 * File                         : hasil_lomba_detail_esai.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba-detail-esai
 * Description                  : Halaman detail hasil lomba kategori esai pada dashboard admin BFUB.
 *                                Menampilkan informasi detail peserta, nilai, dan status lomba esai.
 * Functional                   :
 *      - Menampilkan detail peserta lomba esai berdasarkan ID lomba.
 *      - Menampilkan nilai dan status hasil lomba untuk setiap peserta.
 *      - Menyediakan fitur untuk verifikasi dan mengupdate nilai atau status hasil lomba (misal: "diverifikasi").
 * API Methods      / Endpoints :
 *      - GET       /api/v1/lomba/:id                  (Untuk mendapatkan detail informasi lomba)
 *      - GET       /api/v1/pendaftaran/lomba/:id      (Untuk mendapatkan daftar peserta di lomba ini)
 *      - GET       /api/v1/nilai                      (Untuk mendapatkan data nilai yang akan ditampilkan dan diedit)
 *      - PUT       /api/v1/nilai/:id                  (Untuk mengupdate/memverifikasi nilai atau status hasil seorang peserta)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT pendaftaran dari tabel pendaftaran
 *      - SELECT peserta dari tabel peserta
 *      - SELECT nilai dari tabel nilai
 *      - UPDATE nilai di tabel nilai
 */