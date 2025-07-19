/**
 * File                         : token_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/token-lomba
 * Description                  : Halaman dashboard admin untuk manajemen token lomba BFUB.
 *                                Menampilkan daftar token lomba, pembuatan token baru, dan penghapusan token.
 * Functional                   :
 *      - Menampilkan daftar token yang telah dibuat untuk setiap lomba.
 *      - Menyediakan fitur untuk membuat (generate) token baru secara massal.
 *      - Menyediakan fitur untuk menghapus token yang sudah ada atau tidak valid.
 *      - Menampilkan status token (aktif, digunakan, hangus).
 * API Methods      / Endpoints :
 *      - GET       api/admin/token                (Untuk menampilkan daftar semua token)
 *      - POST      api/admin/token/generate       (Untuk membuat/generate token baru secara massal)
 *      - DELETE    api/admin/token/{id}           (Untuk menghapus token yang dipilih)
 *      - GET       api/lomba                      (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - SELECT token dari tabel token dengan join ke tabel peserta dan cabang_lomba
 *      - INSERT token ke tabel token (generate secara massal)
 *      - DELETE token dari tabel token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 *      - UPDATE status_token diubah dari digunakan menjadi hangus
 */