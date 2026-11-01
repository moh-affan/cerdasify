# Desain Fitur: Game Edukasi ("Bermain")

> Status: **Diimplementasikan (Tahap 1–3 + Arcade)** · 1 November 2026 — lihat §10 untuk perbedaan dari draf awal
> Lingkup: math game, flip card memory, teka-teki silang matematika, hafalan kosakata bergambar, dan kerangka untuk game berikutnya.

---

## 1. Analisis

### 1.1. Apa yang sudah ada dan bisa dipakai ulang

| Aset yang sudah ada | Lokasi | Dipakai untuk |
|---|---|---|
| ~3.000 kosakata Inggris + arti + **emoji** + contoh kalimat | `content_vocab`, `src/db/seed-data/learning/english-*.ts` | Bahan Flip Card, Kosakata Bergambar, Susun Huruf. Emoji = "gambar" tanpa beban unduhan |
| Text-to-speech browser (`speechSynthesis`) | `src/components/learn/ReadingView.tsx` | Pengucapan kata saat kartu dibuka / mode "Dengar & Pilih" |
| Fase Kurikulum Merdeka A–F, L + `gradeToPhase()` | `src/lib/learning.ts` | Menentukan tingkat kesulitan & game yang tampil |
| Mode anak (`isKidsPhase`) | `src/lib/learning.ts` | Fase A–B: huruf besar, tanpa input keyboard, tombol besar |
| Streak harian (Asia/Jakarta) | `computeStreak`, `jakartaDateString` | Streak digabung: membaca **atau** bermain dihitung aktif |
| RBAC orang tua–anak (`users.parent_id`) | `/api/parent/*`, `/orang-tua` | Orang tua melihat statistik game anak |
| KaTeX `MathRenderer` | `src/components/katex/` | Soal matematika fase D+ (pecahan, pangkat) |
| PWA | `src/components/pwa/` | Game bisa dimainkan saat sinyal lemah; skor disinkronkan nanti |

### 1.2. Prinsip desain (diturunkan dari AGENTS.md)

1. **Ringan dulu.** Tanpa game engine (Phaser/Pixi ±1MB). Cukup React + CSS transform (flip 3D, animasi) + Web Audio (efek suara dibuat lewat kode, tanpa file mp3). Setiap game di-*lazy load* (`next/dynamic`) supaya bundle hub tetap kecil.
2. **Game = mesin + data.** Logika permainan (*engine*) ada di kode; isi (kata, rentang angka, petunjuk TTS) berupa data `game_sets`. Satu engine dipakai banyak set, misalnya engine *Memory Match* untuk "Hewan", "Buah", atau "Penjumlahan ≤ 10".
3. **Skor dinilai server.** Taruhannya tidak setinggi ujian, tapi bintang dan statistik di dasbor orang tua harus jujur. Server memutar ulang log jawaban (lihat §4).
4. **Ramah anak.** Tanpa papan peringkat publik, tanpa iklan, tanpa hukuman berat untuk jawaban salah (tidak ada skor minus di fase A–B), dan umpan balik selalu menjelaskan jawaban yang benar.
5. **Belajar, bukan sekadar main.** Setiap game terhubung ke kompetensi (operasi hitung, kosakata tema X) dan hasilnya memperbarui *mastery*.

### 1.3. Pemetaan game ke fase

| Game | A (SD 1–2) | B (SD 3–4) | C (SD 5–6) | D (SMP) | E–F / L |
|---|---|---|---|---|---|
| **Kilat Hitung** (math sprint) | +, − ≤ 20 | ×, ÷ tabel, ≤ 100 | campuran, desimal, pecahan sederhana | bilangan bulat negatif, pangkat, akar | aljabar cepat, persen (untuk TIU CPNS) |
| **Kartu Kembar** (flip memory) | kata ↔ gambar, 6 pasang | kata ↔ arti, 8 pasang | soal ↔ hasil, 10 pasang | rumus ↔ nama, istilah | — |
| **Silang Angka** (teka-teki silang matematika) | 3×3 +/−, angka ≤ 10 | +/−/×, ≤ 50 | 4 operasi, ≤ 100 | bilangan negatif | — |
| **TTS Kata** (teka-teki silang kata) | — | kosakata Inggris bergambar | istilah matematika / IPA | istilah | — |
| **Kosakata Bergambar** | Lihat & Pilih, Dengar & Pilih | + Susun Huruf | + Ketik Kata | per tema CEFR A2 | — |

