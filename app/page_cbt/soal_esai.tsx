/**
 * File                             : soal_esai.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/soal-esai
 * Description                      : Halaman soal esai untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal esai dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal esai.
 *      - Menyediakan form untuk menjawab soal esai.
 *      - Menyimpan atau mengupdate jawaban esai peserta.
 * API Methods      / Endpoints     :
 *      - GET       /api/soal/esai          (Untuk mendapatkan daftar soal esai)
 *      - GET       /api/soal/esai/{id}     (Untuk mendapatkan detail soal esai)
 *      - POST      /api/jawaban/esai/{id}  (Untuk menyimpan jawaban esai)
 *      - POST      /api/peserta/cek-token  (Untuk mengecek token peserta)
 *      - PATCH     /api/token-hangus       (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT soal dari tabel soal
 *      - INSERT jawaban di tabel jawaban
 *      - UPDATE jawaban di tabel jawaban
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */