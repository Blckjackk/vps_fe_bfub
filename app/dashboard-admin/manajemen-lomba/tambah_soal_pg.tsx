/**
 * File                         : tambah_soal_pg.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-soal-pg
 * Description                  : Halaman dashboard admin untuk menambah soal pilihan ganda (PG) pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input untuk membuat soal PG baru beserta opsi jawaban dan kunci jawaban.
 * Functional                   :
 *      - Menampilkan form untuk menambah data soal PG baru.
 *      - Memungkinkan input pertanyaan, beberapa opsi jawaban, dan penentuan kunci jawaban.
 *      - Menyimpan data soal baru ke dalam sistem.
 *      - Validasi input untuk memastikan kualitas soal.
 * API Methods      / Endpoints :
 *      - POST      api/admin/soal/pg          (Untuk membuat/menambah data soal PG baru)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - INSERT soal pilihan ganda ke tabel soal
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */