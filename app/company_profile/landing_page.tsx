/**
 * File                             : landing_page.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /
 * Description                      : Landing page untuk profil aplikasi website perlombaan BFUB.
 *                                    Menampilkan informasi utama perlombaan, about BFUB, dan pendaftaran lomba.
 * Functional                       : 
 *      - Menampilkan informasi lomba.
 *      - Menampilkan informasi about BFUB.
 *      - Menampilkan informasi pendaftaran.
 * API Methods      / Endpoints     :
 *      - GET       /jenis-perlombaan       (untuk menampilkan jenis perlombaan yang tersedia)
 *      - GET       /pendaftaran-aktif      (untuk mengetahui periode lomba aktif/tidak aktif)
 * Table Activities                 :
 *      - SELECT cabang_lomba dari tabel cabang_lomba untuk menampilkan data cabang lomba yang tersedia
 *      - SELECT status pendaftaran dari sistem untuk menampilkan status aktif/nonaktif
 * Anchor Links                     :
 *      - register.tsx  (Untuk mengarahkan pengguna ke halaman pendaftaran)
 *      - login.tsx     (Untuk mengarahkan pengguna ke halaman login jika sudah memiliki akun)
 */