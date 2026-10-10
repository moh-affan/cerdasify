// Surat Pendek Juz 30 — Bagian 3: Surat 105 s.d. 114 + Surat Al-Fatihah.
// Teks Arab berharakat standar Mushaf Kemenag RI, transliterasi Latin, dan terjemahan resmi Kemenag RI.

import type { SeedLesson } from './types';

export const BASMALAH: [string, string, string] = [
  'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'Bismillaahir rahmaanir rahiim',
  'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
];

export const suratPendek105to114: SeedLesson[] = [
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
    slug: 'surat-al-fil',
    theme: 'Surat Pendek',
    emoji: '🐘',
    title: 'Surat Al-Fil',
    titleId: 'Gajah · 5 ayat',
    minutes: 3,
    intro:
      "**Surat ke-105** · **5 ayat** · Makkiyah.\n\n" +
      "Al-Fil artinya **gajah**. Surat ini menceritakan pasukan bergajah pimpinan Abrahah yang hendak menghancurkan Ka'bah, namun dihancurkan oleh Allah dengan kawanan burung Ababil yang melempari mereka batu kerikil dari tanah terbakar.",
    lines: [
      BASMALAH,
      ['اَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِاَصْحٰبِ الْفِيْلِ', "A lam tara kaifa fa'ala rabbuka bi-ash-haabil fiil", 'Tidakkah engkau (Muhammad) perhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah?', 1],
      ['اَلَمْ يَجْعَلْ كَيْدَهُمْ فِيْ تَضْلِيْلٍ', "A lam yaj'al kaidahum fii tadhliil", 'Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia?', 2],
      ['وَّاَرْسَلَ عَلَيْهِمْ طَيْرًا اَبَابِيْلَ', "Wa arsala 'alaihim thairan abaabiil", 'dan Dia mengirimkan kepada mereka burung yang berbondong-bondong,', 3],
      ['تَرْمِيْهِمْ بِحِجَارَةٍ مِّنْ سِجِّيْلٍ', 'Tarmiihim bihijaa-ratim min sijjiil', 'yang melempari mereka dengan batu dari tanah liat yang dibakar,', 4],
      ['فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُوْلٍ', "Fa ja'alahum ka'ashfim ma'kuul", 'sehingga mereka dijadikan-Nya seperti daun-daun yang dimakan (ulat).', 5],
    ],
    quiz: [
      ['Al-Fil artinya …', ['Unta', 'Gajah', 'Kuda'], 1, 'Al-Fil artinya gajah.'],
      ['Burung yang diutus Allah untuk menghancurkan pasukan bergajah bernama burung …', ['Garuda', 'Ababil', 'Merpati'], 1, 'Thairan abaabiil = burung yang berbondong-bondong (Ababil).'],
      ['Pasukan bergajah datang untuk menghancurkan …', ["Masjid Nabawi", "Ka'bah di Makkah", "Baitul Maqdis"], 1, "Abrahah dan pasukannya ingin menghancurkan Ka'bah."],
    ],
  },
  {
    slug: 'surat-quraisy',
    theme: 'Surat Pendek',
    emoji: '🤝',
    title: 'Surat Quraisy',
    titleId: 'Suku Quraisy · 4 ayat',
    minutes: 2,
    intro:
      "**Surat ke-106** · **4 ayat** · Makkiyah.\n\n" +
      "Menceritakan suku Quraisy yang diberi nikmat keamanan dan kemudahan bepergian berdagang pada musim dingin (ke Yaman) dan musim panas (ke Syam). Allah memerintahkan mereka menyembah Tuhan pemilik Ka'bah.",
    lines: [
      BASMALAH,
      ['لِاِيْلٰفِ قُرَيْشٍ', "Li-iilaafi quraisy", 'Karena kebiasaan orang-orang Quraisy,', 1],
      ['اٖلٰفِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', "Iilaafihim rihlatasy syitaa-i wash shaif", '(yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas.', 2],
      ['فَلْيَعْبُدُوْا رَبَّ هٰذَا الْبَيْتِ', "Fal ya'buduu rabba haadzal bait", "Maka hendaklah mereka menyembah Tuhan (pemilik) rumah ini (Ka'bah),", 3],
      ['الَّذِيْ اَطْعَمَهُمْ مِّنْ جُوْعٍ وَّاٰمَنَهُمْ مِّنْ خَوْفٍ', "Alladzii ath'amahum min juu'iw wa aamanahum min khauf", 'yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari rasa takut.', 4],
    ],
    quiz: [
      ['Surat Quraisy terdiri dari … ayat.', ['3', '4', '5'], 1, 'Surat Quraisy terdiri dari 4 ayat.'],
      ['Suku Quraisy biasa melakukan perjalanan dagang pada musim dingin dan musim …', ['Hujan', 'Panas', 'Semi'], 1, 'Rihlatasy syitaa-i wash shaif = perjalanan musim dingin dan musim panas.'],
      ['Tuhan yang disembah adalah pemilik rumah ini, yaitu …', ["Rumah penduduk", "Ka'bah di Makkah", "Istana raja"], 1, "Rabba haadzal bait = Tuhan pemilik Ka'bah."],
    ],
  },
  {
    slug: 'surat-al-maun',
    theme: 'Surat Pendek',
    emoji: '🍲',
    title: "Surat Al-Ma'un",
    titleId: 'Barang-Barang Berguna · 7 ayat',
    minutes: 3,
    intro:
      "**Surat ke-107** · **7 ayat** · Makkiyah/Madaniyah.\n\n" +
      "Al-Ma'un artinya **barang-barang yang berguna**. Surat ini memperingatkan orang-orang yang mendustakan agama, yaitu yang menghardik anak yatim, enggan memberi makan orang miskin, lalai dalam salat, berbuat riya', dan enggan memberi bantuan.",
    lines: [
      BASMALAH,
      ['اَرَءَيْتَ الَّذِيْ يُكَذِّبُ بِالدِّيْنِ', "A ra-aital ladzii yukadz-dzibu bid-diin", 'Tahukah kamu (orang) yang mendustakan agama?', 1],
      ['فَذٰلِكَ الَّذِيْ يَدُعُّ الْيَتِيْمَ', "Fa dzaalikal ladzii yadu'-'ul yatiim", 'Maka itulah orang yang menghardik anak yatim,', 2],
      ['وَلَا يَحُضُّ عَلٰى طَعَامِ الْمِسْكِيْنِ', "Wa laa yahudh-dhu 'alaa tha'aamil miskiin", 'dan tidak mendorong memberi makan orang miskin.', 3],
      ['فَوَيْلٌ لِّلْمُصَلِّيْنَ', "Fa wailul lil-mushalliin", 'Maka celakalah orang yang salat,', 4],
      ['الَّذِيْنَ هُمْ عَنْ صَلَاتِهِمْ سَاهُوْنَ', "Alladziina hum 'an shalaatihim saahuun", '(yaitu) orang-orang yang lalai terhadap salatnya,', 5],
      ['الَّذِيْنَ هُمْ يُرَآءُوْنَ', "Alladziina hum yuraa-uun", 'yang berbuat riya,', 6],
      ['وَيَمْنَعُوْنَ الْمَاعُوْنَ', "Wa yamna'uunal maa'uun", 'dan enggan (memberikan) bantuan.', 7],
    ],
    quiz: [
      ["Al-Ma'un artinya …", ['Barang-barang yang berguna', 'Anak yatim', 'Hari kiamat'], 0, "Al-Ma'un = bantuan / barang-barang yang berguna."],
      ['Ciri orang yang mendustakan agama menurut surat ini adalah …', ['Rajin bersedekah', 'Menghardik anak yatim', 'Tepat waktu salat'], 1, 'Orang yang menghardik anak yatim dan enggan menolong.'],
      ['Orang yang salatnya celaka adalah orang yang …', ['Salat dengan khusyuk', 'Lalai terhadap salatnya dan riya', 'Selalu berjamaah'], 1, 'Orang yang lalai dalam salatnya dan ingin dipuji (riya).'],
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
      ['Surat terpendek dalam Al-Qur\'an adalah …', ['Al-Ikhlas', 'Al-Kautsar', "Al-'Asr"], 1, 'Al-Kautsar hanya 3 ayat pendek.'],
      ['Ayat ke-2 memerintahkan kita untuk salat dan …', ['Berpuasa', 'Berkurban', 'Bersedekah'], 1, 'Wanhar = dan berkurbanlah.'],
    ],
  },
  {
    slug: 'surat-al-kafirun',
    theme: 'Surat Pendek',
    emoji: '🛡️',
    title: 'Surat Al-Kafirun',
    titleId: 'Orang-Orang Kafir · 6 ayat',
    minutes: 3,
    intro:
      "**Surat ke-109** · **6 ayat** · Makkiyah.\n\n" +
      "Al-Kafirun menegaskan kemurnian tauhid dan toleransi beragama dalam hal keyakinan ibadah: *'Untukmu agamamu, dan untukku agamaku.'* Tidak ada kompromi dalam peribadatan kepada selain Allah.",
    lines: [
      BASMALAH,
      ['قُلْ يٰٓاَيُّهَا الْكٰفِرُوْنَ', "Qul yaa ayyuhal kaafiruun", 'Katakanlah (Muhammad), "Wahai orang-orang kafir!', 1],
      ['لَآ اَعْبُدُ مَا تَعْبُدُوْنَ', "Laa a'budu maa ta'buduun", 'Aku tidak akan menyembah apa yang kamu sembah,', 2],
      ['وَلَآ اَنْتُمْ عٰبِدُوْنَ مَآ اَعْبُدُ', "Wa laa antum 'aabiduuna maa a'bud", 'dan kamu bukan penyembah apa yang aku sembah,', 3],
      ['وَلَآ اَنَا۠ عَابِدٌ مَّا عَبَدْتُّمْ', "Wa laa ana 'aabidum maa 'abattum", 'dan aku tidak pernah menjadi penyembah apa yang kamu sembah,', 4],
      ['وَلَآ اَنْتُمْ عٰبِدُوْنَ مَآ اَعْبُدُ', "Wa laa antum 'aabiduuna maa a'bud", 'dan kamu tidak pernah (pula) menjadi penyembah apa yang aku sembah.', 5],
      ['لَكُمْ دِيْنُكُمْ وَلِيَ دِيْنِ', "Lakum diinukum wa liya diin", 'Untukmu agamamu, dan untukku agamaku."', 6],
    ],
    quiz: [
      ['Al-Kafirun artinya …', ['Orang-orang beriman', 'Orang-orang kafir', 'Orang-orang munafik'], 1, 'Al-Kafirun = orang-orang kafir.'],
      ['Surat Al-Kafirun terdiri dari … ayat.', ['5', '6', '7'], 1, 'Al-Kafirun terdiri dari 6 ayat.'],
      ['"Lakum diinukum wa liya diin" artinya …', ['Untukmu agamamu, dan untukku agamaku', 'Tunjukilah kami jalan yang lurus', 'Katakanlah Dialah Allah Yang Maha Esa'], 0, 'Ayat ke-6 menegaskan toleransi: bagimu agamamu dan bagiku agamaku.'],
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
      "An-Nasr artinya **pertolongan**. Surat ini mengabarkan pertolongan Allah dan kemenangan kaum muslimin saat Fathu Makkah. Saat meraih kesuksesan, kita diajarkan bertasbih memuji Allah dan memohon ampun.",
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
      ['Ketika mendapat kemenangan, kita diajarkan untuk …', ['Berbangga diri', 'Bertasbih memuji Allah dan memohon ampun', 'Berpesta pora'], 1, 'Fasabbih bihamdi rabbika wastaghfirh.'],
    ],
  },
  {
    slug: 'surat-al-lahab',
    theme: 'Surat Pendek',
    emoji: '🔥',
    title: 'Surat Al-Lahab',
    titleId: 'Gejolak Api · 5 ayat',
    minutes: 3,
    intro:
      "**Surat ke-111** · **5 ayat** · Makkiyah.\n\n" +
      "Dikenal juga sebagai surat **Al-Masad**. Menceritakan Abu Lahab dan istrinya yang selalu memusuhi dan menyakiti dakwah Rasulullah ﷺ. Harta dan kedudukan mereka tidak dapat menyelamatkan mereka dari siksa api neraka.",
    lines: [
      BASMALAH,
      ['تَبَّتْ يَدَآ اَبِيْ لَهَبٍ وَّتَبَّ', "Tabbat yadaa abii lahabiw watabb", 'Binasalah kedua tangan Abu Lahab dan benar-benar binasa dia!', 1],
      ['مَآ اَغْنٰى عَنْهُ مَالُهٗ وَمَا كَسَبَ', "Maa aghnaa 'anhu maaluhuu wa maa kasab", 'Tidaklah berguna baginya hartanya dan apa yang dia usahakan.', 2],
      ['سَيَصْلٰى نَارًا ذَاتَ لَهَبٍ', "Sayashlaa naaran dzaata lahab", 'Kelak dia akan masuk ke dalam api yang bergejolak (neraka),', 3],
      ['وَّامْرَاَتُهٗ حَمَّالَةَ الْحَطَبِ', "Wamra-atuhuu hammaalatal hathab", 'dan (begitu pula) istrinya, pembawa kayu bakar (penyebar fitnah),', 4],
      ['فِيْ جِيْدِهَا حَبْلٌ مِّنْ مَّسَدٍ', "Fii jiidihaa hablum mim masad", 'di lehernya ada tali dari sabut yang dipintal.', 5],
    ],
    quiz: [
      ['Al-Lahab artinya …', ['Gejolak api', 'Gajah', 'Malam hari'], 0, 'Al-Lahab = gejolak api.'],
      ['Surat Al-Lahab juga dikenal dengan nama Surat …', ['Al-Ikhlas', 'Al-Masad', 'Al-Falaq'], 1, 'Surat ini juga dinamakan Al-Masad (tali sabut).'],
      ['Apa yang tidak berguna bagi Abu Lahab di hadapan Allah?', ['Harta dan apa yang diusahakannya', 'Pakaian indahnya', 'Unta tunggangannya'], 0, 'Maa aghnaa \'anhu maaluhuu wa maa kasab.'],
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
      "Surat ini menegaskan bahwa **Allah itu Maha Esa (satu)**, tempat bergantung segala makhluk, tidak beranak dan tidak diperanakkan, dan tidak ada yang setara dengan Dia.",
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
      ['Isi pokok surat Al-Ikhlas adalah …', ['Kisah para nabi', 'Keesaan Allah (tauhid)', 'Perintah zakat'], 1, 'Al-Ikhlas menjelaskan keesaan Allah yang mutlak.'],
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
      "Al-Falaq artinya **waktu subuh**. Surat ini berisi permohonan perlindungan kepada Allah dari kejahatan makhluk ciptaan-Nya, malam yang gelap gulita, penyihir, dan orang yang dengki.",
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
      ['Surat Al-Falaq berisi permohonan …', ['Perlindungan dari berbagai kejahatan', 'Tambahan harta', 'Kemenangan perang'], 0, 'Permohonan perlindungan kepada Allah yang menguasai subuh.'],
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
      "**Surat ke-114** (surat penutup Al-Qur'an) · **6 ayat** · Makkiyah.\n\n" +
      "An-Nas artinya **manusia**. Surat ini mengajarkan kita memohon perlindungan kepada Allah dari bisikan jahat setan yang bersembunyi di dalam dada manusia, baik dari golongan jin maupun manusia.",
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
      ['An-Nas artinya …', ['Manusia', 'Malaikat', 'Bintang'], 0, 'An-Nas = manusia.'],
      ['Surat An-Nas adalah surat ke- … dalam Al-Qur\'an.', ['112', '113', '114'], 2, 'An-Nas adalah surat ke-114 (terakhir).'],
      ['Surat An-Nas terdiri dari … ayat.', ['4', '5', '6'], 2, 'An-Nas terdiri dari 6 ayat.'],
    ],
  },
];
