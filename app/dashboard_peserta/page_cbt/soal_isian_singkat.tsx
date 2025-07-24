/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                     (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/isian-singkat         (Untuk mendapatkan daftar soal isian singkat)
 *      - GET       api/soal/isian-singkat/{nomor} (Untuk mendapatkan detail soal isian singkat spesifik)
 *      - POST      api/jawaban/isian-singkat      (Untuk menyimpan jawaban isian singkat)
 *      - GET       api/jawaban/isian-singkat      (Untuk mendapatkan jawaban yang sudah disimpan)
 *      - POST      api/peserta/cek-token          (Untuk mengecek dan memvalidasi token peserta)                      : soal_isian_singkat.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/soal-isian-singkat
 * Description                      : Halaman soal isian singkat untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal isian singkat dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal isian singkat.
 *      - Menyediakan form input untuk menjawab soal isian singkat.
 *      - Menyimpan atau mengupdate jawaban isian singkat peserta.
 *      - Menampilkan timer ujian dan auto-save jawaban.
 * API Methods      / Endpoints     :
 *      - GET       /durasi                     (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/isian-singkat         (Untuk mendapatkan daftar soal isian singkat)
 *      - GET       /soal/isian-singkat/{nomor} (Untuk mendapatkan detail soal isian singkat spesifik)
 *      - POST      /jawaban/isian-singkat      (Untuk menyimpan jawaban isian singkat)
 *      - GET       /jawaban/isian-singkat      (Untuk mendapatkan jawaban yang sudah disimpan)
 *      - POST      /peserta/cek-token          (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus               (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT soal dari tabel soal_isian_singkat
 *      - SELECT jawaban tersimpan dari tabel jawaban_isian_singkat
 *      - INSERT jawaban di tabel jawaban_isian_singkat
 *      - UPDATE jawaban di tabel jawaban_isian_singkat untuk auto-save
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */