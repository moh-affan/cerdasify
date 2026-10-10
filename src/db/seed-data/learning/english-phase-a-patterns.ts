// Pola kalimat bersama untuk bacaan harian Fase A tahunan (english-phase-a-year-*.ts).
// Bahasa penjelasan ramah anak: tanpa istilah grammar teknis.

import type { SeedGrammar } from './types';

export const P = {
  myNameIs: {
    title: 'Pola: My name is … / I am …',
    pattern: 'My name is + nama • I am + umur/keterangan',
    explanation: 'My name is … artinya "Namaku …". I am … artinya "Aku …", misalnya I am eight years old (Aku berumur delapan tahun).',
    examples: ['My name is Rafi.', 'I am eight years old.'],
  },
  greetings: {
    title: 'Salam sepanjang hari',
    pattern: 'Good morning • Good afternoon • Good evening • Good night',
    explanation: 'Good morning untuk pagi, Good afternoon untuk siang–sore, Good evening untuk malam saat bertemu, dan Good night saat mau tidur atau berpisah di malam hari.',
    examples: ['Good morning, Mom!', 'Good night, Dad!'],
  },
  howAreYou: {
    title: 'Bertanya kabar: How are you?',
    pattern: 'How are you? → I am fine, thank you.',
    explanation: 'How are you? artinya "Apa kabar?". Jawabannya I am fine (aku baik), I am happy (aku senang), atau I am sick (aku sakit).',
    examples: ['How are you?', 'I am fine, thank you. And you?'],
  },
  heShe: {
    title: 'He untuk laki-laki, She untuk perempuan',
    pattern: 'He is … • She is … • His name / Her name',
    explanation: 'He dipakai untuk laki-laki dan She untuk perempuan. "Namanya" untuk laki-laki adalah His name, untuk perempuan Her name.',
    examples: ['He is my friend. His name is Budi.', 'She is kind. Her name is Dina.'],
  },
  politeWords: {
    title: 'Kata-kata sopan',
    pattern: 'Please • Thank you • You are welcome • Sorry',
    explanation: 'Please = tolong/silakan, Thank you = terima kasih, You are welcome = sama-sama, Sorry = maaf. Anak yang sopan sering memakai kata-kata ini.',
    examples: ['Thank you, Mom.', 'I am sorry. — That is okay.'],
  },
  iHave: {
    title: 'Pola: I have … (Aku punya …)',
    pattern: 'I have + jumlah + benda',
    explanation: 'I have artinya "aku punya". Untuk dia (he/she) dan hewan, pakai has: She has, It has.',
    examples: ['I have two eyes.', 'A cat has four legs.'],
  },
  iCan: {
    title: 'Pola: I can … (Aku bisa …)',
    pattern: 'I can + kata kerja • I cannot / can\'t + kata kerja',
    explanation: 'Can artinya "bisa". Setelah can, kata kerjanya tetap bentuk dasar (tidak ditambah -s). Can\'t artinya "tidak bisa".',
    examples: ['I can see with my eyes.', 'A fish can swim. A fish can\'t walk.'],
  },
  commands: {
    title: 'Kalimat perintah',
    pattern: 'Kata kerja di depan: Wash … • Touch … • Don\'t …',
    explanation: 'Untuk menyuruh atau mengajak, kalimat langsung dimulai dengan kata kerja. Untuk melarang, tambahkan Don\'t di depan.',
    examples: ['Wash your hands.', 'Don\'t run in the class.'],
  },
  thereIsAre: {
    title: 'Pola: There is / There are (Ada …)',
    pattern: 'There is + satu benda • There are + banyak benda',
    explanation: 'There is dipakai untuk satu benda, There are untuk dua benda atau lebih. Benda yang banyak biasanya diberi akhiran -s.',
    examples: ['There is a clock on the wall.', 'There are twenty desks.'],
  },
  plural: {
    title: 'Satu dan banyak (-s)',
    pattern: 'one apple • two apples',
    explanation: 'Kalau bendanya lebih dari satu, kita tambahkan -s di belakangnya: one bird, three birds. Ada kata yang berubah sendiri, misalnya one foot → two feet, one tooth → many teeth.',
    examples: ['One apple, two apples.', 'I have ten toes.'],
  },
  howMany: {
    title: 'Bertanya jumlah: How many …?',
    pattern: 'How many + benda (-s)? → There are …',
    explanation: 'How many artinya "berapa banyak". Bendanya memakai akhiran -s karena kita menanyakan jumlah.',
    examples: ['How many birds are there?', 'There are five birds.'],
  },
  iLike: {
    title: 'Pola: I like … (Aku suka …)',
    pattern: 'I like + benda • He/She likes + benda',
    explanation: 'I like artinya "aku suka". Untuk dia (he/she), tambahkan -s: She likes, He likes. Untuk tidak suka, pakai I don\'t like.',
    examples: ['I like mangoes.', 'Dad likes durian. Aisyah doesn\'t like durian.'],
  },
  itIs: {
    title: 'Pola: It is … (Ia/Itu …)',
    pattern: 'It is + sifat (warna, ukuran, rasa)',
    explanation: 'It dipakai untuk benda atau hewan. It is red = itu berwarna merah, It is sweet = itu manis.',
    examples: ['It is yellow.', 'It is sweet and juicy.'],
  },
  animalSounds: {
    title: 'Hewan dan suaranya',
    pattern: 'A cow says "moo". • The hen says "cluck".',
    explanation: 'Dalam bahasa Inggris, suara hewan ditulis berbeda: sapi "moo", bebek "quack", ayam "cluck", anjing "woof", kucing "meow".',
    examples: ['A duck says "quack".', 'A dog says "woof".'],
  },
  prepositions: {
    title: 'Di mana? in • on • under',
    pattern: 'in = di dalam • on = di atas • under = di bawah',
    explanation: 'Kata kecil ini menunjukkan tempat. The cat is in the box (di dalam kotak), on the bed (di atas kasur), under the table (di bawah meja).',
    examples: ['Milo is in the box.', 'The book is on the desk.'],
  },
  everyday: {
    title: 'Kegiatan yang sering dilakukan',
    pattern: 'I + kata kerja • He/She + kata kerja-s',
    explanation: 'Untuk kegiatan yang biasa dilakukan, pakai bentuk dasar setelah I/We/They. Setelah He/She/nama orang, tambahkan -s atau -es: Mom cooks, Dad washes.',
    examples: ['I wake up at six.', 'Mom cooks in the kitchen.'],
  },
  ingNow: {
    title: 'Sedang …: am / is / are + -ing',
    pattern: 'I am + kata kerja-ing • He/She is … • They are …',
    explanation: 'Untuk kegiatan yang sedang terjadi sekarang, pakai am/is/are lalu kata kerja ditambah -ing. I am reading = aku sedang membaca.',
    examples: ['I am drawing a cat.', 'The children are playing.'],
  },
  daysOfWeek: {
    title: 'Nama-nama hari',
    pattern: 'on + nama hari',
    explanation: 'Nama hari selalu diawali huruf besar: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Untuk "pada hari …" pakai on: on Monday.',
    examples: ['I go swimming on Saturday.', 'Today is Monday.'],
  },
  canIQuestion: {
    title: 'Meminta izin: Can I …?',
    pattern: 'Can I + kata kerja …? → Yes, you can. / Sure!',
    explanation: 'Can I …? dipakai untuk meminta izin dengan sopan. Tambahkan please supaya lebih sopan.',
    examples: ['Can I borrow your pencil, please?', 'Yes, here you are.'],
  },
  feelings: {
    title: 'Mengungkapkan perasaan',
    pattern: 'I am + perasaan • I feel + perasaan',
    explanation: 'Untuk menceritakan perasaan, pakai I am atau I feel lalu kata perasaan: happy (senang), sad (sedih), angry (marah), scared (takut), tired (lelah).',
    examples: ['I am happy.', 'Rafi feels sad.'],
  },
  weather: {
    title: 'Bertanya cuaca: What is the weather like?',
    pattern: 'It is + sunny / rainy / cloudy / windy',
    explanation: 'Untuk cuaca kita memakai It is. Sunny = cerah, rainy = hujan, cloudy = berawan, windy = berangin.',
    examples: ['What is the weather like today?', 'It is rainy.'],
  },
  wantTo: {
    title: 'Pola: I want to … (Aku ingin …)',
    pattern: 'I want to + kata kerja • I want + benda',
    explanation: 'Want artinya "ingin". Kalau yang diinginkan adalah kegiatan, tambahkan to: I want to play. Kalau benda: I want a kite.',
    examples: ['I want to fly a kite.', 'Aisyah wants a doll.'],
  },
  whatIs: {
    title: 'Bertanya: What …? Where …? Who …?',
    pattern: 'What = apa • Where = di mana • Who = siapa',
    explanation: 'Kata tanya diletakkan di awal kalimat. What is it? (Apa itu?), Where is Milo? (Di mana Milo?), Who is she? (Siapa dia?).',
    examples: ['Where is my bag?', 'Who is your teacher?'],
  },
  past: {
    title: 'Cerita kemarin: kata kerja bentuk lampau',
    pattern: 'yesterday / last … + kata kerja lampau (-ed atau berubah)',
    explanation: 'Untuk kejadian yang sudah lewat, kata kerjanya berubah. Banyak yang ditambah -ed (play → played), ada juga yang berubah bentuk: go → went, eat → ate, see → saw, have → had, is → was.',
    examples: ['Yesterday I played football.', 'We went to the beach.'],
  },
  wasWere: {
    title: 'was / were (dulu/tadi)',
    pattern: 'I/He/She/It was … • We/They were …',
    explanation: 'Was dan were adalah bentuk lampau dari is, am, are. It was hot = tadi/dulu panas.',
    examples: ['The trip was fun.', 'We were happy.'],
  },
  comparison: {
    title: 'Membandingkan: -er dan the -est',
    pattern: 'big → bigger → the biggest',
    explanation: 'Untuk membandingkan dua benda, tambahkan -er dan than: An elephant is bigger than a cow. Untuk yang paling, pakai the …-est: the biggest.',
    examples: ['A cheetah is faster than a horse.', 'The blue whale is the biggest animal.'],
  },
  willFuture: {
    title: 'Rencana: will / going to',
    pattern: 'I will + kata kerja • I am going to + kata kerja',
    explanation: 'Untuk sesuatu yang akan dilakukan nanti, pakai will atau am/is/are going to. Kata kerjanya tetap bentuk dasar.',
    examples: ['Tomorrow I will visit Grandma.', 'We are going to make a cake.'],
  },
  timeClock: {
    title: 'Membaca jam: o\'clock dan half past',
    pattern: 'It is … o\'clock • It is half past …',
    explanation: 'O\'clock untuk jam tepat (seven o\'clock = jam tujuh). Half past untuk setengah jam lewat (half past seven = jam setengah delapan).',
    examples: ['It is seven o\'clock.', 'School starts at half past seven.'],
  },
  because: {
    title: 'Memberi alasan: because',
    pattern: 'kalimat + because + alasan',
    explanation: 'Because artinya "karena". Kita pakai untuk menjelaskan alasan sesuatu.',
    examples: ['I am happy because it is my birthday.', 'Rafi wears a raincoat because it is rainy.'],
  },
  shouldShould: {
    title: 'Saran: should (sebaiknya)',
    pattern: 'We should + kata kerja • We shouldn\'t + kata kerja',
    explanation: 'Should artinya "sebaiknya". Kita pakai untuk memberi nasihat atau saran yang baik.',
    examples: ['We should save water.', 'We shouldn\'t throw trash in the river.'],
  },
} satisfies Record<string, SeedGrammar>;
