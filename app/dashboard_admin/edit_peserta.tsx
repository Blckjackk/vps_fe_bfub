/**
 * File                         : edit_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/edit-peserta
 * Description                  : Halaman dashboard admin untuk mengedit data peserta perlombaan BFUB.
 *                                Menampilkan form edit data peserta dan aksi penyimpanan perubahan.
 * Functional                   :
 *      - Mengambil data peserta yang ada berdasarkan ID.
 *      - Menampilkan form yang sudah terisi dengan data peserta tersebut.
 *      - Memvalidasi input data yang diubah.
 *      - Menyimpan perubahan data peserta ke dalam sistem.
 * API Methods      / Endpoints :
 *      - GET       /api/v1/peserta/:id           (Untuk mengambil data peserta yang akan diedit)
 *      - PUT       /api/v1/peserta/:id           (Untuk menyimpan perubahan data peserta)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta
 *      - UPDATE peserta di tabel peserta
 */