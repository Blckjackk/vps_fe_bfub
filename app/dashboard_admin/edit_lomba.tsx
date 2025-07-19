/**
 * File                         : edit_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/edit-lomba
 * Description                  : Halaman dashboard admin untuk mengedit data lomba pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form untuk mengubah detail lomba yang sudah ada.
 * Functional                   :
 *      - Mengambil data lomba yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data lomba tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data lomba ke dalam sistem.
 * API Methods      / Endpoints :
 *      - GET       /api/v1/lomba/:id           (Untuk mengambil data lomba yang akan diedit)
 *      - PUT       /api/v1/lomba/:id           (Untuk menyimpan perubahan data lomba)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - UPDATE lomba di tabel cabang_lomba
 */