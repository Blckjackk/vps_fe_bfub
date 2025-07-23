/**
 * File                         : import_file_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/import-file-peserta
 * Description                  : Halaman dashboard admin untuk mengimpor file peserta lomba BFUB.
 *                                Memungkinkan admin untuk mengunggah dan memproses data peserta melalui file.
 * Functional                   :
 *      - Menyediakan antarmuka untuk mengunggah file (misal: CSV, Excel).
 *      - Melakukan validasi data dari file yang diunggah.
 *      - Memproses dan menyimpan banyak data peserta sekaligus ke sistem.
 *      - Menampilkan status dan hasil dari proses impor.
 *      - Auto-generate token untuk setiap peserta yang diimpor.
 * API Methods      / Endpoints :
 *      - POST      api/admin/import/peserta    (Untuk memproses file dan membuat data peserta secara massal)
 *      - GET       api/lomba                   (Untuk mendapatkan daftar lomba untuk assignment)
 * Table Activities             :
 *      - INSERT peserta ke tabel peserta (batch import)
 *      - INSERT token ke tabel token (auto-generate untuk peserta baru)
 *      - SELECT lomba dari tabel cabang_lomba untuk assignment
 */