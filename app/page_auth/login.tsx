/**
 * File                             : login.tsx
 * Created                          : 2025-07-19
 * Last Updated                     : 2025-07-19
 * Url                              : /login
 * Description                      : Halaman login untuk aplikasi website perlombaan BFUB.
 *                                    Menampilkan form login untuk autentikasi pengguna.
 * Functional                       :
 *      - Menampilkan form login (username dan password).
 *      - Melakukan autentikasi pengguna.
 *      - Menampilkan pesan error jika login gagal.
 *      - Redirect ke dashboard sesuai role (admin/peserta).
 * API Methods      / Endpoints     : 
 *      - POST      /login                  (untuk autentikasi pengguna admin dan peserta)
 * Table Activities                 :
 *      - SELECT admin dari tabel admin untuk autentikasi admin
 *      - SELECT peserta dari tabel peserta untuk autentikasi peserta
 *      - UPDATE last_login timestamp pada tabel yang sesuai
 * Anchor Links                     :
 *      - register.tsx (untuk mengarahkan pengguna ke halaman pendaftaran)
 */