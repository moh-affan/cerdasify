// Ensiklopedia Anak — Fase A–C (SD), Bahasa Indonesia.
// Fakta sains dasar, alam, antariksa, hewan, tubuh manusia, dan teknologi yang ramah anak dengan bagian "Tahukah Kamu?" dan kuis interaktif.

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
      ['raksasa', 'sangat besar ukurannya', '🗻'],
      ['memancarkan', 'mengeluarkan cahaya atau panas ke segala arah', '✨'],
      ['kehidupan', 'segala sesuatu yang hidup dan bernapas di alam semesta', '🌱'],
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
      ['tetes', 'butiran kecil cairan seperti air', '💧'],
      ['menembus', 'masuk dan melewati celah atau lapisan', '➡️'],
      ['terurai', 'terpisah menjadi bagian-bagian penyusunnya', '🔀'],
      ['nila', 'warna ungu kebiru-biruan yang berada di antara biru dan ungu', '🟣'],
    ],
    notes: [
      {
        title: 'Coba di Rumah!',
        explanation:
          'Berdirilah membelakangi Matahari pada pagi hari, lalu semprotkan air dari selang ke udara. Kamu bisa membuat pelangi sendiri!',
        examples: ['Minta izin dan ditemani orang tua saat bermain air.'],
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
      ['aktif', 'keadaan masih bisa meletus atau mengeluarkan lahar', '🔥'],
      ['magma', 'batuan cair yang sangat panas di dalam perut bumi', '🟠'],
      ['lava', 'magma yang sudah keluar mengalir ke permukaan bumi', '🌋'],
      ['subur', 'tanah yang kaya unsur hara sehingga tanaman tumbuh subur', '🌾'],
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
      ['metamorfosis', 'perubahan bentuk fisik hewan dari tahap muda hingga dewasa', '🔄'],
      ['menetas', 'proses anak hewan keluar dari dalam cangkang telur', '🥚'],
      ['kepompong', 'selubung pelindung tempat ulat bertransformasi menjadi kupu-kupu', '🫘'],
      ['penyerbukan', 'peristiwa jatuhnya serbuk sari ke putik bunga untuk pembuahan', '🌸'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Kupu-kupu bisa mencicipi dan merasakan rasa makanan dengan reseptor pada kakinya!',
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
      ['kepalan tangan', 'tangan yang digenggam dengan jari tertekuk rapat', '✊'],
      ['memompa', 'mendorong cairan mengalir melalui saluran secara bertekanan', '🔁'],
      ['oksigen', 'gas segar di udara yang dihirup tubuh untuk bernapas', '🫁'],
      ['berdetak', 'berdenyut secara teratur memompa darah', '💓'],
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
        'Bulan adalah satelit alami Bumi. Artinya, Bulan beredar mengelilingi Bumi.',
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
      ['satelit', 'benda langit yang beredar mengelilingi planet yang lebih besar', '🛰️'],
      ['memantulkan', 'membalikkan arah cahaya yang mengenai permukaannya', '🪞'],
      ['purnama', 'fase saat Bulan tampak bulat utuh dan sangat terang', '🌕'],
      ['astronaut', 'antariksawan yang terlatih menjelajahi luar angkasa', '👩‍🚀'],
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
      ['siklus', 'rangkaian peristiwa yang berulang teratur tanpa henti', '🔁'],
      ['menguap', 'berubah wujud dari cair menjadi gas akibat panas', '♨️'],
      ['uap air', 'air dalam bentuk gas yang tidak tampak kasat mata', '🌫️'],
      ['meresap', 'masuknya cairan ke dalam pori-pori tanah secara perlahan', '🟫'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Air yang kamu minum hari ini mungkin dulu pernah menjadi awan, hujan, atau bahkan air laut jutaan tahun lalu!',
        examples: ['Urutan siklus air: menguap → menjadi awan → hujan → mengalir kembali.'],
      },
    ],
    quiz: [
      ['Apa yang membuat air di laut menguap?', ['Angin malam', 'Panas Matahari', 'Ikan di laut'], 1, 'Panas Matahari membuat air menguap.'],
      ['Uap air berkumpul di langit menjadi …', ['Awan', 'Pelangi', 'Bintang'], 0, 'Uap air yang mendingin berkumpul menjadi awan.'],
      ['Bagaimana cara kita menjaga air?', ['Membuang sampah ke sungai', 'Hemat air dan tidak mengotori sungai', 'Membiarkan keran terbuka terus'], 1, 'Kita harus hemat air dan menjaga sungai tetap bersih.'],
    ],
  },
  {
    slug: 'ensiklopedia-planet-bumi',
    theme: 'Ensiklopedia: Antariksa',
    emoji: '🌍',
    title: 'Bumi, Planet Biru Rumah Kita',
    minutes: 4,
    paragraphs: [
      [
        'Bumi adalah planet ketiga dari Matahari di tata surya kita.',
        'Jika dilihat dari luar angkasa, Bumi tampak berwarna biru berkilau.',
        'Warna biru itu berasal dari samudra luas yang menutupi sekitar 70 persen permukaan Bumi.',
      ],
      [
        'Sampai saat ini, Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan.',
        'Bumi memiliki udara yang kaya oksigen untuk bernapas dan suhu yang pas untuk air tetap cair.',
        'Planet kita juga diselimuti oleh lapisan udara pelindung bernama atmosfer.',
      ],
      [
        'Atmosfer melindungi kita dari sinar matahari yang berbahaya dan batuan angkasa atau meteor yang jatuh.',
        'Bumi berputar pada porosnya setiap 24 jam, menyebabkan terjadinya pergantian siang dan malam.',
      ],
      [
        'Bumi adalah rumah bagi miliaran manusia, hewan, dan tumbuhan.',
        'Kewajiban kita bersama adalah menjaga kelestarian bumi dengan menanam pohon dan mengurangi sampah.',
      ],
    ],
    vocab: [
      ['atmosfer', 'lapisan gas yang menyelimuti dan melindungi sebuah planet', '🛡️'],
      ['poros', 'garis khayal tempat suatu benda berputar pada dirinya sendiri', '🔄'],
      ['samudra', 'lautan yang sangat luas membentang di permukaan bumi', '🌊'],
      ['meteor', 'batuan luar angkasa yang terbakar saat memasuki atmosfer bumi', '☄️'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Bumi membutuhkan waktu 365 seperempat hari untuk mengitari Matahari satu kali putaran penuh. Inilah yang kita sebut satu tahun.',
        examples: ['Siang hari terjadi saat bagian Bumi menghadap Matahari.', 'Malam hari terjadi saat bagian Bumi membelakangi Matahari.'],
      },
    ],
    quiz: [
      ['Mengapa Bumi tampak berwarna biru dari luar angkasa?', ['Karena tertutup hutan hijau', 'Karena sebagian besar permukaannya adalah samudra air', 'Karena langitnya dicat biru'], 1, 'Sekitar 70 persen permukaan Bumi adalah lautan dan samudra air.'],
      ['Apa nama lapisan udara yang melindungi Bumi dari meteor dan radiasi?', ['Atmosfer', 'Biosfer', 'Kawah'], 0, 'Atmosfer menyelimuti dan melindungi bumi.'],
      ['Berapa lama Bumi berputar pada porosnya satu kali?', ['1 jam', '24 jam (satu hari)', '30 hari'], 1, 'Perputaran pada porosnya memakan waktu 24 jam dan menciptakan siang serta malam.'],
    ],
  },
  {
    slug: 'ensiklopedia-planet-mars',
    theme: 'Ensiklopedia: Antariksa',
    emoji: '🔴',
    title: 'Mars, Si Planet Merah',
    minutes: 4,
    paragraphs: [
      [
        'Mars adalah planet keempat dari Matahari, tetangga terdekat Bumi.',
        'Mars sering dijuluki sebagai "Planet Merah" karena permukaannya yang tampak kemerahan di langit malam.',
        'Warna merah itu disebabkan oleh banyaknya debu besi berkarat yang menyelimuti tanahnya.',
      ],
      [
        'Mars lebih kecil daripada Bumi dan udaranya sangat dingin serta kering.',
        'Di Mars terdapat gunung berapi terbesar di seluruh tata surya bernama Olympus Mons.',
        'Tinggi Olympus Mons hampir tiga kali lipat tinggi Gunung Everest di Bumi!',
      ],
      [
        'Ilmuwan sangat tertarik meneliti Mars untuk mencari tahu apakah dulu pernah ada air mengalir di sana.',
        'Manusia belum pernah mendarat di Mars, namun banyak robot penjelajah canggih yang sudah dikirim ke sana.',
        'Robot-robot penjelajah itu mengambil foto, mengebor batu, dan mengirimkan datanya ke Bumi.',
      ],
    ],
    vocab: [
      ['berkarat', 'lapisan merah kecokelatan pada besi akibat bereaksi dengan oksigen', '⚙️'],
      ['penjelajah', 'orang atau wahana yang berkelana untuk menyelidiki daerah baru', '🤖'],
      ['tata surya', 'kumpulan planet dan benda langit yang mengelilingi Matahari', '🪐'],
      ['kawah', 'lubang cekungan besar di tanah akibat letusan gunung atau hantaman meteor', '🕳️'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Satu hari di Mars lamanya hampir sama dengan di Bumi, yaitu sekitar 24 jam 37 menit.',
        examples: ['Mars memiliki dua bulan kecil bernama Phobos dan Deimos.'],
      },
    ],
    quiz: [
      ['Mengapa planet Mars terlihat berwarna merah?', ['Karena ada banyak api unggun', 'Karena tanahnya dipenuhi debu besi berkarat', 'Karena terbuat dari batu bata'], 1, 'Debu oksida besi (karat) membuat permukaannya berwarna merah.'],
      ['Apa nama gunung berapi raksasa yang ada di Mars?', ['Gunung Merapi', 'Olympus Mons', 'Gunung Krakatau'], 1, 'Olympus Mons adalah gunung berapi tertinggi di tata surya.'],
      ['Siapa yang menjelajahi dan mengambil foto permukaan Mars saat ini?', ['Astronaut manusia', 'Robot penjelajah (rover)', 'Pesawat terbang biasa'], 1, 'Robot penjelajah tanpa awak bertugas meneliti permukaan Mars.'],
    ],
  },
  {
    slug: 'ensiklopedia-bintang-dan-rasi',
    theme: 'Ensiklopedia: Antariksa',
    emoji: '✨',
    title: 'Bintang dan Rasi Bintang di Langit Malam',
    minutes: 3,
    paragraphs: [
      [
        'Saat malam hari cerah tanpa awan, langit dihiasi oleh ribuan titik cahaya berkilau.',
        'Titik-titik cahaya itu adalah bintang yang letaknya sangat jauh dari tata surya kita.',
        'Semua bintang sebenarnya adalah bola gas panas raksasa, sama seperti Matahari kita.',
      ],
      [
        'Sejak ribuan tahun lalu, manusia memperhatikan bahwa beberapa bintang membentuk pola tertentu.',
        'Kelompok bintang yang membentuk pola ini disebut rasi bintang atau konstelasi.',
        'Orang zaman dahulu menamai rasi bintang berdasarkan bentuk binatang, pahlawan dongeng, atau benda.',
      ],
      [
        'Sebelum ada kompas dan GPS, para pelaut dan penjelajah menggunakan rasi bintang sebagai petunjuk arah.',
        'Di belahan bumi selatan, Rasi Bintang Salib Selatan atau Bintang Pari digunakan untuk menunjukkan arah selatan.',
        'Di utara, Bintang Kutub menunjukkan arah utara yang tepat.',
      ],
    ],
    vocab: [
      ['rasi bintang', 'kelompok bintang yang tampak membentuk pola tertentu di langit', '✨'],
      ['konstelasi', 'sebutan ilmiah untuk susunan gugusan rasi bintang', '🌌'],
      ['kompas', 'alat penunjuk arah mata angin dengan jarum magnetik', '🧭'],
      ['berkelip', 'cahaya yang tampak bersinar redup dan terang bergantian karena atmosfer', '⭐'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Bintang tampak berkelip-kelip bukan karena lampunya mati-hidup, melainkan karena cahayanya melewati lapisan udara bumi yang bergerak.',
        examples: ['Rasi Bintang Orion tampak seperti pemburu dengan sabuk tiga bintang terang.'],
      },
    ],
    quiz: [
      ['Apakah sebenarnya bintang-bintang di langit malam itu?', ['Lentera gantung raksasa', 'Bola gas panas yang sangat jauh', 'Pecahan kaca cermin'], 1, 'Bintang adalah bola gas panas yang memancarkan cahaya sendiri.'],
      ['Kumpulan bintang yang membentuk pola disebut …', ['Planetarium', 'Rasi bintang atau konstelasi', 'Komet'], 1, 'Pola bintang disebut rasi bintang.'],
      ['Untuk apa rasi bintang digunakan oleh para pelaut zaman dahulu?', ['Untuk mendengarkan musik', 'Sebagai petunjuk arah mata angin di laut', 'Untuk memasak air'], 1, 'Rasi bintang digunakan sebagai kompas alami penunjuk arah pelayaran.'],
    ],
  },
  {
    slug: 'ensiklopedia-paus-biru',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🐋',
    title: 'Paus Biru, Raksasa Samudra',
    minutes: 4,
    paragraphs: [
      [
        'Paus biru adalah makhluk hidup terbesar yang pernah ada di muka bumi.',
        'Ukurannya bahkan jauh lebih besar daripada dinosaurus terbesar yang pernah hidup!',
        'Panjang tubuh paus biru bisa mencapai 30 meter dengan berat sekitar 150 ton.',
      ],
      [
        'Meskipun hidup di air, paus biru bukanlah ikan.',
        'Paus adalah mamalia laut. Mereka bernapas dengan paru-paru, melahirkan anak, dan menyusui bayinya.',
        'Secara berkala, paus harus naik ke permukaan air untuk menghirup oksigen melalui lubang sembur di atas kepalanya.',
      ],
      [
        'Walaupun tubuhnya sebesar rumah gedung, makanan paus biru sangatlah mungil.',
        'Mereka memakan hewan udang kecil bernama krill.',
        'Dalam satu hari, seekor paus biru dewasa bisa menelan sampai 4 ton krill dengan menyaring air menggunakan baleen di mulutnya.',
      ],
      [
        'Paus biru juga menghasilkan suara paling keras di dunia hewan.',
        'Nyanyian suara rendah mereka dapat terdengar oleh paus lain sejauh ratusan kilometer di bawah samudra.',
      ],
    ],
    vocab: [
      ['mamalia', 'hewan menyusui yang bernapas dengan paru-paru dan berdarah panas', '🍼'],
      ['krill', 'hewan laut kecil mirip udang yang menjadi santapan utama paus', '🦐'],
      ['lubang sembur', 'lubang pernapasan di bagian atas kepala paus untuk menghirup udara', '🐳'],
      ['baleen', 'lempengan penyaring di mulut paus pengganti gigi untuk menyaring makanan', '🦷'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Jantung seekor paus biru besarnya kira-kira seukuran mobil kecil, dan lidahnya saja seberat seekor gajah dewasa!',
        examples: ['Anak paus biru yang baru lahir bisa meminum ratusan liter susu setiap hari.'],
      },
    ],
    quiz: [
      ['Apakah paus biru termasuk jenis ikan?', ['Ya, karena hidup di laut', 'Bukan, paus adalah mamalia yang bernapas dengan paru-paru', 'Paus adalah bangsa burung air'], 1, 'Paus adalah mamalia yang melahirkan, menyusui, dan bernapas dengan paru-paru.'],
      ['Apa makanan utama paus biru raksasa?', ['Ikan hiu besar', 'Udang kecil bernama krill', 'Rumput laut'], 1, 'Paus memakan jutaan krill kecil setiap hari.'],
      ['Bagaimana cara paus bernapas?', ['Menggunakan insang di leher', 'Menghirup udara lewat lubang sembur di atas kepala', 'Menelan air laut terus-menerus'], 1, 'Paus naik ke permukaan dan menghirup udara melalui lubang sembur.'],
    ],
  },
  {
    slug: 'ensiklopedia-lebah-madu',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🐝',
    title: 'Lebah Madu, Serangga Pekerja Keras',
    minutes: 4,
    paragraphs: [
      [
        'Lebah madu adalah serangga kecil yang memiliki peran luar biasa bagi bumi.',
        'Mereka hidup bersama dalam sebuah sarang besar yang disebut koloni.',
        'Dalam satu sarang lebah, ada puluhan ribu lebah yang dipimpin oleh satu Ratu Lebah.',
      ],
      [
        'Setiap lebah memiliki tugasnya masing-masing.',
        'Ratu lebah bertugas bertelur untuk melahirkan anggota keluarga baru.',
        'Lebah pekerja, yang semuanya perempuan, bertugas mencari sari bunga, membersihkan sarang, dan merawat anak lebah.',
      ],
      [
        'Saat hinggap di bunga, lebah mengisap cairan manis yang disebut nektar.',
        'Nektar itu dibawa ke sarang dan diolah menjadi madu yang lezat dan bergizi tinggi.',
        'Sambil mengumpulkan nektar, serbuk sari menempel pada tubuh lebah dan terbawa ke bunga lain.',
        'Proses penyerbukan ini membuat tanaman buah, sayur, dan biji-bijian bisa tumbuh subur.',
      ],
      [
        'Lebah juga sangat pintar berkomunikasi.',
        'Jika menemukan ladang bunga yang harum, mereka menari di sarang dengan gerakan khusus bernama "tarian goyang" untuk memberitahu arahnya kepada teman-temannya.',
      ],
    ],
    vocab: [
      ['koloni', 'kelompok besar makhluk hidup sejenis yang tinggal dan bekerja sama', '🏘️'],
      ['nektar', 'cairan manis yang dihasilkan bunga untuk memikat serangga', '🍯'],
      ['ratu lebah', 'pemimpin koloni lebah yang bertugas menghasilkan semua telur', '👑'],
      ['komunikasi', 'cara bertukar informasi atau pesan antar individu', '🗣️'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Madu murni adalah salah satu makanan yang tidak pernah basi selama ribuan tahun jika disimpan dalam wadah tertutup rapat!',
        examples: ['Tanpa bantuan penyerbukan lebah, banyak buah seperti apel dan stroberi tidak akan bisa berbuah lebat.'],
      },
    ],
    quiz: [
      ['Siapa yang memimpin sarang koloni lebah madu?', ['Lebah penjaga', 'Satu ekor Ratu Lebah', 'Lebah jantan tertua'], 1, 'Koloni lebah dipimpin oleh Ratu Lebah.'],
      ['Apa nama cairan manis bunga yang diubah menjadi madu?', ['Getah', 'Nektar', 'Embun'], 1, 'Lebah mengumpulkan nektar manis dari kelopak bunga.'],
      ['Bagaimana cara lebah memberitahu lokasi ladang bunga kepada temannya?', ['Dengan tarian goyang khusus di sarang', 'Dengan berteriak kencang', 'Dengan menulis peta'], 0, 'Lebah menggunakan tarian goyang untuk menunjukkan arah dan jarak bunga.'],
    ],
  },
  {
    slug: 'ensiklopedia-burung-hantu',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🦉',
    title: 'Burung Hantu, Pemburu Malam yang Tangguh',
    minutes: 3,
    paragraphs: [
      [
        'Burung hantu adalah burung unik yang aktif mencari makan pada malam hari.',
        'Hewan yang beraktivitas di malam hari dan tidur di siang hari disebut hewan nokturnal.',
        'Burung hantu dikenal sebagai penjaga sawah alami karena suka memangsa tikus perusak padi.',
      ],
      [
        'Burung hantu memiliki mata bulat besar yang menghadap lurus ke depan.',
        'Matanya tidak bisa berputar di dalam rongganya, tetapi leher burung hantu sangat lentur.',
        'Mereka bisa memutar kepalanya hingga 270 derajat ke belakang tanpa menggerakkan badannya!',
      ],
      [
        'Kehebatan lain burung hantu ada pada bulu sayapnya.',
        'Ujung bulu sayapnya sangat halus sehingga saat terbang, burung hantu meluncur tanpa mengeluarkan suara sedikit pun.',
        'Tikus di tanah tidak akan mendengar kedatangan burung hantu sampai cakar tajamnya menyergap.',
      ],
    ],
    vocab: [
      ['nokturnal', 'hewan yang tidur pada siang hari dan aktif berburu pada malam hari', '🌙'],
      ['lentur', 'mudah ditekuk atau diputar tanpa patah atau sakit', '➰'],
      ['senyap', 'keadaan sunyi tanpa mengeluarkan bunyi berisik sedikit pun', '🤫'],
      ['menyergap', 'menyerang mangsa dengan tiba-tiba dan cepat', '🦅'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Pendengaran burung hantu sangat tajam. Mereka bisa mendengar langkah kaki tikus di bawah tumpukan daun kering dari kejauhan.',
        examples: ['Burung hantu tyto alba sering dipelihara petani untuk membasmi hama tikus di sawah.'],
      },
    ],
    quiz: [
      ['Hewan yang aktif di malam hari disebut hewan …', ['Diurnal', 'Nokturnal', 'Amfibi'], 1, 'Hewan malam disebut nokturnal.'],
      ['Berapa jauh burung hantu dapat memutar kepalanya?', ['Hanya sedikit ke kiri', 'Hingga 270 derajat', 'Satu putaran penuh tanpa henti'], 1, 'Leher lenturnya bisa memutar kepala sampai 270 derajat.'],
      ['Mengapa burung hantu bisa terbang tanpa suara di udara?', ['Karena memiliki sayap plastik', 'Karena ujung bulunya sangat lembut dan meredam udara', 'Karena tidak mengepakkan sayap'], 1, 'Struktur bulu sayap yang lembut membuat terbangnya sangat senyap.'],
    ],
  },
  {
    slug: 'ensiklopedia-bunglon',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🦎',
    title: 'Bunglon, Sang Ahli Menyamar',
    minutes: 3,
    paragraphs: [
      [
        'Bunglon adalah jenis kadal pohon yang terkenal dengan kemampuannya mengubah warna kulit.',
        'Perubahan warna kulit ini membantu bunglon berkamuflase, yaitu menyamar sesuai dengan warna lingkungan sekitar.',
        'Namun tahukah kamu, bunglon juga berganti warna untuk menunjukkan suasana hati dan mengatur suhu tubuhnya?',
      ],
      [
        'Bunglon memiliki mata yang sangat ajaib.',
        'Kedua matanya dapat bergerak secara terpisah ke dua arah yang berbeda.',
        'Satu mata bisa melihat ke depan mencari serangga, sementara mata lainnya melihat ke belakang mengawasi musuh.',
      ],
      [
        'Ketika melihat mangsa seperti jangkrik atau lalat, bunglon tidak perlu mengejar.',
        'Bunglon memiliki lidah yang sangat panjang dan ujungnya lengket.',
        'Dalam hitungan sepersekian detik, lidah itu melesat cepat ke depan menangkap serangga lalu ditarik kembali ke mulut.',
      ],
    ],
    vocab: [
      ['kamuflase', 'penyamaran bentuk atau warna agar menyatu dengan lingkungan sekitar', '🍃'],
      ['terpisah', 'tidak menyatu atau bergerak sendiri-sendiri', '👀'],
      ['melesat', 'terbang atau meluncur maju dengan kecepatan luar biasa', '🏹'],
      ['lengket', 'mudah melekat dan menempel kuat pada benda lain', '🍯'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Panjang lidah bunglon bisa mencapai satu setengah sampai dua kali panjang seluruh tubuhnya sendiri!',
        examples: ['Ekor bunglon yang kuat bisa melingkari dahan seperti tangan tambahan saat memanjat.'],
      },
    ],
    quiz: [
      ['Kemampuan bunglon menyamarkan warna kulit disebut …', ['Metamorfosis', 'Kamuflase', 'Fotosintesis'], 1, 'Menyamarkan diri dengan lingkungan disebut kamuflase.'],
      ['Apa keistimewaan kedua mata bunglon?', ['Hanya bisa melihat warna hitam putih', 'Dapat bergerak ke dua arah berbeda secara terpisah', 'Tidak bisa berkedip sama sekali'], 1, 'Kedua mata bunglon bisa bergerak mandiri mengawasi mangsa dan pemangsa.'],
      ['Bagaimana cara bunglon menangkap serangga makanannya?', ['Mengejar dengan berlari kencang', 'Menembakkan lidah panjang yang lengket', 'Menggali lubang di tanah'], 1, 'Lidahnya yang panjang dan lengket melesat cepat menangkap serangga.'],
    ],
  },
  {
    slug: 'ensiklopedia-komodo',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🦎',
    title: 'Komodo, Kadal Terbesar di Dunia dari Indonesia',
    minutes: 4,
    paragraphs: [
      [
        'Komodo adalah kadal hidup terbesar dan terberat di seluruh dunia.',
        'Hewan menakjubkan ini adalah satwa asli Indonesia yang tidak ditemukan di alam bebas negara mana pun.',
        'Komodo hidup di Kepulauan Nusa Tenggara Timur, khususnya Pulau Komodo, Rinca, dan Flores.',
      ],
      [
        'Panjang tubuh komodo dewasa bisa mencapai 3 meter dengan berat lebih dari 70 kilogram.',
        'Tubuhnya kokoh dengan kulit bersisik tebal dan ekor yang kuat seperti cambuk.',
        'Meskipun bertubuh besar, komodo bisa berlari cepat dalam jarak pendek untuk menyergap mangsanya.',
      ],
      [
        'Komodo memiliki indra penciuman yang sangat luar biasa.',
        'Mereka mencium bau bukan melalui hidung, melainkan dengan menjulurkan lidah bercabangnya yang berwarna kuning.',
        'Lidah itu menangkap partikel bau di udara dan bisa mendeteksi mangsa dari jarak beberapa kilometer jauhnya.',
      ],
      [
        'Karena jumlahnya yang terbatas, komodo dilindungi ketat oleh pemerintah Indonesia dan dunia.',
        'Taman Nasional Komodo didirikan untuk menjaga habitat alami naga purba kebanggaan Nusantara ini.',
      ],
    ],
    vocab: [
      ['habitat', 'tempat alami di mana suatu makhluk hidup tinggal dan berkembang biak', '🏞️'],
      ['bercabang', 'terbelah menjadi dua bagian di ujungnya', '👅'],
      ['satwa', 'sebutan untuk hewan liar di alam bebas', '🐾'],
      ['partikel', 'butiran unsur yang sangat kecil dan halus', '🔬'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Komodo sering dijuluki "naga terakhir di bumi" karena bentuk fisiknya yang menyerupai naga dalam cerita dongeng purba.',
        examples: ['Anak komodo yang baru menetas tinggal di atas pohon untuk menghindari pemangsa.'],
      },
    ],
    quiz: [
      ['Di negara manakah komodo hidup di alam liar?', ['Hanya di Indonesia', 'Di seluruh benua Asia', 'Di Benua Afrika'], 0, 'Komodo adalah satwa endemik asli Indonesia di Nusa Tenggara Timur.'],
      ['Alat tubuh apa yang digunakan komodo untuk mencium bau mangsa?', ['Hidungnya yang panjang', 'Lidah kuningnya yang bercabang', 'Kupingnya yang besar'], 1, 'Komodo menjulurkan lidahnya untuk menangkap partikel aroma di udara.'],
      ['Berapa panjang tubuh komodo dewasa yang bisa dicapai?', ['Sekitar 50 sentimeter', 'Hingga mencapai 3 meter', 'Lebih dari 20 meter'], 1, 'Komodo dewasa bisa tumbuh hingga sepanjang 3 meter.'],
    ],
  },
  {
    slug: 'ensiklopedia-beruang-kutub',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🐻‍❄️',
    title: 'Beruang Kutub di Negeri Es',
    minutes: 3,
    paragraphs: [
      [
        'Beruang kutub tinggal di wilayah Kutub Utara (Arktik) yang tertutup salju dan es abadi.',
        'Suhu di sana bisa mencapai minus puluhan derajat Celsius di bawah nol.',
        'Beruang kutub adalah hewan darat karnivora (pemakan daging) terbesar di dunia.',
      ],
      [
        'Meskipun bulunya tampak putih bersih, sebenarnya rambut beruang kutub itu transparan atau bening!',
        'Rambutnya berongga dan memantulkan cahaya salju sehingga tampak putih bagi mata kita.',
        'Uniknya lagi, kulit di balik bulunya berwarna hitam pekat untuk menyerap kehangatan sinar matahari.',
      ],
      [
        'Beruang kutub juga memiliki lapisan lemak tebal hingga 10 sentimeter di bawah kulitnya.',
        'Lapisan lemak ini berfungsi seperti jaket tebal yang menahan hawa dingin ekstrem.',
        'Mereka juga perenang yang sangat tangguh, mampu berenang berjam-jam di air laut yang membeku untuk mencari makan.',
      ],
    ],
    vocab: [
      ['transparan', 'tembus cahaya sehingga tampak bening tanpa warna', '🪟'],
      ['ekstrem', 'sangat keras atau luar biasa tingginya di luar keadaan normal', '🥶'],
      ['karnivora', 'golongan hewan yang makanan utamanya adalah daging', '🥩'],
      ['berongga', 'memiliki ruang kosong di bagian dalamnya seperti pipa', '🕳️'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Telapak kaki beruang kutub memiliki bulu-bulu kasar di bawahnya agar tidak terpeleset saat berjalan di atas es licin.',
        examples: ['Makanan kesukaan beruang kutub adalah anjing laut yang berlemak.'],
      },
    ],
    quiz: [
      ['Di manakah tempat tinggal alami beruang kutub?', ['Di Kutub Utara (Arktik)', 'Di padang pasir Sahara', 'Di hutan tropis Indonesia'], 0, 'Beruang kutub hidup di wilayah es Kutub Utara.'],
      ['Warna apa sebenarnya kulit beruang kutub di balik bulunya?', ['Warna merah muda', 'Warna hitam pekat untuk menyerap panas', 'Warna putih salju'], 1, 'Kulitnya berwarna hitam untuk menyerap panas sinar matahari.'],
      ['Apa fungsi lapisan lemak tebal pada tubuh beruang kutub?', ['Agar tubuhnya wangi', 'Sebagai penahan dingin ekstrem seperti jaket tebal', 'Supaya bisa melompat tinggi'], 1, 'Lapisan lemak menjaga tubuhnya tetap hangat di suhu dingin ekstrem.'],
    ],
  },
  {
    slug: 'ensiklopedia-penguin',
    theme: 'Ensiklopedia: Hewan',
    emoji: '🐧',
    title: 'Penguin, Burung yang Ahli Berenang',
    minutes: 3,
    paragraphs: [
      [
        'Penguin adalah salah satu jenis burung paling unik di planet kita.',
        'Meskipun memiliki sayap dan berbulu, penguin tidak bisa terbang di udara.',
        'Sebagai gantinya, sayap penguin berevolusi menjadi seperti sirip dayung yang membuat mereka perenang ulung di laut.',
      ],
      [
        'Hampir semua penguin hidup di belahan bumi selatan, terutama di benua es Antarktika.',
        'Mereka memiliki tubuh berbentuk torpedo yang licin sehingga meluncur lincah mengejar ikan di air dingin.',
        'Di daratan, cara berjalan mereka bergoyang-goyang lucu, atau meluncur di atas perutnya di atas salju seperti bermain seluncuran.',
      ],
      [
        'Untuk bertahan melawan badai salju yang sangat membeku, ribuan penguin berkumpul dan berpelukan rapat.',
        'Penguin di bagian luar akan bergantian masuk ke bagian tengah agar semua anggota kawanan mendapatkan kehangatan.',
        'Kerja sama ini membuktikan betapa kompaknya penguin menjaga sesamanya.',
      ],
    ],
    vocab: [
      ['evolusi', 'perubahan bentuk atau sifat makhluk hidup dari generasi ke generasi', '🧬'],
      ['torpedo', 'bentuk lonjong ramping memanjang yang membelah air dengan cepat', '🚀'],
      ['sirip', 'alat gerak pipih pada hewan air untuk mendayung dan mengemudi', '🏊'],
      ['kawanan', 'sekelompok hewan sejenis yang berkumpul bersama', '🐧'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Penguin Kaisar jantan mengerami satu butir telur di atas kakinya selama dua bulan di tengah badai es tanpa makan apa pun sampai anaknya menetas!',
        examples: ['Warna hitam dan putih bulu penguin berfungsi sebagai kamuflase saat berenang di samudra.'],
      },
    ],
    quiz: [
      ['Apakah penguin bisa terbang di angkasa?', ['Bisa terbang tinggi sekali', 'Tidak bisa terbang di udara, tetapi jago berenang di air', 'Hanya bisa terbang saat malam hari'], 1, 'Sayap penguin berfungsi sebagai dayung untuk berenang di air.'],
      ['Di belahan bumi mana sebagian besar penguin hidup?', ['Belahan bumi selatan (Antarktika)', 'Kutub Utara saja', 'Hutan hujan Asia'], 0, 'Penguin hidup di belahan bumi selatan.'],
      ['Bagaimana cara kawanan penguin bertahan di tengah badai salju Antarktika?', ['Masuk ke dalam gua api', 'Berkumpul dan berpelukan rapat secara bergantian', 'Berenang ke luar angkasa'], 1, 'Mereka berpelukan rapat membentuk lingkaran besar untuk saling menghangatkan.'],
    ],
  },
  {
    slug: 'ensiklopedia-hutan-hujan',
    theme: 'Ensiklopedia: Alam',
    emoji: '🌳',
    title: 'Hutan Hujan Tropis, Paru-Paru Dunia',
    minutes: 4,
    paragraphs: [
      [
        'Hutan hujan tropis adalah kawasan hutan lebat yang mendapat curah hujan tinggi sepanjang tahun.',
        'Hutan ini tumbuh di daerah sekitar garis khatulistiwa yang hangat dan lembap, termasuk di Indonesia.',
        'Indonesia memiliki salah satu hutan hujan tropis terluas di dunia, terutama di Sumatra, Kalimantan, dan Papua.',
      ],
      [
        'Hutan hujan dijuluki sebagai "paru-paru dunia" dan "apotek raksasa".',
        'Miliaran pohon hijau di dalamnya menyerap gas karbon dioksida dan melepaskan gas oksigen segar yang kita hirup setiap detik.',
        'Selain itu, banyak tanaman obat-obatan penting yang berasal dari hutan hujan.',
      ],
      [
        'Hutan hujan adalah rumah bagi lebih dari separuh spesies tumbuhan dan hewan di seluruh planet Bumi.',
        'Di hutan Indonesia, ada orangutan, harimau, burung cenderawasih, serta bunga bangkai raksasa Rafflesia arnoldii.',
      ],
      [
        'Sayangnya, hutan hujan terancam oleh penebangan liar dan kebakaran hutan.',
        'Kita harus ikut menjaga kelestarian hutan agar rumah para satwa tidak punah dan bumi tidak bertambah panas.',
      ],
    ],
    vocab: [
      ['khatulistiwa', 'garis khayal yang membagi bumi menjadi belahan utara dan selatan', '🌐'],
      ['oksigen', 'gas murni di udara yang sangat diperlukan makhluk hidup untuk bernapas', '🌬️'],
      ['spesies', 'golongan atau jenis makhluk hidup yang memiliki ciri-ciri serupa', '🐒'],
      ['penebangan liar', 'kegiatan memotong pohon di hutan tanpa izin resmi hukum', '🪓'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Kanopi atau atap dedaunan hutan hujan sangat lebat sehingga tetesan air hujan membutuhkan waktu sekitar 10 menit untuk sampai ke tanah dari pucuk pohon!',
        examples: ['Menanam pohon di pekarangan rumah membantu menjaga udara tetap sejuk.'],
      },
    ],
    quiz: [
      ['Mengapa hutan hujan tropis dijuluki sebagai paru-paru dunia?', ['Karena bentuk hutannya seperti paru-paru', 'Karena menyerap karbon dioksida dan menghasilkan oksigen segar', 'Karena tidak pernah turun hujan'], 1, 'Pohon-pohon hutan hujan menghasilkan oksigen yang dihirup makhluk hidup.'],
      ['Di pulau mana saja terdapat hutan hujan tropis yang luas di Indonesia?', ['Sumatra, Kalimantan, dan Papua', 'Hanya di pulau kecil tak berpenghuni', 'Di tengah laut Jawa'], 0, 'Hutan hujan tropis terbesar Indonesia ada di Sumatra, Kalimantan, dan Papua.'],
      ['Apa yang mengancam kelestarian hutan hujan saat ini?', ['Tumbuhan yang tumbuh terlalu subur', 'Penebangan liar dan perusakan hutan', 'Terlalu banyak hujan'], 1, 'Penebangan pohon ilegal merusak rumah satwa dan iklim bumi.'],
    ],
  },
  {
    slug: 'ensiklopedia-fotosintesis',
    theme: 'Ensiklopedia: Alam',
    emoji: '🌱',
    title: 'Fotosintesis: Dapur Hijau Tumbuhan',
    minutes: 4,
    paragraphs: [
      [
        'Hewan dan manusia harus mencari makan saat lapar, tetapi tumbuhan tidak bisa berjalan.',
        'Lalu, bagaimana cara tumbuhan makan?',
        'Tumbuhan membuat makanannya sendiri melalui sebuah proses kimia alami yang menakjubkan bernama fotosintesis.',
      ],
      [
        'Daun tumbuhan berwarna hijau karena memiliki zat warna hijau bernama klorofil.',
        'Klorofil bertindak seperti koki di dapur daun.',
        'Klorofil menangkap energi dari cahaya Matahari untuk mengolah bahan-bahan makanan.',
      ],
      [
        'Tumbuhan menyerap air dan mineral dari tanah menggunakan akarnya.',
        'Lalu, daun menyerap gas karbon dioksida dari udara melalui pori-pori kecil bernama stomata.',
        'Dengan bantuan sinar Matahari, air dan karbon dioksida diubah menjadi gula sebagai makanan tumbuhan.',
      ],
      [
        'Hal paling ajaib dari fotosintesis adalah hasil sampingannya.',
        'Saat membuat makanan, tumbuhan melepaskan gas oksigen ke udara bebas.',
        'Oksigen inilah yang dihirup oleh semua manusia dan hewan untuk bernapas setiap hari.',
      ],
    ],
    vocab: [
      ['fotosintesis', 'proses pembentukan makanan pada tumbuhan hijau dengan bantuan cahaya matahari', '☀️'],
      ['klorofil', 'zat pigmen warna hijau pada daun yang menyerap energi cahaya', '🍃'],
      ['stomata', 'mulut daun berupa lubang pori sangat kecil untuk keluar-masuk gas', '🔬'],
      ['karbon dioksida', 'gas di udara yang dikeluarkan saat mengembuskan napas dan digunakan tumbuhan', '💨'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Kata "fotosintesis" berasal dari bahasa Yunani: "foto" berarti cahaya, dan "sintesis" berarti menyusun atau membuat.',
        examples: ['Tumbuhan yang diletakkan di tempat gelap tidak bisa berfotosintesis dan daunnya akan menguning.'],
      },
    ],
    quiz: [
      ['Apa nama zat hijau daun yang membantu menangkap cahaya matahari?', ['Klorofil', 'Oksigen', 'Kalsium'], 0, 'Klorofil adalah zat hijau daun yang menyerap energi cahaya.'],
      ['Apa bahan yang dibutuhkan tumbuhan untuk fotosintesis?', ['Susu dan roti', 'Air, karbon dioksida, dan cahaya Matahari', 'Minyak goreng dan garam'], 1, 'Air dari tanah, karbon dioksida dari udara, dan sinar matahari.'],
      ['Gas apa yang dilepaskan tumbuhan saat fotosintesis untuk kita bernapas?', ['Gas asap', 'Gas oksigen', 'Gas karbon monoksida'], 1, 'Tumbuhan menghasilkan gas oksigen yang sangat penting bagi kehidupan.'],
    ],
  },
  {
    slug: 'ensiklopedia-mengapa-laut-asin',
    theme: 'Ensiklopedia: Alam',
    emoji: '🌊',
    title: 'Mengapa Air Laut Terasa Asin?',
    minutes: 3,
    paragraphs: [
      [
        'Jika kamu pernah berenang di pantai dan tidak sengaja menelan air laut, rasanya pasti sangat asin.',
        'Pernahkah kamu bertanya-tanya, dari mana asal garam di lautan yang sangat luas itu?',
      ],
      [
        'Anehnya, sebagian besar garam di laut berasal dari daratan!',
        'Saat hujan turun ke bumi, air hujan yang sedikit asam mengikis batuan dan tanah di darat.',
        'Mineral dan garam di dalam batuan larut terbawa aliran sungai menuju ke samudra.',
      ],
      [
        'Sungai-sungai di seluruh dunia terus membawa sedikit demi sedikit garam ke laut selama miliaran tahun.',
        'Ketika matahari memanaskan laut, hanya air murninya yang menguap menjadi awan hujan.',
        'Garam dan mineral tidak bisa menguap, sehingga tertinggal dan menumpuk di laut.',
      ],
      [
        'Itulah sebabnya mengapa air sungai rasanya tawar, sedangkan air laut menjadi asin dan kaya mineral.',
      ],
    ],
    vocab: [
      ['mengikis', 'menghabiskan atau merusak sedikit demi sedikit karena gesekan air atau angin', '🪨'],
      ['mineral', 'zat alami padat yang terbentuk di dalam bumi dan batuan', '🧂'],
      ['menguap', 'berubah menjadi uap gas karena pengaruh suhu panas', '♨️'],
      ['tawar', 'tidak ada rasa asin atau manis pada air minuman biasa', '💧'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Laut Mati di Timur Tengah memiliki kadar garam hampir 10 kali lebih tinggi daripada laut biasa. Karena sangat asin, orang bisa mengapung di atasnya tanpa perlu berenang!',
        examples: ['Garam dapur yang kita pakai memasak berasal dari penguapan air laut yang dikeringkan petani garam.'],
      },
    ],
    quiz: [
      ['Dari manakah sebagian besar garam di air laut berasal?', ['Dituangkan dari pabrik garam', 'Dari batuan daratan yang terkikis air hujan dan dibawa sungai', 'Berasal dari ikan yang asin'], 1, 'Air hujan mengikis batuan di daratan dan membawanya ke laut lewat sungai.'],
      ['Mengapa garam tidak ikut naik saat air laut menguap menjadi awan?', ['Karena garam tertinggal saat air menguap menjadi gas', 'Karena garamnya bersembunyi di rumput laut', 'Karena ditarik oleh paus'], 0, 'Hanya air murni yang menguap, garam tetap tertinggal di samudra.'],
      ['Apakah air hujan yang jatuh dari awan terasa asin?', ['Sangat asin seperti garam', 'Tidak asin, melainkan air tawar murni', 'Terasa manis seperti sirup'], 1, 'Air hujan adalah air tawar karena garam laut tertinggal saat proses penguapan.'],
    ],
  },
  {
    slug: 'ensiklopedia-gempa-bumi',
    theme: 'Ensiklopedia: Alam',
    emoji: '🏚️',
    title: 'Gempa Bumi, Getaran dari Dalam Tanah',
    minutes: 4,
    paragraphs: [
      [
        'Gempa bumi adalah peristiwa bergetarnya permukaan tanah yang kita pijak.',
        'Getaran ini terjadi secara tiba-tiba dan bisa berlangsung dari beberapa detik hingga satu menit.',
      ],
      [
        'Permukaan Bumi kita tidak terdiri dari satu lempeng padu, melainkan potongan-potongan raksasa seperti teka-teki pecahan puzzle.',
        'Potongan-potongan batu raksasa ini disebut lempeng tektonik.',
        'Lempeng tektonik terus bergerak sangat lambat di atas batuan cair bumi.',
      ],
      [
        'Ketika dua lempeng bergesekan dan saling terkunci, energi tekanan terus menumpuk.',
        'Saat batuannya patah karena tidak kuat menahan tekanan, energi besar dilepaskan secara mendadak.',
        'Gelombang energi inilah yang merambat ke permukaan sebagai getaran gempa bumi.',
      ],
      [
        'Jika terjadi gempa saat kamu berada di dalam ruangan, jangan panik.',
        'Ingat rumus keselamatan 3B: Berlutut, Berlindung di bawah meja yang kokoh, dan Berpegangan erat sampai getaran berhenti.',
      ],
    ],
    vocab: [
      ['lempeng tektonik', 'potongan lapisan batuan terluar bumi yang terus bergerak lambat', '🧩'],
      ['gelombang', 'getaran energi yang merambat melalui zat padat, cair, atau gas', '〰️'],
      ['merambat', 'menjalar dan menyebar ke segala arah', '📡'],
      ['mitigasi', 'upaya mengurangi risiko bencana agar korban dan kerusakan bisa diminimalisasi', '🛡️'],
    ],
    notes: [
      {
        title: 'Tips Keselamatan Gempa',
        explanation: 'Jauhi jendela kaca, lemari kaca, dan lampu gantung yang bisa jatuh saat gempa mengguncang.',
        examples: ['Gunakan tangga darurat, jangan pernah menggunakan lift saat evakuasi gempa bumi.'],
      },
    ],
    quiz: [
      ['Apa penyebab utama terjadinya gempa bumi secara alami?', ['Angin puting beliung', 'Pergeseran dan tumbukan lempeng tektonik di kerak bumi', 'Hujan badai semalam suntuk'], 1, 'Pelepasan energi dari tumbukan lempeng tektonik menyebabkan gempa.'],
      ['Apa yang harus dilakukan jika gempa terjadi saat kita di dalam kelas?', ['Berlari ke dekat jendela kaca', 'Berlindung di bawah meja kokoh dan melindungi kepala', 'Menaiki lemari buku'], 1, 'Berlutut dan berlindung di bawah meja kokoh untuk melindungi kepala.'],
      ['Alat yang digunakan ilmuwan untuk mencatat getaran gempa adalah …', ['Termometer', 'Seismograf', 'Mikroskop'], 1, 'Seismograf digunakan untuk mendeteksi dan mengukur getaran gempa bumi.'],
    ],
  },
  {
    slug: 'ensiklopedia-terumbu-karang',
    theme: 'Ensiklopedia: Alam',
    emoji: '🪸',
    title: 'Terumbu Karang, Istana Bawah Laut',
    minutes: 3,
    paragraphs: [
      [
        'Saat melihat terumbu karang di dasar laut dangkal, banyak orang mengira itu adalah batuan mati atau tumbuhan.',
        'Sebenarnya, karang adalah hewan kecil yang hidup berkelompok!',
        'Hewan mungil pembentuk karang disebut polip karang.',
      ],
      [
        'Polip karang mengeluarkan zat kapur keras untuk melindungi tubuhnya yang lunak.',
        'Selama ratusan hingga ribuan tahun, jutaan cangkang kapur ini menumpuk membentuk bangunan megah di bawah laut yang disebut terumbu karang.',
      ],
      [
        'Terumbu karang adalah rumah bagi seperempat dari seluruh jenis ikan laut.',
        'Ikan badut, penyu laut, kuda laut, dan bintang laut mencari makan dan bertelur di antara celah-celah karang.',
      ],
      [
        'Indonesia adalah bagian dari Segitiga Terumbu Karang Dunia (Coral Triangle) dengan keanekaragaman karang terkaya di bumi.',
        'Kita harus menjaga kebersihan laut dengan tidak membuang sampah plastik dan tidak menginjak karang saat berenang.',
      ],
    ],
    vocab: [
      ['polip', 'hewan laut bertubuh lunak mirip tabung kecil dengan tentakel', '🪸'],
      ['zat kapur', 'senyawa kalsium karbonat keras yang membentuk cangkang karang', '🧱'],
      ['keanekaragaman', 'keberagaman berbagai macam jenis makhluk hidup di satu habitat', '🐠'],
      ['ekosistem', 'hubungan timbal balik antara makhluk hidup dengan lingkungan sekitarnya', '🌊'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Terumbu Karang Raja Ampat di Papua Barat memiliki lebih dari 500 jenis karang keras, menjadikannya salah satu tempat terindah di dunia.',
        examples: ['Terumbu karang juga melindungi pantai dari hantaman ombak badai yang besar.'],
      },
    ],
    quiz: [
      ['Apakah karang laut itu sebenarnya?', ['Batuan mati biasa', 'Koloni hewan kecil bernama polip karang', 'Tumbuhan berbunga darat'], 1, 'Karang adalah koloni hewan laut kecil bernama polip.'],
      ['Mengapa terumbu karang sangat penting bagi kehidupan laut?', ['Sebagai istana dan tempat tinggal ribuan jenis ikan dan satwa laut', 'Untuk membuat air laut menjadi manis', 'Supaya perahu tidak bisa lewat'], 0, 'Karang menjadi tempat bertelur dan mencari makan bagi seperempat satwa laut.'],
      ['Bagaimana cara kita melindungi terumbu karang?', ['Membuang sampah ke laut', 'Tidak menginjak karang dan menjaga laut bebas plastik', 'Mengambil karang untuk hiasan'], 1, 'Jaga kebersihan laut dan hindari merusak karang saat berenang.'],
    ],
  },
  {
    slug: 'ensiklopedia-otak-manusia',
    theme: 'Ensiklopedia: Tubuh Manusia',
    emoji: '🧠',
    title: 'Otak, Pusat Komando Tubuh Kita',
    minutes: 4,
    paragraphs: [
      [
        'Di dalam kepala kita, terlindung aman oleh tulang tengkorak yang kokoh, terdapat organ paling luar biasa di tubuh kita: Otak.',
        'Otak adalah pusat kendali dan komando utama bagi seluruh aktivitas tubuh manusia.',
      ],
      [
        'Semua yang kamu lakukan dikendalikan oleh otak.',
        'Saat kamu berpikir memecahkan soal matematika, mengingat lirik lagu, merasakan gembira, atau berjalan kaki, otaklah yang bekerja.',
        'Bahkan hal-hal yang terjadi tanpa kamu sadari, seperti bernapas, berkedip, dan mencerna makanan, semuanya diatur oleh otak!',
      ],
      [
        'Otak terdiri dari sekitar 86 miliar sel saraf khusus bernama neuron.',
        'Neuron-neuron ini saling mengirim pesan listrik secepat kilat ke seluruh penjuru tubuh melalui saraf tulang belakang.',
      ],
      [
        'Agar otak tetap cerdas dan sehat, kita butuh tidur malam yang cukup, minum air putih, serta rajin membaca buku.',
        'Saat kita tidur malam, otak merapikan ingatan pelajaran hari itu dan membersihkan racun tubuh.',
      ],
    ],
    vocab: [
      ['komando', 'perintah atau kepemimpinan yang mengatur segala tindakan', '🎖️'],
      ['tengkorak', 'tulang keras pembentuk kepala yang melindungi otak', '💀'],
      ['neuron', 'sel saraf khusus yang menghantarkan sinyal pesan di dalam tubuh', '⚡'],
      ['organ', 'bagian tubuh yang memiliki fungsi khusus tertentu untuk kelangsungan hidup', '🫀'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Meskipun berat otak hanya sekitar 2 persen dari total berat tubuh, otak mengonsumsi sekitar 20 persen energi dan oksigen yang kita gunakan!',
        examples: ['Belajar hal baru seperti bahasa asing atau alat musik membuat sambungan neuron di otak bertambah banyak.'],
      },
    ],
    quiz: [
      ['Apa fungsi utama otak di dalam tubuh kita?', ['Hanya untuk memompa darah', 'Pusat komando dan kendali seluruh pikiran, gerak, dan tubuh', 'Untuk menyimpan makanan'], 1, 'Otak mengendalikan seluruh kerja tubuh manusia.'],
      ['Apa nama sel saraf yang menyusun otak kita?', ['Neuron', 'Bakteri', 'Eritrosit'], 0, 'Neuron adalah sel saraf yang mengirimkan pesan listrik di otak.'],
      ['Apa yang dilakukan otak saat kita tidur malam yang cukup?', ['Berhenti bekerja total', 'Merapikan ingatan pelajaran dan memulihkan energi tubuh', 'Bermain telepon pintar'], 1, 'Saat tidur, otak memperkuat memori ingatan dan menyegarkan tubuh.'],
    ],
  },
  {
    slug: 'ensiklopedia-paru-paru',
    theme: 'Ensiklopedia: Tubuh Manusia',
    emoji: '🫁',
    title: 'Paru-Paru dan Udara Bersih',
    minutes: 3,
    paragraphs: [
      [
        'Tarik napas dalam-dalam... hembuskan perlahan.',
        'Saat kamu melakukan itu, organ yang sedang bekerja keras di dalam dadamu adalah paru-paru.',
        'Kita memiliki sepasang paru-paru, satu di sebelah kanan dan satu di sebelah kiri rongga dada.',
      ],
      [
        'Paru-paru dilindungi oleh susunan tulang rusuk yang kuat.',
        'Tugas utama paru-paru adalah mengambil gas oksigen dari udara segar dan memasukkannya ke dalam aliran darah.',
        'Pada saat bersamaan, paru-paru mengeluarkan gas sisa pembakaran tubuh yaitu karbon dioksida saat kita mengembuskan napas.',
      ],
      [
        'Di dalam paru-paru ada jutaan kantung udara sangat kecil bernama alveolus.',
        'Jika semua alveolus di paru-paru dibentangkan rata, luasnya bisa menutupi sebuah lapangan tenis!',
      ],
      [
        'Paru-paru sangat menyukai udara segar dan bersih.',
        'Karena itu, hindarilah asap rokok dan polusi kendaraan, serta rajinlah berolahraga agar kapasitas napas kita kuat.',
      ],
    ],
    vocab: [
      ['rongga dada', 'ruang di dalam dada yang menampung paru-paru dan jantung', '🫁'],
      ['tulang rusuk', 'susunan tulang melengkung yang melindungi organ dada', '🦴'],
      ['alveolus', 'kantung udara mikroskopis di paru-paru tempat pertukaran oksigen dan karbon dioksida', '🔬'],
      ['kapasitas', 'daya tampung volume udara maksimal yang bisa dihirup paru-paru', '🎈'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Paru-paru kanan sedikit lebih besar daripada paru-paru kiri, karena ruang di sebelah kiri berbagi tempat dengan jantung kita.',
        examples: ['Menanam pohon di sekitar sekolah membantu menghasilkan udara kaya oksigen untuk paru-paru kita.'],
      },
    ],
    quiz: [
      ['Berapa jumlah paru-paru yang dimiliki tubuh manusia?', ['Satu buah', 'Sepasang (dua buah, kanan dan kiri)', 'Empat buah'], 1, 'Manusia memiliki sepasang paru-paru di rongga dada.'],
      ['Apa nama kantung udara kecil di dalam paru-paru tempat pertukaran oksigen?', ['Alveolus', 'Ventrikel', 'Trakea'], 0, 'Alveolus adalah kantung udara mikroskopis pertukaran gas.'],
      ['Hal apa yang berbahaya dan harus dihindari agar paru-paru tetap sehat?', ['Menghirup udara pegunungan segar', 'Asap rokok dan asap polusi pembakaran sampah', 'Meminum air putih bersih'], 1, 'Asap rokok dan polusi udara merusak saluran pernapasan paru-paru.'],
    ],
  },
  {
    slug: 'ensiklopedia-rangka-dan-tulang',
    theme: 'Ensiklopedia: Tubuh Manusia',
    emoji: '🦴',
    title: 'Rangka dan Tulang, Penegak Tubuh Manusia',
    minutes: 3,
    paragraphs: [
      [
        'Coba tekan lengan atau kakimu. Di bawah kulit dan daging yang empuk, kamu akan merasakan sesuatu yang keras dan kokoh.',
        'Itulah tulang-tulang yang menyusun rangka tubuh kita.',
      ],
      [
        'Tanpa rangka tulang, tubuh kita tidak akan bisa berdiri, duduk, atau berjalan.',
        'Kita akan terkulai lemas di lantai seperti ubur-ubur atau agar-agar!',
        'Rangka memberi bentuk pada tubuh dan bekerja sama dengan otot untuk membuat kita bisa berlari, melompat, dan menari.',
      ],
      [
        'Tubuh manusia dewasa memiliki 206 tulang yang saling tersambung oleh sendi.',
        'Selain menopang tubuh, tulang juga memiliki tugas mulia melindungi organ-organ lunak di dalamnya.',
        'Tulang tengkorak melindungi otak, dan tulang rusuk melindungi jantung serta paru-paru.',
      ],
      [
        'Agar tulang tumbuh kuat dan padat, kita memerlukan kalsium dan vitamin D.',
        'Minumlah susu, makan sayuran hijau, dan berjemurlah di bawah sinar matahari pagi.',
      ],
    ],
    vocab: [
      ['rangka', 'susunan tulang-tulang yang terhubung dan menopang tubuh', '🩻'],
      ['sendi', 'tempat pertemuan antara dua tulang yang memungkinkan gerakan', '🤸'],
      ['kalsium', 'mineral penting yang dibutuhkan untuk membangun tulang dan gigi yang kuat', '🥛'],
      ['menopang', 'menahan beban dari bawah agar sesuatu berdiri tegak', '🏛️'],
    ],
    notes: [
      {
        title: 'Tahukah Kamu?',
        explanation: 'Bayi yang baru lahir memiliki sekitar 300 tulang lembut! Seiring bertambahnya usia, beberapa tulang menyatu sehingga orang dewasa memiliki 206 tulang.',
        examples: ['Tulang terpanjang dan terkuat di tubuh manusia adalah tulang paha (femur).'],
      },
    ],
    quiz: [
      ['Apa yang akan terjadi pada tubuh jika kita tidak memiliki tulang rangka?', ['Tubuh melayang di udara', 'Tubuh terkulai lemas seperti agar-agar dan tak bisa berdiri', 'Tubuh menjadi sekeras batu'], 1, 'Tanpa rangka, tubuh tidak punya penopang dan tidak bisa berdiri.'],
      ['Berapa jumlah tulang pada tubuh manusia dewasa?', ['50 tulang', '206 tulang', '1.000 tulang'], 1, 'Tubuh manusia dewasa tersusun atas 206 tulang.'],
      ['Makanan dan minuman apa yang kaya kalsium untuk menguatkan tulang?', ['Permen manis dan keripik asin', 'Susu dan sayuran hijau', 'Minuman bersoda'], 1, 'Susu dan sayuran kaya kalsium yang dibutuhkan pertumbuhan tulang.'],
    ],
  },
  {
    slug: 'ensiklopedia-gigi-dan-mulut',
    theme: 'Ensiklopedia: Tubuh Manusia',
    emoji: '🦷',
    title: 'Gigi Kita dan Cara Merawatnya',
    minutes: 3,
    paragraphs: [
      [
        'Setiap kali kita tersenyum lebar di depan cermin, kita melihat deretan gigi putih yang rapi.',
        'Gigi adalah bagian tubuh yang sangat keras, bahkan lebih keras daripada tulang kita!',
        'Gigi dilapisi oleh lapisan pelindung bernama email gigi.',
      ],
      [
        'Di dalam mulut kita, gigi memiliki bentuk dan tugas yang berbeda-beda.',
        'Gigi seri di bagian depan bertugas memotong makanan seperti gunting.',
        'Gigi taring yang runcing bertugas merobek makanan.',
        'Sedangkan gigi geraham di bagian belakang yang permukaannya lebar bertugas menggiling dan mengunyah makanan hingga lembut.',
      ],
      [
        'Jika kita malas menyikat gigi setelah makan, sisa makanan manis akan diubah oleh kuman bakteri menjadi zat asam.',
        'Zat asam ini perlahan-lahan merusak email gigi dan membuat gigi berlubang.',
        'Gigi berlubang bisa terasa sangat nyeri dan sakit.',
      ],
      [
        'Maka dari itu, sikatlah gigimu minimal dua kali sehari: pagi hari setelah sarapan dan malam hari sebelum tidur.',
      ],
    ],
    vocab: [
      ['email gigi', 'lapisan luar gigi yang sangat keras dan mengilap', '✨'],
      ['gigi seri', 'gigi depan berpahat tajam untuk memotong makanan', '🦷'],
      ['gigi geraham', 'gigi belakang berpermukaan lebar bergelombang untuk menghaluskan makanan', '⚙️'],
      ['bakteri', 'makhluk hidup mikroskopis bersel satu yang tidak terlihat mata', '🦠'],
    ],
    notes: [
      {
        title: 'Tips Merawat Gigi',
        explanation: 'Gunakan pasta gigi berfluoride dan sikat gigi secara memutar lembut dari gusi ke arah gigi selama dua menit.',
        examples: ['Periksakan gigi ke dokter gigi setiap 6 bulan sekali untuk memastikan gigi tetap sehat.'],
      },
    ],
    quiz: [
      ['Apa nama lapisan terluar gigi yang sangat keras?', ['Email gigi', 'Kalsium gusi', 'Semen gigi'], 0, 'Email gigi adalah lapisan pelindung terluar yang paling keras.'],
      ['Gigi apa yang bertugas mengunyah dan menghaluskan makanan di bagian belakang?', ['Gigi taring', 'Gigi geraham', 'Gigi seri'], 1, 'Gigi geraham bertugas menggiling makanan hingga lembut.'],
      ['Kapan waktu wajib menyikat gigi setiap hari?', ['Cukup setahun sekali', 'Minimal dua kali sehari: pagi setelah sarapan dan malam sebelum tidur', 'Hanya saat hari libur'], 1, 'Menyikat gigi teratur pagi dan malam mencegah gigi berlubang.'],
    ],
  },
  {
    slug: 'ensiklopedia-pesawat-terbang',
    theme: 'Ensiklopedia: Teknologi',
    emoji: '✈️',
    title: 'Bagaimana Pesawat Terbang Bisa Melayang di Udara?',
    minutes: 4,
    paragraphs: [
      [
        'Sebuah pesawat penumpang raksasa terbuat dari logam baja dan aluminium seberat ratusan ton.',
        'Namun saat melaju kencang di landasan pacu, pesawat raksasa itu bisa lepas landas dan melayang anggun di udara tinggi.',
        'Bagaimana mungkin benda seberat itu bisa terbang melawan gravitasi bumi?',
      ],
      [
        'Rahasia utama kemampuan terbang pesawat terletak pada bentuk penampang sayapnya.',
        'Bentuk sayap pesawat dibuat melengkung di bagian atas dan rata di bagian bawah, yang disebut aerofoil.',
        'Saat mesin pesawat mendorong badan pesawat maju dengan cepat, udara di atas sayap mengalir lebih cepat daripada udara di bawah sayap.',
      ],
      [
        'Perbedaan kecepatan aliran udara ini menciptakan tekanan udara di bawah sayap yang lebih besar.',
        'Tekanan besar dari bawah inilah yang menghasilkan gaya angkat ke atas, mengangkat pesawat yang berat ke angkasa.',
      ],
      [
        'Pesawat bermotor pertama kali berhasil diterbangkan oleh Wright bersaudara (Orville dan Wilbur Wright) pada tahun 1903.',
        'Di Indonesia, kita memiliki tokoh dirgantara dunia yang sangat membanggakan, yaitu B.J. Habibie, yang merancang pesawat terbang buatan bangsa sendiri.',
      ],
    ],
    vocab: [
      ['landasan pacu', 'jalur aspal lurus dan panjang di bandara untuk pesawat lepas landas dan mendarat', '🛫'],
      ['aerofoil', 'bentuk penampang melengkung sayap yang dirancang menghasilkan gaya angkat', '📐'],
      ['gaya angkat', 'kekuatan dorong ke atas yang melawan gaya gravitasi bumi', '⬆️'],
      ['dirgantara', 'segala sesuatu yang berkaitan dengan penerbangan dan ruang angkasa', '✈️'],
    ],
    notes: [
      {
        title: 'Fakta Seru',
        explanation: 'Pesawat komersial modern biasanya terbang di ketinggian sekitar 10.000 meter di atas permukaan laut untuk menghemat bahan bakar karena udara di sana lebih tipis.',
        examples: ['Pesawat N250 Gatotkaca adalah mahakarya pesawat terbang karya putra-putri Indonesia rancangan B.J. Habibie.'],
      },
    ],
    quiz: [
      ['Bagian pesawat mana yang memegang peran utama menciptakan gaya angkat ke atas?', ['Roda pendarat', 'Bentuk khusus sayap pesawat (aerofoil)', 'Kaca jendela kabin'], 1, 'Bentuk sayap aerofoil menciptakan gaya angkat saat pesawat melaju kencang.'],
      ['Siapa tokoh penemu pesawat terbang bermotor pertama di dunia?', ['Wright bersaudara', 'Thomas Edison', 'Alexander Graham Bell'], 0, 'Orville dan Wilbur Wright menerbangkan pesawat bermotor pertama tahun 1903.'],
      ['Siapa tokoh kebanggaan Indonesia yang dikenal sebagai perancang pesawat terbang terkemuka?', ['B.J. Habibie', 'Pangeran Diponegoro', 'Ki Hajar Dewantara'], 0, 'Prof. Dr. Ing. B.J. Habibie adalah tokoh dirgantara Indonesia.'],
    ],
  },
];
