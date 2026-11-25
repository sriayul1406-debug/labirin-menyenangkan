# Misi Penyelamatan di Labirin Ajaib — Panduan

Game web untuk anak TK A (4–5 tahun). Murni HTML + CSS + JavaScript (tanpa npm, tanpa build, tanpa server), sehingga bisa di-deploy ke Vercel hanya dengan mengunggah folder ini.

## Struktur folder
```
index.html          halaman utama (HARUS berada di paling luar repository)
css/style.css       tampilan
js/sprites.js       gambar pixel art (monyet, kelinci, monster, apel, dll.), dibuat dari teks
js/questions.js     BANK SOAL + pengaturan (jumlah nyawa monster, aturan bintang)
js/maze.js          pembuat labirin acak (selalu ada jalan keluar)
js/audio.js         musik, efek suara, narasi bahasa Indonesia
js/game.js          alur permainan (prolog, 3 level, reward)
```

## Tahap 1 — Persiapan file
1. Unduh `Misi-Penyelamatan-Labirin-Ajaib.zip`.
2. Klik kanan → **Extract All** (Windows) atau klik dua kali (Mac).
3. Buka folder hasil ekstrak sampai terlihat `index.html`, folder `css`, dan folder `js`. Itulah isi yang harus diunggah.
4. Coba dulu: klik dua kali `index.html` (pakai Google Chrome).

## Tahap 2 — Upload ke GitHub
1. Buka https://github.com dan login (atau daftar gratis).
2. Klik **+** kanan atas → **New repository**.
3. Repository name: `misi-labirin-ajaib` → pilih **Public** → **Create repository**.
4. Klik tautan **uploading an existing file**.
5. Pilih SEMUA isi folder proyek (`index.html`, `css`, `js`, `PANDUAN.md`) lalu drag ke halaman GitHub. Jangan drag folder induknya.
6. Tunggu selesai, tulis pesan "versi pertama", klik **Commit changes**.
7. Cek: di halaman repo, `index.html`, `css`, `js` harus terlihat langsung di daftar paling atas.

## Tahap 3 — Deploy ke Vercel
1. Buka https://vercel.com → **Sign Up** → **Continue with GitHub**.
2. **Add New… → Project** → pilih repo `misi-labirin-ajaib` → **Import**.
3. Framework Preset: **Other**. Build Command dan Output Directory: **kosongkan** (tidak dibutuhkan). Root Directory: biarkan `./`.
4. Klik **Deploy**, tunggu ±30 detik.
5. Klik **Visit** untuk melihat game. Alamat itulah yang dibagikan.

## Tahap 4 — Verifikasi di website yang sudah online
- Ketuk "Ketuk untuk mulai": narasi prolog harus terdengar dan teks muncul bertahap.
- Level 1: jalankan monyet ke dekat pintu → kuis muncul → jawab benar → pintu terbuka → kelinci selamat → bintang → Lanjut.
- Level 2: ulangi, 4 soal berurutan. Level 3: ketuk gelembung berisi jawaban benar sampai monster pergi.
- Cek tombol atas: menu, ulangi instruksi, jeda, volume/musik.
- Masalah umum: **404/halaman kosong** → `index.html` masuk ke dalam folder; unggah ulang isinya ke paling luar. **Suara tidak ada** → naikkan volume perangkat; di iPhone matikan mode senyap.

## Tahap 5 — Update game
1. Buka repo di GitHub → klik file (mis. `js/questions.js`) → ikon pensil.
2. Edit → **Commit changes**.
3. Vercel otomatis deploy ulang (±1 menit). Muat ulang halaman game (Ctrl+F5).

## Mengubah / menambah soal
Buka `js/questions.js`. Contoh menambah soal hewan:
```
{say:'Hewan apa yang bersuara meong?',pilihan:['kucing','anjing','ayam'],benar:'kucing'},
```
Nama gambar yang tersedia: kucing, anjing, ayam, lingkaran, persegi, segitiga, merah, biru, kuning, hijau, dan angka. Jumlah nyawa monster: `vidaMonster` (sekarang 4).

## Tentang suara narasi
Narasi memakai Text-to-Speech bawaan browser/perangkat (bahasa Indonesia, `id-ID`).
- Kelebihan: gratis, tidak perlu file audio, mudah mengubah kalimat.
- Keterbatasan: kualitas suara bergantung perangkat (Chrome/Android dan Safari/iPhone biasanya bagus; beberapa PC tidak punya suara Indonesia). Bila suara tidak tersedia, game tetap jalan: setiap pertanyaan juga tertulis di layar dan tombol Lanjut tetap aktif.
- Alternatif yang lebih natural: rekam suara manusia (MP3) per kalimat, lalu ganti pemanggilan `speak()` dengan pemutaran file. Bisa saya buatkan bila Anda menyediakan rekamannya.
