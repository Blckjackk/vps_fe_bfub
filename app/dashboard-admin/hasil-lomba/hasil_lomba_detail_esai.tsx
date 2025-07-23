/**
 * File                         : hasil_lomba_detail_esai.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba-detail-esai/{id}
 * Description                  : Halaman detail hasil lomba kategori esai pada dashboard admin BFUB.
 *                                Menampilkan informasi detail peserta, nilai, dan status lomba esai.
 * Functional                   :
 *      - Menampilkan detail peserta lomba esai berdasarkan ID lomba.
 *      - Menampilkan nilai dan status hasil lomba untuk setiap peserta.
 *      - Menyediakan fitur untuk verifikasi dan mengupdate nilai atau status hasil lomba (misal: "diverifikasi").
 *      - Download file jawaban esai peserta untuk review.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}                 (Untuk mendapatkan detail informasi lomba)
 *      - GET       api/pendaftaran/lomba/{id}     (Untuk mendapatkan daftar peserta di lomba ini)
 *      - GET       api/nilai                      (Untuk mendapatkan data nilai yang akan ditampilkan dan diedit)
 *      - PUT       api/nilai/{id}                 (Untuk mengupdate/memverifikasi nilai atau status hasil seorang peserta)
 *      - GET       api/admin/export/files         (Untuk download file jawaban esai)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - SELECT pendaftaran dari tabel pendaftaran dengan filter lomba_id
 *      - SELECT peserta dari tabel peserta
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - UPDATE nilai di tabel nilai untuk verifikasi
 *      - SELECT file jawaban dari storage untuk download
 * Anchor Links                 :
 *      - hasil_lomba.tsx       (untuk kembali ke daftar hasil lomba)
 *      - data_peserta.tsx      (untuk melihat detail peserta)
 */