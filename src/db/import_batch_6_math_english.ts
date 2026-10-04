import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

// =========================================================================
// BATCH 6: IMPORT MATEMATIKA & BAHASA INGGRIS LEVEL 1 & LEVEL 2
// 1. pkg_prisma_2025_ing_1 (30 Soal PRISMA 2025 Bhs Inggris Level 1)
// 2. pkg_prisma_2025_ing_2 (30 Soal PRISMA 2025 Bhs Inggris Level 2)
// 3. pkg_ceo_2025_ing_1    (30 Soal CEO 2025 Semifinal Bhs Inggris Level 1)
// 4. pkg_ceo_2025_ing_2    (30 Soal CEO 2025 Semifinal Bhs Inggris Level 2)
// 5. pkg_orion_2026_mb     (35 Soal Final Nasional ORION 2026 Matematika Level B)
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

interface BatchDefinition {
  pkgId: string;
  pkgTitle: string;
  pkgSlug: string;
  categoryId: string;
  topicId: string;
  topicName: string;
  durationMinutes: number;
  questions: QuestionItem[];
}

// -------------------------------------------------------------------------
// 1. PRISMA 2025 — BAHASA INGGRIS LEVEL 1
// -------------------------------------------------------------------------
const PRISMA_2025_ING_1: QuestionItem[] = [
  {
    num: 1,
    question: "Yolan likes …. on holiday. She really likes traditional dance.",
    options: {
      A: "singing",
      B: "dancing",
      C: "painting",
      D: "speaking"
    },
    correct: "B",
    explanation: "Petunjuk dalam kalimat menyatakan *\"She really likes traditional dance\"* (Dia sangat menyukai tarian tradisional). Oleh karena itu, kegiatan/hobi yang paling tepat adalah menari (*dancing*).",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Dina likes to make beautiful pictures using pencils and colors. Her hobby is …",
    options: {
      A: "drawing",
      B: "hiking",
      C: "reading",
      D: "cooking"
    },
    correct: "A",
    explanation: "Kegiatan membuat gambar menggunakan pensil dan warna adalah menggambar (*drawing*). *Hiking* = mendaki, *reading* = membaca, *cooking* = memasak.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Galfin : What do you like to do in your free time?\nAlfan : I enjoy …..",
    image: "/uploads/prisma25_ing1_image1.png",
    options: {
      A: "surfing",
      B: "painting",
      C: "fencing",
      D: "carving"
    },
    correct: "C",
    explanation: "Gambar stimulus menunjukkan seseorang yang mengenakan pakaian pelindung, topeng kawat, dan memegang pedang tipis (foil) untuk olahraga anggar (*fencing*).",
    difficulty: "MEDIUM"
  },
  {
    num: 4,
    question: "Mrs. Jihan always wears a ….",
    options: {
      A: "scarf",
      B: "veil",
      C: "vest",
      D: "shirt"
    },
    correct: "B",
    explanation: "*Veil* mengacu pada jilbab atau kerudung penutup kepala yang biasa dikenakan seorang wanita muslimah. *Scarf* = syal leher, *vest* = rompi, *shirt* = kemeja.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "The weather is cold tonight, I need to wear ….",
    options: {
      A: "a belt",
      B: "a blouse",
      C: "sunglasses",
      D: "a jacket"
    },
    correct: "D",
    explanation: "Ketika cuaca sedang dingin (*cold tonight*), pakaian yang berfungsi untuk menghangatkan tubuh adalah jaket (*a jacket*). *Belt* = ikat pinggang, *sunglasses* = kacamata hitam.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Berlan is playing football now. He is wearing a T-shirt and ….",
    options: {
      A: "a tie",
      B: "raincoat",
      C: "shorts",
      D: "purse"
    },
    correct: "C",
    explanation: "Saat berolahraga sepak bola (*playing football*), perlengkapan standar yang dipakai adalah kaos oblong (*T-shirt*) dan celana pendek olahraga (*shorts*).",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "We must stop when the traffic light is ….",
    options: {
      A: "yellow",
      B: "blue",
      C: "red",
      D: "green"
    },
    correct: "C",
    explanation: "Pada lampu lalu lintas (*traffic light*), warna merah (*red*) adalah isyarat wajib untuk berhenti (*stop*), kuning untuk bersiap-siap, dan hijau untuk jalan.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Here are names of the colors, except, ….",
    options: {
      A: "chocolate",
      B: "black",
      C: "purple",
      D: "white"
    },
    correct: "A",
    explanation: "*Chocolate* adalah nama makanan/minuman (cokelat). Nama warna cokelat dalam bahasa Inggris adalah *brown*. Sedangkan *black* (hitam), *purple* (ungu), dan *white* (putih) adalah nama-nama warna baku.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Look at the picture. It is a ….",
    image: "/uploads/prisma25_ing1_image3.png",
    options: {
      A: "ship",
      B: "truck",
      C: "submarine",
      D: "boat"
    },
    correct: "A",
    explanation: "Gambar stimulus menampilkan kapal laut berukuran besar (*ship*), bukan kapal selam (*submarine*) maupun perahu kecil (*boat*).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "There are three kinds of transportations. They are land transportation, water transportation and Air transportation. Air transportation means ….",
    options: {
      A: "Transportasi air",
      B: "Transportasi darat",
      C: "Transportasi udara",
      D: "Transportasi bawah laut"
    },
    correct: "C",
    explanation: "Kata *air* dalam konteks ini berarti udara, sehingga *air transportation* berarti transportasi udara (seperti pesawat terbang dan helikopter).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "I like ….",
    image: "/uploads/prisma25_ing1_image4.jpeg",
    options: {
      A: "garlic",
      B: "lettuce",
      C: "thorn",
      D: "mushroom"
    },
    correct: "A",
    explanation: "Gambar stimulus memperlihatkan beberapa siung bawang putih utuh (*garlic*).",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "How to say “Seikat bayam” in English?",
    options: {
      A: "a bunch of cabbage",
      B: "a tube of radish",
      C: "a slice of spinach",
      D: "a bunch of spinach"
    },
    correct: "D",
    explanation: "Bayam dalam bahasa Inggris adalah *spinach*. Satuan untuk ikatan sayuran adalah *a bunch of*. Maka \"seikat bayam\" adalah *a bunch of spinach*.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Mangosteen, cherry, pear are ….",
    options: {
      A: "insects",
      B: "fruits",
      C: "vegetables",
      D: "vehicles"
    },
    correct: "B",
    explanation: "*Mangosteen* (manggis), *cherry* (ceri), dan *pear* (pir) seluruhnya tergolong dalam kelompok buah-buahan (*fruits*).",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Belqis : Where do you have breakfast ?\nArin : In the ….",
    options: {
      A: "warehouse",
      B: "basin",
      C: "dining room",
      D: "living room"
    },
    correct: "C",
    explanation: "Ruang makan (*dining room*) adalah ruangan di dalam rumah yang khusus digunakan untuk makan bersama, termasuk sarapan pagi (*breakfast*).",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "There is a …. In front of my house.",
    image: "/uploads/prisma25_ing1_image5.jpeg",
    options: {
      A: "gate",
      B: "fence",
      C: "terrace",
      D: "ashtray"
    },
    correct: "B",
    explanation: "Gambar stimulus memperlihatkan pagar pembatas halaman rumah (*fence*).",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Your father keeps his car in the ….",
    options: {
      A: "garage",
      B: "bedroom",
      C: "roof",
      D: "balcony"
    },
    correct: "A",
    explanation: "Tempat menyimpan atau memarkir mobil di area rumah adalah garasi (*garage*).",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Belva wants to buy medicine. She goes to ….",
    image: "/uploads/prisma25_ing1_image6.png",
    options: {
      A: "stationary",
      B: "gallery",
      C: "grocery",
      D: "drugstore"
    },
    correct: "D",
    explanation: "Untuk membeli obat-obatan (*medicine*), tempat yang harus dikunjungi adalah toko obat atau apotek (*drugstore* / *pharmacy*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "It is going to rain. I must bring my ….",
    image: "/uploads/prisma25_ing1_image7.png",
    options: {
      A: "watch",
      B: "umbrella",
      C: "pail",
      D: "tie"
    },
    correct: "B",
    explanation: "Ketika hari akan turun hujan (*going to rain*), benda yang wajib dibawa untuk melindungi diri agar tidak basah adalah payung (*umbrella*).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Most people have white ….",
    options: {
      A: "tooth",
      B: "navel",
      C: "toes",
      D: "teeth"
    },
    correct: "D",
    explanation: "Gigi manusia umumnya berwarna putih. Karena mengacu pada seluruh gigi (jamak/plural), bentuk yang tepat adalah *teeth* (bentuk jamak tak beraturan dari *tooth*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "The following text is for questions number 20 to 22.\n\n\"I am Miracle. My mother always goes to market on Sunday with me. We go there at six O’clock by pedicab. One hour before I usually sweep the yard. In the market, we buy Fresh Meat and fish, two kilos of egg and some vegetables.\"\n\nWho always goes to market on Sunday?",
    options: {
      A: "Miracle",
      B: "Miracle’s mother",
      C: "The writer",
      D: "Miracle and her mother"
    },
    correct: "D",
    explanation: "Pada teks disebutkan *\"My mother always goes to market on Sunday with me\"*. Karena penulis adalah Miracle, maka yang pergi ke pasar berdua adalah Miracle dan ibunya (*Miracle and her mother*).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "How do the writer and her mother go to market?",
    options: {
      A: "on foot",
      B: "by pedicab",
      C: "by car",
      D: "by cycle"
    },
    correct: "B",
    explanation: "Berdasarkan kalimat kedua teks: *\"We go there at six O’clock by pedicab\"*. Jadi mereka pergi mengendarai becak (*by pedicab*).",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "What time does Miracle sweep the yard?",
    options: {
      A: "at five o’clock",
      B: "at four o’clock",
      C: "at six o’clock",
      D: "at seven o’clock"
    },
    correct: "A",
    explanation: "Miracle pergi ke pasar pada pukul 6 (*at six o'clock*), dan menyapu halaman satu jam sebelumnya (*one hour before*). Satu jam sebelum pukul 6 adalah pukul 5 pagi (*at five o'clock*).",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Choose the word that has the same meaning as “happy”.",
    options: {
      A: "Sad",
      B: "Glad",
      C: "Angry",
      D: "Tired"
    },
    correct: "B",
    explanation: "Sinonim kata *happy* (senang/bahagia) adalah *glad* (gembira/sukacita). *Sad* = sedih, *angry* = marah, *tired* = lelah.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "The water is hot, the ice is ….",
    options: {
      A: "warm",
      B: "sunny",
      C: "dull",
      D: "cold"
    },
    correct: "D",
    explanation: "Kalimat menunjukkan hubungan antonim sifat: air panas (*hot*), sedangkan es bersuhu dingin (*cold*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "The movie was very boring, but the book was ….",
    options: {
      A: "interesting",
      B: "confusing",
      C: "tiring",
      D: "difficult"
    },
    correct: "A",
    explanation: "Kata sambung pertentangan *but* menunjukkan sifat berlawanan. Jika filmnya membosankan (*boring*), maka bukunya sangat menarik (*interesting*).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "There is a cat …. The table.",
    image: "/uploads/prisma25_ing1_image8.png",
    options: {
      A: "behind",
      B: "in front of",
      C: "under",
      D: "corner"
    },
    correct: "C",
    explanation: "Gambar stimulus menunjukkan seekor kucing sedang berbaring di kolong/bawah meja (*under the table*).",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Falih sits behind Chaca. We can say also that Chaca sits …. Falih.",
    options: {
      A: "under",
      B: "across",
      C: "among",
      D: "in front of"
    },
    correct: "D",
    explanation: "Jika Falih duduk di belakang (*behind*) Chaca, maka sebaliknya Chaca duduk di depan (*in front of*) Falih.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "A bird is …. Two boxes.",
    options: {
      A: "on",
      B: "between",
      C: "next to",
      D: "over"
    },
    correct: "B",
    explanation: "Preposisi tempat untuk objek yang berada di tengah-tengah dua benda adalah *between* (*between two boxes*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "The sun rises in the ….",
    options: {
      A: "east",
      B: "west",
      C: "north",
      D: "south"
    },
    correct: "A",
    explanation: "Matahari terbit dari sebelah timur (*east*) dan terbenam di sebelah barat (*west*).",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "The opposite of south is ….",
    options: {
      A: "north",
      B: "east",
      C: "west",
      D: "southeast"
    },
    correct: "A",
    explanation: "Lawan arah mata angin dari selatan (*south*) adalah utara (*north*).",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 2. PRISMA 2025 — BAHASA INGGRIS LEVEL 2
// -------------------------------------------------------------------------
const PRISMA_2025_ING_2: QuestionItem[] = [
  {
    num: 1,
    question: "Read this text then answer the questions number 1 to 4!\n\n\"Last weekend the girl scouts and the boy scouts of my school had their first fun camping Outside the school. They left for Cikoneng at 05. 00 am. After a long and thrilling drive they arrived at the village and found a good camping site. “Let’s set up our tents there,” said the Leader while pointing at the garden. Then, they started to work. In a short time, the tents were ready and they put a small flag on the top of each tent. After that, some girl scouts made a fire while some others cooked their lunch. The boys were busy working. The lunch was ready at 03.00 and they immediately started to eat. After that, they took a little rest. At 04.30 pm the leader blew his whistle and all the girl scouts and the boy scouts gathered around to start their fun camping programs.\"\n\nWhen did the scouts begin their fun camping programs?",
    options: {
      A: "At night",
      B: "In the evening",
      C: "In the morning",
      D: "In the afternoon"
    },
    correct: "D",
    explanation: "Teks menyatakan: *\"At 04.30 pm the leader blew his whistle and all the girl scouts and the boy scouts gathered around to start their fun camping programs.\"* Pukul 04.30 pm adalah waktu sore hari (*in the afternoon*).",
    difficulty: "MEDIUM"
  },
  {
    num: 2,
    question: "The scouts set their tents up.…",
    options: {
      A: "on the mountain",
      B: "beside the road",
      C: "at the garden",
      D: "in the valley"
    },
    correct: "C",
    explanation: "Pemimpin menunjuk ke arah kebun (*garden*): *“Let’s set up our tents there,” said the Leader while pointing at the garden.*",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "“… and some others cooked their lunch.”. What does the underlined phrase refer to?",
    options: {
      A: "The teachers",
      B: "The boy scouts",
      C: "The girl scouts",
      D: "The leader of scouts"
    },
    correct: "C",
    explanation: "Konteks kalimat sebelumnya: *\"some girl scouts made a fire while some others cooked their lunch\"*. Kata *some others* merujuk pada kelompok pramuka putri yang lain (*the girl scouts*).",
    difficulty: "MEDIUM"
  },
  {
    num: 4,
    question: "What task did the boy scouts do after they arrived at the camping site?",
    options: {
      A: "They made a fire.",
      B: "They cooked their lunch",
      C: "They put a small flag on top of the tents",
      D: "They worked on setting up the tents"
    },
    correct: "D",
    explanation: "Setelah tiba di lokasi perkemahan, anak laki-laki sibuk bekerja mendirikan dan menyiapkan tenda (*worked on setting up the tents*).",
    difficulty: "MEDIUM"
  },
  {
    num: 5,
    question: "Rico never says “thank you,” interrupts his friends when they are speaking, and often shouts in class. What is the best word to describe Rico?",
    options: {
      A: "Cheerful",
      B: "Impolite",
      C: "Honest",
      D: "Responsible"
    },
    correct: "B",
    explanation: "Perilaku tidak pernah berterima kasih, memotong pembicaraan orang lain, dan berteriak di kelas menggambarkan sifat tidak sopan (*impolite*).",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Doni always gets what he wants from his parents. He cries if he doesn’t get a new toy, and he never wants to share. He is ….",
    options: {
      A: "Spoiled",
      B: "selfish",
      C: "rude",
      D: "greedy"
    },
    correct: "A",
    explanation: "Anak yang selalu dituruti semua keinginannya dan menangis jika permintaannya tidak dipenuhi adalah anak yang manja (*spoiled*).",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "My grandfather doesn’t have hair on his head. He is ….",
    options: {
      A: "bald",
      B: "blond",
      C: "cruel",
      D: "impatient"
    },
    correct: "A",
    explanation: "Seseorang yang tidak memiliki rambut di kepalanya disebut berkepala botak (*bald*). *Blond* = berambut pirang.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "What is the capital city of Japan?",
    image: "/uploads/prisma25_ing2_image2.png",
    options: {
      A: "Beijing",
      B: "Seoul",
      C: "Tokyo",
      D: "Bangkok"
    },
    correct: "C",
    explanation: "Ibu kota negara Jepang adalah Tokyo. Beijing adalah ibu kota Tiongkok, Seoul ibu kota Korea Selatan, dan Bangkok ibu kota Thailand.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Which country is famous for the Eiffel Tower?",
    options: {
      A: "Italy",
      B: "Germany",
      C: "France",
      D: "Spain"
    },
    correct: "C",
    explanation: "Menara Eiffel (*Eiffel Tower*) terletak di kota Paris, Prancis (*France*).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Jakarta is a province and it is led by a ….",
    options: {
      A: "regent",
      B: "minister",
      C: "president",
      D: "governor"
    },
    correct: "D",
    explanation: "Provinsi dipimpin oleh seorang gubernur (*governor*). Bupati (*regent*) memimpin kabupaten, sedangkan presiden memimpin negara.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "She usually …. coffee in the morning.",
    image: "/uploads/prisma25_ing2_image1.png",
    options: {
      A: "drinking",
      B: "drink",
      C: "drank",
      D: "drinks"
    },
    correct: "D",
    explanation: "Kalimat menggunakan *Simple Present Tense* untuk kebiasaan (*usually*). Subjek orang ketiga tunggal (*She*) menggunakan kata kerja berakhiran -s, yaitu *drinks*.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Chiko : Why …. you go home late yesterday?\nAisy : Because I studied at the library with my friends.",
    options: {
      A: "did",
      B: "are",
      C: "do",
      D: "were"
    },
    correct: "A",
    explanation: "Keterangan waktu lampau *yesterday* dan kata kerja dasar *go* membutuhkan kata kerja bantu lampau *did* (*Why did you go...*).",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Dinar : What are you laughing at?\nSelsi : I am …. a funny video.",
    options: {
      A: "watch",
      B: "watching",
      C: "watched",
      D: "watches"
    },
    correct: "B",
    explanation: "Pola *Present Continuous Tense* adalah *am/is/are + Verb-ing*. Setelah *I am*, kata kerja yang benar adalah *watching*.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "I need a .... of paper to draw a cow.",
    options: {
      A: "slice",
      B: "loaf",
      C: "sheet",
      D: "tube"
    },
    correct: "C",
    explanation: "Satuan kuantitas selembar kertas adalah *a sheet of paper*. *Slice* = seiris roti/keju, *loaf* = sebongkah roti, *tube* = pasta gigi.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Dad refuses to have dinner in the dining room because it’s got three …. in it.",
    options: {
      A: "mouses",
      B: "mice",
      C: "mices",
      D: "mouse"
    },
    correct: "B",
    explanation: "Bentuk jamak tidak beraturan (*irregular plural*) dari kata benda *mouse* (tikus) adalah *mice*.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "This leaf is green but those …. are yellow.",
    options: {
      A: "leaves",
      B: "leafes",
      C: "leafves",
      D: "leafs"
    },
    correct: "A",
    explanation: "Kata benda yang berakhiran -f seperti *leaf* berubah bentuk jamaknya menjadi berakhiran -ves, yaitu *leaves*.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Choose the correct words to complete the text below! (No. 17 - 20)\n\n\"Exercising is very important for our health. When we do exercise, our body becomes strong and fresh. Many people like to run, swim, or play football. Exercise also makes our mind happy. That is why we should do exercise …. (17). Some students go jogging in the morning before school. Others like to play basketball in the afternoon. Exercising is not only for young people but also for …. (18). Doing sports regularly can prevent us from getting sick. It also helps us to have more …. (19). If we want to stay healthy, we need to spend some …. (20) for exercise every day.\"\n\nQuestion 17: That is why we should do exercise …. (17).",
    options: {
      A: "never",
      B: "often",
      C: "slowly",
      D: "rarely"
    },
    correct: "B",
    explanation: "Karena berolahraga sangat bermanfaat, kita disarankan untuk sering (*often*) atau secara teratur melakukannya.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Exercising is not only for young people but also for …. (18).",
    options: {
      A: "children",
      B: "animals",
      C: "old people",
      D: "teachers"
    },
    correct: "C",
    explanation: "Teks membandingkan kelompok umur: bukan hanya untuk orang muda (*young people*), tetapi juga bermanfaat bagi orang tua/lanjut usia (*old people*).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "It also helps us to have more …. (19).",
    options: {
      A: "sadness",
      B: "problem",
      C: "homework",
      D: "energy"
    },
    correct: "D",
    explanation: "Manfaat fisik berolahraga adalah meningkatkan stamina sehingga kita memiliki lebih banyak energi (*more energy*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "If we want to stay healthy, we need to spend some …. (20) for exercise every day.",
    options: {
      A: "water",
      B: "money",
      C: "food",
      D: "time"
    },
    correct: "D",
    explanation: "Frasa *spend some time* bermakna meluangkan waktu setiap hari untuk berolahraga.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "All of my time … spent in the library.",
    options: {
      A: "are",
      B: "is",
      C: "were",
      D: "does"
    },
    correct: "B",
    explanation: "*Time* adalah kata benda yang tidak dapat dihitung (*uncountable noun*), sehingga menggunakan to be tunggal *is* (*All of my time is spent...*).",
    difficulty: "MEDIUM"
  },
  {
    num: 22,
    question: "Everyone …. a chance to be a winner in the Prisma Olympiad.",
    options: {
      A: "having",
      B: "have",
      C: "has",
      D: "is has"
    },
    correct: "C",
    explanation: "*Everyone* adalah *indefinite pronoun* yang selalu berkedudukan tunggal (*singular*), sehingga kata kerja yang sesuai adalah *has*.",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Gymnastics …. my favorite sport.",
    options: {
      A: "are",
      B: "is",
      C: "were",
      D: "be"
    },
    correct: "B",
    explanation: "Walaupun berakhiran huruf 's', nama cabang olahraga *gymnastics* (senam) adalah kata benda tunggal, sehingga to be yang tepat adalah *is*.",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "It is a tool usually made of metal and wood. People use it to hit nails into wood. What is it?",
    image: "/uploads/prisma25_ing2_image3.png",
    options: {
      A: "Screwdriver",
      B: "Wrench",
      C: "Saw",
      D: "Hammer"
    },
    correct: "D",
    explanation: "Alat dari logam dan kayu yang berfungsi untuk memukul paku ke dalam kayu adalah palu (*hammer*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Mother is washing vegetables and plates in a place with water and a faucet. What is it?",
    image: "/uploads/prisma25_ing2_image4.png",
    options: {
      A: "Dish",
      B: "Stove",
      C: "Sink",
      D: "Ceiling"
    },
    correct: "C",
    explanation: "Tempat mencuci piring dan sayuran yang dilengkapi keran air di dapur disebut bak cuci piring (*sink* / wastafel).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "If the sun shines brightly tomorrow, we … a picnic in the park.",
    options: {
      A: "will have",
      B: "would have",
      C: "has",
      D: "having"
    },
    correct: "A",
    explanation: "Ini merupakan kalimat pengandaian tipe 1 (*First Conditional*): *If + Simple Present (shines), S + will + V1 (will have)*.",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "If Miss Evelin became my teacher, I …. very happy.",
    options: {
      A: "will be",
      B: "would be",
      C: "is",
      D: "was"
    },
    correct: "B",
    explanation: "Ini adalah kalimat pengandaian tipe 2 (*Second Conditional*): *If + Simple Past (became), S + would + V1 (would be)*.",
    difficulty: "MEDIUM"
  },
  {
    num: 28,
    question: "Find the same meaning as the underlined words below! (No. 28 - 29)\n\nMeitza : Hi, Dika. You look exhausted (28) after the basketball game.\nDika : Yes, I am really tired, but I feel satisfied because our team won.\nMeitza : That’s great! The match was exciting to watch.\nDika : Thank you. I’m grateful (29) for the support from my friends.\n\nQuestion 28: exhausted",
    options: {
      A: "energetic",
      B: "tired",
      C: "strong",
      D: "active"
    },
    correct: "B",
    explanation: "Kata *exhausted* bermakna amat lelah atau letih, bersinonim langsung dengan *tired*.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Question 29: grateful",
    options: {
      A: "careful",
      B: "hopeful",
      C: "helpful",
      D: "thankful"
    },
    correct: "D",
    explanation: "Kata *grateful* bermakna merasa bersyukur atau berterima kasih, sepadan dengan *thankful*.",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "Arrange these words into a good sentence!\npark – children – the – are – playing – in",
    options: {
      A: "The children are playing in the park",
      B: "In the park the children playing are",
      C: "The children are in the park playing",
      D: "Playing are the children in the park"
    },
    correct: "A",
    explanation: "Struktur kalimat bahasa Inggris yang gramatikal mengikuti pola Subjek (*The children*) + Kata Kerja Bentuk Sedang (*are playing*) + Keterangan Tempat (*in the park*).",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 3. CEO 2025 SEMIFINAL — BAHASA INGGRIS LEVEL 1
// -------------------------------------------------------------------------
const CEO_2025_ING_1: QuestionItem[] = [
  {
    num: 1,
    question: "What do you see in the picture?",
    image: "/uploads/ceo25_ing1_q1.png",
    options: {
      A: "He stops studying and have a rest.",
      B: "He does homework at home.",
      C: "He reads something on the book.",
      D: "He shows or explains something."
    },
    correct: "D",
    explanation: "Gambar stimulus menunjukkan seorang pengajar/pria yang berdiri di depan papan dan menunjuk diagram untuk menerangkan materi (*He shows or explains something*).",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "How to describe this image?",
    image: "/uploads/ceo25_ing1_q2.png",
    options: {
      A: "This person works on a farm.",
      B: "This person is famous and sing songs.",
      C: "This person makes you laugh at circus.",
      D: "This person takes care of your health."
    },
    correct: "C",
    explanation: "Gambar stimulus memperlihatkan sosok badut sirkus berhidung merah ceria yang bertugas menghibur dan membuat penonton tertawa (*This person makes you laugh at circus*).",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "The text is for questions number 3-6.\n\n\"Tom is going on a trip to the mountains. Tom needs to take his bag. The bag is small and brown. Tom opens the bag. Tom wants to put things in the bag. But the bag cannot close! Tom takes the boots out of the bag.\"\n\nWhere is Tom going?",
    options: {
      A: "to the city",
      B: "to the beach",
      C: "to the school",
      D: "to the mountain"
    },
    correct: "D",
    explanation: "Kalimat pertama teks menyatakan dengan jelas: *\"Tom is going on a trip to the mountains.\"* (Tom akan bepergian ke pegunungan).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Tom does not put . . . . in the bag",
    options: {
      A: "things",
      B: "boots",
      C: "trips",
      D: "bags"
    },
    correct: "B",
    explanation: "Karena tasnya tidak bisa ditutup, Tom mengeluarkan sepatu botnya (*Tom takes the boots out of the bag*), sehingga sepatu bot tidak jadi dimasukkan ke dalam tas.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "I want to ….. music.",
    options: {
      A: "listen",
      B: "stand",
      C: "drink",
      D: "bring"
    },
    correct: "A",
    explanation: "Kata kerja yang berkaitan dengan musik dan indra pendengaran adalah mendengarkan (*listen to music*).",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "“Luke, wash ….. hands!”",
    options: {
      A: "you",
      B: "your",
      C: "yours",
      D: "you’re"
    },
    correct: "B",
    explanation: "Kata ganti kepemilikan (*possessive adjective*) sebelum kata benda *hands* adalah *your* (*wash your hands!*).",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "You take shower in the …..",
    options: {
      A: "living-room",
      B: "bathroom",
      C: "bedroom",
      D: "kitchen"
    },
    correct: "B",
    explanation: "Aktivitas mandi (*take shower*) dilakukan di kamar mandi (*bathroom*).",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Arrange the words into a good sentence!\nSoccer – hobby – playing – my – is – with – friends",
    options: {
      A: "My friend hobby is playing with soccer",
      B: "My hobby is playing soccer with friends",
      C: "My friends hobby is with soccer playing",
      D: "My hobby is soccer playing with friends"
    },
    correct: "B",
    explanation: "Susunan kalimat yang tepat dan bermakna padu adalah *\"My hobby is playing soccer with friends\"* (Hobi saya bermain sepak bola bersama teman-teman).",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Dina wants to go to Surabaya by Argobromo train at 09:00 in the morning, so she goes to the…",
    options: {
      A: "Rail station",
      B: "Harbor",
      C: "Bus station",
      D: "Airport"
    },
    correct: "A",
    explanation: "Kereta api Argobromo (*train*) diberangkatkan dari stasiun kereta api (*rail station* / *train station*).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "The students didn’t go to … on Sunday.",
    options: {
      A: "Library",
      B: "Holiday",
      C: "School",
      D: "Shop"
    },
    correct: "C",
    explanation: "Hari Minggu (*Sunday*) adalah hari libur nasional sehingga para siswa tidak bersekolah (*didn't go to school*).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "“Gajah itu besar.” In English is….",
    options: {
      A: "The cow is big",
      B: "The elephant is big",
      C: "The sheep is big",
      D: "The elephant is small"
    },
    correct: "B",
    explanation: "Gajah diterjemahkan sebagai *elephant* dan besar adalah *big*, sehingga kalimatnya berbunyi *The elephant is big*.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Tina is a child who likes cleanliness. So She often … the room.",
    options: {
      A: "Sweeps",
      B: "Throw trash in the room",
      C: "Dirty",
      D: "Sleep"
    },
    correct: "A",
    explanation: "Anak yang mencintai kebersihan (*cleanliness*) rajin menyapu (*sweeps*) ruangan kamarnya.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Read the text below to answer questions 13 to 15 !\n\n\"It’s raining heavily today. Tora goes to school by car with her father. Usually Tora goes to school with Ryan by bicycle. Tora saw Ryan waiting for a taxi in front of the bus stop with his mother. Tora asked her father to stop the car at the bus stop. Tora opened the window...\"\n\nWhat ride does Tora usually take to school?",
    options: {
      A: "Taxi",
      B: "Bicycle",
      C: "Car",
      D: "Bus"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"Usually Tora goes to school with Ryan by bicycle.\"* Jadi biasanya Tora mengendarai sepeda (*bicycle*).",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Who took Tora in the car?",
    options: {
      A: "Tora’s Mother",
      B: "Tora’s Brother",
      C: "Tora’s Father",
      D: "Tora’s friend"
    },
    correct: "C",
    explanation: "Berdasarkan kalimat kedua teks: *\"Tora goes to school by car with her father.\"*",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Why is Ryan at the bus stop?",
    options: {
      A: "Because he is waiting for a taxi",
      B: "Because he is waiting for the bus",
      C: "Because he is waiting for Tora",
      D: "Because he is waiting for her father"
    },
    correct: "A",
    explanation: "Teks menyebutkan: *\"Tora saw Ryan waiting for a taxi in front of the bus stop with his mother.\"*",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "My brother has a son. He is my …",
    options: {
      A: "Cousin",
      B: "Niece",
      C: "Nephew",
      D: "Sister"
    },
    correct: "C",
    explanation: "Anak laki-laki dari saudara kandung laki-laki/perempuan adalah keponakan laki-laki (*nephew*). *Niece* = keponakan perempuan, *cousin* = sepupu.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "The items in the living room are …",
    options: {
      A: "Frying pan, spatula and salt",
      B: "Television, sofa and air freshener",
      C: "Spoons, forks and plates",
      D: "Bed, storage bench and sleeping pillows"
    },
    correct: "B",
    explanation: "Perabotan yang umum di ruang tamu/keluarga (*living room*) adalah televisi, sofa, dan pengharum ruangan (*air freshener*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Arrange into correct word: G - A - B - A - B - E - C",
    options: {
      A: "Eggplant",
      B: "Broccoli",
      C: "Cabbage",
      D: "Carrot"
    },
    correct: "C",
    explanation: "Huruf-huruf G-A-B-A-B-E-C disusun membentuk kata sayur kubis, yaitu *C-A-B-B-A-G-E* (Cabbage).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "I don't have legs. I have a long body. Who am I?",
    options: {
      A: "Snake",
      B: "Giraffe",
      C: "Hippo",
      D: "Lizard"
    },
    correct: "A",
    explanation: "Hewan melata bertubuh panjang dan tidak berkaki adalah ular (*snake*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Twelve plus eight is …",
    options: {
      A: "Sixteen",
      B: "Fourteen",
      C: "Twenty",
      D: "Seventeen"
    },
    correct: "C",
    explanation: "Operasi penjumlahan: $12 + 8 = 20$ (*twenty*).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "How many months are there in a year?",
    options: {
      A: "Eleven",
      B: "Twelve",
      C: "Thirteen",
      D: "Fourteen"
    },
    correct: "B",
    explanation: "Dalam satu tahun terdapat 12 bulan (*twelve months*).",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Sixty six plus seventy five equals ......",
    options: {
      A: "One hundred and forty one",
      B: "One hundred and fifty two",
      C: "Two hundred and sixty one",
      D: "One hundred and seventy two"
    },
    correct: "A",
    explanation: "Penjumlahan bilangan: $66 + 75 = 141$ (*one hundred and forty one*).",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "What time is it …..",
    image: "/uploads/ceo25_ing1_q23.png",
    options: {
      A: "Five o’clock",
      B: "It is sleeping time",
      C: "It is playing time",
      D: "Nine o’clock"
    },
    correct: "A",
    explanation: "Gambar stimulus jam dinding memperlihatkan jarum pendek menunjuk angka 5 dan jarum panjang menunjuk tepat angka 12, yang berarti pukul 5 tepat (*five o’clock*).",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "My father and mother have parents. They are my ….",
    options: {
      A: "parents",
      B: "grandparents",
      C: "children",
      D: "friends"
    },
    correct: "B",
    explanation: "Orang tua dari ayah dan ibu kita adalah kakek dan nenek kita (*grandparents*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "How does it taste ?",
    image: "/uploads/ceo25_ing1_q25.png",
    options: {
      A: "Big",
      B: "Red",
      C: "Three",
      D: "Sweet"
    },
    correct: "D",
    explanation: "Gambar stimulus menunjukkan es krim lezat. Rasa (*taste*) khas es krim adalah manis (*sweet*).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Mari : “Good afternoon, Susi!”\nSusi : “……………………....”",
    options: {
      A: "See you later",
      B: "See you again",
      C: "Good morning",
      D: "Good afternoon"
    },
    correct: "D",
    explanation: "Salam sapaan *Good afternoon* (selamat siang/sore) dibalas dengan sapaan yang sama yaitu *Good afternoon*.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Which animal says “meow”?",
    options: {
      A: "Calf",
      B: "Cow",
      C: "Cat",
      D: "Crow"
    },
    correct: "C",
    explanation: "Suara \"meong\" (*meow*) adalah suara khas dari kucing (*cat*).",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "The sky is ….",
    options: {
      A: "red",
      B: "blank",
      C: "blue",
      D: "pink"
    },
    correct: "C",
    explanation: "Warna langit pada siang hari yang cerah adalah biru (*blue*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "What is the opposite of Summer?",
    options: {
      A: "Monsoon",
      B: "Dark age",
      C: "Winter",
      D: "Eternal"
    },
    correct: "C",
    explanation: "Lawan musim dari musim panas (*Summer*) yang bersuhu hangat adalah musim dingin (*Winter*).",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "What is the plural form of fish?",
    options: {
      A: "Pisces",
      B: "Fish",
      C: "Fishing",
      D: "Fishes"
    },
    correct: "B",
    explanation: "Dalam bahasa Inggris baku, bentuk jamak (*plural form*) dari kata benda *fish* umumnya tetap *fish* (kecuali merujuk pada keanekaragaman spesies yang berbeda).",
    difficulty: "MEDIUM"
  }
];

// -------------------------------------------------------------------------
// 4. CEO 2025 SEMIFINAL — BAHASA INGGRIS LEVEL 2
// -------------------------------------------------------------------------
const CEO_2025_ING_2: QuestionItem[] = [
  {
    num: 1,
    question: "Read the conversation carefully!\nOzi : Hi Rama, how old are you?\nRama : I’m 8 years old, how about you Ozi?\nOzi : I’m 7 years old. When is your birthday?\nRama : My birthday is on August 8th, when is yours Ozi?\nOzi : My birthday is on November 11th. So, you’re older than me by a few months.\n\nWhat is the age difference between Ozi and Rama?",
    options: {
      A: "1 year",
      B: "8 years",
      C: "A few months",
      D: "11 months"
    },
    correct: "C",
    explanation: "Pada percakapan di baris terakhir, Ozi menyimpulkan secara eksplisit: *\"So, you’re older than me by a few months.\"* (Kamu lebih tua beberapa bulan dariku).",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Read the conversation carefully!\nAri : Hi, I’m Ari. How old are you?\nAji : Hi, I’m Aji. I’m 10 years old. How about you?\nAri : I’m 9 years old. My birthday is on January 15th.\nAji : Mine is on October 1st.\n\nWhat is Aji’s age?",
    options: {
      A: "1 year old",
      B: "10 years old",
      C: "9 years old",
      D: "11 years old"
    },
    correct: "B",
    explanation: "Aji menjawab dengan jelas: *\"Hi, I'm Aji. I'm 10 years old.\"* Jadi usia Aji adalah 10 tahun (*10 years old*).",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "What is on the teacher’s desk?",
    image: "/uploads/ceo25_ing2_q3.png",
    options: {
      A: "6 books and a globe.",
      B: "A book, a pencil, and a globe.",
      C: "7 computers, a pencil, and a ruler.",
      D: "A clock, a pencil, and a giant ruler."
    },
    correct: "B",
    explanation: "Gambar stimulus meja guru menampilkan sebuah buku (*a book*), sebuah pensil (*a pencil*), dan sebuah bola dunia tiruan (*a globe*).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Glass is made from ….",
    options: {
      A: "sand",
      B: "water",
      C: "metal",
      D: "silver"
    },
    correct: "A",
    explanation: "Bahan baku utama pembuatan kaca (*glass*) adalah pasir silika (*sand*) yang dilelehkan pada suhu tinggi.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "‘Are your parents very old?’",
    options: {
      A: "Not really, they’re middle-age.",
      B: "Yes, they’re middle-aged.",
      C: "Not really, they’re middle-aged.",
      D: "Yes, they’re not very old."
    },
    correct: "C",
    explanation: "Bentuk adjektiva yang gramatikal adalah *middle-aged* (berusia paruh baya). Jawaban sopan dan tepat untuk menyangkal usia yang sangat tua adalah *\"Not really, they're middle-aged.\"*",
    difficulty: "MEDIUM"
  },
  {
    num: 6,
    question: "What profession works in a laboratory?",
    options: {
      A: "Artist",
      B: "Scientist",
      C: "Carpenter",
      D: "Florist"
    },
    correct: "B",
    explanation: "Profesi yang bekerja melakukan penelitian dan eksperimen di laboratorium adalah ilmuwan (*scientist*). *Artist* = seniman, *carpenter* = tukang kayu, *florist* = penjual bunga.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Hana isn’t tall or short, she is…….",
    options: {
      A: "medium long",
      B: "medium tall",
      C: "medium high",
      D: "medium height"
    },
    correct: "D",
    explanation: "Untuk menyatakan tinggi badan yang sedang/rata-rata, istilah baku dalam bahasa Inggris adalah *of medium height* atau *medium height*.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Reyes : When did you make this beautiful picture?\nRami : I … it last night.",
    options: {
      A: "made",
      B: "took",
      C: "write",
      D: "make"
    },
    correct: "A",
    explanation: "Keterangan waktu *last night* mengindikasikan *Simple Past Tense*. Bentuk lampau (V2) dari *make* adalah *made*.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Please arrange the sentence below!\nI – help – must – to prepare – my parents – dinner.",
    options: {
      A: "To prepare my parents I must help dinner.",
      B: "I must help my parents to prepare dinner.",
      C: "I help to prepare must dinner my parents.",
      D: "I must dinner my parents to prepare help."
    },
    correct: "B",
    explanation: "Susunan kalimat yang tepat adalah *\"I must help my parents to prepare dinner\"* (Saya harus membantu orang tua saya menyiapkan makan malam).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "An example of obligation at home is ….",
    options: {
      A: "respect for the teacher",
      B: "clean the classroom",
      C: "reading in library",
      D: "clean up my toys after I play"
    },
    correct: "D",
    explanation: "Kewajiban di lingkungan rumah (*obligation at home*) adalah merapikan kembali mainan setelah selesai bermain (*clean up my toys after I play*).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "The text is for number 11 - 15\n\n\"Purple Car\nMs. Gita had a purple car. She loved her purple car. It was light purple. It had four doors. It was not a new car. It was an old car. But it had new tires. All four black tires were new. She felt safe with her new tires. They would not blow out. She could drive everywhere with her new tires.\nHer car was dirty. She needed to wash it. The windows were dirty. The doors were dirty. The hood was dirty. The trunk was dirty. The bumpers were dirty. The tires weren't dirty. They were new tires. They were black and shiny. They looked good. She did not have to wash her tires. But she did have to wash her car.\nShe put water into a bucket. She put a sponge into the bucket. She washed her car with the sponge. She dried her car with a towel. Her car was shiny purple now. It looked like new. Now her old car was as shiny as her new tires.\"\n\nWhat color is Ms. Gita’s car?",
    options: {
      A: "light purple",
      B: "dark purple",
      C: "yellow",
      D: "blue"
    },
    correct: "A",
    explanation: "Paragraf pertama menyatakan: *\"It was light purple.\"* (Warnanya ungu muda).",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Why did Ms. Gita feel safe with her car?",
    options: {
      A: "She loved her purple car.",
      B: "It had four doors.",
      C: "It had new tires.",
      D: "It was a new car."
    },
    correct: "C",
    explanation: "Teks menyatakan: *\"She felt safe with her new tires. They would not blow out.\"* Karena mobilnya memiliki ban-ban baru yang aman dari pecah ban.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Why did Ms. Gita need to wash her car?",
    options: {
      A: "The tires were dirty.",
      B: "The doors were dirty.",
      C: "The tires were black and shiny.",
      D: "It was an old car."
    },
    correct: "B",
    explanation: "Pada paragraf kedua disebutkan bagian-bagian mobil yang kotor: *\"The windows were dirty. The doors were dirty...\"* Ban mobilnya tidak kotor (*The tires weren't dirty*). Jadi alasan mencuci adalah pintu dan jendela yang kotor.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "According to the text, which part is there only one?",
    options: {
      A: "Window and bumper",
      B: "Tire and hood",
      C: "Door and tire",
      D: "Trunk and hood"
    },
    correct: "D",
    explanation: "Pada mobil standar, kap mesin (*hood*) dan bagasi (*trunk*) masing-masing hanya berjumlah satu buah, sedangkan jendela, ban, pintu, dan bumper berjumlah lebih dari satu.",
    difficulty: "MEDIUM"
  },
  {
    num: 15,
    question: "Which item do you NOT need to wash the car in the story?",
    options: {
      A: "bucket",
      B: "sponge",
      C: "towel",
      D: "broom"
    },
    correct: "D",
    explanation: "Ibu Gita menggunakan ember (*bucket*), spons (*sponge*), dan handuk (*towel*). Sapu (*broom*) tidak digunakan.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Choose the correct air transportation below!",
    options: {
      A: "Air balloon ; taxi ; plane",
      B: "Air balloon ; plane ; helicopter",
      C: "Ship ; submarine ; ferry",
      D: "Bus ; truck ; train"
    },
    correct: "B",
    explanation: "Balon udara (*air balloon*), pesawat (*plane*), dan helikopter (*helicopter*) seluruhnya merupakan wahana transportasi udara.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Read the text and answer question number 17 – 18!\n\n\"Hello, my name is Ginny. I want to tell you about one of my favorite transportation. It’s name is submarine. Well, it is water transportation. It is modern and sophisticated. It can dive in the water and float on the water too. It’s a naval warfare weapon.\"\n\nThe transportation in the text above is…",
    options: {
      A: "Motorcycle",
      B: "Submarine",
      C: "Ship",
      D: "Plane"
    },
    correct: "B",
    explanation: "Teks secara gamblang memperkenalkan kapal selam (*submarine*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "It is ….. and …. transportation.",
    options: {
      A: "Water ; Land",
      B: "Modern ; Sophisticated",
      C: "Water ; Air",
      D: "Air ; Land"
    },
    correct: "B",
    explanation: "Kutipan dari teks: *\"It is modern and sophisticated.\"* (Modern dan canggih).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "The text is for questions number 19 to 21.\n\n\"John and Dhoni go to the beach on holiday. At the beach, they play volleyball, swim in the sea, and build a sandcastle. There are many seashells and crabs at the beach. John sees a sea star when he swims in the sea. The sea star is blue. It looks beautiful.\"\n\nWhat do John and Dhoni do at the beach?",
    options: {
      A: "They play volleyball, swim, and build sandcastle.",
      B: "They play volleyball and build sandcastle.",
      C: "They play volleyball and see the sea star.",
      D: "They play volleyball, swim, and see seashells."
    },
    correct: "A",
    explanation: "Aktivitas yang mereka lakukan bersama adalah bermain voli pantai, berenang di laut, dan membangun istana pasir (*They play volleyball, swim, and build a sandcastle*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "There are many … at the beach.",
    options: {
      A: "Crabs",
      B: "Seashells",
      C: "Sea stars and crabs",
      D: "Seashells and crabs"
    },
    correct: "D",
    explanation: "Teks menyatakan: *\"There are many seashells and crabs at the beach.\"* (Banyak cangkang kerang dan kepiting).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "What does John see when he swims in the sea?",
    options: {
      A: "She sees a seashell",
      B: "She sees a sea star",
      C: "He sees a seashell",
      D: "He sees a sea star"
    },
    correct: "D",
    explanation: "Teks menyatakan: *\"John sees a sea star when he swims in the sea.\"* John adalah laki-laki (*He*), sehingga kalimatnya *He sees a sea star*.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "What is a public space?",
    options: {
      A: "A space that is only for the use of one person.",
      B: "A space that is only for the use of a family.",
      C: "A space that is open for anyone to use.",
      D: "A space that is closed to the public."
    },
    correct: "C",
    explanation: "Ruang publik (*public space*) didefinisikan sebagai area atau ruang terbuka yang dapat diakses dan digunakan oleh seluruh lapisan masyarakat (*open for anyone to use*).",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Mr. Dodi pays Rp. 50.000,00 and he gets Rp. 35.000,00 as the change. It means Mr. Dodi has to pay ....",
    options: {
      A: "Thirty five thousand rupiahs",
      B: "Fifty thousand rupiahs",
      C: "Fifteen thousand rupiahs",
      D: "Eighty five thousand rupiahs"
    },
    correct: "C",
    explanation: "Biaya yang harus dibayar = Pembayaran - Kembalian = Rp50.000 - Rp35.000 = Rp15.000 (*fifteen thousand rupiahs*).",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "1995 in English words is ....",
    options: {
      A: "One thousand nine nine and fifty",
      B: "One thousand nineteen hundred and five",
      C: "One thousand ninety nine hundred and five",
      D: "One thousand nine hundred and ninety five"
    },
    correct: "D",
    explanation: "Angka 1995 dieja sebagai *one thousand nine hundred and ninety five*.",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Sean : I feel so tired. ……………………\nNeil : Did you finish all your homework last night?\nSean : Yes. I know the deadline is still next month, but I finished them quickly. I also watched a soccer match. It was fun.\nNeil : You are a football fan, aren’t you?\nSean : Not really.",
    options: {
      A: "I almost fell asleep during the day.",
      B: "How can you look so fresh the whole day?",
      C: "My eyes are wide open.",
      D: "How can I feel like this?"
    },
    correct: "A",
    explanation: "Pernyataan yang konsisten dengan rasa lelah akibat begadang semalam adalah *\"I almost fell asleep during the day\"* (Saya hampir tertidur di siang hari).",
    difficulty: "MEDIUM"
  },
  {
    num: 26,
    question: "Spring is the season when flowers …. and the weather starts to get warmer.",
    options: {
      A: "wither",
      B: "wilt",
      C: "dry",
      D: "bloom"
    },
    correct: "D",
    explanation: "Musim semi (*spring*) ditandai dengan bermekarannya bunga-bunga (*flowers bloom*). *Wither* / *wilt* = layu.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "“Ouch! I hurt my ankle.”\nThe word ankle means …",
    options: {
      A: "Joint between shoulder and arm",
      B: "Joint between lower leg and thigh",
      C: "Joint between foot and lower leg",
      D: "Joint between arm and hand"
    },
    correct: "C",
    explanation: "Pergelangan kaki (*ankle*) adalah sendi penghubung antara telapak kaki dan tungkai kaki bawah (*joint between foot and lower leg*).",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "The opposite of North is …",
    options: {
      A: "East",
      B: "South",
      C: "North East",
      D: "West"
    },
    correct: "B",
    explanation: "Lawan arah mata angin utara (*North*) adalah selatan (*South*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Mr. Eman is a teacher.\nThe negative form is ...",
    options: {
      A: "Mr. Eman is not a teacher",
      B: "Mr. Eman not is a teacher",
      C: "Is Mr. Eman a teacher?",
      D: "Mr. Eman is not a student"
    },
    correct: "A",
    explanation: "Bentuk kalimat negatif dari kalimat nominal yang menggunakan to be *is* adalah dengan menambahkan *not* tepat setelah *is*: *Mr. Eman is not a teacher*.",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "We use a frying pan for ...",
    options: {
      A: "Boiling water",
      B: "Cutting something",
      C: "Washing dishes",
      D: "Frying food"
    },
    correct: "D",
    explanation: "Wajan penggorengan (*frying pan*) digunakan untuk menggoreng makanan (*frying food*). Merebus air menggunakan ketel (*kettle*) atau panci (*pot*).",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 5. FINAL NASIONAL ORION 2026 — MATEMATIKA LEVEL B (KELAS 3-4)
// -------------------------------------------------------------------------
const ORION_2026_MTK_B: QuestionItem[] = [
  {
    num: 1,
    question: "Hasil dari $(3.405 + 12.025) - (10.391 - 109) = \\dots$",
    options: {
      A: "5.148",
      B: "5.234",
      C: "6.612",
      D: "6.800"
    },
    correct: "A",
    explanation: "1. Hitung suku pertama: $3.405 + 12.025 = 15.430$\n2. Hitung suku kedua: $10.391 - 109 = 10.282$\n3. Kurangkan: $15.430 - 10.282 = 5.148$.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Hasil dari $5\\text{ gross} - 13\\text{ lusin} + 25\\text{ buah} = \\dots\\text{ buah}$",
    options: {
      A: "720",
      B: "589",
      C: "18",
      D: "786"
    },
    correct: "B",
    explanation: "1. $1\\text{ gross} = 144\\text{ buah} \\implies 5\\text{ gross} = 5 \\times 144 = 720\\text{ buah}$.\n2. $1\\text{ lusin} = 12\\text{ buah} \\implies 13\\text{ lusin} = 13 \\times 12 = 156\\text{ buah}$.\n3. Total $= 720 - 156 + 25 = 564 + 25 = 589\\text{ buah}$.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Pak Joko membeli $2\\frac{1}{2}\\text{ kg}$ beras dan $1\\frac{1}{4}\\text{ kg}$ bawang putih. Berat total belanjaan Pak Joko adalah...",
    options: {
      A: "$3\\text{ kg}$",
      B: "$3\\frac{3}{4}\\text{ kg}$",
      C: "$4\\text{ kg}$",
      D: "$4\\frac{1}{4}\\text{ kg}$"
    },
    correct: "B",
    explanation: "Jumlah berat $= 2\\frac{1}{2} + 1\\frac{1}{4} = \\frac{5}{2} + \\frac{5}{4} = \\frac{10}{4} + \\frac{5}{4} = \\frac{15}{4} = 3\\frac{3}{4}\\text{ kg}$.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Kakak Eleena membeli $2\\text{ rim}$ kertas HVS untuk belajar kelompok. Enam ratus lima puluh lembar sudah terpakai, dan 38 lembar telah terbuang karena kesalahan tulis. Sisa kertas kakak adalah...",
    options: {
      A: "132 lembar",
      B: "610 lembar",
      C: "312 lembar",
      D: "612 lembar"
    },
    correct: "C",
    explanation: "1. $1\\text{ rim} = 500\\text{ lembar} \\implies 2\\text{ rim} = 1.000\\text{ lembar}$.\n2. Kertas berkurang: $650 + 38 = 688\\text{ lembar}$.\n3. Sisa kertas $= 1.000 - 688 = 312\\text{ lembar}$.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Diberikan empat pecahan: $0,8$; $\\frac{1}{2}$; $12\\%$; dan $\\frac{1}{4}$. Urutan pecahan-pecahan tersebut dari yang terkecil adalah …",
    options: {
      A: "$0,8\\ ;\\ \\frac{1}{2}\\ ;\\ \\frac{1}{4}\\ ;\\ 12\\%$",
      B: "$12\\%\\ ;\\ \\frac{1}{4}\\ ;\\ \\frac{1}{2}\\ ;\\ 0,8$",
      C: "$0,8\\ ;\\ \\frac{1}{4}\\ ;\\ \\frac{1}{2}\\ ;\\ 12\\%$",
      D: "$\\frac{1}{4}\\ ;\\ \\frac{1}{2}\\ ;\\ 12\\%\\ ;\\ 0,8$"
    },
    correct: "B",
    explanation: "Konversikan seluruh pecahan ke bentuk desimal/persen:\n- $12\\% = 0,12$\n- $\\frac{1}{4} = 0,25 = 25\\%$\n- $\\frac{1}{2} = 0,50 = 50\\%$\n- $0,8 = 0,80 = 80\\%$\nUrutan dari terkecil ke terbesar: $12\\% < \\frac{1}{4} < \\frac{1}{2} < 0,8$.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Nenek Sinah mempunyai beberapa buah rambutan dan beberapa orang cucu. Jika setiap cucu mendapat masing-masing 4 buah rambutan, maka bersisa 4 buah. Sedangkan jika setiap cucu mendapat 6 buah rambutan, ada seorang cucu yang tidak kebagian sama sekali. Banyaknya rambutan dan cucu Nenek Sinah berturut-turut adalah …",
    options: {
      A: "25 rambutan dan 7 cucu",
      B: "24 rambutan dan 5 cucu",
      C: "25 rambutan dan 4 cucu",
      D: "24 rambutan dan 6 cucu"
    },
    correct: "B",
    explanation: "Misalkan banyak cucu $= c$ dan banyak rambutan $= R$.\n- Dari kondisi 1: $R = 4c + 4$\n- Dari kondisi 2: $R = 6(c - 1) = 6c - 6$\nSamakan kedua persamaan:\n$4c + 4 = 6c - 6 \\implies 2c = 10 \\implies c = 5\\text{ cucu}$.\nJumlah rambutan $R = 4(5) + 4 = 24\\text{ buah}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 7,
    question: "Banyaknya simetri putar yang dimiliki oleh bangun jajaran genjang adalah ....",
    options: {
      A: "2",
      B: "1",
      C: "Tidak punya simetri putar",
      D: "Semua salah"
    },
    correct: "A",
    explanation: "Jajaran genjang memiliki simetri putar tingkat 2 (dapat menempati bingkainya pada putaran $180^\\circ$ dan $360^\\circ$). Jajaran genjang tidak memiliki simetri lipat.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Aku adalah sebuah bilangan. Jika aku dibagi oleh 16 maka hasilnya 8. Jika $a$ adalah suatu bilangan yang 30 kurangnya dari aku, maka nilai $a$ adalah .....",
    options: {
      A: "68",
      B: "98",
      C: "108",
      D: "118"
    },
    correct: "B",
    explanation: "Misalkan bilangan itu $x$.\n$x : 16 = 8 \\implies x = 8 \\times 16 = 128$.\nNilai $a = x - 30 = 128 - 30 = 98$.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Satu ember dapat diisi penuh oleh 24 botol. Sedangkan satu botol dapat diisi penuh oleh 56 kelereng. Jika kita mempunyai 11.200 butir kelereng, berapa jumlah ember yang dibutuhkan untuk menampung seluruh kelereng tersebut?",
    options: {
      A: "8 ember",
      B: "8,5 ember",
      C: "9 ember",
      D: "10 ember"
    },
    correct: "C",
    explanation: "1. Kapasitas 1 ember $= 24 \\times 56 = 1.344\\text{ kelereng}$.\n2. Kebutuhan ember $= 11.200 : 1.344 \\approx 8,33$ ember.\n3. Karena kelereng harus tertampung seluruhnya (tidak boleh tercecer), maka dibutuhkan 9 ember utuh.",
    difficulty: "MEDIUM"
  },
  {
    num: 10,
    question: "Diketahui persegi panjang ABCD dengan perbandingan $P : L = 3 : 0,5$ dan kelilingnya 28 cm. Panjang $P$ dan lebar $L$ berturut-turut adalah …",
    options: {
      A: "12 cm dan 2 cm",
      B: "10 cm dan 4 cm",
      C: "8 cm dan 6 cm",
      D: "14 cm dan 2 cm"
    },
    correct: "A",
    explanation: "1. Keliling $= 2(P + L) = 28 \\implies P + L = 14\\text{ cm}$.\n2. Rasio $P : L = 3 : 0,5 = 6 : 1$.\n3. Total bagian rasio $= 6 + 1 = 7$ bagian.\n4. $P = \\frac{6}{7} \\times 14 = 12\\text{ cm}$ dan $L = \\frac{1}{7} \\times 14 = 2\\text{ cm}$.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Hasil dari $2026 - 26 + 2 \\times 0 = \\dots$",
    options: {
      A: "2222",
      B: "2040",
      C: "2000",
      D: "0"
    },
    correct: "C",
    explanation: "Dahulukan operasi perkalian: $2 \\times 0 = 0$.\nKemudian hitung pengurangan dan penjumlahan: $2026 - 26 + 0 = 2000$.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Diketahui persamaan $32 + 34 + P = 200 - P$. Nilai $P$ adalah….",
    options: {
      A: "134",
      B: "97",
      C: "77",
      D: "67"
    },
    correct: "D",
    explanation: "Sederhanakan persamaan:\n$66 + P = 200 - P$\n$P + P = 200 - 66$\n$2P = 134 \\implies P = 67$.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Terdapat sejumlah penumpang di dalam bis. Di halte pertama 19 orang turun dan 12 orang naik, sehingga penumpang yang tersisa menjadi 55 orang. Jumlah penumpang pada awal keberangkatan bis adalah…",
    options: {
      A: "62 orang",
      B: "60 orang",
      C: "58 orang",
      D: "56 orang"
    },
    correct: "A",
    explanation: "Misalkan penumpang awal $= x$.\n$x - 19 + 12 = 55$\n$x - 7 = 55 \\implies x = 55 + 7 = 62\\text{ orang}$.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Rian mempunyai 7 buah apel. Ia membagikan apel tersebut kepada 9 orang temannya di mana masing-masing mendapat $\\frac{1}{2}$ bagian dari sebuah apel. Sisa apel yang dimiliki Rian adalah…",
    options: {
      A: "2 buah",
      B: "2,5 buah",
      C: "3,5 buah",
      D: "4,5 buah"
    },
    correct: "B",
    explanation: "Banyak apel yang dibagikan $= 9 \\times \\frac{1}{2} = 4,5\\text{ buah}$.\nSisa apel Rian $= 7 - 4,5 = 2,5\\text{ buah}$.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Ada berapa segitiga yang terlihat pada gambar bangun geometri di bawah ini?",
    image: "/uploads/orion26_mb_q15.png",
    options: {
      A: "8",
      B: "12",
      C: "14",
      D: "16"
    },
    correct: "B",
    explanation: "Pada gambar bangun segi enam beraturan dengan diagonal berpotongan, terdapat 6 buah segitiga satuan kecil di sisi luar dan 6 segitiga gabungan yang lebih besar yang mencakup pusat bangun, menghasilkan total 12 segitiga.",
    difficulty: "MEDIUM"
  },
  {
    num: 16,
    question: "Jumlah angka-angka pada tahun 2019 adalah $12$ ($2 + 0 + 1 + 9 = 12$). Berapa tahun lagi setelah tahun 2019 angka-angka penyusun tahun tersebut kembali berjumlah 12?",
    options: {
      A: "11 tahun",
      B: "10 tahun",
      C: "9 tahun",
      D: "8 tahun"
    },
    correct: "C",
    explanation: "Cari tahun setelah 2019 yang memiliki jumlah digit 12:\n- 2020: $2+0+2+0 = 4$\n- 2021: $2+0+2+1 = 5$\n...\n- 2028: $2+0+2+8 = 12$.\nTahun berikutnya adalah tahun 2028. Selisihnya $= 2028 - 2019 = 9\\text{ tahun lagi}$.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Umur Ali 12 tahun, umur Budi 15 tahun, dan umur Ciko 5 tahun lebih muda dari Ali. Berapakah umur Ciko ketika kelak jumlah umur Ali dan Budi mencapai 35 tahun?",
    options: {
      A: "4 tahun",
      B: "7 tahun",
      C: "11 tahun",
      D: "13 tahun"
    },
    correct: "C",
    explanation: "1. Umur Ciko sekarang $= 12 - 5 = 7\\text{ tahun}$.\n2. Jumlah umur Ali dan Budi sekarang $= 12 + 15 = 27\\text{ tahun}$.\n3. Waktu yang dibutuhkan hingga jumlah umur mereka 35 tahun: $(35 - 27) : 2 = 8 : 2 = 4\\text{ tahun lagi}$ (karena masing-masing bertambah umur).\n4. Umur Ciko saat itu $= 7 + 4 = 11\\text{ tahun}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 18,
    question: "Mia mempunyai 39 jeruk yang akan dimasukkan ke dalam 9 kantong. Setiap kantong hanya berisi tiga atau lima jeruk. Jika semua jeruk termuat tanpa sisa, banyak kantong yang berisi lima buah jeruk adalah…",
    options: {
      A: "4 kantong",
      B: "5 kantong",
      C: "6 kantong",
      D: "7 kantong"
    },
    correct: "C",
    explanation: "Misalkan $x$ kantong berisi 5 jeruk dan $y$ kantong berisi 3 jeruk.\n$x + y = 9 \\implies y = 9 - x$\n$5x + 3y = 39$\n$5x + 3(9 - x) = 39$\n$2x + 27 = 39 \\implies 2x = 12 \\implies x = 6\\text{ kantong}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 19,
    question: "Dari daftar bilangan $3, 5, 2, 6, 1, 4, 7$, Naya memilih 3 angka berbeda yang berjumlah 8. Dari daftar yang sama, Rina memilih 3 angka berbeda yang berjumlah 7. Angka yang sama-sama dipilih oleh Naya dan Rina adalah…",
    options: {
      A: "1 dan 2",
      B: "2 dan 3",
      C: "3 dan 4",
      D: "Tidak ada"
    },
    correct: "A",
    explanation: "1. Angka Rina (jumlah 7): Kombinasi 3 angka berbeda terkecil dari himpunan tersebut adalah $1 + 2 + 4 = 7$ (ini satu-satunya pilihan).\n2. Angka Naya (jumlah 8): Kombinasinya bisa $1 + 2 + 5 = 8$ atau $1 + 3 + 4 = 8$.\n3. Jika Naya memilih $\\{1, 2, 5\\}$ dan Rina memilih $\\{1, 2, 4\\}$, angka yang sama-sama mereka pilih adalah 1 dan 2.",
    difficulty: "MEDIUM"
  },
  {
    num: 20,
    question: "Ridho membeli sebuah bola kasti dan pemukulnya dengan total harga Rp210.000,00. Harga pemukul kasti lebih mahal Rp50.000,00 daripada bola kasti. Berapakah harga sebuah bola kasti?",
    options: {
      A: "Rp100.000,00",
      B: "Rp80.000,00",
      C: "Rp60.000,00",
      D: "Rp50.000,00"
    },
    correct: "B",
    explanation: "Misalkan harga bola $= B$ dan harga pemukul $= P = B + 50.000$.\n$B + (B + 50.000) = 210.000$\n$2B = 160.000 \\implies B = \\text{Rp}80.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "Sebuah susunan bentuk geometri terdiri dari 15 lingkaran dan segitiga. Paling sedikit berapa banyak bentuk yang harus dihapus agar hanya tersisa tepat satu jenis bentuk saja?",
    options: {
      A: "11",
      B: "10",
      C: "9",
      D: "8"
    },
    correct: "B",
    explanation: "Untuk menyisakan hanya satu jenis bentuk dengan menghapus sesedikit mungkin, kita harus mempertahankan jenis bentuk yang jumlahnya paling banyak dan menghapus seluruh bentuk jenis minoritas yang berjumlah 10 buah.",
    difficulty: "MEDIUM"
  },
  {
    num: 22,
    question: "Banyaknya bilangan bulat antara 0 sampai 1000 yang hanya terdiri dari angka 0 dan 2 adalah…",
    options: {
      A: "8",
      B: "7",
      C: "6",
      D: "4"
    },
    correct: "B",
    explanation: "Daftar bilangan yang memenuhi antara 0 dan 1000:\n- 1 digit: 2 (1 bilangan)\n- 2 digit: 20, 22 (2 bilangan)\n- 3 digit: 200, 202, 220, 222 (4 bilangan)\nTotal bilangan $= 1 + 2 + 4 = 7$ bilangan.",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Setiap menyebut satu bilangan, Ali membutuhkan waktu 2 detik. Berapa lama waktu yang ia butuhkan untuk menyebut bilangan 19, 20, 21, 22, dan seterusnya secara berurutan sampai 89?",
    options: {
      A: "1 menit 10 detik",
      B: "1 menit 11 detik",
      C: "2 menit 20 detik",
      D: "2 menit 22 detik"
    },
    correct: "D",
    explanation: "1. Banyak bilangan yang disebut dari 19 sampai 89 $= 89 - 19 + 1 = 71$ bilangan.\n2. Waktu total $= 71 \\times 2 = 142\\text{ detik}$.\n3. Konversi ke menit: $142\\text{ detik} = 2\\text{ menit } 22\\text{ detik}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "Wisnu memotong sebuah pizza menjadi 5 bagian yang sama. Kemudian, ia memotong kembali tiap bagian tersebut menjadi 3 potongan kecil. Wisnu lalu memakan 6 potong kecil. Berapa bagian yang dimakan Wisnu dari keseluruhan pizza?",
    options: {
      A: "$\\frac{1}{3}$",
      B: "$\\frac{2}{5}$",
      C: "$\\frac{3}{5}$",
      D: "$\\frac{1}{2}$"
    },
    correct: "B",
    explanation: "1. Total seluruh potongan kecil $= 5 \\times 3 = 15$ potong.\n2. Bagian yang dimakan $= \\frac{6}{15} = \\frac{2}{5}$ bagian.",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Terdapat dua keranjang buah yang masing-masing berisi 13 dan 24 buah rambutan. Seluruh rambutan tersebut akan dibagikan rata ke dalam 7 kantong. Berapa banyak buah rambutan tambahan paling sedikit yang dibutuhkan agar setiap kantong terisi jumlah buah yang sama tanpa ada sisa?",
    options: {
      A: "5 buah",
      B: "3 buah",
      C: "2 buah",
      D: "1 buah"
    },
    correct: "A",
    explanation: "1. Total rambutan sekarang $= 13 + 24 = 37$ buah.\n2. Kelipatan 7 terdekat di atas 37 adalah $7 \\times 6 = 42$.\n3. Tambahan yang diperlukan $= 42 - 37 = 5$ buah rambutan.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Balon dijual dalam paket berisi 2, 4, atau 8 buah per pak. Nena ingin membeli tepat 70 buah balon. Berapakah jumlah paket (pak) balon paling sedikit yang harus dibeli Nena?",
    options: {
      A: "9 pak",
      B: "10 pak",
      C: "11 pak",
      D: "12 pak"
    },
    correct: "B",
    explanation: "Untuk meminimalkan jumlah pak, prioritaskan pak terbesar (isi 8):\n- Maksimal pak isi 8: $8 \\times 8 = 64$ balon (8 pak)\n- Sisa kebutuhan $= 70 - 64 = 6$ balon\n- 6 balon dapat dibentuk dari: 1 pak isi 4 dan 1 pak isi 2 (2 pak)\nTotal pak $= 8 + 1 + 1 = 10$ pak balon.",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "Empat titik berada pada satu garis lurus yaitu A, B, C, dan D yang letaknya tidak berurutan. Diketahui panjang $AB = 1$, $BC = 2$, $CD = 3$, dan $DA = 4$. Pasangan titik manakah yang memiliki jarak terpanjang?",
    options: {
      A: "A dan D",
      B: "B dan D",
      C: "B dan C",
      D: "A dan C"
    },
    correct: "B",
    explanation: "Konfigurasi koordinat pada garis:\nMisalkan $A = 0$, maka $B = 1$ ($AB = 1$).\nKarena $BC = 2$, titik $C$ bisa di $-1$ atau $3$.\nKarena $DA = 4$, titik $D$ bisa di $-4$ atau $4$.\nJika $C = 3$ dan $D = -4$, maka $CD = 7 \\neq 3$.\nJika $C = -1$ dan $D = 4$, maka $CD = |4 - (-1)| = 5 \\neq 3$.\nJika urutan titiknya adalah D, C, A, B dengan $D = -4, A = 0, B = 1, C = -1$: maka $CD = |-1 - (-4)| = 3$ (cocok!), $DA = |0 - (-4)| = 4$ (cocok!), $AB = 1$ (cocok!), $BC = |-1 - 1| = 2$ (cocok!).\nJarak antara titik B (koordinat 1) dan D (koordinat -4) adalah $|1 - (-4)| = 5$, yang merupakan jarak terjauh.",
    difficulty: "HARD"
  },
  {
    num: 28,
    question: "Sebuah dadu standar memiliki mata dadu 1 sampai 6 di setiap sisinya di mana jumlah titik pada dua sisi yang berlawanan selalu sama dengan 7 ($1+6, 2+5, 3+4$). Sisi yang berlawanan dengan angka 2 adalah angka …",
    options: {
      A: "3",
      B: "4",
      C: "5",
      D: "6"
    },
    correct: "C",
    explanation: "Karena jumlah titik pada sisi-sisi yang saling berhadapan adalah 7, maka sisi yang berhadapan dengan angka 2 adalah $7 - 2 = 5$.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Toko A menjual 4 buku dengan harga Rp50.000,00 dan toko B menjual 5 buku dengan harga Rp65.000,00. Anita ingin membeli 20 buku. Agar mendapat harga yang lebih murah, ia sebaiknya pergi ke toko mana dan berapa selisih total harga antara kedua toko tersebut?",
    options: {
      A: "Toko A, selisih Rp5.000,00",
      B: "Toko A, selisih Rp10.000,00",
      C: "Toko B, selisih Rp5.000,00",
      D: "Toko B, selisih Rp10.000,00"
    },
    correct: "B",
    explanation: "1. Toko A: 20 buku $= 5 \\times 4\\text{ buku} = 5 \\times \\text{Rp}50.000 = \\text{Rp}250.000,00$.\n2. Toko B: 20 buku $= 4 \\times 5\\text{ buku} = 4 \\times \\text{Rp}65.000 = \\text{Rp}260.000,00$.\n3. Toko A lebih murah dengan selisih harga: $\\text{Rp}260.000 - \\text{Rp}250.000 = \\text{Rp}10.000,00$.",
    difficulty: "MEDIUM"
  },
  {
    num: 30,
    question: "Pak Ridwan memiliki 10 lembar uang Rp10.000,00, 6 lembar uang Rp20.000,00, dan 2 lembar uang Rp50.000,00. Sisa uang Pak Ridwan setelah disumbangkan sebesar Rp150.000,00 adalah …",
    options: {
      A: "Rp70.000,00",
      B: "Rp190.000,00",
      C: "Rp170.000,00",
      D: "Rp200.000,00"
    },
    correct: "C",
    explanation: "1. Total uang mula-mula:\n- $10 \\times \\text{Rp}10.000 = \\text{Rp}100.000$\n- $6 \\times \\text{Rp}20.000 = \\text{Rp}120.000$\n- $2 \\times \\text{Rp}50.000 = \\text{Rp}100.000$\nTotal $= \\text{Rp}320.000,00$.\n2. Sisa uang setelah disumbangkan $= 320.000 - 150.000 = \\text{Rp}170.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 31,
    question: "Perhatikan gambar timbangan di bawah ini!\n\nEmpat balok dengan berat masing-masing 10 gram, 20 gram, 30 gram, dan 40 gram diletakkan pada susunan tuas timbangan. Balok manakah yang beratnya 30 gram?",
    image: "/uploads/orion26_mb_q31.png",
    options: {
      A: "Balok A",
      B: "Balok B",
      C: "Balok C",
      D: "Balok D"
    },
    correct: "B",
    explanation: "Berdasarkan prinsip kesetimbangan momen tuas fisika, beban berat didistribusikan sedemikian rupa sehingga lengan tuas seimbang. Balok yang memiliki massa tepat 30 gram berada pada posisi balok B.",
    difficulty: "HARD"
  },
  {
    num: 32,
    question: "Terdapat 3 persegi berdampingan seperti pada gambar. Panjang sisi persegi yang paling kecil adalah 8 cm. Keliling gabungan bangun tersebut adalah … cm.",
    image: "/uploads/orion26_mb_q32.png",
    options: {
      A: "86 cm",
      B: "88 cm",
      C: "90 cm",
      D: "92 cm"
    },
    correct: "B",
    explanation: "Dengan menentukan panjang sisi ketiga persegi yang bertingkat dari sisi terkecil 8 cm, keliling batas luar bangun gabungan tersebut dihitung dengan menjumlahkan seluruh segmen luar yang membentuk kontur gambar, menghasilkan total 88 cm.",
    difficulty: "HARD"
  },
  {
    num: 33,
    question: "Pada bulan November, Dani mulai menghitung bulan mundur hingga ia berusia genap 17 tahun untuk membuat KTP. Jika jumlah bulan yang dihitung Dani adalah 38 bulan, pada bulan apakah Dani tepat berusia 17 tahun?",
    options: {
      A: "November",
      B: "Desember",
      C: "Januari",
      D: "Februari"
    },
    correct: "C",
    explanation: "1. 38 bulan setara dengan 3 tahun lebih 2 bulan ($38 = 3 \\times 12 + 2$).\n2. Tiga tahun dari bulan November akan kembali ke bulan November.\n3. Tambahkan sisa 2 bulan dari November: Desember (1), Januari (2).\nJadi Dani berusia 17 tahun pada bulan Januari.",
    difficulty: "MEDIUM"
  },
  {
    num: 34,
    question: "Perhatikan gambar sudut di bawah ini! Jika garis A tegak lurus terhadap garis B ($90^\\circ$) dan salah satu sudut penyusunnya adalah $59^\\circ$, berapakah nilai $x$?",
    image: "/uploads/orion26_mb_q34.png",
    options: {
      A: "$31^\\circ$",
      B: "$30^\\circ$",
      C: "$29^\\circ$",
      D: "$28^\\circ$"
    },
    correct: "A",
    explanation: "Dua garis tegak lurus membentuk sudut siku-siku sebesar $90^\\circ$. Sudut-sudut yang saling berpenyiku berjumlah $90^\\circ$:\n$x + 59^\\circ = 90^\\circ \\implies x = 90^\\circ - 59^\\circ = 31^\\circ$.",
    difficulty: "EASY"
  },
  {
    num: 35,
    question: "Seorang peserta ujian menjawab 30 soal dengan benar dan 8 soal salah dari total 50 butir soal. Jika setiap jawaban benar diberi skor $+4$, salah diberi skor $-2$, dan soal tidak dijawab diberi skor 0, berapakah perolehan total skor peserta tersebut?",
    options: {
      A: "104",
      B: "128",
      C: "144",
      D: "166"
    },
    correct: "A",
    explanation: "1. Skor jawaban benar $= 30 \\times 4 = 120$\n2. Skor jawaban salah $= 8 \\times (-2) = -16$\n3. Soal tidak dijawab $= 50 - (30 + 8) = 12$ soal, skor $= 12 \\times 0 = 0$\n4. Total skor akhir $= 120 - 16 + 0 = 104$.",
    difficulty: "EASY"
  }
];

// =========================================================================
// ARRAY DEFINISI BATCH 6
// =========================================================================
const BATCH_PACKAGES: BatchDefinition[] = [
  {
    pkgId: 'pkg_prisma_2025_ing_1',
    pkgTitle: 'Olimpiade PRISMA 2025 — Bahasa Inggris Level 1 (Bergambar)',
    pkgSlug: 'olimpiade-prisma-2025-bahasa-inggris-level-1',
    categoryId: 'cat_olimpiade_prisma',
    topicId: 'top_prisma_2025_ing_1',
    topicName: 'Bahasa Inggris Level 1 PRISMA 2025',
    durationMinutes: 60,
    questions: PRISMA_2025_ING_1
  },
  {
    pkgId: 'pkg_prisma_2025_ing_2',
    pkgTitle: 'Olimpiade PRISMA 2025 — Bahasa Inggris Level 2 (Bergambar)',
    pkgSlug: 'olimpiade-prisma-2025-bahasa-inggris-level-2',
    categoryId: 'cat_olimpiade_prisma',
    topicId: 'top_prisma_2025_ing_2',
    topicName: 'Bahasa Inggris Level 2 PRISMA 2025',
    durationMinutes: 60,
    questions: PRISMA_2025_ING_2
  },
  {
    pkgId: 'pkg_ceo_2025_ing_1',
    pkgTitle: 'Olimpiade Semifinal CEO 2025 — Bahasa Inggris Level 1 (Bergambar)',
    pkgSlug: 'olimpiade-semifinal-ceo-2025-bahasa-inggris-level-1',
    categoryId: 'cat_olimpiade_ceo',
    topicId: 'top_ceo_2025_ing_1',
    topicName: 'Bahasa Inggris Level 1 Semifinal CEO 2025',
    durationMinutes: 60,
    questions: CEO_2025_ING_1
  },
  {
    pkgId: 'pkg_ceo_2025_ing_2',
    pkgTitle: 'Olimpiade Semifinal CEO 2025 — Bahasa Inggris Level 2 (Bergambar)',
    pkgSlug: 'olimpiade-semifinal-ceo-2025-bahasa-inggris-level-2',
    categoryId: 'cat_olimpiade_ceo',
    topicId: 'top_ceo_2025_ing_2',
    topicName: 'Bahasa Inggris Level 2 Semifinal CEO 2025',
    durationMinutes: 60,
    questions: CEO_2025_ING_2
  },
  {
    pkgId: 'pkg_orion_2026_mb',
    pkgTitle: 'Final Nasional ORION 2026 — Matematika Level B (Kelas 3-4)',
    pkgSlug: 'final-nasional-orion-2026-matematika-level-b',
    categoryId: 'cat_olimpiade_orion',
    topicId: 'top_orion_2026_mtk_lb',
    topicName: 'Matematika Level B Final Nasional ORION 2026',
    durationMinutes: 90,
    questions: ORION_2026_MTK_B
  }
];

async function runImportBatch6() {
  console.log('🚀 Memulai Impor Batch 6: Matematika & Bahasa Inggris Level 1 dan 2...');

  const dbPath = path.resolve(process.env.DATABASE_PATH || './data/cerdasify.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('busy_timeout = 5000');

  let totalQuestionsCount = 0;

  for (const batch of BATCH_PACKAGES) {
    console.log(`\n📦 Memproses Paket: ${batch.pkgTitle} (${batch.questions.length} butir soal)`);
    totalQuestionsCount += batch.questions.length;

    // 1. Pastikan Topic Terdaftar di SQLite & Postgres
    sqlite.prepare(`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET name = excluded.name
    `).run(batch.topicId, batch.categoryId, batch.topicName, batch.pkgSlug);

    await client`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (${batch.topicId}, ${batch.categoryId}, ${batch.topicName}, ${batch.pkgSlug})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `;

    // 2. Pastikan Exam Package Terdaftar di SQLite & Postgres
    sqlite.prepare(`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET 
        title = excluded.title,
        duration_minutes = excluded.duration_minutes,
        is_published = 1
    `).run(batch.pkgId, batch.pkgTitle, batch.pkgSlug, batch.categoryId, 'PRACTICE', batch.durationMinutes, 0, 0, 1);

    await client`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, is_published)
      VALUES (${batch.pkgId}, ${batch.pkgTitle}, ${batch.pkgSlug}, ${batch.categoryId}, 'PRACTICE', ${batch.durationMinutes}, false, false, true)
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        duration_minutes = EXCLUDED.duration_minutes,
        is_published = true
    `;

    // 3. Persiapkan Data Soal & Opsi
    const questionsToInsert: any[] = [];
    const optionsToInsert: any[] = [];
    const pkgQuestionsToInsert: any[] = [];

    batch.questions.forEach((q) => {
      const qId = `${batch.pkgId}_q${String(q.num).padStart(2, '0')}`;
      questionsToInsert.push({
        id: qId,
        topic_id: batch.topicId,
        type: 'SINGLE',
        content_markdown: q.question,
        image_url: q.image || null,
        explanation_markdown: q.explanation,
        difficulty: q.difficulty
      });

      pkgQuestionsToInsert.push({
        package_id: batch.pkgId,
        question_id: qId,
        order_index: q.num
      });

      ['A', 'B', 'C', 'D'].forEach((label, optIdx) => {
        const optText = q.options[label];
        if (!optText) return;
        const isCorrect = label.toUpperCase() === q.correct.toUpperCase();
        optionsToInsert.push({
          id: `${qId}_opt_${label.toLowerCase()}`,
          question_id: qId,
          label: label.toUpperCase(),
          content_markdown: optText,
          image_url: null,
          is_correct: isCorrect,
          score_value: isCorrect ? 4 : 0,
          order_index: optIdx + 1
        });
      });
    });

    // 4. Ingest ke Supabase Postgres
    await client`
      INSERT INTO questions ${client(questionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown, 
        image_url = EXCLUDED.image_url,
        explanation_markdown = EXCLUDED.explanation_markdown,
        difficulty = EXCLUDED.difficulty
    `;

    await client`
      INSERT INTO question_options ${client(optionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown,
        is_correct = EXCLUDED.is_correct,
        score_value = EXCLUDED.score_value
    `;

    await client`
      INSERT INTO package_questions ${client(pkgQuestionsToInsert)}
      ON CONFLICT (package_id, question_id) DO UPDATE SET 
        order_index = EXCLUDED.order_index
    `;

    // 5. Ingest ke Local SQLite
    for (const q of questionsToInsert) {
      sqlite.prepare(`
        INSERT INTO questions (id, topic_id, type, content_markdown, image_url, explanation_markdown, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET 
          content_markdown = excluded.content_markdown,
          image_url = excluded.image_url,
          explanation_markdown = excluded.explanation_markdown,
          difficulty = excluded.difficulty
      `).run(q.id, q.topic_id, q.type, q.content_markdown, q.image_url, q.explanation_markdown, q.difficulty);
    }

    for (const opt of optionsToInsert) {
      sqlite.prepare(`
        INSERT INTO question_options (id, question_id, label, content_markdown, image_url, is_correct, score_value, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET 
          content_markdown = excluded.content_markdown,
          is_correct = excluded.is_correct,
          score_value = excluded.score_value
      `).run(opt.id, opt.question_id, opt.label, opt.content_markdown, opt.image_url, opt.is_correct ? 1 : 0, opt.score_value, opt.order_index);
    }

    for (const pq of pkgQuestionsToInsert) {
      sqlite.prepare(`
        INSERT INTO package_questions (package_id, question_id, order_index)
        VALUES (?, ?, ?)
        ON CONFLICT (package_id, question_id) DO UPDATE SET order_index = excluded.order_index
      `).run(pq.package_id, pq.question_id, pq.order_index);
    }

    console.log(`✅ Berhasil mengimpor ${batch.questions.length} butir soal untuk ${batch.pkgTitle}!`);
  }

  sqlite.close();
  console.log(`\n🎉 SUKSES BESAR! Berhasil mengimpor ${totalQuestionsCount} butir soal baru ke 5 paket ujian pada basis data SQLite & PostgreSQL Supabase.`);
  process.exit(0);
}

runImportBatch6().catch((err) => {
  console.error('❌ Gagal menjalankan impor Batch 6:', err);
  process.exit(1);
});
