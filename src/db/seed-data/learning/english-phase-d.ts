// Daily English Reading — Fase D (SMP Kelas 7–9), CEFR A2.
// Teks 150–220 kata, analisis grammar dengan istilah teknis, kuis 4 soal.

import type { SeedReading } from './types';

export const englishPhaseD: SeedReading[] = [
  {
    slug: 'd-komodo-dragons',
    theme: 'Wildlife of Indonesia',
    emoji: '🦎',
    title: 'Komodo Dragons: Real-Life Dragons',
    titleId: 'Komodo: Naga di Dunia Nyata',
    minutes: 5,
    sentences: [
      ['Komodo dragons are the largest lizards in the world.', 'Komodo adalah kadal terbesar di dunia.'],
      ['They live only in Indonesia, on a few islands such as Komodo, Rinca, and Flores.', 'Mereka hanya hidup di Indonesia, di beberapa pulau seperti Komodo, Rinca, dan Flores.'],
      ['An adult Komodo can grow up to three metres long and weigh more than 70 kilograms.', 'Komodo dewasa dapat tumbuh hingga tiga meter dan beratnya lebih dari 70 kilogram.'],
      ['Komodo dragons are carnivores.', 'Komodo adalah hewan karnivora.', true],
      ['They eat deer, wild pigs, and even buffalo.', 'Mereka memakan rusa, babi hutan, bahkan kerbau.'],
      ['A Komodo uses its long yellow tongue to smell the air.', 'Komodo menggunakan lidah kuningnya yang panjang untuk mencium bau di udara.'],
      ['It can find food from several kilometres away.', 'Ia dapat menemukan makanan dari jarak beberapa kilometer.'],
      ['Its bite is dangerous because it contains venom.', 'Gigitannya berbahaya karena mengandung bisa.'],
      ['Today, Komodo dragons are an endangered species.', 'Saat ini, komodo adalah spesies yang terancam punah.', true],
      ['In 1980, the Indonesian government created Komodo National Park to protect them.', 'Pada tahun 1980, pemerintah Indonesia membuat Taman Nasional Komodo untuk melindungi mereka.'],
      ['The park was named a UNESCO World Heritage Site in 1991.', 'Taman ini ditetapkan sebagai Situs Warisan Dunia UNESCO pada tahun 1991.'],
      ['Many tourists visit the park every year, but they must always walk with a ranger.', 'Banyak wisatawan mengunjungi taman itu setiap tahun, tetapi mereka harus selalu berjalan bersama penjaga hutan.'],
    ],
    vocab: [
      ['lizard', 'kadal', '🦎', 'noun', ['lizards'], 'the largest lizards in the world'],
      ['weigh', 'berbobot / menimbang', '⚖️', 'verb', [], 'weigh more than 70 kilograms'],
      ['carnivore', 'hewan pemakan daging', '🥩', 'noun', ['carnivores'], 'Komodo dragons are carnivores.'],
      ['venom', 'bisa / racun hewan', '☠️', 'noun', [], 'it contains venom'],
      ['endangered', 'terancam punah', '⚠️', 'adjective', [], 'an endangered species'],
      ['protect', 'melindungi', '🛡️', 'verb', [], 'to protect them'],
      ['ranger', 'penjaga hutan / jagawana', '🧑‍🌾', 'noun', [], 'walk with a ranger'],
    ],
    grammar: [
      {
        title: 'Superlative Adjective (Kata Sifat Tingkat Paling)',
        pattern: 'the + adjective-est · the most + adjective',
        explanation:
          'Superlative dipakai untuk membandingkan satu benda dengan semua yang lain ("paling"). Kata sifat pendek ditambah -est (large → the largest). Kata sifat panjang memakai the most (the most dangerous).',
        examples: ['Komodo dragons are the largest lizards in the world.'],
      },
      {
        title: 'Simple Present vs Simple Past',
        pattern: 'Fakta umum → Simple Present · Kejadian lampau → Simple Past',
        explanation:
          'Fakta yang selalu benar memakai Simple Present (live, eat, uses). Kejadian yang sudah selesai di masa lalu, biasanya dengan keterangan waktu seperti "in 1980", memakai Simple Past (created).',
        examples: ['They live only in Indonesia.', 'In 1980, the Indonesian government created Komodo National Park.'],
      },
      {
        title: 'Passive Voice (Kalimat Pasif) — Simple Past',
        pattern: 'Subject + was/were + Verb 3',
        explanation:
          'Kalimat pasif dipakai ketika yang penting adalah benda yang dikenai tindakan, bukan pelakunya. "The park was named …" artinya taman itu "ditetapkan/dinamai".',
        examples: ['The park was named a UNESCO World Heritage Site in 1991.'],
      },
    ],
    quiz: [
      ['Where do Komodo dragons live?', ['Only in Indonesia', 'In Australia and Indonesia', 'All over Asia'], 0, '"They live only in Indonesia."'],
      ['What does a Komodo use its tongue for?', ['To catch insects', 'To smell the air', 'To drink water'], 1, '"A Komodo uses its long yellow tongue to smell the air."'],
      ['Why was Komodo National Park created?', ['To build hotels', 'To protect the Komodo dragons', 'To train rangers'], 1, '"… created Komodo National Park to protect them."'],
      ['Which sentence is in the passive voice?', ['They eat deer.', 'The park was named a World Heritage Site.', 'Many tourists visit the park.'], 1, 'Pola was + Verb 3 (was named) adalah kalimat pasif.'],
    ],
  },
  {
    slug: 'd-borobudur',
    theme: 'History & Culture',
    emoji: '🛕',
    title: 'Borobudur: A Giant Stone Book',
    titleId: 'Borobudur: Buku Batu Raksasa',
    minutes: 5,
    sentences: [
      ['Borobudur is the largest Buddhist temple in the world.', 'Borobudur adalah candi Buddha terbesar di dunia.'],
      ['It is located in Magelang, Central Java.', 'Candi ini terletak di Magelang, Jawa Tengah.'],
      ['It was built in the 8th and 9th centuries, during the Syailendra dynasty.', 'Candi ini dibangun pada abad ke-8 dan ke-9, pada masa Dinasti Syailendra.'],
      ['The temple has nine levels.', 'Candi ini memiliki sembilan tingkat.', true],
      ['The walls are covered with more than 2,600 relief panels.', 'Dindingnya dihiasi lebih dari 2.600 panel relief.'],
      ['These carvings tell stories about daily life and teachings, so some people call Borobudur "a book made of stone".', 'Ukiran ini menceritakan kehidupan sehari-hari dan ajaran, sehingga sebagian orang menyebut Borobudur "buku yang terbuat dari batu".'],
      ['On the top levels, there are 72 stupas shaped like bells.', 'Di tingkat atas, terdapat 72 stupa berbentuk lonceng.'],
      ['For hundreds of years, Borobudur was hidden under volcanic ash and jungle.', 'Selama ratusan tahun, Borobudur tersembunyi di bawah abu vulkanik dan hutan.', true],
      ['In 1814, Thomas Stamford Raffles heard about it and sent a team to clear the site.', 'Pada tahun 1814, Thomas Stamford Raffles mendengar tentangnya dan mengirim tim untuk membersihkan situs itu.'],
      ['Later, from 1975 to 1982, Indonesia and UNESCO restored the temple.', 'Kemudian, dari tahun 1975 hingga 1982, Indonesia dan UNESCO memugar candi tersebut.'],
      ['Today, Borobudur is one of the most visited places in Indonesia.', 'Kini, Borobudur adalah salah satu tempat yang paling banyak dikunjungi di Indonesia.'],
    ],
    vocab: [
      ['temple', 'candi / kuil', '🛕', 'noun', [], 'the largest Buddhist temple'],
      ['located', 'terletak', '📍', 'adjective', [], 'It is located in Magelang.'],
      ['century', 'abad', '⏳', 'noun', ['centuries'], 'in the 8th and 9th centuries'],
      ['carving', 'ukiran', '🗿', 'noun', ['carvings'], 'These carvings tell stories.'],
      ['hidden', 'tersembunyi', '🙈', 'adjective', ['hide'], 'Borobudur was hidden under volcanic ash.'],
      ['ash', 'abu', '🌋', 'noun', [], 'volcanic ash'],
      ['restored', 'dipugar / dipulihkan', '🛠️', 'verb', ['restore'], 'Indonesia and UNESCO restored the temple.'],
    ],
    grammar: [
      {
        title: 'Passive Voice (Kalimat Pasif)',
        pattern: 'is/are + Verb 3 (sekarang) · was/were + Verb 3 (lampau)',
        explanation:
          'Teks sejarah dan deskripsi banyak memakai kalimat pasif karena fokusnya pada candi, bukan pada siapa pembangunnya. "It was built" = candi itu dibangun; "The walls are covered" = dindingnya dihiasi.',
        examples: [
          'It was built in the 8th and 9th centuries.',
          'The walls are covered with more than 2,600 relief panels.',
          'Borobudur was hidden under volcanic ash.',
        ],
      },
      {
        title: 'Conjunction "so" (Kata Hubung Akibat)',
        pattern: 'Sebab, so + akibat',
        explanation:
          'So artinya "sehingga/jadi". Bagian sebelum so adalah sebabnya, bagian sesudahnya adalah akibatnya.',
        examples: ['These carvings tell stories, so some people call Borobudur "a book made of stone".'],
      },
      {
        title: 'One of the + superlative + plural noun',
        pattern: 'one of the most + adjective + benda jamak',
        explanation:
          'Ungkapan "salah satu yang paling …". Perhatikan bahwa bendanya harus jamak (places, bukan place).',
        examples: ['Borobudur is one of the most visited places in Indonesia.'],
      },
    ],
    quiz: [
      ['Where is Borobudur located?', ['Yogyakarta City', 'Magelang, Central Java', 'Solo, Central Java'], 1, '"It is located in Magelang, Central Java."'],
      ['Why do some people call Borobudur "a book made of stone"?', ['Because it has a library', 'Because its carvings tell stories', 'Because it is shaped like a book'], 1, 'Relief-reliefnya "tell stories", sehingga disebut buku batu.'],
      ['What hid Borobudur for hundreds of years?', ['Sea water', 'Volcanic ash and jungle', 'Sand from the desert'], 1, '"… hidden under volcanic ash and jungle."'],
      ['"It ___ built in the 8th century." Pilih kata yang tepat.', ['is', 'was', 'were'], 1, 'Lampau + subjek tunggal (it) → was built.'],
    ],
  },
  {
    slug: 'd-plastic-in-our-oceans',
    theme: 'Environment',
    emoji: '🌊',
    title: 'Plastic in Our Oceans',
    titleId: 'Plastik di Lautan Kita',
    minutes: 5,
    sentences: [
      ['Every year, millions of tonnes of plastic end up in the ocean.', 'Setiap tahun, jutaan ton plastik berakhir di lautan.'],
      ['Plastic bags, bottles, and straws are carried by rivers to the sea.', 'Kantong plastik, botol, dan sedotan terbawa oleh sungai ke laut.'],
      ['Plastic does not disappear quickly.', 'Plastik tidak cepat hilang.'],
      ['A plastic bottle can stay in the ocean for hundreds of years.', 'Sebuah botol plastik bisa bertahan di lautan selama ratusan tahun.'],
      ['This is a big problem for sea animals.', 'Ini masalah besar bagi hewan laut.', true],
      ['Sea turtles often think that plastic bags are jellyfish, so they eat them.', 'Penyu sering mengira kantong plastik adalah ubur-ubur, sehingga mereka memakannya.'],
      ['Birds and fish also swallow small pieces of plastic.', 'Burung dan ikan juga menelan potongan kecil plastik.'],
      ['Many of them become sick or die.', 'Banyak dari mereka menjadi sakit atau mati.'],
      ['We can help in simple ways.', 'Kita bisa membantu dengan cara-cara sederhana.', true],
      ['We should bring our own shopping bags and water bottles.', 'Kita sebaiknya membawa tas belanja dan botol minum sendiri.'],
      ['We should not throw rubbish into rivers.', 'Kita tidak boleh membuang sampah ke sungai.'],
      ['If everyone does a little, our oceans will be cleaner.', 'Jika semua orang berbuat sedikit, lautan kita akan lebih bersih.'],
    ],
    vocab: [
      ['ocean', 'samudra / lautan', '🌊', 'noun', ['oceans'], 'end up in the ocean'],
      ['straw', 'sedotan', '🥤', 'noun', ['straws'], 'bags, bottles, and straws'],
      ['disappear', 'menghilang', '💨', 'verb', [], 'Plastic does not disappear quickly.'],
      ['turtle', 'penyu / kura-kura', '🐢', 'noun', ['turtles'], 'Sea turtles often think …'],
      ['jellyfish', 'ubur-ubur', '🪼', 'noun', [], 'plastic bags are jellyfish'],
      ['swallow', 'menelan', '😮', 'verb', [], 'swallow small pieces of plastic'],
      ['rubbish', 'sampah', '🗑️', 'noun', [], 'throw rubbish into rivers'],
    ],
    grammar: [
      {
        title: 'Modal "should / should not" (Saran)',
        pattern: 'Subject + should (not) + Verb 1',
        explanation:
          'Should dipakai untuk memberi saran atau nasihat ("sebaiknya"). Bentuk negatifnya should not (shouldn\'t) berarti "sebaiknya tidak/jangan".',
        examples: ['We should bring our own shopping bags.', 'We should not throw rubbish into rivers.'],
      },
      {
        title: 'Conditional Sentence Type 1',
        pattern: 'If + Simple Present, … will + Verb 1',
        explanation:
          'Kalimat pengandaian tipe 1 membicarakan sesuatu yang mungkin terjadi di masa depan jika syaratnya terpenuhi.',
        examples: ['If everyone does a little, our oceans will be cleaner.'],
      },
      {
        title: 'Present Passive',
        pattern: 'are/is + Verb 3 + by …',
        explanation:
          '"Are carried by rivers" artinya "terbawa oleh sungai". Pelaku tindakan disebut setelah kata by.',
        examples: ['Plastic bags, bottles, and straws are carried by rivers to the sea.'],
      },
    ],
    quiz: [
      ['Why do sea turtles eat plastic bags?', ['They are very hungry', 'They think the bags are jellyfish', 'The bags taste good'], 1, '"Sea turtles often think that plastic bags are jellyfish."'],
      ['How long can a plastic bottle stay in the ocean?', ['A few days', 'About one year', 'Hundreds of years'], 2, '"… for hundreds of years."'],
      ['Which is the writer\'s advice?', ['Bring your own bottle', 'Buy more plastic straws', 'Throw rubbish into rivers'], 0, '"We should bring our own shopping bags and water bottles."'],
      ['"If everyone does a little, our oceans ___ cleaner."', ['are', 'will be', 'were'], 1, 'Conditional tipe 1: If + present, will + verb.'],
    ],
  },
  {
    slug: 'd-why-we-need-sleep',
    theme: 'Health',
    emoji: '😴',
    title: 'Why Do We Need Sleep?',
    titleId: 'Mengapa Kita Butuh Tidur?',
    minutes: 5,
    sentences: [
      ['Many teenagers go to bed late because they play games or chat on their phones.', 'Banyak remaja tidur larut karena bermain gim atau mengobrol di ponsel.'],
      ['However, sleep is very important for our bodies and brains.', 'Namun, tidur sangat penting bagi tubuh dan otak kita.'],
      ['Doctors say that teenagers need about eight to ten hours of sleep every night.', 'Dokter mengatakan bahwa remaja membutuhkan sekitar delapan sampai sepuluh jam tidur setiap malam.'],
      ['While we are sleeping, our brain is still working.', 'Saat kita sedang tidur, otak kita tetap bekerja.', true],
      ['It saves new information, so we can remember what we learned during the day.', 'Otak menyimpan informasi baru, sehingga kita bisa mengingat apa yang kita pelajari sepanjang hari.'],
      ['Sleep also helps our bodies grow and fight illness.', 'Tidur juga membantu tubuh kita tumbuh dan melawan penyakit.'],
      ['When we don\'t sleep enough, we feel tired and find it hard to concentrate.', 'Saat kita kurang tidur, kita merasa lelah dan sulit berkonsentrasi.'],
      ['Here are some tips for better sleep.', 'Berikut beberapa tips agar tidur lebih baik.', true],
      ['First, put your phone away at least one hour before bedtime, because its light keeps your brain awake.', 'Pertama, jauhkan ponselmu setidaknya satu jam sebelum tidur, karena cahayanya membuat otakmu tetap terjaga.'],
      ['Second, try to sleep and wake up at the same time every day.', 'Kedua, usahakan tidur dan bangun pada jam yang sama setiap hari.'],
      ['Finally, avoid sweet drinks and coffee in the evening.', 'Terakhir, hindari minuman manis dan kopi di malam hari.'],
    ],
    vocab: [
      ['teenager', 'remaja', '🧑', 'noun', ['teenagers'], 'Many teenagers go to bed late.'],
      ['brain', 'otak', '🧠', 'noun', ['brains'], 'our bodies and brains'],
      ['remember', 'mengingat', '💭', 'verb', [], 'we can remember what we learned'],
      ['illness', 'penyakit', '🤒', 'noun', [], 'fight illness'],
      ['concentrate', 'berkonsentrasi', '🎯', 'verb', [], 'hard to concentrate'],
      ['awake', 'terjaga', '👀', 'adjective', [], 'keeps your brain awake'],
      ['avoid', 'menghindari', '🚫', 'verb', [], 'avoid sweet drinks'],
    ],
    grammar: [
      {
        title: 'Connectors: however, because, so',
        pattern: 'however = namun · because = karena (sebab) · so = sehingga (akibat)',
        explanation:
          'Kata penghubung membuat tulisan mengalir dengan logis. However menunjukkan pertentangan dengan kalimat sebelumnya, because memperkenalkan sebab, dan so memperkenalkan akibat.',
        examples: [
          'However, sleep is very important for our bodies and brains.',
          'Many teenagers go to bed late because they play games.',
          'It saves new information, so we can remember what we learned.',
        ],
      },
      {
        title: 'Present Continuous dengan "while"',
        pattern: 'While + subject + am/is/are + Verb-ing',
        explanation:
          'While artinya "sementara/saat". Bersama Present Continuous, ia menggambarkan dua hal yang terjadi bersamaan.',
        examples: ['While we are sleeping, our brain is still working.'],
      },
      {
        title: 'Imperative (Kalimat Perintah) untuk Tips',
        pattern: 'Verb 1 + … (tanpa subjek)',
        explanation:
          'Teks berisi tips atau prosedur memakai kalimat perintah yang diawali kata kerja dasar. Penanda urutan first, second, finally membantu pembaca mengikuti langkahnya.',
        examples: ['First, put your phone away …', 'Finally, avoid sweet drinks and coffee in the evening.'],
      },
    ],
    quiz: [
      ['How many hours of sleep do teenagers need?', ['Five to six hours', 'About eight to ten hours', 'Twelve hours'], 1, '"… about eight to ten hours of sleep every night."'],
      ['What does the brain do while we are sleeping?', ['It stops working', 'It saves new information', 'It plays games'], 1, '"It saves new information."'],
      ['Why should we put our phones away before bedtime?', ['The light keeps our brain awake', 'The phone needs charging', 'Our parents are angry'], 0, '"… because its light keeps your brain awake."'],
      ['Which word shows a contrast (pertentangan)?', ['because', 'so', 'however'], 2, 'However = namun, menunjukkan pertentangan.'],
    ],
  },
];
