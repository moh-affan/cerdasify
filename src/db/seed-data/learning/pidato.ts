// Contoh Pidato — struktur Pembukaan, Isi, Penutup. Dilengkapi mode latihan teleprompter.

import type { SeedSpeech } from './types';

const SALAM_PEMBUKA = [
  "Assalamu'alaikum warahmatullahi wabarakatuh.",
  'Yang saya hormati Bapak dan Ibu Guru,',
  'serta teman-teman yang saya sayangi.',
  'Puji syukur kita panjatkan kepada Allah SWT, karena atas rahmat-Nya kita dapat berkumpul di sini dalam keadaan sehat.',
];

const SALAM_PENUTUP = ['Sekian pidato dari saya. Mohon maaf apabila ada kata-kata yang kurang berkenan.', "Wassalamu'alaikum warahmatullahi wabarakatuh."];

const TIPS_PIDATO = {
  title: 'Tips Berpidato',
  explanation:
    'Berdiri tegak, tatap wajah pendengar, dan ucapkan kata-kata dengan suara yang jelas dan tidak terlalu cepat. Berlatihlah di depan cermin atau keluarga sebelum tampil.',
  examples: [
    'Pembukaan: salam, sapaan hormat, dan ucapan syukur.',
    'Isi: pesan utama pidato beserta alasan dan contohnya.',
    'Penutup: kesimpulan, ajakan, permohonan maaf, dan salam.',
  ],
};