---

## 2. Katalog Game

### 2.1. Kilat Hitung (Math Sprint) — engine `MATH_SPRINT`

- **Alur:** 60 detik untuk menjawab sebanyak mungkin soal. Kunci jawaban dari *keypad angka khusus* di layar. Keyboard bawaan HP tidak dipakai karena menutupi setengah layar dan lambat.
- **Adaptif:** 3 jawaban benar berturut-turut menaikkan level (rentang angka bertambah); 2 salah berturut-turut menurunkannya.
- **Soal dibuat prosedural** dari seed (PRNG deterministik, misalnya mulberry32), sehingga server bisa membuat ulang soal yang sama persis saat memvalidasi.
- **Varian dari engine yang sama (cukup config):**
  - *Kembar 10*: pasangan bilangan yang jumlahnya 10 (fase A)
  - *Lebih Besar/Kecil*: tekan `<`, `=`, atau `>` (fase A)
  - *Tabel Perkalian*: fokus satu tabel, misalnya ×7 (fase B)
  - *Hitung Cepat TIU*: persen dan pecahan untuk CPNS (fase L)
- **Bintang:** berdasarkan jumlah benar dan akurasi. Contoh: ★ ≥ 8 benar, ★★ ≥ 15, ★★★ ≥ 22 dengan akurasi ≥ 85%. Ambang ada di config set.

```jsonc
// config_json contoh
{ "durationSec": 60, "ops": ["+", "-"], "min": 0, "max": 20,
  "noNegativeResult": true, "adaptive": true, "stars": [8, 15, 22] }
```

### 2.2. Kartu Kembar (Flip Card Memory) — engine `MEMORY_MATCH`

- Kartu tertutup di grid (3×4 = 6 pasang, 4×4 = 8, 4×5 = 10). Buka dua kartu; jika berpasangan, keduanya tetap terbuka.
- **Jenis pasangan** (`pairMode`):
  - `WORD_EMOJI`: "cat" ↔ 🐱 (saat dibuka, kata **diucapkan** dengan TTS)
  - `WORD_MEANING`: "cat" ↔ "kucing"
  - `NUMBER_DOTS`: 5 ↔ ●●●●●
  - `EXPR_RESULT`: 3 + 4 ↔ 7 (prosedural; hasil di satu papan dibuat unik)
  - `CUSTOM`: pasangan bebas dari data, misalnya "segitiga" ↔ 🔺
- **Dua kartu sewarna:** sisi "kata" dan sisi "gambar" dibedakan dengan warna tepi supaya anak paham bahwa pasangannya harus beda jenis.
- **Bintang** dihitung dari jumlah langkah dibanding jumlah pasangan: ★★★ ≤ 1,5×, ★★ ≤ 2,2×, ★ selesai.
- **Animasi:** CSS `transform: rotateY(180deg)` + `backface-visibility: hidden`, dengan `prefers-reduced-motion` yang langsung mengganti tanpa animasi.
- **Akhir permainan:** daftar semua pasangan (kata, emoji, arti, tombol 🔊) sebagai rangkuman belajar.

### 2.3. Silang Angka (Teka-Teki Silang Matematika) — engine `CROSSMATH`

Grid persamaan yang saling bersilang. Setiap baris dan kolom ganjil adalah satu persamaan:

```
 ┌───┬───┬───┬───┬───┐
 │ 4 │ + │ ▢ │ = │ 9 │
 ├───┼───┼───┼───┼───┤
 │ + │   │ − │   │ − │
 ├───┼───┼───┼───┼───┤
 │ ▢ │ − │ 2 │ = │ ▢ │
 ├───┼───┼───┼───┼───┤
 │ = │   │ = │   │ = │
 ├───┼───┼───┼───┼───┤
 │ 7 │ + │ 3 │ = │ ▢ │
 └───┴───┴───┴───┴───┘
  Bank angka: [5] [3] [1] [10]
```

- **Generator:** pilih angka dan operator untuk 4 sel "bebas", hitung sisanya, lalu tolak kombinasi yang menghasilkan bilangan negatif, pembagian tidak bulat, atau angka di luar batas. Sembunyikan *k* sel sesuai tingkat kesulitan.
- **Input:**
  - Fase A–B memakai **bank angka**: ketuk angka lalu ketuk sel, tanpa keyboard.
  - Fase C+ memakai keypad dan boleh tanpa bank angka (mode sulit).
- **Validasi berbasis persamaan, bukan kunci.** Jawaban diterima jika *semua persamaan benar*. Kalau ada solusi alternatif yang sah, anak tidak disalahkan.
- **Bantuan:** tombol "Cek" menandai persamaan yang salah dengan warna merah lembut (bukan sel tertentu), sehingga anak tetap berpikir. Setiap "Cek" mengurangi bintang maksimal.
- Ukuran grid 5×5 (3 persamaan mendatar × 3 menurun) untuk semua fase; tingkat kesulitan diatur lewat rentang angka, operasi, bilangan negatif, dan jumlah kotak kosong.

### 2.4. TTS Kata (Teka-Teki Silang Kata) — engine `CROSSWORD`

- Petunjuk berupa emoji/gambar (fase B, kosakata Inggris) atau teks ("Bangun datar bersisi tiga" → SEGITIGA).
- **Tata letak dibuat saat seeding** (algoritma penempatan greedy), bukan di browser. Hasil grid disimpan di `items_json`, sehingga bisa diperiksa manusia dan tidak berubah antarpengguna.
- Input per huruf memakai keyboard huruf di layar (A–Z), auto-pindah ke kotak berikutnya, dan arah mendatar/menurun di-toggle dengan mengetuk sel dua kali.

### 2.5. Kosakata Bergambar (Hafalan) — engine `VOCAB_PICTURE`

Satu ronde berisi 10 kata dengan beberapa mode bergantian:

| Mode | Tampilan | Fase |
|---|---|---|
| **Kenalan** (flashcard) | 🐱 besar + "cat" + 🔊 + "kucing" | semua (untuk kata baru) |
| **Lihat & Pilih** | 🐱 → pilih dari 3–4 kata | A+ |
| **Dengar & Pilih** | 🔊 "cat" → ketuk gambar yang benar | A+ |
| **Susun Huruf** | 🐱 → susun `[t] [c] [a]` | B+ |
| **Ketik Kata** | 🐱 → ketik "cat" | C+ |

- **Pengulangan berjarak (Leitner, 5 kotak).** Setiap kata punya `box` 1–5. Benar naik satu kotak, salah kembali ke kotak 1. Jadwal ulang: 1, 2, 4, 7, 14 hari. Ronde berisi ±7 kata yang jatuh tempo + ±3 kata baru.
- **Pengecoh** diambil dari kata se-tema yang emojinya berbeda, supaya tidak muncul dua pilihan yang sama-sama 🐶.
- **Statistik "Kosakata dikuasai"** (kotak ≥ 4) tampil di profil anak dan dasbor orang tua.
- **Kurasi dek.** Tidak semua dari ~3.000 entri `content_vocab` cocok dipakai. Kata abstrak seperti "very" atau "the" tidak bisa diwakili emoji. Skrip `build-vocab-decks` mengekstrak kandidat (kata benda/kerja konkret dengan emoji, dedup), lalu hasilnya **diperiksa manual** sebelum disimpan sebagai dek di `seed-data/games/`, sesuai aturan verifikasi konten AGENTS.md.

### 2.6. Kandidat game berikutnya (roadmap)

