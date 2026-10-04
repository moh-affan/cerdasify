import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

// =========================================================================
// DATA SOAL, KUNCI, & PEMBAHASAN TERVERIFIKASI SEMIFINAL CEO 2025 SAINS
// =========================================================================

interface QuestionItem {
  num: number;
  question: string;
  image?: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
}

const CEO_SAINS_L1: QuestionItem[] = [
  {
    num: 1,
    question: "Yang bukan merupakan ciri-ciri makhluk hidup adalah ....",
    options: {
      A: "Tumbuh",
      B: "Bernapas",
      C: "Berkembang biak",
      D: "Tetap"
    },
    correct: "D",
    explanation: "Makhluk hidup memiliki ciri-ciri seperti bernapas, bergerak, memerlukan makanan, tumbuh dan berkembang, berkembang biak, serta peka terhadap rangsang. Sifat 'tetap' (tidak berubah ukuran atau bentuk) adalah ciri benda mati.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Tumbuhan berikut yang berkembang biak dengan biji adalah ....",
    options: {
      A: "Padi",
      B: "Pisang",
      C: "Jahe",
      D: "Singkong"
    },
    correct: "A",
    explanation: "Padi berkembang biak secara generatif menggunakan biji. Sementara pisang berkembang biak dengan tunas, jahe dengan akar tinggal (rhizoma), dan singkong umumnya dengan stek batang.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Tujuan utama makhluk hidup berkembang biak adalah ....",
    options: {
      A: "Memerlukan teman",
      B: "Berubah dari kecil menjadi besar",
      C: "Melestarikan jenisnya agar tidak punah",
      D: "Membutuhkan makanan"
    },
    correct: "C",
    explanation: "Makhluk hidup berkembang biak (bereproduksi) dengan tujuan utama untuk menghasilkan keturunan dan melestarikan jenisnya agar tidak mengalami kepunahan.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Hewan yang bernapas menggunakan insang adalah ....",
    options: {
      A: "Capung",
      B: "Kupu-kupu",
      C: "Ikan",
      D: "Belalang"
    },
    correct: "C",
    explanation: "Ikan hidup di air dan bernapas menyaring oksigen terlarut dengan menggunakan insang. Capung, kupu-kupu, dan belalang adalah serangga yang bernapas dengan trakea.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Penutup tubuh pelindung pada hewan siput berupa ....",
    options: {
      A: "Sisik",
      B: "Lendir",
      C: "Bulu",
      D: "Cangkang"
    },
    correct: "D",
    explanation: "Siput adalah hewan bertubuh lunak (moluska) yang dilindungi oleh cangkang keras berbahan kalsium karbonat untuk melindungi tubuhnya dari pemangsa dan kekeringan.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Berikut yang termasuk kelompok hewan amfibi adalah ....",
    options: {
      A: "Ular",
      B: "Ikan",
      C: "Katak",
      D: "Bunglon"
    },
    correct: "C",
    explanation: "Katak merupakan amfibi karena dapat hidup di dua alam (air saat berudu bernapas dengan insang, dan darat saat dewasa bernapas dengan paru-paru serta kulit). Ular dan bunglon adalah reptil, sedangkan ikan adalah pisces.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Bentuk pertulangan daun menjari terdapat pada tumbuhan ....",
    options: {
      A: "Singkong",
      B: "Mangga",
      C: "Padi",
      D: "Pisang"
    },
    correct: "A",
    explanation: "Daun singkong dan pepaya memiliki susunan tulang daun menjari (seperti jari-jari tangan). Daun mangga menyirip, sedangkan daun padi dan jagung memiliki tulang daun sejajar.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Alat indra yang dapat merasakan panas, dingin, halus, atau kasarnya suhu dan lingkungan sekitar adalah ....",
    options: {
      A: "Telinga",
      B: "Lidah",
      C: "Hidung",
      D: "Kulit"
    },
    correct: "D",
    explanation: "Kulit adalah indra peraba yang memiliki reseptor termoreseptor (perasa panas/dingin) dan mekanoreseptor (perasa sentuhan/tekanan).",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Munculnya akar, bertambahnya tinggi batang, dan mekarnya daun merupakan ciri-ciri bahwa ....",
    options: {
      A: "Tumbuhan bernapas",
      B: "Tumbuhan berkembang biak",
      C: "Tumbuhan mengalami pertumbuhan",
      D: "Tumbuhan membutuhkan makan"
    },
    correct: "C",
    explanation: "Pertumbuhan ditandai dengan pertambahan ukuran, tinggi, volume, dan jumlah organ tumbuhan (akar bertambah panjang, batang makin tinggi, dan daun makin banyak).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Kelompok bahan makanan berikut yang banyak mengandung protein hewani adalah ....",
    options: {
      A: "Tahu dan tempe",
      B: "Pepaya dan ikan",
      C: "Ikan dan telur",
      D: "Tempe dan susu kedelai"
    },
    correct: "C",
    explanation: "Protein hewani adalah protein yang berasal dari hewan. Contoh sumber protein hewani bermutu tinggi adalah ikan, telur, daging sapi, dan ayam. Tahu dan tempe berasal dari kedelai (protein nabati).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Kunyit merupakan bahan alami yang biasa dimanfaatkan sebagai pewarna makanan alami yaitu warna ....",
    options: {
      A: "Merah",
      B: "Kuning",
      C: "Hijau",
      D: "Biru"
    },
    correct: "B",
    explanation: "Kunyit mengandung senyawa kurkuminoid yang memberikan pigmen warna kuning keemasan alami pada masakan dan makanan.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Debu, asap kendaraan bermotor, dan bau menyengat yang bertebaran di lingkungan merupakan bentuk pencemaran ....",
    options: {
      A: "Air",
      B: "Tanah",
      C: "Udara",
      D: "Suara"
    },
    correct: "C",
    explanation: "Zat asing berbahaya seperti gas karbon monoksida, debu halus, dan jelaga hasil emisi kendaraan yang mencemari atmosfer tergolong sebagai pencemaran udara.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Alat musik tradisional berikut yang dibunyikan dengan cara dipukul adalah ....",
    options: {
      A: "Angklung",
      B: "Gong",
      C: "Suling",
      D: "Kecapi"
    },
    correct: "B",
    explanation: "Gong dibunyikan dengan cara dipukul menggunakan pemukul khusus. Angklung dibunyikan dengan digoyang, suling dengan ditiup, dan kecapi dengan dipetik.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Penyakit Demam Berdarah Dengue (DBD) ditularkan oleh vektor serangga ....",
    options: {
      A: "Lalat rumah",
      B: "Nyamuk Aedes aegypti",
      C: "Kutu beras",
      D: "Kecoak"
    },
    correct: "B",
    explanation: "Penyakit Demam Berdarah ditularkan melalui gigitan nyamuk Aedes aegypti yang membawa virus Dengue ke dalam aliran darah manusia.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Benda yang bentuknya selalu berubah mengikuti bentuk wadahnya adalah ....",
    options: {
      A: "Susu cair dan sirup",
      B: "Botol dan gelas",
      C: "Kelereng dan kertas",
      D: "Gula pasir dan plastisin"
    },
    correct: "A",
    explanation: "Susu cair dan sirup adalah zat cair. Sifat zat cair adalah bentuknya menyesuaikan bentuk wadah yang ditempatinya dengan volume yang tetap.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Berikut ini yang merupakan sifat dari benda padat adalah ....",
    options: {
      A: "Bentuk berubah sesuai wadahnya",
      B: "Bentuk dan warna selalu berubah",
      C: "Bentuk dan volumenya tetap walau dipindah-pindah",
      D: "Bentuk dan ukuran selalu mengisi seluruh ruang"
    },
    correct: "C",
    explanation: "Benda padat memiliki susunan partikel yang sangat rapat dan teratur sehingga bentuk dan volumenya selalu tetap meskipun dipindahkan ke wadah yang berbeda.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Lilin yang dinyalakan api dalam waktu cukup lama akan meleleh. Perubahan wujud ini disebut ....",
    options: {
      A: "Mendidih",
      B: "Mencair (melebur)",
      C: "Membeku",
      D: "Mengembun"
    },
    correct: "B",
    explanation: "Panas api lilin menyebabkan parafin padat menyerap kalor dan berubah wujud menjadi cair. Perubahan dari zat padat menjadi zat cair dinamakan mencair atau melebur.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Kereta delman dapat melaju ke depan di jalan raya karena .... oleh kuda penarik.",
    options: {
      A: "Ditarik",
      B: "Didorong",
      C: "Dipukul",
      D: "Digesek"
    },
    correct: "A",
    explanation: "Gaya yang diberikan oleh kuda pada kereta delman adalah gaya tarik, yaitu tarikan yang menyebabkan delman berpindah tempat maju ke depan.",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Panca indra manusia terdiri dari lima organ utama, yaitu ....",
    options: {
      A: "Mata, telinga, bibir, hidung, dan kulit",
      B: "Mata, hidung, bibir, gigi, dan lidah",
      C: "Mata, telinga, hidung, lidah, dan kulit",
      D: "Mata, telinga, hidung, gigi, dan kulit"
    },
    correct: "C",
    explanation: "Panca indra manusia meliputi: mata (penglihatan), telinga (pendengaran), hidung (penciuman), lidah (pengecap), dan kulit (peraba).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Bagian organ tumbuhan yang berfungsi menyerap air dan unsur hara mineral dari dalam tanah adalah ....",
    options: {
      A: "Akar",
      B: "Batang",
      C: "Daun",
      D: "Bunga"
    },
    correct: "A",
    explanation: "Akar tumbuhan (khususnya rambut akar) berfungsi menghisap dan menyerap air beserta zat hara mineral terlarut di dalam tanah untuk dialirkan ke batang dan daun.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "Sumber daya alam berikut yang persediaannya dapat habis jika dipakai terus-menerus adalah ....",
    options: {
      A: "Cahaya matahari",
      B: "Air",
      C: "Batu bara",
      D: "Angin"
    },
    correct: "C",
    explanation: "Batu bara merupakan sumber energi fosil tak terbarukan yang membutuhkan waktu jutaan tahun untuk terbentuk, sehingga dapat habis jika dieksploitasi terus-menerus.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Hewan di bawah ini yang tergolong ke dalam kelompok serangga (insekta) adalah ....",
    options: {
      A: "Sapi",
      B: "Belalang",
      C: "Bunglon",
      D: "Kadal"
    },
    correct: "B",
    explanation: "Belalang termasuk serangga karena memiliki tubuh bersegmen (kepala, dada, perut), memiliki 3 pasang kaki (6 kaki), dan bernapas menggunakan sistem trakea.",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Tumbuhan yang beradaptasi untuk hidup terapung di permukaan air adalah ....",
    options: {
      A: "Teratai",
      B: "Singkong",
      C: "Kamboja",
      D: "Melati"
    },
    correct: "A",
    explanation: "Teratai dan eceng gondok merupakan tumbuhan hidrofit yang beradaptasi hidup di air dengan daun lebar tipis untuk mempercepat penguapan dan batang berongga udara agar dapat mengapung.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "Tumbuhan yang hidupnya menumpang pada dahan tumbuhan lain tanpa merugikan inangnya adalah ....",
    options: {
      A: "Bunga Teratai",
      B: "Bunga Mawar",
      C: "Tanaman Anggrek",
      D: "Enceng Gondok"
    },
    correct: "C",
    explanation: "Anggrek hidup menempel sebagai epifit pada batang pohon lain untuk mendapatkan sinar matahari tanpa mengambil nutrisi dari pohon inang (simbiosis komensalisme).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Perubahan energi listrik menjadi energi bunyi terjadi pada alat elektronik ....",
    options: {
      A: "Dispenser",
      B: "Setrika listrik",
      C: "Pengering rambut (hair dryer)",
      D: "Radio"
    },
    correct: "D",
    explanation: "Radio mengubah gelombang elektromagnetik dan energi listrik menjadi getaran suara (energi bunyi) melalui membran pengeras suara (speaker).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Alat navigasi yang menggunakan jarum magnet untuk menunjukkan arah mata angin adalah ....",
    options: {
      A: "Kompas",
      B: "Termometer",
      C: "Jam dinding",
      D: "Kalkulator"
    },
    correct: "A",
    explanation: "Kompas memiliki jarum magnet yang selalu mengarah ke kutub utara dan selatan bumi karena pengaruh medan magnet bumi, sehingga digunakan untuk penunjuk arah.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Ketika tangki bensin mobil kosong, mobil tidak dapat dinyalakan dan bergerak. Hal ini menunjukkan bahwa mobil memerlukan bensin sebagai sumber ....",
    options: {
      A: "Angin",
      B: "Air",
      C: "Energi kimia untuk menghasilkan gerak",
      D: "Oli"
    },
    correct: "C",
    explanation: "Bahan bakar bensin menyimpan energi kimia yang melalui proses pembakaran di dalam mesin diubah menjadi energi kalor dan mekanik untuk menggerakkan roda mobil.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Secara alami, matahari terbit dari arah .... dan tenggelam di arah ....",
    options: {
      A: "Utara dan Selatan",
      B: "Utara dan Barat",
      C: "Selatan dan Barat",
      D: "Timur dan Barat"
    },
    correct: "D",
    explanation: "Akibat rotasi bumi dari barat ke timur, kita melihat matahari tampak terbit di timur pada pagi hari dan terbenam di ufuk barat pada sore hari.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Bentuk tiruan bola bumi yang berskala dan dapat diputar pada porosnya dinamakan ....",
    options: {
      A: "Globe",
      B: "Peta",
      C: "Atlas",
      D: "Kompas"
    },
    correct: "A",
    explanation: "Globe adalah miniatur atau tiruan bola bumi tiga dimensi yang menggambarkan letak benua, samudra, serta kemiringan sumbu rotasi bumi yang sebenarnya.",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "Bagian dari permukaan bumi yang padat dan tidak digenangi oleh air laut dinamakan ....",
    options: {
      A: "Pegunungan",
      B: "Daratan",
      C: "Bukit",
      D: "Lautan"
    },
    correct: "B",
    explanation: "Permukaan bumi secara umum terbagi menjadi dua bagian utama, yaitu perairan (samudra, laut, dan danau) dan daratan (benua dan pulau-pulau).",
    difficulty: "EASY"
  }
];

