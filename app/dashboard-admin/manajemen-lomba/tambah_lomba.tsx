/**
 * File                         : tambah_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-lomba
 * Description                  : Halaman dashboard admin untuk menambah lomba baru pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input data lomba dan aksi penyimpanan ke database.
 * Functional                   :
 *      - Menampilkan form untuk menambah data lomba baru.
 *      - Melakukan validasi terhadap input data pada form.
 *      - Menyimpan data lomba baru ke dalam sistem.
 *      - Redirect ke daftar lomba setelah berhasil menyimpan.
 * API Methods      / Endpoints :
 *      - POST      api/lomba                  (Untuk membuat/menambah data lomba baru)
 *      - GET       api/kategori               (Untuk mendapatkan daftar kategori lomba)
 * Table Activities             :
 *      - INSERT lomba ke tabel cabang_lomba
 *      - SELECT kategori dari tabel kategori untuk dropdown
 */