Semua kandidat ini cukup ditambah sebagai engine baru tanpa perlu tabel baru:

- **Jam Analog** (fase A–B): putar jarum ke "setengah 4"
- **Uang Rupiah** (fase A–B): bayar Rp7.500 dengan koin dan uang kertas
- **Pecahan Pizza** (fase B–C): arsir ⅜ bagian
- **Tebak Pola** (fase A–C, juga TIU): 2, 4, 8, ▢
- **Timbangan Seimbang** (fase C–D): pengantar aljabar, x + 3 = 7
- **Susun Kalimat** (bahasa Inggris fase B–D): urutkan kata membentuk kalimat dari Daily Reading

---

## 3. Arsitektur

### 3.1. Rute

```
src/app/(dashboard)/bermain/page.tsx          # Hub: daftar game per fase (RSC)
src/app/(dashboard)/bermain/[slug]/page.tsx   # Halaman main (RSC shell + engine client lazy)
src/app/api/games/start/route.ts              # POST: buat sesi, kirim seed + payload
src/app/api/games/finish/route.ts             # POST: validasi log, hitung skor & bintang
src/app/api/games/vocab-round/route.ts        # POST: susun ronde kosakata (jatuh tempo + baru)
src/components/games/
  GameShell.tsx          # header, timer, tombol pause, layar hasil & bintang (dipakai semua engine)
  MathSprint.tsx  MemoryMatch.tsx  CrossMath.tsx  Crossword.tsx  VocabPicture.tsx
  NumberPad.tsx  LetterPad.tsx  StarResult.tsx
src/lib/games/
  rng.ts                 # PRNG deterministik (mulberry32) — dipakai client & server
  math-sprint.ts         # generateProblem(seed, level, config) + replay/validasi
  crossmath.ts           # generator & validator persamaan
  memory.ts              # pembuat papan + hitung bintang
  leitner.ts             # jadwal pengulangan kosakata
  sfx.ts                 # efek suara via Web Audio (tanpa file)
src/db/seed-data/games/  # definisi set game & dek kosakata (sumber kebenaran)
src/db/seed_games.ts     # npm run seed:games (idempoten, hormati edited_at)
```

Nama `/bermain` sejajar dengan `/belajar`. Di dasbor dan hub belajar ditambahkan kartu **"🎮 Bermain"**.

### 3.2. Skema database (baru)

```typescript
export const gameSets = pgTable('game_sets', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  engine: text('engine', {
    enum: ['MATH_SPRINT', 'MEMORY_MATCH', 'CROSSMATH', 'CROSSWORD', 'VOCAB_PICTURE'],
  }).notNull(),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  phaseMin: text('phase_min', { enum: PHASE_ENUM }).notNull(),
  phaseMax: text('phase_max', { enum: PHASE_ENUM }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  coverEmoji: text('cover_emoji'),
  configJson: text('config_json').notNull(),   // parameter engine (rentang angka, durasi, ambang bintang)
  itemsJson: text('items_json'),               // data kurasi: pasangan kartu, dek kata, grid TTS
  orderIndex: integer('order_index').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP::text`),
  editedAt: text('edited_at'),
});

export const gameSessions = pgTable('game_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gameSetId: text('game_set_id').notNull().references(() => gameSets.id, { onDelete: 'cascade' }),
  seed: integer('seed').notNull(),
  startedAt: text('started_at').notNull(),
  finishedAt: text('finished_at'),
  playDate: text('play_date').notNull(),       // YYYY-MM-DD Asia/Jakarta → streak gabungan
  score: integer('score').notNull().default(0),
  correct: integer('correct').notNull().default(0),
  total: integer('total').notNull().default(0),
  durationMs: integer('duration_ms'),
  stars: integer('stars').notNull().default(0), // 0–3
  status: text('status', { enum: ['IN_PROGRESS', 'COMPLETED', 'REJECTED'] })
    .notNull().default('IN_PROGRESS'),
});

