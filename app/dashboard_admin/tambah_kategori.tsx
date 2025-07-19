/**
 * File                         : tambah_kategori.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-kategori
 * Description                  : Halaman dashboard admin untuk menambah kategori lomba baru pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input untuk membuat kategori lomba baru.
 * Functional                   :
 *      - Menampilkan form untuk menambah kategori lomba baru.
 *      - Melakukan validasi terhadap input kategori.
 *      - Menyimpan data kategori baru ke dalam sistem.
 *      - Menampilkan daftar kategori yang sudah ada.
 * API Methods      / Endpoints :
 *      - GET       api/kategori               (Untuk menampilkan daftar kategori yang sudah ada)
 *      - POST      api/kategori               (Untuk membuat/menambah kategori baru)
 *      - PUT       api/kategori/{id}          (Untuk mengupdate kategori yang sudah ada)
 *      - DELETE    api/kategori/{id}          (Untuk menghapus kategori)
 * Table Activities             :
 *      - SELECT kategori dari tabel kategori
 *      - INSERT kategori ke tabel kategori
 *      - UPDATE kategori di tabel kategori
 *      - DELETE kategori dari tabel kategori
 */