// Cerita Pendek — Fase A–B (SD Kelas 1–4), Bahasa Indonesia.
// Fabel Aesop (domain publik) yang diceritakan ulang & cerita orisinal, masing-masing dengan pesan moral.

import type { SeedArticle } from './types';

export const ceritaPendek: SeedArticle[] = [
  {
    slug: 'cerita-semut-dan-belalang',
    theme: 'Cerita Pendek',
    emoji: '🐜',
    title: 'Semut dan Belalang',
    minutes: 4,
    paragraphs: [
      [
        'Musim kemarau tiba.',
        'Setiap hari, Semut bekerja keras mengumpulkan biji-bijian.',
        'Ia membawanya satu per satu ke dalam sarang.',
      ],
      [
        'Belalang melihat Semut dan tertawa.',
        '"Hai Semut, mengapa kamu bekerja terus? Ayo bernyanyi dan bermain bersamaku!"',
        '"Aku sedang menyimpan makanan untuk musim hujan," jawab Semut.',
        'Belalang tidak peduli. Ia terus bernyanyi sepanjang hari.',
      ],
      [
        'Musim hujan pun datang.',
        'Hujan turun setiap hari dan makanan sulit dicari.',
        'Belalang kedinginan dan kelaparan.',
        'Semut tetap hangat di sarangnya dengan makanan yang cukup.',
      ],
      [
        'Belalang mengetuk pintu sarang Semut.',
        'Semut yang baik hati membagi sedikit makanannya.',
        '"Terima kasih, Semut. Mulai sekarang aku akan rajin seperti kamu," kata Belalang.',
      ],
    ],
    vocab: [
      ['kemarau', 'musim panas ketika jarang turun hujan', '☀️'],
      ['biji-bijian', 'butiran kecil seperti padi dan jagung yang bisa dimakan', '🌾'],
      ['sarang', 'rumah tempat tinggal hewan', '🏠'],
      ['kelaparan', 'sangat lapar karena tidak ada makanan', '😣'],
    ],
    notes: [
      {
        title: 'Rajin dan Bersiap',
        explanation:
          'Kita harus rajin dan bersiap untuk hari esok. Bermain itu boleh, tetapi tugas dan kewajiban harus diselesaikan dulu.',
        examples: ['Mengerjakan PR sebelum bermain.', 'Menabung sebagian uang jajan.'],
      },
    ],
    quiz: [
      ['Apa yang dikumpulkan Semut?', ['Daun kering', 'Biji-bijian', 'Batu kecil'], 1, 'Semut mengumpulkan biji-bijian untuk musim hujan.'],
      ['Apa yang dilakukan Belalang saat musim kemarau?', ['Bekerja keras', 'Bernyanyi dan bermain', 'Membangun rumah'], 1, 'Belalang terus bernyanyi sepanjang hari.'],
      ['Pesan dari cerita ini adalah …', ['Kita harus rajin dan bersiap', 'Kita boleh malas', 'Kita tidak perlu berbagi'], 0, 'Semut yang rajin punya makanan saat musim hujan.'],
    ],
  },
  {
    slug: 'cerita-kelinci-dan-kura-kura',
    theme: 'Cerita Pendek',
    emoji: '🐢',
    title: 'Kelinci dan Kura-Kura',
    minutes: 4,
    paragraphs: [
      [
        'Kelinci sangat bangga karena bisa berlari cepat.',
        'Suatu hari, ia mengejek Kura-Kura.',
        '"Jalanmu lambat sekali, Kura-Kura!"',
      ],
      [
        'Kura-Kura tersenyum. "Bagaimana kalau kita lomba lari?"',
        'Kelinci tertawa, tetapi ia setuju.',
        'Semua hewan hutan datang untuk menonton.',
      ],
      [
        'Lomba dimulai. Kelinci berlari sangat cepat dan jauh meninggalkan Kura-Kura.',
        '"Kura-Kura masih jauh di belakang. Aku tidur sebentar saja," pikir Kelinci.',
        'Ia pun tertidur di bawah pohon yang rindang.',
      ],
      [
        'Kura-Kura terus berjalan pelan-pelan tanpa berhenti.',
        'Ia melewati Kelinci yang sedang tidur.',
        'Ketika Kelinci bangun, Kura-Kura sudah hampir sampai di garis akhir.',
        'Kelinci berlari sekuat tenaga, tetapi terlambat. Kura-Kura menang!',
      ],
    ],
    vocab: [
      ['bangga', 'merasa senang dan hebat karena sesuatu', '😎'],
      ['mengejek', 'mengatakan hal buruk untuk merendahkan orang lain', '😝'],
      ['rindang', 'banyak daunnya sehingga teduh', '🌳'],
      ['garis akhir', 'tempat lomba selesai', '🏁'],
    ],
    notes: [
      {
        title: 'Tekun dan Tidak Sombong',
        explanation:
          'Orang yang tekun dan tidak mudah menyerah bisa mengalahkan orang yang sombong. Jangan meremehkan orang lain.',
        examples: ['Belajar sedikit demi sedikit setiap hari.', 'Tidak mengejek teman yang belum bisa.'],
      },
    ],
    quiz: [
      ['Mengapa Kelinci bangga?', ['Karena bisa berlari cepat', 'Karena pandai bernyanyi', 'Karena rumahnya besar'], 0, 'Kelinci bangga karena bisa berlari cepat.'],
      ['Apa yang dilakukan Kelinci di tengah lomba?', ['Makan wortel', 'Tidur di bawah pohon', 'Membantu Kura-Kura'], 1, 'Kelinci tertidur di bawah pohon yang rindang.'],
      ['Siapa yang memenangkan lomba?', ['Kelinci', 'Kura-Kura', 'Tidak ada'], 1, 'Kura-Kura menang karena terus berjalan tanpa berhenti.'],
    ],
  },
  {
    slug: 'cerita-singa-dan-tikus',
    theme: 'Cerita Pendek',
    emoji: '🦁',
    title: 'Singa dan Tikus',
    minutes: 4,
    paragraphs: [
      [
        'Seekor Singa sedang tidur di hutan.',
        'Tiba-tiba, seekor Tikus kecil berlari di atas tubuhnya.',
        'Singa terbangun dan menangkap Tikus dengan cakarnya.',
      ],
      [
        '"Tolong lepaskan aku, Singa," kata Tikus.',
        '"Suatu hari nanti, aku akan menolongmu."',
        'Singa tertawa. "Kamu kecil sekali. Bagaimana bisa menolongku?"',
        'Tetapi Singa melepaskan Tikus itu.',
      ],
      [
        'Beberapa hari kemudian, Singa terjerat jaring pemburu.',
        'Ia mengaum keras, tetapi tidak bisa lepas.',
        'Tikus mendengar suara Singa dan segera datang.',
        'Dengan gigi yang tajam, Tikus menggigit tali jaring sampai putus.',
      ],
      [
        'Singa pun bebas.',
        '"Terima kasih, Tikus. Ternyata yang kecil juga bisa menolong," kata Singa.',
        'Sejak hari itu, Singa dan Tikus bersahabat.',
      ],
    ],
    vocab: [
      ['cakar', 'kuku tajam pada kaki hewan', '🐾', ['cakarnya']],
      ['terjerat', 'terperangkap dan tidak bisa lepas', '🪤'],
      ['pemburu', 'orang yang menangkap hewan liar', '🎯'],
      ['mengaum', 'suara keras singa atau harimau', '🦁'],
    ],
    notes: [
      {
        title: 'Jangan Meremehkan dan Saling Menolong',
        explanation:
          'Setiap orang, sekecil apa pun, bisa berbuat baik. Kebaikan yang kita lakukan akan dibalas dengan kebaikan.',
        examples: ['Menolong teman yang kesulitan.', 'Menghargai bantuan dari siapa saja.'],
      },
    ],
    quiz: [
      ['Mengapa Singa terbangun?', ['Ada suara petir', 'Tikus berlari di atas tubuhnya', 'Ia lapar'], 1, 'Tikus kecil berlari di atas tubuh Singa.'],
      ['Bagaimana Tikus menolong Singa?', ['Memanggil hewan lain', 'Menggigit tali jaring', 'Mengusir pemburu'], 1, 'Tikus menggigit tali jaring sampai putus.'],
      ['Pesan dari cerita ini adalah …', ['Yang kecil tidak berguna', 'Jangan meremehkan orang lain', 'Singa selalu menang'], 1, 'Yang kecil pun bisa menolong.'],
    ],
  },
  {
    slug: 'cerita-gagak-yang-haus',
    theme: 'Cerita Pendek',
    emoji: '🐦‍⬛',
    title: 'Burung Gagak yang Haus',
    minutes: 3,
    paragraphs: [
      [
        'Hari itu sangat panas.',
        'Seekor burung Gagak terbang ke sana kemari mencari air.',
        'Ia sangat haus.',
      ],
      [
        'Akhirnya, Gagak menemukan sebuah kendi.',
        'Di dalam kendi ada sedikit air, tetapi letaknya di dasar.',
        'Paruh Gagak tidak sampai ke air itu.',
      ],
      [
        'Gagak tidak menyerah. Ia berpikir keras.',
        'Lalu ia melihat batu-batu kecil di tanah.',
        'Gagak memasukkan batu ke dalam kendi, satu per satu.',
        'Sedikit demi sedikit, air di dalam kendi naik ke atas.',
      ],
      ['Akhirnya, Gagak bisa minum sampai puas.', '"Kalau mau berpikir, pasti ada jalan," kata Gagak dengan gembira.'],
    ],
    vocab: [
      ['kendi', 'wadah air dari tanah liat', '🏺'],
      ['dasar', 'bagian paling bawah', '⬇️'],
      ['paruh', 'mulut burung yang keras dan runcing', '🐦'],
      ['menyerah', 'berhenti berusaha', '🏳️'],
    ],
    notes: [
      {
        title: 'Pantang Menyerah dan Berpikir Cerdas',
        explanation:
          'Saat menghadapi masalah, jangan cepat menyerah. Berpikirlah dengan tenang, pasti ada jalan keluarnya.',
        examples: ['Mencoba cara lain saat soal terasa sulit.', 'Meminta bantuan jika sudah berusaha.'],
      },
    ],
    quiz: [
      ['Apa yang dicari burung Gagak?', ['Makanan', 'Air', 'Sarang'], 1, 'Gagak sangat haus dan mencari air.'],
      ['Apa yang dimasukkan Gagak ke dalam kendi?', ['Daun', 'Batu-batu kecil', 'Ranting'], 1, 'Batu-batu kecil membuat air naik.'],
      ['Sifat baik burung Gagak adalah …', ['Pantang menyerah', 'Pemalas', 'Sombong'], 0, 'Gagak tidak menyerah dan berpikir keras.'],
    ],
  },
  {
    slug: 'cerita-ayam-merah-yang-rajin',
    theme: 'Cerita Pendek',
    emoji: '🐔',
    title: 'Ayam Merah yang Rajin',
    minutes: 4,
    paragraphs: [
      [
        'Ayam Merah tinggal bersama Kucing, Anjing, dan Bebek.',
        'Suatu hari, ia menemukan beberapa butir gandum.',
        '"Siapa yang mau membantuku menanam gandum?" tanya Ayam Merah.',
        '"Bukan aku," kata Kucing, Anjing, dan Bebek.',
      ],
      [
        'Ayam Merah menanam gandum itu sendiri.',
        'Ia juga menyiram, memanen, dan menggiling gandum menjadi tepung sendirian.',
        'Teman-temannya selalu berkata, "Bukan aku."',
      ],
      [
        'Lalu Ayam Merah membuat roti yang harum.',
        '"Siapa yang mau makan roti ini?" tanyanya.',
        '"Aku!" teriak Kucing, Anjing, dan Bebek bersamaan.',
      ],
      [
        '"Kalian tidak membantu, jadi aku yang akan memakannya," jawab Ayam Merah.',
        'Teman-temannya menunduk malu.',
        '"Lain kali kami akan membantu," kata mereka.',
        'Ayam Merah tersenyum dan berjanji akan berbagi lain kali.',
      ],
    ],
    vocab: [
      ['gandum', 'tanaman biji-bijian bahan membuat tepung roti', '🌾'],
      ['memanen', 'memetik atau mengambil hasil tanaman', '🧺'],
      ['menggiling', 'menghaluskan biji menjadi tepung', '⚙️'],
      ['menunduk', 'menundukkan kepala karena malu atau sedih', '😔'],
    ],
    notes: [
      {
        title: 'Bekerja Sama dan Bertanggung Jawab',
        explanation:
          'Kalau ingin menikmati hasil, kita juga harus ikut bekerja. Pekerjaan terasa ringan jika dikerjakan bersama-sama.',
        examples: ['Ikut piket kelas.', 'Membantu orang tua di rumah.'],
      },
    ],
    quiz: [
      ['Apa yang ditemukan Ayam Merah?', ['Butir gandum', 'Telur emas', 'Buah apel'], 0, 'Ayam Merah menemukan beberapa butir gandum.'],
      ['Apa jawaban teman-teman Ayam Merah saat dimintai tolong?', ['"Ayo!"', '"Bukan aku."', '"Nanti saja."'], 1, 'Mereka selalu berkata, "Bukan aku."'],
      ['Pesan dari cerita ini adalah …', ['Bekerja sama itu penting', 'Lebih baik tidur', 'Roti tidak enak'], 0, 'Siapa yang ingin menikmati hasil harus ikut bekerja.'],
    ],
  },
  {
    slug: 'cerita-dompet-yang-hilang',
    theme: 'Cerita Pendek',
    emoji: '👛',
    title: 'Dompet yang Hilang',
    minutes: 3,
    paragraphs: [
      [
        'Sepulang sekolah, Raka melihat sebuah dompet di dekat gerbang.',
        'Ia membukanya. Di dalamnya ada uang dan kartu bertuliskan nama Bu Sari.',
        'Bu Sari adalah penjaga kantin sekolah.',
      ],
      [
        'Raka bingung sejenak.',
        '"Uangnya banyak sekali. Aku bisa membeli mainan," pikirnya.',
        'Tetapi Raka teringat pesan ibunya: "Barang yang bukan milik kita harus dikembalikan."',
      ],
      [
        'Raka berlari ke kantin.',
        '"Bu Sari, ini dompet Ibu. Tadi saya temukan di dekat gerbang," kata Raka.',
        'Bu Sari sangat lega. "Terima kasih, Raka. Kamu anak yang jujur."',
      ],
      [
        'Keesokan harinya, Bu Guru memuji Raka di depan kelas.',
        'Raka merasa senang sekali.',
        'Ternyata berbuat jujur membuat hati tenang dan bahagia.',
      ],
    ],
    vocab: [
      ['dompet', 'tempat menyimpan uang', '👛'],
      ['gerbang', 'pintu besar di pagar sekolah atau rumah', '🚪'],
      ['lega', 'merasa tenang setelah khawatir', '😌'],
      ['jujur', 'berkata dan berbuat sesuai kebenaran', '✅'],
    ],
    notes: [
      {
        title: 'Jujur Itu Hebat',
        explanation:
          'Orang yang jujur dipercaya dan disayangi orang lain. Barang yang bukan milik kita harus dikembalikan kepada pemiliknya.',
        examples: ['Mengembalikan barang yang ditemukan.', 'Mengaku jika berbuat salah.'],
      },
    ],
    quiz: [
      ['Milik siapa dompet yang ditemukan Raka?', ['Bu Guru', 'Bu Sari', 'Ibu Raka'], 1, 'Di dalam dompet ada kartu bertuliskan nama Bu Sari.'],
      ['Apa yang dilakukan Raka dengan dompet itu?', ['Membeli mainan', 'Mengembalikannya', 'Menyimpannya'], 1, 'Raka mengembalikan dompet ke Bu Sari di kantin.'],
      ['Sifat baik Raka adalah …', ['Jujur', 'Pelit', 'Malas'], 0, 'Bu Sari berkata, "Kamu anak yang jujur."'],
    ],
  },
  {
    slug: 'cerita-taman-yang-bersih',
    theme: 'Cerita Pendek',
    emoji: '🧺',
    title: 'Taman yang Bersih',
    minutes: 3,
    paragraphs: [
      [
        'Hari Minggu, Nala dan adiknya bermain di taman kota.',
        'Mereka melihat banyak sampah plastik berserakan di rumput.',
        'Ada bungkus makanan, gelas plastik, dan sedotan.',
      ],
      [
        '"Kasihan tamannya jadi kotor," kata Nala.',
        'Nala mengambil kantong dari tasnya.',
        'Ia dan adiknya memungut sampah satu per satu.',
      ],
      [
        'Anak-anak lain melihat mereka dan ikut membantu.',
        'Dalam waktu singkat, taman menjadi bersih kembali.',
        'Mereka membuang sampah ke tempat sampah yang benar.',
      ],
      ['Penjaga taman tersenyum dan berterima kasih.', '"Kalau semua orang peduli, taman kita akan selalu indah," katanya.'],
    ],
    vocab: [
      ['berserakan', 'tersebar di mana-mana dan tidak rapi', '🗑️'],
      ['memungut', 'mengambil benda dari tanah', '🤏'],
      ['peduli', 'mau memperhatikan dan membantu', '💚'],
      ['sedotan', 'pipa kecil untuk minum', '🥤'],
    ],
    notes: [
      {
        title: 'Menjaga Kebersihan Lingkungan',
        explanation:
          'Lingkungan yang bersih membuat kita sehat dan nyaman. Buanglah sampah pada tempatnya dan ajak teman untuk ikut peduli.',
        examples: ['Membawa botol minum sendiri.', 'Membuang sampah ke tempat sampah.'],
      },
    ],
    quiz: [
      ['Di mana Nala dan adiknya bermain?', ['Di pantai', 'Di taman kota', 'Di sekolah'], 1, 'Mereka bermain di taman kota.'],
      ['Apa yang dilakukan Nala saat melihat sampah?', ['Pulang ke rumah', 'Memungut sampah', 'Menendang sampah'], 1, 'Nala dan adiknya memungut sampah satu per satu.'],
      ['Pesan dari cerita ini adalah …', ['Buang sampah sembarangan', 'Jagalah kebersihan lingkungan', 'Jangan bermain di taman'], 1, 'Jika semua peduli, taman akan selalu indah.'],
    ],
  },
  {
    slug: 'cerita-pohon-mangga-kakek',
    theme: 'Cerita Pendek',
    emoji: '🥭',
    title: 'Pohon Mangga Kakek',
    minutes: 3,
    paragraphs: [
      [
        'Kakek menanam sebuah biji mangga di halaman rumah.',
        'Dimas yang berumur tujuh tahun bertanya, "Kek, kapan kita bisa makan mangganya?"',
        '"Mungkin lima tahun lagi, bahkan lebih," jawab Kakek.',
      ],
      [
        'Dimas terkejut. "Lama sekali, Kek!"',
        'Kakek tersenyum. "Menanam itu perlu sabar. Kita harus menyiram dan merawatnya setiap hari."',
      ],
      [
        'Sejak hari itu, Dimas rajin membantu Kakek menyiram pohon mangga.',
        'Pohon itu tumbuh semakin tinggi setiap tahun.',
      ],
      [
        'Bertahun-tahun kemudian, pohon mangga itu berbuah lebat.',
        'Dimas memetik mangga yang manis dan membaginya kepada tetangga.',
        '"Ternyata kesabaran itu manis, seperti mangga ini," kata Dimas.',
      ],
    ],
    vocab: [
      ['halaman', 'tanah di depan atau samping rumah', '🏡'],
      ['merawat', 'menjaga dan memelihara dengan baik', '🪴', ['merawatnya']],
      ['lebat', 'sangat banyak', '🌳'],
      ['memetik', 'mengambil buah dari pohon', '🍃'],
    ],
    notes: [
      {
        title: 'Sabar dan Tekun',
        explanation:
          'Hasil yang baik membutuhkan waktu, kesabaran, dan usaha setiap hari. Seperti menanam pohon, belajar juga perlu sabar.',
        examples: ['Berlatih membaca setiap hari.', 'Tidak marah jika belum berhasil.'],
      },
    ],
    quiz: [
      ['Apa yang ditanam Kakek?', ['Biji mangga', 'Biji jeruk', 'Bunga mawar'], 0, 'Kakek menanam sebuah biji mangga.'],
      ['Apa yang dilakukan Dimas setelah itu?', ['Lupa pada pohon', 'Rajin menyiram pohon', 'Menebang pohon'], 1, 'Dimas rajin membantu Kakek menyiram pohon.'],
      ['Pesan dari cerita ini adalah …', ['Sabar dan tekun', 'Cepat menyerah', 'Makan banyak mangga'], 0, 'Kesabaran itu manis, seperti mangga.'],
    ],
  },
];
