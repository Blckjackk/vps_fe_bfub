/**
 * File                             : konfirmasi_jawaban.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/konfirmasi_jawaban
 * Description                      : Komponen untuk menampilkan dan mengelola tabel soal pilihan ganda pada halaman admin CBT.
 * Functional                       :
 *      - Menampilkan daftar soal pilihan ganda dalam bentuk tabel.
 *      - Menyediakan fungsi untuk menambah soal pilihan ganda baru.
 *      - Menyediakan fungsi untuk mengedit soal pilihan ganda yang ada.
 *      - Menyediakan fungsi untuk menghapus soal pilihan ganda.
 * API Methods      / Endpoints     :
 *      - GET       /api/me             (untuk mendapatkan informasi pengguna yang sedang login)
 *      - GET       /api/durasi         (Untuk mendapatkan durasi ujian)
 *      - GET       /api/status-jawaban (Untuk mendapatkan status jawaban peserta)
 *      - POST      /api/ujian/selesai  (untuk menyimpan waktu selesai ujian)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT informasi peserta dari pengguna yang sedang login
 *      - SELECT atribut soal_id dari tabel jawaban
 *      - SELECT tabel soal dan banyak soal
 *      - INSERT timestamp di tabel peserta
 * Anchor Links                    :
 *      - soal_esai.tsx (untuk menampilkan soal esai)
 *      - soal_isian_singkat.tsx (untuk menampilkan soal isian singkat)
 *      - landing_dashboard_peserta.tsx (untuk menampilkan dashboard peserta)
 */