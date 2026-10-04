import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

// =========================================================================
// DATA SOAL, KUNCI, & PEMBAHASAN TERVERIFIKASI PRISMA 2024 IPA (LEVEL 1, 2, 3)
// =========================================================================

interface QuestionItem {
  num: number;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
}

const PRISMA_IPA_L1: QuestionItem[] = [
  {
    num: 1,
    question: "Kelelawar disebut hewan nokturnal, artinya ....",
    options: {
      A: "hewan mamalia",
      B: "hewan yang memiliki kemampuan terbang di malam hari",
      C: "hewan yang memiliki penglihatan yang tajam",
      D: "hewan yang tidur di siang hari dan aktif di malam hari"
    },
    correct: "D",
    explanation: "Hewan nokturnal adalah hewan yang beristirahat atau tidur pada siang hari dan aktif beraktivitas (mencari makan) pada malam hari. Contohnya kelelawar, burung hantu, dan kukang.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Kemampuan yang dimiliki hewan untuk menyamarkan keberadaannya dengan mengubah warna kulitnya sesuai lingkungan sekitar disebut ....",
    options: {
      A: "Mimikri",
      B: "Hibernasi",
      C: "Autotomi",
      D: "Ekolokasi"
    },
    correct: "A",
    explanation: "Mimikri adalah kemampuan adaptasi tingkah laku hewan yang mengubah warna kulitnya menyerupai lingkungan sekitar guna mengelabui musuh atau mangsa (contoh: bunglon).",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Cicak memiliki kemampuan khusus yaitu dapat memutuskan ekornya secara tiba-tiba. Kemampuan ini membantu cicak untuk ....",
    options: {
      A: "menarik lawan jenis",
      B: "memancing mangsanya",
      C: "mencari mangsa",
      D: "menghindari ancaman musuh"
    },
    correct: "D",
    explanation: "Autotomi adalah pelepasan ekor secara spontan oleh cicak saat terancam agar pemangsa terkecoh oleh kibasan ekor yang terputus, sehingga cicak dapat melarikan diri.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Berikut ini contoh kelompok hewan yang berkembang biak dengan cara bertelur (ovipar) adalah ....",
    options: {
      A: "Ayam, itik, dan penyu",
      B: "Kucing, kambing, dan sapi",
      C: "Kera, lumba-lumba, dan paus",
      D: "Kelinci, tikus, dan marmut"
    },
    correct: "A",
    explanation: "Hewan ovipar berkembang biak dengan bertelur. Contoh hewan ovipar adalah bangsa unggas (ayam, itik, burung), reptil (penyu, buaya), dan ikan.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Teratai dan Eceng Gondok dapat bernafas dan bertahan hidup meskipun batang dan akarnya berada di dalam air. Hal ini disebabkan karena ..........",
    options: {
      A: "memiliki rongga-rongga udara pada batang",
      B: "memiliki daun lebar yang mengapung",
      C: "memiliki bunga yang tumbuh di atas permukaan air",
      D: "memiliki batang berair"
    },
    correct: "A",
    explanation: "Batang dan tangkai daun eceng gondok serta teratai memiliki struktur aerenkim (rongga-rongga udara) yang berfungsi menyalurkan oksigen dari udara bebas ke organ tanaman yang terendam air.",
    difficulty: "MEDIUM"
  },
  {
    num: 6,
    question: "Tumbuhan ini mengatupkan daunnya jika disentuh. Tumbuhan yang memiliki ciri tersebut adalah ....",
    options: {
      A: "Anggrek",
      B: "Tali putri",
      C: "Putri malu",
      D: "Mawar"
    },
    correct: "C",
    explanation: "Putri malu (*Mimosa pudica*) menunjukkan gerak seismonasti/tigmonasti, yaitu mengatupkan anak-anak daunnya saat menerima rangsangan sentuhan mekanis.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Kaktus tetap dapat melakukan fotosintesis meskipun daunnya berbentuk duri karena kaktus mempunyai ....",
    options: {
      A: "Nektar pada bunga",
      B: "Lapisan lilin pada akar",
      C: "Nutrisi dari serangga",
      D: "Klorofil pada batangnya yang hijau dan tebal"
    },
    correct: "D",
    explanation: "Daun kaktus termodifikasi menjadi duri untuk meminimalkan transpirasi (penguapan). Fungsi fotosintesis digantikan oleh batangnya yang tebal sukulen dan mengandung banyak klorofil.",
    difficulty: "MEDIUM"
  },
  {
    num: 8,
    question: "Tumbuhan sangat bermanfaat bagi kehidupan manusia, contohnya adalah tumbuhan Jahe dan Kunyit yang banyak dimanfaatkan manusia untuk bahan ….",
    options: {
      A: "Pakaian",
      B: "Obat-obatan dan jamu tradisional",
      C: "Bahan bangunan",
      D: "Pewarna kimia sintetis"
    },
    correct: "B",
    explanation: "Jahe dan kunyit merupakan tanaman obat keluarga (TOGA) / biofarmaka yang mengandung minyak atsiri dan kurkuminoid sebagai bahan obat tradisional dan jamu herbal.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Tumbuhan di bawah ini yang dimanfaatkan manusia karena menghasilkan bahan makanan pokok adalah ….",
    options: {
      A: "Rotan",
      B: "Jati",
      C: "Cemara",
      D: "Padi"
    },
    correct: "D",
    explanation: "Padi (*Oryza sativa*) menghasilkan butir gabah yang digiling menjadi beras, sumber karbohidrat dan makanan pokok masyarakat Indonesia.",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Tumbuhan bermanfaat untuk sistem pernafasan manusia, karena saat fotosintesis tumbuhan mampu menghasilkan ….",
    options: {
      A: "Buah-buahan",
      B: "Gas Nitrogen",
      C: "Gas Oksigen ($O_2$)",
      D: "Gas Karbondioksida"
    },
    correct: "C",
    explanation: "Reaksi fotosintesis: $6CO_2 + 6H_2O \\xrightarrow{cahaya, klorofil} C_6H_{12}O_6 + 6O_2$. Oksigen ($O_2$) dilepaskan ke udara bebas dan dihirup oleh manusia dan hewan untuk respirasi.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Pak Darori menebang pohon jati untuk dijadikan tiang di rumahnya. Hal ini menunjukkan bahwa tumbuhan dapat dimanfaatkan sebagai ….",
    options: {
      A: "Bahan hiasan",
      B: "Bahan bakar roket",
      C: "Bahan bangunan dan konstruksi",
      D: "Tempat berteduh"
    },
    correct: "C",
    explanation: "Kayu jati terkenal sangat kuat, kokoh, dan tahan terhadap serangan rayap maupun pelapukan, sehingga sangat baik dimanfaatkan sebagai bahan bangunan dan perabot.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Perkembangbiakan hewan dimana terjadi peleburan sel kelamin jantan (sperma) dan sel kelamin betina (ovum) disebut perkembangbiakan …",
    options: {
      A: "Generatif (seksual)",
      B: "Vegetatif (aseksual)",
      C: "Membelah diri",
      D: "Fragmentasi"
    },
    correct: "A",
    explanation: "Perkembangbiakan secara kawin/seksual yang melibatkan peleburan gamet jantan dan gamet betina dinamakan perkembangbiakan generatif.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Fungsi utama organ bunga pada tumbuhan berbiji adalah ...",
    options: {
      A: "Menyerap gas karbon dioksida",
      B: "Tempat terjadinya peristiwa penyerbukan dan pembuahan",
      C: "Menyerap air dan garam mineral tanah",
      D: "Menyimpan cadangan udara"
    },
    correct: "B",
    explanation: "Bunga adalah alat perkembangbiakan generatif tumbuhan yang memiliki benang sari (organ jantan) dan putik (organ betina) tempat berlangsungnya polinasi dan fertilisasi.",
    difficulty: "MEDIUM"
  },
  {
    num: 14,
    question: "Di bawah ini yang merupakan fungsi utama akar pada tumbuhan adalah ...",
    options: {
      A: "Mengolah makanan hasil fotosintesis",
      B: "Menghirup gas karbon dioksida",
      C: "Menyerap air dan zat hara dari tanah",
      D: "Menghasilkan biji bakal tanaman"
    },
    correct: "C",
    explanation: "Akar berfungsi menyerap air dan larutan garam hara dari tanah, menopang kekokohan batang, serta pada beberapa tanaman berfungsi sebagai tempat menyimpan cadangan makanan.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Bagian jaringan tumbuhan yang bertugas mengangkut zat makanan hasil fotosintesis dari daun ke seluruh tubuh tumbuhan adalah ...",
    options: {
      A: "Epidermis",
      B: "Xilem (pembuluh kayu)",
      C: "Floem (pembuluh tapis)",
      D: "Kambium"
    },
    correct: "C",
    explanation: "Floem mengangkut hasil fotosintesis (sukrosa dan asam amino) dari daun ke seluruh bagian tanaman. Xilem mengangkut air dan mineral dari akar ke daun.",
    difficulty: "MEDIUM"
  },
  {
    num: 16,
    question: "Hewan serangga seperti belalang dan jangkrik bernafas dengan menggunakan organ …. ",
    options: {
      A: "Insang",
      B: "Paru-paru buku",
      C: "Trakea",
      D: "Permukaan kulit"
    },
    correct: "C",
    explanation: "Sistem pernapasan serangga (insekta) menggunakan pembuluh trakea yang bercabang-cabang ke seluruh jaringan tubuh dengan lubang pernapasan bernama spirakel (stigma).",
    difficulty: "MEDIUM"
  },
  {
    num: 17,
    question: "Organ pencernaan manusia yang berfungsi utama menyerap sari-sari makanan ke dalam aliran darah adalah …",
    options: {
      A: "Usus halus",
      B: "Usus besar",
      C: "Lambung",
      D: "Kerongkongan"
    },
    correct: "A",
    explanation: "Penyerapan nutrisi (asam amino, glukosa, asam lemak, vitamin) terjadi pada dinding usus halus (terutama ileum dan jejunum) yang dipenuhi vili (jonjot usus).",
    difficulty: "MEDIUM"
  },
  {
    num: 18,
    question: "Hewan yang menghasilkan telur, namun embrio berkembang di dalam telur yang tetap berada di tubuh induknya sampai menetas dan keluar seperti melahirkan disebut hewan ….",
    options: {
      A: "Vivipar",
      B: "Ovipar",
      C: "Herbivora",
      D: "Ovovivipar"
    },
    correct: "D",
    explanation: "Hewan ovovivipar bertelur dan melahirkan. Embrio memperoleh nutrisi dari kuning telur di dalam tubuh induknya hingga menetas dan dilahirkan (contoh: hiu, beberapa jenis ular dan kadal).",
    difficulty: "MEDIUM"
  },
  {
    num: 19,
    question: "Pada saat seorang pemain sepak bola menendang bola ke gawang, terjadi perubahan energi ...",
    options: {
      A: "Energi kimia menjadi energi gravitasi",
      B: "Energi kimia menjadi energi gerak (kinetik)",
      C: "Energi panas menjadi energi bunyi",
      D: "Energi angin menjadi energi pegas"
    },
    correct: "B",
    explanation: "Energi kimia dari asupan makanan dalam otot tubuh dikonversikan menjadi energi kinetik (gerak) pada kaki dan bola yang melesat.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Bentuk sumber energi berikut yang termasuk energi alternatif ramah lingkungan dan terbarukan adalah...",
    options: {
      A: "Energi air dan energi batu bara",
      B: "Energi minyak bumi dan energi matahari",
      C: "Energi air dan energi matahari",
      D: "Energi gas alam dan energi batu bara"
    },
    correct: "C",
    explanation: "Energi air (hidroelektrik) dan energi matahari (solar) adalah sumber energi baru terbarukan (EBT) yang tidak akan habis dan tidak menghasilkan polusi gas rumah kaca berlebih.",
    difficulty: "MEDIUM"
  },
  {
    num: 21,
    question: "Ketapel dapat melontarkan batu kecil dengan kecepatan tinggi karena memanfaatkan sifat elastisitas...",
    options: {
      A: "Gaya pegas",
      B: "Gaya gesek",
      C: "Gaya listrik",
      D: "Gaya magnet"
    },
    correct: "A",
    explanation: "Karet ketapel yang ditarik mengalami pertambahan panjang dan menyimpan energi potensial pegas. Saat dilepaskan, gaya pegas melontarkan batu ke depan.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Pada siang hari, bumi mendapatkan pancaran energi cahaya dan panas terbesar yang berasal dari...",
    options: {
      A: "Bumi",
      B: "Bulan",
      C: "Matahari",
      D: "Komet"
    },
    correct: "C",
    explanation: "Matahari adalah bintang induk tata surya kita yang memancarkan energi foton cahaya dan radiasi termal secara terus-menerus.",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Matahari memancarkan dua bentuk energi utama yang dapat dirasakan langsung di permukaan bumi, yaitu energi ...",
    options: {
      A: "Cahaya dan listrik",
      B: "Panas dan listrik",
      C: "Cahaya dan panas",
      D: "Panas dan bunyi"
    },
    correct: "C",
    explanation: "Energi radiasi surya yang sampai ke bumi berwujud spektrum cahaya tampak dan radiasi gelombang termal (panas).",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "Pada kipas angin listrik yang sedang menyala, terjadi perubahan bentuk energi dari energi listrik menjadi energi ...",
    options: {
      A: "Gerak (kinetik)",
      B: "Kimia",
      C: "Cahaya",
      D: "Potensial gravitasi"
    },
    correct: "A",
    explanation: "Motor listrik pada kumparan kipas angin mengubah energi listrik menjadi gaya magnet yang memutar rotor (energi gerak baling-baling).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Proses perubahan wujud zat dari padat langsung menjadi gas tanpa melalui fase cair disebut...",
    options: {
      A: "Kondensasi (mengembun)",
      B: "Evaporasi (menguap)",
      C: "Sublimasi (menyublim)",
      D: "Mencair (melebur)"
    },
    correct: "C",
    explanation: "Menyublim (sublimasi) adalah perubahan fase padat ke gas, seperti pada kapur barus (*kamper*) dan es kering (*dry ice*).",
    difficulty: "MEDIUM"
  },
  {
    num: 26,
    question: "Banu membeli es krim di terik siang hari. Jika dibiarkan di tempat terbuka, es krim tersebut akan berubah wujud melalui proses....",
    options: {
      A: "Membeku",
      B: "Mencair (melebur)",
      C: "Menguap",
      D: "Menyublim"
    },
    correct: "B",
    explanation: "Es krim padat menyerap kalor dari udara luar bersuhu lebih tinggi sehingga mencair menjadi cairan.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Adonan agar-agar yang baru dimasak berwujud cair panas. Setelah didiamkan beberapa saat hingga dingin, agar-agar berubah menjadi padat kenyal karena peristiwa....",
    options: {
      A: "Membeku (pemadatan)",
      B: "Mencair",
      C: "Menguap",
      D: "Menyublim"
    },
    correct: "A",
    explanation: "Agar-agar melepaskan kalor ke udara sekitar saat suhunya mendingin, menyebabkan molekul gel merapat dan mengalami proses pembekuan.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Ibu memasak nasi goreng menggunakan mentega. Mentega yang diletakkan di wajan panas akan berubah wujud dari....",
    options: {
      A: "Padat menjadi cair",
      B: "Cair menjadi padat",
      C: "Cair menjadi gas",
      D: "Gas menjadi padat"
    },
    correct: "A",
    explanation: "Mentega padat yang terkena panas wajan menerima kalor dan meleleh menjadi minyak cair.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Saat kamu melakukan pengamatan di kolam dekat sekolah, kelompok berikut yang seluruhnya merupakan komponen biotik (makhluk hidup) adalah……",
    options: {
      A: "Ikan, air, tanaman, dan katak",
      B: "Air, batu, tanah, dan lumut",
      C: "Udara, air, tanah, dan cahaya",
      D: "Tanaman teratai, ikan, lumut, dan katak"
    },
    correct: "D",
    explanation: "Komponen biotik terdiri dari makhluk bernyawa (organisme hidup): tanaman teratai, ikan nila, lumut, dan katak. Air, batu, dan udara adalah komponen abiotik.",
    difficulty: "MEDIUM"
  },
  {
    num: 30,
    question: "Contoh komponen abiotik (benda tak hidup) yang mempengaruhi ekosistem lingkungan berikut ini adalah…",
    options: {
      A: "Karbondioksida, air, klorofil, dan ulat",
      B: "Tanah, air, rumput, dan cacing",
      C: "Bakteri pengurai, air, udara, dan cahaya",
      D: "Udara, suhu udara, tanah, dan kelembapan air"
    },
    correct: "D",
    explanation: "Komponen abiotik adalah faktor fisik dan kimiawi tak hidup dalam ekosistem: udara, suhu, intensitas sinar matahari, tanah, derajat keasaman (pH), dan air.",
    difficulty: "MEDIUM"
  }
];