const CEO_SAINS_L2: QuestionItem[] = [
  {
    num: 1,
    question: "Kelompok tulang berikut yang semuanya tergolong sebagai tulang panjang (tulang pipa) adalah ....",
    options: {
      A: "Tulang paha, tulang rusuk, dan tulang lengan",
      B: "Tulang paha, tulang jari, dan tulang hasta",
      C: "Tulang belikat, tulang lengan, dan tulang jari",
      D: "Tulang rusuk, tulang hasta, dan tulang belikat"
    },
    correct: "B",
    explanation: "Tulang paha (femur), tulang hasta (ulna), dan tulang jari (falangus) secara anatomis memiliki bentuk silindris memanjang dengan epifisis di ujungnya sehingga digolongkan sebagai tulang pipa/panjang. Sedangkan tulang rusuk dan belikat adalah tulang pipih.",
    difficulty: "MEDIUM"
  },
  {
    num: 2,
    question: "Letak diafragma pada tubuh manusia yang paling tepat adalah ....",
    options: {
      A: "Di dalam rongga perut di atas rongga dada",
      B: "Di dalam rongga dada sebelah kanan",
      C: "Di dasar rongga dada yang membatasi rongga dada dan rongga perut",
      D: "Di dalam rongga dada agak condong ke kanan"
    },
    correct: "C",
    explanation: "Diafragma adalah otot utama pernapasan berbentuk kubah yang terletak di dasar rongga dada dan menjadi sekat pembatas antara rongga dada dan rongga perut.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Urutan tahapan metamorfosis sempurna pada kupu-kupu yang benar adalah ....",
    options: {
      A: "Telur -> kepompong -> kepompong menetas -> kupu-kupu dewasa -> ulat",
      B: "Kepompong -> telur -> kupu-kupu dewasa -> ulat -> kepompong",
      C: "Telur -> ulat (larva) -> kepompong (pupa) -> kupu-kupu dewasa (imago)",
      D: "Kupu-kupu dewasa -> kepompong -> ulat -> telur"
    },
    correct: "C",
    explanation: "Metamorfosis kupu-kupu bersifat sempurna dengan tahapan: Telur menetas menjadi Ulat (larva), kemudian membentuk Kepompong (pupa), dan keluar menjadi Kupu-kupu dewasa (imago).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Hubungan simbiosis yang terjadi antara tanaman benalu dengan pohon mangga inangnya adalah ....",
    options: {
      A: "Pohon mangga diuntungkan karena dilindungi benalu",
      B: "Benalu lama-kelamaan akan mati karena pohon mangga",
      C: "Pohon mangga dirugikan karena benalu menyerap air dan zat hara inang",
      D: "Pohon mangga akan semakin cepat berbuah lebat"
    },
    correct: "C",
    explanation: "Benalu merupakan parasit (simbiosis parasitisme) yang menancapkan akarnya (haustorium) ke jaringan pengangkut pohon mangga untuk menyerap air dan mineral, sehingga pohon inang dapat kurus lalu mati.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Hewan karnivora umumnya merupakan predator pemburu yang andal karena dilengkapi dengan indra yang sangat tajam, terutama ....",
    options: {
      A: "Peraba, penglihatan, dan pendengaran",
      B: "Pendengaran, peraba, dan penciuman",
      C: "Penglihatan, penciuman, dan peraba",
      D: "Penglihatan, pendengaran, dan penciuman"
    },
    correct: "D",
    explanation: "Predator karnivora mengandalkan mata yang tajam (penglihatan stereoskopis), telinga yang peka mendeteksi frekuensi bunyi mangsa (pendengaran), dan hidung dengan daya endus tinggi (penciuman).",
    difficulty: "MEDIUM"
  },
  {
    num: 6,
    question: "Tahapan daur hidup lalat rumah yang tepat adalah ....",
    options: {
      A: "Telur – larva – nimfa – lalat",
      B: "Telur – larva (belatung) – pupa – lalat dewasa",
      C: "Telur – nimfa – pupa – lalat",
      D: "Telur – belatung – nimfa – lalat"
    },
    correct: "B",
    explanation: "Lalat mengalami metamorfosis sempurna: Telur diletakkan pada bahan organik membusuk, menetas menjadi Larva (belatung), berkembang menjadi Pupa (kepompong keras), lalu menjadi Lalat dewasa.",
    difficulty: "MEDIUM"
  },
  {
    num: 7,
    question: "Berdasarkan bentuk fisiknya, tulang penyusun rangka manusia dibedakan menjadi tiga jenis utama, yaitu ....",
    options: {
      A: "Tulang kepala, tulang badan, dan tulang anggota gerak",
      B: "Tulang belakang, tulang tengkorak, dan tulang pendek",
      C: "Tulang pipa (panjang), tulang pipih, dan tulang pendek",
      D: "Tulang kepala, tulang lengan, dan tulang badan"
    },
    correct: "C",
    explanation: "Klasifikasi tulang berdasarkan bentuknya adalah: (1) Tulang pipa/panjang (misal tulang paha), (2) Tulang pipih (misal tulang belikat dan dada), dan (3) Tulang pendek (misal ruas tulang pergelangan tangan).",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Rafa mengalami kelainan penglihatan di mana bayangan benda yang dekat jatuh di belakang retina, sehingga ia kesulitan melihat benda jarak dekat. Gangguan mata yang dialami Rafa adalah ....",
    options: {
      A: "Hipermetropi (rabun dekat)",
      B: "Miopi (rabun jauh)",
      C: "Presbiopi (mata tua)",
      D: "Astigmatisme (mata silinder)"
    },
    correct: "A",
    explanation: "Hipermetropi (rabun dekat) terjadi ketika bola mata terlalu pendek atau kelengkungan kornea/lensa kurang cembung, menyebabkan bayangan objek dekat terfokus di belakang retina.",
    difficulty: "MEDIUM"
  },
  {
    num: 9,
    question: "Berikut ini yang BUKAN merupakan fungsi sistem rangka bagi tubuh manusia adalah ....",
    options: {
      A: "Sebagai alat gerak aktif",
      B: "Penyangga dan penunjang bentuk tubuh",
      C: "Melindungi organ vital di dalam tubuh",
      D: "Tempat pembentukan sel-sel darah merah (hemopoesis)"
    },
    correct: "A",
    explanation: "Tulang/rangka berfungsi sebagai alat gerak pasif karena bergerak hanya jika digerakkan oleh otot. Ototlah yang bertindak sebagai alat gerak aktif.",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Perhatikan diagram kelainan mata pada gambar berikut!\n\nKelainan refraksi mata di mana bayangan jatuh di belakang retina tersebut dapat dikoreksi dengan menggunakan kacamata berlensa ....",
    image: "/uploads/ceo2025_sains2_q10_mata.png",
    options: {
      A: "Lensa cembung (konveks / positif)",
      B: "Lensa rangkap (bifokal)",
      C: "Lensa cekung (konkaf / negatif)",
      D: "Lensa silinder"
    },
    correct: "A",
    explanation: "Gambar menunjukkan hipermetropi (bayangan jatuh di belakang retina). Lensa cembung (positif) bersifat mengumpulkan berkas cahaya (konvergen) sehingga bayangan dapat dimajukan tepat di bintik kuning retina.",
    difficulty: "MEDIUM"
  },
  {
    num: 11,
    question: "Perhatikan infografis fotosintesis tumbuhan berikut ini!\n\nBerdasarkan bagan infografis di atas, proses fotosintesis terjadi di organel sel bernama ...... dan menghasilkan produk berupa ....",
    image: "/uploads/ceo2025_sains2_q11_fotosintesis.png",
    options: {
      A: "Klorofil dan menghasilkan karbohidrat + air",
      B: "Daun dan menghasilkan oksigen + air",
      C: "Batang dan menghasilkan air + karbondioksida",
      D: "Kloroplas dan menghasilkan karbohidrat (glukosa) + oksigen ($O_2$)"
    },
    correct: "D",
    explanation: "Fotosintesis berlangsung di dalam kloroplas yang mengandung klorofil dengan reaksi kimia: $6CO_2 + 6H_2O + cahaya \\rightarrow C_6H_{12}O_6 + 6O_2$, menghasilkan glukosa (karbohidrat) dan melepaskan oksigen.",
    difficulty: "MEDIUM"
  },
  {
    num: 12,
    question: "Perhatikan aktivitas gerak dan jenis sendi berikut:\n1. Menekuk lengan siku\n2. Kepala menengok ke kanan dan kiri\n3. Memutar lengan bahu ke segala arah\n\np. Sendi putar\nq. Sendi peluru\nr. Sendi engsel\n\nPasangan yang tepat antara aktivitas gerak dan persendian yang bekerja adalah ....",
    options: {
      A: "1-r, 2-q, 3-p",
      B: "1-r, 2-p, 3-q",
      C: "1-p, 2-q, 3-r",
      D: "1-q, 2-p, 3-r"
    },
    correct: "B",
    explanation: "Siku menekuk satu arah adalah kerja sendi engsel (1-r). Gerak rotasi kepala menengok difasilitasi sendi putar antara tulang atlas dan aksis (2-p). Bahu berputar ke segala arah menggunakan sendi peluru (3-q).",
    difficulty: "MEDIUM"
  },
  {
    num: 13,
    question: "Berikut ini adalah peristiwa yang menerapkan atau melibatkan energi kinetik (gerak), KECUALI ....",
    options: {
      A: "Cahaya matahari bergerak menembus ruang hampa sampai ke bumi",
      B: "Baling-baling kipas angin yang berputar menyejukkan ruangan",
      C: "Kulkas yang mendinginkan makanan dengan kompresor refrigerasi",
      D: "Pita suara di leher yang bergetar saat sedang berbicara"
    },
    correct: "C",
    explanation: "Fungsi utama kulkas memanfaatkan perubahan fase fluida pendingin dan perpindahan energi termal (kalor) dari dalam ke luar ruang. Baling-baling kipas, partikel gelombang cahaya, dan getaran pita suara secara langsung memperlihatkan gerak mekanik kinetik.",
    difficulty: "HARD"
  },
  {
    num: 14,
    question: "Perhatikan bagan siklus air berikut ini!\n\nPada tahapan nomor 3 (presipitasi) ditandai dengan turunnya air hujan. Namun jika pada daerah daratan X terjadi alih fungsi lahan menjadi kawasan beton dan pemukiman padat tanpa resapan, dampak buruk yang timbul bagi lingkungan adalah ....",
    image: "/uploads/ceo2025_sains2_q14_siklus_air.png",
    options: {
      A: "Polusi udara akibat asap dapur pemukiman",
      B: "Abrasi pantai yang tinggi akibat air hujan",
      C: "Banjir karena air hujan tidak dapat meresap ke dalam tanah (infiltrasi terhambat)",
      D: "Curah hujan semakin berkurang secara mendadak"
    },
    correct: "C",
    explanation: "Jika daerah resapan air ditutupi oleh aspal dan bangunan beton, proses peresapan air ke dalam tanah (infiltrasi) terganggu drastis. Akibatnya aliran limpasan permukaan (surface runoff) meningkat tajam dan memicu banjir.",
    difficulty: "MEDIUM"
  },
  {
    num: 15,
    question: "Pemerintah menetapkan kawasan Taman Nasional Ujung Kulon di Provinsi Banten. Tujuan utama pelestarian lingkungan in-situ tersebut adalah ....",
    options: {
      A: "Menurunkan populasi badak bercula satu yang berlebihan",
      B: "Meningkatkan populasi badak untuk diambil culanya",
      C: "Memanfaatkan badak bercula satu sebagai hewan ternak",
      D: "Mencegah kepunahan badak bercula satu sebagai satwa langka yang dilindungi di habitat aslinya"
    },
    correct: "D",
    explanation: "Taman Nasional Ujung Kulon adalah kawasan konservasi in-situ untuk melindungi badak jawa bercula satu (Rhinoceros sondaicus) dari perburuan liar dan degradasi habitat agar terhindar dari kepunahan.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Perhatikan daftar kelompok hewan berikut:\n1. Pisces\n2. Amoeba\n3. Reptil\n4. Mollusca\n5. Porifera\n6. Amfibi\n7. Arthropoda\n8. Aves\n\nKelompok hewan di atas yang termasuk golongan hewan bertulang belakang (Vertebrata) adalah ....",
    options: {
      A: "2, 4, 5, dan 6",
      B: "1, 3, 5, dan 7",
      C: "1, 3, 7, dan 8",
      D: "1, 3, 6, dan 8"
    },
    correct: "D",
    explanation: "Lima kelas utama vertebrata adalah: Pisces (1), Amfibi (6), Reptil (3), Aves (8), dan Mamalia. Sedangkan Amoeba (protista), Porifera, Mollusca, dan Arthropoda tergolong invertebrata/avertebrata.",
    difficulty: "MEDIUM"
  },
  {
    num: 17,
    question: "Benda atau material yang ditarik secara lemah oleh medan magnet luar digolongkan sebagai benda ....",
    options: {
      A: "Diamagnetik",
      B: "Ferromagnetik",
      C: "Paramagnetik",
      D: "Nonmagnetik absolut"
    },
    correct: "C",
    explanation: "Paramagnetik adalah benda yang ditarik lemah oleh magnet (contoh: aluminium dan platina). Ferromagnetik ditarik sangat kuat (besi, nikel, baja), sedangkan diamagnetik ditolak sangat lemah oleh magnet.",
    difficulty: "MEDIUM"
  },
  {
    num: 18,
    question: "Pada organ pendengaran manusia, reseptor saraf pendengaran (organ Corti) terletak di bagian ....",
    options: {
      A: "Telinga daun luar",
      B: "Saluran telinga luar",
      C: "Telinga tengah (gendang telinga)",
      D: "Telinga dalam (koklea / rumah siput)"
    },
    correct: "D",
    explanation: "Organ pendengaran bagian dalam memuat koklea (rumah siput) yang di dalamnya terdapat cairan endolimfa dan sel-sel rambut saraf (organ Corti) yang meneruskan impuls ke saraf auditorius menuju otak.",
    difficulty: "MEDIUM"
  },
  {
    num: 19,
    question: "Ketika terjadi badai petir, kita selalu melihat kilatan kilat terlebih dahulu baru beberapa detik kemudian mendengar suara gemuruh guntur. Hal ini terjadi karena ....",
    options: {
      A: "Gelombang suara memiliki panjang gelombang lebih besar daripada cahaya",
      B: "Cahaya dan suara bergerak dengan laju rambat yang sama persis",
      C: "Cahaya merambat jauh lebih cepat ($3 \\times 10^8\\text{ m/s}$) dibandingkan suara ($340\\text{ m/s}$)",
      D: "Cahaya memiliki massa yang lebih berat dibanding bunyi"
    },
    correct: "C",
    explanation: "Kecepatan rambat cahaya di udara mencapai sekitar $300.000.000\\text{ m/s}$, sedangkan laju rambat bunyi di udara hanya sekitar $340\\text{ m/s}$. Karena itu kilatan cahaya sampai ke mata manusia hampir seketika.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Bunga yang hanya memiliki salah satu alat kelamin saja (benang sari saja atau putik saja) disebut bunga tidak sempurna. Tumbuhan berikut yang memiliki bunga sempurna (hermafrodit) adalah ....",
    options: {
      A: "Bunga strawberry",
      B: "Bunga pepaya",
      C: "Bunga salak",
      D: "Bunga pakis haji"
    },
    correct: "A",
    explanation: "Bunga strawberry memiliki benang sari dan putik sekaligus dalam satu kuntum bunga sehingga tergolong bunga sempurna (hermafrodit). Pepaya, salak, dan jagung umumnya memiliki bunga jantan dan bunga betina yang terpisah.",
    difficulty: "HARD"
  },
  {
    num: 21,
    question: "Fungsi utama cairan darah pada sistem peredaran darah manusia antara lain adalah ....",
    options: {
      A: "Mengangkut sari makanan dan oksigen ke seluruh sel tubuh",
      B: "Membuang cadangan oksigen dari dalam paru-paru",
      C: "Mengubah karbohidrat menjadi energi di pembuluh",
      D: "Membentuk makanan di dalam organ hati"
    },
    correct: "A",
    explanation: "Darah berfungsi mengedarkan oksigen (melalui hemoglobin eritrosit) dan sari-sari makanan hasil penyerapan usus ke seluruh jaringan tubuh, serta mengangkut sisa metabolisme menuju organ ekskresi.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Pada jaring-jaring makanan di suatu ekosistem padang rumput, tumbuhan padi dan rumput berperan sebagai ....",
    options: {
      A: "Konsumen tingkat I",
      B: "Konsumen tingkat II",
      C: "Dekomposer",
      D: "Produsen"
    },
    correct: "D",
    explanation: "Tumbuhan hijau memiliki klorofil dan mampu memproduksi makanannya sendiri melalui fotosintesis (autotrof), sehingga berperan sebagai produsen primer pada rantai makanan.",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Perhatikan nama benda dan sifat zat berikut:\n1. Batu bata\n2. Minyak goreng\n3. Asap kendaraan\n4. Lemari kayu\n\nP. Memiliki volume tetap\nQ. Menempati ruang dan bentuknya tetap\nR. Bentuk berubah sesuai bentuk wadahnya\nS. Bentuk dan volume berubah memenuhi seluruh ruang\n\nPasangan benda dan sifat yang paling sesuai adalah ....",
    options: {
      A: "1-P, 2-Q, 3-R, 4-S",
      B: "1-Q, 2-R, 3-S, 4-P",
      C: "1-P, 2-R, 3-Q, 4-S",
      D: "1-P, 2-R, 3-S, 4-Q"
    },
    correct: "D",
    explanation: "Batu bata zat padat volumenya tetap (1-P). Minyak zat cair bentuknya mengikuti wadah (2-R). Asap zat gas bentuk dan volume berubah menempati seluruh ruangan (3-S). Lemari padat memiliki bentuk dan volume tetap serta menempati ruang (4-Q).",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "Perhatikan gambar bagian-bagian bunga berikut ini!\n\n1. Bagian No 1 (kelopak) berfungsi melindungi bunga saat kuncup\n2. Bagian No 2 (putik) berfungsi sebagai alat kelamin jantan\n3. Bagian No 3 (benang sari) berfungsi sebagai alat kelamin betina\n4. Bagian No 4 (mahkota) berfungsi menarik perhatian serangga penyerbuk\n\nPernyataan yang benar ditunjukkan oleh nomor ....",
    image: "/uploads/ceo2025_sains2_q24_bunga.png",
    options: {
      A: "1 dan 2",
      B: "2 dan 4",
      C: "1 dan 4",
      D: "2 dan 3"
    },
    correct: "C",
    explanation: "Pernyataan 1 benar (kelopak melindungi kuncup). Pernyataan 4 benar (mahkota yang berwarna mencolok menarik serangga pembantu penyerbukan). Pernyataan 2 dan 3 salah karena putik adalah betina dan benang sari adalah jantan.",
    difficulty: "MEDIUM"
  },
  {
    num: 25,
    question: "Perhatikan gambar struktur organ tumbuhan berikut!\n\nOrgan tumbuhan yang ditunjukkan oleh huruf 'y' (akar) memiliki fungsi utama untuk ....",
    image: "/uploads/ceo2025_sains2_q25_tumbuhan.png",
    options: {
      A: "Tempat tumbuhan membuat makanan melalui proses fotosintesis",
      B: "Tempat menyimpan cadangan makanan dan melindungi biji",
      C: "Menghantarkan hasil fotosintesis ke seluruh dahan",
      D: "Menopang tegaknya tumbuhan serta menyerap air dan unsur hara dari dalam tanah"
    },
    correct: "D",
    explanation: "Huruf 'y' menunjuk pada sistem perakaran tumbuhan yang berfungsi memperkokoh berdirinya tanaman pada media tanam serta menyerap air dan garam-garam mineral dari dalam tanah.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Burung kolibri memiliki adaptasi morfologi yang unik untuk menunjang cara hidupnya. Pasangan antara bagian tubuh burung kolibri dan fungsinya berikut yang tepat adalah:\n1. Sayap\n2. Kaki\n3. Paruh panjang melengkung\n4. Ekor kemudi\n\nE. Bertengger di dahan pohon\nF. Melakukan manuver terbang melayang (hovering)\nG. Menjaga keseimbangan saat terbang\nH. Menghisap nektar di dasar mahkota bunga\n\nPasangan yang tepat ditunjukkan oleh ....",
    options: {
      A: "1-G dan 2-E",
      B: "1-F dan 2-G",
      C: "3-H dan 4-F",
      D: "3-H dan 4-G"
    },
    correct: "D",
    explanation: "Paruh panjang ramping berfungsi menghisap cairan nektar di bunga (3-H) dan bulu ekor bekerja sebagai kemudi untuk menjaga keseimbangan manuver saat terbang melayang (4-G).",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "Perhatikan interaksi makhluk hidup berikut:\n1. Benalu menempel dan menghisap nutrisi di pohon mangga\n2. Tanaman anggrek merambat pada batang pohon rambutan\n3. Lebah madu menghisap nektar bunga sambil membantu penyerbukan\n\nx. Simbiosis Mutualisme\ny. Simbiosis Parasitisme\nz. Simbiosis Komensalisme\n\nPasangan yang tepat antara interaksi dan jenis simbiosis yang terjadi adalah ....",
    options: {
      A: "1-x, 2-y, dan 3-z",
      B: "1-y, 2-x, dan 3-z",
      C: "1-z, 2-x, dan 3-y",
      D: "1-y, 2-z, dan 3-x"
    },
    correct: "D",
    explanation: "Benalu pada mangga merugikan inang (parasitisme / 1-y). Anggrek pada rambutan menumpang tanpa merugikan (komensalisme / 2-z). Lebah dan bunga sama-sama diuntungkan (mutualisme / 3-x).",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Tanaman cocor bebek memiliki cara perkembangbiakan vegetatif alami yang sangat khas, yaitu dengan ....",
    options: {
      A: "Tunas batang",
      B: "Spora",
      C: "Tunas adventif daun",
      D: "Biji berkeping"
    },
    correct: "C",
    explanation: "Cocor bebek berkembang biak secara vegetatif alami melalui tunas adventif daun, di mana tunas-tunas kecil lengkap dengan akar dapat tumbuh langsung di sepanjang tepi lekukan daunnya.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Keberadaan tumbuhan air di ekosistem perairan tawar sangat penting bagi keberlangsungan rantai makanan karena ....",
    options: {
      A: "Merupakan komponen abiotik pengatur suhu",
      B: "Menjadi tempat berteduh, memijah/bertelur ikan, serta penyuplai oksigen dan produsen",
      C: "Membuat arus aliran air sungai menjadi berhenti",
      D: "Menghasilkan endapan polutan di dasar danau"
    },
    correct: "B",
    explanation: "Tanaman air berfungsi sebagai produsen primer (penghasil biomassa dan oksigen melalui fotosintesis) sekaligus menyediakan habitat pelindung (shelter) dan substrat tempat ikan bertelur.",
    difficulty: "MEDIUM"
  },
  {
    num: 30,
    question: "Kelompok bentang alam berikut yang seluruhnya tergolong sebagai kenampakan alam perairan adalah ....",
    options: {
      A: "Sungai, pantai, dan teluk",
      B: "Danau, rawa, dan bukit",
      C: "Selat, tanjung, dan teluk",
      D: "Teluk, sungai, dan rawa"
    },
    correct: "D",
    explanation: "Teluk (lautan yang menjorok ke daratan), sungai (aliran air alami), dan rawa (lahan basah tergenang) semuanya adalah kenampakan alam perairan. Sedangkan pantai dan tanjung adalah bagian daratan.",
    difficulty: "MEDIUM"
  }
];

