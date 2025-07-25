/**
 * File * API Methods      / Endpoints :
 *      - GET       api/durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       api/soal/pg                (untuk mendapatkan daftar soal pilihan ganda)
 *      - GET       api/soal/pg/{nomor}        (untuk mendapatkan detail soal pilihan ganda spesifik)
 *      - POST      api/jawaban/pg             (untuk menyimpan jawaban pilihan ganda)
 *      - POST      api/ujian/mulai            (ketika pertama kali masuk ke halaman soal)
 *      - POST      api/peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)                      : soal_pg.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/soal-pg
 * Description                      : Halaman soal pilihan ganda (CBT) untuk aplikasi website perlombaan BFUB.
 *                                    Menampilkan daftar soal pilihan ganda dan interaksi pengguna untuk menjawab soal.
 * Functional                       : 
 *      - Menampilkan daftar soal pilihan ganda berdasarkan lomba/sesi.
 *      - Memungkinkan pengguna memilih jawaban.
 *      - Menyimpan atau mengupdate jawaban pengguna ke database.
 *      - Menampilkan timer ujian dan auto-save jawaban.
 * API Methods      / Endpoints     : 
 *      - GET       /durasi                 (Untuk mendapatkan durasi ujian dari sistem)
 *      - GET       /soal/pg                (untuk mendapatkan daftar soal pilihan ganda)
 *      - GET       /soal/pg/{nomor}        (untuk mendapatkan detail soal pilihan ganda spesifik)
 *      - POST      /jawaban/pg             (untuk menyimpan jawaban pilihan ganda)
 *      - POST      /ujian/mulai            (ketika pertama kali masuk ke halaman soal)
 *      - POST      /peserta/cek-token      (Untuk mengecek dan memvalidasi token peserta)
 *      - PATCH     /token-hangus           (ketika peserta keluar dari halaman soal)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT jumlah soal dari tabel soal
 *      - SELECT soal dari tabel soal
 *      - SELECT jawaban dari input peserta
 *      - INSERT jawaban di tabel jawaban
 *      - UPDATE jawaban di tabel jawaban untuk auto-save
 *      - INSERT timestamp di tabel peserta
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 * Anchor Links                     :
 *     - konfirmasi_jawaban.tsx (untuk konfirmasi jawaban)
 */