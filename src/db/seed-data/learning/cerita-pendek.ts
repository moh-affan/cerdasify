// Cerita Pendek — Fase A–B (SD Kelas 1–4), Bahasa Indonesia.
// Fabel Aesop, fabel Nusantara, dongeng tradisional, dan cerita keseharian anak dengan pesan moral yang kuat.

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
  {
    slug: 'cerita-kancil-dan-buaya',
    theme: 'Cerita Pendek',
    emoji: '🦌',
    title: 'Kancil dan Buaya yang Cerdik',
    minutes: 4,
    paragraphs: [
      [
        'Di pinggir sungai yang deras, Kancil melihat pohon rambutan yang berbuah lebat di seberang.',
        'Perut Kancil terasa lapar dan ia ingin sekali makan rambutan manis itu.',
        'Namun, sungai itu dipenuhi oleh buaya-buaya besar yang lapar.',
      ],
      [
        'Kancil tersenyum dan menemukan sebuah akal.',
        'Ia berteriak memanggil pemimpin buaya dari tepi sungai.',
        '"Hai Buaya! Raja Hutan memintaku menghitung jumlah kalian untuk membagikan daging segar!" seru Kancil.',
      ],
      [
        'Mendengar kata daging segar, para buaya senang sekali.',
        'Mereka berbaris rapi dari tepi sungai sampai ke seberang.',
        'Kancil melompat ke atas punggung buaya sambil berhitung, "Satu, dua, tiga, empat!"',
      ],
      [
        'Sampai di seberang sungai, Kancil tertawa gembira.',
        '"Terima kasih, para buaya! Sekarang aku sudah tahu jumlah kalian dan aku bisa makan rambutan!"',
        'Buaya menyadari bahwa mereka terkecoh, sementara Kancil menikmati buah manis dengan tenang.',
      ],
    ],
    vocab: [
      ['deras', 'aliran air yang mengalir sangat kencang', '🌊'],
      ['seberang', 'sisi lain dari sungai atau jalan', '🛶'],
      ['terkecoh', 'tertipu oleh kecerdikan orang lain', '😲'],
      ['akal', 'pikiran cerdas untuk menyelesaikan kesulitan', '💡'],
    ],
    notes: [
      {
        title: 'Cerdas dan Waspada',
        explanation:
          'Kecerdasan akal bisa membantu kita keluar dari masalah yang sulit. Namun, kita juga harus berhati-hati dan waspada agar tidak mudah terkecoh oleh orang lain.',
        examples: ['Berpikir tenang saat menghadapi kesulitan.', 'Tidak mudah percaya pada janji manis tanpa bukti.'],
      },
    ],
    quiz: [
      ['Mengapa Kancil ingin menyeberang sungai?', ['Ingin tidur di seberang', 'Ingin makan buah rambutan manis', 'Ingin mandi di sungai'], 1, 'Kancil melihat pohon rambutan berbuah lebat di seberang sungai.'],
      ['Apa alasan yang dikatakan Kancil kepada para buaya?', ['Raja Hutan ingin membagi daging segar', 'Ada banjir besar datang', 'Kancil ingin mengajak buaya bermain'], 0, 'Kancil beralasan diperintah Raja Hutan menghitung buaya untuk membagi daging.'],
      ['Bagaimana cara Kancil menyeberang sungai?', ['Berenang sendiri', 'Melompat di atas punggung buaya yang berbaris', 'Menaiki perahu kecil'], 1, 'Kancil melompati punggung buaya dari tepi ke seberang.'],
    ],
  },
  {
    slug: 'cerita-anak-gembala-dan-serigala',
    theme: 'Cerita Pendek',
    emoji: '🐑',
    title: 'Anak Gembala dan Serigala',
    minutes: 4,
    paragraphs: [
      [
        'Seorang anak gembala bertugas menjaga domba di padang rumput dekat desa.',
        'Karena merasa bosan, ia ingin menjahili para penduduk desa.',
        'Ia memanjat batu besar dan berteriak sekuat tenaga, "Tolong! Serigala datang! Tolong domba-dombaku!"',
      ],
      [
        'Penduduk desa langsung berlari membawa kayu dan cangkul untuk menolong.',
        'Tetapi sesampainya di padang rumput, tidak ada serigala sama sekali.',
        'Anak gembala itu tertawa terbahak-bahak melihat penduduk yang terengah-engah.',
        'Beberapa hari kemudian, anak itu mengulangi kebohongannya lagi, dan penduduk kembali tertipu.',
      ],
      [
        'Suatu sore, seekor serigala sungguhan benar-benar keluar dari hutan gelap.',
        'Serigala itu mendekati kawanan domba sambil menggeram galak.',
        'Anak gembala ketakutan setengah mati dan berteriak, "Tolong! Ada serigala sungguhan!"',
      ],
      [
        'Namun kali ini, tidak ada satu pun penduduk desa yang percaya.',
        '"Dia pasti berbohong lagi," kata para penduduk desa sambil tetap bekerja.',
        'Anak gembala hanya bisa menangis saat serigala membawa lari beberapa dombanya.',
        'Ia sangat menyesali perbuatannya dan berjanji tidak akan pernah berbohong lagi.',
      ],
    ],
    vocab: [
      ['gembala', 'orang yang memelihara dan menjaga hewan ternak di padang', '🧑‍🌾'],
      ['terengah-engah', 'bernapas cepat dan berat karena berlari kencang', '😮‍💨'],
      ['kawanan', 'sekelompok hewan yang hidup bersama', '🐑'],
      ['menyesali', 'merasa sedih dan bersalah atas perbuatan yang keliru', '😢'],
    ],
    notes: [
      {
        title: 'Kejujuran Adalah Kunci Kepercayaan',
        explanation:
          'Sekali kita berbohong, orang lain akan sulit mempercayai kita lagi meski kita berkata jujur. Selalu jujur agar orang lain percaya dan menghormati kita.',
        examples: ['Tidak membuat lelucon yang membahayakan atau menipu.', 'Selalu berbicara apa adanya kepada orang tua dan guru.'],
      },
    ],
    quiz: [
      ['Mengapa anak gembala berteriak bohong pada awalnya?', ['Karena lapar', 'Karena bosan dan ingin menjahili penduduk', 'Karena melihat harimau'], 1, 'Ia merasa bosan dan ingin menjahili orang desa.'],
      ['Apa yang terjadi saat serigala sungguhan datang?', ['Penduduk desa datang menolong', 'Penduduk desa tidak percaya lagi', 'Serigala langsung kabur'], 1, 'Penduduk mengira ia berbohong lagi sehingga tidak ada yang datang.'],
      ['Pelajaran berharga dari cerita ini adalah …', ['Boleh berbohong sesekali', 'Jangan berbohong karena merusak kepercayaan', 'Domba suka bermain dengan serigala'], 1, 'Orang yang suka berbohong tidak akan dipercaya lagi saat berkata benar.'],
    ],
  },
  {
    slug: 'cerita-kerbau-dan-burung-jalak',
    theme: 'Cerita Pendek',
    emoji: '🐂',
    title: 'Kerbau dan Burung Jalak',
    minutes: 3,
    paragraphs: [
      [
        'Pak Kerbau sedang merumput di tepi rawa.',
        'Meskipun rumputnya segar, Pak Kerbau merasa gelisah dan tidak nyaman.',
        'Kulit punggungnya terasa sangat gatal karena dipenuhi oleh kutu-kutu kecil.',
        'Ekornya sudah dikibaskan berkali-kali, tetapi kutu itu tidak mau pergi.',
      ],
      [
        'Tiba-tiba, seekor Burung Jalak hinggap di sebuah ranting pohon di dekatnya.',
        'Burung Jalak itu memegang perutnya yang keroncongan karena belum makan sejak pagi.',
        '"Permisi, Pak Kerbau. Bolehkah aku hinggap di punggungmu?" tanya Burung Jalak dengan sopan.',
      ],
      [
        'Pak Kerbau heran, "Untuk apa kamu hinggap di punggungku, Jalak kecil?"',
        '"Aku lapar sekali dan melihat banyak kutu di kulitmu. Aku ingin memakan kutu-kutu itu," jawab Jalak.',
        'Pak Kerbau mengangguk senang, "Silakan makan sepuasmu, Jalak!"',
      ],
      [
        'Burung Jalak pun mematuki kutu di punggung kerbau satu per satu.',
        'Pak Kerbau merasa sangat lega karena rasa gatalnya hilang.',
        'Burung Jalak pun kenyang dan riang gembira.',
        'Sejak saat itu, mereka berdua menjadi sahabat sejati yang selalu saling menolong.',
      ],
    ],
    vocab: [
      ['gelisah', 'tidak tenang karena merasa tidak nyaman atau khawatir', '😣'],
      ['hinggap', 'mendarat dan bertengger sejenak pada dahan atau benda', '🪶'],
      ['mematuki', 'mengambil makanan menggunakan paruh berulang kali', '🐦'],
      ['simbiosis', 'hubungan saling menguntungkan antar makhluk hidup', '🤝'],
    ],
    notes: [
      {
        title: 'Kerja Sama yang Saling Menguntungkan',
        explanation:
          'Setiap makhluk memiliki kelebihan dan kekurangan. Jika kita saling membantu, masalah yang berat bisa teratasi dan semua pihak merasa senang.',
        examples: ['Belajar kelompok bersama teman sekelas.', 'Membantu adik merapikan mainan bersama-sama.'],
      },
    ],
    quiz: [
      ['Apa yang membuat Pak Kerbau gelisah?', ['Rumputnya pahit', 'Punggungnya gatal karena kutu', 'Sungainya kering'], 1, 'Punggung Pak Kerbau gatal karena dipenuhi kutu.'],
      ['Bagaimana Burung Jalak menolong Kerbau?', ['Menyiram punggungnya dengan air', 'Memakan kutu-kutu di punggungnya', 'Mengipasi punggung kerbau dengan sayap'], 1, 'Jalak mematuki dan memakan kutu sampai habis.'],
      ['Mengapa hubungan Kerbau dan Jalak saling menguntungkan?', ['Keduanya sama-sama mendapat rumput', 'Kerbau bebas kutu dan Jalak menjadi kenyang', 'Kerbau bisa terbang bersama Jalak'], 1, 'Kerbau tidak gatal lagi dan Jalak kenyang karena makan kutu.'],
    ],
  },
  {
    slug: 'cerita-merpati-dan-semut',
    theme: 'Cerita Pendek',
    emoji: '🕊️',
    title: 'Burung Merpati dan Semut',
    minutes: 3,
    paragraphs: [
      [
        'Seekor Semut kecil sedang berjalan di tepi sungai untuk mencari setetes embun.',
        'Tiba-tiba, angin berhembus kencang dan Semut tergelincir masuk ke aliran air.',
        '"Tolong! Tolong aku!" teriak Semut sambil terombang-ambing di permukaan air.',
      ],
      [
        'Dari dahan pohon yang tinggi, Burung Merpati putih melihat Semut yang hampir tenggelam.',
        'Hati Merpati tersentuh oleh rasa kasihan.',
        'Dengan cepat, Merpati memetik sehelai daun hijau dan menjatuhkannya tepat di dekat Semut.',
        'Semut segera merayap ke atas daun dan perlahan-lahan hanyut ke tepi sungai dengan selamat.',
      ],
      [
        'Keesokan harinya, seorang pemburu datang mengendap-endap ke hutan membawa senapan angin.',
        'Pemburu itu membidik Burung Merpati yang sedang beristirahat tenang di ranting pohon.',
        'Merpati tidak menyadari bahaya yang mengancam nyawanya.',
      ],
      [
        'Semut yang berada di dekat kaki pemburu segera menyadari apa yang sedang terjadi.',
        'Tanpa ragu, Semut menggigit jempol kaki pemburu sekuat tenaga.',
        '"Aduh!" teriak pemburu itu kesakitan hingga senapannya meleset.',
        'Mendengar suara gaduh, Merpati langsung terbang tinggi ke angkasa dan selamat.',
      ],
    ],
    vocab: [
      ['tergelincir', 'terpeleset karena licin atau hilang keseimbangan', '💧'],
      ['terombang-ambing', 'bergerak turun-naik terbawa arus air', '🌊'],
      ['mengendap-endap', 'berjalan pelan dan sembunyi-sembunyi agar tidak terdengar', '🤫'],
      ['meleset', 'tidak mengenai sasaran yang dibidik', '🎯'],
    ],
    notes: [
      {
        title: 'Balas Budi dan Kebaikan Kecil',
        explanation:
          'Kebaikan sekecil apa pun tidak akan pernah sia-sia. Pertolongan tulus yang kita berikan kepada orang lain suatu saat akan kembali menyelamatkan kita.',
        examples: ['Menolong teman yang terjatuh di halaman sekolah.', 'Mengucapkan terima kasih dan membalas bantuan teman.'],
      },
    ],
    quiz: [
      ['Bagaimana cara Merpati menolong Semut yang hanyut?', ['Menarik tangan Semut', 'Menjatuhkan sehelai daun ke dekat Semut', 'Menerbangkan Semut di sayapnya'], 1, 'Merpati menjatuhkan sehelai daun agar Semut bisa naik.'],
      ['Apa bahaya yang dihadapi Burung Merpati keesokan harinya?', ['Hujan badai besar', 'Dibidik oleh seorang pemburu burung', 'Dikejar oleh kucing liar'], 1, 'Seorang pemburu membidik Merpati dengan senapan.'],
      ['Bagaimana Semut membalas kebaikan Merpati?', ['Menggigit jempol kaki pemburu', 'Berteriak memanggil polisi', 'Menutup mata pemburu dengan daun'], 0, 'Semut menggigit kaki pemburu sekuat tenaga hingga tembakannya meleset.'],
    ],
  },
  {
    slug: 'cerita-kera-dan-kura-kura-menanam-pisang',
    theme: 'Cerita Pendek',
    emoji: '🍌',
    title: 'Kera dan Kura-Kura Menanam Pisang',
    minutes: 4,
    paragraphs: [
      [
        'Kera dan Kura-Kura sepakat untuk menanam pohon pisang bersama.',
        'Mereka membagi satu pohon pisang menjadi dua bagian.',
        'Kera yang serakah memilih bagian atas pohon yang sudah ada daun dan bakal buahnya.',
        'Sedangkan Kura-Kura dengan sabar menerima bagian bawah yang hanya berupa bonggol dan akar.',
      ],
      [
        'Kera merasa dirinya paling pintar.',
        '"Pohon pisangku pasti cepat berbuah karena sudah berdaun lebat," sombong Kera.',
        'Namun karena tidak punya akar, bagian atas pohon pisang Kera layu dan mati beberapa hari kemudian.',
        'Sebaliknya, pohon pisang Kura-Kura berakar kuat, tumbuh subur, dan menghasilkan setandan pisang kuning yang harum.',
      ],
      [
        'Kera datang berkunjung dan melihat pisang milik Kura-Kura.',
        '"Kura-Kura, kamu tidak bisa memanjat. Biar aku yang memetikkan pisangmu dari atas pohon," kata Kera licik.',
        'Kura-Kura percaya dan membiarkan Kera memanjat.',
      ],
      [
        'Namun di atas pohon, Kera memakan semua pisang manis itu sendirian tanpa menyisakan satu pun untuk Kura-Kura.',
        'Kera yang kekenyangan menjadi lengah. Tiba-tiba pelepah pisang patah dan Kera terjatuh ke tanah.',
        'Kera meringis kesakitan dan meminta maaf karena telah bersikap tamak dan mengkhianati sahabatnya.',
      ],
    ],
    vocab: [
      ['bonggol', 'bagian pangkal batang tumbuhan di dalam tanah yang bertunas', '🌱'],
      ['setandan', 'sekelompok buah pisang yang tumbuh pada satu tangkai besar', '🍌'],
      ['lengah', 'kurang waspada dan tidak memperhatikan keadaan sekitar', '⚠️'],
      ['tamak', 'selalu ingin memiliki banyak untuk diri sendiri tanpa mau berbagi', '😣'],
    ],
    notes: [
      {
        title: 'Akibat Buruk dari Ketamakan',
        explanation:
          'Keserakahan dan sikap curang hanya akan merugikan diri sendiri pada akhirnya. Kesabaran dan usaha yang jujur akan membawa berkah manis.',
        examples: ['Berbagi makanan ringan bersama teman secara adil.', 'Tidak mengambil jatah orang lain.'],
      },
    ],
    quiz: [
      ['Bagian pohon apa yang dipilih oleh Kera saat membagi pohon pisang?', ['Bonggol dan akar', 'Bagian atas yang berdaun', 'Kulit pohon saja'], 1, 'Kera memilih bagian atas karena mengira akan lebih cepat berbuah.'],
      ['Mengapa pohon pisang Kura-Kura berhasil tumbuh subur?', ['Karena memiliki akar yang menyerap makanan', 'Karena disiram air garam', 'Karena ditiup angin'], 0, 'Bagian bawah memiliki bonggol dan akar yang kuat.'],
      ['Apa yang dialami Kera karena keserakahannya?', ['Menjadi raja hutan', 'Pelepah patah dan terjatuh kesakitan', 'Diberi hadiah oleh Kura-Kura'], 1, 'Kera jatuh dari pohon karena lengah memakan semua pisang sendirian.'],
    ],
  },
  {
    slug: 'cerita-angsa-bertelur-emas',
    theme: 'Cerita Pendek',
    emoji: '🪿',
    title: 'Petani dan Angsa Bertelur Emas',
    minutes: 3,
    paragraphs: [
      [
        'Dahulu kala, ada seorang petani miskin yang tinggal di sebuah gubuk kecil.',
        'Suatu pagi di kandang unggasnya, ia melihat sebuah telur yang berkilauan.',
        'Ketika diambil, telur itu sangat berat dan terbuat dari emas murni!',
      ],
      [
        'Setiap pagi berikutnya, angsa ajaib itu selalu bertelur satu butir emas murni.',
        'Petani menjual telur-telur emas itu ke pasar kota.',
        'Dalam waktu singkat, petani menjadi kaya raya dan membangun rumah megah.',
      ],
      [
        'Namun, semakin kaya petani itu, semakin serakah hatinya.',
        '"Mengapa aku harus menunggu satu butir setiap hari? Pasti di dalam perut angsa ini tersimpan berton-ton emas!" pikirnya.',
        'Istrinya sudah mengingatkan agar tetap bersyukur, tetapi petani tidak mau mendengar.',
      ],
      [
        'Dengan tergesa-gesa, petani menyembelih angsa ajaib itu dan membelah perutnya.',
        'Betapa terkejutnya petani ketika melihat isi perut angsa itu sama saja seperti unggas biasa.',
        'Tidak ada emas sama sekali di dalamnya.',
        'Kini angsa ajaib itu telah tiada, dan petani hanya bisa menangisi kebodohan serta ketamakannya.',
      ],
    ],
    vocab: [
      ['unggas', 'hewan berkaki dua, berbulu, dan bersayap seperti ayam, bebek, atau angsa', '🪿'],
      ['murni', 'asli dan tidak ada campuran logam lain', '✨'],
      ['megah', 'tampak sangat besar, indah, dan mewah', '🏰'],
      ['menyembelih', 'memotong hewan untuk diambil dagingnya', '🔪'],
    ],
    notes: [
      {
        title: 'Selalu Bersyukur dan Hindari Keserakahan',
        explanation:
          'Jangan membuang rezeki yang sudah kita miliki hanya karena ingin mendapatkan keuntungan besar secara cepat. Rasa syukur membuat hidup tenang dan berkecukupan.',
        examples: ['Mensyukuri nilai yang didapat setelah belajar sungguh-sungguh.', 'Menghargai apa yang sudah kita punya hari ini.'],
      },
    ],
    quiz: [
      ['Apa keajaiban yang dimiliki oleh angsa milik petani?', ['Bisa berbicara seperti manusia', 'Bertelur emas murni satu butir setiap hari', 'Bisa terbang sampai ke bulan'], 1, 'Angsa itu bertelur sebutir emas murni setiap pagi.'],
      ['Mengapa petani nekat menyembelih angsanya?', ['Karena angsa itu sakit', 'Karena ingin mengambil semua emas di perutnya sekaligus', 'Karena ingin memakan dagingnya'], 1, 'Petani serakah dan mengira ada banyak emas di dalam perut angsa.'],
      ['Apa akibat yang diterima petani atas ketamakannya?', ['Ia menjadi semakin kaya', 'Ia kehilangan angsa ajaib dan tidak mendapat apa-apa', 'Ia menemukan peti harta karun'], 1, 'Angsa mati dan petani tidak menemukan emas di perutnya.'],
    ],
  },
  {
    slug: 'cerita-rubah-dan-bangau',
    theme: 'Cerita Pendek',
    emoji: '🦊',
    title: 'Rubah dan Burung Bangau',
    minutes: 4,
    paragraphs: [
      [
        'Rubah yang usil mengundang Burung Bangau untuk makan malam di rumahnya.',
        'Bangau merasa tersanjung dan datang tepat waktu dengan perut lapar.',
        'Namun, Rubah menyajikan sup harum di atas dua piring yang sangat ceper dan lebar.',
      ],
      [
        'Rubah menjilati sup di piringnya dengan sangat mudah dan cepat.',
        'Namun Bangau yang memiliki paruh panjang dan runcing tidak bisa meminum sup dari piring ceper itu.',
        'Setiap kali Bangau mematuk, paruhnya hanya membentur permukaan piring.',
        'Rubah tertawa geli melihat tamunya tidak bisa makan.',
      ],
      [
        'Beberapa hari kemudian, giliran Burung Bangau yang mengundang Rubah ke sarangnya.',
        'Bangau memasak daging cincang berkuah yang aromanya sangat lezat.',
        'Bangau menyajikan makanan itu di dalam dua kendi kaca dengan leher panjang dan sempit.',
      ],
      [
        'Bangau dengan mudah memasukkan paruhnya yang panjang ke dalam kendi dan menikmati hidangan.',
        'Sementara itu, Rubah dengan moncongnya yang pendek tidak bisa menjangkau makanan di dasar kendi.',
        'Rubah tertunduk malu dan menyadari kesalahannya karena telah mempermainkan teman.',
      ],
    ],
    vocab: [
      ['ceper', 'rata dan dangkal, tidak berlekuk dalam', '🍽️'],
      ['tersanjung', 'merasa senang dan terhormat karena dihargai orang lain', '😊'],
      ['moncong', 'bagian mulut dan hidung hewan yang menonjol ke depan', '🦊'],
      ['menjamu', 'menyuguhkan makanan dan minuman kepada tamu yang datang', '🍲'],
    ],
    notes: [
      {
        title: 'Hormati dan Hargai Perbedaan Teman',
        explanation:
          'Perlakukanlah orang lain sebagaimana kamu ingin diperlakukan. Jangan pernah membuat lelucon yang membuat teman merasa kesulitan atau sedih.',
        examples: ['Tidak mengejek kebiasaan atau kekurangan fisik teman.', 'Menghargai selera makanan dan pilihan orang lain.'],
      },
    ],
    quiz: [
      ['Di mana Rubah menyajikan sup saat menjamu Bangau?', ['Di dalam mangkuk mangkok', 'Di atas piring yang sangat ceper dan lebar', 'Di dalam botol tinggi'], 1, 'Rubah sengaja memakai piring ceper yang tidak cocok untuk paruh panjang Bangau.'],
      ['Bagaimana Bangau membalas perlakuan Rubah?', ['Menyajikan makanan di kendi berleher panjang dan sempit', 'Tidak mau menemui Rubah lagi', 'Melempari rumah Rubah dengan batu'], 0, 'Bangau menyajikan makanan di kendi dengan leher sempit.'],
      ['Pesan moral dari kisah ini adalah …', ['Jangan suka mengundang tamu ke rumah', 'Perlakukan teman dengan baik dan jangan usil', 'Rubah adalah hewan yang paling cerdas'], 1, 'Jangan memperlakukan orang lain dengan cara yang tidak menyenangkan.'],
    ],
  },
  {
    slug: 'cerita-kancil-dan-harimau',
    theme: 'Cerita Pendek',
    emoji: '🐅',
    title: 'Kancil dan Harimau di Hutan',
    minutes: 4,
    paragraphs: [
      [
        'Suatu siang, Kancil sedang beristirahat di bawah rumpun bambu yang teduh.',
        'Tiba-tiba, langkah berat menggetarkan dedaunan kering.',
        'Seekor Harimau lapar melompat keluar dengan taring tajam yang berkilat.',
        '"Aha! Akhirnya aku menemukan santapan lezat siang ini!" aum Harimau dengan congkak.',
      ],
      [
        'Kancil sangat terkejut, namun ia segera menenangkan debar jantungnya.',
        'Ia tahu bahwa jika ia lari, Harimau pasti akan mengejar dan menangkapnya dengan mudah.',
        'Kancil melihat ke atas pohon, tempat seekor ular sanca besar yang sedang melingkar tidur pulas.',
      ],
      [
        'Kancil duduk tegak dan berkata dengan tenang, "Tunggu dulu, Harimau! Aku sedang mengemban tugas penting dari Raja Hutan."',
        '"Tugas apa itu?" tanya Harimau penasaran.',
        '"Aku diperintahkan menjaga sabuk pusaka Raja Hutan yang sangat sakti di atas pohon itu," jawab Kancil sambil menunjuk ular sanca.',
      ],
      [
        'Harimau yang serakah ingin sekali mencoba memakai sabuk sakti tersebut.',
        'Kancil pura-pura melarang sebelum akhirnya berkata, "Baiklah, tapi aku harus pergi menjauh dulu agar tidak dimarahi Raja Hutan."',
        'Setelah Kancil lari jauh, Harimau menyentuh ular itu. Ular yang terbangun langsung melilit tubuh Harimau dengan erat.',
        'Harimau meraung meminta ampun, sementara Kancil telah selamat kembali ke padang rumput.',
      ],
    ],
    vocab: [
      ['congkak', 'sombong dan memandang rendah yang lain', '😾'],
      ['debar', 'denyut jantung yang berdetak kencang karena kaget atau takut', '💓'],
      ['mengemban', 'memikul atau menjalankan tanggung jawab dan perintah', '📜'],
      ['pusaka', 'barang peninggalan yang berharga dan dihormati', '🗡️'],
    ],
    notes: [
      {
        title: 'Ketenangan Menghadapi Bahaya',
        explanation:
          'Kepanikan hanya akan memperburuk situasi yang genting. Jika kita bisa tetap tenang dan berpikir jernih, kita dapat menemukan jalan keluar terbaik dari bahaya.',
        examples: ['Tidak panik saat tersesat di tempat umum, melainkan mencari petugas.', 'Tarik napas dalam-dalam saat menghadapi ujian sulit.'],
      },
    ],
    quiz: [
      ['Apa yang dilakukan Kancil saat bertemu Harimau lapar?', ['Menangis tersedu-sedu', 'Menenangkan diri dan mencari akal', 'Menyerahkan diri pasrah'], 1, 'Kancil tidak lari panik melainkan berpikir tenang mencari akal.'],
      ['Benda apa yang diakui Kancil sebagai sabuk sakti Raja Hutan?', ['Tali tambang kapal', 'Ular sanca besar yang sedang tidur', 'Akar pohon beringin'], 1, 'Ular sanca yang sedang melingkar tidur di dahan pohon.'],
      ['Mengapa Kancil selamat dari Harimau?', ['Karena bisa berlari lebih kencang dari elang', 'Karena menggunakan kecerdasan akal dan tidak panik', 'Karena Harimau berubah pikiran menjadi baik'], 1, 'Kecerdasan dan ketenangan Kancil menyelamatkan nyawanya.'],
    ],
  },
  {
    slug: 'cerita-kucing-belang-dan-anjing-cokelat',
    theme: 'Cerita Pendek',
    emoji: '🐱',
    title: 'Kucing Belang dan Anjing Cokelat',
    minutes: 3,
    paragraphs: [
      [
        'Kucing Belang dan Anjing Cokelat adalah tetangga yang sering bermain di taman desa.',
        'Suatu sore, mereka menemukan sebuah kotak bekal yang tertinggal di bawah bangku taman.',
        'Saat dibuka, di dalamnya ada dua potong kue bolu cokelat yang wangi dan lembut.',
      ],
      [
        'Namun, salah satu potongan kue bolu itu tampak sedikit lebih besar daripada yang lain.',
        '"Aku yang pertama melihat kotak ini, jadi potongan besar ini milikku!" kata Kucing Belang.',
        '"Tapi aku yang pertama membukanya, jadi aku yang berhak!" bantah Anjing Cokelat.',
        'Mereka mulai saling mendengus dan hampir berkelahi.',
      ],
      [
        'Tiba-tiba, angin bertiup kencang dan kotak bekal itu hampir terguling ke selokan.',
        'Kucing Belang tersentak dan menahan kotak dengan cakarnya.',
        '"Lihat, jika kotak ini jatuh, kita berdua tidak akan dapat apa-apa," kata Kucing Belang.',
      ],
      [
        'Anjing Cokelat mengangguk malu. "Kamu benar. Persahabatan kita jauh lebih berharga daripada sepotong kue."',
        'Mereka memotong kedua kue itu menjadi empat bagian yang sama rata.',
        'Mereka makan bersama dengan gembira sambil berbagi cerita hingga matahari terbenam.',
      ],
    ],
    vocab: [
      ['mendengus', 'mengeluarkan napas keras lewat hidung tanda kesal', '😤'],
      ['tersentak', 'terkejut secara tiba-tiba karena suatu kejadian', '⚡'],
      ['selokan', 'saluran pembuangan air di pinggir jalan', '🌊'],
      ['adil', 'sama rata dan tidak memihak salah satu pihak', '⚖️'],
    ],
    notes: [
      {
        title: 'Berbagi dengan Ikhlas dan Adil',
        explanation:
          'Bertengkar karena berebut makanan atau mainan hanya akan merusak hubungan baik. Mengalah dan berbagi secara adil membuat hati damai dan persahabatan tetap utuh.',
        examples: ['Berbagi jatah kue dengan adik di rumah.', 'Bergantian memakai ayunan di taman bermain.'],
      },
    ],
    quiz: [
      ['Apa yang ditemukan Kucing Belang dan Anjing Cokelat di bangku taman?', ['Sebuah bola tenis', 'Dua potong kue bolu cokelat', 'Sepotong tulang sapi'], 1, 'Mereka menemukan kotak bekal berisi kue bolu cokelat.'],
      ['Mengapa mereka hampir berkelahi?', ['Karena salah satu kue tampak lebih besar', 'Karena kuenya basi', 'Karena tempatnya kotor'], 0, 'Mereka berebut potongan kue yang ukurannya lebih besar.'],
      ['Bagaimana mereka akhirnya menyelesaikan masalah?', ['Membuang kuenya ke sungai', 'Membagi kue secara adil menjadi empat bagian sama besar', 'Meminta kucing lain memakannya'], 1, 'Mereka membagi kue sama rata dan makan bersama dengan rukun.'],
    ],
  },
  {
    slug: 'cerita-bimo-belajar-sepeda',
    theme: 'Cerita Pendek',
    emoji: '🚲',
    title: 'Bimo Belajar Sepeda Roda Dua',
    minutes: 4,
    paragraphs: [
      [
        'Hari Minggu pagi, Ayah melepas dua roda bantu kecil dari sepeda Bimo.',
        'Bimo yang berusia delapan tahun merasa sangat berdebar.',
        'Semua teman di komplek rumahnya sudah mahir mengendarai sepeda roda dua.',
      ],
      [
        '"Pegang stang dengan mantap dan pandanglah lurus ke depan, Bimo," kata Ayah sambil memegangi bagian belakang sadel sepeda.',
        'Bimo mengayuh pedal perlahan-lahan.',
        'Namun saat Ayah melepaskan pegangannya, sepeda oleng dan Bimo terjatuh ke rumput.',
        'Lutut Bimo terasa nyeri dan ia mulai menitikkan air mata.',
      ],
      [
        '"Ayah, aku tidak bisa. Ini terlalu sulit!" keluh Bimo sambil duduk di tanah.',
        'Ayah berlutut di samping Bimo dan mengusap pundaknya dengan lembut.',
        '"Jatuh itu wajar dalam belajar, Nak. Yang penting adalah bangkit kembali dan mencoba lagi," hibur Ayah.',
      ],
      [
        'Bimo mengusap air matanya dan berdiri tegak.',
        'Ia kembali menaiki sepeda dan mengayuh dengan penuh keyakinan.',
        'Satu kayuhan, dua kayuhan, tiga kayuhan... sepedanya meluncur seimbang!',
        '"Ayah, lihat! Aku bisa mengayuh sendiri!" teriak Bimo dengan senyum paling lebar di wajahnya.',
      ],
    ],
    vocab: [
      ['sadel', 'tempat duduk pada sepeda atau kuda', '💺'],
      ['oleng', 'bergoyang ke kiri dan ke kanan, tidak seimbang', '〰️'],
      ['mahir', 'sangat terampil dan pandai melakukan sesuatu', '⭐'],
      ['kayuhan', 'gerakan menekan pedal sepeda dengan kaki secara bergantian', '🚴'],
    ],
    notes: [
      {
        title: 'Pantang Menyerah Menghadapi Kegagalan',
        explanation:
          'Setiap keahlian baru membutuhkan latihan dan keberanian untuk mencoba lagi saat terjatuh. Jangan takut gagal karena kegagalan adalah bagian dari proses belajar.',
        examples: ['Berlatih menulis rapi meskipun tangan terasa pegal.', 'Mengulang soal matematika yang salah sampai paham.'],
      },
    ],
    quiz: [
      ['Apa yang dilepas Ayah dari sepeda Bimo?', ['Rantainya', 'Dua roda bantu kecil', 'Stang kemudinya'], 1, 'Ayah melepas roda bantu agar Bimo bisa belajar roda dua.'],
      ['Apa yang terjadi saat Bimo pertama kali mencoba mengayuh sendiri?', ['Sepeda melaju cepat ke jalan raya', 'Sepeda oleng dan Bimo terjatuh ke rumput', 'Bimo langsung menabrak tiang listrik'], 1, 'Sepeda tidak seimbang sehingga oleng dan jatuh.'],
      ['Apa nasihat Ayah kepada Bimo saat ia ingin menyerah?', ['Lebih baik tidak usah naik sepeda lagi', 'Jatuh itu wajar, yang penting mau bangkit dan mencoba lagi', 'Marah kepada sepeda yang rusak'], 1, 'Ayah mengingatkan bahwa jatuh adalah proses belajar dan harus bangkit lagi.'],
    ],
  },
  {
    slug: 'cerita-celengan-ayam-siti',
    theme: 'Cerita Pendek',
    emoji: '🪙',
    title: 'Celengan Ayam Siti',
    minutes: 3,
    paragraphs: [
      [
        'Siti memiliki celengan berbentuk ayam jago yang terbuat dari tanah liat.',
        'Celengan itu diletakkan di atas meja belajarnya.',
        'Setiap hari, Siti menyisihkan sisa uang sakunya, seribu atau dua ribu rupiah, lalu memasukkannya ke lubang punggung ayam.',
      ],
      [
        'Terkadang, teman-temannya mengajak membeli mainan plastik atau permen manis di luar gerbang sekolah.',
        'Namun Siti menahan diri.',
        '"Aku punya impian membeli buku ensiklopedia sains bergambar," tekad Siti dalam hati.',
      ],
      [
        'Enam bulan berlalu, celengan ayam itu terasa sangat berat saat diangkat.',
        'Bersama Ibu, Siti memecahkan celengan di atas nampan dengan hati berdebar.',
        'Koin dan uang kertas ditata dan dihitung bersama-sama.',
        'Jumlahnya cukup banyak dan pas untuk membeli buku impiannya!',
      ],
      [
        'Di toko buku, Siti membayar buku ensiklopedia itu dengan uang hasil tabungannya sendiri.',
        'Kasir toko tersenyum kagum pada ketekunan Siti.',
        'Siti memeluk bukunya erat-erat dengan perasaan bangga yang luar biasa.',
      ],
    ],
    vocab: [
      ['menyisihkan', 'memisahkan sebagian uang untuk disimpan', '💰'],
      ['tekad', 'kemauan yang sangat kuat dan mantap untuk mencapai tujuan', '💪'],
      ['nampan', 'baki atau wadah datar untuk membawa cangkir atau benda', '🍱'],
      ['ensiklopedia', 'buku yang memuat penjelasan tentang berbagai cabang ilmu pengetahuan', '📖'],
    ],
    notes: [
      {
        title: 'Manfaat Hidup Hemat dan Menabung',
        explanation:
          'Menabung melatih kita untuk bersabar, menahan keinginan yang tidak perlu, dan merencanakan masa depan. Hasil tabungan sendiri terasa jauh lebih membahagiakan.',
        examples: ['Menyimpan sebagian uang jajan ke dalam celengan.', 'Membeli barang yang benar-benar dibutuhkan, bukan sekadar diinginkan.'],
      },
    ],
    quiz: [
      ['Berasal dari bahan apa celengan ayam milik Siti?', ['Besi baja', 'Tanah liat', 'Kaca kristal'], 1, 'Celengan ayam Siti terbuat dari tanah liat tradisional.'],
      ['Apa cita-cita yang ingin dicapai Siti dengan uang tabungannya?', ['Membeli sepeda motor', 'Membeli buku ensiklopedia sains bergambar', 'Membeli permen satu karung'], 1, 'Siti ingin membeli buku ensiklopedia impiannya.'],
      ['Sikap baik apa yang ditunjukkan oleh Siti?', ['Boros menghabiskan uang', 'Hemat, sabar, dan tekun menabung', 'Pelit kepada orang tua'], 1, 'Siti tekun menyisihkan uang sakunya untuk hal yang bermanfaat.'],
    ],
  },
  {
    slug: 'cerita-bekal-makan-siang-ali',
    theme: 'Cerita Pendek',
    emoji: '🍱',
    title: 'Bekal Makan Siang Ali',
    minutes: 3,
    paragraphs: [
      [
        'Bel istirahat pertama berbunyi nyaring di seluruh penjuru SD Nusantara.',
        'Anak-anak kelas dua berhamburan membuka tas dan mengeluarkan kotak bekal masing-masing.',
        'Ali duduk di bangkunya dan membuka kotak bekal berisi nasi goreng dengan telur mata sapi yang wangi.',
      ],
      [
        'Di sampingnya, Dito tampak murung sambil menatap meja kosongnya.',
        '"Dito, mana kotak bekalmu?" tanya Ali dengan ramah.',
        'Dito menunduk pelan, "Tadi pagi terburu-buru, tasku tertinggal di mobil jemputan dan bekalnya ikut terbawa."',
        'Perut Dito berbunyi lirih karena ia belum sarapan.',
      ],
      [
        'Ali tidak berpikir dua kali.',
        'Ia membagi nasi gorengnya ke atas tutup kotak bekal yang bersih dan menyodorkannya kepada Dito.',
        '"Ayo kita makan bersama, Dito! Telurnya juga kita bagi dua," ajak Ali sambil tersenyum tulus.',
      ],
      [
        'Mata Dito berbinar haru. "Terima kasih banyak, Ali. Kamu teman yang sangat baik."',
        'Mereka makan siang bersama dengan lahap dan penuh canda tawa.',
        'Meskipun porsi makannya berkurang, hati Ali terasa sangat kenyang oleh kebahagiaan.',
      ],
    ],
    vocab: [
      ['berhamburan', 'keluar atau berlari ke berbagai arah secara bersamaan', '🏃'],
      ['murung', 'bersedih hati dan tidak bersemangat', '😔'],
      ['menyodorkan', 'mengulurkan tangan untuk memberikan sesuatu ke depan', '🤲'],
      ['berbinar', 'bersinar terang karena perasaan gembira atau terharu', '✨'],
    ],
    notes: [
      {
        title: 'Peduli dan Berbagi kepada Sahabat',
        explanation:
          'Kebaikan tidak diukur dari seberapa banyak yang kita berikan, melainkan dari ketulusan hati saat melihat sahabat dalam kesulitan. Berbagi membuat rezeki terasa berlipat ganda.',
        examples: ['Meminjamkan pensil kepada teman yang lupa membawa tempat pensil.', 'Berbagi makanan ringan saat istirahat sekolah.'],
      },
    ],
    quiz: [
      ['Mengapa Dito tidak makan saat jam istirahat?', ['Karena sedang kenyang', 'Karena kotak bekalnya tertinggal di mobil jemputan', 'Karena tidak suka makanan rumah'], 1, 'Dito terburu-buru sehingga kotak bekalnya tertinggal.'],
      ['Apa yang dilakukan Ali ketika mengetahui Dito kelaparan?', ['Menertawakan Dito', 'Membagi nasi goreng dan telurnya kepada Dito', 'Menyuruh Dito pulang'], 1, 'Ali membagi nasi goreng dan telurnya agar mereka bisa makan bersama.'],
      ['Bagaimana perasaan Ali setelah berbagi makanannya?', ['Kesal karena masih lapar', 'Bahagia dan senang karena bisa menolong sahabat', 'Menyesal telah berbagi'], 1, 'Ali merasa sangat bahagia dapat membantu temannya.'],
    ],
  },
  {
    slug: 'cerita-kakek-nelayan-dan-ikan-kecil',
    theme: 'Cerita Pendek',
    emoji: '🎣',
    title: 'Kakek Nelayan dan Ikan Kecil',
    minutes: 4,
    paragraphs: [
      [
        'Kakek Salim adalah seorang nelayan tua yang tinggal di tepi pantai teluk biru.',
        'Setiap fajar menyingsing, ia mendayung perahu kayu kecilnya ke laut tenang untuk menjala ikan.',
        'Hari itu, matahari sudah meninggi tetapi jala Kakek Salim baru menangkap beberapa ekor kepiting kecil.',
      ],
      [
        'Menjelang sore, tarikan tali jala terasa agak berat.',
        'Kakek Salim menarik jala ke atas perahu dengan penuh harapan.',
        'Namun di dalam jala, hanya ada seekor anak ikan kerapu yang masih sangat kecil dan bersisik perak.',
      ],
      [
        'Anak ikan itu menggelepar lemah di atas geladak perahu.',
        '"Jika kubawa pulang, daging ikan ini bahkan tidak cukup untuk satu gigitan," gumam Kakek Salim.',
        '"Tetapi jika kubiarkan di laut, ia bisa tumbuh besar dan bertelur banyak."',
      ],
      [
        'Tanpa ragu, Kakek Salim mengangkat anak ikan itu dengan kedua telapak tangannya lalu melepaskannya kembali ke air biru.',
        'Anak ikan itu mengibaskan ekornya gembira lalu berenang lincah ke kedalaman karang.',
        'Meskipun pulang hanya membawa sedikit hasil, Kakek Salim tersenyum damai karena telah menjaga kelestarian laut.',
      ],
    ],
    vocab: [
      ['fajar', 'cahaya kemerahan di langit timur sebelum matahari terbit', '🌅'],
      ['menggelepar', 'bergerak-gerak melonjak kencang saat berada di darat', '🐟'],
      ['geladak', 'lantai terbuka pada perahu atau kapal laut', '⛵'],
      ['kelestarian', 'keadaan lingkungan alam yang tetap terjaga baik dan tidak rusak', '🌊'],
    ],
    notes: [
      {
        title: 'Menjaga dan Menyayangi Kelestarian Alam',
        explanation:
          'Manusia hidup berdampingan dengan alam. Mengambil hasil alam secukupnya dan tidak serakah adalah wujud rasa syukur agar laut dan bumi tetap lestari untuk masa depan.',
        examples: ['Tidak membuang sampah plastik ke laut atau sungai.', 'Tidak memetik bunga atau merusak ranting tanaman sembarangan.'],
      },
    ],
    quiz: [
      ['Kapan Kakek Salim biasanya mulai melaut?', ['Saat tengah malam gulita', 'Saat fajar menyingsing di pagi hari', 'Saat matahari terbenam'], 1, 'Kakek Salim mendayung perahunya setiap fajar menyingsing.'],
      ['Apa yang dilakukan Kakek Salim terhadap anak ikan kecil yang tertangkap?', ['Menjualnya ke pasar kota', 'Melepaskannya kembali ke laut bebas', 'Menjadikannya umpan buaya'], 1, 'Kakek melepaskannya agar bisa tumbuh besar dan menjaga ekosistem laut.'],
      ['Pesan bijak dari tindakan Kakek Salim adalah …', ['Tangkaplah semua ikan sampai habis', 'Jaga kelestarian alam dan jangan serakah', 'Jangan pernah pergi ke laut'], 1, 'Menjaga kelestarian alam lebih penting daripada keuntungan sesaat.'],
    ],
  },
  {
    slug: 'cerita-buku-perpustakaan-dani',
    theme: 'Cerita Pendek',
    emoji: '📚',
    title: 'Buku Perpustakaan Dani',
    minutes: 3,
    paragraphs: [
      [
        'Dani meminjam sebuah buku cerita petualangan yang tebal dari perpustakaan sekolah.',
        'Buku itu memiliki gambar sampul kapal layar yang sangat bagus.',
        'Ibu Guru berpesan agar buku itu dirawat dengan baik dan dikembalikan tepat waktu.',
      ],
      [
        'Di rumah, Dani membaca buku itu di ruang tamu.',
        'Tiba-tiba, adik balitanya yang berusia tiga tahun mendekat sambil memegang krayon merah.',
        'Adik ingin mencoret halaman bergambar di buku perpustakaan itu.',
      ],
      [
        'Dani segera menarik buku itu dengan lembut ke pangkuannya.',
        '"Jangan dicoret ya, Dik. Ini bukan buku kita, ini buku milik perpustakaan sekolah," kata Dani sabar.',
        'Dani lalu mengambil selembar kertas gambar kosong dan memberikan krayon kepada adiknya agar ia bisa menggambar di sana.',
      ],
      [
        'Setelah selesai membaca, Dani membungkus buku itu dengan sampul plastik pelindung.',
        'Pada hari pengembalian, penjaga perpustakaan memeriksa buku tersebut.',
        '"Buku ini masih sangat rapi dan bersih. Terima kasih atas tanggung jawabmu, Dani," puji penjaga perpustakaan.',
      ],
    ],
    vocab: [
      ['petualangan', 'pengalaman seru dan menantang menjelajahi tempat baru', '🧭'],
      ['balita', 'anak yang berusia di bawah lima tahun', '👶'],
      ['pelindung', 'alat atau benda untuk menjaga agar sesuatu tidak rusak', '🛡️'],
      ['tanggung jawab', 'kesadaran untuk melaksanakan kewajiban dengan sungguh-sungguh', '⭐'],
    ],
    notes: [
      {
        title: 'Menjaga Amanah dan Barang Pinjaman',
        explanation:
          'Barang milik bersama atau pinjaman orang lain harus dijaga lebih hati-hati daripada barang milik sendiri. Mengembalikan barang dalam keadaan baik adalah tanda pribadi yang dapat dipercaya.',
        examples: ['Mengembalikan buku perpustakaan tepat waktu tanpa robek.', 'Menjaga kebersihan fasilitas umum di sekolah dan taman.'],
      },
    ],
    quiz: [
      ['Dari mana Dani mendapatkan buku cerita petualangan itu?', ['Membeli di toko buku', 'Meminjam dari perpustakaan sekolah', 'Hadiah ulang tahun dari paman'], 1, 'Dani meminjamnya dari perpustakaan sekolah.'],
      ['Apa yang dilakukan Dani saat adiknya ingin mencoret buku?', ['Memarahi adiknya dengan keras', 'Mengalihkan perhatian adik dengan memberi kertas gambar kosong', 'Membiarkan adik mencoretnya'], 1, 'Dani dengan sabar memberi adik kertas gambar khusus.'],
      ['Mengapa penjaga perpustakaan memuji Dani?', ['Karena membaca buku sangat cepat', 'Karena buku dikembalikan rapi, bersih, dan tepat waktu', 'Karena Dani membelikan buku baru'], 1, 'Dani bertanggung jawab menjaga buku pinjaman tetap bersih dan rapi.'],
    ],
  },
  {
    slug: 'cerita-jam-beker-raka',
    theme: 'Cerita Pendek',
    emoji: '⏰',
    title: 'Jam Beker Raka',
    minutes: 3,
    paragraphs: [
      [
        'Raka sering terlambat bangun pagi.',
        'Hampir setiap hari ia harus berlari tergesa-gesa ke sekolah, terkadang lupa menyisir rambut atau ketinggalan penggaris.',
        'Melihat kebiasaan itu, Ibu memberi Raka sebuah hadiah berupa jam beker berbentuk lonceng kuning.',
      ],
      [
        '"Mulai malam ini, atur jam ini berdering pukul lima pagi, Raka," pesan Ibu.',
        'Malam itu, Raka tidak lagi menonton televisi sampai larut malam.',
        'Ia mematikan lampu kamar tepat pukul delapan malam.',
      ],
      [
        'Kringgg! Suara dering nyaring jam beker memecah keheningan fajar.',
        'Raka sempat ingin menarik selimut kembali, tetapi ia teringat janjinya.',
        'Raka segera melompat dari tempat tidur, merapikan bantal, lalu mengambil air wudhu untuk shalat shubuh.',
      ],
      [
        'Pagi itu, Raka selesai mandi, sarapan tenang bersama keluarga, dan sampai di sekolah lima belas menit sebelum bel masuk.',
        'Ia tidak lagi ngos-ngosan atau panik.',
        'Raka menyadari betapa menyenangkannya memulai hari dengan disiplin dan tepat waktu.',
      ],
    ],
    vocab: [
      ['beker', 'jam yang dilengkapi alarm berdering untuk membangunkan orang tidur', '⏰'],
      ['keheningan', 'keadaan sepi, tenang, dan tanpa suara bising', '🤫'],
      ['larut', 'waktu malam yang sudah sangat larut atau larut malam', '🌙'],
      ['disiplin', 'kepatuhan dan ketaatan terhadap aturan dan tata tertib waktu', '🎯'],
    ],
    notes: [
      {
        title: 'Disiplin Waktu Menghadirkan Ketenangan',
        explanation:
          'Tidur tepat waktu dan bangun pagi membuat badan bugar dan pikiran segar. Membiasakan diri disiplin sejak kecil menghindarkan kita dari rasa panik dan kegagalan.',
        examples: ['Tidur lebih awal agar tidak mengantuk di kelas.', 'Menyiapkan buku pelajaran malam hari sebelum tidur.'],
      },
    ],
    quiz: [
      ['Apa masalah yang sering dialami Raka sebelum memiliki jam beker?', ['Sering lupa makan siang', 'Sering terlambat bangun pagi dan tergesa-gesa', 'Sering tersesat di jalan'], 1, 'Raka sering bangun kesiangan dan panik ke sekolah.'],
      ['Pukul berapa alarm jam beker Raka diatur untuk berdering?', ['Pukul tujuh pagi', 'Pukul lima pagi saat fajar', 'Pukul sembilan pagi'], 1, 'Jam diatur berdering pukul lima pagi.'],
      ['Apa manfaat yang dirasakan Raka saat bangun lebih pagi?', ['Badan terasa lelah sekali', 'Bisa sarapan tenang dan sampai sekolah tepat waktu', 'Ketinggalan pelajaran pertama'], 1, 'Hari berjalan teratur, tenang, dan tidak panik terburu-buru.'],
    ],
  },
  {
    slug: 'cerita-kucing-kecil-di-bawah-hujan',
    theme: 'Cerita Pendek',
    emoji: '🌧️',
    title: 'Kucing Kecil di Bawah Hujan',
    minutes: 3,
    paragraphs: [
      [
        'Hujan deras disertai angin kencang mengguyur desa sejak sore hari.',
        'Tiara sedang duduk membaca buku cerita di ruang tamu yang hangat.',
        'Tiba-tiba, di antara suara gemercik air hujan, terdengar suara mengeong yang sangat pelan dan gemetar, "Meong... meong..."',
      ],
      [
        'Tiara membuka pintu depan dan melihat ke sudut teras rumah.',
        'Seekor anak kucing berbulu belang oranye meringkuk kedinginan di dekat pot bunga.',
        'Tubuhnya basah kuyup terkena percikan air talang genteng.',
      ],
      [
        'Tiara segera memanggil Ibu.',
        'Dengan hati-hati, Ibu mengangkat anak kucing itu dan Tiara membungkusnya dengan handuk kain kering yang lembut.',
        'Mereka mengusap bulunya hingga kering dan meletakkannya di dekat lampu sudut ruangan yang hangat.',
      ],
      [
        'Tiara menuangkan sedikit susu hangat ke piring kecil.',
        'Anak kucing itu menjilati susu dengan lahap lalu mendengkur nyaman sambil mengusapkan kepalanya ke tangan Tiara.',
        'Hati Tiara terasa sangat hangat karena telah menolong makhluk hidup yang membutuhkan perlindungan.',
      ],
    ],
    vocab: [
      ['mengguyur', 'menyiramkan air dalam jumlah banyak dan deras', '🌧️'],
      ['meringkuk', 'menekuk tubuh rapat-rapat karena dingin atau takut', '🐈'],
      ['basah kuyup', 'seluruh bagian pakaian atau tubuh basah oleh air', '💧'],
      ['mendengkur', 'mengeluarkan dengkuran halus tanda kucing merasa senang dan aman', '😻'],
    ],
    notes: [
      {
        title: 'Kasih Sayang Terhadap Hewan',
        explanation:
          'Hewan adalah makhluk ciptaan Tuhan yang juga merasakan lapar, sakit, dan kedinginan. Menyayangi dan memperlakukan hewan dengan lembut adalah tanda budi pekerti yang mulia.',
        examples: ['Memberi makan hewan piaraan dengan teratur.', 'Tidak melempar batu atau menyakiti kucing dan burung di jalan.'],
      },
    ],
    quiz: [
      ['Di mana Tiara menemukan anak kucing yang kedinginan?', ['Di dalam lemari dapur', 'Di sudut teras rumah dekat pot bunga saat hujan', 'Di atas atap genteng'], 1, 'Tiara melihat anak kucing meringkuk di teras rumah.'],
      ['Bagaimana cara Tiara dan Ibunya menolong anak kucing tersebut?', ['Membuangnya ke jalan raya', 'Mengeringkan bulunya dengan handuk dan memberi susu hangat', 'Menyiramnya dengan air dingin'], 1, 'Mereka mengeringkan bulu kucing dan memberinya susu hangat.'],
      ['Sikap apa yang ditunjukkan oleh Tiara?', ['Rasa takut pada hewan', 'Kasih sayang dan kepedulian terhadap sesama makhluk hidup', 'Kekasaran terhadap kucing liar'], 1, 'Tiara menunjukkan kasih sayang dan kebaikan hati yang tulus.'],
    ],
  },
  {
    slug: 'cerita-kerja-bakti-kampung',
    theme: 'Cerita Pendek',
    emoji: '🧹',
    title: 'Kerja Bakti Hari Minggu',
    minutes: 4,
    paragraphs: [
      [
        'Hari Minggu pagi, suasana Kampung Sukamaju terasa sangat meriah.',
        'Suara kentongan di pos ronda berbunyi menandakan waktu kerja bakti warga telah dimulai.',
        'Bapak-bapak, ibu-ibu, dan anak-anak berkumpul di lapangan membawa sapu lidi, cangkul, dan karung sampah.',
      ],
      [
        'Pak RW membagi tugas kepada seluruh warga.',
        'Bapak-bapak bertugas mengeruk lumpur dan sampah yang menyumbat selokan agar tidak banjir saat musim hujan.',
        'Ibu-ibu menyiapkan makanan ringan seperti pisang rebus, tahu goreng, dan teh manis hangat di teras warga.',
      ],
      [
        'Anak-anak seperti Fajar dan teman-temannya tidak mau ketinggalan.',
        'Mereka menyapu daun-daun kering yang berguguran di pinggir jalan dan mencabuti rumput liar di sekitar pos ronda.',
        'Semua orang bekerja sambil bercanda dan tertawa gembira.',
      ],
      [
        'Sebelum siang tiba, seluruh lingkungan kampung sudah tampak bersih, rapi, dan asri.',
        'Warga berkumpul menikmati hidangan teh hangat bersama-sama.',
        'Fajar merasa bangga melihat kampungnya indah berkat gotong royong seluruh warga.',
      ],
    ],
    vocab: [
      ['meriah', 'ramai dan menyenangkan suasananya', '🎉'],
      ['kentongan', 'alat pemukul dari bambu atau kayu berongga untuk tanda bahaya atau pengumuman', '🪵'],
      ['mengeruk', 'menggali atau mengangkat endapan lumpur dari dasar saluran', '⛏️'],
      ['gotong royong', 'bekerja bersama-sama demi kepentingan dan kesejahteraan bersama', '🤝'],
    ],
    notes: [
      {
        title: 'Kekuatan Gotong Royong dan Kebersamaan',
        explanation:
          'Pekerjaan yang berat dan melelahkan akan menjadi ringan dan cepat selesai jika dikerjakan bersama-sama dengan gembira. Kerukunan warga menciptakan lingkungan hidup yang nyaman.',
        examples: ['Ikut piket kebersihan kelas bersama teman-teman.', 'Membantu membersihkan rumah bersama seluruh anggota keluarga di akhir pekan.'],
      },
    ],
    quiz: [
      ['Kapan kerja bakti di Kampung Sukamaju diadakan?', ['Hari Minggu pagi', 'Hari Rabu malam', 'Saat tengah hari terik'], 0, 'Kerja bakti diadakan pada hari Minggu pagi.'],
      ['Apa tugas yang dilakukan oleh bapak-bapak saat kerja bakti?', ['Tidur di pos ronda', 'Mengeruk lumpur dan sampah di selokan', 'Bermain bola di lapangan'], 1, 'Bapak-bapak membersihkan selokan agar tidak banjir.'],
      ['Pelajaran berharga dari gotong royong adalah …', ['Pekerjaan berat menjadi ringan jika dikerjakan bersama', 'Lebih baik diam di dalam rumah', 'Hanya orang dewasa yang boleh bekerja'], 0, 'Gotong royong membuat pekerjaan berat menjadi ringan dan mempererat persaudaraan.'],
    ],
  },
];
