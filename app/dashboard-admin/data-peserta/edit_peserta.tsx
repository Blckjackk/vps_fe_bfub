/**
 * File                         : edit_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/edit-peserta/{id}
 * Description                  : Halaman dashboard admin untuk mengedit data peserta perlombaan BFUB.
 *                                Menampilkan form edit data peserta dan aksi penyimpanan perubahan.
 * Functional                   :
 *      - Mengambil data peserta yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data peserta tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data peserta ke dalam sistem.
 *      - Redirect ke daftar peserta setelah berhasil update.
 * API Methods      / Endpoints :
 *      - GET       api/admin/peserta/{id}     (Untuk mengambil data peserta yang akan diedit)
 *      - PUT       api/admin/peserta/{id}     (Untuk menyimpan perubahan data peserta)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta berdasarkan ID
 *      - UPDATE peserta di tabel peserta
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */