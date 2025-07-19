/**
 * File                         : data_peserta.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/data-peserta
 * Description                  : Halaman dashboard admin untuk manajemen data peserta BFUB.
 *                                Menampilkan daftar peserta, detail, serta fitur pencarian, filter, dan ekspor.
 * Functional                   :
 *      - Menampilkan daftar semua peserta dengan paginasi.
 *      - Menyediakan fitur pencarian dan filter peserta.
 *      - Memungkinkan admin untuk menambah, melihat detail, mengedit, dan menghapus data peserta.
 *      - Menyediakan fitur untuk ekspor data peserta (misal: ke format CSV/Excel).
 * API Methods      / Endpoints :
 *      - GET       /api/v1/peserta               (Untuk menampilkan seluruh data peserta)
 *      - POST      /api/v1/peserta               (Untuk membuat/menambah data peserta baru)
 *      - GET       /api/v1/peserta/:id           (Untuk menampilkan detail satu peserta)
 *      - PUT       /api/v1/peserta/:id           (Untuk mengupdate data peserta yang dipilih)
 *      - DELETE    /api/v1/peserta/:id           (Untuk menghapus data peserta yang dipilih)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta
 *      - INSERT peserta ke tabel peserta
 *      - UPDATE peserta di tabel peserta
 *      - DELETE peserta dari tabel peserta
 */