// Definisi set game bawaan (sumber kebenaran `npm run seed:games`).
// Set yang diedit lewat panel admin disimpan ke admin-overrides.json lewat `npm run games:export`.

import type { Phase } from '../../../lib/learning';
import type {
  CrossMathConfig,
  CrosswordConfig,
  CrosswordWord,
  CustomPair,
  GameEngine,
  MathSprintConfig,
  MemoryConfig,
  VocabCard,
  VocabConfig,
} from '../../../lib/games/types';
import type { DefenseConfig, FallingConfig, RunnerConfig } from '../../../lib/games/arcade';
import {
  DECK_ANIMALS,
  DECK_BODY,
  DECK_CLOTHES,
  DECK_COLORS,
  DECK_FEELINGS,
  DECK_FOOD,
  DECK_FRUITS,
  DECK_HOME,
  DECK_JOBS,
  DECK_NATURE,
  DECK_SCHOOL,
  DECK_TOYS_MUSIC,
  DECK_TRANSPORT,
  DECK_VERBS,
} from './vocab-decks';

export interface SeedGameSet {
  slug: string;
  engine: GameEngine;
  subjectId: string;
  phaseMin: Phase;
  phaseMax: Phase;
  title: string;
  description: string;
  emoji: string;
  config: unknown;
  /** Untuk CROSSWORD cukup { words }: tata letak dihitung seeder */
  items?: unknown;
}

const MATH = 'subj_math';
const ENGLISH = 'subj_english';
const SCIENCE = 'subj_science';

const sprint = (
  slug: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  description: string,
  emoji: string,
  config: MathSprintConfig
): SeedGameSet => ({ slug, engine: 'MATH_SPRINT', subjectId: MATH, phaseMin, phaseMax, title, description, emoji, config });

const crossmath = (
  slug: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  description: string,
  config: CrossMathConfig
): SeedGameSet => ({ slug, engine: 'CROSSMATH', subjectId: MATH, phaseMin, phaseMax, title, description, emoji: '✖️', config });

const memory = (
  slug: string,
  subjectId: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  description: string,
  emoji: string,
  config: MemoryConfig,
  items?: VocabCard[] | CustomPair[]
): SeedGameSet => ({ slug, engine: 'MEMORY_MATCH', subjectId, phaseMin, phaseMax, title, description, emoji, config, items });

const vocab = (
  slug: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  emoji: string,
  items: VocabCard[],
  config: Partial<VocabConfig> = {}
): SeedGameSet => ({
  slug,
  engine: 'VOCAB_PICTURE',
  subjectId: ENGLISH,
  phaseMin,
  phaseMax,
  title,
  description: `Hafalkan ${items.length} kosakata bahasa Inggris bergambar lengkap dengan suaranya.`,
  emoji,
  config: {
    roundSize: 10,
    newPerRound: 4,
    modes: ['LOOK_PICK', 'LISTEN_PICK', 'SPELL'],
    options: 4,
    speak: true,
    ...config,
  } satisfies VocabConfig,
  items,
});

const crossword = (
  slug: string,
  subjectId: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  description: string,
  emoji: string,
  config: CrosswordConfig,
  words: CrosswordWord[]
): SeedGameSet => ({ slug, engine: 'CROSSWORD', subjectId, phaseMin, phaseMax, title, description, emoji, config, items: { words } });

/** Kata TTS bahasa Inggris dengan petunjuk berupa arti + emoji, diambil dari dek. */
const enWords = (cards: VocabCard[], words: string[]): CrosswordWord[] =>
  words.map((w) => {
    const card = cards.find((c) => c.word === w);
    if (!card) throw new Error(`Kata "${w}" tidak ada di dek`);
    return { answer: card.word.toUpperCase(), clue: card.meaning, emoji: card.emoji };
  });

// ─── Matematika ─────────────────────────────────────────────────────────────