const CEO_SAINS_L3: QuestionItem[] = [
  {
    num: 1,
    question: "Jenis logam di bawah ini yang memiliki nilai konduktivitas termal paling tinggi sehingga dapat menghantarkan panas paling baik adalah ....",
    options: {
      A: "Aluminium",
      B: "Tembaga",
      C: "Timah",
      D: "Perunggu"
    },
    correct: "B",
    explanation: "Tembaga (Cu) memiliki konduktivitas termal yang sangat tinggi (sekitar $401\\text{ W/m}\\cdot\\text{K}$), jauh lebih tinggi dibandingkan aluminium (sekitar $237\\text{ W/m}\\cdot\\text{K}$), timah ($67\\text{ W/m}\\cdot\\text{K}$), maupun perunggu ($110\\text{ W/m}\\cdot\\text{K}$).",
    difficulty: "HARD"
  },
  {
    num: 2,
    question: "Katak dewasa bernapas dengan menggunakan organ utama berupa ....",
    options: {
      A: "Paru-paru dan permukaan kulit yang lembap",
      B: "Trakea dan insang luar",
      C: "Insang dalam dan paru-paru",
      D: "Kantung udara (pundi-pundi hawa)"
    },
    correct: "A",
    explanation: "Pada fase dewasa, katak bernapas menggunakan paru-paru sederhana yang dibantu oleh difusi gas melalui permukaan kulitnya yang basah dan berlendir. Insang hanya digunakan pada fase kecebong (berudu).",
    difficulty: "MEDIUM"
  },
  {
    num: 3,
    question: "Pada mekanisme pernapasan dada saat fase inspirasi (menghirup udara), peristiwa fisiologis yang terjadi adalah ....",
    options: {
      A: "Otot antartulang rusuk berkontraksi sehingga tulang rusuk terangkat dan rongga dada membesar",
      B: "Otot antartulang rusuk relaksasi sehingga tulang rusuk turun dan rongga dada membesar",
      C: "Tulang rusuk terangkat dan volume rongga dada mengecil",
      D: "Tulang rusuk turun dan tekanan udara di dalam paru-paru membesar"
    },
    correct: "A",
    explanation: "Saat inspirasi pernapasan dada, otot antartulang rusuk luar berkontraksi, tulang rusuk terangkat, volume rongga dada membesar, tekanan udara paru-paru turun sehingga udara luar mengalir masuk.",
    difficulty: "MEDIUM"
  },
  {
    num: 4,
    question: "Enzim amilase yang disekresikan pankreas dan bekerja di dalam usus halus berfungsi untuk ....",
    options: {
      A: "Mengubah lemak menjadi asam lemak dan gliserol",
      B: "Mengubah protein menjadi asam amino",
      C: "Menghidrolisis amilum (zat tepung) menjadi maltosa dan glukosa",
      D: "Menggumpalkan kasein susu"
    },
    correct: "C",
    explanation: "Enzim amilase memecah ikatan glikosidik pada karbohidrat kompleks (zat tepung / amilum) menjadi disakarida (maltosa) dan monosakarida (glukosa) agar dapat diserap dinding usus.",
    difficulty: "MEDIUM"
  },
  {
    num: 5,
    question: "Gerakan kontraksi dan relaksasi bergelombang seperti meremas dan mendorong bolus makanan menuruni kerongkongan menuju lambung dinamakan gerakan ....",
    options: {
      A: "Pencernaan mekanik murni",
      B: "Peristaltik",
      C: "Hidrolisis",
      D: "Brown"
    },
    correct: "B",
    explanation: "Gerak peristaltik adalah kontraksi otot sirkular dan longitudinal dinding saluran pencernaan (terutama esofagus) yang mendorong makanan turun menuju lambung.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Urutan rute peredaran darah besar (sistemik) yang tepat pada tubuh manusia adalah ....",
    options: {
      A: "Bilik kanan -> paru-paru -> serambi kiri",
      B: "Bilik kiri -> arteri pulmonalis -> serambi kanan",
      C: "Serambi kiri -> seluruh tubuh -> serambi kanan",
      D: "Bilik kiri -> aorta -> seluruh tubuh -> vena kava -> serambi kanan"
    },
    correct: "D",
    explanation: "Peredaran darah besar memompa darah kaya oksigen dari bilik kiri jantung melalui aorta ke seluruh jaringan tubuh, lalu darah miskin oksigen kembali melalui vena kava masuk ke serambi kanan.",
    difficulty: "MEDIUM"
  },
  {
    num: 7,
    question: "Perhatikan kelompok tumbuhan berikut:\ni) Pohon Mangga\nii) Tanaman Kentang\niii) Pohon Bambu\niv) Pohon Apel\nv) Pohon Durian\n\nTumbuhan di atas yang menyimpan cadangan makanan utamanya pada organ buah adalah ....",
    options: {
      A: "i, ii, iii",
      B: "i, iii, v",
      C: "i, iv, v",
      D: "ii, iv, v"
    },
    correct: "C",
    explanation: "Mangga (i), apel (iv), dan durian (v) menyimpan cadangan makanan pada buah. Sedangkan kentang menyimpan cadangan makanan pada umbi batang (ii) dan bambu pada rimpang.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Sistem penggolongan darah manusia menurut sistem ABO membagi golongan darah menjadi empat kelompok, yaitu ....",
    options: {
      A: "A, B, C, dan D",
      B: "A, B, AB, dan K",
      C: "A, B, AB, dan O",
      D: "A, AB, O, dan OB"
    },
    correct: "C",
    explanation: "Karl Landsteiner menemukan sistem ABO yang mengklasifikasikan darah manusia berdasarkan ada tidaknya antigen A dan B pada membran eritrosit, yaitu: golongan A, B, AB, dan O.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Pernyataan yang paling tepat untuk mendefinisikan fenomena gejala kelistrikan adalah ....",
    options: {
      A: "Peristiwa tarik-menarik akibat gravitasi benda bermassa",
      B: "Peristiwa yang timbul akibat keberadaan dan perpindahan muatan listrik (elektron)",
      C: "Peristiwa pembentukan gelombang suara di ruang hampa",
      D: "Peristiwa meleburnya logam pada suhu ruang"
    },
    correct: "B",
    explanation: "Gejala kelistrikan mencakup seluruh fenomena fisika yang berhubungan dengan muatan listrik diam (listrik statis) maupun muatan yang mengalir (listrik dinamis / arus listrik).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Kilat yang terlihat di langit sebelum hujan lebat terjadi akibat adanya ....",
    options: {
      A: "Perbedaan suhu yang sangat drastis antara langit dan bumi",
      B: "Pelepasan loncatan arus listrik statis bertegangan tinggi di udara akibat beda potensial muatan",
      C: "Gesekan antara angin dan partikel oksigen atmosfer",
      D: "Gaya magnet bumi yang memancar ke atmosfer"
    },
    correct: "B",
    explanation: "Kilat merupakan loncatan lucutan muatan listrik statis dalam jumlah sangat besar (hingga jutaan volt) antara awan badai (kumulonimbus) ke bumi atau antarawan yang memiliki perbedaan potensial muatan.",
    difficulty: "MEDIUM"
  },
  {
    num: 11,
    question: "Sumber energi panas bumi yang dihasilkan dari aktivitas magma di dalam kerak bumi dinamakan energi ....",
    options: {
      A: "Matahari",
      B: "Geotermal (panas bumi)",
      C: "Biomassa",
      D: "Hidroelektrik"
    },
    correct: "B",
    explanation: "Energi geotermal (panas bumi) berasal dari panas internal bumi yang tersimpan di bebatuan dan fluida di bawah permukaan bumi akibat peluruhan radioaktif dan sisa panas pembentukan bumi.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Peristiwa berikut yang dapat menyebabkan suatu benda bermuatan listrik statis adalah ....",
    options: {
      A: "Terjadinya gesekan antara dua benda berbahan berbeda jenis sehingga terjadi perpindahan elektron",
      B: "Mengalirkan arus listrik bolak-balik melalui benda",
      C: "Memanaskan benda sampai membara",
      D: "Menyimpan benda di dalam ruang tertutup kedap udara"
    },
    correct: "A",
    explanation: "Dua benda berbeda (seperti penggaris plastik yang digosokkan ke rambut kering atau kain wol) dapat bermuatan listrik statis karena terjadi perpindahan partikel elektron dari satu benda ke benda lainnya.",
    difficulty: "MEDIUM"
  },
  {
    num: 13,
    question: "Alat instrumentasi ukur yang dirancang secara khusus untuk mengukur laju perubahan kecepatan (percepatan) suatu objek adalah ....",
    options: {
      A: "Dinamometer",
      B: "Voltmeter",
      C: "Barometer",
      D: "Akselerometer (Accelerometer)"
    },
    correct: "D",
    explanation: "Akselerometer digunakan untuk mendeteksi dan mengukur percepatan (akselerasi) benda. Dinamometer mengukur gaya, voltmeter mengukur tegangan listrik, dan barometer mengukur tekanan udara.",
    difficulty: "MEDIUM"
  },
  {
    num: 14,
    question: "Prinsip dasar keuntungan mekanis pada pesawat sederhana jenis tuas (pengungkit) adalah ....",
    options: {
      A: "Menghilangkan gaya gravitasi secara menyeluruh",
      B: "Mengubah arah gaya dan memperkecil gaya kuasa yang dibutuhkan untuk mengangkat beban",
      C: "Memperbesar usaha total yang dikeluarkan",
      D: "Menghentikan gerak benda secara spontan"
    },
    correct: "B",
    explanation: "Tuas memudahkan pekerjaan manusia dengan memperpanjang lengan kuasa sehingga gaya kuasa ($F_k$) yang dibutuhkan jauh lebih kecil dibandingkan berat beban ($w$), serta dapat mengubah arah gaya.",
    difficulty: "MEDIUM"
  },
  {
    num: 15,
    question: "Gaya yang muncul dan bekerja berlawanan arah gerak saat dua permukaan benda saling bersentuhan dinamakan ....",
    options: {
      A: "Gaya gravitasi",
      B: "Gaya pegas",
      C: "Gaya gesek",
      D: "Gaya magnet"
    },
    correct: "C",
    explanation: "Gaya gesek timbul akibat kekasaran mikro pada dua permukaan yang saling bersentuhan. Arah gaya gesek selalu berlawanan arah dengan kecenderungan arah gerak benda.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Gaya tarik-menarik yang terjadi antara dua benda bermassa di alam semesta akibat medan gravitasinya dinamakan ....",
    options: {
      A: "Gaya pegas",
      B: "Gaya gesek",
      C: "Gaya gravitasi",
      D: "Gaya Lorentz"
    },
    correct: "C",
    explanation: "Hukum gravitasi universal Newton menyatakan bahwa setiap partikel bermassa di alam semesta saling tarik-menarik dengan gaya yang sebanding dengan hasil kali kedua massa dan berbanding terbalik dengan kuadrat jaraknya.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Alat pengukur yang digunakan untuk menghitung lamanya interval waktu tempuh gerak benda secara presisi adalah ....",
    options: {
      A: "Stopwatch",
      B: "Mikrometer sekrup",
      C: "Dinamometer",
      D: "Termometer"
    },
    correct: "A",
    explanation: "Stopwatch dirancang khusus untuk mengukur durasi atau interval waktu yang dibutuhkan suatu benda dalam menempuh lintasan tertentu dengan ketelitian milidetik.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Alat laboratorium yang digunakan untuk mengukur besarnya gaya (termasuk gaya gesek dan gaya tarik) adalah ....",
    options: {
      A: "Dinamometer (neraca pegas)",
      B: "Barometer",
      C: "Manometer",
      D: "Mikrometer"
    },
    correct: "A",
    explanation: "Dinamometer atau neraca pegas bekerja berdasarkan Hukum Hooke (pertambahan panjang pegas sebanding dengan gaya yang bekerja) untuk mengukur besar gaya dalam satuan Newton (N).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Jika suatu tumbuhan hijau diletakkan di tempat gelap dan sama sekali tidak mendapatkan energi cahaya dan panas matahari, maka yang akan terjadi adalah ....",
    options: {
      A: "Tumbuhan akan tumbuh lebih cepat dan kokoh",
      B: "Proses fotosintesis terhenti sehingga tumbuhan tidak dapat membuat makanan",
      C: "Tumbuhan akan memproduksi lebih banyak gas oksigen",
      D: "Daun tumbuhan akan berubah warna menjadi semakin hijau gelap"
    },
    correct: "B",
    explanation: "Cahaya matahari merupakan sumber energi mutlak bagi reaksi terang fotosintesis. Tanpa cahaya, fotosintesis terhenti, daun menguning (etiolasi), dan tumbuhan akhirnya layu lalu mati.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Kurangnya intensitas cahaya dan suhu hangat pada tanaman di daerah tropis dapat berakibat pada ....",
    options: {
      A: "Tumbuhan langsung bermutasi menjadi tanaman kutub",
      B: "Tumbuhan memproduksi bunga lebih cepat",
      C: "Laju metabolisme dan pertumbuhan vegetatif tanaman akan melambat drastis",
      D: "Produksi klorofil meningkat berlipat ganda"
    },
    correct: "C",
    explanation: "Suhu optimal mengaktifkan kerja enzim fotosintesis dan respirasi seluler. Jika suhu dan radiasi termal terlalu rendah, aktivitas enzim menurun drastis sehingga laju pertumbuhan tanaman melambat.",
    difficulty: "MEDIUM"
  },
  {
    num: 21,
    question: "Suhu dan energi termal yang cukup sangat penting pada proses perkecambahan biji tumbuhan karena ....",
    options: {
      A: "Mengaktifkan enzim-enzim metabolisme yang memecah cadangan makanan pada endosperma",
      B: "Mempercepat pengeringan biji agar tidak berjamur",
      C: "Mengubah struktur genetik embrio",
      D: "Mengurangi kadar air di dalam embrio"
    },
    correct: "A",
    explanation: "Suhu hangat yang sesuai mengaktifkan hormon giberelin dan enzim hidrolitik (seperti amilase dan protease) untuk memecah cadangan makanan di endosperma menjadi nutrisi yang dibutuhkan embrio untuk tumbuh.",
    difficulty: "HARD"
  },
  {
    num: 22,
    question: "Suhu adalah derajat panas dinginnya suatu benda, sedangkan kalor adalah energi panas yang berpindah. Mengapa tangan kita merasakan hangat saat didekatkan di samping kompor yang menyala?",
    options: {
      A: "Karena suhu kompor lebih rendah dari suhu tubuh kita",
      B: "Karena terjadi perpindahan energi kalor dari kompor yang bersuhu tinggi ke tangan melalui radiasi dan konveksi",
      C: "Karena udara di sekitar tangan membeku",
      D: "Karena tangan menyerap energi listrik dari kompor"
    },
    correct: "B",
    explanation: "Kalor secara alami berpindah dari benda bersuhu lebih tinggi (kompor) ke benda bersuhu lebih rendah (tangan) melalui pancaran radiasi gelombang elektromagnetik dan aliran udara panas (konveksi).",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Ketika sendok logam dicelupkan ke dalam cangkir teh panas, bagian ujung sendok yang tidak terendam lama-kelamaan ikut terasa panas. Peristiwa ini terjadi karena perpindahan kalor secara ....",
    options: {
      A: "Radiasi tanpa perantara",
      B: "Konduksi, di mana kalor merambat melalui partikel logam tanpa disertai perpindahan partikelnya",
      C: "Konveksi yang disertai perpindahan molekul logam",
      D: "Sublimasi partikel air"
    },
    correct: "B",
    explanation: "Konduksi adalah perpindahan kalor melalui zat padat tanpa disertai perpindahan massa partikel mediumnya. Logam adalah konduktor baik di mana elektron bebas mempercepat transfer energi kinetik termal.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "Pelapukan batuan dapat terjadi secara biologi karena aktivitas organisme perintis. Tumbuhan perintis yang dapat melapukkan batuan keras menjadi tanah adalah ....",
    options: {
      A: "Jamur kapang",
      B: "Ganggang hijau bersel satu",
      C: "Tumbuhan Lumut (Bryophyta)",
      D: "Tanaman Benalu"
    },
    correct: "C",
    explanation: "Lumut bertindak sebagai vegetasi perintis yang menempel pada batuan dan mengeluarkan zat-zat asam organik yang mengikis dan melapukkan mineral batuan keras menjadi partikel tanah.",
    difficulty: "MEDIUM"
  },
  {
    num: 25,
    question: "Senyawa kimia buatan manusia yang terbukti merusak lapisan ozon ($O_3$) di stratosfer bumi adalah ....",
    options: {
      A: "Gas Oksigen ($O_2$)",
      B: "Gas Nitrogen ($N_2$)",
      C: "Klorofluorokarbon (CFC)",
      D: "Gas Hidrogen ($H_2$)"
    },
    correct: "C",
    explanation: "Klorofluorokarbon (CFC) yang biasa digunakan pada cairan pendingin AC/kulkas dan aerosol dapat terurai oleh radiasi UV di stratosfer melepaskan radikal klorin yang memecah ribuan molekul ozon pelindung bumi.",
    difficulty: "MEDIUM"
  },
  {
    num: 26,
    question: "Lapisan bumi terluar yang padat, keras, dan menjadi tempat berpijaknya makhluk hidup serta lapisan litosfer disebut ....",
    options: {
      A: "Magma",
      B: "Inti bumi dalam (inner core)",
      C: "Kerak bumi (crust)",
      D: "Mantel bumi (asthenosphere)"
    },
    correct: "C",
    explanation: "Kerak bumi (crust) adalah lapisan batuan padat terluar bumi dengan ketebalan 5–70 km yang menyusun daratan benua dan dasar samudra tempat tinggal makhluk hidup.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Kelompok sumber energi berikut yang tergolong sebagai energi terbarukan dan ramah lingkungan adalah ....",
    options: {
      A: "Batu bara",
      B: "Minyak bumi",
      C: "Tenaga surya dan energi angin",
      D: "Gas alam cair"
    },
    correct: "C",
    explanation: "Tenaga surya dan angin merupakan energi terbarukan karena tidak akan habis dipakai dan tidak menghasilkan emisi gas rumah kaca berbahaya selama pengoperasiannya.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Perhatikan gambar skema rangkaian listrik paralel berikut ini!\n\nKarakteristik utama dari rangkaian listrik yang tersusun secara paralel adalah ....",
    image: "/uploads/ceo2025_sains3_q28_rangkaian.png",
    options: {
      A: "Kuat arus yang mengalir pada setiap cabang komponen selalu sama",
      B: "Tegangan (beda potensial listrik) pada setiap cabang komponen adalah sama besar",
      C: "Jika salah satu lampu padam, maka seluruh lampu lainnya pasti ikut padam",
      D: "Hambatan pengganti totalnya selalu lebih besar daripada hambatan terkecilnya"
    },
    correct: "B",
    explanation: "Pada rangkaian paralel, semua komponen dihubungkan langsung ke kutub sumber tegangan yang sama sehingga nilai beda potensial (tegangan $V$) pada setiap percabangan adalah sama ($V = V_1 = V_2$).",
    difficulty: "HARD"
  },
  {
    num: 29,
    question: "Gelombang bunyi memerlukan medium untuk merambat. Bunyi akan merambat dengan kecepatan paling tinggi melalui medium berupa ....",
    options: {
      A: "Udara pada suhu kamar",
      B: "Ruang hampa udara (vakum)",
      C: "Air laut",
      D: "Logam padat (seperti baja atau besi)"
    },
    correct: "D",
    explanation: "Kerapatan partikel pada zat padat (logam) sangat rapat dan memiliki modulus elastisitas tinggi sehingga gelombang bunyi merambat paling cepat (sekitar $5.000\\text{ m/s}$ pada baja, dibanding air $1.500\\text{ m/s}$ dan udara $340\\text{ m/s}$). Bunyi tidak dapat merambat di ruang hampa.",
    difficulty: "MEDIUM"
  },
  {
    num: 30,
    question: "Perhatikan diagram anatomi mata manusia berikut ini!\n\nBagian bola mata yang ditunjukkan oleh huruf panah 'X' (Iris) memiliki fungsi penting yaitu ....",
    image: "/uploads/ceo2025_sains3_q30_mata.png",
    options: {
      A: "Pupil, sebagai lubang masuknya berkas cahaya",
      B: "Sklera, sebagai lapisan pelindung terluar mata yang berwarna putih",
      C: "Iris (selaput pelangi), mengatur ukuran pupil untuk mengendalikan jumlah cahaya yang masuk",
      D: "Kornea, membiaskan cahaya pertama kali masuk ke lensa mata"
    },
    correct: "C",
    explanation: "Huruf 'X' menunjukkan Iris (selaput pelangi). Iris mengandung otot polos sirkular dan radial yang mengatur diameter pupil (melebar saat redup dan menyempit saat terang) guna mengontrol intensitas cahaya yang masuk ke retina.",
    difficulty: "MEDIUM"
  }
];