export const pidato: SeedSpeech[] = [
  {
    slug: 'pidato-menjaga-kebersihan-sekolah',
    theme: 'Pidato Anak',
    emoji: '🧹',
    title: 'Menjaga Kebersihan Sekolah',
    titleId: 'Contoh pidato singkat SD',
    minutes: 3,
    phaseMin: 'A',
    phaseMax: 'C',
    sections: [
      ['Pembukaan', [...SALAM_PEMBUKA, 'Pada kesempatan ini, saya akan menyampaikan pidato tentang menjaga kebersihan sekolah.']],
      [
        'Isi',
        [
          'Teman-teman, sekolah adalah rumah kedua kita.',
          'Setiap hari kita belajar dan bermain di sekolah.',
          'Jika sekolah kotor, kita tidak nyaman belajar dan mudah terkena penyakit.',
          'Oleh karena itu, mari kita buang sampah pada tempatnya.',
          'Mari kita laksanakan piket kelas dengan rajin.',
          'Jangan mencoret-coret meja dan dinding.',
          'Kebersihan adalah sebagian dari iman.',
        ],
      ],
      ['Penutup', ['Mari kita jaga sekolah kita agar selalu bersih, sehat, dan indah.', ...SALAM_PENUTUP]],
    ],
    notes: [TIPS_PIDATO],
    quiz: [
      ['Pidato ini membahas tentang …', ['Kebersihan sekolah', 'Hari kemerdekaan', 'Cita-cita'], 0, 'Judulnya Menjaga Kebersihan Sekolah.'],
      ['Bagian pidato yang berisi salam dan ucapan syukur adalah …', ['Pembukaan', 'Isi', 'Penutup'], 0, 'Salam dan syukur ada di pembukaan.'],
      ['Ajakan yang disampaikan dalam pidato adalah …', ['Mencoret dinding', 'Membuang sampah pada tempatnya', 'Pulang lebih cepat'], 1, '"Mari kita buang sampah pada tempatnya."'],
    ],
  },
  {
    slug: 'pidato-berbakti-kepada-orang-tua',
    theme: 'Pidato Anak',
    emoji: '👨‍👩‍👧',
    title: 'Berbakti kepada Orang Tua',
    titleId: 'Contoh pidato singkat SD',
    minutes: 3,
    phaseMin: 'A',
    phaseMax: 'C',
    sections: [
      ['Pembukaan', [...SALAM_PEMBUKA, 'Izinkan saya menyampaikan pidato tentang berbakti kepada orang tua.']],
      [
        'Isi',
        [
          'Teman-teman, ayah dan ibu kita sangat menyayangi kita.',
          'Ibu mengandung dan merawat kita sejak kecil.',
          'Ayah bekerja keras setiap hari untuk keluarga.',
          'Karena itu, kita wajib berbakti kepada orang tua.',
          'Caranya adalah dengan mendengarkan nasihat mereka, berkata sopan, dan membantu pekerjaan di rumah.',
          'Jangan lupa untuk selalu mendoakan ayah dan ibu setiap selesai salat.',
          'Rasulullah bersabda bahwa rida Allah tergantung pada rida orang tua.',
        ],
      ],
      ['Penutup', ['Mari kita menjadi anak yang saleh dan salehah, yang selalu berbakti kepada orang tua.', ...SALAM_PENUTUP]],
    ],
    notes: [TIPS_PIDATO],
    quiz: [
      ['Pidato ini mengajak kita untuk …', ['Berbakti kepada orang tua', 'Rajin berolahraga', 'Menjaga lingkungan'], 0, 'Tema pidato: berbakti kepada orang tua.'],
      ['Contoh berbakti kepada orang tua adalah …', ['Membantah nasihat', 'Membantu pekerjaan di rumah', 'Pulang terlambat'], 1, 'Membantu pekerjaan rumah adalah bentuk bakti.'],
      ['Kalimat "Wassalamu\'alaikum warahmatullahi wabarakatuh" terdapat pada bagian …', ['Pembukaan', 'Isi', 'Penutup'], 2, 'Salam penutup ada di bagian akhir.'],
    ],
  },
  {
    slug: 'pidato-cinta-tanah-air',
    theme: 'Pidato Anak',
    emoji: '🇮🇩',
    title: 'Cinta Tanah Air',
    titleId: 'Pidato menyambut Hari Kemerdekaan',
    minutes: 4,
    phaseMin: 'B',
    phaseMax: 'D',
    sections: [
      ['Pembukaan', [...SALAM_PEMBUKA, 'Dalam rangka memperingati Hari Kemerdekaan Republik Indonesia, saya akan menyampaikan pidato berjudul Cinta Tanah Air.']],
      [
        'Isi',
        [
          'Teman-teman, Indonesia merdeka pada tanggal 17 Agustus 1945.',
          'Kemerdekaan itu diraih dengan perjuangan dan pengorbanan para pahlawan.',
          'Sekarang, kita tidak lagi berperang dengan senjata.',
          'Tugas kita sebagai pelajar adalah mengisi kemerdekaan dengan belajar sungguh-sungguh.',
          'Kita juga dapat menunjukkan cinta tanah air dengan memakai produk dalam negeri, menghargai perbedaan suku dan agama, serta menjaga lingkungan.',
          'Indonesia memiliki ribuan pulau, ratusan bahasa daerah, dan beragam budaya.',
          'Semua itu adalah kekayaan yang harus kita jaga bersama.',
        ],
      ],
      ['Penutup', ['Mari kita buktikan cinta kita kepada Indonesia dengan menjadi pelajar yang rajin, jujur, dan berprestasi.', 'Merdeka!', ...SALAM_PENUTUP]],
    ],
    notes: [TIPS_PIDATO],
    quiz: [
      ['Kapan Indonesia merdeka?', ['17 Agustus 1945', '20 Mei 1908', '28 Oktober 1928'], 0, 'Indonesia merdeka pada 17 Agustus 1945.'],
      ['Tugas pelajar untuk mengisi kemerdekaan menurut pidato adalah …', ['Berperang', 'Belajar sungguh-sungguh', 'Bermain sepanjang hari'], 1, '"… mengisi kemerdekaan dengan belajar sungguh-sungguh."'],
      ['Contoh sikap cinta tanah air adalah …', ['Menghargai perbedaan suku dan agama', 'Merusak fasilitas umum', 'Mengejek budaya daerah lain'], 0, 'Menghargai perbedaan adalah wujud cinta tanah air.'],
    ],
  },
  {
    slug: 'pidato-gemar-membaca',
    theme: 'Pidato Anak',
    emoji: '📖',
    title: 'Gemar Membaca',
    titleId: 'Membaca adalah jendela dunia',
    minutes: 3,
    phaseMin: 'B',
    phaseMax: 'D',
    sections: [
      ['Pembukaan', [...SALAM_PEMBUKA, 'Pada kesempatan yang berbahagia ini, saya akan berpidato tentang pentingnya gemar membaca.']],
      [
        'Isi',
        [
          'Teman-teman, pernahkah kalian mendengar ungkapan "buku adalah jendela dunia"?',
          'Dengan membaca, kita bisa mengetahui banyak hal tanpa harus pergi jauh.',
          'Kita bisa belajar tentang luar angkasa, hewan di hutan, dan kisah para nabi.',
          'Membaca juga membuat kita pandai menulis dan berbicara.',
          'Wahyu pertama yang diturunkan kepada Nabi Muhammad SAW pun dimulai dengan perintah "Iqra", yang artinya bacalah.',
          'Mari kita sisihkan waktu setidaknya lima belas menit setiap hari untuk membaca.',
          'Kita juga bisa sering berkunjung ke perpustakaan sekolah.',
        ],
      ],
      ['Penutup', ['Ayo, jadikan membaca sebagai kebiasaan sehari-hari!', ...SALAM_PENUTUP]],
    ],
    notes: [TIPS_PIDATO],
    quiz: [
      ['Ungkapan "buku adalah jendela dunia" artinya …', ['Buku bisa dipakai sebagai jendela', 'Dengan membaca kita bisa mengetahui banyak hal', 'Buku harus dibaca di dekat jendela'], 1, 'Membaca membuka wawasan kita tentang dunia.'],
      ['"Iqra" artinya …', ['Tulislah', 'Bacalah', 'Dengarlah'], 1, 'Iqra artinya bacalah.'],
      ['Saran yang disampaikan dalam pidato adalah membaca setiap hari minimal …', ['5 menit', '15 menit', '3 jam'], 1, '"… setidaknya lima belas menit setiap hari."'],
    ],
  },
  {
    slug: 'pidato-menyambut-ramadan',
    theme: 'Pidato Anak',
    emoji: '🌙',
    title: 'Menyambut Bulan Ramadan',
    titleId: 'Pidato/kultum anak',
    minutes: 4,
    phaseMin: 'A',
    phaseMax: 'D',
    sections: [
      ['Pembukaan', [...SALAM_PEMBUKA, 'Alhamdulillah, sebentar lagi kita akan bertemu dengan bulan suci Ramadan.']],
      [
        'Isi',
        [
          'Teman-teman, Ramadan adalah bulan yang penuh berkah.',
          'Pada bulan ini, umat Islam diwajibkan berpuasa dari terbit fajar hingga terbenam matahari.',
          'Puasa melatih kita untuk sabar, jujur, dan menahan diri dari perbuatan buruk.',
          'Selain berpuasa, kita bisa memperbanyak membaca Al-Qur\'an.',
          'Kita juga bisa bersedekah dan membantu orang yang membutuhkan.',
          'Jangan lupa makan sahur, karena di dalam sahur terdapat berkah.',
        ],
      ],
      ['Penutup', ['Semoga kita dapat menjalankan ibadah puasa dengan lancar dan penuh semangat.', ...SALAM_PENUTUP]],
    ],
    notes: [TIPS_PIDATO],
    quiz: [
      ['Puasa Ramadan dilakukan dari … hingga …', ['Terbit fajar hingga terbenam matahari', 'Pagi hingga siang', 'Magrib hingga Isya'], 0, 'Puasa dari terbit fajar hingga terbenam matahari.'],
      ['Puasa melatih kita untuk …', ['Bersabar dan jujur', 'Bermalas-malasan', 'Marah-marah'], 0, 'Puasa melatih sabar, jujur, dan menahan diri.'],
      ['Ibadah yang dianjurkan selama Ramadan menurut pidato adalah …', ['Membaca Al-Qur\'an dan bersedekah', 'Tidur seharian', 'Bermain gim'], 0, 'Memperbanyak membaca Al-Qur\'an dan bersedekah.'],
    ],
  },
  {
    slug: 'speech-keep-our-school-green',
    theme: 'English Speech',
    emoji: '🌿',
    title: 'Let\'s Keep Our School Green',
    titleId: 'Contoh pidato bahasa Inggris',
    minutes: 4,
    phaseMin: 'C',
    phaseMax: 'D',
    lang: 'en',
    sections: [
      [
        'Opening',
        [
          'Good morning, ladies and gentlemen. || Selamat pagi, Bapak/Ibu sekalian.',
          'Good morning, teachers and friends. || Selamat pagi, Bapak/Ibu guru dan teman-teman.',
          'First of all, let us thank God for His blessings today. || Pertama-tama, marilah kita bersyukur kepada Tuhan atas karunia-Nya hari ini.',
          'Today, I would like to talk about keeping our school green. || Hari ini, saya ingin berbicara tentang menjaga sekolah kita tetap hijau.',
        ],
      ],
      [
        'Body',
        [
          'Trees and plants make our school cool and beautiful. || Pohon dan tanaman membuat sekolah kita sejuk dan indah.',
          'They also give us fresh air to breathe. || Mereka juga memberi kita udara segar untuk bernapas.',
          'Sadly, some students still throw rubbish on the grass. || Sayangnya, beberapa siswa masih membuang sampah di rumput.',
          'Some students also pick flowers from the school garden. || Beberapa siswa juga memetik bunga dari taman sekolah.',
          'We can do simple things to help. || Kita bisa melakukan hal-hal sederhana untuk membantu.',
          'We can water the plants, bring our own water bottles, and use the rubbish bins. || Kita bisa menyiram tanaman, membawa botol minum sendiri, dan menggunakan tempat sampah.',
        ],
      ],
      [
        'Closing',
        [
          'A green school is a happy school. || Sekolah yang hijau adalah sekolah yang membahagiakan.',
          'Let\'s start today, from ourselves! || Mari kita mulai hari ini, dari diri kita sendiri!',
          'Thank you for your attention. || Terima kasih atas perhatian Anda.',
        ],
      ],
    ],
    notes: [
      {
        title: 'Useful Expressions for Speeches',
        pattern: 'Opening · Body · Closing',
        explanation:
          'Ungkapan pembuka dan penutup pidato bahasa Inggris yang umum dipakai. Ucapkan dengan jelas dan perlahan.',
        examples: [
          'Today, I would like to talk about …',
          'First of all, let us thank God …',
          'Thank you for your attention.',
        ],
      },
    ],
    quiz: [
      ['What is the speech about?', ['Keeping the school green', 'Sports Day', 'Healthy food'], 0, '"I would like to talk about keeping our school green."'],
      ['What do trees and plants give us?', ['Fresh air', 'Rubbish', 'Noise'], 0, '"They also give us fresh air to breathe."'],
      ['Which sentence is used to close a speech?', ['Good morning, everyone.', 'Thank you for your attention.', 'First of all…'], 1, '"Thank you for your attention." adalah penutup.'],
    ],
  },
];
