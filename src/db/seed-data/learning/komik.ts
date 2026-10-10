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
  {
    slug: 'komik-ali-dan-kuman-nakal',
    theme: 'Komik Sains',
    emoji: '🧼',
    title: 'Ali dan Kuman Nakal',
    minutes: 4,
    panels: [
      {
        caption: 'Ali dan teman-temannya baru saja selesai bermain sepak bola di lapangan tanah.',
        scene: '👦⚽🌿🥵',
        bg: 'grass',
        bubbles: [
          { who: 'Ali', text: 'Wah, seru sekali main bolanya! Perutku jadi lapar, nih!' },
        ],
      },
      {
        caption: 'Sampai di rumah, Ali langsung meraih pisang goreng di atas meja dengan tangan kotor.',
        scene: '👦🍌🍽️',
        bg: 'room',
        bubbles: [
          { who: 'Ali', text: 'Nyam! Pisang goreng kesukaanku!' },
          { who: 'Kuman Nakal', text: 'Asyik! Ayo kita ikut masuk ke dalam perut Ali!', tone: 'think' },
        ],
      },
      {
        caption: 'Kakak melihat Ali dan langsung menahan tangannya.',
        scene: '👧🛑👦✋',
        bg: 'room',
        bubbles: [
          { who: 'Kakak', text: 'Tunggu dulu, Ali! Tanganmu penuh tanah. Cuci tangan pakai sabun dulu!', side: 'right', tone: 'shout' },
          { who: 'Ali', text: 'Kan cuma tanah sedikit, Kak...' },
        ],
      },
      {
        caption: 'Kakak mengajak Ali ke wastafel dan menyalakan air mengalir.',
        scene: '👦👧🚰🧼✨',
        bg: 'room',
        bubbles: [
          { who: 'Kakak', text: 'Kuman itu tidak kelihatan mata. Sabun akan menghancurkan dinding kuman!', side: 'right' },
          { who: 'Ali', text: 'Gosok telapak tangan, punggung tangan, dan sela-sela jari!' },
        ],
      },
      {
        caption: 'Busa sabun dan air mengalir menghanyutkan semua kuman nakal ke saluran pembuangan.',
        scene: '🦠👋🌊🚰',
        bg: 'sky',
        bubbles: [
          { who: 'Kuman Nakal', text: 'Tidaaak! Kami kalah oleh sabun dan air mengalir!', tone: 'shout' },
        ],
      },
      {
        caption: 'Ali mengeringkan tangan dengan handuk bersih dan makan dengan nyaman.',
        scene: '👦🍌😋✨',
        bg: 'room',
        bubbles: [
          { who: 'Ali', text: 'Sekarang tanganku wangi dan bersih. Pisang gorengnya jadi makin lezat!' },
          { who: 'Kakak', text: 'Hebat, Ali! Perut sehat, kuman pun kabur!', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Pentingnya Cuci Tangan Pakai Sabun',
        explanation: 'Kuman penyakit berpindah melalui tangan yang kotor. Mencuci tangan dengan air mengalir dan sabun selama minimal 20 detik membunuh kuman penyebab sakit perut dan batuk.',
        examples: ['Cuci tangan sebelum makan.', 'Cuci tangan setelah bermain di luar dan setelah dari toilet.'],
      },
    ],
    quiz: [
      ['Kapan Ali hendak makan pisang goreng tanpa cuci tangan?', ['Setelah bangun tidur', 'Setelah bermain bola di lapangan tanah', 'Setelah mandi'], 1, 'Ali baru selesai bermain bola dengan tangan kotor.'],
      ['Bagaimana cara mencuci tangan yang benar untuk membunuh kuman?', ['Cukup mencelup tangan ke mangkuk air', 'Menggunakan air mengalir dan sabun dengan menggosok sela-sela jari', 'Mengelap tangan ke baju'], 1, 'Air mengalir dan sabun merontokkan kuman berbahaya.'],
      ['Apa manfaat mencuci tangan pakai sabun sebelum makan?', ['Agar tangan menjadi lengket', 'Mencegah kuman masuk ke perut dan membuat tubuh tetap sehat', 'Agar cepat lapar'], 1, 'Mencegah penyakit perut dan menjaga kesehatan tubuh.'],
    ],
  },
  {
    slug: 'komik-dino-belajar-berbagi',
    theme: 'Komik Edukasi',
    emoji: '🏎️',
    title: 'Dino dan Mobil Balap Baru',
    minutes: 3,
    panels: [
      {
        caption: 'Paman membawakan Dino sebuah mobil balap mainan remote control berwarna merah mengilap.',
        scene: '👦🏎️🎁✨',
        bg: 'room',
        bubbles: [
          { who: 'Dino', text: 'Wah, keren sekali! Mobil balap tercepat di dunia!' },
        ],
      },
      {
        caption: 'Sore hari di teras rumah, Fikri datang berkunjung.',
        scene: '👦🏎️👦🏡',
        bg: 'grass',
        bubbles: [
          { who: 'Fikri', text: 'Halo Dino! Wah, mobilmu keren sekali. Boleh aku coba jalankan sebentar?', side: 'right' },
          { who: 'Dino', text: 'Tidak boleh! Ini mobil baruku, nanti rusak kalau kamu pegang!', tone: 'shout' },
        ],
      },
      {
        caption: 'Fikri menunduk sedih dan pulang ke rumahnya. Dino bermain sendirian di teras.',
        scene: '👦🏎️🍂😔',
        bg: 'sunset',
        bubbles: [
          { who: 'Dino', text: 'Kenapa main sendiri rasanya sepi dan tidak seru ya...', tone: 'think' },
        ],
      },
      {
        caption: 'Ibu datang membawakan sepiring biskuit hangat untuk Dino.',
        scene: '👩🍪👦',
        bg: 'room',
        bubbles: [
          { who: 'Ibu', text: 'Mainan itu akan terasa sepuluh kali lebih seru jika dimainkan bersama sahabat, Dino.', side: 'right' },
        ],
      },
      {
        caption: 'Dino tersadar dan segera berlari ke rumah Fikri membawa mobil balapnya.',
        scene: '👦🏎️🏃👦',
        bg: 'grass',
        bubbles: [
          { who: 'Dino', text: 'Fikri, maafkan aku tadi ya. Ayo kita buat lintasan balap dan main bergantian!' },
          { who: 'Fikri', text: 'Wah, asyik! Ayo, Dino!', side: 'right', tone: 'shout' },
        ],
      },
      {
        caption: 'Dino dan Fikri tertawa gembira balapan mobil bersama hingga senja.',
        scene: '👦🏎️🏁👦😄',
        bg: 'sunset',
        bubbles: [
          { who: 'Dino', text: 'Ternyata benar kata Ibu, bermain bersama teman jauh lebih menyenangkan!' },
        ],
      },
    ],
    notes: [
      {
        title: 'Indahnya Berbagi Mainan',
        explanation: 'Mainan yang mahal tidak akan membahagiakan jika dimainkan dalam kesendirian. Berbagi dan bermain bersama sahabat membuat suasana ceria dan persahabatan semakin erat.',
        examples: ['Bergantian memegang stik remote mainan.', 'Merawat mainan teman saat dipinjamkan.'],
      },
    ],
    quiz: [
      ['Mainan apa yang didapat Dino dari pamannya?', ['Pesawat terbang', 'Mobil balap remote control merah', 'Robot raksasa'], 1, 'Dino mendapat mobil balap remote control merah.'],
      ['Mengapa Dino merasa bosan dan sepi saat bermain sendirian?', ['Karena baterainya habis', 'Karena bermain sendirian tidak seru tanpa sahabat', 'Karena mobilnya rusak'], 1, 'Bermain sendirian terasa sepi tanpa teman berbagi.'],
      ['Apa pelajaran penting dari sikap Dino di akhir cerita?', ['Jangan pernah meminjamkan mainan', 'Berbagi dan bermain bersama teman jauh lebih menyenangkan', 'Lebih baik main di dalam kamar saja'], 1, 'Berbagi mainan membuat suasana lebih seru dan menyenangkan.'],
    ],
  },
  {
    slug: 'komik-ke-mana-bintang-di-siang-hari',
    theme: 'Komik Sains',
    emoji: '🌟',
    title: 'Ke Mana Bintang di Siang Hari?',
    minutes: 4,
    panels: [
      {
        caption: 'Malam hari yang cerah, Kiki memandangi ribuan bintang bertaburan di langit.',
        scene: '👧✨🌙🌌',
        bg: 'night',
        bubbles: [
          { who: 'Kiki', text: 'Bintang-bintang di langit malam indah sekali, berkelip-kelip seperti lampu!' },
        ],
      },
      {
        caption: 'Keesokan siangnya, Kiki menengadah ke langit biru yang terang.',
        scene: '👧☀️☁️',
        bg: 'sky',
        bubbles: [
          { who: 'Kiki', text: 'Lho, ke mana perginya bintang-bintang semalam? Apakah mereka pulang tidur?', tone: 'think' },
        ],
      },
      {
        caption: 'Kakak membawa sebuah senter menyala dan mengajak Kiki ke bawah sinar matahari.',
        scene: '👦🔦☀️👧',
        bg: 'grass',
        bubbles: [
          { who: 'Kakak', text: 'Coba lihat lampu senter ini di bawah terik matahari, Kiki. Kelihatan tidak sinarnya?', side: 'right' },
          { who: 'Kiki', text: 'Hampir tidak terlihat, Kak! Kalah terang oleh sinar matahari!' },
        ],
      },
      {
        caption: 'Kakak menjelaskan rahasia langit kepada Kiki.',
        scene: '👦💡👧🌍',
        bg: 'room',
        bubbles: [
          { who: 'Kakak', text: 'Bintang-bintang itu sebenarnya tetap ada di tempatnya di langit siang hari!', side: 'right' },
          { who: 'Kakak', text: 'Hanya saja, atmosfer bumi membiaskan cahaya Matahari yang begitu silau dan terang.', side: 'right' },
        ],
      },
      {
        caption: 'Kiki manggut-manggut mengerti.',
        scene: '👧💡✨',
        bg: 'sky',
        bubbles: [
          { who: 'Kiki', text: 'Ooo, jadi cahaya Matahari mengalahkan cahaya redup bintang yang sangat jauh!' },
        ],
      },
      {
        caption: 'Saat senja tiba dan matahari terbenam, bintang-bintang kembali menampakkan kilau indahnya.',
        scene: '👧🌅⭐✨',
        bg: 'sunset',
        bubbles: [
          { who: 'Kiki', text: 'Selamat datang kembali, bintang-bintangku! Sekarang aku tahu rahasiamu!' },
        ],
      },
    ],
    notes: [
      {
        title: 'Fakta Bintang di Siang Hari',
        explanation: 'Bintang tidak pernah pergi meninggalkan langit saat siang hari. Cahaya bintang tertutup oleh terangnya hamburan sinar matahari pada atmosfer Bumi kita.',
        examples: ['Matahari adalah bintang yang paling dekat dengan bumi.', 'Astronaut di luar angkasa bisa melihat bintang dan matahari bersamaan karena tidak ada atmosfer.'],
      },
    ],
    quiz: [
      ['Apakah bintang-bintang pergi meninggalkan langit saat siang hari?', ['Ya, mereka terbang ke planet lain', 'Tidak, bintang tetap ada tapi tertutup terangnya cahaya Matahari', 'Bintangnya padam lampunya'], 1, 'Bintang tetap ada di langit, namun cahayanya kalah terang oleh Matahari.'],
      ['Mengapa sinar lampu senter hampir tidak kelihatan di bawah terik matahari?', ['Karena baterainya rusak', 'Karena cahaya matahari jauh lebih silau dan terang', 'Karena senternya mati'], 1, 'Cahaya yang lebih terang menutupi cahaya yang redup.'],
      ['Bintang apa yang letaknya paling dekat dengan planet Bumi?', ['Bintang Polaris', 'Matahari', 'Bintang Sirius'], 1, 'Matahari adalah bintang terdekat dengan Bumi.'],
    ],
  },
  {
    slug: 'komik-budi-dan-pohon-jambu',
    theme: 'Komik Edukasi',
    emoji: '🌱',
    title: 'Budi dan Pohon Jambu',
    minutes: 4,
    panels: [
      {
        caption: 'Hari Minggu pagi, Ayah memberikan Budi sebuah pot berisi bibit pohon jambu air yang mungil.',
        scene: '👨🪴👦🏡',
        bg: 'grass',
        bubbles: [
          { who: 'Ayah', text: 'Ini bibit pohon jambu milikmu, Budi. Rawatlah dengan penuh kasih sayang, ya.', side: 'right' },
          { who: 'Budi', text: 'Siap, Ayah! Aku akan jadi perawat tanaman terbaik!' },
        ],
      },
      {
        caption: 'Setiap pagi sebelum berangkat sekolah, Budi menyiram tanaman dengan gembor kecil.',
        scene: '👦🚿🪴☀️',
        bg: 'grass',
        bubbles: [
          { who: 'Budi', text: 'Selamat pagi, pohon jambuku! Minumlah air yang segar ini!' },
        ],
      },
      {
        caption: 'Suatu hari di musim kemarau, Budi melihat daun tanamannya mulai terkulai layu karena lupa disiram dua hari.',
        scene: '👦🥀🪴😰',
        bg: 'sunset',
        bubbles: [
          { who: 'Budi', text: 'Aduh! Maafkan aku, kemarin aku keasyikan main sepeda sampai lupa menyirammu!' },
        ],
      },
      {
        caption: 'Budi segera menyiram tanahnya dan memindahkan pot ke tempat teduh.',
        scene: '👦💧🪴💚',
        bg: 'room',
        bubbles: [
          { who: 'Budi', text: 'Aku berjanji akan lebih disiplin dan bertanggung jawab merawatmu setiap hari.' },
        ],
      },
      {
        caption: 'Beberapa bulan kemudian, pohon jambu tumbuh tinggi dan bertunas daun hijau lebat.',
        scene: '🌳🌺🐦👦',
        bg: 'grass',
        bubbles: [
          { who: 'Budi', text: 'Lihat Ayah! Pohon jambuku sudah mulai berbunga merah muda dan ada burung yang bertengger!', tone: 'shout' },
          { who: 'Ayah', text: 'Hebat, Budi! Tanaman yang dirawat dengan cinta akan memberi keindahan dan udara segar bagi alam.', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Tanggung Jawab Merawat Makhluk Hidup',
        explanation: 'Tanaman membutuhkan air, sinar matahari, dan perawatan teratur untuk tumbuh subur. Belajar merawat tanaman melatih kita menjadi pribadi yang disiplin dan peduli lingkungan.',
        examples: ['Menyiram tanaman di halaman rumah secara rutin.', 'Tidak mencabuti daun atau menginjak rumput sembarangan.'],
      },
    ],
    quiz: [
      ['Bibit tanaman apa yang dirawat oleh Budi?', ['Bibit pohon mangga', 'Bibit pohon jambu air', 'Bibit pohon kelapa'], 1, 'Ayah memberikan bibit pohon jambu air.'],
      ['Apa yang terjadi ketika Budi lupa menyiram tanamannya selama dua hari?', ['Tanaman berbuah lebat', 'Daun tanaman mulai terkulai layu', 'Tanaman berjalan sendiri'], 1, 'Tanaman kekurangan air dan daunnya layu.'],
      ['Sikap baik apa yang dipelajari Budi dalam cerita ini?', ['Sombong kepada teman', 'Disiplin dan bertanggung jawab merawat tanaman', 'Malas bangun pagi'], 1, 'Budi belajar disiplin dan menyayangi makhluk hidup.'],
    ],
  },
  {
    slug: 'komik-piring-pelangi-dina',
    theme: 'Komik Edukasi',
    emoji: '🥦',
    title: 'Dina dan Piring Pelangi',
    minutes: 4,
    panels: [
      {
        caption: 'Saat makan siang, Dina hanya memilih makan nasi dengan nugget goreng dan kerupuk.',
        scene: '👧🍽️🍗🍟',
        bg: 'room',
        bubbles: [
          { who: 'Dina', text: 'Aku cuma mau makan nugget! Sayur brokoli dan wortelnya disingkirkan saja, Bu!' },
        ],
      },
      {
        caption: 'Keesokan harinya pada pelajaran olahraga lari di sekolah...',
        scene: '👧🏃‍♀️🏫🥵😵',
        bg: 'school',
        bubbles: [
          { who: 'Dina', text: 'Aduuuh... Baru lari satu putaran badanku sudah lemas sekali dan kepalaku pusing...', tone: 'think' },
        ],
      },
      {
        caption: 'Ibu Guru UKS mengajak Dina berbicara dan menjelaskan konsep gizi seimbang.',
        scene: '👩‍⚕️🥕🥦👧',
        bg: 'room',
        bubbles: [
          { who: 'Ibu Guru', text: 'Dina, tubuh kita seperti mobil balap. Butuh bahan bakar terbaik yaitu "Piring Pelangi"!', side: 'right' },
          { who: 'Dina', text: 'Piring Pelangi itu apa, Bu Guru?' },
        ],
      },
      {
        caption: 'Ibu Guru menunjukkan gambar piring penuh warna alami makanan.',
        scene: '🍅🥕🥦🍚🐟🌈',
        bg: 'room',
        bubbles: [
          { who: 'Ibu Guru', text: 'Ada warna oranye dari wortel untuk mata, hijau dari bayam untuk darah, dan merah dari tomat untuk imunitas!', side: 'right' },
        ],
      },
      {
        caption: 'Malam harinya di rumah, Dina memberanikan diri mencicipi tumis wortel dan sup bayam.',
        scene: '👧🥣🥕😋✨',
        bg: 'room',
        bubbles: [
          { who: 'Dina', text: 'Nyam! Ternyata wortel ini manis dan sup bayamnya segar sekali, Bu!' },
          { who: 'Ibu', text: 'Alhamdulillah! Pintar sekali anak Ibu.', side: 'right' },
        ],
      },
      {
        caption: 'Pada hari olahraga berikutnya, Dina berlari kencang dengan penuh semangat dan tenaga.',
        scene: '👧🏃‍♀️💨🥇😄',
        bg: 'school',
        bubbles: [
          { who: 'Dina', text: 'Hore! Sekarang badanku kuat dan bertenaga berkat Piring Pelangi!', tone: 'shout' },
        ],
      },
    ],
    notes: [
      {
        title: 'Manfaat Makanan Bergizi Seimbang',
        explanation: 'Sayur dan buah-buahan mengandung vitamin dan mineral yang membuat tubuh kuat, tidak gampang sakit, dan bertenaga. Jangan pilih-pilih makanan agar tubuh tumbuh optimal.',
        examples: ['Makan sayur warna-warni setiap hari.', 'Kurangi makanan instan dan camilan berpengawet.'],
      },
    ],
    quiz: [
      ['Apa makanan yang selalu dipilih Dina pada awal cerita?', ['Sayur bayam dan buah apel', 'Hanya nasi dan nugget goreng saja', 'Salad buah'], 1, 'Dina hanya mau makan nugget dan menolak sayuran.'],
      ['Apa yang terjadi saat Dina lari olahraga di sekolah?', ['Dina menjadi juara satu', 'Tubuhnya cepat lemas dan pusing karena kekurangan zat gizi', 'Dina tidak mau berlari'], 1, 'Tubuh Dina lemas karena kurang nutrisi sayur dan buah.'],
      ['Mengapa makanan bergizi dijuluki "Piring Pelangi"?', ['Karena piringnya dicat warna pelangi', 'Karena terdiri dari aneka sayur dan buah warna-warni kaya vitamin', 'Karena rasanya seperti permen'], 1, 'Sayur dan buah warna-warni melambangkan keanekaragaman gizi seimbang.'],
    ],
  },
  {
    slug: 'komik-tiga-kata-ajaib',
    theme: 'Komik Edukasi',
    emoji: '🪄',
    title: 'Tiga Kata Ajaib',
    minutes: 4,
    panels: [
      {
        caption: 'Di kelas, Doni ingin mewarnai gambarnya tetapi krayon birunya patah.',
        scene: '👦🖍️💔🏫',
        bg: 'school',
        bubbles: [
          { who: 'Doni', text: 'Bagi krayon birumu, Sinta!', tone: 'shout' },
        ],
      },
      {
        caption: 'Doni langsung merebut krayon dari meja Sinta tanpa permisi.',
        scene: '👦🖍️😡👧',
        bg: 'school',
        bubbles: [
          { who: 'Sinta', text: 'Doni! Jangan asal ambil, dong! Itu tidak sopan!', side: 'right', tone: 'shout' },
        ],
      },
      {
        caption: 'Saat berjalan terburu-buru, Doni tidak sengaja menyenggol tas Edo hingga bukunya berserakan, lalu pergi begitu saja.',
        scene: '👦🏃‍♂️💥🎒👦',
        bg: 'school',
        bubbles: [
          { who: 'Edo', text: 'Doni kok kasar sekali, tidak mau minta maaf...', side: 'right', tone: 'think' },
        ],
      },
      {
        caption: 'Saat istirahat, tidak ada teman yang mau mengajak Doni bermain bersama.',
        scene: '👦🍂🏫😔',
        bg: 'grass',
        bubbles: [
          { who: 'Doni', text: 'Kenapa teman-teman menjauhiku ya? Aku jadi sendirian...', tone: 'think' },
        ],
      },
      {
        caption: 'Pak Guru menghampiri Doni dan mengajarkan jurus "Tiga Kata Ajaib".',
        scene: '👨‍🏫👦💡✨',
        bg: 'grass',
        bubbles: [
          { who: 'Pak Guru', text: 'Ingat tiga kata ajaib, Doni: "Tolong" saat butuh bantuan, "Maaf" saat berbuat salah, dan "Terima Kasih" saat dibantu.', side: 'right' },
        ],
      },
      {
        caption: 'Doni mempraktikkannya kepada Sinta dan Edo dengan tulus.',
        scene: '👦🤝👧👦😄',
        bg: 'school',
        bubbles: [
          { who: 'Doni', text: 'Edo, maafkan aku tadi menyenggol tasmu ya. Sinta, bolehkah aku pinjam krayon birumu, tolong?' },
          { who: 'Sinta', text: 'Tentu boleh, Doni! Terima kasih sudah berkata sopan!', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Kekuatan Kata Santun',
        explanation: 'Kata "Tolong", "Maaf", dan "Terima Kasih" adalah kunci membuka hati orang lain dan menjaga kerukunan. Bersikap sopan dan santun membuat kita disayangi oleh teman dan guru.',
        examples: ['Selalu ucapkan "tolong" saat meminta bantuan.', 'Jangan ragu ucapkan "maaf" jika tidak sengaja melakukan kesalahan.'],
      },
    ],
    quiz: [
      ['Apa saja yang termasuk ke dalam "Tiga Kata Ajaib"?', ['Halo, permisi, dadah', 'Tolong, maaf, dan terima kasih', 'Awas, pergi, cepat'], 1, 'Tiga kata santun utama: tolong, maaf, terima kasih.'],
      ['Mengapa teman-teman sempat menjauhi Doni?', ['Karena Doni tidak pandai berhitung', 'Karena Doni bersikap kasar dan tidak mau minta maaf', 'Karena Doni tidak membawa bekal'], 1, 'Sikap kasar dan tidak sopan membuat teman merasa tidak nyaman.'],
      ['Kapan kita mengucapkan kata "Tolong"?', ['Saat kita memberi hadiah', 'Saat kita membutuhkan bantuan orang lain', 'Saat kita hendak tidur'], 1, 'Kata tolong diucapkan dengan sopan saat memerlukan pertolongan.'],
    ],
  },
  {
    slug: 'komik-semut-dan-remah-biskuit',
    theme: 'Komik Sains',
    emoji: '🐜',
    title: 'Kerja Sama Koloni Semut',
    minutes: 3,
    panels: [
      {
        caption: 'Seekor semut pekerja bernama Soni sedang berpatroli di bawah pohon rindang.',
        scene: '🐜🔍🌿',
        bg: 'grass',
        bubbles: [
          { who: 'Soni', text: 'Hmm... apakah ada makanan lezat untuk persediaan sarang kita?' },
        ],
      },
      {
        caption: 'Tiba-tiba Soni menemukan sepotong besar remah biskuit keju yang harum.',
        scene: '🐜🍪✨👀',
        bg: 'grass',
        bubbles: [
          { who: 'Soni', text: 'Wah, remah biskuit raksasa! Sarang kita pasti sangat senang!', tone: 'shout' },
        ],
      },
      {
        caption: 'Soni mencoba menarik remah biskuit itu sekuat tenaganya, tetapi benda itu tidak bergeming.',
        scene: '🐜💦🍪😣',
        bg: 'grass',
        bubbles: [
          { who: 'Soni', text: 'Uuugh! Berat sekali! Tubuhku terlalu kecil untuk mengangkatnya sendirian.' },
        ],
      },
      {
        caption: 'Soni menyentuhkan antenanya ke semut lain untuk memanggil bala bantuan koloni.',
        scene: '🐜📡🐜🐜🐜',
        bg: 'grass',
        bubbles: [
          { who: 'Soni', text: 'Teman-teman, ada remah biskuit lezat di dekat batu! Ayo bantu aku mengangkatnya!' },
          { who: 'Kawan Semut', text: 'Siap, Soni! Kami segera datang!', side: 'right', tone: 'shout' },
        ],
      },
      {
        caption: 'Puluhan semut berbaris rapi dan bersama-sama mengangkat remah biskuit itu di atas kepala mereka.',
        scene: '🐜🐜🐜🍪🐜🐜🐜',
        bg: 'plain',
        bubbles: [
          { who: 'Semua Semut', text: 'Satu, dua, angkat! Bersama-sama beban berat jadi terasa ringan!' },
        ],
      },
      {
        caption: 'Remah biskuit sampai di dalam sarang dan dinikmati seluruh anggota koloni dengan gembira.',
        scene: '🐜🏠🍪🎉👑',
        bg: 'room',
        bubbles: [
          { who: 'Ratu Semut', text: 'Terima kasih atas kerja keras kalian. Kerja sama membuktikan bahwa yang kecil bisa melakukan hal besar!', side: 'right' },
        ],
      },
    ],
    notes: [
      {
        title: 'Pelajaran dari Koloni Semut',
        explanation: 'Semut adalah hewan sosial yang sangat kompak. Dengan saling membantu dan bekerja sama, pekerjaan yang mustahil dilakukan sendiri akan berhasil diselesaikan dengan mudah.',
        examples: ['Ikut kerja bakti membersihkan ruang kelas.', 'Bekerja sama dalam piket sekolah.'],
      },
    ],
    quiz: [
      ['Apa yang ditemukan oleh semut pekerja bernama Soni?', ['Sebuah kelereng', 'Sepotong remah biskuit keju yang besar', 'Daun berduri'], 1, 'Soni menemukan remah biskuit yang harum.'],
      ['Bagaimana cara semut mengangkat remah biskuit yang berat ke sarang?', ['Didorong oleh mesin', 'Bekerja sama mengangkatnya beramai-ramai', 'Ditinggalkan begitu saja'], 1, 'Puluhan semut bekerja sama mengangkat beban bersama.'],
      ['Pesan moral dari cerita koloni semut ini adalah …', ['Bekerja sendiri selalu lebih baik', 'Kerja sama membuat hal yang berat menjadi ringan', 'Semut suka bertengkar'], 1, 'Gotong royong dan kerja sama mengatasi masalah yang berat.'],
    ],
  },
  {
    slug: 'komik-tidur-cepat-raka',
    theme: 'Komik Edukasi',
    emoji: '⏰',
    title: 'Rahasia Jam Tidur Raka',
    minutes: 4,
    panels: [
      {
        caption: 'Pukul sepuluh malam, Raka masih asyik bermain game di tablet di bawah selimut.',
        scene: '👦🎮📱🌙',
        bg: 'night',
        bubbles: [
          { who: 'Raka', text: 'Satu level lagi... seru sekali!', tone: 'think' },
        ],
      },
      {
        caption: 'Pagi hari pukul enam lewat tiga puluh, alarm berbunyi kencang tetapi Raka susah sekali dibangunkan.',
        scene: '⏰😴👦🛌😰',
        bg: 'room',
        bubbles: [
          { who: 'Ibu', text: 'Raka, bangun! Kamu sudah terlambat berangkat sekolah!', side: 'right', tone: 'shout' },
          { who: 'Raka', text: 'Hoaamm... kepalaku berat sekali, Bu...' },
        ],
      },
      {
        caption: 'Di sekolah, Raka mengantuk berat dan tidak bisa berkonsentrasi saat Bu Guru menerangkan.',
        scene: '👦😴🏫👩‍🏫',
        bg: 'school',
        bubbles: [
          { who: 'Bu Guru', text: 'Raka, mengapa mengantuk di kelas? Tadi malam tidur jam berapa?', side: 'right' },
          { who: 'Raka', text: 'Tidur jam sebelas malam, Bu...', tone: 'think' },
        ],
      },
      {
        caption: 'Sore hari, Ayah mengajak Raka berdiskusi tentang pentingnya tidur cukup bagi anak-anak.',
        scene: '👨👦⏰🧠',
        bg: 'room',
        bubbles: [
          { who: 'Ayah', text: 'Saat tidur malam jam sembilan, tubuh kita melepaskan hormon pertumbuhan dan otak merapikan memori pelajaran, Raka.', side: 'right' },
        ],
      },
      {
        caption: 'Malam itu, Raka mematikan semua gadget jam delapan lewat tiga puluh dan tidur tepat jam sembilan malam.',
        scene: '👦💤🌙🧸',
        bg: 'night',
        bubbles: [
          { who: 'Raka', text: 'Selamat malam dunia... besok aku mau bangun pagi bugar!' },
        ],
      },
      {
        caption: 'Keesokan paginya saat fajar, Raka bangun sendiri dengan senyum ceria dan badan yang segar bugar.',
        scene: '👦🌅🎒🏫😄✨',
        bg: 'sky',
        bubbles: [
          { who: 'Raka', text: 'Wah, badanku segar sekali! Aku sampai di sekolah paling awal dan siap belajar!', tone: 'shout' },
        ],
      },
    ],
    notes: [
      {
        title: 'Manfaat Tidur Cepat dan Cukup',
        explanation: 'Anak-anak membutuhkan waktu tidur sekitar 9 hingga 10 jam setiap malam. Tidur cukup membantu konsentrasi belajar di sekolah, memperbaiki suasana hati, dan mendukung pertumbuhan badan.',
        examples: ['Matikan televisi dan gadget minimal 30 menit sebelum tidur.', 'Tidur sebelum jam sembilan malam.'],
      },
    ],
    quiz: [
      ['Mengapa Raka mengantuk dan pusing saat di sekolah pada awal cerita?', ['Karena banyak makan nasi', 'Karena tidur larut malam bermain game di gadget', 'Karena tidak punya tas'], 1, 'Raka tidur larut malam sehingga kekurangan waktu istirahat.'],
      ['Berapa lama waktu tidur yang dibutuhkan anak-anak usia sekolah setiap malam?', ['Sekitar 2 jam saja', 'Sekitar 9 sampai 10 jam', 'Cukup 20 menit'], 1, 'Anak usia sekolah butuh tidur sekitar 9–10 jam per malam.'],
      ['Apa manfaat bangun pagi setelah tidur cukup di malam hari?', ['Badan bugar, pikiran segar, dan siap belajar dengan konsentrasi', 'Cepat lelah', 'Sering mengantuk di kelas'], 0, 'Tidur cukup membuat tubuh bugar dan pikiran segar.'],
    ],
  },
];
