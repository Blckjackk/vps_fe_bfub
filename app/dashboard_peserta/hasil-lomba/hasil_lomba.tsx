/**
 * File                         : hasil_lomba.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-peserta/hasil-lomba
 * Description                  : Halaman dashboard peserta untuk menampilkan hasil lomba BFUB.
 *                                Menampilkan daftar hasil lomba yang diikuti oleh peserta.
 * Functional                   : 
 *      - Menampilkan daftar hasil lomba peserta.
 *      - Menampilkan detail hasil, skor, dan peringkat peserta.
 *      - Menyediakan filter dan pencarian hasil lomba.
 * API Methods      / Endpoints :
 *      - GET       api/peserta/hasil          (Untuk mendapatkan hasil nilai lomba peserta yang sedang login)
 * Table Activities             :
 *      - SELECT nilai dari tabel nilai berdasarkan peserta_id untuk menampilkan hasil lomba peserta
 *      - SELECT lomba dari tabel cabang_lomba untuk menampilkan detail lomba
 *      - SELECT peserta dari tabel peserta untuk verifikasi kepemilikan hasil
 * Anchor Links                 :
 *      - landing_dashboard_peserta.tsx (Untuk mengarahkan peserta ke halaman dashboard mereka)
 *      - profile_peserta.tsx           (Untuk mengarahkan peserta ke halaman profil mereka)
 */