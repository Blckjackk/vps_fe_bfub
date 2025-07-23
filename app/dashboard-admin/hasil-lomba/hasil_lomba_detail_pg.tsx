/**
 * File                         : hasil_lomba_detail_pg.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba-detail-pg/{id}
 * Description                  : Halaman detail hasil lomba pilihan ganda untuk admin pada aplikasi website perlombaan BFUB.
 *                                Menampilkan detail hasil perlombaan, peserta, dan peringkat.
 * Functional                   :
 *      - Menampilkan informasi detail tentang satu lomba spesifik.
 *      - Menampilkan daftar semua peserta lomba tersebut beserta nilai dan peringkatnya.
 *      - Menyediakan fitur pencarian atau filter pada daftar peserta.
 *      - Menampilkan analisis jawaban dan statistik soal.
 * API Methods      / Endpoints :
 *      - GET       api/lomba/{id}                 (Untuk mendapatkan detail informasi lomba)
 *      - GET       api/pendaftaran/lomba/{id}     (Untuk mendapatkan daftar peserta yang terdaftar di lomba ini)
 *      - GET       api/nilai                      (Untuk mendapatkan data nilai yang kemudian dicocokkan dengan peserta)
 *      - GET       api/admin/jawaban/peserta      (Untuk analisis jawaban peserta)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba berdasarkan ID
 *      - SELECT pendaftaran dari tabel pendaftaran dengan filter lomba_id
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - SELECT peserta dari tabel peserta
 *      - SELECT jawaban dari tabel jawaban untuk analisis
 * Anchor Links                 :
 *      - hasil_lomba.tsx       (untuk kembali ke daftar hasil lomba)
 *      - data_peserta.tsx      (untuk melihat detail peserta)
 */