const MATH_SETS: SeedGameSet[] = [
  sprint('kilat-tambah-kurang-10', 'A', 'A', 'Kilat Hitung: Tambah & Kurang 10', 'Penjumlahan dan pengurangan sampai 10, makin lama makin menantang.', '⚡', {
    mode: 'ARITH', durationSec: 60, ops: ['+', '-'], max: 10, maxCap: 20, stars: [5, 10, 15],
  }),
  sprint('kembar-10', 'A', 'A', 'Kembar 10', 'Cari pasangan bilangan yang jumlahnya 10. Dasar berhitung cepat!', '🔟', {
    mode: 'MAKE_TARGET', durationSec: 60, ops: ['+'], max: 10, maxCap: 10, target: 10, stars: [6, 12, 18],
  }),
  sprint('bandingkan-angka', 'A', 'B', 'Lebih Besar atau Lebih Kecil?', 'Pilih tanda <, =, atau > secepat mungkin.', '⚖️', {
    mode: 'COMPARE', durationSec: 60, ops: ['+'], max: 20, maxCap: 100, stars: [8, 15, 22],
  }),
  sprint('kilat-tambah-kurang-100', 'B', 'B', 'Kilat Hitung: Sampai 100', 'Penjumlahan dan pengurangan sampai 100.', '⚡', {
    mode: 'ARITH', durationSec: 60, ops: ['+', '-'], max: 30, maxCap: 100, stars: [6, 12, 18],
  }),
  sprint('kilat-perkalian', 'B', 'C', 'Kilat Perkalian & Pembagian', 'Latih tabel perkalian 1–10 dan pembagiannya.', '✖️', {
    mode: 'ARITH', durationSec: 60, ops: ['×', '÷'], max: 10, maxCap: 10, factorMax: 5, factorCap: 10, stars: [6, 12, 18],
  }),
  sprint('kilat-campuran', 'C', 'C', 'Kilat Hitung Campuran', 'Empat operasi hitung bercampur.', '🧮', {
    mode: 'ARITH', durationSec: 60, ops: ['+', '-', '×', '÷'], max: 50, maxCap: 200, factorMax: 9, factorCap: 12, stars: [6, 12, 18],
  }),
  sprint('kilat-bilangan-bulat', 'D', 'D', 'Kilat Bilangan Bulat', 'Operasi bilangan bulat positif dan negatif.', '➖', {
    mode: 'ARITH', durationSec: 60, ops: ['+', '-', '×'], max: 10, maxCap: 30, factorMax: 6, factorCap: 12, allowNegative: true, stars: [6, 12, 18],
  }),
  sprint('kilat-kuadrat-akar', 'D', 'E', 'Kilat Kuadrat & Akar', 'Hafalkan kuadrat dan akar kuadrat bilangan.', '√', {
    mode: 'ARITH', durationSec: 60, ops: ['²', '√'], max: 10, maxCap: 10, factorMax: 9, factorCap: 15, stars: [6, 12, 18],
  }),
  sprint('kilat-tiu', 'E', 'L', 'Hitung Cepat TIU', 'Persen, pecahan, desimal, dan perkalian cepat ala soal TIU CPNS.', '🎯', {
    mode: 'TIU', durationSec: 90, ops: ['×'], max: 10, maxCap: 10, stars: [5, 10, 15],
  }),

  crossmath('silang-angka-mudah', 'A', 'A', 'Silang Angka Mudah', 'Teka-teki silang penjumlahan & pengurangan sampai 10.', {
    rounds: 3, ops: ['+', '-'], max: 10, hidden: 3, bank: true,
  }),
  crossmath('silang-angka-sedang', 'B', 'B', 'Silang Angka Sedang', 'Penjumlahan & pengurangan sampai 30.', {
    rounds: 3, ops: ['+', '-'], max: 30, hidden: 4, bank: true,
  }),
  crossmath('silang-angka-kali', 'C', 'C', 'Silang Angka Perkalian', 'Tambah, kurang, dan kali sampai 50, isi dengan keypad.', {
    rounds: 3, ops: ['+', '-', '×'], max: 50, hidden: 4, bank: false,
  }),
  crossmath('silang-angka-bulat', 'D', 'E', 'Silang Angka Bilangan Bulat', 'Empat operasi dengan bilangan negatif.', {
    rounds: 3, ops: ['+', '-', '×', '÷'], max: 30, hidden: 5, bank: false, allowNegative: true,
  }),

  memory('kartu-hitung-10', MATH, 'A', 'A', 'Kartu Kembar: Hitung Sampai 10', 'Pasangkan soal dengan hasilnya.', '🃏', {
    pairMode: 'EXPR_RESULT', pairs: 6, ops: ['+', '-'], max: 10,
  }),
  memory('kartu-angka-benda', MATH, 'A', 'A', 'Kartu Kembar: Angka & Benda', 'Pasangkan angka dengan banyak benda.', '🍎', {
    pairMode: 'NUMBER_DOTS', pairs: 6, max: 10,
  }),
  memory('kartu-perkalian', MATH, 'B', 'C', 'Kartu Kembar: Perkalian', 'Pasangkan soal perkalian dengan hasilnya.', '✖️', {
    pairMode: 'EXPR_RESULT', pairs: 8, ops: ['×'], max: 49,
  }),
  memory('kartu-rumus-geometri', MATH, 'C', 'D', 'Kartu Kembar: Rumus Geometri', 'Pasangkan nama dengan rumus atau nilainya.', '📐', { pairMode: 'CUSTOM', pairs: 6 }, [
    { a: 'Jumlah sudut segitiga', b: '180°' },
    { a: 'Jumlah sudut segi empat', b: '360°' },
    { a: 'Besar sudut siku-siku', b: '90°' },
    { a: 'Luas persegi', b: 's × s' },
    { a: 'Keliling persegi', b: '4 × s' },
    { a: 'Luas persegi panjang', b: 'p × l' },
    { a: 'Luas segitiga', b: '½ × a × t' },
    { a: 'Luas lingkaran', b: 'π × r²' },
    { a: 'Keliling lingkaran', b: '2 × π × r' },
    { a: 'Volume kubus', b: 's × s × s' },
    { a: 'Banyak rusuk kubus', b: '12' },
    { a: 'Diameter lingkaran', b: '2 × r' },
    { a: 'Luas jajargenjang', b: 'a × t' },
    { a: 'Volume balok', b: 'p × l × t' },
  ]),

  crossword('tts-bangun-datar-ruang', MATH, 'C', 'D', 'TTS Bangun Datar & Ruang', 'Teka-teki silang istilah geometri.', '📐', { lang: 'id' }, [
    { answer: 'SEGITIGA', clue: 'Bangun datar yang memiliki tiga sisi' },
    { answer: 'PERSEGI', clue: 'Bangun datar dengan empat sisi sama panjang dan empat sudut siku-siku' },
    { answer: 'LINGKARAN', clue: 'Bangun datar yang semua titik tepinya berjarak sama dari titik pusat' },
    { answer: 'DIAMETER', clue: 'Garis tengah lingkaran, panjangnya dua kali jari-jari' },
    { answer: 'SUDUT', clue: 'Dibentuk oleh dua sinar garis yang bertemu di satu titik, diukur dalam derajat' },
    { answer: 'KELILING', clue: 'Jumlah panjang semua sisi bangun datar' },
    { answer: 'LUAS', clue: 'Ukuran daerah di dalam bangun datar, satuannya misalnya cm²' },
    { answer: 'VOLUME', clue: 'Isi suatu bangun ruang, satuannya misalnya cm³' },
    { answer: 'KUBUS', clue: 'Bangun ruang dengan enam sisi persegi yang sama besar' },
    { answer: 'RUSUK', clue: 'Garis pertemuan dua sisi pada bangun ruang' },
    { answer: 'BALOK', clue: 'Bangun ruang berbentuk seperti kotak sepatu' },
    { answer: 'TABUNG', clue: 'Bangun ruang berbentuk seperti kaleng susu' },
    { answer: 'KERUCUT', clue: 'Bangun ruang berbentuk seperti topi ulang tahun' },
    { answer: 'BOLA', clue: 'Bangun ruang yang seluruh permukaannya melengkung, seperti kelereng' },
  ]),
  crossword('tts-bilangan', MATH, 'C', 'D', 'TTS Bilangan', 'Teka-teki silang istilah bilangan & pecahan.', '🔢', { lang: 'id' }, [
    { answer: 'PRIMA', clue: 'Bilangan yang tepat memiliki dua faktor: 1 dan bilangan itu sendiri' },
    { answer: 'GENAP', clue: 'Bilangan yang habis dibagi 2' },
    { answer: 'GANJIL', clue: 'Bilangan bulat yang tidak habis dibagi 2' },
    { answer: 'PECAHAN', clue: 'Bilangan yang ditulis a/b, misalnya 3/4' },
    { answer: 'FAKTOR', clue: 'Bilangan yang dapat membagi habis bilangan lain' },
    { answer: 'KELIPATAN', clue: 'Hasil kali suatu bilangan dengan 1, 2, 3, dan seterusnya' },
    { answer: 'PEMBILANG', clue: 'Bilangan di atas garis pecahan' },
    { answer: 'PENYEBUT', clue: 'Bilangan di bawah garis pecahan' },
    { answer: 'DESIMAL', clue: 'Pecahan yang ditulis dengan tanda koma, misalnya 0,5' },
    { answer: 'PERSEN', clue: 'Per seratus, lambangnya %' },
    { answer: 'NOL', clue: 'Bilangan bulat yang bukan positif dan bukan negatif' },
    { answer: 'SELISIH', clue: 'Hasil pengurangan dua bilangan' },
    { answer: 'KUADRAT', clue: 'Bilangan dikalikan dengan dirinya sendiri, misalnya 5 × 5' },
    { answer: 'AKAR', clue: 'Kebalikan dari kuadrat, lambangnya √' },
  ]),
];

