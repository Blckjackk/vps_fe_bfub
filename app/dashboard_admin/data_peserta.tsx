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
 *      - Menampilkan status peserta (aktif, tidak aktif, dll).
 * API Methods      / Endpoints :
 *      - GET       api/admin/peserta          (Untuk menampilkan seluruh data peserta dengan pagination)
 *      - POST      api/admin/peserta          (Untuk membuat/menambah data peserta baru)
 *      - GET       api/admin/peserta/{id}     (Untuk menampilkan detail satu peserta)
 *      - PUT       api/admin/peserta/{id}     (Untuk mengupdate data peserta yang dipilih)
 *      - DELETE    api/admin/peserta/{id}     (Untuk menghapus data peserta yang dipilih)
 *      - GET       api/admin/export/excel     (Untuk ekspor data peserta ke Excel)
 * Table Activities             :
 *      - SELECT peserta dari tabel peserta dengan filter dan pagination
 *      - INSERT peserta ke tabel peserta
 *      - UPDATE peserta di tabel peserta
 *      - DELETE peserta dari tabel peserta
 *      - SELECT COUNT(*) untuk pagination
 * Anchor Links                 :
 *      - tambah_peserta.tsx
 *      - edit_peserta.tsx
 *      - import_file_peserta.tsx
 */