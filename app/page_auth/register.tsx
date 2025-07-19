/**
 * File                             : register.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /register
 * Description                      : Halaman registrasi akun untuk aplikasi website perlombaan BFUB.
 *                                    Menampilkan form pendaftaran akun baru untuk peserta lomba.
 * Functional                       : 
 *      - Menampilkan form registrasi akun.
 *      - Validasi input pengguna.
 *      - Menyimpan data registrasi ke backend.
 * API Methods      / Endpoints     :
 *      - POST      /api/register (untuk menyimpan data registrasi peserta baru)
 * Table Activities                 :
 *      - INSERT data peserta baru ke tabel peserta.
 *      - INSERT 5 data token untuk peserta baru ke tabel token.
 * Anchor Links                     :
 *      - login.tsx (untuk mengarahkan pengguna ke halaman login jika sudah memiliki akun)
 */