// ─── Bahasa Inggris ─────────────────────────────────────────────────────────

const ENGLISH_SETS: SeedGameSet[] = [
  memory('kartu-hewan', ENGLISH, 'A', 'B', 'Kartu Kembar: Animals', 'Pasangkan kata bahasa Inggris dengan gambar hewannya.', '🐾', { pairMode: 'WORD_EMOJI', pairs: 6, speak: true }, DECK_ANIMALS),
  memory('kartu-buah-sayur', ENGLISH, 'A', 'B', 'Kartu Kembar: Fruits & Vegetables', 'Pasangkan nama buah dan sayur dengan gambarnya.', '🍎', { pairMode: 'WORD_EMOJI', pairs: 6, speak: true }, DECK_FRUITS),
  memory('kartu-warna', ENGLISH, 'A', 'A', 'Kartu Kembar: Colors', 'Pasangkan nama warna dengan warnanya.', '🎨', { pairMode: 'WORD_EMOJI', pairs: 6, speak: true }, DECK_COLORS),
  memory('kartu-transportasi', ENGLISH, 'A', 'B', 'Kartu Kembar: Transportation', 'Pasangkan nama kendaraan dengan gambarnya.', '🚗', { pairMode: 'WORD_EMOJI', pairs: 6, speak: true }, DECK_TRANSPORT),
  memory('kartu-tubuh', ENGLISH, 'A', 'B', 'Kartu Kembar: My Body', 'Pasangkan nama bagian tubuh dengan gambarnya.', '🖐️', { pairMode: 'WORD_EMOJI', pairs: 6, speak: true }, DECK_BODY),
  memory('kartu-sekolah', ENGLISH, 'A', 'B', 'Kartu Kembar: At School', 'Pasangkan nama benda di sekolah dengan gambarnya.', '🎒', { pairMode: 'WORD_EMOJI', pairs: 8, speak: true }, DECK_SCHOOL),
  memory('kartu-arti-hewan', ENGLISH, 'B', 'C', 'Kartu Kembar: Arti Kata Hewan', 'Pasangkan kata bahasa Inggris dengan artinya (tanpa gambar).', '📝', { pairMode: 'WORD_MEANING', pairs: 8, speak: true }, DECK_ANIMALS),
  memory('kartu-arti-kata-kerja', ENGLISH, 'C', 'D', 'Kartu Kembar: Action Verbs', 'Pasangkan kata kerja bahasa Inggris dengan artinya.', '🏃', { pairMode: 'WORD_MEANING', pairs: 8, speak: true }, DECK_VERBS),
  memory('kartu-kosakata-bacaan', ENGLISH, 'A', 'L', 'Kartu Kembar: Kosakata Bacaan', 'Kartu dari kosakata bergambar bacaan yang baru kamu baca.', '📖', {
    pairMode: 'WORD_EMOJI', pairs: 6, speak: true, source: 'CONTENT_VOCAB',
  }),

  vocab('kosakata-hewan', 'A', 'C', 'Kosakata: Animals', '🐾', DECK_ANIMALS),
  vocab('kosakata-buah-sayur', 'A', 'C', 'Kosakata: Fruits & Vegetables', '🍎', DECK_FRUITS),
  vocab('kosakata-makanan', 'A', 'C', 'Kosakata: Food & Drinks', '🍞', DECK_FOOD),
  vocab('kosakata-warna', 'A', 'B', 'Kosakata: Colors', '🎨', DECK_COLORS, { roundSize: 9, newPerRound: 4, options: 3 }),
  vocab('kosakata-sekolah', 'A', 'C', 'Kosakata: At School', '🎒', DECK_SCHOOL),
  vocab('kosakata-rumah', 'A', 'C', 'Kosakata: My Home', '🏠', DECK_HOME),
  vocab('kosakata-tubuh', 'A', 'C', 'Kosakata: My Body', '🖐️', DECK_BODY),
  vocab('kosakata-transportasi', 'A', 'C', 'Kosakata: Transportation', '🚗', DECK_TRANSPORT),
  vocab('kosakata-alam', 'A', 'C', 'Kosakata: Nature & Weather', '🌈', DECK_NATURE),
  vocab('kosakata-pakaian', 'B', 'C', 'Kosakata: Clothes', '👕', DECK_CLOTHES),
  vocab('kosakata-mainan-musik', 'A', 'C', 'Kosakata: Toys & Music', '🎸', DECK_TOYS_MUSIC),
  vocab('kosakata-perasaan', 'B', 'D', 'Kosakata: Feelings', '😀', DECK_FEELINGS, { modes: ['LOOK_PICK', 'LISTEN_PICK', 'SPELL', 'TYPE'] }),
  vocab('kosakata-kata-kerja', 'B', 'D', 'Kosakata: Action Verbs', '🏃', DECK_VERBS, { modes: ['LOOK_PICK', 'LISTEN_PICK', 'SPELL', 'TYPE'] }),
  vocab('kosakata-pekerjaan', 'B', 'D', 'Kosakata: Jobs', '🧑‍🚀', DECK_JOBS, { modes: ['LOOK_PICK', 'LISTEN_PICK', 'SPELL', 'TYPE'] }),

  crossword('tts-animals', ENGLISH, 'B', 'C', 'TTS Animals', 'Teka-teki silang nama hewan dalam bahasa Inggris.', '🦁', { lang: 'en', speak: true },
    enWords(DECK_ANIMALS, ['elephant', 'tiger', 'rabbit', 'monkey', 'giraffe', 'turtle', 'horse', 'snake', 'zebra', 'chicken', 'camel', 'bear'])),
  crossword('tts-fruits', ENGLISH, 'B', 'C', 'TTS Fruits & Vegetables', 'Teka-teki silang nama buah dan sayur dalam bahasa Inggris.', '🍉', { lang: 'en', speak: true },
    enWords(DECK_FRUITS, ['watermelon', 'banana', 'orange', 'mango', 'pineapple', 'grape', 'tomato', 'carrot', 'potato', 'lemon', 'cherry', 'coconut'])),
];

