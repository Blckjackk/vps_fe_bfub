/**
 * File                         : tambah_soal_pg.tsx
 * Created                      : 2025-07-19
 * Last Updated                 : 2025-07-19
 * Url                          : /dashboard-admin/tambah-soal-pg
 * Description                  : Halaman dashboard admin untuk menambah soal pilihan ganda (PG) pada aplikasi website perlombaan BFUB.
 *                                Menyediakan form input untuk membuat soal PG baru beserta opsi jawaban dan kunci jawaban.
 * Functional                   :
 *      - Menampilkan form untuk menambah data soal PG baru.
 *      - Memungkinkan input pertanyaan, beberapa opsi jawaban, dan penentuan kunci jawaban.
 *      - Menyimpan data soal baru ke dalam sistem.
 *      - Validasi input untuk memastikan kualitas soal.
 * API Methods      / Endpoints :
 *      - POST      api/admin/soal/pg          (Untuk membuat/menambah data soal PG baru)
 *      - GET       api/lomba                  (Untuk mendapatkan daftar lomba untuk dropdown)
 * Table Activities             :
 *      - INSERT soal pilihan ganda ke tabel soal
 *      - SELECT lomba dari tabel cabang_lomba untuk dropdown
 */

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// API URL dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Lomba {
  id: number;
  nama_cabang: string;
}

export default function TambahSoalPG() {
  const [pertanyaan, setPertanyaan] = useState('');
  const [opsi, setOpsi] = useState<string[]>(['', '', '', '']);
  const [jawaban, setJawaban] = useState('');
  const [lombaId, setLombaId] = useState<string>('');
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/lomba`)
      .then(res => res.json())
      .then(data => setLombaList(data))
      .catch(() => toast.error('Gagal memuat data lomba.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaan || opsi.some(o => !o) || !jawaban || !lombaId) {
      toast.error('Harap lengkapi semua bidang.');
      return;
    }

    setLoading(true);
    const response = await fetch(`${API_URL}/api/admin/soal/pg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pertanyaan,
        opsi,
        jawaban,
        cabang_lomba_id: parseInt(lombaId),
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      toast.success('Soal berhasil ditambahkan.');
      setPertanyaan('');
      setOpsi(['', '', '', '']);
      setJawaban('');
      setLombaId('');
    } else {
      toast.error(result.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Tambah Soal Pilihan Ganda</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="lomba">Cabang Lomba</Label>
              <Select value={lombaId} onValueChange={setLombaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lomba" />
                </SelectTrigger>
                <SelectContent>
                  {lombaList.map((lomba) => (
                    <SelectItem key={lomba.id} value={String(lomba.id)}>
                      {lomba.nama_cabang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pertanyaan">Pertanyaan</Label>
              <Textarea
                id="pertanyaan"
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                placeholder="Masukkan pertanyaan soal"
              />
            </div>

            {opsi.map((value, index) => (
              <div key={index}>
                <Label htmlFor={`opsi${index}`}>Opsi {String.fromCharCode(65 + index)}</Label>
                <Input
                  id={`opsi${index}`}
                  value={value}
                  onChange={(e) => {
                    const updated = [...opsi];
                    updated[index] = e.target.value;
                    setOpsi(updated);
                  }}
                  placeholder={`Isi opsi ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}

            <div>
              <Label htmlFor="jawaban">Kunci Jawaban</Label>
              <Select value={jawaban} onValueChange={setJawaban}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kunci jawaban (A, B, C, D)" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((label, i) => (
                    <SelectItem key={label} value={String(i)}>
                      {label} - {opsi[i] || '-'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Soal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
