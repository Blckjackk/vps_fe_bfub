/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/essay             (Untuk mendapatkan daftar soal esai)
 *      - GET       api/soal/esai/{id}         (Untuk mendapatkan detail soal esai spesifik)
 *      - POST      api/jawaban/esai/{id}      (Untuk menyimpan jawaban esai dalam bentuk teks)
 *      - POST      api/jawaban/essay/upload   (Untuk upload file jawaban esai)
 *      - GET       api/jawaban/essay          (Untuk preview file jawaban esai)
 *      - POST      api/peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)                     : soal_esai.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/soal-esai
 * Description                      : Halaman soal esai untuk CBT (Computer Based Test) pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal esai dan form untuk menjawab soal.
 * Functional                       :
 *      - Menampilkan daftar soal esai.
 *      - Menyediakan form untuk menjawab soal esai.
 *      - Menyimpan atau mengupdate jawaban esai peserta.
 *      - Upload file jawaban esai dalam format tertentu.
 * API Methods      / Endpoints     :
 *      - GET       /durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/essay             (Untuk mendapatkan daftar soal esai)
 *      - GET       /soal/esai/{id}         (Untuk mendapatkan detail soal esai spesifik)
 *      - POST      /jawaban/esai/{id}      (Untuk menyimpan jawaban esai dalam bentuk teks)
 *      - POST      /jawaban/essay/upload   (Untuk upload file jawaban esai)
 *      - GET       /jawaban/essay          (Untuk preview file jawaban esai)
 *      - POST      /peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus           (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT soal dari tabel soal_essay
 *      - SELECT jawaban tersimpan dari tabel jawaban_essay
 *      - INSERT jawaban di tabel jawaban_essay
 *      - UPDATE jawaban di tabel jawaban_essay
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */