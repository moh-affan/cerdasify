// Ensiklopedia Anak — Fase A–C (SD), Bahasa Indonesia.
// Fakta sains dasar yang sudah dicek ulang, dengan bagian "Tahukah Kamu?" dan kuis.

import type { SeedArticle } from './types';

export const ensiklopedia: SeedArticle[] = [
  {
    slug: 'ensiklopedia-matahari',
    theme: 'Ensiklopedia: Antariksa',
    emoji: '☀️',
    title: 'Matahari, Bintang Terdekat Kita',
    minutes: 4,
    paragraphs: [
      [
        'Matahari adalah sebuah bintang.',
        'Bintang adalah bola gas raksasa yang sangat panas dan memancarkan cahaya sendiri.',
        'Matahari terlihat lebih besar dari bintang lain karena letaknya paling dekat dengan Bumi.',
      ],
      [
        'Jarak Matahari ke Bumi kira-kira 150 juta kilometer.',
        'Cahaya Matahari membutuhkan waktu sekitar 8 menit untuk sampai ke Bumi.',
        'Matahari juga sangat besar. Lebih dari satu juta Bumi bisa masuk ke dalamnya!',
      ],
      [
        'Matahari sangat penting bagi kehidupan.',
        'Tumbuhan membutuhkan sinar Matahari untuk membuat makanan.',
        'Matahari juga memberi kita cahaya dan kehangatan.',
      ],
      [
        'Ingat, jangan pernah menatap Matahari secara langsung.',
        'Cahayanya yang sangat terang bisa merusak mata.',
      ],
    ],
    vocab: [
      ['bintang', 'bola gas panas yang memancarkan cahaya sendiri', '⭐'],
      ['raksasa', 'sangat besar', '🗻'],
      ['memancarkan', 'mengeluarkan (cahaya atau panas)', '✨'],
      ['kehidupan', 'segala sesuatu yang hidup', '🌱'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Permukaan Matahari panasnya sekitar 5.500 derajat Celsius, jauh lebih panas daripada api kompor.',
        examples: ['Matahari terbit di timur dan terbenam di barat.', 'Bumi mengelilingi Matahari dalam waktu satu tahun.'],
      },
    ],
    quiz: [
      ['Matahari termasuk …', ['Planet', 'Bintang', 'Bulan'], 1, 'Matahari adalah bintang yang memancarkan cahaya sendiri.'],
      ['Berapa lama cahaya Matahari sampai ke Bumi?', ['Sekitar 8 detik', 'Sekitar 8 menit', 'Sekitar 8 jam'], 1, 'Cahaya Matahari butuh sekitar 8 menit untuk sampai ke Bumi.'],
      ['Mengapa kita tidak boleh menatap Matahari langsung?', ['Bisa merusak mata', 'Bisa membuat lapar', 'Bisa membuat mengantuk'], 0, 'Cahayanya sangat terang dan bisa merusak mata.'],
    ],
  },
  {
    slug: 'ensiklopedia-gajah',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🐘',
    title: 'Gajah, Raksasa yang Lembut',
    minutes: 4,
    paragraphs: [
      [
        'Gajah adalah hewan darat terbesar di dunia.',
        'Gajah dewasa bisa seberat beberapa mobil sekaligus.',
        'Meskipun besar, gajah adalah hewan pemakan tumbuhan.',
      ],
      [
        'Gajah punya belalai yang panjang.',
        'Belalai adalah hidung dan bibir atas yang menyatu.',
        'Dengan belalainya, gajah bisa mencium bau, mengambil makanan, dan menyedot air untuk minum atau mandi.',
      ],
      [
        'Telinga gajah sangat lebar.',
        'Gajah mengibaskan telinganya seperti kipas agar tubuhnya tetap sejuk.',
        'Setiap hari, gajah makan lebih dari 100 kilogram rumput, daun, dan buah.',
      ],
      [
        'Di Indonesia ada gajah Sumatra.',
        'Jumlahnya sekarang sangat sedikit sehingga gajah Sumatra dilindungi.',
        'Kita harus menjaga hutan agar gajah tetap punya rumah.',
      ],
    ],
    vocab: [
      ['belalai', 'hidung panjang gajah yang bisa memegang benda', '🐘'],
      ['pemakan tumbuhan', 'hewan yang makanannya rumput, daun, dan buah (herbivora)', '🌿'],
      ['mengibaskan', 'menggerakkan ke depan dan ke belakang dengan cepat', '🪭'],
      ['dilindungi', 'dijaga oleh hukum agar tidak diburu atau punah', '🛡️'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Gajah memiliki ingatan yang sangat kuat. Mereka bisa mengingat jalan menuju sumber air selama bertahun-tahun.',
        examples: ['Anak gajah kadang mengisap belalainya seperti bayi mengisap jempol.'],
      },
    ],
    quiz: [
      ['Gajah adalah hewan … terbesar di dunia.', ['Laut', 'Darat', 'Udara'], 1, 'Gajah adalah hewan darat terbesar.'],
      ['Belalai gajah sebenarnya adalah …', ['Ekor yang panjang', 'Hidung dan bibir atas', 'Kaki kelima'], 1, 'Belalai adalah hidung dan bibir atas yang menyatu.'],
      ['Mengapa gajah mengibaskan telinganya?', ['Agar tubuhnya sejuk', 'Untuk terbang', 'Untuk menakuti semut'], 0, 'Telinga dikibaskan seperti kipas agar tubuh tetap sejuk.'],
    ],
  },
  {
    slug: 'ensiklopedia-pelangi',
    theme: 'Ensiklopedia: Alam',
    emoji: '🌈',
    title: 'Bagaimana Pelangi Terbentuk?',
    minutes: 3,
    paragraphs: [
      [
        'Cahaya Matahari terlihat putih.',
        'Sebenarnya, cahaya putih adalah campuran dari banyak warna.',
      ],
      [
        'Setelah hujan, masih banyak tetes air kecil di udara.',
        'Saat cahaya Matahari menembus tetes air, cahaya itu dibelokkan dan terurai menjadi warna-warna.',
        'Itulah yang kita lihat sebagai pelangi.',
      ],
      [
        'Warna pelangi dapat diingat dengan kata "mejikuhibiniu".',
        'Artinya merah, jingga, kuning, hijau, biru, nila, dan ungu.',
      ],
      [
        'Untuk melihat pelangi, Matahari harus berada di belakang kita.',
        'Karena itu, pelangi sering muncul pada pagi atau sore hari setelah hujan.',
      ],
    ],
    vocab: [
      ['tetes', 'butiran kecil air', '💧'],
      ['menembus', 'masuk dan melewati sesuatu', '➡️'],
      ['terurai', 'terpisah menjadi bagian-bagian', '🔀'],
      ['nila', 'warna antara biru dan ungu', '🟣'],
    ],
    notes: [
      {
        title: 'Coba di Rumah!',
        explanation:
          'Berdirilah membelakangi Matahari pada pagi hari, lalu semprotkan air dari selang ke udara. Kamu bisa membuat pelangi sendiri!',
        examples: ['Minta izin dan ditemani orang tua, ya.'],
      },
    ],
    quiz: [
      ['Cahaya putih sebenarnya adalah …', ['Satu warna saja', 'Campuran banyak warna', 'Tidak berwarna'], 1, 'Cahaya putih adalah campuran banyak warna.'],
      ['"Mejikuhibiniu" adalah singkatan dari …', ['Nama-nama hari', 'Warna-warna pelangi', 'Nama planet'], 1, 'Merah, jingga, kuning, hijau, biru, nila, ungu.'],
      ['Agar bisa melihat pelangi, Matahari harus berada di …', ['Depan kita', 'Belakang kita', 'Atas kepala kita'], 1, 'Matahari harus berada di belakang kita.'],
    ],
  },
  {
    slug: 'ensiklopedia-gunung-berapi',
    theme: 'Ensiklopedia: Alam',
    emoji: '🌋',
    title: 'Gunung Berapi di Indonesia',
    minutes: 4,
    paragraphs: [
      [
        'Indonesia memiliki banyak gunung berapi.',
        'Ada sekitar 127 gunung berapi yang masih aktif.',
        'Indonesia berada di jalur gunung api yang disebut Cincin Api Pasifik.',
      ],
      [
        'Jauh di dalam perut bumi, ada batuan cair yang sangat panas.',
        'Batuan cair itu disebut magma.',
        'Ketika gunung meletus, magma keluar ke permukaan dan disebut lava.',
      ],
      [
        'Letusan gunung berapi bisa berbahaya.',
        'Tetapi abu gunung berapi membuat tanah di sekitarnya menjadi subur.',
        'Karena itu, banyak sawah dan kebun yang hijau di dekat gunung.',
      ],
      [
        'Jika gunung berapi akan meletus, petugas akan memberi peringatan.',
        'Kita harus mengikuti petunjuk petugas dan mengungsi ke tempat yang aman.',
      ],
    ],
    vocab: [
      ['aktif', 'masih bisa meletus', '🔥'],
      ['magma', 'batuan cair yang sangat panas di dalam bumi', '🟠'],
      ['lava', 'magma yang sudah keluar ke permukaan bumi', '🌋'],
      ['subur', 'baik untuk tumbuhan, sehingga tanaman tumbuh dengan baik', '🌾'],
      ['mengungsi', 'pindah sementara ke tempat yang aman', '🏃'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation:
          'Pada tahun 1883, Gunung Krakatau di Selat Sunda meletus sangat dahsyat. Suara letusannya terdengar sampai ribuan kilometer jauhnya.',
        examples: ['Gunung Merapi di Jawa Tengah adalah salah satu gunung api paling aktif di Indonesia.'],
      },
    ],
    quiz: [
      ['Batuan cair panas di dalam perut bumi disebut …', ['Lava', 'Magma', 'Pasir'], 1, 'Di dalam bumi disebut magma; setelah keluar disebut lava.'],
      ['Apa manfaat abu gunung berapi?', ['Membuat tanah subur', 'Membuat air asin', 'Membuat udara dingin'], 0, 'Abu gunung membuat tanah menjadi subur.'],
      ['Apa yang harus dilakukan jika ada peringatan gunung akan meletus?', ['Mendaki gunung', 'Mengikuti petunjuk petugas dan mengungsi', 'Diam di rumah saja'], 1, 'Ikuti petunjuk petugas dan pindah ke tempat aman.'],
    ],
  },
  {
    slug: 'ensiklopedia-metamorfosis-kupu-kupu',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🦋',
    title: 'Ajaibnya Metamorfosis Kupu-Kupu',
    minutes: 3,
    paragraphs: [
      [
        'Tahukah kamu, kupu-kupu yang cantik dulunya adalah seekor ulat?',
        'Perubahan bentuk ini disebut metamorfosis.',
      ],
      [
        'Pertama, kupu-kupu bertelur di daun.',
        'Kedua, telur menetas menjadi ulat kecil. Ulat makan daun terus-menerus sampai tubuhnya besar.',
        'Ketiga, ulat membungkus dirinya menjadi kepompong.',
        'Keempat, setelah beberapa waktu, kepompong terbuka dan keluarlah kupu-kupu bersayap indah.',
      ],
      [
        'Kupu-kupu suka mengisap madu bunga.',
        'Saat berpindah dari bunga ke bunga, kupu-kupu membantu penyerbukan.',
        'Karena itu, tumbuhan bisa berbuah dan berbiji.',
      ],
    ],
    vocab: [
      ['metamorfosis', 'perubahan bentuk hewan dari kecil sampai dewasa', '🔄'],
      ['menetas', 'keluar dari telur', '🥚'],
      ['kepompong', 'bungkus tempat ulat berubah menjadi kupu-kupu', '🫘'],
      ['penyerbukan', 'berpindahnya serbuk sari sehingga bunga bisa menjadi buah', '🌸'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Kupu-kupu bisa merasakan rasa makanan dengan kakinya!',
        examples: ['Urutan metamorfosis: telur → ulat → kepompong → kupu-kupu.'],
      },
    ],
    quiz: [
      ['Perubahan bentuk ulat menjadi kupu-kupu disebut …', ['Fotosintesis', 'Metamorfosis', 'Evaporasi'], 1, 'Perubahan bentuk ini disebut metamorfosis.'],
      ['Urutan yang benar adalah …', ['Telur → ulat → kepompong → kupu-kupu', 'Ulat → telur → kupu-kupu → kepompong', 'Kepompong → telur → ulat → kupu-kupu'], 0, 'Telur menetas menjadi ulat, lalu kepompong, lalu kupu-kupu.'],
      ['Apa manfaat kupu-kupu bagi tumbuhan?', ['Membantu penyerbukan', 'Memakan hama tikus', 'Menyiram tanaman'], 0, 'Kupu-kupu membantu penyerbukan bunga.'],
    ],
  },
  {
    slug: 'ensiklopedia-jantung',
    theme: 'Ensiklopedia: Tubuh Manusia',
    emoji: '❤️',
    title: 'Jantung yang Tak Pernah Lelah',
    minutes: 3,
    paragraphs: [
      [
        'Letakkan tanganmu di dada sebelah kiri. Apakah kamu merasakan "dug-dug"?',
        'Itu adalah detak jantungmu!',
      ],
      [
        'Jantung kira-kira sebesar kepalan tangan pemiliknya.',
        'Tugas jantung adalah memompa darah ke seluruh tubuh.',
        'Darah membawa oksigen dan sari makanan yang dibutuhkan tubuh.',
      ],
      [
        'Jantung bekerja siang dan malam, bahkan saat kita tidur.',
        'Dalam satu hari, jantung berdetak sekitar 100.000 kali!',
        'Saat kita berlari, jantung berdetak lebih cepat.',
      ],
      [
        'Agar jantung tetap sehat, rajinlah berolahraga.',
        'Makanlah sayur dan buah, serta kurangi makanan yang terlalu manis dan berlemak.',
      ],
    ],
    vocab: [
      ['kepalan tangan', 'tangan yang digenggam erat', '✊'],
      ['memompa', 'mendorong cairan agar mengalir', '🔁'],
      ['oksigen', 'gas di udara yang kita hirup untuk bernapas', '🫁'],
      ['berdetak', 'berdenyut dengan teratur', '💓'],
    ],
    notes: [
      {
        title: 'Coba Sendiri!',
        explanation:
          'Hitung detak jantungmu selama satu menit saat duduk. Lalu lompat-lompat selama satu menit dan hitung lagi. Mana yang lebih cepat?',
        examples: ['Detak jantung anak-anak lebih cepat daripada orang dewasa.'],
      },
    ],
    quiz: [
      ['Kira-kira sebesar apa jantung kita?', ['Sebesar kepalan tangan', 'Sebesar kepala', 'Sebesar kelereng'], 0, 'Jantung kira-kira sebesar kepalan tangan pemiliknya.'],
      ['Apa tugas jantung?', ['Mencerna makanan', 'Memompa darah ke seluruh tubuh', 'Menyaring udara'], 1, 'Jantung memompa darah ke seluruh tubuh.'],
      ['Saat kita berlari, jantung berdetak …', ['Lebih lambat', 'Lebih cepat', 'Berhenti'], 1, 'Saat berlari, jantung berdetak lebih cepat.'],
    ],
  },
  {
    slug: 'ensiklopedia-bulan',
    theme: 'Ensiklopedia: Antariksa',
    emoji: '🌕',
    title: 'Mengenal Bulan',
    minutes: 3,
    paragraphs: [
      [
        'Bulan adalah satelit Bumi. Artinya, Bulan beredar mengelilingi Bumi.',
        'Bulan mengelilingi Bumi kira-kira satu bulan sekali.',
      ],
      [
        'Bulan tidak memiliki cahaya sendiri.',
        'Bulan terlihat terang karena memantulkan cahaya Matahari.',
        'Bentuk Bulan yang kita lihat berubah-ubah, dari sabit sampai purnama.',
      ],
      [
        'Pada tahun 1969, Neil Armstrong menjadi manusia pertama yang menginjakkan kaki di Bulan.',
        'Di Bulan tidak ada udara dan angin.',
        'Karena itu, jejak kaki para astronaut masih ada di sana sampai sekarang.',
      ],
      [
        'Umat Islam menggunakan peredaran Bulan untuk menentukan kalender Hijriah.',
        'Awal bulan Ramadan, misalnya, ditentukan dengan melihat hilal atau bulan sabit muda.',
      ],
    ],
    vocab: [
      ['satelit', 'benda langit yang mengelilingi planet', '🛰️'],
      ['memantulkan', 'mengembalikan cahaya yang datang', '🪞'],
      ['purnama', 'Bulan yang terlihat bulat penuh', '🌕'],
      ['astronaut', 'orang yang terbang ke luar angkasa', '👩‍🚀'],
      ['hilal', 'bulan sabit muda, tanda awal bulan Hijriah', '🌙'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Bulan selalu menghadapkan sisi yang sama ke Bumi. Jadi dari Bumi, kita tidak pernah melihat sisi belakang Bulan.',
        examples: ['Bulan purnama terjadi sekitar setiap 29–30 hari.'],
      },
    ],
    quiz: [
      ['Mengapa Bulan terlihat terang?', ['Bulan punya cahaya sendiri', 'Bulan memantulkan cahaya Matahari', 'Bulan terbuat dari lampu'], 1, 'Bulan memantulkan cahaya Matahari.'],
      ['Siapa manusia pertama yang menginjakkan kaki di Bulan?', ['Neil Armstrong', 'Isaac Newton', 'Galileo'], 0, 'Neil Armstrong, pada tahun 1969.'],
      ['Kalender yang ditentukan oleh peredaran Bulan adalah kalender …', ['Masehi', 'Hijriah', 'Sekolah'], 1, 'Kalender Hijriah berdasarkan peredaran Bulan.'],
    ],
  },
  {
    slug: 'ensiklopedia-siklus-air',
    theme: 'Ensiklopedia: Alam',
    emoji: '💧',
    title: 'Perjalanan Air: Siklus Air',
    minutes: 4,
    paragraphs: [
      [
        'Tahukah kamu, air hujan berasal dari laut, sungai, dan danau?',
        'Air terus berpindah dalam sebuah perjalanan yang disebut siklus air.',
      ],
      [
        'Pertama, panas Matahari membuat air di laut dan sungai menguap.',
        'Uap air itu naik ke langit.',
        'Kedua, di atas langit udaranya dingin, sehingga uap air berkumpul menjadi awan.',
      ],
      [
        'Ketiga, ketika awan semakin berat, air jatuh kembali ke bumi sebagai hujan.',
        'Keempat, air hujan mengalir ke sungai, meresap ke dalam tanah, lalu kembali ke laut.',
        'Kemudian perjalanan air dimulai lagi dari awal.',
      ],
      [
        'Air sangat berharga bagi semua makhluk hidup.',
        'Karena itu, kita harus hemat air dan tidak membuang sampah ke sungai.',
      ],
    ],
    vocab: [
      ['siklus', 'kejadian yang berulang terus-menerus', '🔁'],
      ['menguap', 'berubah dari air menjadi uap karena panas', '♨️'],
      ['uap air', 'air dalam bentuk gas yang tidak terlihat', '🌫️'],
      ['meresap', 'masuk sedikit demi sedikit ke dalam tanah', '🟫'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Air yang kamu minum hari ini mungkin dulu pernah menjadi awan, hujan, atau bahkan air laut!',
        examples: ['Urutan siklus air: menguap → menjadi awan → hujan → mengalir kembali.'],
      },
    ],
    quiz: [
      ['Apa yang membuat air di laut menguap?', ['Angin malam', 'Panas Matahari', 'Ikan di laut'], 1, 'Panas Matahari membuat air menguap.'],
      ['Uap air berkumpul di langit menjadi …', ['Awan', 'Pelangi', 'Bintang'], 0, 'Uap air yang mendingin berkumpul menjadi awan.'],
      ['Bagaimana cara kita menjaga air?', ['Membuang sampah ke sungai', 'Hemat air', 'Membiarkan keran terbuka'], 1, 'Kita harus hemat air dan menjaga sungai tetap bersih.'],
    ],
  },
];
