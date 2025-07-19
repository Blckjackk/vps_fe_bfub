/**
 * File                         : hasil_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/hasil-lomba
 * Description                  : Halaman dashboard admin untuk melihat hasil lomba pada aplikasi website perlombaan BFUB.
 *                                Menampilkan ringkasan hasil perlombaan dan ranking peserta.
 * Functional                   :
 *      - Menampilkan daftar lomba yang sudah selesai.
 *      - Menampilkan ringkasan hasil dan statistik per lomba.
 *      - Menyediakan fitur untuk melihat detail hasil lomba.
 *      - Menampilkan ranking peserta secara keseluruhan.
 *      - Export hasil lomba ke berbagai format.
 * API Methods      / Endpoints :
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba)
 *      - GET       api/admin/hasil/lomba/{id} (Untuk mendapatkan hasil lomba spesifik)
 *      - GET       api/admin/ranking          (Untuk mendapatkan ranking peserta)
 *      - GET       api/admin/export/excel     (Untuk export hasil ke Excel)
 *      - GET       api/admin/export/files     (Untuk download file jawaban)
 * Table Activities             :
 *      - SELECT lomba dari tabel cabang_lomba
 *      - SELECT nilai dari tabel nilai dengan join ke peserta
 *      - SELECT jawaban dari tabel jawaban untuk analisis
 *      - SELECT COUNT dan AVG untuk statistik
 * Anchor Links                 :
 *      - hasil_lomba_detail_pg.tsx
 *      - hasil_lomba_detail_esai.tsx
 */