export const gameProgress = pgTable('game_progress', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gameSetId: text('game_set_id').notNull().references(() => gameSets.id, { onDelete: 'cascade' }),
  bestScore: integer('best_score').notNull().default(0),
  bestStars: integer('best_stars').notNull().default(0),
  plays: integer('plays').notNull().default(0),
  lastPlayedAt: text('last_played_at').notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.gameSetId] })]);

export const vocabMastery = pgTable('vocab_mastery', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  wordKey: text('word_key').notNull(),          // 'en:cat' (huruf kecil, bahasa + kata dasar)
  box: integer('box').notNull().default(1),     // 1–5 (Leitner)
  dueDate: text('due_date').notNull(),          // YYYY-MM-DD
  correctCount: integer('correct_count').notNull().default(0),
  wrongCount: integer('wrong_count').notNull().default(0),
  lastSeenAt: text('last_seen_at').notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.wordKey] })]);
```

Indeks: `game_sessions (user_id, play_date)` untuk streak dan dasbor orang tua, serta `vocab_mastery (user_id, due_date)`. Semua perubahan ditulis juga di `src/db/migrate.ts` secara idempoten.

**Mengapa tabel terpisah dari `learning_contents`?** Aturan "satu model generik" berlaku untuk konten **bacaan**. Game punya siklus hidup berbeda: dimainkan berulang kali, punya skor per sesi, dan config engine. Dengan tetap satu tabel generik `game_sets` untuk semua engine, prinsip yang sama tetap terjaga: tidak ada tabel per jenis game.

### 3.3. Alur data satu sesi

```
Browser                                   Server
───────                                   ──────
GET /bermain/silang-angka-a  ───────────▶ RSC: ambil game_set (tanpa data rahasia), progres terbaik
klik "Main"
POST /api/games/start {slug} ───────────▶ insert game_sessions(seed, IN_PROGRESS)
                             ◀─────────── { sessionId, seed, config, items }
main (lokal, instan, tanpa
round-trip per jawaban)
POST /api/games/finish       ───────────▶ 1. sesi milik user & IN_PROGRESS
  { sessionId, log: [...] }              2. replay log dengan seed → hitung ulang skor
                                          3. cek kewajaran waktu
                                          4. db.transaction: update sesi + upsert game_progress
                                             (+ vocab_mastery untuk VOCAB_PICTURE)
                             ◀─────────── { score, stars, isNewBest, review }
