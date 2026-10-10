// Komik Edukasi — Fase A–B. Panel memakai adegan emoji + balon dialog (ringan & konsisten),
// sampul opsional berupa ilustrasi di /public/learning/comics/.

import type { SeedComic } from './types';

export const komik: SeedComic[] = [
  {
    slug: 'komik-raka-dan-tantangan-membaca',
    cover: '/learning/comics/komik-raka-dan-tantangan-membaca.webp',
    theme: 'Komik Edukasi',
    emoji: '📚',
    title: 'Raka dan Tantangan Membaca',
    minutes: 4,
    panels: [
      {
        caption: 'Sepulang sekolah, Raka langsung menyalakan televisi.',
        scene: '👦📺🛋️',
        bg: 'room',
        bubbles: [{ who: 'Raka', text: 'Asyik, waktunya nonton kartun!' }],
      },
      {
        caption: 'Kakaknya, Kak Dina, datang membawa sebuah buku.',
        scene: '👧📕👦',
        bg: 'room',
        bubbles: [
          { who: 'Kak Dina', text: 'Raka, mau ikut tantangan membaca? Satu buku dalam satu minggu!', side: 'right' },
          { who: 'Raka', text: 'Membaca? Bosan, ah…' },
        ],
      },
      {
        caption: 'Kak Dina membuka halaman pertama buku tentang dinosaurus.',
        scene: '🦖📖🦕',
        bg: 'grass',
        bubbles: [
          { who: 'Kak Dina', text: 'Tahukah kamu? Dinosaurus hidup jutaan tahun yang lalu!', side: 'right' },
          { who: 'Raka', text: 'Wah, keren! Ada yang lebih besar dari bus?', tone: 'think' },
        ],
      },
      {
        caption: 'Setiap malam, Raka membaca sebelum tidur.',
        scene: '🌙👦📖💡',
        bg: 'night',
        bubbles: [{ who: 'Raka', text: 'Satu bab lagi, ya… seru sekali ceritanya!' }],
      },
      {
        caption: 'Seminggu kemudian, di kelas.',
        scene: '👩‍🏫🏫👦🙋',
        bg: 'school',
        bubbles: [
          { who: 'Bu Guru', text: 'Siapa yang tahu dinosaurus pemakan tumbuhan?', side: 'right' },
          { who: 'Raka', text: 'Saya, Bu! Brachiosaurus!', tone: 'shout' },
        ],
      },
      {
        caption: 'Raka menyelesaikan tantangannya.',
        scene: '🏆👦📚✨',
        bg: 'sunset',
        bubbles: [
          { who: 'Raka', text: 'Kak, aku mau tantangan berikutnya! Buku tentang luar angkasa!' },
          { who: 'Kak Dina', text: 'Hebat! Membaca itu jendela dunia, kan?', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Membaca Itu Menyenangkan',
        explanation: 'Buku membawa kita mengenal banyak hal baru. Mulailah dengan buku tentang hal yang kamu sukai, sedikit demi sedikit setiap hari.',
        examples: ['Baca 10–15 menit sebelum tidur.', 'Pilih buku sesuai hobimu.'],
      },
    ],
    quiz: [
      ['Apa yang dilakukan Raka sepulang sekolah di awal cerita?', ['Membaca buku', 'Menonton televisi', 'Bermain bola'], 1, 'Raka langsung menyalakan televisi.'],
      ['Buku pertama yang dibaca Raka tentang …', ['Dinosaurus', 'Luar angkasa', 'Hewan laut'], 0, 'Kak Dina membuka buku tentang dinosaurus.'],
      ['Pesan dari komik ini adalah …', ['Membaca itu membosankan', 'Membaca membuka wawasan dan menyenangkan', 'Televisi lebih penting'], 1, 'Raka jadi tahu banyak hal dan senang membaca.'],
    ],
  },
  {
    slug: 'komik-aisyah-belajar-puasa',
    cover: '/learning/comics/komik-aisyah-belajar-puasa.webp',
    theme: 'Komik Edukasi',
    emoji: '🌙',
    title: 'Aisyah Belajar Puasa',
    minutes: 4,
    panels: [
      {
        caption: 'Pukul tiga pagi di bulan Ramadan.',
        scene: '🌙⭐👩👧😴',
        bg: 'night',
        bubbles: [
          { who: 'Ibu', text: 'Aisyah, bangun, Nak. Ayo sahur!', side: 'right' },
          { who: 'Aisyah', text: 'Hoaam… iya, Bu.' },
        ],
      },
      {
        caption: 'Mereka makan sahur bersama.',
        scene: '👨👩👧🍚🥚🥛',
        bg: 'room',
        bubbles: [
          { who: 'Ayah', text: 'Hari ini Aisyah mau coba puasa sampai Magrib?', side: 'right' },
          { who: 'Aisyah', text: 'Mau, Yah! Aku sudah kelas dua!' },
        ],
      },
      {
        caption: 'Siang hari, matahari bersinar terik.',
        scene: '☀️👧🥵🍦',
        bg: 'sunset',
        bubbles: [
          { who: 'Aisyah', text: 'Haus sekali… Es krim di kulkas kelihatan enak…', tone: 'think' },
        ],
      },
      {
        caption: 'Aisyah memilih membaca Al-Qur\'an bersama Ibu.',
        scene: '👩📗👧🕌',
        bg: 'room',
        bubbles: [
          { who: 'Ibu', text: 'Puasa itu melatih kita sabar. Allah sayang anak yang sabar.', side: 'right' },
          { who: 'Aisyah', text: 'Aku pasti bisa, Bu!' },
        ],
      },
      {
        caption: 'Azan Magrib berkumandang.',
        scene: '🕌🌇🔊',
        bg: 'sunset',
        bubbles: [{ who: 'Semua', text: 'Alhamdulillah! Waktunya berbuka!', tone: 'shout' }],
      },
      {
        caption: 'Aisyah berbuka dengan kurma dan teh manis.',
        scene: '👨👩👧🌴🍵',
        bg: 'room',
        bubbles: [
          { who: 'Ayah', text: 'MasyaAllah, Aisyah berhasil puasa penuh! Ayah bangga.', side: 'right' },
          { who: 'Aisyah', text: 'Besok aku mau puasa lagi!' },
        ],
      },
    ],
    notes: [
      {
        title: 'Sabar dan Pantang Menyerah',
        explanation: 'Puasa mengajarkan kita bersabar dan menahan diri. Saat terasa berat, kita bisa mengisi waktu dengan kegiatan baik seperti membaca Al-Qur\'an.',
        examples: ['Jangan lupa makan sahur.', 'Berbuka dengan yang manis, seperti kurma.'],
      },
    ],
    quiz: [
      ['Siapa yang membangunkan Aisyah untuk sahur?', ['Ayah', 'Ibu', 'Kakak'], 1, 'Ibu membangunkan Aisyah untuk sahur.'],
      ['Apa yang dilakukan Aisyah saat merasa haus?', ['Minum es krim', 'Membaca Al-Qur\'an bersama Ibu', 'Tidur seharian'], 1, 'Aisyah memilih membaca Al-Qur\'an bersama Ibu.'],
      ['Aisyah berbuka puasa dengan …', ['Kurma dan teh manis', 'Nasi goreng', 'Es krim'], 0, 'Aisyah berbuka dengan kurma dan teh manis.'],
    ],
  },
  {
    slug: 'komik-petualangan-si-tetes-air',
    cover: '/learning/comics/komik-petualangan-si-tetes-air.webp',
    theme: 'Komik Sains',
    emoji: '💧',
    title: 'Petualangan Si Tetes Air',
    minutes: 4,
    panels: [
      {
        caption: 'Di laut yang luas, hiduplah Si Tetes Air bernama Tirta.',
        scene: '🌊💧🐟',
        bg: 'sea',
        bubbles: [{ who: 'Tirta', text: 'Halo! Aku Tirta. Ayo ikut petualanganku!' }],
      },
      {
        caption: 'Matahari bersinar panas. Tirta merasa ringan sekali…',
        scene: '☀️💨💧🌊',
        bg: 'sky',
        bubbles: [{ who: 'Tirta', text: 'Wuuush! Aku menguap dan terbang ke langit!', tone: 'shout' }],
      },
      {
        caption: 'Di atas, udara dingin. Tirta bertemu banyak teman.',
        scene: '☁️💧💧💧',
        bg: 'sky',
        bubbles: [
          { who: 'Tirta', text: 'Kami berkumpul menjadi awan. Ini namanya mengembun!' },
          { who: 'Teman Tetes', text: 'Awan kita makin berat, nih!', side: 'right' },
        ],
      },
      {
        caption: 'Awan menjadi gelap dan berat.',
        scene: '🌧️💧⛰️',
        bg: 'plain',
        bubbles: [{ who: 'Tirta', text: 'Waaa… aku jatuh sebagai hujan!' }],
      },
      {
        caption: 'Tirta jatuh di gunung, lalu mengalir ke sungai.',
        scene: '⛰️🏞️💧🌳',
        bg: 'grass',
        bubbles: [
          { who: 'Tirta', text: 'Sebagian temanku meresap ke tanah dan diminum akar pohon.' },
          { who: 'Pohon', text: 'Terima kasih, Tirta! Aku jadi segar.', side: 'right' },
        ],
      },
      {
        caption: 'Sungai membawa Tirta kembali ke laut.',
        scene: '🏞️➡️🌊💧',
        bg: 'sea',
        bubbles: [
          { who: 'Tirta', text: 'Aku pulang! Perjalanan ini disebut siklus air, dan akan terus berulang.' },
          { who: 'Tirta', text: 'Tolong jaga sungai dari sampah, ya!', side: 'right', tone: 'shout' },
        ],
      },
    ],
    notes: [
      {
        title: 'Siklus Air',
        explanation: 'Air laut menguap karena panas matahari, mengembun menjadi awan, turun sebagai hujan, lalu mengalir kembali ke laut. Perjalanan ini terus berulang.',
        examples: ['Menguap → mengembun → hujan → mengalir.'],
      },
    ],
    quiz: [
      ['Apa yang membuat Tirta menguap?', ['Angin', 'Panas matahari', 'Ikan'], 1, 'Panas matahari membuat air menguap.'],
      ['Tetes-tetes air berkumpul di langit menjadi …', ['Pelangi', 'Awan', 'Bintang'], 1, 'Mereka mengembun menjadi awan.'],
      ['Ke mana Tirta kembali di akhir cerita?', ['Ke laut', 'Ke kulkas', 'Ke bulan'], 0, 'Sungai membawa Tirta kembali ke laut.'],
    ],
  },
  {
    slug: 'komik-jangan-buang-sampah-sembarangan',
    theme: 'Komik Edukasi',
    emoji: '🗑️',
    title: 'Jangan Buang Sampah Sembarangan!',
    minutes: 4,
    panels: [
      {
        caption: 'Bima dan Sari pulang sekolah sambil makan camilan.',
        scene: '👦👧🍫🚶',
        bg: 'grass',
        bubbles: [{ who: 'Bima', text: 'Ah, bungkusnya kubuang di sini saja.' }],
      },
      {
        caption: 'Bima melempar bungkus camilan ke selokan.',
        scene: '👦🍫➡️🕳️',
        bg: 'grass',
        bubbles: [{ who: 'Sari', text: 'Bima, jangan! Nanti selokannya tersumbat!', side: 'right', tone: 'shout' }],
      },
      {
        caption: 'Beberapa hari kemudian, hujan turun sangat deras.',
        scene: '🌧️🌧️🏘️🌊',
        bg: 'plain',
        bubbles: [{ who: 'Bima', text: 'Lho, kenapa jalan di depan rumah banjir?', tone: 'think' }],
      },
      {
        caption: 'Pak RT dan warga membersihkan selokan.',
        scene: '👴🧹🗑️🛍️',
        bg: 'grass',
        bubbles: [
          { who: 'Pak RT', text: 'Lihat, selokannya tersumbat sampah plastik. Airnya tidak bisa mengalir.', side: 'right' },
          { who: 'Bima', text: 'Itu… mungkin ada sampahku juga. Maaf, Pak.' },
        ],
      },
      {
        caption: 'Bima ikut membantu kerja bakti.',
        scene: '👦👧🧤🗑️✨',
        bg: 'sky',
        bubbles: [
          { who: 'Bima', text: 'Mulai sekarang aku akan membuang sampah pada tempatnya!' },
          { who: 'Sari', text: 'Kalau belum ada tempat sampah, simpan dulu di tas, ya!', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Buang Sampah pada Tempatnya',
        explanation: 'Sampah yang dibuang sembarangan dapat menyumbat selokan dan menyebabkan banjir. Jika tidak ada tempat sampah, simpan dulu sampahmu.',
        examples: ['Pisahkan sampah organik dan anorganik.', 'Kurangi pemakaian plastik sekali pakai.'],
      },
    ],
    quiz: [
      ['Di mana Bima membuang bungkus camilan?', ['Di tempat sampah', 'Di selokan', 'Di tas'], 1, 'Bima melempar bungkus ke selokan.'],
      ['Mengapa jalan menjadi banjir?', ['Selokan tersumbat sampah', 'Ada sungai baru', 'Pipa air pecah'], 0, 'Selokan tersumbat sampah plastik.'],
      ['Apa yang sebaiknya dilakukan jika tidak ada tempat sampah?', ['Membuang di jalan', 'Menyimpan sampah di tas dulu', 'Membakar sampah'], 1, 'Simpan dulu sampahmu sampai menemukan tempat sampah.'],
    ],
  },
];
