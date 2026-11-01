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

export const GAME_SETS: SeedGameSet[] = [...MATH_SETS, ...ENGLISH_SETS, ...SCIENCE_SETS];
