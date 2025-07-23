/**
 * File                         : edit_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/edit-lomba/{id}
 * Description                  : Halaman dashboard admin untuk mengedit data lomba pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form untuk mengubah detail lomba yang sudah ada.
 * Functional                   :
 *      - Mengambil data lomba yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data lomba tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data lomba ke dalam sistem.
 *      - Redirect ke daftar lomba setelah berhasil update.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}             (Untuk mengambil data lomba yang akan diedit)
 *      - PUT       api/lomba/{id}             (Untuk menyimpan perubahan data lomba)
 *      - GET       api/kategori               (Untuk mendapatkan daftar kategori lomba)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - UPDATE lomba di tabel cabang_lomba
 *      - SELECT kategori dari tabel kategori untuk dropdown
 */