// ─── IPA ────────────────────────────────────────────────────────────────────

const SCIENCE_SETS: SeedGameSet[] = [
  crossword('tts-ipa-dasar', SCIENCE, 'B', 'C', 'TTS IPA: Tubuh, Tumbuhan & Alam', 'Teka-teki silang istilah IPA sekolah dasar.', '🔬', { lang: 'id' }, [
    { answer: 'JANTUNG', clue: 'Organ yang memompa darah ke seluruh tubuh' },
    { answer: 'OTAK', clue: 'Organ di kepala yang menjadi pusat pengendali tubuh' },
    { answer: 'MATAHARI', clue: 'Bintang yang menjadi pusat tata surya kita' },
    { answer: 'BUMI', clue: 'Planet tempat kita tinggal' },
    { answer: 'BULAN', clue: 'Satelit alami yang mengelilingi Bumi' },
    { answer: 'FOTOSINTESIS', clue: 'Proses tumbuhan hijau membuat makanan dengan bantuan cahaya matahari' },
    { answer: 'AKAR', clue: 'Bagian tumbuhan yang menyerap air dan mineral dari tanah' },
    { answer: 'DAUN', clue: 'Bagian tumbuhan yang berwarna hijau, tempat utama fotosintesis' },
    { answer: 'HERBIVORA', clue: 'Hewan pemakan tumbuhan' },
    { answer: 'KARNIVORA', clue: 'Hewan pemakan daging' },
    { answer: 'OMNIVORA', clue: 'Hewan pemakan tumbuhan dan daging' },
    { answer: 'MENGUAP', clue: 'Perubahan wujud dari cair menjadi gas' },
    { answer: 'MEMBEKU', clue: 'Perubahan wujud dari cair menjadi padat' },
    { answer: 'MENCAIR', clue: 'Perubahan wujud dari padat menjadi cair' },
  ]),
];