const PRISMA_IPA_L2: QuestionItem[] = [
  {
    num: 1,
    question: "Berikut yang merupakan contoh ekosistem alami adalah …",
    options: {
      A: "Sungai dan hutan",
      B: "Akuarium hias",
      C: "Sawah tadah hujan",
      D: "Bendungan waduk"
    },
    correct: "A",
    explanation: "Ekosistem alami terbentuk secara spontan oleh alam tanpa campur tangan buatan manusia, contohnya sungai, danau alami, laut, dan hutan rimba. Akuarium, sawah, dan waduk adalah ekosistem buatan.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Salah satu sumber pencemaran tanah yang paling sulit terurai oleh bakteri tanah adalah …. ",
    options: {
      A: "Sampah daun dan sisa sayur",
      B: "Abu kebakaran kayu",
      C: "Kotoran hewan ternak",
      D: "Sampah kantong plastik sintetis"
    },
    correct: "D",
    explanation: "Plastik terbuat dari polimer sintetis non-biodegradable yang memerlukan ratusan tahun untuk terurai di dalam tanah, sehingga menurunkan kesuburan tanah.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Gerakan bola yang menggelinding di atas tanah atau lantai datar, semakin lama semakin lambat dan akhirnya berhenti dikarenakan adanya gaya …",
    options: {
      A: "Gaya gravitasi",
      B: "Gaya pegas",
      C: "Gaya magnet",
      D: "Gaya gesek"
    },
    correct: "D",
    explanation: "Gaya gesek (*frictional force*) muncul akibat gesekan antara permukaan bola dan tanah yang berarah melawan arah gerak bola, sehingga memperlambat kecepatan bola hingga berhenti.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Bentuk simbiosis mutualisme (kedua pihak saling menguntungkan) dapat terjadi antara pasangan organisme …",
    options: {
      A: "Anjing dan kucing",
      B: "Kerbau dan burung jalak",
      C: "Burung jalak dan harimau",
      D: "Tali putri dan tanaman beluntas"
    },
    correct: "B",
    explanation: "Burung jalak mendapat makanan berupa kutu di kulit kerbau, sedangkan kerbau merasa nyaman karena bebas dari rasa gatal akibat kutu parasit.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Perpindahan kalor tanpa memerlukan zat perantara (medium), seperti pancaran panas matahari hingga ke bumi, disebut …",
    options: {
      A: "Konduksi",
      B: "Konveksi",
      C: "Radiasi (pancaran)",
      D: "Kondensasi"
    },
    correct: "C",
    explanation: "Radiasi adalah perpindahan panas melalui gelombang elektromagnetik yang dapat merambat menembus ruang hampa udara (vakum).",
    difficulty: "MEDIUM"
  },
  {
    num: 6,
    question: "Keuntungan utama dari perbanyakan tanaman secara vegetatif buatan dengan cara mencangkok adalah …",
    options: {
      A: "Tanaman memiliki perakaran tunggang yang lebih kuat dari pohon asal",
      B: "Tanaman tidak memerlukan unsur hara dan tanah",
      C: "Tanaman tahan terhadap segala jenis hama penyakit",
      D: "Sifat tanaman anakan sama persis dengan induknya dan lebih cepat menghasilkan buah"
    },
    correct: "D",
    explanation: "Mencangkok mempertahankan sifat unggul tanaman induk (kualitas rasa buah, warna bunga) dan pohon hasil cangkok berbuah jauh lebih cepat dibanding menanam dari biji.",
    difficulty: "MEDIUM"
  },
  {
    num: 7,
    question: "Contoh tanaman yang bunga jantan dan bunga betinanya berada pada pohon terpisah (berumah dua / *dioecious*) adalah …",
    options: {
      A: "Jambu biji",
      B: "Nanas",
      C: "Salak",
      D: "Tomat"
    },
    correct: "C",
    explanation: "Pohon salak memiliki individu pohon jantan (penghasil serbuk sari) dan pohon betina (penghasil putik) terpisah, sehingga petani salak sering melakukan penyerbukan buatan dengan mengibaskan bunga jantan ke bunga betina.",
    difficulty: "HARD"
  },
  {
    num: 8,
    question: "Dalam tingkatan organisasi makhluk hidup dalam ekosistem, pengertian dari komunitas adalah …",
    options: {
      A: "Satu individu makhluk hidup tunggal",
      B: "Kumpulan individu sejenis yang menempati daerah tertentu",
      C: "Kumpulan berbagai populasi berbeda spesies yang saling berinteraksi di suatu wilayah pada waktu yang sama",
      D: "Seluruh ekosistem di planet bumi beserta lingkungannya"
    },
    correct: "C",
    explanation: "Urutan tingkatan ekologi: Individu $\\rightarrow$ Populasi (spesies sama) $\\rightarrow$ Komunitas (antarpopulasi berbeda) $\\rightarrow$ Ekosistem $\\rightarrow$ Bioma $\\rightarrow$ Biosfer.",
    difficulty: "MEDIUM"
  },
  {
    num: 9,
    question: "Komponen listrik pada rangkaian yang berfungsi untuk memutuskan dan menyambungkan aliran arus listrik secara manual adalah…",
    options: {
      A: "Sakelar (switch)",
      B: "Sekring (fuse)",
      C: "Baterai",
      D: "Kabel tembaga"
    },
    correct: "A",
    explanation: "Sakelar memutus kontak rangkaian (posisi *off* / rangkaian terbuka) dan menyambungkan kontak (posisi *on* / rangkaian tertutup).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Organ dalam tubuh manusia yang memiliki peran vital sebagai penawar racun (detoksifikasi) dan penghasil cairan empedu adalah …",
    options: {
      A: "Jantung",
      B: "Hati (hepar)",
      C: "Paru-paru",
      D: "Lambung"
    },
    correct: "B",
    explanation: "Hati merombak zat beracun, obat-obatan, dan amonia menjadi urea yang aman untuk dikeluarkan melalui ginjal, serta menyaring racun dari makanan yang diserap usus.",
    difficulty: "MEDIUM"
  },
  {
    num: 11,
    question: "Gelombang bunyi infrasonik adalah bunyi yang memiliki karakteristik frekuensi getaran …",
    options: {
      A: "Tepat 20 getaran per detik",
      B: "Kurang dari 20 Hz",
      C: "Antara 20 Hz sampai 20.000 Hz",
      D: "Lebih dari 20.000 Hz"
    },
    correct: "B",
    explanation: "Infrasonik: $< 20\\text{ Hz}$ (didengar gajah, jangkrik, anjing). Audiosonik: $20 - 20.000\\text{ Hz}$ (rentang pendengaran manusia). Ultrasonik: $> 20.000\\text{ Hz}$ (kelelawar, lumba-lumba).",
    difficulty: "MEDIUM"
  },
  {
    num: 12,
    question: "Seekor anjing atau kucing sering kali tidur dengan menggulungkan badannya menyerupai lingkaran ketika udara dingin. Tujuannya adalah untuk …",
    options: {
      A: "Menjaga suhu tubuh tetap hangat dengan memperkecil pelepasan kalor",
      B: "Memudahkan mendengarkan musuh dari kejauhan",
      C: "Mencegah lapar saat terbangun",
      D: "Menyerap oksigen lebih banyak"
    },
    correct: "A",
    explanation: "Menggulung tubuh memperkecil luas permukaan tubuh yang bersentuhan dengan udara dingin lingkungan, sehingga laju pelepasan kalor tubuh ke lingkungan berkurang drastis.",
    difficulty: "MEDIUM"
  },
  {
    num: 13,
    question: "Pada mekanisme pendengaran manusia, sebelum getaran bunyi diteruskan ke rumah siput (koklea), getaran terlebih dahulu menggetarkan …",
    options: {
      A: "Saluran Eustachius",
      B: "Saraf auditori",
      C: "Daun telinga luar",
      D: "Membran timpani (gendang telinga) dan tulang martil, landasan, sanggurdi"
    },
    correct: "D",
    explanation: "Gelombang bunyi ditangkap daun telinga $\\rightarrow$ liang telinga $\\rightarrow$ menggetarkan membran timpani $\\rightarrow$ tulang pendengaran (martil, landasan, sanggurdi) $\\rightarrow$ tingkap oval $\\rightarrow$ rumah siput (koklea).",
    difficulty: "MEDIUM"
  },
  {
    num: 14,
    question: "Urutan daur hidup (metamorfosis sempurna) pada nyamuk yang benar adalah …",
    options: {
      A: "Nyamuk dewasa $\\rightarrow$ telur $\\rightarrow$ jentik $\\rightarrow$ pupa $\\rightarrow$ nyamuk muda",
      B: "Nyamuk muda $\\rightarrow$ nyamuk dewasa $\\rightarrow$ telur $\\rightarrow$ jentik $\\rightarrow$ pupa",
      C: "Telur $\\rightarrow$ pupa $\\rightarrow$ jentik $\\rightarrow$ nyamuk dewasa",
      D: "Telur $\\rightarrow$ jentik (larva) $\\rightarrow$ pupa (kepompong) $\\rightarrow$ nyamuk dewasa (imago)"
    },
    correct: "D",
    explanation: "Nyamuk mengalami metamorfosis holometabola: Telur menetas menjadi jentik (larva air), berkembang menjadi pupa berkepompong, lalu keluar menjadi nyamuk dewasa bersayap.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Bentuk hubungan simbiosis yang terjadi antara bunga Rafflesia arnoldii dengan tumbuhan inang merambatnya (*Tetrastigma*) adalah …",
    options: {
      A: "Komensalisme",
      B: "Netralisme",
      C: "Parasitisme",
      D: "Mutualisme"
    },
    correct: "C",
    explanation: "Bunga Rafflesia adalah tumbuhan parasit obligat tanpa daun dan akar sejati yang menyerap seluruh sari makanan dan air dari jaringan pembuluh tumbuhan inang sehingga merugikan inang.",
    difficulty: "MEDIUM"
  },
  {
    num: 16,
    question: "Beban bandul diikat tali pada atap dan ditarik menyamping ke titik A lalu dilepaskan. Satu getaran penuh pada ayunan tersebut didefinisikan sebagai gerak bolak-balik beban pada lintasan ….",
    options: {
      A: "A - O - B",
      B: "A - O - B - O",
      C: "O - B - O - A",
      D: "A - O - B - O - A"
    },
    correct: "D",
    explanation: "Satu getaran harmonis lengkap adalah gerak dari titik awal kembali lagi ke titik awal tersebut: dari A menuju titik setimbang O, titik terjauh B, kembali ke O, dan berakhir di A.",
    difficulty: "MEDIUM"
  },
  {
    num: 17,
    question: "Berikut ini yang merupakan peristiwa perubahan wujud zat yang memerlukan (menyerap) kalor adalah …",
    options: {
      A: "Uap air di pagi hari mengembun menjadi tetesan air",
      B: "Mentega cair membeku di dalam kulkas",
      C: "Air di freezer membeku menjadi es batu",
      D: "Air yang dipanaskan di panci mendidih menjadi uap air"
    },
    correct: "D",
    explanation: "Perubahan wujud yang menyerap kalor adalah mencair, menguap, dan menyublim (padat ke gas). Mengembun dan membeku adalah proses melepaskan kalor.",
    difficulty: "MEDIUM"
  },
  {
    num: 18,
    question: "Sabuk asteroid utama (*asteroid belt*) dalam tata surya terletak beredar mengitari matahari di antara lintasan orbit planet …",
    options: {
      A: "Mars dan Venus",
      B: "Venus dan Bumi",
      C: "Merkurius dan Venus",
      D: "Mars dan Yupiter"
    },
    correct: "D",
    explanation: "Sabuk asteroid memisahkan kelompok planet dalam (Merkurius, Venus, Bumi, Mars) dengan kelompok planet luar (Yupiter, Saturnus, Uranus, Neptunus).",
    difficulty: "MEDIUM"
  },
  {
    num: 19,
    question: "Tumbuhan yang pada satu bunganya hanya memiliki benang sari saja atau hanya memiliki putik saja dinamakan ….",
    options: {
      A: "Bunga lengkap",
      B: "Bunga hermafrodit",
      C: "Bunga tidak sempurna",
      D: "Bunga sempurna"
    },
    correct: "C",
    explanation: "Bunga sempurna memiliki kedua alat kelamin (benang sari dan putik). Bunga tidak sempurna hanya memiliki salah satu alat kelamin saja (bunga jantan atau bunga betina).",
    difficulty: "MEDIUM"
  },
  {
    num: 20,
    question: "Kelompok tulang di tubuh manusia berikut yang seluruhnya tergolong sebagai tulang pipa (tulang panjang berongga) adalah ….",
    options: {
      A: "Tulang belikat dan tulang rusuk",
      B: "Tulang dada dan tulang tengkorak",
      C: "Tulang panggul dan tempurung lutut",
      D: "Tulang betis, tulang hasta, dan tulang paha"
    },
    correct: "D",
    explanation: "Tulang pipa berbentuk silinder panjang dengan bagian tengah berongga berisi sumsum tulang, contohnya tulang paha (*femur*), betis (*fibula*), kering (*tibia*), hasta (*ulna*), dan pengumpil (*radius*).",
    difficulty: "MEDIUM"
  },
  {
    num: 21,
    question: "Peralatan perkakas seperti mata kapak, pahat, pisau, dan sekrup ulir bekerja dengan menggunakan prinsip pesawat sederhana jenis ...",
    options: {
      A: "Roda berporos",
      B: "Katrol bebas",
      C: "Tuas jenis ketiga",
      D: "Bidang miring"
    },
    correct: "D",
    explanation: "Kapak dan baji adalah dua bidang miring yang digabungkan, sedangkan ulir sekrup adalah bidang miring yang dililitkan mengitari sebuah silinder poros.",
    difficulty: "MEDIUM"
  },
  {
    num: 22,
    question: "Besarnya gaya dorong atau tarikan yang diberikan oleh tangan manusia pada sebuah tuas pengungkit disebut dengan ...",
    options: {
      A: "Gaya Beban",
      B: "Gaya Kuasa ($F$)",
      C: "Titik Tumpu",
      D: "Lengan Beban"
    },
    correct: "B",
    explanation: "Pada tuas, gaya yang kita kerjakan disebut Kuasa ($F$), benda yang digerakkan disebut Beban ($W$), dan titik penyangga disebut Titik Tumpu ($T$).",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Alat pembuka tutup botol kaca minuman merupakan contoh aplikasi pengungkit (tuas) golongan ...",
    options: {
      A: "Tuas jenis kedua (Beban berada di antara Titik Tumpu dan Kuasa)",
      B: "Tuas jenis pertama (Titik Tumpu di tengah)",
      C: "Tuas jenis ketiga (Kuasa di tengah)",
      D: "Katrol majemuk"
    },
    correct: "A",
    explanation: "Pada pembuka tutup botol: ujung penahan di bibir tutup botol adalah Titik Tumpu, cengkeraman tutup botol yang dibuka adalah Beban di tengah, dan gagang yang diangkat tangan adalah Kuasa.",
    difficulty: "HARD"
  },
  {
    num: 24,
    question: "Dalam konsep fisika ($W = F \\cdot s \\cdot \\cos\\theta$), usaha bernilai negatif ketika arah gaya yang bekerja berlawanan dengan arah gerak perpindahan benda, contohnya saat benda..",
    options: {
      A: "Meluncur turun ke bawah bidang miring",
      B: "Didorong searah laju ke depan",
      C: "Dilempar lurus ke atas (usaha oleh gaya gravitasi bumi)",
      D: "Ditarik kuda searah jalan lurus"
    },
    correct: "C",
    explanation: "Saat benda bergerak naik ke atas, arah perpindahannya ke atas ($+s$), namun gaya gravitasi bumi menariknya ke bawah ($-F$). Karena berlawanan arah ($180^\\circ$), usaha gravitasi bernilai negatif ($W < 0$).",
    difficulty: "HOTS"
  },
  {
    num: 25,
    question: "Sebuah paku besi dililiti kawat tembaga berisolasi kemudian kedua ujung kawat dihubungkan ke kutub baterai, sehingga paku dapat menarik serbuk besi. Metode pembuatan magnet ini disebut...",
    options: {
      A: "Induksi",
      B: "Elektromagnetik (arus listrik)",
      C: "Gosokan satu arah",
      D: "Deklinasi"
    },
    correct: "B",
    explanation: "Arus listrik searah (DC) yang mengalir melalui kumparan solenoide menimbulkan medan magnet di inti besi, yang dinamakan elektromagnet.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Sebatang besi netral didekatkan (tanpa menyentuh) ke kutub magnet kuat, sehingga ujung besi tersebut terimbas menjadi magnet sementara. Metode ini disebut pembuatan magnet secara...",
    options: {
      A: "Induksi magnetik",
      B: "Konveksi",
      C: "Elektromagnet",
      D: "Demagnetisasi"
    },
    correct: "A",
    explanation: "Induksi magnetik adalah proses penataan magnet-magnet elementer pada bahan feromagnetik karena pengaruh medan magnet dari magnet tetap yang berada di dekatnya.",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "Pada rangkaian listrik campuran di rumah, jika sakelar pada jalur cabang lampu ruang makan dimatikan, lampu di ruang tamu tetap menyala. Hal ini membuktikan bahwa lampu dipasang dalam rangkaian ...",
    options: {
      A: "Rangkaian seri",
      B: "Rangkaian terbuka satu arah",
      C: "Rangkaian paralel",
      D: "Rangkaian arus bolak balik"
    },
    correct: "C",
    explanation: "Rangkaian paralel memiliki percabangan arus independen pada setiap beban, sehingga jika salah satu cabang diputus, arus pada cabang lain tetap mengalir normal.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Berikut ini yang BUKAN merupakan metode yang tepat untuk membuat magnet adalah...",
    options: {
      A: "Menggosokkan besi dengan magnet tetap secara searah",
      B: "Mengalirkan arus listrik bolak-balik (AC) bertegangan tinggi",
      C: "Mendekatkan bahan feromagnetik ke magnet permanen (induksi)",
      D: "Melilitkan kawat berarus listrik searah (DC)"
    },
    correct: "B",
    explanation: "Mengalirkan arus bolak-balik (AC) atau memanaskan/memukul magnet justru merupakan cara menghilangkan (merusak) sifat kemagnetan, bukan membuatnya.",
    difficulty: "MEDIUM"
  },
  {
    num: 29,
    question: "Ciri khas yang membedakan rangkaian listrik paralel dari rangkaian listrik seri adalah ....",
    options: {
      A: "Arus listrik mengalir tanpa percabangan",
      B: "Jika satu lampu padam, maka seluruh lampu lainnya pasti ikut padam",
      C: "Terdapat percabangan kabel sehingga beda potensial (tegangan) pada setiap cabang sama besar",
      D: "Hanya memerlukan satu kabel tunggal"
    },
    correct: "C",
    explanation: "Karakteristik rangkaian paralel: memiliki titik percabangan, tegangan ($V$) pada tiap cabang bernilai sama, dan arus listrik terbagi ($I_{total} = I_1 + I_2 + \\dots$).",
    difficulty: "MEDIUM"
  },
  {
    num: 30,
    question: "Komponen lampu dan baterai pada rangkaian seri dipasang secara ....",
    options: {
      A: "Berderet lurus bersambungan dalam satu lintasan tanpa cabang",
      B: "Menyilang bertingkat",
      C: "Sejajar bercabang ganda",
      D: "Melingkar diagonal"
    },
    correct: "A",
    explanation: "Rangkaian seri adalah rangkaian komponen listrik yang disusun secara berurutan atau berderet ujung ke ujung dalam satu jalur penghantar tunggal.",
    difficulty: "EASY"
  }
];