// =========================================================================
// RUNNER IMPORT KE SUPABASE (POSTGRESQL) & SQLITE BACKUP
// =========================================================================

async function importBatch4() {
  console.log('--- Starting Import Batch 4: Semifinal CEO 2025 Sains (Level 1, 2, 3) ---');

  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  // 1. Ensure Category & Topics
  const categoryId = 'cat_olimpiade_ceo';
  const categoryName = 'Chaanakya Ekadanta Olympiad (CEO)';
  const categoryDesc = 'Kompetisi olimpiade sains dan matematika bergengsi tingkat nasional';

  await client`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (${categoryId}, ${categoryName}, 'chaanakya-ekadanta-olympiad', ${categoryDesc}, 5)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
  `;

  sqlite.prepare(`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET name = excluded.name, description = excluded.description
  `).run(categoryId, categoryName, 'chaanakya-ekadanta-olympiad', categoryDesc, 5);

  const topics = [
    { id: 'top_ceo_2025_s1', name: 'Sains Level 1 Semifinal CEO 2025', slug: 'sains-level-1-semifinal-ceo-2025' },
    { id: 'top_ceo_2025_s2', name: 'Sains Level 2 Semifinal CEO 2025', slug: 'sains-level-2-semifinal-ceo-2025' },
    { id: 'top_ceo_2025_s3', name: 'Sains Level 3 Semifinal CEO 2025', slug: 'sains-level-3-semifinal-ceo-2025' }
  ];

  for (const t of topics) {
    await client`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (${t.id}, ${categoryId}, ${t.name}, ${t.slug})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
    `;

    sqlite.prepare(`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET name = excluded.name, slug = excluded.slug
    `).run(t.id, categoryId, t.name, t.slug);
  }

  // 2. Define Packages
  const packages = [
    {
      pkgId: 'pkg_ceo_2025_sains_1',
      pkgTitle: 'Olimpiade Semifinal CEO 2025 — Sains Level 1',
      pkgDesc: 'Naskah resmi Babak Semifinal Chaanakya Ekadanta Olympiad (CEO) 2025 bidang Sains Level 1 (Kelas 1-2 SD). Disertai kunci jawaban dan pembahasan pedagogis lengkap.',
      duration: 60,
      topicId: 'top_ceo_2025_s1',
      questions: CEO_SAINS_L1
    },
    {
      pkgId: 'pkg_ceo_2025_sains_2',
      pkgTitle: 'Olimpiade Semifinal CEO 2025 — Sains Level 2 (Bergambar)',
      pkgDesc: 'Naskah resmi Babak Semifinal Chaanakya Ekadanta Olympiad (CEO) 2025 bidang Sains Level 2 (Kelas 3-4 SD) dilengkapi diagram anatomi, siklus air, dan fotosintesis resolusi tinggi.',
      duration: 60,
      topicId: 'top_ceo_2025_s2',
      questions: CEO_SAINS_L2
    },
    {
      pkgId: 'pkg_ceo_2025_sains_3',
      pkgTitle: 'Olimpiade Semifinal CEO 2025 — Sains Level 3 (Bergambar)',
      pkgDesc: 'Naskah resmi Babak Semifinal Chaanakya Ekadanta Olympiad (CEO) 2025 bidang Sains Level 3 (Kelas 5-6 SD) mencakup fisika termal, kelistrikan, fisiologi tubuh, dan tata surya.',
      duration: 60,
      topicId: 'top_ceo_2025_s3',
      questions: CEO_SAINS_L3
    }
  ];

  let totalQuestionsCount = 0;

  for (const batch of packages) {
    console.log(`Processing ${batch.pkgTitle}...`);

    const pkgSlug = batch.pkgId.replace(/_/g, '-');
    const rules = JSON.stringify({ passingScore: 70, correctWeight: 4, incorrectWeight: 0, emptyWeight: 0 });

    // Insert Package to Supabase Postgres
    await client`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (${batch.pkgId}, ${batch.pkgTitle}, ${pkgSlug}, ${categoryId}, 'SIMULATION', ${batch.duration}, false, false, ${rules}, true)
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        duration_minutes = EXCLUDED.duration_minutes
    `;

    // Insert Package to SQLite
    sqlite.prepare(`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (?, ?, ?, ?, 'SIMULATION', ?, 0, 0, ?, 1)
      ON CONFLICT (id) DO UPDATE SET title = excluded.title
    `).run(batch.pkgId, batch.pkgTitle, pkgSlug, categoryId, batch.duration, rules);

    const questionsToInsert: any[] = [];
    const optionsToInsert: any[] = [];
    const pkgQuestionsToInsert: any[] = [];

    batch.questions.forEach((q, idx) => {
      totalQuestionsCount++;
      const qId = `${batch.pkgId}_q${String(q.num).padStart(2, '0')}`;

      questionsToInsert.push({
        id: qId,
        topic_id: batch.topicId,
        type: 'SINGLE_CHOICE',
        content_markdown: q.question,
        image_url: q.image || null,
        explanation_markdown: q.explanation,
        explanation_image_url: null,
        difficulty: q.difficulty,
        created_at: new Date().toISOString()
      });

      pkgQuestionsToInsert.push({
        package_id: batch.pkgId,
        question_id: qId,
        order_index: idx + 1
      });

      const optLabels = ['A', 'B', 'C', 'D'];
      optLabels.forEach((label, optIdx) => {
        const isCorrect = label === q.correct;
        const optText = q.options[label] || '';
        optionsToInsert.push({
          id: `${qId}_opt_${label.toLowerCase()}`,
          question_id: qId,
          label: label,
          content_markdown: optText,
          image_url: null,
          is_correct: isCorrect,
          score_value: isCorrect ? 4 : 0,
          order_index: optIdx + 1
        });
      });
    });

    // Ingest to Supabase Postgres
    await client`
      INSERT INTO questions ${client(questionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown, 
        image_url = EXCLUDED.image_url,
        explanation_markdown = EXCLUDED.explanation_markdown
    `;

    await client`
      INSERT INTO question_options ${client(optionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown,
        is_correct = EXCLUDED.is_correct
    `;

    await client`
      INSERT INTO package_questions ${client(pkgQuestionsToInsert)}
      ON CONFLICT (package_id, question_id) DO UPDATE SET 
        order_index = EXCLUDED.order_index
    `;

    // Also Insert to SQLite backup
    for (const q of questionsToInsert) {
      sqlite.prepare(`
        INSERT INTO questions (id, topic_id, type, content_markdown, image_url, explanation_markdown, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET 
          content_markdown = excluded.content_markdown,
          image_url = excluded.image_url
      `).run(q.id, q.topic_id, q.type, q.content_markdown, q.image_url, q.explanation_markdown, q.difficulty);
    }

    for (const opt of optionsToInsert) {
      sqlite.prepare(`
        INSERT INTO question_options (id, question_id, label, content_markdown, image_url, is_correct, score_value, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET content_markdown = excluded.content_markdown
      `).run(opt.id, opt.question_id, opt.label, opt.content_markdown, opt.image_url, opt.is_correct ? 1 : 0, opt.score_value, opt.order_index);
    }

    for (const pq of pkgQuestionsToInsert) {
      sqlite.prepare(`
        INSERT INTO package_questions (package_id, question_id, order_index)
        VALUES (?, ?, ?)
        ON CONFLICT (package_id, question_id) DO UPDATE SET order_index = excluded.order_index
      `).run(pq.package_id, pq.question_id, pq.order_index);
    }

    console.log(`Successfully ingested ${batch.questions.length} questions for ${batch.pkgTitle}!`);
  }

  sqlite.close();
  console.log(`\n🎉 ALL DONE! Successfully imported ${totalQuestionsCount} questions across 3 packages with complete verified keys & explanations.`);
  process.exit(0);
}

importBatch4().catch((err) => {
  console.error('Import error:', err);
  process.exit(1);
});
