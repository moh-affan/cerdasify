// Pendidikan Agama Islam — Doa Harian & Surat Pendek (Juz 'Amma).
// Teks Arab berharakat gaya mushaf standar Indonesia, tanpa tanda waqaf.
// Terjemahan ayat mengacu pada Terjemah Al-Qur'an Kemenag RI.
// PENTING: verifikasi setiap teks Arab terhadap mushaf/sumber terpercaya sebelum dipublikasikan.

import type { SeedLesson } from './types';

const BASMALAH: [string, string, string] = [
  'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'Bismillaahir rahmaanir rahiim',
  'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
];

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
  {
    slug: 'surat-al-fatihah',
    theme: 'Surat Pendek',
    emoji: '📗',
    title: 'Surat Al-Fatihah',
    titleId: 'Pembukaan · 7 ayat',
    minutes: 4,
    intro:
      "**Surat ke-1** dalam Al-Qur'an · **7 ayat** · Makkiyah (turun di Makkah).\n\n" +
      "Al-Fatihah artinya **pembukaan**, karena surat ini membuka Al-Qur'an. Al-Fatihah wajib dibaca di setiap rakaat salat dan disebut juga *Ummul Kitab* (induk Al-Qur'an).",
    lines: [
      ['بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ', 'Bismillaahir rahmaanir rahiim', 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.', 1],
      ['اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ', "Alhamdu lillaahi rabbil 'aalamiin", 'Segala puji bagi Allah, Tuhan seluruh alam,', 2],
      ['الرَّحْمٰنِ الرَّحِيْمِ', 'Ar-rahmaanir rahiim', 'Yang Maha Pengasih, Maha Penyayang,', 3],
      ['مٰلِكِ يَوْمِ الدِّيْنِ', 'Maaliki yaumid diin', 'Pemilik hari pembalasan.', 4],
      ['اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ', "Iyyaaka na'budu wa iyyaaka nasta'iin", 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.', 5],
      ['اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ', 'Ihdinash shiraathal mustaqiim', 'Tunjukilah kami jalan yang lurus,', 6],
      [
        'صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّآلِّيْنَ',
        "Shiraathal ladziina an'amta 'alaihim ghairil maghdhuubi 'alaihim wa ladh dhaalliin",
        '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
        7,
      ],
    ],
    quiz: [
      ['Al-Fatihah artinya …', ['Pembukaan', 'Penutup', 'Cahaya'], 0, 'Al-Fatihah = pembukaan.'],
      ['Surat Al-Fatihah terdiri dari … ayat.', ['5', '6', '7'], 2, 'Al-Fatihah terdiri dari 7 ayat.'],
      ['"Ihdinash shiraathal mustaqiim" artinya …', ['Tunjukilah kami jalan yang lurus', 'Segala puji bagi Allah', 'Pemilik hari pembalasan'], 0, 'Ayat ke-6: tunjukilah kami jalan yang lurus.'],
    ],
  },
  {
    slug: 'surat-al-ikhlas',
    theme: 'Surat Pendek',
    emoji: '☝️',
    title: 'Surat Al-Ikhlas',
    titleId: 'Memurnikan Keesaan Allah · 4 ayat',
    minutes: 3,
    intro:
      "**Surat ke-112** · **4 ayat** · Makkiyah.\n\n" +
      "Surat ini menjelaskan bahwa **Allah itu Maha Esa (satu)**, tidak beranak dan tidak diperanakkan, dan tidak ada yang setara dengan-Nya.",
    lines: [
      BASMALAH,
      ['قُلْ هُوَ اللّٰهُ اَحَدٌ', 'Qul huwallaahu ahad', 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa.', 1],
      ['اَللّٰهُ الصَّمَدُ', 'Allaahush shamad', 'Allah tempat meminta segala sesuatu.', 2],
      ['لَمْ يَلِدْ وَلَمْ يُوْلَدْ', 'Lam yalid wa lam yuulad', '(Allah) tidak beranak dan tidak pula diperanakkan.', 3],
      ['وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ', 'Wa lam yakul lahuu kufuwan ahad', 'Dan tidak ada sesuatu yang setara dengan Dia."', 4],
    ],
    quiz: [
      ['Surat Al-Ikhlas terdiri dari … ayat.', ['3', '4', '5'], 1, 'Al-Ikhlas terdiri dari 4 ayat.'],
      ['"Qul huwallaahu ahad" artinya: Katakanlah, Dialah Allah Yang Maha …', ['Esa', 'Besar', 'Pengasih'], 0, 'Ahad = Esa (satu).'],
      ['Isi pokok surat Al-Ikhlas adalah …', ['Kisah para nabi', 'Keesaan Allah', 'Perintah puasa'], 1, 'Al-Ikhlas menjelaskan keesaan Allah (tauhid).'],
    ],
  },
  {
    slug: 'surat-al-falaq',
    theme: 'Surat Pendek',
    emoji: '🌄',
    title: 'Surat Al-Falaq',
    titleId: 'Waktu Subuh · 5 ayat',
    minutes: 3,
    intro:
      "**Surat ke-113** · **5 ayat** · Makkiyah.\n\n" +
      "Al-Falaq artinya **waktu subuh**. Surat ini berisi permohonan perlindungan kepada Allah dari berbagai kejahatan. Bersama Al-Ikhlas dan An-Nas, surat ini dianjurkan dibaca pagi, petang, dan sebelum tidur.",
    lines: [
      BASMALAH,
      ['قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِ', "Qul a'uudzu birabbil falaq", 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),', 1],
      ['مِنْ شَرِّ مَا خَلَقَ', 'Min syarri maa khalaq', 'dari kejahatan (makhluk yang) Dia ciptakan,', 2],
      ['وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَ', 'Wa min syarri ghaasiqin idzaa waqab', 'dan dari kejahatan malam apabila telah gelap gulita,', 3],
      ['وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِ', "Wa min syarrin naffaatsaati fil 'uqad", 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),', 4],
      ['وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ', 'Wa min syarri haasidin idzaa hasad', 'dan dari kejahatan orang yang dengki apabila dia dengki."', 5],
    ],
    quiz: [
      ['Al-Falaq artinya …', ['Manusia', 'Waktu subuh', 'Masa'], 1, 'Al-Falaq = waktu subuh (fajar).'],
      ['Surat Al-Falaq terdiri dari … ayat.', ['5', '6', '7'], 0, 'Al-Falaq terdiri dari 5 ayat.'],
      ['Surat Al-Falaq berisi permohonan …', ['Perlindungan dari kejahatan', 'Tambahan rezeki', 'Ampunan dosa'], 0, '"Aku berlindung kepada Tuhan yang menguasai subuh…"'],
    ],
  },
  {
    slug: 'surat-an-nas',
    theme: 'Surat Pendek',
    emoji: '👥',
    title: 'Surat An-Nas',
    titleId: 'Manusia · 6 ayat',
    minutes: 3,
    intro:
      "**Surat ke-114** (surat terakhir dalam Al-Qur'an) · **6 ayat** · Makkiyah.\n\n" +
      "An-Nas artinya **manusia**. Surat ini mengajarkan kita berlindung kepada Allah dari bisikan jahat setan, baik dari golongan jin maupun manusia.",
    lines: [
      BASMALAH,
      ['قُلْ اَعُوْذُ بِرَبِّ النَّاسِ', "Qul a'uudzu birabbin naas", 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,', 1],
      ['مَلِكِ النَّاسِ', 'Malikin naas', 'Raja manusia,', 2],
      ['اِلٰهِ النَّاسِ', 'Ilaahin naas', 'sembahan manusia,', 3],
      ['مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', 'Min syarril waswaasil khannaas', 'dari kejahatan (bisikan) setan yang bersembunyi,', 4],
      ['الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِ', 'Alladzii yuwaswisu fii shuduurin naas', 'yang membisikkan (kejahatan) ke dalam dada manusia,', 5],
      ['مِنَ الْجِنَّةِ وَالنَّاسِ', 'Minal jinnati wan naas', 'dari (golongan) jin dan manusia."', 6],
    ],
    quiz: [
      ['An-Nas artinya …', ['Manusia', 'Jin', 'Raja'], 0, 'An-Nas = manusia.'],
      ['Surat An-Nas adalah surat ke- … dalam Al-Qur\'an.', ['112', '113', '114'], 2, 'An-Nas adalah surat ke-114, surat terakhir.'],
      ['Surat An-Nas terdiri dari … ayat.', ['4', '5', '6'], 2, 'An-Nas terdiri dari 6 ayat.'],
    ],
  },
  {
    slug: 'surat-al-kautsar',
    theme: 'Surat Pendek',
    emoji: '💧',
    title: 'Surat Al-Kautsar',
    titleId: 'Nikmat yang Banyak · 3 ayat',
    minutes: 2,
    intro:
      "**Surat ke-108** · **3 ayat** · Makkiyah. Surat terpendek dalam Al-Qur'an.\n\n" +
      "Al-Kautsar artinya **nikmat yang banyak**. Allah memerintahkan kita mensyukuri nikmat dengan salat dan berkurban.",
    lines: [
      BASMALAH,
      ['اِنَّآ اَعْطَيْنٰكَ الْكَوْثَرَ', "Innaa a'thainaakal kautsar", 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.', 1],
      ['فَصَلِّ لِرَبِّكَ وَانْحَرْ', 'Fashalli lirabbika wanhar', 'Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah).', 2],
      ['اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ', 'Inna syaani-aka huwal abtar', 'Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).', 3],
    ],
    quiz: [
      ['Al-Kautsar artinya …', ['Nikmat yang banyak', 'Pertolongan', 'Waktu'], 0, 'Al-Kautsar = nikmat yang banyak.'],
      ['Surat terpendek dalam Al-Qur\'an adalah …', ['Al-Ikhlas', 'Al-Kautsar', 'Al-\'Asr'], 1, 'Al-Kautsar hanya 3 ayat pendek.'],
      ['Ayat ke-2 memerintahkan kita untuk salat dan …', ['Berpuasa', 'Berkurban', 'Bersedekah'], 1, 'Wanhar = dan berkurbanlah.'],
    ],
  },
  {
    slug: 'surat-al-asr',
    theme: 'Surat Pendek',
    emoji: '⏳',
    title: "Surat Al-'Asr",
    titleId: 'Masa · 3 ayat',
    minutes: 2,
    intro:
      "**Surat ke-103** · **3 ayat** · Makkiyah.\n\n" +
      "Al-'Asr artinya **masa/waktu**. Manusia akan merugi, kecuali yang beriman, beramal saleh, dan saling menasihati dalam kebenaran dan kesabaran. Pesannya: gunakan waktu sebaik-baiknya!",
    lines: [
      BASMALAH,
      ['وَالْعَصْرِ', "Wal 'ashr", 'Demi masa,', 1],
      ['اِنَّ الْاِنْسَانَ لَفِيْ خُسْرٍ', 'Innal insaana lafii khusr', 'sungguh, manusia berada dalam kerugian,', 2],
      [
        'اِلَّا الَّذِيْنَ اٰمَنُوْا وَعَمِلُوا الصّٰلِحٰتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        "Illal ladziina aamanuu wa 'amilush shaalihaati wa tawaashau bil haqqi wa tawaashau bish shabr",
        'kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
        3,
      ],
    ],
    quiz: [
      ["Al-'Asr artinya …", ['Masa / waktu', 'Manusia', 'Subuh'], 0, "Al-'Asr = masa atau waktu."],
      ['Menurut surat ini, manusia berada dalam …', ['Kebahagiaan', 'Kerugian', 'Kemenangan'], 1, 'Innal insaana lafii khusr = manusia dalam kerugian.'],
      ['Orang yang TIDAK merugi adalah yang …', ['Banyak bermain', 'Beriman dan beramal saleh', 'Banyak tidur'], 1, 'Kecuali orang yang beriman, beramal saleh, dan saling menasihati.'],
    ],
  },
  {
    slug: 'surat-an-nasr',
    theme: 'Surat Pendek',
    emoji: '🏳️',
    title: 'Surat An-Nasr',
    titleId: 'Pertolongan · 3 ayat',
    minutes: 2,
    intro:
      "**Surat ke-110** · **3 ayat** · Madaniyah (turun di Madinah).\n\n" +
      "An-Nasr artinya **pertolongan**. Surat ini menceritakan pertolongan Allah dan kemenangan kaum muslimin, ketika manusia masuk Islam berbondong-bondong. Saat mendapat keberhasilan, kita diajarkan bertasbih, memuji Allah, dan memohon ampun.",
    lines: [
      BASMALAH,
      ['اِذَا جَآءَ نَصْرُ اللّٰهِ وَالْفَتْحُ', 'Idzaa jaa-a nashrullaahi wal fat-h', 'Apabila telah datang pertolongan Allah dan kemenangan,', 1],
      ['وَرَاَيْتَ النَّاسَ يَدْخُلُوْنَ فِيْ دِيْنِ اللّٰهِ اَفْوَاجًا', 'Wa ra-aitan naasa yadkhuluuna fii diinillaahi afwaajaa', 'dan engkau melihat manusia berbondong-bondong masuk agama Allah,', 2],
      [
        'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ اِنَّهٗ كَانَ تَوَّابًا',
        'Fasabbih bihamdi rabbika wastaghfirh, innahuu kaana tawwaabaa',
        'maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat.',
        3,
      ],
    ],
    quiz: [
      ['An-Nasr artinya …', ['Pertolongan', 'Kemenangan', 'Manusia'], 0, 'An-Nasr = pertolongan.'],
      ['Surat An-Nasr termasuk surat …', ['Makkiyah', 'Madaniyah', 'Tidak keduanya'], 1, 'An-Nasr turun di Madinah (Madaniyah).'],
      ['Ketika mendapat kemenangan, kita diajarkan untuk …', ['Berbangga diri', 'Bertasbih dan memohon ampun', 'Berpesta'], 1, 'Fasabbih bihamdi rabbika wastaghfirh.'],
    ],
  },
];