const PRISMA_IPA_L3: QuestionItem[] = [
  {
    num: 1,
    question: "Pada jaringan epidermis bagian luar daun tumbuhan terdapat lapisan lilin kedap air yang berfungsi mengurangi penguapan air secara berlebih, yang disebut….",
    options: {
      A: "Kutikula",
      B: "Xilem",
      C: "Floem",
      D: "Stomata"
    },
    correct: "A",
    explanation: "Lapisan kutikula tersusun atas zat kutin (lilin) hidrofilik yang melindungi daun dari kekeringan akibat kehilangan air lewat evaporasi.",
    difficulty: "MEDIUM"
  },
  {
    num: 2,
    question: "Jaringan parenkim pada mesofil daun yang memiliki kepadatan kloroplas tertinggi dan merupakan lokasi utama berlangsungnya fotosintesis adalah…",
    options: {
      A: "Jaringan palisade (jaringan tiang)",
      B: "Jaringan meristem apikal",
      C: "Jaringan epidermis bawah",
      D: "Jaringan kolenkim"
    },
    correct: "A",
    explanation: "Jaringan palisade berbentuk silinder tegak rapat dan mengandung banyak klorofil sehingga paling efektif menyerap energi cahaya untuk fotosintesis.",
    difficulty: "MEDIUM"
  },
  {
    num: 3,
    question: "Organel mikroskopis berupa pori celah pada permukaan daun yang diapit oleh sepasang sel penjaga dan berperan penting dalam proses pertukaran gas ($CO_2, O_2$) dan pengeluaran uap air (transpirasi) adalah ….",
    options: {
      A: "Ruang antarsel",
      B: "Stomata (mulut daun)",
      C: "Jaringan spons karang",
      D: "Mitokondria"
    },
    correct: "B",
    explanation: "Stomata membuka saat sel penjaga menyerap air dan menutup saat kekurangan air guna mengatur laju transpirasi dan respirasi tanaman.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Proses biokimia pembentukan senyawa organik kompleks (glukosa) dari senyawa anorganik sederhana (karbon dioksida dan air) dengan bantuan energi cahaya matahari disebut..",
    options: {
      A: "Glikolisis",
      B: "Respirasi seluler",
      C: "Transpirasi",
      D: "Fotosintesis"
    },
    correct: "D",
    explanation: "Fotosintesis merupakan reaksi anabolisme autotrof: $6CO_2 + 6H_2O \\xrightarrow{foton} C_6H_{12}O_6 + 6O_2$.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Prinsip dasar fisika yang menyatakan bahwa energi tidak dapat diciptakan maupun dimusnahkan, melainkan hanya dapat diubah dari satu bentuk energi ke bentuk energi lainnya dinamakan...",
    options: {
      A: "Hukum Hereditas Mendel",
      B: "Hukum Kekekalan Energi",
      C: "Hukum Aksi Reaksi Newton",
      D: "Hukum Tekanan Pascal"
    },
    correct: "B",
    explanation: "Hukum Kekekalan Energi (Hukum Termodinamika I) dirumuskan oleh James Prescott Joule: energi total dalam sistem terisolasi selalu konstan.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Dalam fisiologi tubuh manusia, ekskresi didefinisikan secara tepat sebagai proses pengeluaran...",
    options: {
      A: "Zat sisa hasil metabolisme sel tubuh yang sudah tidak digunakan lagi dan beracun",
      B: "Sisa makanan yang tidak tercerna melalui anus (defekasi)",
      C: "Zat getah enzim dan hormon pencernaan (sekresi)",
      D: "Gas asam lambung saat bersendawa"
    },
    correct: "A",
    explanation: "Ekskresi mengeluarkan zat sisa metabolisme kimia seluler (seperti urea, asam urat, keringat, $CO_2$) melalui ginjal, kulit, hati, dan paru-paru. Pengeluaran feses disebut defekasi.",
    difficulty: "MEDIUM"
  },
  {
    num: 7,
    question: "Dalam sistem klasifikasi 5 kingdom makhluk hidup oleh Robert H. Whittaker, kingdom yang memuat seluruh jenis organisme multiseluler eukariotik berklorofil dan berdinding sel selulosa adalah..",
    options: {
      A: "Kingdom Protista",
      B: "Kingdom Plantae (tumbuhan)",
      C: "Kingdom Fungi (jamur)",
      D: "Kingdom Animalia (hewan)"
    },
    correct: "B",
    explanation: "Kingdom Plantae mencakup Bryophyta (lumut), Pteridophyta (paku), dan Spermatophyta (tumbuhan berbiji) yang bersifat autotrof fotosintetik.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Suatu sistem tatanan kesatuan utuh menyeluruh yang di dalamnya terjadi hubungan timbal balik saling mempengaruhi antara makhluk hidup (biotik) dengan lingkungan fisiknya (abiotik) disebut..",
    options: {
      A: "Ekologi",
      B: "Populasi",
      C: "Habitat",
      D: "Ekosistem"
    },
    correct: "D",
    explanation: "Ekosistem adalah unit fungsional alam yang tersusun atas komponen biotik dan abiotik yang saling berinteraksi melalui rantai makanan dan siklus biogeokimia.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Zona keseluruhan lapisan permukaan bumi, hidrosfer, dan atmosfer tempat seluruh ekosistem kehidupan organisme dapat hidup dan berkembang biak dinamakan..",
    options: {
      A: "Biosfer",
      B: "Litosfer",
      C: "Mesosfer",
      D: "Stratosfer"
    },
    correct: "A",
    explanation: "Biosfer adalah tingkatan organisasi biologis tertinggi yang mencakup seluruh lapisan bumi yang dihuni oleh makhluk hidup.",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Perhatikan rantai makanan berikut: Rumput $\\rightarrow$ Belalang $\\rightarrow$ Tikus $\\rightarrow$ Burung Elang. Organisme yang menduduki trofik tertinggi sebagai konsumen puncak adalah...",
    options: {
      A: "Rumput (produsen)",
      B: "Tikus (konsumen sekunder)",
      C: "Burung Elang (konsumen puncak / tersier)",
      D: "Belalang (konsumen primer)"
    },
    correct: "C",
    explanation: "Burung elang berada di puncak rantai makanan (trofik tertinggi) karena tidak dimangsa oleh hewan pemangsa alami lain di ekosistem tersebut.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Dofir menderita miopi (rabun jauh) sehingga bayangan benda jauh jatuh di depan retina matanya. Jenis kacamata berlensa yang tepat untuk membantu penglihatan Dofir adalah ...",
    options: {
      A: "Lensa silindris",
      B: "Lensa cembung (positif / konvergen)",
      C: "Lensa cekung (negatif / divergen)",
      D: "Lensa datar"
    },
    correct: "C",
    explanation: "Lensa cekung bersifat menyebarkan berkas cahaya (divergen) sebelum masuk ke mata, sehingga bayangan yang semula jatuh di depan retina dapat digeser tepat jatuh di bintik kuning retina.",
    difficulty: "MEDIUM"
  },
  {
    num: 12,
    question: "Terjadinya fenomena pelangi di langit setelah hujan merupakan bukti nyata bahwa cahaya putih matahari dapat mengalami peristiwa ...",
    options: {
      A: "Polarisasi cahaya",
      B: "Perambatan lurus di ruang hampa",
      C: "Pemantulan baur sempurna",
      D: "Pembiasan (refraksi) dan penguraian warna (dispersi) oleh butiran air hujan"
    },
    correct: "D",
    explanation: "Cahaya polikromatik matahari dibiaskan dan dipantulkan oleh butir-butir air hujan sehingga terurai menjadi warna-warna monokromatik (merah, jingga, kuning, hijau, biru, nila, ungu).",
    difficulty: "MEDIUM"
  },
  {
    num: 13,
    question: "Prinsip optika yang mendasari kemampuan mata manusia dalam melihat suatu benda di sekitarnya secara benar adalah ...",
    options: {
      A: "Mata dapat melihat benda karena benda menyerap seluruh berkas cahaya yang datang",
      B: "Mata dapat melihat benda karena benda memantulkan berkas cahaya ke dalam kornea dan pupil mata",
      C: "Mata mengeluarkan berkas sinar sendiri ke arah benda",
      D: "Benda memancarkan gelombang suara yang ditangkap retina"
    },
    correct: "B",
    explanation: "Kita dapat melihat benda tak bercahaya karena benda tersebut memantulkan sebagian berkas cahaya yang mengenainya menuju ke pupil mata kita.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Urutan jalannya berkas cahaya masuk ke dalam mata manusia hingga terbentuk bayangan nyata dan terbalik pada retina adalah ...",
    options: {
      A: "Pupil $\\rightarrow$ Kornea $\\rightarrow$ Iris $\\rightarrow$ Lensa mata $\\rightarrow$ Retina",
      B: "Lensa mata $\\rightarrow$ Kornea $\\rightarrow$ Pupil $\\rightarrow$ Retina",
      C: "Kornea $\\rightarrow$ Pupil $\\rightarrow$ Lensa mata (cahaya dibiaskan) $\\rightarrow$ Retina (bayangan diterima)",
      D: "Retina $\\rightarrow$ Saraf optik $\\rightarrow$ Lensa mata $\\rightarrow$ Kornea"
    },
    correct: "C",
    explanation: "Cahaya menembus selaput bening kornea $\\rightarrow$ masuk melalui celah pupil $\\rightarrow$ difokuskan oleh lensa mata $\\rightarrow$ bayangan jatuh tepat pada retina $\\rightarrow$ impuls diteruskan ke otak lewat saraf optik.",
    difficulty: "MEDIUM"
  },
  {
    num: 15,
    question: "Dalam ilmu kimia dan fisika materi, apa yang dimaksud dengan partikel ion?",
    options: {
      A: "Atom atau gabungan atom yang memiliki muatan listrik bersih (akibat pelepasan atau penangkapan elektron)",
      B: "Partikel subatomik netral di dalam inti atom",
      C: "Molekul gas yang tidak dapat bereaksi",
      D: "Zat padat yang tidak larut air"
    },
    correct: "A",
    explanation: "Ion adalah atom atau gugus atom yang bermuatan listrik. Jika melepaskan elektron menjadi ion positif (kation), dan jika menangkap elektron menjadi ion negatif (anion).",
    difficulty: "MEDIUM"
  },
  {
    num: 16,
    question: "Kelompok unsur kimia di bawah ini yang seluruhnya tergolong sebagai unsur logam adalah ....",
    options: {
      A: "Emas ($Au$), seng ($Zn$), dan Karbon ($C$)",
      B: "Besi ($Fe$), nikel ($Ni$), dan belerang ($S$)",
      C: "Fosfor ($P$), oksigen ($O$), dan tembaga ($Cu$)",
      D: "Emas ($Au$), perak ($Ag$), tembaga ($Cu$), dan nikel ($Ni$)"
    },
    correct: "D",
    explanation: "Emas, perak, dan nikel adalah logam murni yang mengilap, dapat ditempa, dan merupakan konduktor listrik yang baik. Karbon, belerang, fosfor, dan oksigen adalah non-logam.",
    difficulty: "MEDIUM"
  },
  {
    num: 17,
    question: "Kita mengamati matahari seolah-olah bergerak terbit di ufuk timur dan tenggelam di ufuk barat setiap hari. Gerak semu harian matahari ini disebabkan oleh peristiwa …. ",
    options: {
      A: "Rotasi bumi berputar pada porosnya dari arah barat ke timur",
      B: "Revolusi matahari mengelilingi pusat galaksi bimasakti",
      C: "Matahari mengitari planet bumi dalam lintasan lingkaran",
      D: "Kecepatan bumi melambat di siang hari"
    },
    correct: "A",
    explanation: "Karena bumi berotasi dari barat ke timur dengan periode 24 jam, pengamat di bumi melihat benda-benda langit tampak bergerak dari arah berlawanan, yaitu dari timur ke barat.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Setelah fase bulan purnama, piringan bulan yang memantulkan cahaya matahari akan tampak berangsur-angsur mengecil (menyusut) menuju bentuk setengah lingkaran dan sabit. Kedudukan ini dinamakan fase .…",
    options: {
      A: "Kuartir pertama (*waxing crescent*)",
      B: "Bulan mati / konjungsi",
      C: "Kuartir ketiga / bulan susut (*waning moon*)",
      D: "Bulan baru"
    },
    correct: "C",
    explanation: "Fase bulan: Bulan baru $\\rightarrow$ Kuartir I (membesar) $\\rightarrow$ Purnama $\\rightarrow$ Kuartir III (menyusut / *waning*) $\\rightarrow$ Bulan baru kembali.",
    difficulty: "HARD"
  },
  {
    num: 19,
    question: "Ketika belahan bumi utara mengalami musim semi dan belahan bumi selatan mengalami musim gugur, peristiwa ini berlangsung pada rentang tanggal ….",
    options: {
      A: "21 Desember sampai 21 Maret",
      B: "23 September sampai 21 Desember",
      C: "21 Juni sampai 23 September",
      D: "21 Maret sampai 21 Juni"
    },
    correct: "D",
    explanation: "Antara 21 Maret hingga 21 Juni, matahari berada di atas khatulistiwa bergerak ke arah belahan bumi utara, memicu musim semi di utara dan musim gugur di selatan.",
    difficulty: "HARD"
  },
  {
    num: 20,
    question: "Bulan menampakkan berbagai bentuk fase yang berubah teratur saat mengitari bumi. Istilah di bawah ini yang BUKAN merupakan bentuk fase bulan adalah ....",
    options: {
      A: "Penumbra",
      B: "Bulan purnama",
      C: "Bulan sabit",
      D: "Bulan cembung (*gibbous*)"
    },
    correct: "A",
    explanation: "Penumbra adalah bayangan kabur/samar yang terbentuk saat terjadi peristiwa gerhana matahari atau bulan, bukan nama fase penampakan bulan.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "Fenomena Gerhana Matahari total dapat terjadi pada saat posisi benda-benda langit berada pada urutan segaris lurus, yaitu ....",
    options: {
      A: "Matahari – Bulan – Bumi",
      B: "Matahari – Bumi – Bulan",
      C: "Bumi – Matahari – Bulan",
      D: "Bulan – Matahari – Bumi"
    },
    correct: "A",
    explanation: "Gerhana matahari terjadi saat piringan bulan melintas di antara matahari dan bumi sehingga bayangan umbra bulan jatuh menutupi sebagian wilayah bumi.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Sesuai Hukum I Newton (Kelembaman): jika resultan gaya total yang bekerja pada suatu benda sama dengan nol ($\\Sigma F = 0$), maka benda tersebut akan …",
    options: {
      A: "Pasti mengalami perlambatan",
      B: "Pasti mengalami percepatan konstan",
      C: "Tetap diam atau bergerak lurus beraturan (GLB) dengan kecepatan tetap",
      D: "Pasti berhenti seketika"
    },
    correct: "C",
    explanation: "Hukum I Newton menyatakan bahwa setiap benda akan mempertahankan keadaan diamnya atau keadaan bergerak lurus dengan kelajuan tetap kecuali jika dipaksa oleh gaya luar.",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Berdasarkan rumus tekanan zat padat ($P = \\frac{F}{A}$), jika luas bidang tekan ($A$) diperbesar sedangkan besar gaya tetap, maka besarnya tekanan zat padat akan...",
    options: {
      A: "Semakin besar berlipat ganda",
      B: "Semakin kecil",
      C: "Tidak mengalami perubahan",
      D: "Menjadi tak terhingga"
    },
    correct: "B",
    explanation: "Tekanan berbanding terbalik dengan luas permukaan bidang tekan ($P \\propto \\frac{1}{A}$). Semakin lebar alas sepatu salju, tekanan ke salju semakin kecil sehingga tidak amblas.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "Pada tekanan hidrostatis zat cair ($P_h = \\rho \\cdot g \\cdot h$), semakin dalam posisi penyelam dari permukaan air, maka tekanan yang dialami tubuh penyelam akan..",
    options: {
      A: "Semakin besar secara proporsional",
      B: "Semakin kecil",
      C: "Selalu bernilai nol",
      D: "Sama dengan tekanan udara luar"
    },
    correct: "A",
    explanation: "Tekanan hidrostatis berbanding lurus dengan kedalaman ($h$). Semakin dalam menyelam, berat kolom air di atas tubuh penyelam semakin besar sehingga tekanan hidrostatis bertambah.",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Ketika kertas pembungkus gorengan tampak berminyak dan menjadi transparan (tembus pandang), hal ini membuktikan adanya kandungan nutrisi ... pada gorengan tersebut.",
    options: {
      A: "Karbohidrat amilum tinggi",
      B: "Lemak / lipid",
      C: "Protein hewani",
      D: "Vitamin C larut air"
    },
    correct: "B",
    explanation: "Uji lemak secara sederhana memanfaatkan sifat lemak/minyak yang mengisi pori-pori serat kertas sehingga indeks biasnya seragam dan kertas menjadi transparan.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Ketika jari tangan terluka dan mengeluarkan darah, beberapa menit kemudian luka menutup dan perdarahan terhenti. Komponen darah yang berperan aktif dalam mekanisme pembekuan darah adalah ...",
    options: {
      A: "Serum darah dan albumin",
      B: "Hemoglobin dan eritrosit",
      C: "Trombosit (keping darah) dan protein fibrinogen",
      D: "Limfosit dan leukosit"
    },
    correct: "C",
    explanation: "Trombosit pecah mengeluarkan trombokinase $\\rightarrow$ mengubah protrombin menjadi trombin dengan bantuan $Ca^{2+}$ dan vitamin K $\\rightarrow$ trombin mengubah fibrinogen menjadi jaring-jaring fibrin penutup luka.",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "Ciri-ciri sel darah: bentuk tidak tetap (amuboid), memiliki inti sel, tidak berwarna, dan mampu menembus dinding kapiler (diapedesis) untuk memakan kuman penyakit (fagositosis). Ciri tersebut adalah ...",
    options: {
      A: "Eritrosit (sel darah merah)",
      B: "Leukosit (sel darah putih)",
      C: "Trombosit",
      D: "Plasma darah"
    },
    correct: "B",
    explanation: "Leukosit bertindak sebagai sistem pertahanan imun tubuh melawan infeksi patogen.",
    difficulty: "MEDIUM"
  },
  {
    num: 28,
    question: "Ciri-ciri pembuluh darah: membawa aliran darah keluar dari jantung, dinding pembuluh tebal dan elastis, tekanan darah tinggi, dan jika terluka darah akan memancar deras. Ciri ini merupakan karakteristik dari pembuluh ...",
    options: {
      A: "Pembuluh vena (balik)",
      B: "Pembuluh kapiler",
      C: "Pembuluh limfa",
      D: "Pembuluh arteri (nadi)"
    },
    correct: "D",
    explanation: "Pembuluh arteri mengalirkan darah bertekanan tinggi dari bilik jantung ke seluruh tubuh. Dindingnya tebal dan berotot agar mampu menahan denyut pompa jantung.",
    difficulty: "MEDIUM"
  },
  {
    num: 29,
    question: "Panci untuk memasak air di dapur umumnya terbuat dari logam seperti aluminium atau baja tahan karat karena...",
    options: {
      A: "Logam merupakan isolator panas yang baik",
      B: "Logam memiliki massa jenis yang sangat ringan",
      C: "Logam memiliki konduktivitas termal yang tinggi (konduktor panas yang baik)",
      D: "Logam dapat menghasilkan energi panas sendiri"
    },
    correct: "C",
    explanation: "Konduktivitas termal logam yang tinggi memungkinkan kalor dari api kompor cepat merambat merata ke air di dalam panci sehingga air cepat mendidih.",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "Saat es batu dimasukkan ke dalam gelas berisi teh hangat, suhu teh berangsur-angsur turun menjadi dingin. Sesuai Asas Black, hal ini membuktikan bahwa...",
    options: {
      A: "Es batu melepaskan energi panas ke udara luar",
      B: "Teh hangat melepaskan kalor kepada es batu, sedangkan es batu menyerap kalor tersebut untuk mencair",
      C: "Suhu awal es batu lebih tinggi daripada teh",
      D: "Terjadi pemusnahan energi kalor di dalam gelas"
    },
    correct: "B",
    explanation: "Asas Black: Kalor yang dilepas oleh benda bersuhu lebih tinggi (teh) sama dengan kalor yang diserap oleh benda bersuhu lebih rendah (es) ($Q_{lepas} = Q_{terima}$) hingga tercapai kesetimbangan termal.",
    difficulty: "MEDIUM"
  }
];

