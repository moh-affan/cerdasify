// Pendidikan Agama Islam — Doa Harian & Surat Pendek (Juz 'Amma).
// Teks Arab berharakat gaya mushaf standar Indonesia, tanpa tanda waqaf.
// Terjemahan ayat mengacu pada Terjemah Al-Qur'an Kemenag RI.
// PENTING: verifikasi setiap teks Arab terhadap mushaf/sumber terpercaya sebelum dipublikasikan.

import type { SeedLesson } from './types';
import { suratPendek78to84 } from './surat-pendek-78-84';
import { suratPendek85to90 } from './surat-pendek-85-90';
import { suratPendek91to104 } from './surat-pendek-91-104';
import { suratPendek105to114, BASMALAH } from './surat-pendek-105-114';

export { BASMALAH };

export const doaHarian: SeedLesson[] = [
  {
    slug: 'doa-sebelum-makan',
    theme: 'Doa Harian',
    emoji: '🍽️',
    title: 'Doa Sebelum Makan',
    minutes: 2,
    intro:
      '**Kapan dibaca:** sebelum mulai makan atau minum.\n\n' +
      'Rasulullah ﷺ mengajarkan kita membaca **Bismillah** sebelum makan, makan dengan tangan kanan, dan mengambil makanan yang terdekat (HR. Bukhari & Muslim). Doa yang lebih panjang di bawahnya juga umum diajarkan di sekolah.',
    lines: [
      ['بِسْمِ اللّٰهِ', 'Bismillaah', 'Dengan nama Allah.'],
      [
        'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
        "Allaahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar",
        'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami, dan peliharalah kami dari siksa api neraka.',
      ],
    ],
    quiz: [
      ['Kalimat paling singkat yang dibaca sebelum makan adalah …', ['Alhamdulillah', 'Bismillah', 'Subhanallah'], 1, 'Sebelum makan kita membaca Bismillah (dengan nama Allah).'],
      ['Kita makan menggunakan tangan …', ['Kanan', 'Kiri', 'Kedua tangan'], 0, 'Rasulullah ﷺ mengajarkan makan dengan tangan kanan.'],
      ['"Wa qinaa \'adzaaban naar" artinya …', ['Berkahilah rezeki kami', 'Peliharalah kami dari siksa api neraka', 'Segala puji bagi Allah'], 1, 'Qinaa = peliharalah kami, \'adzaaban naar = siksa api neraka.'],
    ],
  },
  {
    slug: 'doa-sesudah-makan',
    theme: 'Doa Harian',
    emoji: '🤲',
    title: 'Doa Sesudah Makan',
    minutes: 2,
    intro:
      '**Kapan dibaca:** setelah selesai makan dan minum.\n\n' +
      '**Pesan:** bersyukur kepada Allah atas makanan dan minuman yang kita nikmati, dan tidak menyisakan makanan.',
    lines: [
      [
        'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
        "Alhamdulillaahil ladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin",
        'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang muslim.',
      ],
    ],
    quiz: [
      ['Doa sesudah makan diawali dengan kalimat …', ['Bismillah', 'Alhamdulillah', 'Astaghfirullah'], 1, 'Alhamdulillah = segala puji bagi Allah, ungkapan syukur.'],
      ['"Ath\'amanaa wa saqaanaa" artinya …', ['Memberi kami makan dan minum', 'Menjadikan kami muslim', 'Menghidupkan kami'], 0, 'Ath\'amanaa = memberi kami makan, saqaanaa = memberi kami minum.'],
      ['Sikap yang baik setelah makan adalah …', ['Menyisakan banyak makanan', 'Bersyukur kepada Allah', 'Langsung tidur'], 1, 'Kita bersyukur dengan membaca doa dan menghabiskan makanan.'],
    ],
  },
  {
    slug: 'doa-sebelum-tidur',
    theme: 'Doa Harian',
    emoji: '🌙',
    title: 'Doa Sebelum Tidur',
    minutes: 2,
    intro:
      '**Kapan dibaca:** ketika berbaring hendak tidur.\n\n' +
      '**Sumber:** HR. Bukhari & Muslim (dengan redaksi yang serupa).\n\n' +
      '**Adab:** berwudu, membersihkan tempat tidur, berbaring miring ke kanan, lalu membaca doa.',
    lines: [
      [
        'بِاسْمِكَ اللّٰهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوْتُ',
        'Bismikallaahumma ahyaa wa bismika amuut',
        'Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati.',
      ],
    ],
    quiz: [
      ['Doa ini dibaca saat …', ['Bangun tidur', 'Hendak tidur', 'Keluar rumah'], 1, 'Doa ini dibaca sebelum tidur.'],
      ['Saat tidur, sebaiknya kita berbaring miring ke …', ['Kanan', 'Kiri', 'Telungkup'], 0, 'Rasulullah ﷺ berbaring miring ke kanan.'],
      ['"Ahyaa" artinya …', ['Aku mati', 'Aku hidup', 'Aku tidur'], 1, 'Ahyaa = aku hidup, amuut = aku mati.'],
    ],
  },
  {
    slug: 'doa-bangun-tidur',
    theme: 'Doa Harian',
    emoji: '🌅',
    title: 'Doa Bangun Tidur',
    minutes: 2,
    intro:
      '**Kapan dibaca:** segera setelah bangun tidur.\n\n' +
      '**Sumber:** HR. Bukhari.\n\n' +
      '**Pesan:** tidur itu seperti "mati kecil". Bangun di pagi hari adalah nikmat dari Allah yang patut disyukuri.',
    lines: [
      [
        'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
        "Alhamdulillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur",
        'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan hanya kepada-Nya kami kembali.',
      ],
    ],
    quiz: [
      ['Doa ini dibaca saat …', ['Bangun tidur', 'Mau makan', 'Masuk masjid'], 0, 'Doa ini dibaca ketika bangun tidur.'],
      ['Doa bangun tidur diawali dengan …', ['Bismillah', 'Alhamdulillah', 'Allahu Akbar'], 1, 'Kita bersyukur karena Allah menghidupkan kita kembali.'],
      ['"Wa ilaihin nusyuur" artinya …', ['Dan kepada-Nya kami kembali', 'Dan berilah kami rezeki', 'Dan ampunilah kami'], 0, 'Ilaihi = kepada-Nya, an-nusyuur = kebangkitan/kembali.'],
    ],
  },
  {
    slug: 'doa-masuk-kamar-mandi',
    theme: 'Doa Harian',
    emoji: '🚻',
    title: 'Doa Masuk Kamar Mandi',
    minutes: 2,
    intro:
      '**Kapan dibaca:** sebelum masuk kamar mandi/WC, dibaca di luar.\n\n' +
      '**Sumber:** HR. Bukhari & Muslim.\n\n' +
      '**Adab:** masuk dengan kaki kiri dan tidak berbicara di dalam kamar mandi.',
    lines: [
      [
        'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        "Allaahumma innii a'uudzu bika minal khubutsi wal khabaa-its",
        'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.',
      ],
    ],
    quiz: [
      ['Masuk kamar mandi didahului kaki …', ['Kanan', 'Kiri', 'Bebas'], 1, 'Masuk kamar mandi dengan kaki kiri, keluar dengan kaki kanan.'],
      ['Doa masuk kamar mandi dibaca di …', ['Dalam kamar mandi', 'Luar kamar mandi', 'Atas kasur'], 1, 'Doa dibaca sebelum masuk, yaitu di luar kamar mandi.'],
      ['"A\'uudzu bika" artinya …', ['Aku berlindung kepada-Mu', 'Aku bersyukur kepada-Mu', 'Aku memohon ampun'], 0, "A'uudzu = aku berlindung, bika = kepada-Mu."],
    ],
  },
  {
    slug: 'doa-keluar-kamar-mandi',
    theme: 'Doa Harian',
    emoji: '🚿',
    title: 'Doa Keluar Kamar Mandi',
    minutes: 1,
    intro:
      '**Kapan dibaca:** setelah keluar dari kamar mandi/WC.\n\n' +
      '**Sumber:** HR. Abu Dawud & Tirmidzi.\n\n' +
      '**Adab:** keluar dengan kaki kanan.',
    lines: [['غُفْرَانَكَ', 'Ghufraanaka', 'Aku memohon ampunan-Mu (ya Allah).']],
    quiz: [
      ['Keluar kamar mandi didahului kaki …', ['Kanan', 'Kiri', 'Bebas'], 0, 'Keluar dengan kaki kanan.'],
      ['"Ghufraanaka" artinya …', ['Terima kasih ya Allah', 'Aku memohon ampunan-Mu', 'Dengan nama Allah'], 1, 'Ghufraanaka = (aku memohon) ampunan-Mu.'],
      ['Doa keluar kamar mandi terdiri dari berapa kata?', ['Satu kata', 'Tiga kata', 'Lima kata'], 0, 'Hanya satu kata: Ghufraanaka.'],
    ],
  },
  {
    slug: 'doa-keluar-rumah',
    theme: 'Doa Harian',
    emoji: '🏠',
    title: 'Doa Keluar Rumah',
    minutes: 2,
    intro:
      '**Kapan dibaca:** ketika melangkah keluar rumah, misalnya berangkat ke sekolah.\n\n' +
      '**Sumber:** HR. Abu Dawud & Tirmidzi.\n\n' +
      '**Pesan:** kita menyerahkan diri kepada Allah agar dijaga selama di perjalanan.',
    lines: [
      [
        'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
        "Bismillaahi tawakkaltu 'alallaah, laa hawla wa laa quwwata illaa billaah",
        'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
      ],
    ],
    quiz: [
      ['Doa ini dibaca saat …', ['Masuk rumah', 'Keluar rumah', 'Mau tidur'], 1, 'Doa ini dibaca ketika keluar rumah.'],
      ['"Tawakkaltu \'alallaah" artinya …', ['Aku bertawakal kepada Allah', 'Aku berlindung kepada Allah', 'Aku bersyukur kepada Allah'], 0, 'Tawakal = berserah diri kepada Allah setelah berusaha.'],
      ['"Laa hawla wa laa quwwata illaa billaah" artinya tiada daya dan kekuatan kecuali …', ['Dengan usaha sendiri', 'Dengan pertolongan Allah', 'Dengan bantuan teman'], 1, 'Semua kekuatan berasal dari Allah.'],
    ],
  },
  {
    slug: 'doa-naik-kendaraan',
    theme: 'Doa Harian',
    emoji: '🚗',
    title: 'Doa Naik Kendaraan',
    minutes: 2,
    intro:
      "**Kapan dibaca:** setelah duduk di atas kendaraan (sepeda, motor, mobil, kapal, pesawat).\n\n" +
      "**Sumber:** QS. Az-Zukhruf: 13–14.",
    lines: [
      [
        'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهٗ مُقْرِنِيْنَ، وَإِنَّا إِلٰى رَبِّنَا لَمُنْقَلِبُوْنَ',
        'Subhaanal ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun',
        'Mahasuci (Allah) yang telah menundukkan (kendaraan) ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
      ],
    ],
    quiz: [
      ['Doa ini dibaca ketika …', ['Naik kendaraan', 'Mau makan', 'Selesai belajar'], 0, 'Doa ini dibaca saat naik kendaraan.'],
      ['Doa naik kendaraan diambil dari surat …', ['Al-Fatihah', 'Az-Zukhruf', 'Al-Ikhlas'], 1, 'QS. Az-Zukhruf ayat 13–14.'],
      ['"Subhaana" artinya …', ['Segala puji', 'Mahasuci', 'Mahabesar'], 1, 'Subhaanallah = Mahasuci Allah.'],
    ],
  },
  {
    slug: 'doa-sebelum-belajar',
    theme: 'Doa Harian',
    emoji: '📖',
    title: 'Doa Mohon Tambahan Ilmu',
    minutes: 1,
    intro:
      "**Kapan dibaca:** sebelum belajar atau membaca buku.\n\n" +
      "**Sumber:** QS. Taha: 114. Allah memerintahkan Nabi Muhammad ﷺ untuk berdoa memohon tambahan ilmu.",
    lines: [['رَبِّ زِدْنِيْ عِلْمًا', "Rabbi zidnii 'ilmaa", 'Ya Tuhanku, tambahkanlah ilmu kepadaku.']],
    quiz: [
      ['Doa ini dibaca sebelum …', ['Belajar', 'Tidur', 'Makan'], 0, 'Kita memohon tambahan ilmu sebelum belajar.'],
      ['"Zidnii \'ilmaa" artinya …', ['Ampunilah aku', 'Tambahkanlah ilmu kepadaku', 'Lindungilah aku'], 1, "Zidnii = tambahkanlah untukku, 'ilmaa = ilmu."],
      ['Doa ini terdapat dalam surat …', ['Taha', 'Yasin', 'Al-Kahfi'], 0, 'QS. Taha ayat 114.'],
    ],
  },
  {
    slug: 'doa-untuk-kedua-orang-tua',
    theme: 'Doa Harian',
    emoji: '👨‍👩‍👧',
    title: 'Doa untuk Kedua Orang Tua',
    minutes: 2,
    intro:
      "**Kapan dibaca:** setiap selesai salat dan kapan saja.\n\n" +
      "**Sumber:** berdasarkan QS. Al-Isra': 24.\n\n" +
      '**Pesan:** mendoakan ayah dan ibu adalah salah satu bentuk berbakti kepada orang tua.',
    lines: [
      [
        'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا',
        'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa',
        'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil.',
      ],
    ],
    quiz: [
      ['Doa ini kita panjatkan untuk …', ['Teman', 'Kedua orang tua', 'Guru'], 1, 'Waalidayya = kedua orang tuaku.'],
      ['"Kamaa rabbayaanii shaghiiraa" artinya …', ['Sebagaimana mereka menyayangiku di waktu kecil', 'Berilah mereka rezeki', 'Masukkanlah mereka ke surga'], 0, 'Shaghiiraa = di waktu kecil.'],
      ['Mendoakan orang tua termasuk perbuatan …', ['Berbakti', 'Sombong', 'Malas'], 0, 'Mendoakan orang tua adalah tanda anak yang berbakti.'],
    ],
  },
  {
    slug: 'doa-kebaikan-dunia-akhirat',
    theme: 'Doa Harian',
    emoji: '🌍',
    title: 'Doa Kebaikan Dunia dan Akhirat',
    minutes: 2,
    intro:
      "**Kapan dibaca:** kapan saja; sering dibaca sebagai penutup doa.\n\n" +
      "**Sumber:** QS. Al-Baqarah: 201. Doa ini dikenal juga sebagai **doa sapu jagat**.",
    lines: [
      [
        'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        "Rabbanaa aatinaa fid dun-yaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar",
        'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
      ],
    ],
    quiz: [
      ['Doa ini dikenal dengan nama …', ['Doa sapu jagat', 'Doa iftitah', 'Doa qunut'], 0, 'Disebut doa sapu jagat karena memohon semua kebaikan.'],
      ['Doa ini memohon kebaikan di …', ['Dunia saja', 'Akhirat saja', 'Dunia dan akhirat'], 2, 'Fid dun-yaa hasanah wa fil aakhirati hasanah.'],
      ['Doa ini terdapat dalam surat …', ['Al-Baqarah', 'Al-Fatihah', 'An-Nas'], 0, 'QS. Al-Baqarah ayat 201.'],
    ],
  },
];

export const suratPendek: SeedLesson[] = [
  suratPendek105to114[0], // Surat Al-Fatihah (1)
  ...suratPendek78to84, // Surat 78 s.d. 84 (An-Naba' s.d. Al-Insyiqaq)
  ...suratPendek85to90, // Surat 85 s.d. 90 (Al-Buruj s.d. Al-Balad)
  ...suratPendek91to104, // Surat 91 s.d. 104 (Asy-Syams s.d. Al-Humazah)
  ...suratPendek105to114.slice(1), // Surat 105 s.d. 114 (Al-Fil s.d. An-Nas)
];

