/**
 * File                         : tambah_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-peserta
 * Description                  : Halaman dashboard admin untuk menambah peserta baru pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input data peserta dan aksi penyimpanan ke database.
 * Functional                   :
 *      - Menampilkan form untuk menambah data peserta baru.
 *      - Melakukan validasi terhadap input data pada form.
 *      - Menyimpan data peserta baru ke dalam sistem.
 *      - Auto-generate token untuk peserta baru.
 * API Methods      / Endpoints :
 *      - POST      api/admin/peserta          (Untuk membuat/menambah data peserta baru)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - INSERT peserta ke tabel peserta
 *      - INSERT token ke tabel token (auto-generate untuk peserta baru)
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */