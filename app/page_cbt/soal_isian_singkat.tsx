/**
 * File                             : soal_isian_singkat.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/soal-isian-singkat
 * Description                      : Halaman soal esai untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal isian singkat dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal isian singkat.
 *      - Menyediakan form untuk menjawab soal isian singkat.
 *      - Menyimpan atau mengupdate jawaban isian singkat peserta.
 * API Methods      / Endpoints     :
 *      - GET       /api/soal/isian-singkat             (Untuk mendapatkan daftar soal isian singkat)
 *      - GET       /api/soal/isian-singkat/{id}        (Untuk mendapatkan detail soal isian singkat)
 *      - POST      /api/jawaban/isian-singkat/{id}     (Untuk menyimpan jawaban isian singkat)
 *      - POST      /api/peserta/cek-token              (Untuk mengecek token peserta)
 *      - PATCH     /api/token-hangus                   (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT soal dari tabel soal
 *      - INSERT jawaban di tabel jawaban
 *      - UPDATE jawaban di tabel jawaban
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */