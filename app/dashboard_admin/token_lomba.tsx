/**
 * File                         : token_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/token-lomba
 * Description                  : Halaman dashboard admin untuk manajemen token lomba BFUB.
 *                                Menampilkan daftar token lomba, pembuatan token baru, dan penghapusan token.
 * Functional                   :
 *      - Menampilkan daftar token yang telah dibuat untuk setiap lomba.
 *      - Menyediakan fitur untuk membuat (generate) token baru.
 *      - Menyediakan fitur untuk menghapus token yang sudah ada atau tidak valid.
 * API Methods      / Endpoints :
 *      - GET       /api/v1/token_lomba             (Untuk menampilkan daftar token)
 *      - POST      /api/v1/token_lomba             (Untuk membuat/generate token baru)
 *      - DELETE    /api/v1/token_lomba/:id         (Untuk menghapus token yang dipilih)
 * Table Activities             :
 *      - SELECT token dari tabel token
 *      - INSERT token ke tabel token
 *      - DELETE token dari tabel token
 *      - UPDATE status_token diubah dari aktif menjadi digunakan
 */