import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

// =========================================================================
// BATCH 7: IMPORT OLIMPIADE JSO & KMSI (140 SOAL LENGKAP KUNCI & PEMBAHASAN)
// 1. pkg_jso_2025_ing_1  (30 Soal JSO 2025 Penyisihan Bahasa Inggris Level 1)
// 2. pkg_jso_2025_ing_2  (30 Soal JSO 2025 Penyisihan Bahasa Inggris Level 2)
// 3. pkg_kmsi_2024_ing_1 (40 Soal KMSI 2024 Final Provinsi Bahasa Inggris Level 1)
// 4. pkg_kmsi_2024_ing_2 (40 Soal KMSI 2024 Final Provinsi Bahasa Inggris Level 2)
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
  categoryName: string;
  categorySlug: string;
  topicId: string;
  topicName: string;
  durationMinutes: number;
  questions: QuestionItem[];
}

// -------------------------------------------------------------------------
// 1. JSO 2025 — BAHASA INGGRIS LEVEL 1 (30 SOAL)
// -------------------------------------------------------------------------
const JSO_2025_ING_1: QuestionItem[] = [
  {
    num: 1,
    question: "If you have 3 pencils and you buy 9 more pencils, how many pencils do you have in total?",
    options: {
      A: "Five",
      B: "Seven",
      C: "Eight",
      D: "Twelve"
    },
    correct: "D",
    explanation: "Operasi hitung penjumlahan: $3 + 9 = 12$ (*Twelve*). Jadi total pensil yang dimiliki adalah 12 pensil.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "I am … in the bathroom.",
    options: {
      A: "Watching TV",
      B: "Eating meal",
      C: "Sleeping",
      D: "Brushing teeth"
    },
    correct: "D",
    explanation: "Aktivitas yang lazim dilakukan di kamar mandi (*bathroom*) adalah menggosok gigi (*brushing teeth*). Menonton TV di ruang keluarga, makan di ruang makan, dan tidur di kamar tidur.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "“My sister is nine years old”. How old is my sister ?",
    options: {
      A: "7 years",
      B: "5 years",
      C: "9 years",
      D: "4 years"
    },
    correct: "C",
    explanation: "Kata bilangan *nine* berarti sembilan (9). Jadi usia saudara perempuan tersebut adalah 9 tahun (*9 years*).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Teacher : How old are you?\nMia : I am ten years old.\nHow old is Mia?",
    options: {
      A: "6 years",
      B: "10 years",
      C: "12 years",
      D: "7 years"
    },
    correct: "B",
    explanation: "Mia secara langsung menjawab: *\"I am ten years old\"*, yang berarti usianya adalah 10 tahun.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Which of the following is the greeting in English?",
    options: {
      A: "Goodbye",
      B: "Thank you",
      C: "Hello",
      D: "Sorry"
    },
    correct: "C",
    explanation: "*Hello* (halo/hai) adalah ungkapan salam sapaan (*greeting*). *Goodbye* adalah salam perpisahan (*parting*), *Thank you* ucapan terima kasih, dan *Sorry* ucapan meminta maaf.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "It is very hot. Turn on the … please.",
    options: {
      A: "Television",
      B: "Radio",
      C: "Stove",
      D: "Fan"
    },
    correct: "D",
    explanation: "Ketika ruangan bersuhu sangat panas (*very hot*), alat elektronik yang dinyalakan untuk menyejukkan udara adalah kipas angin (*fan*).",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "The response for the expression “Good afternoon” is ….",
    options: {
      A: "Good afternoon",
      B: "Good evening",
      C: "Goodbye",
      D: "Goodnight"
    },
    correct: "A",
    explanation: "Salam sapaan *Good afternoon* (selamat siang/sore) direspon secara sepadan dengan mengucapkan *Good afternoon*.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "What color is the sky on a sunny day?",
    options: {
      A: "Green",
      B: "Blue",
      C: "Red",
      D: "Yellow"
    },
    correct: "B",
    explanation: "Pada hari yang cerah (*sunny day*), langit tampak berwarna biru (*blue*).",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "What color is the ripe banana?",
    options: {
      A: "Yellow",
      B: "Green",
      C: "Blue",
      D: "Red"
    },
    correct: "A",
    explanation: "Warna kulit buah pisang yang sudah matang adalah kuning (*yellow*).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "What color is the grass?",
    options: {
      A: "Blue",
      B: "Yellow",
      C: "Purple",
      D: "Green"
    },
    correct: "D",
    explanation: "Rumput alami umumnya berwarna hijau (*green*).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Who is your mother’s mother?",
    options: {
      A: "Grandfather",
      B: "Grandmother",
      C: "Aunt",
      D: "Uncle"
    },
    correct: "B",
    explanation: "Ibu dari ibu kita adalah nenek kita (*grandmother*).",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Look at the picture! This is my ….",
    image: "/uploads/jso25_ing1_q12.png",
    options: {
      A: "Mother",
      B: "Grandfather",
      C: "Aunt",
      D: "Grandmother"
    },
    correct: "B",
    explanation: "Gambar stimulus memperlihatkan seorang pria tua lanjut usia berambut putih dan berkacamata, yaitu kakek (*grandfather*).",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Who is your mother’s sister?",
    options: {
      A: "Uncle",
      B: "Aunt",
      C: "Father",
      D: "Grandmother"
    },
    correct: "B",
    explanation: "Saudara perempuan dari ibu kita adalah bibi/tante (*aunt*).",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Which animal has a shell and moves slowly?",
    options: {
      A: "Turtle",
      B: "Rabbit",
      C: "Snake",
      D: "Deer"
    },
    correct: "A",
    explanation: "Hewan yang memiliki tempurung pelindung (*shell*) dan berjalan sangat lambat (*moves slowly*) adalah kura-kura/penyu (*turtle*).",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Which animal is known for its black and white stripes?",
    options: {
      A: "Lion",
      B: "Zebra",
      C: "Giraffe",
      D: "Elephant"
    },
    correct: "B",
    explanation: "Hewan yang memiliki pola garis-garis loreng hitam dan putih (*black and white stripes*) pada tubuhnya adalah zebra.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "When does the day start?",
    options: {
      A: "In the morning",
      B: "In the afternoon",
      C: "In the evening",
      D: "In the night"
    },
    correct: "A",
    explanation: "Hari dan rutinitas manusia diawali pada saat fajar/pagi hari (*in the morning*).",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "We use our … for tasting food.",
    options: {
      A: "Ear",
      B: "Eye",
      C: "Mouth",
      D: "Leg"
    },
    correct: "C",
    explanation: "Kita mengecap rasa makanan (*tasting*) menggunakan indra pengecap lidah yang berada di dalam mulut (*mouth*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Look at the picture. What is it?",
    image: "/uploads/jso25_ing1_q18.png",
    options: {
      A: "hand",
      B: "nose",
      C: "leg",
      D: "eyebrow"
    },
    correct: "A",
    explanation: "Gambar stimulus memperlihatkan bagian anggota tubuh tangan manusia dengan lima jari (*hand*).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Aimee has a cat. She loves …. cat so much.",
    options: {
      A: "His",
      B: "Him",
      C: "Her",
      D: "Your"
    },
    correct: "C",
    explanation: "Subjek kalimat adalah seorang perempuan (*Aimee* / *She*), sehingga kata ganti kepemilikan (*possessive adjective*) yang tepat adalah *her* (*her cat*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "You use your ….. to write something.",
    options: {
      A: "Nose",
      B: "Leg",
      C: "Hand",
      D: "Eye"
    },
    correct: "C",
    explanation: "Anggota tubuh yang digunakan untuk memegang pena/pensil dan menulis adalah tangan (*hand*).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "This animal has four legs, and sounds “meow”, what is it …",
    options: {
      A: "Frog",
      B: "Buffalo",
      C: "Cat",
      D: "Cow"
    },
    correct: "C",
    explanation: "Hewan berkaki empat yang bersuara khas \"meow\" adalah kucing (*cat*).",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "This animal has two legs, wings, and can fly in the sky. What is it …",
    options: {
      A: "Chicken",
      B: "Bird",
      C: "Butterfly",
      D: "Ant"
    },
    correct: "B",
    explanation: "Hewan bertulang belakang yang berkaki dua, memiliki sepasang sayap, dan mampu terbang bebas di angkasa adalah burung (*bird*).",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "A baby dog is called a puppy. A baby cat is called a …",
    options: {
      A: "Kitty",
      B: "Kitten",
      C: "Kit",
      D: "Catty"
    },
    correct: "B",
    explanation: "Istilah baku dalam bahasa Inggris untuk anak kucing adalah *kitten*.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "Look at the picture!",
    image: "/uploads/jso25_ing1_q24.png",
    options: {
      A: "Cow",
      B: "Buffalo",
      C: "Hippopotamus",
      D: "Rhinoceros"
    },
    correct: "D",
    explanation: "Gambar stimulus menampilkan hewan mamalia besar bercula satu/dua di hidungnya, yaitu badak (*rhinoceros*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Look at the picture!",
    image: "/uploads/jso25_ing1_q25.png",
    options: {
      A: "Shark",
      B: "Orca",
      C: "Dolphin",
      D: "Eel"
    },
    correct: "C",
    explanation: "Gambar stimulus menampilkan lumba-lumba (*dolphin*) yang ramah dan melompat di atas air.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "This thing is used for writing on the whiteboard and it has black ink. What is it?",
    options: {
      A: "Eraser",
      B: "Ruler",
      C: "Chalk",
      D: "Board marker"
    },
    correct: "D",
    explanation: "Benda yang digunakan khusus untuk menulis pada papan tulis putih (*whiteboard*) adalah spidol papan tulis (*board marker* / *whiteboard marker*).",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Look at the picture!",
    image: "/uploads/jso25_ing1_q27.png",
    options: {
      A: "Bag",
      B: "Ruler",
      C: "Pencil",
      D: "Table"
    },
    correct: "A",
    explanation: "Gambar stimulus menampilkan tas ransel sekolah anak (*bag* / *backpack*).",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "This fruit taste is sour, and the color is orange. What is it …",
    options: {
      A: "Banana",
      B: "Strawberry",
      C: "Orange",
      D: "Durian"
    },
    correct: "C",
    explanation: "Buah yang berwarna jingga (*orange*) dan memiliki rasa asam manis menyegarkan adalah jeruk (*orange*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Look at the picture!",
    image: "/uploads/jso25_ing1_q29.png",
    options: {
      A: "Watermelon",
      B: "Strawberry",
      C: "Melon",
      D: "Grapes"
    },
    correct: "B",
    explanation: "Gambar stimulus menampilkan buah stroberi (*strawberry*) berwarna merah dengan bintik-bintik biji di permukaannya.",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "The fruit has a strong smell and sharp thorns on its thick skin. What is it …",
    options: {
      A: "Banana",
      B: "Watermelon",
      C: "Dragon fruit",
      D: "Durian"
    },
    correct: "D",
    explanation: "Buah dengan aroma yang sangat menyengat (*strong smell*) dan kulit berakar duri tajam (*sharp thorns*) adalah durian (*durian*).",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 2. JSO 2025 — BAHASA INGGRIS LEVEL 2 (30 SOAL)
// -------------------------------------------------------------------------
const JSO_2025_ING_2: QuestionItem[] = [
  {
    num: 1,
    question: "Read the text to answer questions 1 to 5!\n\n\"Lenna is the smartest student in her class. She always gets the highest score in English and Mathematics. Lenna has a younger sister named Clara. Clara has round cheeks and tiny hands. Clara is so cute and smiley. Clara will be having her birthday on November 18th.\"\n\nHow is Lenna in her class?",
    options: {
      A: "She is the tallest student in her class.",
      B: "She is the smallest student in her class.",
      C: "She is the smartest student in her class.",
      D: "She is the youngest student in her class."
    },
    correct: "C",
    explanation: "Kalimat pertama teks menyatakan: *\"Lenna is the smartest student in her class.\"* (Lenna adalah siswa terpintar di kelasnya).",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Lenna has a ... sister.",
    options: {
      A: "Older",
      B: "Younger",
      C: "Taller",
      D: "Youngest"
    },
    correct: "B",
    explanation: "Teks menyebutkan: *\"Lenna has a younger sister named Clara.\"* Jadi Lenna memiliki adik perempuan (*younger sister*).",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Lenna’s sister has round ... and tiny ....",
    options: {
      A: "cheeks, hands",
      B: "face, cheeks",
      C: "cheeks, fingers",
      D: "cheeks, face"
    },
    correct: "A",
    explanation: "Sesuai kutipan teks: *\"Clara has round cheeks and tiny hands.\"* (pipi bulat dan tangan mungil).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Lenna’s sister is ....",
    options: {
      A: "Small",
      B: "Cute",
      C: "Tiny",
      D: "Smiley"
    },
    correct: "B",
    explanation: "Teks menyebutkan: *\"Clara is so cute and smiley.\"*",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Lenna’s sister will be having birthday on ....",
    options: {
      A: "November 17th",
      B: "November 18th",
      C: "September 18th",
      D: "October 18th"
    },
    correct: "B",
    explanation: "Kalimat terakhir teks menyebutkan: *\"Clara will be having her birthday on November 18th.\"*",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Theo : “How does lemon taste?”\nLeo : “It tastes ….”",
    options: {
      A: "Sour",
      B: "Bitter",
      C: "Sweet",
      D: "Salty"
    },
    correct: "A",
    explanation: "Rasa buah lemon adalah masam/kecut (*sour*). *Bitter* = pahit, *sweet* = manis, *salty* = asin.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "I love ripe mango because it tastes …",
    options: {
      A: "Sour",
      B: "Bitter",
      C: "Sweet",
      D: "Salty"
    },
    correct: "C",
    explanation: "Buah mangga yang matang disukai karena rasanya yang manis (*sweet*).",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Below is the food that tastes sweet, EXCEPT …",
    options: {
      A: "Honey",
      B: "Strawberry",
      C: "Bitter melon",
      D: "Ice cream"
    },
    correct: "C",
    explanation: "Pare (*bitter melon*) memiliki rasa yang pahit (*bitter*), bukan manis. Madu (*honey*), permen stroberi, dan es krim berasa manis.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "What does Anna hold in the picture ?",
    image: "/uploads/jso25_ing2_q9.png",
    options: {
      A: "Sour lime",
      B: "Bitter melon",
      C: "Sour grapes",
      D: "Sweet candy"
    },
    correct: "A",
    explanation: "Gambar stimulus memperlihatkan Anna sedang memegang potongan buah jeruk nipis hijau (*sour lime*).",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Which of these statements is right about the taste of the food ?",
    options: {
      A: "I’m drinking a very sweet lemon juice",
      B: "The ripe mangoes are sweet",
      C: "Jonah eats a bitter watermelon",
      D: "The ice cream tastes very salty"
    },
    correct: "B",
    explanation: "Pernyataan yang tepat dan alami mengenai rasa makanan adalah buah mangga yang matang berasa manis (*The ripe mangoes are sweet*).",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "It is worn around the waist to help with oversized trousers. It is a …",
    options: {
      A: "Necklace",
      B: "Belt",
      C: "Bracelet",
      D: "Ring"
    },
    correct: "B",
    explanation: "Benda yang dikenakan melingkari pinggang (*waist*) untuk menahan celana agar tidak melorot adalah ikat pinggang (*belt*).",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "The boyband … from South Korea.",
    options: {
      A: "Is",
      B: "Are",
      C: "Was",
      D: "Were"
    },
    correct: "A",
    explanation: "*The boyband* bertindak sebagai kata benda kolektif tunggal (*singular collective noun*) yang menyatakan fakta kebenaran umum (*Present Tense*), sehingga to be yang tepat adalah *is*.",
    difficulty: "MEDIUM"
  },
  {
    num: 13,
    question: "Grandma … some porridge last night.",
    options: {
      A: "Eats",
      B: "Eated",
      C: "Eating",
      D: "Ate"
    },
    correct: "D",
    explanation: "Keterangan waktu lampau *last night* (tadi malam) mewajibkan bentuk *Past Simple* (V2). Bentuk lampau dari kata kerja tak beraturan *eat* adalah *ate*.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Mother … some roses from the garden and put them in the vase.",
    options: {
      A: "Puts",
      B: "Buys",
      C: "Cuts",
      D: "Eats"
    },
    correct: "C",
    explanation: "Tindakan mengambil bunga mawar dari kebun dengan memotong tangkainya menggunakan kata kerja *cuts*.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "My father … his motorcycle with my uncle yesterday.",
    options: {
      A: "Repair",
      B: "Repaired",
      C: "Is repairing",
      D: "Has repaired"
    },
    correct: "B",
    explanation: "Keterangan waktu *yesterday* (kemarin) mengharuskan penggunaan kata kerja bentuk lampau *Past Tense*, yaitu *repaired*.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "There is a beautiful ... hanging on the wall in the living room.",
    options: {
      A: "Painting",
      B: "Clock",
      C: "Calendar",
      D: "Flower vase"
    },
    correct: "A",
    explanation: "Karya seni indah yang dipajang menggantung di dinding ruang tamu adalah lukisan (*painting*).",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Look at the picture.",
    image: "/uploads/jso25_ing2_q17.png",
    options: {
      A: "Radio",
      B: "Television",
      C: "Telephone",
      D: "Painting"
    },
    correct: "A",
    explanation: "Gambar stimulus menampilkan sebuah pesawat radio klasik bertuner dan berantena (*radio*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Look at the picture.",
    image: "/uploads/jso25_ing2_q18.png",
    options: {
      A: "Cupboard",
      B: "Wardrobe",
      C: "Window",
      D: "Bookshelf"
    },
    correct: "B",
    explanation: "Gambar stimulus menampilkan lemari khusus untuk menggantung dan menyimpan pakaian (*wardrobe*).",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Totok : “Where do you put the floor mat?”\nBudi : “I put the … in front of the door.”",
    options: {
      A: "Mirror",
      B: "Cupboard",
      C: "Rug",
      D: "Table"
    },
    correct: "C",
    explanation: "Alas lantai/keset yang ditaruh di depan pintu dalam bahasa Inggris disebut *rug* atau *mat*.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Adit : “Where do you sit to watch TV?”\nDanu : “I sit on the comfortable … in the living room.”",
    options: {
      A: "Wardrobe",
      B: "Cupboard",
      C: "Couch",
      D: "Bookshelf"
    },
    correct: "C",
    explanation: "Tempat duduk empuk bersandaran yang nyaman di ruang keluarga untuk menonton televisi adalah sofa/kursi panjang (*couch* / *sofa*).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "Look at the picture!",
    image: "/uploads/jso25_ing2_q21.png",
    options: {
      A: "A cup of water",
      B: "A cup of coffee",
      C: "A cup of soup",
      D: "A cup of honey"
    },
    correct: "B",
    explanation: "Gambar stimulus menampilkan secangkir kopi hitam hangat di atas cawan (*a cup of coffee*).",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "“She manages her bedroom organized.” From the statement, it means her room is …",
    options: {
      A: "Dirty",
      B: "Messy",
      C: "Tidy",
      D: "Dark"
    },
    correct: "C",
    explanation: "Kamar yang dikelola secara *organized* (teratur/tertata rapi) bersinonim dengan *tidy* (rapi). *Messy* = berantakan, *dirty* = kotor.",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "There are several items in the kitchen, EXCEPT …",
    options: {
      A: "Frying pan",
      B: "Spatula",
      C: "Gas stove",
      D: "Pillow"
    },
    correct: "D",
    explanation: "Bantal (*pillow*) adalah perlengkapan tempat tidur di kamar tidur, bukan perabotan dapur.",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "“I bought a new wallet, it’s beautiful and I like it.” Which picture shows the wallet?",
    image: "/uploads/jso25_ing2_q24.png",
    options: {
      A: "Bag",
      B: "Wallet",
      C: "Hat",
      D: "Belt"
    },
    correct: "B",
    explanation: "Gambar stimulus memperlihatkan dompet penyimpan uang kertas dan kartu (*wallet*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Harry : Mom, I want to buy some grapes.\nMom : Okay, let's go to the fruit market.\nWhat can we conclude from the dialogue?",
    options: {
      A: "Harry and his mother go to market to buy some apples",
      B: "Harry goes to the market by himself",
      C: "Harry and his mother go to florist for buy some grapes",
      D: "Harry and his mother buy some grapes in the market"
    },
    correct: "D",
    explanation: "Percakapan menunjukkan Harry dan ibunya bersama-sama pergi ke pasar buah untuk membeli buah anggur (*buy some grapes in the market*).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Which of these statements is correct?",
    options: {
      A: "The mango tastes bitter",
      B: "The bitter melon tastes sweet",
      C: "The watermelon tastes sweet",
      D: "The pizza tastes sour"
    },
    correct: "C",
    explanation: "Pernyataan yang tepat adalah semangka memiliki rasa manis segar (*The watermelon tastes sweet*).",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Jean : “I am thirsty. Can I have …?”",
    options: {
      A: "A glass of water",
      B: "A bowl of water",
      C: "A cup of salt",
      D: "A bottle of pepper"
    },
    correct: "A",
    explanation: "Saat haus (*thirsty*), takaran wadah minuman air putih yang lazim diminta adalah segelas air (*a glass of water*).",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Lala : “What are you wearing for the party?”\nSiti : “I am wearing a pretty dress and …”",
    options: {
      A: "A pair of shorts",
      B: "A pair of socks",
      C: "A pair of jeans",
      D: "A pair of shoes"
    },
    correct: "D",
    explanation: "Pelengkap busana gaun pesta yang anggun untuk alas kaki adalah sepasang sepatu (*a pair of shoes*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Diana eats too much candy so she has a …",
    options: {
      A: "Sore throat",
      B: "Sore eyes",
      C: "Toothache",
      D: "Headache"
    },
    correct: "C",
    explanation: "Mengonsumsi terlalu banyak permen manis (*too much candy*) memicu kerusakan gigi sehingga menyebabkan sakit gigi (*toothache*).",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "Which of the following statements is correct ?",
    options: {
      A: "Bobby eats a sweet pizza",
      B: "Diana is having a salty mango",
      C: "Ezra is drinking a spicy orange juice",
      D: "Ezra is drinking a sour lime juice"
    },
    correct: "D",
    explanation: "Jeruk nipis (*lime*) memiliki rasa alami yang asam (*sour*), sehingga kalimat *Ezra is drinking a sour lime juice* adalah pernyataan yang benar secara rasa dan makna.",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 3. KMSI 2024 — BAHASA INGGRIS LEVEL 1 (40 SOAL)
// -------------------------------------------------------------------------
const KMSI_2024_ING_1: QuestionItem[] = [
  {
    num: 1,
    question: "Read the short story below to answer questions 1 to 5!\n\n\"One afternoon, a lion was sleeping peacefully under a tree. A little mouse ran across the lion's nose and woke him up. The lion was angry and caught the mouse with his huge paw. The mouse begged, 'Please spare my life! If you let me go, I will surely repay your kindness one day.' The lion laughed at the idea of a tiny mouse helping the king of the jungle, but he let the mouse go.\nA few days later, hunters captured the lion and tied him with thick ropes to a tree. The lion roared loudly in despair. Hearing the roar, the little mouse came running and quickly gnawed through the ropes with his sharp teeth until the lion was free.\"\n\nWho interrupted the lion’s sleep?",
    image: "/uploads/kmsi24_ing1_lion_mouse.png",
    options: {
      A: "A cat",
      B: "A rabbit",
      C: "A lizard",
      D: "A mouse"
    },
    correct: "D",
    explanation: "Teks cerita fabel menyatakan: *\"A little mouse ran across the lion's nose and woke him up.\"* Jadi seekor tikus kecil (*a mouse*) yang mengganggu tidur singa.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "What did the mouse say when it begged to be let go?",
    options: {
      A: "There’s always good karma after someone does good deeds.",
      B: "When someone doesn’t kill another being, the latter will never forget their kind doing.",
      C: "If you let me go, I will surely repay your kindness one day.",
      D: "Never forget to repay someone’s kindness with money."
    },
    correct: "C",
    explanation: "Tikus memohon dengan mengatakan: *\"If you let me go, I will surely repay your kindness one day.\"*",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Why did the lion need the mouse’s help?",
    options: {
      A: "He’s about to drown in the water.",
      B: "He got caught by the hunters.",
      C: "He played with the ropes.",
      D: "He didn’t need any help."
    },
    correct: "B",
    explanation: "Singa membutuhkan bantuan karena ia tertangkap oleh pemburu (*hunters captured the lion and tied him with thick ropes*).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "What did the hunters use to catch and tie the lion?",
    options: {
      A: "A net",
      B: "A gun",
      C: "A samurai",
      D: "Some ropes"
    },
    correct: "D",
    explanation: "Teks menyebutkan: *\"hunters captured the lion and tied him with thick ropes to a tree.\"* Pemburu menggunakan tali tambang (*some ropes*).",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "How did the mouse help the lion?",
    options: {
      A: "He called his fellow mice to attack the hunters",
      B: "He gnawed the ropes until the lion was released",
      C: "He stole the ropes from the hunters",
      D: "He didn’t help the lion"
    },
    correct: "B",
    explanation: "Tikus menolong singa dengan menggerogoti tali pengikat menggunakan giginya yang tajam sampai singa bebas (*gnawed through the ropes with his sharp teeth*).",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "The clock shows the short hand at 4 and long hand at 12. What time is it now?",
    options: {
      A: "Half past four",
      B: "Ten to four",
      C: "Half past twelve",
      D: "Four o’clock"
    },
    correct: "D",
    explanation: "Jarum pendek menunjuk angka 4 dan jarum panjang menunjuk tepat angka 12 menunjukkan pukul empat tepat (*four o’clock*).",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Mother : “Shouldn’t you … your sandwich?”\nAnne : “I’m still full, Mom.”",
    options: {
      A: "Eat",
      B: "Drink",
      C: "Throw",
      D: "Crash"
    },
    correct: "A",
    explanation: "Sandwich adalah makanan padat, sehingga kata kerja yang sesuai adalah memakan (*eat*).",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Read the text to answer questions 8 – 10!\n\nMei-mei : “Hi, Nana! Where did you go for holiday?”\nNana : “Oh, I had my holiday at my aunt’s house near Ontario Lake! How ‘bout your holiday? Where did you go to?”\nMei-mei : “My grandparents who live in Shanghai invited me for their anniversary celebration, so my parents and I all went there! It was so much fun.”\nNana : “I guess we all enjoyed our holiday!”\n\nWhere did Mei-mei have her holiday?",
    options: {
      A: "Shanghai",
      B: "Canada",
      C: "New York",
      D: "Near Ontario Lake"
    },
    correct: "A",
    explanation: "Mei-mei mengatakan: *\"My grandparents who live in Shanghai invited me... so my parents and I all went there!\"*",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Near which lake is Nana’s aunt's home located?",
    options: {
      A: "Ontario",
      B: "Louise",
      C: "Emerald",
      D: "Superior"
    },
    correct: "A",
    explanation: "Nana mengatakan: *\"I had my holiday at my aunt’s house near Ontario Lake!\"*",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Where could this dialogue between two school friends most possibly happen?",
    options: {
      A: "At a library",
      B: "At home",
      C: "At a funeral",
      D: "At school"
    },
    correct: "D",
    explanation: "Percakapan dua teman sebaya yang saling menanyakan pengalaman liburan setelah liburan usai paling lazim terjadi di sekolah (*at school*).",
    difficulty: "MEDIUM"
  },
  {
    num: 11,
    question: "Dennisa has a cat. She loves … cat so much.",
    options: {
      A: "His",
      B: "Him",
      C: "Her",
      D: "Your"
    },
    correct: "C",
    explanation: "Dennisa adalah nama perempuan (*She*), maka kata ganti kepemilikannya adalah *her* (*her cat*).",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "You use your … to write something.",
    options: {
      A: "Nose",
      B: "Leg",
      C: "Hand",
      D: "Eye"
    },
    correct: "C",
    explanation: "Bagian tubuh untuk menulis adalah tangan (*hand*).",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Which of the following is an item of clothing that is worn on the head?",
    options: {
      A: "Scarf",
      B: "Hat",
      C: "Shoes",
      D: "Socks"
    },
    correct: "B",
    explanation: "Benda pakaian penutup kepala adalah topi (*hat*).",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Arrange the jumbled letters into the correct color name: U - R - P - P - L - E",
    options: {
      A: "Plepur",
      B: "Purple",
      C: "Pearls",
      D: "Urppel"
    },
    correct: "B",
    explanation: "Susunan huruf U-R-P-P-L-E membentuk kata warna ungu yaitu *P-U-R-P-L-E* (Purple).",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "What is a common pet for people to have in their homes?",
    options: {
      A: "Elephant",
      B: "Fish",
      C: "Giraffe",
      D: "Lion"
    },
    correct: "B",
    explanation: "Hewan peliharaan (*pet*) yang umum dipelihara di rumah (di akuarium) adalah ikan (*fish*). Gajah, jerapah, dan singa adalah satwa liar.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Rearrange the words into a correct sentence: An - it - apple - is",
    options: {
      A: "An apple is it",
      B: "It an apple is",
      C: "It is an apple",
      D: "Is it an apple"
    },
    correct: "C",
    explanation: "Pola kalimat pernyataan deklaratif bahasa Inggris: Subjek (*It*) + to be (*is*) + Objek (*an apple*) $\\rightarrow$ *\"It is an apple\"*.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Fish live in an aquarium. Fish can …?",
    options: {
      A: "Fly",
      B: "Run",
      C: "Swim",
      D: "Jump"
    },
    correct: "C",
    explanation: "Kemampuan bergerak alami ikan di dalam air adalah berenang (*swim*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "The … eats grass.",
    options: {
      A: "Lion",
      B: "Cow",
      C: "Chicken",
      D: "Cat"
    },
    correct: "B",
    explanation: "Hewan herbivora pemakan rumput (*eats grass*) adalah sapi (*cow*). Singa dan kucing adalah karnivora.",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "The toothpaste and toothbrush are kept in the …?",
    options: {
      A: "Dining room",
      B: "Bathroom",
      C: "Bedroom",
      D: "Kitchen"
    },
    correct: "B",
    explanation: "Pasta gigi dan sikat gigi disimpan di kamar mandi (*bathroom*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "N - R - D - A - G - E. The correct word arrangement is …?",
    options: {
      A: "Garden",
      B: "Garage",
      C: "Dargen",
      D: "Garbage"
    },
    correct: "A",
    explanation: "Huruf N-R-D-A-G-E disusun menjadi kata kebun/taman yaitu *G-A-R-D-E-N*.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "A : “Look! Is that a parrot?”\nB : “Yes, it is. It’s … the tree branch.”",
    options: {
      A: "Below",
      B: "On",
      C: "Above",
      D: "Between"
    },
    correct: "B",
    explanation: "Burung yang bertengger menempel di atas dahan pohon menggunakan preposisi *on* (*on the branch*).",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Jane : “Mom, what are they?”\nMom : “They’re kittens. They are … the box.”",
    options: {
      A: "Behind",
      B: "In between",
      C: "Inside",
      D: "Across"
    },
    correct: "C",
    explanation: "Anak kucing yang berada di dalam kardus menggunakan preposisi *inside* / *in* (*inside the box*).",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "The dog is sleeping … the desk.",
    image: "/uploads/kmsi24_ing1_q23.png",
    options: {
      A: "Atop",
      B: "Aboard",
      C: "Under",
      D: "Beside"
    },
    correct: "C",
    explanation: "Gambar stimulus menunjukkan anjing tidur di kolong/bawah meja (*under the desk*).",
    difficulty: "EASY"
  },
  {
    num: 24,
    question: "The cat is sleeping … the boy.",
    image: "/uploads/kmsi24_ing1_q24.png",
    options: {
      A: "Under",
      B: "Behind",
      C: "In front of",
      D: "Beside"
    },
    correct: "D",
    explanation: "Gambar stimulus memperlihatkan kucing berbaring di samping/sebelah anak laki-laki (*beside the boy*).",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "“Oh no! The cat is … Dad’s table!”",
    image: "/uploads/kmsi24_ing1_q25.png",
    options: {
      A: "Beside",
      B: "Below",
      C: "On top of",
      D: "In the middle of"
    },
    correct: "C",
    explanation: "Gambar stimulus menampilkan kucing yang melompat dan berdiri di atas permukaan meja (*on top of the table*).",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Read the text to answer numbers 26 - 30!\n\n\"Every year we go to Florida. We like to go to the beach. My favorite beach is called Emerson Beach. It is very long, with soft sand and palm trees. It is very beautiful. I like to make sandcastles and watch the sailboats go by. Sometimes there are dolphins and whales in the water! Every morning, we look for shells in the sand. I found fifteen big shells last year. I put them in a special place in my room. This year I want to learn to surf. It is hard to surf, but so much fun! My sister is a good surfer. She says that she can teach me. I hope I can do it!\"\n\nWhere do I go every year for a vacation?",
    options: {
      A: "Beach",
      B: "Emerson Beach",
      C: "Florida",
      D: "Home"
    },
    correct: "C",
    explanation: "Kalimat pertama menyatakan: *\"Every year we go to Florida.\"* Jadi tujuan liburan setiap tahun adalah Florida.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "My favorite beach is called …",
    options: {
      A: "Green Beach",
      B: "Long Bay Beach",
      C: "Emerson Beach",
      D: "Surf Beach"
    },
    correct: "C",
    explanation: "Kutipan teks: *\"My favorite beach is called Emerson Beach.\"*",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "How many big shells did I find last year?",
    options: {
      A: "Seven",
      B: "Fifteen",
      C: "Twelve",
      D: "Zero"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"I found fifteen big shells last year.\"* Jadi jumlahnya adalah 15 (*fifteen*).",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "What do I usually do at the beach according to the text?",
    options: {
      A: "Catch shells",
      B: "Make sandcastles and watch the sailboats",
      C: "Make sandwiches",
      D: "Surfing"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"I like to make sandcastles and watch the sailboats go by.\"*",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "What is my sister good at?",
    options: {
      A: "Surf",
      B: "Bowl",
      C: "Make sandcastles",
      D: "Drive sailboats"
    },
    correct: "A",
    explanation: "Teks menyatakan: *\"My sister is a good surfer.\"* Artinya sang kakak mahir dalam berselancar (*surf*).",
    difficulty: "EASY"
  },
  {
    num: 31,
    question: "Look at the picture! What fruit is it?",
    image: "/uploads/kmsi24_ing1_q31.png",
    options: {
      A: "Guava",
      B: "Mangosteen",
      C: "Orange",
      D: "Peach"
    },
    correct: "B",
    explanation: "Gambar stimulus menampilkan buah manggis berkulit ungu dengan kelopak hijau dan daging putih (*mangosteen*).",
    difficulty: "EASY"
  },
  {
    num: 32,
    question: "It is an elongated fruit with orange flesh, green skin, and a lot of small black seeds inside it. It is a/an …",
    options: {
      A: "Mango",
      B: "Orange",
      C: "Papaya",
      D: "Watermelon"
    },
    correct: "C",
    explanation: "Buah berdaging jingga, berkulit hijau, dan memiliki banyak biji hitam kecil di tengah rongganya adalah pepaya (*papaya*).",
    difficulty: "EASY"
  },
  {
    num: 33,
    question: "The following dialog is for questions number 33 and 34.\n\nAnisa : “Hi Billy, what are you eating?”\nBilly : “A few slices of melon. My mom prepared them in my lunch box.”\nAnisa : “Do you like melons?”\nBilly : “Not really, I prefer watermelon. It is juicier.”\n\nWhat does Billy have in his lunch box?",
    options: {
      A: "Some melon cuts",
      B: "Some watermelon cuts",
      C: "A whole melon",
      D: "A watermelon"
    },
    correct: "A",
    explanation: "Billy mengatakan: *\"A few slices of melon. My mom prepared them in my lunch box.\"* (Beberapa potongan melon / *some melon cuts*).",
    difficulty: "EASY"
  },
  {
    num: 34,
    question: "Which statement is true based on the dialogue?",
    options: {
      A: "Billy likes melon better than watermelon.",
      B: "Billy hates melon completely.",
      C: "Billy likes watermelon better.",
      D: "Billy likes watermelon juice."
    },
    correct: "C",
    explanation: "Billy menyatakan: *\"not really, I prefer watermelon. It is juicier.\"* (Billy lebih menyukai semangka).",
    difficulty: "EASY"
  },
  {
    num: 35,
    question: "The following picture is for questions 35 to 37.\n\nThe following are items that can be seen in the classroom picture, EXCEPT ….",
    image: "/uploads/kmsi24_ing1_classroom.png",
    options: {
      A: "Map",
      B: "Desk",
      C: "Calendar",
      D: "Motorcycle"
    },
    correct: "D",
    explanation: "Di dalam ruang kelas terdapat peta (*map*), meja (*desk*), dan kalender (*calendar*). Sepeda motor (*motorcycle*) tidak ada di dalam ruang kelas.",
    difficulty: "EASY"
  },
  {
    num: 36,
    question: "Where is the clock in the classroom picture?",
    options: {
      A: "It is on the wall above the announcement board and calendar.",
      B: "It is in front of the wall under the desk.",
      C: "It is on the teacher's chair.",
      D: "It is outside the window."
    },
    correct: "A",
    explanation: "Pada gambar ruangan kelas, jam dinding terpasang di dinding tepat di atas papan pengumuman dan kalender (*on the wall above the announcement board and calendar*).",
    difficulty: "MEDIUM"
  },
  {
    num: 37,
    question: "Based on the classroom seating chart, which statement is true?",
    options: {
      A: "The teacher stands in front of the whiteboard.",
      B: "The students sit on the floor.",
      C: "There are no chairs in the classroom.",
      D: "The classroom has no windows."
    },
    correct: "A",
    explanation: "Guru berdiri di depan kelas menghadap siswa di dekat papan tulis putih (*The teacher stands in front of the whiteboard*).",
    difficulty: "EASY"
  },
  {
    num: 38,
    question: "Read the text to answer questions 38 and 39!\n\n\"Hello, my name is Helena Binawan. I live in Bandung, West Java. I am the youngest in my family. My oldest brother is Irgy Binawan. He is 14 years old and studies in SMP Bina Bangsa. My older brother is Jeremy Binawan. He is 10 years old. He studies in SD Bina Bangsa. I am the only girl in my family.\"\n\nHow many children does the Binawan family have?",
    options: {
      A: "Three children, all of them are boys.",
      B: "Three children, two boys and one girl.",
      C: "Three children, two girls and one boy.",
      D: "Four children."
    },
    correct: "B",
    explanation: "Keluarga Binawan memiliki 3 anak: Irgy (laki-laki), Jeremy (laki-laki), dan Helena (anak perempuan tunggal). Jadi ada 3 anak: 2 laki-laki dan 1 perempuan (*two boys and one girl*).",
    difficulty: "EASY"
  },
  {
    num: 39,
    question: "How old is most probably Helena?",
    options: {
      A: "16 years old",
      B: "12 years old",
      C: "10 years old",
      D: "8 years old"
    },
    correct: "D",
    explanation: "Helena menyatakan bahwa ia adalah anak paling bungsu (*the youngest*). Kakak keduanya (Jeremy) berusia 10 tahun. Maka usia Helena harus di bawah 10 tahun, yaitu 8 tahun (*8 years old*).",
    difficulty: "MEDIUM"
  },
  {
    num: 40,
    question: "What do I call my mother’s brother?",
    options: {
      A: "Brother",
      B: "Father",
      C: "Uncle",
      D: "Aunt"
    },
    correct: "C",
    explanation: "Saudara laki-laki dari ibu adalah paman (*uncle*).",
    difficulty: "EASY"
  }
];

// -------------------------------------------------------------------------
// 4. KMSI 2024 — BAHASA INGGRIS LEVEL 2 (40 SOAL)
// -------------------------------------------------------------------------
const KMSI_2024_ING_2: QuestionItem[] = [
  {
    num: 1,
    question: "“She jumped over the puddle.”\nWhat is the synonym of the word 'jumped'?",
    options: {
      A: "Hopped",
      B: "Ran",
      C: "Crawled",
      D: "Bent"
    },
    correct: "A",
    explanation: "Sinonim dari kata kerja *jumped* (melompat) adalah *hopped* (meloncat).",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "“Please take out the rubbish.” The synonym of 'rubbish' is …",
    options: {
      A: "Trash",
      B: "Treasure",
      C: "Jewel",
      D: "Rocks"
    },
    correct: "A",
    explanation: "Kata *rubbish* (sampah) dalam bahasa Inggris bersinonim dengan *trash* atau *garbage*.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "“Do not forget to work on your homework, kids.”\nIn this sentence, 'work on' has the same meaning as …",
    options: {
      A: "Do",
      B: "Give",
      C: "Accept",
      D: "Hand"
    },
    correct: "A",
    explanation: "Mengerjakan tugas (*work on homework*) bermakna sama dengan *do homework*.",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Read the passage below to answer questions 4 to 9!\n\n\"Marla wants to invite her friend Kara over for a sleepover. Marla's mom writes out the following directions for Kara to give to her mother:\nDirections from school to Marla's house:\n1. When coming out of the school parking lot, turn left.\n2. Make an immediate right turn onto Chapel Street.\n3. At the stop sign, turn right on Oak Street.\n4. Go three blocks and turn left on Marble Road.\n5. Our house is five houses down on the right, 305 Marble Road.\"\n\nWho is being invited to a sleepover?",
    image: "/uploads/kmsi24_ing2_map.png",
    options: {
      A: "Marla",
      B: "Kara",
      C: "Marla’s mom",
      D: "Kara’s mom"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"Marla wants to invite her friend Kara over for a sleepover.\"* Jadi yang diundang adalah Kara.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Where should Kara turn right after coming out of the school parking lot?",
    options: {
      A: "Go to Chapel Street",
      B: "Turn left first, then immediate right onto Chapel Street",
      C: "Turn right onto Oak Street immediately",
      D: "Turn right onto Marble Road"
    },
    correct: "B",
    explanation: "Petunjuk nomor 1 dan 2: keluar dari tempat parkir belok kiri, lalu langsung belok kanan ke Chapel Street.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "How will Kara know she has arrived at Marla’s house?",
    options: {
      A: "There are oaks everywhere.",
      B: "The house is located on Chapel Street.",
      C: "The house’s address is 305 Marble Road, five houses down on the right.",
      D: "It’s three blocks from school."
    },
    correct: "C",
    explanation: "Petunjuk nomor 5 menyatakan: *\"Our house is five houses down on the right, 305 Marble Road.\"*",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "What street does Marla live on?",
    options: {
      A: "Marble Road",
      B: "Chapel St.",
      C: "Oak St.",
      D: "Tangerine St."
    },
    correct: "A",
    explanation: "Alamat rumah Marla terletak di Jalan Marble (*305 Marble Road*).",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Why do the directions say to make an “IMMEDIATE right” onto Chapel St.?",
    options: {
      A: "Because you need to turn right promptly as soon as you exit onto the road",
      B: "Because Chapel St. is very far away",
      C: "Because you should turn right before seeing the road",
      D: "Because the road is closed"
    },
    correct: "A",
    explanation: "Kata *immediate right* menginstruksikan pengemudi untuk langsung segera berbelok ke kanan tanpa menunda atau melaju lurus terlalu jauh.",
    difficulty: "MEDIUM"
  },
  {
    num: 9,
    question: "How many blocks should Kara's mom pass on Oak Street before turning onto Marble Road?",
    options: {
      A: "One",
      B: "Five",
      C: "Two",
      D: "Three"
    },
    correct: "D",
    explanation: "Petunjuk nomor 4 menyatakan: *\"Go three blocks and turn left on Marble Road.\"*",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "“Hey, does this belong to you? … book is very awesome.”",
    options: {
      A: "Your",
      B: "You’re",
      C: "Yours",
      D: "You"
    },
    correct: "A",
    explanation: "Sebelum kata benda *book*, dibutuhkan *possessive adjective* yaitu *your* (*your book*). *You're* = you are, *yours* = kata ganti mandiri.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "A motorcycle is commonly faster than a …",
    options: {
      A: "Helicopter",
      B: "Plane",
      C: "Train",
      D: "Bicycle"
    },
    correct: "D",
    explanation: "Sepeda motor melaju lebih cepat daripada sepeda kayuh (*bicycle*). Helikopter, pesawat, dan kereta cepat jauh lebih cepat dari sepeda motor.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "A bus is slower than a …",
    options: {
      A: "Horse cart",
      B: "Pedicab",
      C: "Plane",
      D: "Walking person"
    },
    correct: "C",
    explanation: "Bus umum melaju lebih lambat jika dibandingkan dengan pesawat terbang (*plane*).",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "These are land transportations, EXCEPT ....",
    options: {
      A: "Submarine",
      B: "Bicycle",
      C: "Cart",
      D: "Train"
    },
    correct: "A",
    explanation: "Kapal selam (*submarine*) adalah transportasi bawah air/laut (*water transportation*), bukan transportasi darat.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "The passengers get on their bus at the .....",
    options: {
      A: "Bus station",
      B: "Railway station",
      C: "Airport",
      D: "Harbor"
    },
    correct: "A",
    explanation: "Penumpang menaiki bus di terminal bus (*bus station*).",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "A submarine and a ship are both … transportations.",
    options: {
      A: "Air",
      B: "Land",
      C: "Space",
      D: "Water"
    },
    correct: "D",
    explanation: "Kapal selam dan kapal laut keduanya beroperasi di perairan sehingga merupakan transportasi air (*water transportation*).",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "For her birthday, she wants the … cake in the bakery.",
    image: "/uploads/kmsi24_ing2_q16.png",
    options: {
      A: "Expensivest",
      B: "Expensiver",
      C: "Most expensive",
      D: "More cheap"
    },
    correct: "C",
    explanation: "Bentuk tingkat paling tinggi (*superlative*) untuk kata sifat lebih dari dua suku kata (*expensive*) adalah *the most expensive*.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "The t-shirt is clean and the iced tea is ….",
    options: {
      A: "Cold",
      B: "Hot",
      C: "Heavy",
      D: "Spicy"
    },
    correct: "A",
    explanation: "Es teh manis (*iced tea*) memiliki suhu yang dingin dan menyegarkan (*cold*).",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Dera was born on May 8th. How do we say the date in words?",
    options: {
      A: "May eighteenth",
      B: "May eight",
      C: "May eighteen",
      D: "May eighth"
    },
    correct: "D",
    explanation: "Penyebutan tanggal dalam bahasa Inggris menggunakan *ordinal numbers*: tanggal 8 Mei dibaca *May eighth*.",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Ando bought a car with a lot of money. The car is very …",
    options: {
      A: "Cheap",
      B: "Expensive",
      C: "Old",
      D: "Small"
    },
    correct: "B",
    explanation: "Barang yang dibeli dengan uang dalam jumlah banyak bermakna mahal (*expensive*).",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "The following statements are correct, EXCEPT ....",
    options: {
      A: "Tia tastes the food with her tongue",
      B: "Ria eats cake with her mouth",
      C: "Mario watches TV with his eyes",
      D: "Lala listens to music using her hands"
    },
    correct: "D",
    explanation: "Mendengarkan musik menggunakan telinga (*ears*), bukan tangan (*hands*).",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "“Derek played well in the match yesterday.”\nThe word 'yesterday' is an …",
    options: {
      A: "Adverb of time",
      B: "Adverb of place",
      C: "Adverb of manner",
      D: "Adverb of degree"
    },
    correct: "A",
    explanation: "Kata *yesterday* (kemarin) menerangkan waktu terjadinya suatu peristiwa, sehingga merupakan kata keterangan waktu (*adverb of time*).",
    difficulty: "MEDIUM"
  },
  {
    num: 22,
    question: "“I have no idea why she acted like that.”\nThe word 'why' here functions as a …",
    options: {
      A: "Adverb of place",
      B: "Adverb of timing",
      C: "Relative adverb",
      D: "Adverb of frequency"
    },
    correct: "C",
    explanation: "Kata *why* yang menghubungkan klausa alasan bertindak sebagai kata keterangan penghubung (*relative adverb*).",
    difficulty: "HARD"
  },
  {
    num: 23,
    question: "“Janice came home early today.”\nThe word 'early' functions as an …",
    options: {
      A: "Adverb of time",
      B: "Adverb of manner",
      C: "Interrogative adverb",
      D: "Adverb of place"
    },
    correct: "A",
    explanation: "Kata *early* (lebih awal/pagi) memberikan keterangan waktu kedatangan, sehingga tergolong *adverb of time*.",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "“She usually fetches her groceries at the nearby farms.”\nThe word 'usually' is an …",
    options: {
      A: "Adverb of manner",
      B: "Adverb of frequency",
      C: "Adverb of place",
      D: "Adverb of degree"
    },
    correct: "B",
    explanation: "*Usually* (biasanya) menyatakan seberapa sering suatu perbuatan dilakukan, sehingga merupakan kata keterangan frekuensi (*adverb of frequency*).",
    difficulty: "MEDIUM"
  },
  {
    num: 25,
    question: "“She skipped her routine in the morning yesterday.”\nThe phrase 'in the morning' is an …",
    options: {
      A: "Adverbial phrase of degree",
      B: "Adverbial phrase of manner",
      C: "Adverbial phrase of time",
      D: "Adverbial phrase of place"
    },
    correct: "C",
    explanation: "Frasa *in the morning* menyatakan keterangan waktu pelaksanaan (*adverbial phrase of time*).",
    difficulty: "MEDIUM"
  },
  {
    num: 26,
    question: "Read the passage about The Smiths to answer questions 26 - 30!\n\n\"The Smith family lives in a cozy two-story house. There are four people in the family: Mr. Smith, Mrs. Smith, and their two children, John and Sarah. Mrs. Smith usually cooks delicious meals in the kitchen. In the evening, the family gathers in the living room to watch TV. In the bathroom, John and Sarah brush their teeth before going to bed. They also have a lovely garden where John and Sarah play fetch with their dog, Max. The house has three bedrooms upstairs.\"\n\nHow many people live in the house?",
    image: "/uploads/kmsi24_ing2_house.png",
    options: {
      A: "Two",
      B: "Five",
      C: "Three",
      D: "Four"
    },
    correct: "D",
    explanation: "Teks menyatakan: *\"There are four people in the family: Mr. Smith, Mrs. Smith, and their two children, John and Sarah.\"*",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Who usually cooks food in The Smiths' house?",
    options: {
      A: "Mrs. Smith",
      B: "John",
      C: "Mr. Smith",
      D: "Sarah"
    },
    correct: "A",
    explanation: "Kutipan teks: *\"Mrs. Smith usually cooks delicious meals in the kitchen.\"*",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "What do John and Sarah do in the bathroom before going to bed?",
    options: {
      A: "Washing clothes",
      B: "Changing attire",
      C: "Brushing teeth",
      D: "Feeding the dog"
    },
    correct: "C",
    explanation: "Teks menyatakan: *\"In the bathroom, John and Sarah brush their teeth before going to bed.\"*",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Where do John and Sarah play with their dog, Max?",
    options: {
      A: "In the kitchen",
      B: "In the garden",
      C: "In the bedroom",
      D: "In the bathroom"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"They also have a lovely garden where John and Sarah play fetch with their dog, Max.\"*",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "How many bedrooms does the house have upstairs?",
    options: {
      A: "Two",
      B: "Six",
      C: "Three",
      D: "One"
    },
    correct: "C",
    explanation: "Kalimat terakhir menyatakan: *\"The house has three bedrooms upstairs.\"*",
    difficulty: "EASY"
  },
  {
    num: 31,
    question: "Look at the picture! What is Andrew doing?",
    image: "/uploads/kmsi24_ing2_q31.png",
    options: {
      A: "Mopping the floor",
      B: "Sweeping the yard",
      C: "Dusting the furniture",
      D: "Vacuuming the carpet"
    },
    correct: "A",
    explanation: "Gambar stimulus memperlihatkan Andrew sedang membersihkan lantai menggunakan kain pel basah (*mopping the floor*).",
    difficulty: "EASY"
  },
  {
    num: 32,
    question: "“Mr. Brown is trimming a bush.” Which activity is he doing?",
    options: {
      A: "Watering flowers",
      B: "Cutting and shaping garden plants",
      C: "Planting seeds",
      D: "Digging soil"
    },
    correct: "B",
    explanation: "Kata kerja *trimming a bush* berarti memangkas dan merapikan bentuk semak atau tanaman perdu di kebun.",
    difficulty: "MEDIUM"
  },
  {
    num: 33,
    question: "Read the passage to answer questions 33 to 36!\n\n\"It is Saturday morning. Janet is standing on her apartment balcony. She says, 'Now I’m watching people in my neighbourhood through my binoculars. The park across the street is crowded today. Many families are spending their weekend there. Terry is riding his bicycle, while Pamela is happily playing on the swing. Her little brother is playing with a red ball. The weather is so sunny and warm.'\"\n\nWhat tool is Janet using to watch people in her neighbourhood?",
    options: {
      A: "Telescope",
      B: "Binoculars",
      C: "Glasses",
      D: "Camera"
    },
    correct: "B",
    explanation: "Janet mengatakan: *\"Now I’m watching people in my neighbourhood through my binoculars.\"* (teropong binokular).",
    difficulty: "EASY"
  },
  {
    num: 34,
    question: "Who is playing on the swing in the park?",
    options: {
      A: "Terry",
      B: "Harold",
      C: "Pamela",
      D: "Janet"
    },
    correct: "C",
    explanation: "Teks menyatakan: *\"while Pamela is happily playing on the swing.\"*",
    difficulty: "EASY"
  },
  {
    num: 35,
    question: "How is the atmosphere of the park on Saturday morning?",
    options: {
      A: "It is quiet and empty",
      B: "It is crowded with many families",
      C: "It is stormy and dark",
      D: "It is closed"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"The park across the street is crowded today. Many families are spending their weekend there.\"*",
    difficulty: "EASY"
  },
  {
    num: 36,
    question: "Where is Janet watching her neighbourhood from?",
    options: {
      A: "From her room",
      B: "From the park bench",
      C: "From her apartment balcony",
      D: "From the rooftop"
    },
    correct: "C",
    explanation: "Teks menyatakan: *\"Janet is standing on her apartment balcony.\"*",
    difficulty: "EASY"
  },
  {
    num: 37,
    question: "Read the story to answer questions 37 to 40!\n\n\"Yesterday Dad returned from his business trip to Malang. He brought a large box containing 24 fresh apples. Mom gave 8 apples to our neighbor, Mrs. Tina. Then Mom saved 12 apples in the refrigerator to make an apple pie for dinner tomorrow. My brother and I each ate 2 apples in the afternoon. All the apples are so sweet and crunchy!\"\n\nWhere did Dad buy the apples?",
    options: {
      A: "Malang",
      B: "Surabaya",
      C: "Jogjakarta",
      D: "Magelang"
    },
    correct: "A",
    explanation: "Kalimat pertama menyatakan: *\"Yesterday Dad returned from his business trip to Malang. He brought a large box containing 24 fresh apples.\"*",
    difficulty: "EASY"
  },
  {
    num: 38,
    question: "How many apples were given away to the neighbor?",
    options: {
      A: "3 apples",
      B: "8 apples",
      C: "16 apples",
      D: "24 apples"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"Mom gave 8 apples to our neighbor, Mrs. Tina.\"*",
    difficulty: "EASY"
  },
  {
    num: 39,
    question: "How many apples are saved in the refrigerator for making apple pie?",
    options: {
      A: "1 apple",
      B: "6 apples",
      C: "12 apples",
      D: "24 apples"
    },
    correct: "C",
    explanation: "Kutipan teks: *\"Then Mom saved 12 apples in the refrigerator to make an apple pie...\"*",
    difficulty: "EASY"
  },
  {
    num: 40,
    question: "How many apples did the writer eat?",
    options: {
      A: "None",
      B: "2 apples",
      C: "4 apples",
      D: "8 apples"
    },
    correct: "B",
    explanation: "Teks menyatakan: *\"My brother and I each ate 2 apples in the afternoon.\"* Kata *each* berarti masing-masing memakan 2 apel.",
    difficulty: "EASY"
  }
];

// =========================================================================
// ARRAY DEFINISI BATCH 7
// =========================================================================
const BATCH_PACKAGES: BatchDefinition[] = [
  {
    pkgId: 'pkg_jso_2025_ing_1',
    pkgTitle: 'Olimpiade JSO 2025 — Penyisihan Bahasa Inggris Level 1 (Bergambar)',
    pkgSlug: 'olimpiade-jso-2025-penyisihan-bahasa-inggris-level-1',
    categoryId: 'cat_olimpiade_jso',
    categoryName: 'Jatim Science Olympiad (JSO)',
    categorySlug: 'jatim-science-olympiad',
    topicId: 'top_jso_2025_ing_1',
    topicName: 'Bahasa Inggris Level 1 Penyisihan JSO 2025',
    durationMinutes: 60,
    questions: JSO_2025_ING_1
  },
  {
    pkgId: 'pkg_jso_2025_ing_2',
    pkgTitle: 'Olimpiade JSO 2025 — Penyisihan Bahasa Inggris Level 2 (Bergambar)',
    pkgSlug: 'olimpiade-jso-2025-penyisihan-bahasa-inggris-level-2',
    categoryId: 'cat_olimpiade_jso',
    categoryName: 'Jatim Science Olympiad (JSO)',
    categorySlug: 'jatim-science-olympiad',
    topicId: 'top_jso_2025_ing_2',
    topicName: 'Bahasa Inggris Level 2 Penyisihan JSO 2025',
    durationMinutes: 60,
    questions: JSO_2025_ING_2
  },
  {
    pkgId: 'pkg_kmsi_2024_ing_1',
    pkgTitle: 'Olimpiade KMSI 2024 — Final Provinsi Bahasa Inggris Level 1 (Bergambar)',
    pkgSlug: 'olimpiade-kmsi-2024-final-provinsi-bahasa-inggris-level-1',
    categoryId: 'cat_olimpiade_kmsi',
    categoryName: 'Kompetisi Matematika, Sains, dan Inggris (KMSI)',
    categorySlug: 'kompetisi-matematika-sains-inggris',
    topicId: 'top_kmsi_2024_ing_1',
    topicName: 'Bahasa Inggris Level 1 Final Provinsi KMSI 2024',
    durationMinutes: 60,
    questions: KMSI_2024_ING_1
  },
  {
    pkgId: 'pkg_kmsi_2024_ing_2',
    pkgTitle: 'Olimpiade KMSI 2024 — Final Provinsi Bahasa Inggris Level 2 (Bergambar)',
    pkgSlug: 'olimpiade-kmsi-2024-final-provinsi-bahasa-inggris-level-2',
    categoryId: 'cat_olimpiade_kmsi',
    categoryName: 'Kompetisi Matematika, Sains, dan Inggris (KMSI)',
    categorySlug: 'kompetisi-matematika-sains-inggris',
    topicId: 'top_kmsi_2024_ing_2',
    topicName: 'Bahasa Inggris Level 2 Final Provinsi KMSI 2024',
    durationMinutes: 60,
    questions: KMSI_2024_ING_2
  }
];

async function runImportBatch7() {
  console.log('🚀 Memulai Impor Batch 7: Soal-soal Olimpiade JSO & KMSI...');

  const dbPath = path.resolve(process.env.DATABASE_PATH || './data/cerdasify.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('busy_timeout = 5000');

  let totalQuestionsCount = 0;

  for (const batch of BATCH_PACKAGES) {
    console.log(`\n📦 Memproses Paket: ${batch.pkgTitle} (${batch.questions.length} butir soal)`);
    totalQuestionsCount += batch.questions.length;

    // 1. Pastikan Kategori Terdaftar di SQLite & Postgres
    sqlite.prepare(`
      INSERT INTO categories (id, name, slug)
      VALUES (?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET name = excluded.name
    `).run(batch.categoryId, batch.categoryName, batch.categorySlug);

    await client`
      INSERT INTO categories (id, name, slug)
      VALUES (${batch.categoryId}, ${batch.categoryName}, ${batch.categorySlug})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `;

    // 2. Pastikan Topik Terdaftar di SQLite & Postgres
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

    // 3. Pastikan Exam Package Terdaftar di SQLite & Postgres
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

    // 4. Persiapkan Data Soal & Opsi
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

    // 5. Ingest ke Supabase Postgres
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

    // 6. Ingest ke Local SQLite
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
  console.log(`\n🎉 SUKSES BESAR! Berhasil mengimpor ${totalQuestionsCount} butir soal baru ke 4 paket ujian KMSI & JSO pada basis data SQLite & PostgreSQL Supabase.`);
  process.exit(0);
}

runImportBatch7().catch((err) => {
  console.error('❌ Gagal menjalankan impor Batch 7:', err);
  process.exit(1);
});
