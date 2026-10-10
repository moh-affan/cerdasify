// Format ringkas untuk menulis konten seed Pustaka Belajar.

/** [kalimat Inggris, terjemahan Indonesia, awal paragraf baru?] */
export type SeedSentence = [en: string, id: string, newParagraph?: boolean];

/** [kata, arti, emoji, jenis kata, bentuk lain yang ikut di-highlight, contoh kalimat] */
export type SeedVocab = [
  word: string,
  meaning: string,
  emoji?: string,
  partOfSpeech?: string,
  forms?: string[],
  example?: string,
];

export interface SeedGrammar {
  title: string;
  pattern?: string;
  explanation: string;
  examples: string[];
}

/** [pertanyaan, opsi, indeks jawaban benar, penjelasan] */
export type SeedQuiz = [prompt: string, options: string[], correctIndex: number, explanation?: string];

export interface SeedReading {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  titleId: string;
  minutes: number;
  sentences: SeedSentence[];
  vocab: SeedVocab[];
  grammar: SeedGrammar[];
  quiz: SeedQuiz[];
}

/** Satu baris teks Arab: [arab, latin, terjemahan, nomor ayat?] */
export type SeedArabicLine = [ar: string, latin: string, id: string, n?: number];

/** Materi non-bacaan harian (doa, surat pendek, materi pelajaran). */
export interface SeedLesson {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  titleId?: string;
  minutes: number;
  /** Pengantar Markdown: kapan dibaca, sumber, pesan */
  intro?: string;
  lines?: SeedArabicLine[];
  notes?: SeedGrammar[];
  quiz: SeedQuiz[];
}

/** Cerita pendek / ensiklopedia berbahasa Indonesia. */
export interface SeedArticle {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  minutes: number;
  /** Kalimat-kalimat per paragraf */
  paragraphs: string[][];
  /** [kata, penjelasan, emoji, bentuk lain yang ikut di-highlight (mis. berimbuhan -nya)] */
  vocab?: [word: string, meaning: string, emoji?: string, forms?: string[]][];
  /** Pesan moral / fakta tambahan */
  notes?: SeedGrammar[];
  quiz: SeedQuiz[];
}

/** Teks pidato: bagian (Pembukaan, Isi, Penutup) berisi kalimat-kalimat. */
export interface SeedSpeech {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  titleId?: string;
  minutes: number;
  phaseMin: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'L';
  phaseMax: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'L';
  /** Bahasa teks: 'id' (default) atau 'en' (dengan terjemahan per kalimat) */
  lang?: 'id' | 'en';
  /** [judul bagian, kalimat-kalimat]; untuk lang 'en' kalimat ditulis "English || Terjemahan" */
  sections: [heading: string, sentences: string[]][];
  notes?: SeedGrammar[];
  quiz: SeedQuiz[];
}

/** Komik: deretan panel berisi adegan emoji / gambar + balon dialog. */
export interface SeedComic {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  minutes: number;
  /** Sampul (opsional), mis. hasil ilustrasi AI di /public/learning/comics */
  cover?: string;
  panels: import('../../../lib/learning').ComicPanel[];
  notes?: SeedGrammar[];
  quiz: SeedQuiz[];
}