// =========================================================================
// RUNNER: INGEST TO BOTH POSTGRESQL SUPABASE AND SQLITE
// =========================================================================

async function importBatch3() {
  console.log('--- Starting Import Batch 3: PRISMA IPA & Sains (Level 1, 2, 3) ---');
  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));

  // Ensure category
  const catId = 'cat_olimpiade_prisma';
  const catName = 'Olimpiade PRISMA';
  const catDesc = 'Soal penyisihan resmi Olimpiade PRISMA Matematika & Sains dengan soal bergambar.';

  await client`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (${catId}, ${catName}, 'olimpiade-prisma', ${catDesc}, 2)
    ON CONFLICT (id) DO NOTHING
  `;

  // Define batches
  const batches = [
    {
      pkgId: 'pkg_prisma_2024_ipa_1',
      pkgTitle: 'Olimpiade PRISMA 2024 — Penyisihan IPA & Sains Level 1',
      pkgSlug: 'prisma-2024-ipa-level-1',
      topicId: 'top_prisma_2024_ipa_l1',
      topicName: 'IPA & Sains Level 1 PRISMA 2024',
      topicSlug: 'ipa-level-1-prisma-2024',
      questions: PRISMA_IPA_L1,
      prefix: 'q_prisma24_ipa1',
      duration: 60,
    },
    {
      pkgId: 'pkg_prisma_2024_ipa_2',
      pkgTitle: 'Olimpiade PRISMA 2024 — Penyisihan IPA & Sains Level 2',
      pkgSlug: 'prisma-2024-ipa-level-2',
      topicId: 'top_prisma_2024_ipa_l2',
      topicName: 'IPA & Sains Level 2 PRISMA 2024',
      topicSlug: 'ipa-level-2-prisma-2024',
      questions: PRISMA_IPA_L2,
      prefix: 'q_prisma24_ipa2',
      duration: 60,
    },
    {
      pkgId: 'pkg_prisma_2024_ipa_3',
      pkgTitle: 'Olimpiade PRISMA 2024 — Penyisihan IPA & Sains Level 3',
      pkgSlug: 'prisma-2024-ipa-level-3',
      topicId: 'top_prisma_2024_ipa_l3',
      topicName: 'IPA & Sains Level 3 PRISMA 2024',
      topicSlug: 'ipa-level-3-prisma-2024',
      questions: PRISMA_IPA_L3,
      prefix: 'q_prisma24_ipa3',
      duration: 60,
    },
  ];

  let totalQuestionsCount = 0;

  for (const batch of batches) {
    console.log(`Processing ${batch.pkgTitle}...`);

    // 1. Topic
    await client`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (${batch.topicId}, ${catId}, ${batch.topicName}, ${batch.topicSlug})
      ON CONFLICT (id) DO NOTHING
    `;

    sqlite.prepare(`
      INSERT OR IGNORE INTO topics (id, category_id, name, slug)
      VALUES (?, ?, ?, ?)
    `).run(batch.topicId, catId, batch.topicName, batch.topicSlug);

    // 2. Exam Package
    const rules = JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 60 });
    await client`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (${batch.pkgId}, ${batch.pkgTitle}, ${batch.pkgSlug}, ${catId}, 'SIMULATION', ${batch.duration}, false, false, ${rules}, true)
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_minutes = EXCLUDED.duration_minutes
    `;

    sqlite.prepare(`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (?, ?, ?, ?, 'SIMULATION', ?, 0, 0, ?, 1)
      ON CONFLICT (id) DO UPDATE SET title = excluded.title
    `).run(batch.pkgId, batch.pkgTitle, batch.pkgSlug, catId, batch.duration, rules);

    // 3. Prepare Questions & Options
    const questionsToInsert = [];
    const optionsToInsert = [];
    const pkgQuestionsToInsert = [];

    for (let i = 0; i < batch.questions.length; i++) {
      const q = batch.questions[i];
      const qId = `${batch.prefix}_${String(q.num).padStart(2, '0')}`;

      questionsToInsert.push({
        id: qId,
        topic_id: batch.topicId,
        type: 'SINGLE_CHOICE',
        content_markdown: q.question,
        image_url: null,
        explanation_markdown: q.explanation,
        explanation_image_url: null,
        difficulty: q.difficulty,
        created_at: new Date().toISOString(),
      });

      for (const [label, content] of Object.entries(q.options)) {
        const isCorrect = label.toUpperCase() === q.correct.toUpperCase();
        optionsToInsert.push({
          id: `opt_${qId}_${label.toLowerCase()}`,
          question_id: qId,
          label: label.toUpperCase(),
          content_markdown: content,
          image_url: null,
          is_correct: isCorrect,
          score_value: isCorrect ? 4 : 0,
          order_index: label.toUpperCase().charCodeAt(0) - 65,
        });
      }

      pkgQuestionsToInsert.push({
        package_id: batch.pkgId,
        question_id: qId,
        order_index: i,
      });

      totalQuestionsCount++;
    }

    // Insert to PostgreSQL
    await client`
      INSERT INTO questions ${client(questionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown, 
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
        ON CONFLICT (id) DO UPDATE SET content_markdown = excluded.content_markdown
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
  console.log(`\n🎉 ALL DONE! Successfully imported ${totalQuestionsCount} questions across 3 packages with complete keys & pedagogical explanations.`);
  process.exit(0);
}

importBatch3().catch((err) => {
  console.error('Import error:', err);
  process.exit(1);
});