// ─── Arcade ─────────────────────────────────────────────────────────────────

const arcade = (
  slug: string,
  engine: 'BALLOON_POP' | 'CATCHER' | 'LANE_RUNNER' | 'TOWER_DEFENSE',
  subjectId: string,
  phaseMin: Phase,
  phaseMax: Phase,
  title: string,
  description: string,
  emoji: string,
  config: FallingConfig | RunnerConfig | DefenseConfig,
  items?: VocabCard[]
): SeedGameSet => ({ slug, engine, subjectId, phaseMin, phaseMax, title, description, emoji, config, items });

const ANIMAL_EMOJI = ['🐶', '🐱', '🐮', '🐴', '🐰', '🦁', '🐘', '🐵', '🦒', '🐻'];
const FRUIT_EMOJI = ['🍎', '🍌', '🍊', '🍇', '🍉', '🍓', '🥭', '🍍', '🍐', '🍒'];
const VEHICLE_EMOJI = ['🚗', '🚌', '🚆', '✈️', '🚢', '🚲', '🚚', '🚁', '🚀', '🚜'];

const ARCADE_SETS: SeedGameSet[] = [
  // Balon Hitung
  arcade('balon-genap-ganjil', 'BALLOON_POP', MATH, 'A', 'B', 'Balon Genap & Ganjil', 'Pecahkan balon bilangan genap atau ganjil sesuai perintah.', '🎈', {
    durationSec: 60, waveSec: 20, pace: 'slow', rules: [{ type: 'EVEN', max: 20 }, { type: 'ODD', max: 20 }],
  }),
  arcade('balon-hasil-10', 'BALLOON_POP', MATH, 'A', 'A', 'Balon Hasil Hitung', 'Pecahkan balon yang hasil hitungnya sama dengan angka target.', '🎯', {
    durationSec: 60, waveSec: 20, pace: 'slow',
    rules: [{ type: 'EQUALS', target: 10, ops: ['+', '-'] }, { type: 'EQUALS', target: 5, ops: ['+'] }, { type: 'EQUALS', target: 8, ops: ['+', '-'] }],
  }),
  arcade('balon-kelipatan', 'BALLOON_POP', MATH, 'B', 'C', 'Balon Kelipatan', 'Pecahkan kelipatan 2, 3, 5, atau 10 secepat mungkin.', '🎈', {
    durationSec: 80, waveSec: 20, pace: 'normal',
    rules: [{ type: 'MULTIPLE', n: 2, max: 40 }, { type: 'MULTIPLE', n: 3, max: 45 }, { type: 'MULTIPLE', n: 5, max: 60 }, { type: 'MULTIPLE', n: 10, max: 100 }],
  }),
  arcade('balon-perkalian', 'BALLOON_POP', MATH, 'C', 'D', 'Balon Perkalian', 'Cari perkalian yang hasilnya tepat, atau bilangan yang lebih besar.', '✖️', {
    durationSec: 80, waveSec: 20, pace: 'normal',
    rules: [{ type: 'EQUALS', target: 24, ops: ['×'] }, { type: 'EQUALS', target: 36, ops: ['×'] }, { type: 'EQUALS', target: 12, ops: ['×', '+'] }, { type: 'GREATER', than: 50, max: 100 }],
  }),
  arcade('balon-hewan-buah', 'BALLOON_POP', ENGLISH, 'A', 'B', 'Pop the Balloons!', 'Pecahkan balon bergambar hewan, buah, atau kendaraan sesuai perintah.', '🎈', {
    durationSec: 60, waveSec: 20, pace: 'slow',
    rules: [
      { type: 'CATEGORY', prompt: 'Pop the ANIMALS! (hewan)', good: ANIMAL_EMOJI, bad: [...FRUIT_EMOJI, ...VEHICLE_EMOJI.slice(0, 4)] },
      { type: 'CATEGORY', prompt: 'Pop the FRUITS! (buah)', good: FRUIT_EMOJI, bad: [...ANIMAL_EMOJI, ...VEHICLE_EMOJI.slice(4)] },
      { type: 'CATEGORY', prompt: 'Pop the VEHICLES! (kendaraan)', good: VEHICLE_EMOJI, bad: [...ANIMAL_EMOJI.slice(0, 5), ...FRUIT_EMOJI.slice(0, 5)] },
    ],
  }),
  arcade('balon-kata-inggris', 'BALLOON_POP', ENGLISH, 'B', 'C', 'Pop the Words!', 'Pecahkan balon berisi kata bahasa Inggris sesuai kelompoknya.', '🔤', {
    durationSec: 75, waveSec: 25, pace: 'normal',
    rules: [
      { type: 'CATEGORY', prompt: 'Pop the COLORS! (warna)', good: ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'black'], bad: ['cat', 'apple', 'chair', 'run', 'book', 'sun', 'shoes'] },
      { type: 'CATEGORY', prompt: 'Pop the ANIMALS! (hewan)', good: ['tiger', 'horse', 'rabbit', 'monkey', 'snake', 'duck', 'bear'], bad: ['bread', 'pencil', 'shirt', 'rain', 'door', 'green', 'sing'] },
      { type: 'CATEGORY', prompt: 'Pop the FOOD! (makanan)', good: ['rice', 'bread', 'cheese', 'soup', 'egg', 'cake', 'noodles'], bad: ['dog', 'ruler', 'coat', 'cloud', 'train', 'bed', 'blue'] },
    ],
  }),

  // Tangkap Benda
  arcade('tangkap-hewan', 'CATCHER', SCIENCE, 'A', 'B', 'Tangkap Hewan', 'Tangkap hewan yang bisa terbang, hidup di air, atau berkaki empat.', '🧺', {
    durationSec: 60, waveSec: 20, pace: 'slow',
    rules: [
      { type: 'CATEGORY', prompt: 'Tangkap hewan yang bisa TERBANG!', good: ['🐦', '🦋', '🐝', '🦉', '🦅', '🦇'], bad: ['🐶', '🐱', '🐘', '🐢', '🐟', '🐌', '🐄'] },
      { type: 'CATEGORY', prompt: 'Tangkap hewan yang hidup di AIR!', good: ['🐟', '🐠', '🐬', '🐙', '🐳', '🦈'], bad: ['🐶', '🐱', '🐘', '🐓', '🦒', '🐴', '🐝'] },
      { type: 'CATEGORY', prompt: 'Tangkap hewan berkaki EMPAT!', good: ['🐶', '🐱', '🐘', '🐄', '🦒', '🐴'], bad: ['🐦', '🐟', '🐍', '🐝', '🐔', '🐧', '🦋'] },
    ],
  }),
  arcade('tangkap-mengapung', 'CATCHER', SCIENCE, 'B', 'C', 'Mengapung atau Tenggelam?', 'Tangkap benda yang mengapung atau tenggelam di air.', '🛟', {
    durationSec: 60, waveSec: 20, pace: 'slow',
    rules: [
      { type: 'CATEGORY', prompt: 'Tangkap benda yang MENGAPUNG di air!', good: ['🪵', '🍃', '🪶', '⛵', '🛟', '🥥', '⚽'], bad: ['🪨', '🔑', '🪙', '⚓', '🔨', '🔩', '🧲'] },
      { type: 'CATEGORY', prompt: 'Tangkap benda yang TENGGELAM di air!', good: ['🪨', '🔑', '🪙', '⚓', '🔨', '🔩', '🧲'], bad: ['🪵', '🍃', '🪶', '⛵', '🛟', '🥥', '⚽'] },
    ],
  }),
  arcade('tangkap-makanan-sehat', 'CATCHER', SCIENCE, 'A', 'B', 'Tangkap Makanan Sehat', 'Isi keranjang dengan makanan sehat, hindari jajanan manis & berminyak.', '🥦', {
    durationSec: 60, waveSec: 60, pace: 'slow',
    rules: [{ type: 'CATEGORY', prompt: 'Tangkap makanan SEHAT!', good: ['🍎', '🥦', '🥕', '🍌', '🥛', '🐟', '🥚', '🍇', '🍚'], bad: ['🍬', '🍭', '🍩', '🥤', '🍟', '🧁'] }],
  }),
  arcade('tangkap-angka', 'CATCHER', MATH, 'A', 'B', 'Tangkap Angka', 'Tangkap bilangan genap, ganjil, lebih dari, atau kurang dari.', '🔢', {
    durationSec: 60, waveSec: 15, pace: 'slow',
    rules: [{ type: 'EVEN', max: 20 }, { type: 'ODD', max: 20 }, { type: 'GREATER', than: 10, max: 20 }, { type: 'LESS', than: 10, max: 20 }],
  }),
  arcade('tangkap-kelipatan', 'CATCHER', MATH, 'C', 'C', 'Tangkap Kelipatan', 'Tangkap kelipatan 4, 6, 7, dan 9.', '🧺', {
    durationSec: 75, waveSec: 18, pace: 'normal',
    rules: [{ type: 'MULTIPLE', n: 4, max: 48 }, { type: 'MULTIPLE', n: 6, max: 60 }, { type: 'MULTIPLE', n: 7, max: 70 }, { type: 'MULTIPLE', n: 9, max: 90 }],
  }),

  // Lari Jawaban
  arcade('lari-hitung-10', 'LANE_RUNNER', MATH, 'A', 'A', 'Lari Hitung', 'Lari ke jalur dengan jawaban penjumlahan & pengurangan yang benar.', '🏃', {
    gates: 25, hearts: 3, startInterval: 6500, minInterval: 4200, source: 'MATH', math: { mode: 'ARITH', ops: ['+', '-'], max: 10, maxCap: 20 },
  }),
  arcade('lari-perkalian', 'LANE_RUNNER', MATH, 'B', 'C', 'Lari Perkalian', 'Perkalian dan pembagian sambil berlari makin cepat.', '🏃', {
    gates: 30, hearts: 3, startInterval: 5500, minInterval: 3400, source: 'MATH', math: { mode: 'ARITH', ops: ['×', '÷'], max: 10, maxCap: 10, factorMax: 5, factorCap: 10 },
  }),
  arcade('lari-hitung-campuran', 'LANE_RUNNER', MATH, 'C', 'D', 'Lari Hitung Campuran', 'Empat operasi hitung dengan kecepatan tinggi.', '🏃', {
    gates: 30, hearts: 3, startInterval: 5000, minInterval: 3000, source: 'MATH', math: { mode: 'ARITH', ops: ['+', '-', '×', '÷'], max: 50, maxCap: 200, factorMax: 9, factorCap: 12 },
  }),
  arcade('lari-tiu', 'LANE_RUNNER', MATH, 'E', 'L', 'Lari Hitung Cepat TIU', 'Persen, pecahan, dan desimal ala TIU sambil berlari.', '🎯', {
    gates: 30, hearts: 3, startInterval: 7000, minInterval: 4500, source: 'MATH', math: { mode: 'TIU', ops: ['×'], max: 10, maxCap: 10 },
  }),
  arcade('lari-kosakata-hewan', 'LANE_RUNNER', ENGLISH, 'A', 'B', 'Run to the Word: Animals', 'Lihat gambar hewan, lari ke kata bahasa Inggris yang benar.', '🐾', {
    gates: 25, hearts: 3, startInterval: 6500, minInterval: 4500, source: 'VOCAB', vocabMode: 'EMOJI_TO_WORD',
  }, DECK_ANIMALS),
  arcade('lari-kosakata-sekolah', 'LANE_RUNNER', ENGLISH, 'B', 'C', 'Run to the Word: At School', 'Lihat gambar benda sekolah, lari ke kata yang benar.', '🎒', {
    gates: 25, hearts: 3, startInterval: 6000, minInterval: 4000, source: 'VOCAB', vocabMode: 'EMOJI_TO_WORD',
  }, DECK_SCHOOL),
  arcade('lari-dengar-buah', 'LANE_RUNNER', ENGLISH, 'A', 'B', 'Listen & Run: Fruits', 'Dengarkan kata bahasa Inggris, lari ke gambar buah yang benar.', '👂', {
    gates: 25, hearts: 3, startInterval: 6500, minInterval: 4500, source: 'VOCAB', vocabMode: 'LISTEN',
  }, DECK_FRUITS),
  arcade('lari-arti-kata-kerja', 'LANE_RUNNER', ENGLISH, 'C', 'D', 'Run to the Meaning: Verbs', 'Baca kata kerja bahasa Inggris, lari ke artinya.', '🏃', {
    gates: 30, hearts: 3, startInterval: 6000, minInterval: 3800, source: 'VOCAB', vocabMode: 'WORD_TO_MEANING',
  }, DECK_VERBS),

  // Jaga Benteng
  arcade('benteng-kembar-10', 'TOWER_DEFENSE', MATH, 'A', 'A', 'Jaga Benteng: Kembar 10', 'Hentikan robot dengan menjawab pasangan jumlah 10.', '🏰', {
    waves: 4, hp: 5, boss: true, startLife: 18000, minLife: 13000, math: { mode: 'MAKE_TARGET', ops: ['+'], max: 10, maxCap: 10, target: 10 },
  }),
  arcade('benteng-tambah-kurang', 'TOWER_DEFENSE', MATH, 'B', 'B', 'Jaga Benteng: Tambah & Kurang', 'Jawab penjumlahan & pengurangan untuk menghentikan robot.', '🏰', {
    waves: 5, hp: 5, boss: true, startLife: 16000, minLife: 10000, math: { mode: 'ARITH', ops: ['+', '-'], max: 20, maxCap: 60 },
  }),
  arcade('benteng-kali-bagi', 'TOWER_DEFENSE', MATH, 'C', 'C', 'Jaga Benteng: Kali & Bagi', 'Perkalian & pembagian, dengan bos soal cerita.', '🏰', {
    waves: 6, hp: 5, boss: true, startLife: 15000, minLife: 9000, math: { mode: 'ARITH', ops: ['×', '÷'], max: 10, maxCap: 10, factorMax: 5, factorCap: 10 },
  }),
  arcade('benteng-bilangan-bulat', 'TOWER_DEFENSE', MATH, 'D', 'D', 'Jaga Benteng: Bilangan Bulat', 'Bilangan positif & negatif; tekan ± untuk jawaban negatif.', '🏰', {
    waves: 6, hp: 5, boss: true, startLife: 14000, minLife: 8500, math: { mode: 'ARITH', ops: ['+', '-', '×'], max: 10, maxCap: 30, factorMax: 6, factorCap: 12, allowNegative: true },
  }),
  arcade('benteng-tiu', 'TOWER_DEFENSE', MATH, 'E', 'L', 'Jaga Benteng: TIU', 'Hitung cepat persen & pecahan, bos membawa soal diskon dan perbandingan.', '🏰', {
    waves: 5, hp: 5, boss: true, startLife: 22000, minLife: 15000, math: { mode: 'TIU', ops: ['×'], max: 10, maxCap: 10 },
  }),
];

export const GAME_SETS: SeedGameSet[] = [...MATH_SETS, ...ENGLISH_SETS, ...SCIENCE_SETS, ...ARCADE_SETS];
