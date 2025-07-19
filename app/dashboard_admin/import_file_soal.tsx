/**
 * File                         : import_file_soal.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/import-file-soal
 * Description                  : Halaman dashboard admin untuk mengimpor file soal perlombaan BFUB.
 *                                Memungkinkan admin untuk mengunggah dan memproses file soal ke sistem.
 * Functional                   :
 *      - Menyediakan antarmuka untuk mengunggah file soal (misal: CSV, Excel).
 *      - Melakukan validasi data dari file yang diunggah.
 *      - Memproses dan menyimpan banyak data soal sekaligus ke sistem.
 *      - Menampilkan status dan hasil dari proses impor.
 *      - Support import untuk semua jenis soal (PG, Essay, Isian Singkat).
 * API Methods      / Endpoints :
 *      - POST      api/admin/import/soal      (Untuk memproses file dan membuat data soal secara massal)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk assignment)
 * Table Activities             :
 *      - INSERT soal ke tabel soal (batch import)
 *      - INSERT soal ke tabel soal_essay (untuk soal essay)
 *      - INSERT soal ke tabel soal_isian_singkat (untuk soal isian singkat)
 *      - SELECT lomba dari tabel cabang_lomba untuk assignment
 */