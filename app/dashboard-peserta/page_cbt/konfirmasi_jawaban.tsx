/**
 * File                             : konfirmasi_jawaban.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /page_cbt/konfirmasi_jawaban
 * Description                      : Halaman konfirmasi jawaban untuk CBT pada aplikasi website perlombaan BFUB.
 *                                    Menampilkan ringkasan jawaban peserta dan konfirmasi untuk menyelesaikan ujian.
 * Functional                       :
 *      - Menampilkan ringkasan jawaban yang telah dikerjakan peserta.
 *      - Menampilkan status pengerjaan soal (sudah dijawab/belum).
 *      - Menyediakan konfirmasi untuk menyelesaikan ujian.
 *      - Menampilkan sisa waktu ujian.
 * API Methods      / Endpoints     :
 *      - GET       /me                 (untuk mendapatkan informasi pengguna yang sedang login)
 *      - GET       /durasi             (Untuk mendapatkan durasi ujian)
 *      - GET       /status-jawaban     (Untuk mendapatkan status jawaban peserta dari semua jenis soal)
 *      - POST      /ujian/selesai      (untuk menyimpan waktu selesai ujian dan finalisasi)
 * Table Activities                 :
 *      - SELECT durasi ujian dari tabel cabang_lomba
 *      - SELECT informasi peserta dari pengguna yang sedang login
 *      - SELECT status jawaban dari tabel jawaban (PG, essay, isian singkat)
 *      - SELECT jumlah soal dari tabel soal untuk perbandingan
 *      - INSERT/UPDATE timestamp selesai ujian di tabel peserta
 *      - UPDATE status ujian menjadi selesai
 * Anchor Links                    :
 *      - soal_esai.tsx (untuk menampilkan soal esai)
 *      - soal_isian_singkat.tsx (untuk menampilkan soal isian singkat)
 *      - landing_dashboard_peserta.tsx (untuk menampilkan dashboard peserta)
 */