```

**Tamu (belum login)** tetap bisa bermain. Seed dibuat di browser, `start`/`finish` tidak dipanggil, dan setelah selesai muncul ajakan masuk akun untuk menyimpan bintang.

---

## 4. Integritas Skor

Game tidak tunduk pada aturan "kunci haram" ujian, karena soal hitung `3 + 4` jelas bisa dihitung sendiri oleh klien. Yang dijaga adalah **kejujuran skor** di dasbor orang tua:

| Engine | Cara server memvalidasi |
|---|---|
| `MATH_SPRINT` | Buat ulang deret soal dari `seed` + level adaptif sesuai log, cocokkan setiap jawaban. Log berisi `[jawaban, ms]` per soal. Tolak jika rata-rata < 400 ms/soal atau total waktu > durasi + 5 detik |
| `CROSSMATH` | Bangun ulang puzzle dari seed, isi sel kosong dari log, lalu periksa semua persamaan |
| `MEMORY_MATCH` | Log berisi urutan pasangan kartu yang dibuka. Server membuat ulang papan dari seed, memutar ulang, menghitung langkah, dan memastikan semua pasangan cocok |
| `CROSSWORD` | Bandingkan isi grid dengan `items_json` (jawaban tidak dikirim ke klien; klien hanya menerima pola grid + petunjuk) |
| `VOCAB_PICTURE` | Ronde disusun server (`vocab-round`) dan disimpan di sesi. Log berisi pilihan per butir, lalu dinilai server dan Leitner diperbarui di server |

Aturan lain:
- `finish` idempoten (kiriman ulang mendapat hasil yang sama) dan diterima hingga 7 hari setelah sesi dimulai (antrean offline). Sesi yang tidak pernah diselesaikan tetap `IN_PROGRESS` dan tidak dihitung di statistik.
- Rate limit `start` memakai `checkRateLimit` (misalnya 60 sesi/jam/user) supaya tabel sesi tidak dibanjiri.
- Error dikembalikan lewat `apiError()`.
- Tidak ada papan peringkat publik, sehingga insentif curang rendah. Validasi ini terutama menjaga statistik yang dibaca orang tua.

---

## 5. UX & Tampilan (mobile 360px)

### 5.1. Hub `/bermain`

```
┌──────────────────────────────┐
│ ← Bermain        🔥 5  ⭐ 42 │
│ [Fase A ▾]  Semua·Mat·Inggris│
├──────────────────────────────┤
│ 🎯 Tantangan hari ini        │
│ ┌──────────────────────────┐ │
│ │ 🐾 Kosakata: Hewan       │ │
│ │ 8 kata perlu diulang  ▶  │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ 🔢 Matematika                │
│ ┌──────────┐ ┌──────────┐    │
│ │ ⚡        │ │ ✖️➕      │    │
│ │Kilat     │ │Silang    │    │
│ │Hitung    │ │Angka     │    │
│ │ ★★☆      │ │ ☆☆☆ Baru │    │
│ └──────────┘ └──────────┘    │
│ 🇬🇧 Bahasa Inggris           │
│ ┌──────────┐ ┌──────────┐    │
│ │ 🃏 Kartu  │ │ 🖼️ Kosa   │    │
│ │ Kembar   │ │ kata     │    │
│ └──────────┘ └──────────┘    │
└──────────────────────────────┘
```

"Tantangan hari ini" diambil dari kata yang jatuh tempo (Leitner) atau game yang belum pernah dimainkan.

### 5.2. Layar main (contoh Kartu Kembar fase A)

```
┌──────────────────────────────┐
│ ✕   Kartu Kembar: Hewan   ⏸ │
│ Langkah 7 · Pasangan 3/6     │
├──────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐         │
│ │ ?  │ │ 🐱 │ │ ?  │         │
│ └────┘ └────┘ └────┘         │
│ ┌────┐ ┌────┐ ┌────┐         │
│ │cat │ │ ?  │ │ ✓  │         │
│ └────┘ └────┘ └────┘         │
│ ┌────┐ ┌────┐ ┌────┐         │
│ │ ?  │ │ ✓  │ │ ?  │         │
│ └────┘ └────┘ └────┘         │
│ ┌────┐ ┌────┐ ┌────┐         │
│ │ ✓  │ │ ?  │ │ ✓  │         │
│ └────┘ └────┘ └────┘         │
└──────────────────────────────┘
```

### 5.3. Aturan UX umum

- Target ketuk ≥ 48px. Layar main memakai mode *distraction-free* seperti halaman ujian, tanpa navigasi dasbor.
- Efek suara bisa dimatikan (preferensi disimpan di `localStorage`). TTS memakai `lang: 'en-US'`.
- Jawaban salah ditandai getar ringan (`navigator.vibrate` bila ada) + warna, lalu **jawaban benar ditampilkan**. Tidak ada suara "buzzer" yang menakutkan.
- Pause menyembunyikan papan (overlay), konsisten dengan §2.5 AGENTS.md, supaya Kartu Kembar tidak bisa dicurangi dengan pause.
- Layar hasil: bintang, skor, "Rekor baru!", tombol **Main lagi** / **Game lain**, dan rangkuman materi (pasangan kata, soal yang salah + jawabannya).
- Aksesibilitas: dukung keyboard (panah + Enter), `aria-live` untuk umpan balik, warna benar/salah ditambah ikon ✓/✗ (aman untuk buta warna).

---

## 6. Integrasi dengan Fitur Lain

- **Streak gabungan.** `computeStreak` diberi gabungan `reading_progress.read_date` dan `game_sessions.play_date` (status `COMPLETED`). Hari dihitung aktif bila anak membaca atau bermain.
- **Dasbor orang tua** (`/orang-tua`, filter `parent_id = user.userId`): sesi minggu ini, menit bermain, akurasi per kompetensi, jumlah kosakata dikuasai, dan grafik 7 hari.
- **Tautan dari bacaan.** Di akhir Daily Reading muncul tombol "🃏 Main Kartu Kembar dengan kosakata bacaan ini". Ini memakai set dinamis dari `content_vocab` milik konten itu (engine `MEMORY_MATCH`, `pairMode: WORD_EMOJI`) tanpa set seed baru.
- **(Fase 3) Batas waktu bermain oleh orang tua.** Kolom `users.daily_game_minutes`. Setelah batas tercapai, game terkunci dan materi bacaan tetap terbuka.

---

## 7. Konten Awal (seed)

| Set | Engine | Fase | Isi |
|---|---|---|---|
| `kilat-tambah-kurang-20` | MATH_SPRINT | A | +, − ≤ 20 |
| `kembar-10` | MATH_SPRINT | A | pasangan jumlah 10 |
| `kilat-perkalian` | MATH_SPRINT | B–C | tabel 1–10 |
| `kilat-tiu` | MATH_SPRINT | D–L | persen, pecahan, desimal |
| `kartu-hewan`, `kartu-buah`, `kartu-warna`, `kartu-rumah`… | MEMORY_MATCH | A–B | 8–12 dek tema dari `content_vocab` |
| `kartu-hitung-10` | MEMORY_MATCH | A | `EXPR_RESULT` ≤ 10 |
| `silang-angka-a/b/c/d` | CROSSMATH | A–D | prosedural, 4 tingkat |
| `tts-istilah-matematika` | CROSSWORD | C–D | 3 grid kurasi |
| `kosakata-*` (per tema) | VOCAB_PICTURE | A–C | dek hasil kurasi |

Konten disimpan di `src/db/seed-data/games/` dan di-seed lewat `npm run seed:games` (idempoten, satu transaksi, tidak menimpa set dengan `edited_at` tanpa `--force`). Ini mengikuti pola `seed:learning`.

---

## 8. Rencana Pengerjaan

**Tahap 1 — MVP (fondasi + 3 game)**
1. Skema + migrasi idempoten, `seed_games.ts`, `npm run seed:games`
2. `lib/games/rng.ts` + generator/validator beserta unit test sederhana (replay = skor sama)
3. API `start` / `finish` (transaksi, `apiError`, rate limit)
4. `GameShell`, `NumberPad`, layar hasil bintang
5. Engine **Kilat Hitung**, **Kartu Kembar** (WORD_EMOJI, EXPR_RESULT), **Silang Angka**
6. Hub `/bermain` + kartu di dasbor

**Tahap 2 — Kosakata & Orang Tua**
7. Skrip kurasi dek + review manual, engine **Kosakata Bergambar** + Leitner (`vocab_mastery`)
8. Streak gabungan, statistik game di `/orang-tua`
9. Tombol "Main dengan kosakata bacaan ini" di ReadingView

**Tahap 3 — Perluasan**
10. Engine **TTS Kata** + generator tata letak saat seed
11. Editor set game di panel admin (`/admin/game`), `npm run games:export` (pola bank soal)
12. Antrian skor offline (PWA), batas waktu bermain, game baru (Jam, Uang, Pecahan, Pola)

---

## 9. Keputusan Terbuka

| Pertanyaan | Rekomendasi |
|---|---|
| Papan peringkat? | **Tidak** untuk publik. Mungkin "tantangan antarsaudara" dalam satu orang tua di Tahap 3 |
| Tamu boleh main? | **Ya**, tanpa simpan skor. Ini pintu masuk pengguna baru |
| Gambar asli vs emoji? | **Emoji dulu** (0 KB, konsisten). Kolom `image_url` opsional per item untuk kata yang tidak punya emoji yang pas (gambar WebP ≤ 640px, orisinal/AI, sesuai §2.7) |
| Hadiah/XP/lencana? | Bintang + streak cukup untuk MVP. Lencana koleksi ("Ahli Perkalian ×7") di Tahap 3 |
| Nama rute | `/bermain` (sejajar `/belajar`) |

---

## 10. Catatan Implementasi (perbedaan dari draf)

- **Data seed berupa TypeScript** (`src/db/seed-data/games/index.ts`, `vocab-decks.ts`) seperti Pustaka Belajar, bukan JSON. Set yang dibuat/diedit admin diekspor ke `admin-overrides.json` lewat `npm run games:export` dan diterapkan seeder di atas set bawaan.
- **TTS Kata** menyimpan `{ words, layout }`; tata letak dihitung ulang setiap seeding/simpan admin. Browser hanya menerima pola grid + petunjuk; "Cek" & "Bantuan huruf" lewat `POST /api/games/crossword`.
- **Silang Angka**: grid 5×5 untuk semua fase (lihat §2.3); generator memilih kandidat dengan operasi paling beragam agar puzzle × / ÷ tidak didominasi "+".
- **Status sesi** tanpa `ABANDONED` (lihat §4).
- **Kartu kosakata bacaan** memakai satu set `kartu-kosakata-bacaan` (`config.source = CONTENT_VOCAB`) yang tidak tampil di hub; dibuka dari halaman bacaan dengan `?konten=slug`.
- **Batas bermain orang tua** (`users.daily_game_minutes`) sudah diterapkan di Tahap 3: dicek saat `start` dan ditampilkan di layar awal game & hub.
- Konten awal: 9 Kilat Hitung, 4 Silang Angka, 13 Kartu Kembar, 5 TTS Kata (bangun datar & ruang, bilangan, IPA, Animals, Fruits), 14 dek Kosakata Bergambar (≈ 250 kata) — total 45 set.

---

## 11. Game Arcade (Tahap 4)

Empat engine arcade dengan ronde singkat, combo, dan nyawa — tetap ringan (DOM + `requestAnimationFrame`, emoji, tanpa aset) dan skornya tetap dinilai server.

| Game | Mekanik | Set bawaan |
|---|---|---|
| 🎈 **Balon Hitung** (`BALLOON_POP`) | Balon naik; ketuk yang sesuai aturan. Aturan berganti tiap 15–25 detik. | genap/ganjil, hasil hitung, kelipatan, perkalian, Pop the Balloons (hewan/buah/kendaraan), Pop the Words |
| 🧺 **Tangkap Benda** (`CATCHER`) | Benda jatuh di 5 kolom; geser keranjang; benda salah = −1 nyawa. | hewan terbang/air/berkaki empat, mengapung/tenggelam, makanan sehat, angka, kelipatan |
| 🏃 **Lari Jawaban** (`LANE_RUNNER`) | 3 jalur; gerbang jawaban mendekat makin cepat; jalur saat gerbang sampai = jawaban. | hitung, perkalian, campuran, TIU, kosakata hewan/sekolah, dengar & pilih buah, arti kata kerja |
| 🏰 **Jaga Benteng** (`TOWER_DEFENSE`) | Robot bersoal turun ke benteng; ketik jawaban; bos bersoal cerita tiap gelombang. | kembar 10, tambah-kurang, kali-bagi, bilangan bulat, TIU (diskon & perbandingan berbalik nilai) |

**Integritas:** jadwal (waktu, posisi, isi, benar/salah) dihasilkan dari seed dan tidak dipengaruhi pemain; log hanya aksi bercap waktu permainan. Klien dan server memakai fungsi replay yang sama, server menolak log yang tidak sah (balon fiktif, waktu mundur) dan permainan yang "selesai" lebih cepat dari jadwal. Bintang memperhitungkan ketepatan agar mengetuk/mengetik asal tidak menguntungkan.

**Belum dibuat (usulan lanjutan):** Peta Petualangan, album stiker & avatar, misi harian, dan duel 2 pemain di satu HP.
