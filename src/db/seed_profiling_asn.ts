import { db } from './index';
import {
  categories,
  topics,
  questions,
  questionOptions,
  examPackages,
  packageQuestions,
} from './schema';
import { eq, inArray } from 'drizzle-orm';

interface OptionSeed {
  label: 'A' | 'B' | 'C' | 'D' | 'E';
  contentMarkdown: string;
  isCorrect?: boolean;
  scoreValue?: number; // 1-5 for GRADED_SCALE, or 0/5 for SINGLE_CHOICE
}

interface QuestionSeed {
  id: string;
  topicId: string;
  type: 'GRADED_SCALE' | 'SINGLE_CHOICE';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
  contentMarkdown: string;
  explanationMarkdown: string;
  options: OptionSeed[];
}

interface PackageSeed {
  id: string;
  title: string;
  slug: string;
  type: 'SIMULATION' | 'PRACTICE';
  durationMinutes: number;
  passingGradeRules: string;
  questionIds: string[];
}

export async function seedProfilingASN() {
  console.log('=== MEMULAI SEEDING PAKET LATIHAN CAT PROFILING ASN ===');

  // 1. Kategori Profiling ASN
  const profilingCategory = {
    id: 'cat_profiling_asn',
    name: 'CAT Profiling & Asesmen ASN',
    slug: 'cat-profiling-asn',
    description:
      'Simulasi & Latihan Pemetaan Potensi dan Uji Kompetensi ASN (Manajerial, Sosio-Kultural, BerAKHLAK, Potensi Kognitif, dan Literasi Digital).',
    orderIndex: -1, // Muncul paling awal di dashboard
  };

  const existingCat = await db
    .select()
    .from(categories)
    .where(eq(categories.id, profilingCategory.id));
  if (existingCat.length === 0) {
    await db.insert(categories).values(profilingCategory);
    console.log('✓ Kategori ditambahkan:', profilingCategory.name);
  } else {
    await db
      .update(categories)
      .set({
        name: profilingCategory.name,
        slug: profilingCategory.slug,
        description: profilingCategory.description,
        orderIndex: profilingCategory.orderIndex,
      })
      .where(eq(categories.id, profilingCategory.id));
    console.log('✓ Kategori diperbarui:', profilingCategory.name);
  }

  // 2. Topik-topik Kompetensi
  const topicsData = [
    {
      id: 'top_prof_integritas',
      categoryId: profilingCategory.id,
      name: 'Integritas & Etika Pelayanan Publik',
      slug: 'integritas-etika-pelayanan-publik',
    },
    {
      id: 'top_prof_kerjasama_komunikasi',
      categoryId: profilingCategory.id,
      name: 'Kerjasama Tim & Komunikasi Efektif',
      slug: 'kerjasama-tim-komunikasi-efektif',
    },
    {
      id: 'top_prof_orientasi_hasil_pelayanan',
      categoryId: profilingCategory.id,
      name: 'Orientasi pada Hasil & Pelayanan Publik Prima',
      slug: 'orientasi-hasil-pelayanan-publik-prima',
    },
    {
      id: 'top_prof_pengembangan_perubahan',
      categoryId: profilingCategory.id,
      name: 'Pengembangan Diri & Mengelola Perubahan Organisasi',
      slug: 'pengembangan-diri-mengelola-perubahan',
    },
    {
      id: 'top_prof_pengambilan_keputusan',
      categoryId: profilingCategory.id,
      name: 'Pengambilan Keputusan & Pemecahan Masalah (Problem Solving)',
      slug: 'pengambilan-keputusan-pemecahan-masalah',
    },
    {
      id: 'top_prof_perekat_bangsa',
      categoryId: profilingCategory.id,
      name: 'Sosial Kultural: Perekat Bangsa & Keberagaman',
      slug: 'sosial-kultural-perekat-bangsa',
    },
    {
      id: 'top_prof_berakhlak',
      categoryId: profilingCategory.id,
      name: 'Internailisasi Core Values BerAKHLAK',
      slug: 'internalisasi-core-values-berakhlak',
    },
    {
      id: 'top_prof_potensi_analitis',
      categoryId: profilingCategory.id,
      name: 'Uji Potensi: Penalaran Analitis & Silogisme Logika',
      slug: 'potensi-penalaran-analitis-silogisme',
    },
    {
      id: 'top_prof_potensi_kuantitatif',
      categoryId: profilingCategory.id,
      name: 'Uji Potensi: Logika Kuantitatif, Data & Deret Angka',
      slug: 'potensi-logika-kuantitatif-deret-angka',
    },
    {
      id: 'top_prof_literasi_digital',
      categoryId: profilingCategory.id,
      name: 'Literasi Digital, Keamanan Data Siber & SPBE',
      slug: 'literasi-digital-keamanan-siber-spbe',
    },
  ];

  for (const t of topicsData) {
    const existingTop = await db.select().from(topics).where(eq(topics.id, t.id));
    if (existingTop.length === 0) {
      await db.insert(topics).values(t);
    } else {
      await db.update(topics).set(t).where(eq(topics.id, t.id));
    }
  }
  console.log(`✓ ${topicsData.length} topik kompetensi berhasil disiapkan.`);

  // 3. Kumpulan Soal Bank Profiling ASN
  const allQuestions: QuestionSeed[] = [
    // ==========================================
    // PAKET 1: KOMPETENSI MANAJERIAL (SJT) - 25 SOAL (1-25)
    // ==========================================
    {
      id: 'q_prof_man_01',
      topicId: 'top_prof_integritas',
      type: 'GRADED_SCALE',
      difficulty: 'HOTS',
      contentMarkdown:
        'Anda adalah Pejabat Pembuat Komitmen (PPK) di sebuah dinas. Menjelang akhir tahun anggaran, penyedia jasa yang merupakan rekanan lama dinas Anda meminta penandatanganan Berita Acara Serah Terima (BAST) pekerjaan 100%, padahal pekerjaan fisik di lapangan baru selesai sekitar 88%. Penyedia berjanji akan menyelesaikan sisa pekerjaan dalam waktu 4 hari ke depan dan memberikan jaminan tertulis di atas meterai agar anggaran tidak hangus. Sikap Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas (Level 3 - Memastikan kepatuhan terhadap standar dan aturan).**\n\n' +
        'Opsi **D (Poin 5)** menunjukkan ketegasan menolak kompromi yang melanggar regulasi keuangan negara. Menandatangani BAST 100% sebelum fisik rampung adalah pelanggaran pidana administrasi/korupsi fiktif. Pejabat yang berintegritas tinggi mengutamakan regulasi dan mencari mekanisme yang sah (misal: pemberian kesempatan dengan denda keterlambatan/pencairan bank garansi) daripada melanggar prinsip kepatuhan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyetujui permintaan tersebut karena rekanan memiliki rekam jejak yang baik dan ada jaminan tertulis di atas meterai.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyerahkan keputusan sepenuhnya kepada Kepala Dinas agar Anda terbebas dari tanggung jawab hukum di kemudian hari.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menolak menandatangani BAST 100% dan membiarkan anggaran hangus tanpa memberikan alternatif solusi legal.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Tegas menolak menandatangani BAST sebelum fisik riil 100%, serta menjalankan mekanisme regulasi yang sah (pembayaran sesuai progress riil atau mekanisme kelanjutan dengan denda/bank garansi).',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meminta tim teknis pengawas lapangan untuk memeriksa kembali apakah ada celah justifikasi teknis untuk menganggap pekerjaan selesai.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_02',
      topicId: 'top_prof_integritas',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Seorang pemohon izin mendatangi meja kerja Anda setelah berkas perizinannya dinyatakan lengkap dan selesai diproses. Sebagai ungkapan terima kasih, pemohon menyelipkan amplop berisi uang ke dalam map berkas Anda. Saat Anda tolak secara lisan, pemohon bersikukuh bahwa itu murni "tanda terima kasih tanpa maksud menyuap". Tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas (Anti-Gratifikasi).**\n\n' +
        'Opsi **C (Poin 5)** mencerminkan ketegasan memegang kode etik gratifikasi secara santun namun tidak dapat ditawar, disertai edukasi bahwa seluruh layanan ASN bebas pungli. Bila pemohon memaksa meninggalkan amplop, langkah wajib berikutnya adalah melaporkan ke Unit Pengendalian Gratifikasi (UPG).',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menerimanya karena pemohon memberikannya secara ikhlas setelah pelayanan selesai, sehingga bukan suap di awal.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menerimanya lalu secara diam-diam memasukkannya ke kotak amal masjid kantor agar uang tersebut menjadi berkah.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Tegas menolak dan mengembalikan amplop tersebut dengan santun, menjelaskan bahwa pelayanan telah dibiayai negara dan ASN dilarang keras menerima gratifikasi dalam bentuk apa pun.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memarahi pemohon tersebut di hadapan publik agar masyarakat lain tahu bahwa kantor Anda bersih dari korupsi.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meminta pemohon menaruhnya di meja rekan kerja lain agar Anda tidak terlibat langsung secara personal.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_man_03',
      topicId: 'top_prof_kerjasama_komunikasi',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda ditunjuk memimpin tim kerja lintas bidang untuk penyusunan Laporan Kinerja Instansi Pemerintah (LKjIP). Salah satu anggota tim yang mewakili bidang perencanaan sering tidak hadir dalam rapat koordinasi dan tidak menyerahkan data capaian indikator bidangnya hingga batas waktu terlewati. Tindakan terbaik yang Anda ambil adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Kerjasama & Komunikasi (Mengelola Konflik & Komitmen Tim).**\n\n' +
        'Opsi **B (Poin 5)** mengutamakan komunikasi persuasif dan klarifikasi personal terlebih dahulu untuk mengidentifikasi kendala riil, membangun komitmen ulang, dan baru melibatkan atasan berjenjang bila tidak ada itikad baik.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mengerjakan sendiri bagian tugas anggota tersebut agar laporan tetap selesai tepat waktu tanpa membuang energi.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengajak anggota tersebut berbicara empat mata untuk mengidentifikasi kendala yang dialaminya, menegaskan pentingnya data tersebut bagi tim, dan menyepakati jadwal penyerahan komitmen.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Langsung membuat nota dinas teguran ke Kepala Badan Kepegawaian agar anggota tersebut dikenai sanksi disiplin.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyindir kelalaian anggota tersebut di grup WhatsApp kantor agar merasa malu dan segera mengirim data.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Melaporkan secara formal kepada pimpinan langsung anggota tersebut dan pimpinan Anda untuk meminta arahan penggantian personel jika diperlukan.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_04',
      topicId: 'top_prof_kerjasama_komunikasi',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Dalam rapat evaluasi program kerja antar bidang, terjadi perdebatan panas antara Kepala Seksi A dan Kepala Seksi B mengenai alokasi anggaran sosialisasi program yang tumpang tindih. Suasana rapat menjadi tegang dan rapat terancam menemui jalan buntu. Sebagai moderator atau anggota rapat yang ditunjuk, apa yang akan Anda lakukan?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Komunikasi & Kerjasama (Fasilitasi Kolaborasi Lintas Sektor).**\n\n' +
        'Opsi **E (Poin 5)** menunjukkan kedewasaan manajerial: meredakan emosi, menarik diskusi kembali ke tujuan strategis organisasi, memetakan irisan tumpang tindih, dan memfasilitasi solusi integrasi program yang saling menguatkan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Meminta pimpinan tertinggi langsung memotong anggaran kedua bidang tersebut secara adil 50:50.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Memilih diam dan membiarkan keduanya berdebat sampai salah satu pihak kelelahan dan mengalah.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memihak pada seksi yang memiliki program dengan target kuantitatif paling besar.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membubarkan rapat dan menunda pembahasan hingga suasana hati para peserta rapat membaik.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menenangkan suasana, mengembalikan fokus pembahasan pada sasaran strategis instansi, lalu memetakan titik temu sinergi agar kegiatan sosialisasi dapat digabung secara kolaboratif.',
          scoreValue: 5,
          isCorrect: true,
        },
      ],
    },
    {
      id: 'q_prof_man_05',
      topicId: 'top_prof_orientasi_hasil_pelayanan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Instansi Anda meluncurkan aplikasi pelayanan publik baru. Pada hari-hari pertama, server mengalami kelambatan ekstrem (*down*) akibat lonjakan trafik pemohon. Warga yang telah mengantre di kantor pelayanan mulai meluapkan emosi dan komplain keras di loket. Sikap dan tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Orientasi Pelayanan & Orientasi Hasil (Kesiapan Tanggap Darurat Layanan).**\n\n' +
        'Opsi **B (Poin 5)** menggabungkan ketenangan menghadapi komplain warga dengan tindakan proaktif: menyampaikan permohonan maaf dan estimasi waktu perbaikan, mengaktifkan prosedur cadangan (manual/offline) agar warga tidak terlantar, serta berkoordinasi cepat dengan tim IT.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menutup loket sementara dan meminta warga pulang untuk kembali lagi keesokan harinya saat server normal.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menemui warga dengan ramah, memohon maaf atas kendala sistem, segera mengaktifkan SOP mitigasi pelayanan manual/pencatatan berkas offline sementara, sambil mengawal koordinasi tim teknis IT.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyalahkan vendor pengembang aplikasi di hadapan warga agar masyarakat tahu pihak dinas tidak bersalah.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Meminta petugas keamanan menertibkan warga yang berisik di loket agar tidak mengganggu ketenangan kantor.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Melayani warga secara manual sebisa mungkin dan mencatat keluhan mereka, namun tetap meminta mereka menunggu tanpa kepastian waktu.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_06',
      topicId: 'top_prof_orientasi_hasil_pelayanan',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Dinas Anda ditargetkan menyelesaikan verifikasi 1.500 berkas bantuan sosial dalam waktu 5 hari kerja dengan jumlah personel terbatas. Berdasarkan ritme kerja normal, tim Anda maksimal hanya sanggup menyelesaikan 180 berkas per hari (total 900 berkas dalam 5 hari). Sebagai koordinator tim, langkah operasional Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Orientasi pada Hasil (Efisiensi, Inovasi Proses & Manajemen Sumber Daya).**\n\n' +
        'Opsi **C (Poin 5)** memperlihatkan orientasi pencapaian target yang tinggi melalui restrukturisasi alur kerja (*streamlining*), pembagian peran berantai spesifik (*assembly-line method*), dan penetapan target harian terukur.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Melaporkan kepada pimpinan bahwa target tersebut tidak realistis dan meminta penurunan target menjadi 900 berkas.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Meminta seluruh anggota tim bekerja lembur hingga tengah malam setiap hari tanpa mengubah cara kerja verifikasi.',
          scoreValue: 3,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menganalisis kemacetan proses (bottleneck), merampingkan checklist verifikasi tanpa mengurangi keabsahan data, membagi tugas ke dalam spesialisasi stasiun kerja, dan memantau progres harian berkala.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mempercepat verifikasi dengan meloloskan berkas tanpa pemeriksaan dokumen pendukung secara ketat.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meminta bantuan staf dari bidang lain dan membagi berkas sama rata tanpa supervisi sistemik.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_07',
      topicId: 'top_prof_pengembangan_perubahan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pemerintah menerapkan kebijakan Sistem Informasi Pemerintahan Daerah (SIPD) atau aplikasi baru yang menggantikan seluruh format manual yang selama puluhan tahun digunakan oleh rekan-rekan senior di kantor Anda. Beberapa pegawai senior merasa enggan belajar dan terus meminta staf honorer muda mengerjakannya. Sebagai ASN yang memahami aplikasi tersebut, apa respon Anda?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Mengelola Perubahan & Mengembangkan Orang Lain.**\n\n' +
        'Opsi **D (Poin 5)** mencerminkan peran sebagai agen perubahan (*change agent*) yang suportif: menyusun panduan sederhana dan mendampingi secara bertahap hingga pegawai senior mandiri.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membiarkan hal tersebut karena pegawai senior sebentar lagi pensiun dan lebih wajar dikerjakan staf muda.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengusulkan kepada pimpinan agar pegawai yang menolak aplikasi baru langsung dipindahkan ke unit kerja non-teknis.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengerjakan akun milik para pegawai senior tersebut setiap kali mereka meminta tolong tanpa mengajari mereka.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membuat modul panduan visual ringkas, lalu mengadakan sesi pendampingan sebaya (*peer-coaching*) secara sabar agar para pegawai senior merasa percaya diri mengoperasikan sistem.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menegur para pegawai senior dalam rapat agar tidak membebani tenaga honorer dengan pekerjaan mereka.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_08',
      topicId: 'top_prof_pengembangan_perubahan',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Anda baru saja diangkat menjadi pejabat pengawas pada unit kerja yang memiliki reputasi kerja lambat dan budaya "datang absen pulang". Anggota tim merasa nyaman dengan status quo dan bersikap pasif terhadap inovasi. Strategi awal yang paling tepat untuk menggerakkan perubahan di unit Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Mengelola Perubahan (Membangun Visi Bersama & Quick Wins).**\n\n' +
        'Opsi **B (Poin 5)** menerapkan prinsip manajemen perubahan yang efektif: memimpin dengan teladan (*lead by example*), mendengar aspirasi tim untuk menemukan hambatan mental, lalu merancang kemenangan kecil (*quick wins*) yang membangun rasa bangga.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Langsung menerapkan sanksi pemotongan TPP dan hukuman disiplin yang ketat pada minggu pertama Anda bertugas.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Memberikan teladan disiplin diri, berdialog mendalam dengan anggota tim untuk memahami tantangan mereka, lalu menetapkan target perbaikan bertahap berbasis keberhasilan kecil (*quick wins*).',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyesuaikan diri dengan ritme kerja yang ada agar Anda tidak dianggap sok pintar atau dijauhi oleh tim.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Meminta mutasi kepada Badan Kepegawaian ke unit kerja lain yang sudah memiliki budaya kerja lebih produktif.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengundang motivator eksternal untuk memberi ceramah motivasi kerja kepada seluruh staf Anda.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_09',
      topicId: 'top_prof_pengambilan_keputusan',
      type: 'GRADED_SCALE',
      difficulty: 'HOTS',
      contentMarkdown:
        'Dalam pelaksanaan proyek strategis dinas senilai miliaran rupiah, terjadi bencana tanah longsor yang merusak sebagian struktur fondasi yang sedang dibangun. Atasan Anda sedang dinas luar negeri di wilayah tanpa sinyal selama 24 jam ke depan. Mandor lapangan meminta keputusan apakah pekerjaan di area terdampak harus dilanjutkan agar terhindar dari denda keterlambatan kontrak. Tindakan Anda sebagai pejabat teknis adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengambilan Keputusan (Mitigasi Risiko & Keselamatan Kerja).**\n\n' +
        'Opsi **A (Poin 5)** menunjukkan kepemimpinan yang berani mengambil keputusan krusial berbasis mitigasi risiko keselamatan dan kepatuhan konstruksi: menghentikan sementara zona bahaya, mendokumentasikan keadaan kahar (*force majeure*), melibatkan ahli teknis, dan menyiapkan laporan komprehensif untuk atasan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Memerintahkan penghentian sementara pekerjaan di zona terdampak demi keselamatan, menerbitkan instruksi pengamanan lokasi dan justifikasi kondisi kahar (*force majeure*), serta segera meminta kajian ahli struktur.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menunggu sampai atasan Anda dapat dihubungi keesokan harinya sebelum mengambil langkah apa pun.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memerintahkan kontraktor terus mengecor fondasi secepatnya agar progres fisik tidak jatuh dan terhindar dari audit BPK.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyerahkan sepenuhnya keputusan teknis kepada mandor lapangan karena mereka yang paling paham kondisi tanah.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Memerintahkan pekerjaan dialihkan ke zona lain yang aman, sembari mendokumentasikan kerusakan tanpa menerbitkan keputusan penghentian tertulis.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_10',
      topicId: 'top_prof_pengambilan_keputusan',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Anda dihadapkan pada dua pilihan program yang harus masuk ke dalam Rencana Kerja (Renja) tahun depan karena keterbatasan pagu anggaran:\n' +
        '1. **Program A:** Program populis yang sangat didukung oleh politisi lokal dan menguntungkan citra pimpinan, namun dampaknya bagi masyarakat hanya jangka pendek.\n' +
        '2. **Program B:** Program penataan sanitasi dan air bersih yang sangat dibutuhkan warga rentan stunting berdasarkan data BPS, namun dampaknya baru terlihat 2–3 tahun ke depan dan kurang menarik perhatian media.\n' +
        'Saran dan telaah staf yang akan Anda sampaikan kepada pimpinan adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengambilan Keputusan Berbasis Data & Kebijakan Berkelanjutan.**\n\n' +
        'Opsi **E (Poin 5)** memperlihatkan kematangan analitis: membela program yang menyelesaikan akar masalah mendasar (Program B berbasis data valid) sambil menawarkan skema kompromi komunikasi atau sinergi agar sasaran jangka pendek pimpinan tetap terakomodasi tanpa mengorbankan program prioritas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyarankan Program A karena kepuasan pimpinan dan hubungan baik dengan politisi adalah kunci kelancaran karir.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyarankan Program B secara mutlak dan menolak keras Program A tanpa memberikan alternatif penjelasan strategis.',
          scoreValue: 3,
        },
        {
          label: 'C',
          contentMarkdown:
            'Membiarkan pimpinan memilih sendiri tanpa memberikan rekomendasi berbasis data agar Anda berada di posisi aman.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membagi anggaran sama rata menjadi dua sehingga kedua program berjalan setengah-setengah meskipun tidak mencapai target optimal.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyajikan telaah berbasis data objektif yang mengunggulkan Program B demi penanganan stunting jangka panjang, disertai alternatif pengemasan publikasi yang menarik bagi pimpinan.',
          scoreValue: 5,
          isCorrect: true,
        },
      ],
    },
    {
      id: 'q_prof_man_11',
      topicId: 'top_prof_integritas',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda mengetahui bahwa rekan kerja satu tim Anda kerap memalsukan tanda tangan daftar hadir (presensi) rekan lainnya yang datang terlambat dengan imbalan traktiran makan siang. Perilaku ini sudah berlangsung beberapa bulan dan dianggap "lumrah" di lingkungan tersebut. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas (Menciptakan Lingkungan Kerja Berintegritas).**\n\n' +
        'Opsi **C (Poin 5)** menunjukkan keberanian menegur secara langsung rekan kerja atas perbuatan menyimpang, dan jika tidak diindahkan, berani menempuh mekanisme pelaporan internal untuk menjaga kedisiplinan organisasi.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Ikut menitipkan tanda tangan sesekali jika Anda terpaksa bangun kesiangan.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengabaikannya karena itu urusan pribadi masing-masing dan bukan tugas Anda sebagai staf penegak disiplin.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menegur rekan tersebut secara pribadi bahwa perbuatannya melanggar PP Disiplin PNS, dan jika tetap berlanjut, melaporkan kepada atasan langsung atau unit kepegawaian.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memotret daftar hadir tersebut dan mengunggahnya ke media sosial dengan akun anonim agar viral.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menolak jika diajak ikut serta, tetapi tetap merahasiakan hal tersebut dari pimpinan.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_12',
      topicId: 'top_prof_kerjasama_komunikasi',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Dalam sebuah proyek kerja kelompok, Anda menyadari bahwa salah satu anggota memiliki ide yang sangat inovatif namun ia merupakan pribadi yang pemalu dan jarang berbicara dalam forum rapat besar. Apa yang akan Anda lakukan untuk mendukung kinerja tim?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Kerjasama (Memberdayakan Potensi Anggota Tim).**\n\n' +
        'Opsi **D (Poin 5)** menunjukkan empati dan kemampuan membangun rasa aman psikologis (*psychological safety*): mendekati secara personal, membantunya menstrukturkan gagasannya, dan memberi ruang yang suportif saat forum rapat berlangsung.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mengambil ide tersebut dan menyampaikannya atas nama Anda sendiri agar rapat berjalan cepat.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Membiarkannya karena dalam dunia kerja setiap individu harus berani bersaing dan berbicara sendiri.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memaksanya berbicara di depan forum secara mendadak agar mentalnya terlatih.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mengajaknya berdiskusi secara santai sebelum rapat, membantunya memetakan konsep idenya, lalu memfasilitasi kesempatan baginya untuk berbicara di forum rapat dengan dukungan Anda.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meminta pimpinan untuk menunjuknya secara khusus agar dia tidak punya pilihan selain berbicara.',
          scoreValue: 4,
        },
      ],
    },
    {
      id: 'q_prof_man_13',
      topicId: 'top_prof_orientasi_hasil_pelayanan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Waktu operasional loket pelayanan kantor Anda berakhir pukul 15.00 WIB. Tepat pukul 14.58 WIB, seorang warga lanjut usia datang dengan napas terengah-engah dari desa terpencil untuk mengurus surat rujukan kesehatan yang sangat mendesak. Sikap Anda sebagai petugas pelayanan adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pelayanan Publik (Responsif & Berorientasi Kemanusiaan).**\n\n' +
        'Opsi **A (Poin 5)** mencerminkan empati pelayanan prima yang melampaui standar kaku jam dinding tanpa melanggar substansi aturan, melayani warga rentan dengan tuntas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyambut warga lansia tersebut dengan ramah, mempersilakannya duduk, dan tetap memproses dokumennya sampai tuntas meskipun melampaui jam operasional kantor.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menutup tirai loket tepat pukul 15.00 WIB dan memintanya datang kembali besok pagi sesuai jadwal operasional.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memarahinya karena datang terlambat menjelang jam kantor tutup, lalu melayaninya dengan wajah masam.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menerima berkasnya namun membiarkannya menumpuk dan baru akan diproses lusa.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyarankannya menggunakan aplikasi online tanpa mengecek apakah beliau memiliki smartphone atau tidak.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_14',
      topicId: 'top_prof_pengembangan_perubahan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Instansi tempat Anda bekerja memberikan tawaran beasiswa pendidikan S2/pelatihan peningkatan kompetensi bergengsi, namun dengan syarat peserta harus bersedia membagi waktu antara dinas dan perkuliahan malam. Sikap Anda terhadap peluang ini adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengembangan Diri (Komitmen Belajar Berkelanjutan).**\n\n' +
        'Opsi **C (Poin 5)** memperlihatkan antusiasme peningkatan kapasitas diri (*lifelong learner*) yang dibarengi dengan manajemen waktu profesional agar tugas kantor tetap berkinerja prima.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menolaknya karena khawatir waktu istirahat dan libur akhir pekan Anda akan berkurang banyak.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mendaftar hanya jika ada jaminan promosi jabatan otomatis setelah lulus kuliah.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyambut peluang tersebut dengan menyusun perencanaan manajemen waktu yang disiplin antara tugas kedinasan dan studi guna meningkatkan kapasitas kontribusi Anda bagi instansi.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mendaftar namun berniat melimpahkan sebagian tugas kantor rutin kepada rekan kerja lain selama masa studi.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mendorong rekan lain yang lebih muda saja yang mengambil beasiswa tersebut.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_15',
      topicId: 'top_prof_pengambilan_keputusan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Saat menyusun dokumen spesifikasi teknis pengadaan barang, salah satu anggota tim pengadaan mengusulkan untuk memasukkan spesifikasi merek tertentu yang sangat spesifik dan hanya dimiliki oleh satu distributor lokal. Alasan yang dikemukakan adalah kualitas barang tersebut sudah terbukti bagus. Bagaimana tanggapan Anda?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengambilan Keputusan & Kepatuhan PBJ (Prinsip Persaingan Sehat).**\n\n' +
        'Opsi **B (Poin 5)** menegakkan Perpres Pengadaan Barang/Jasa Pemerintah yang melarang penguncian spesifikasi pada merek tertentu (kecuali suku cadang/e-katalog khusus), demi mencegah persaingan usaha tidak sehat dan potensi temuan audit.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyetujui usulan tersebut asalkan distributor tersebut mau memberikan diskon potongan harga kepada dinas.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menolak penguncian merek spesifik, serta menyusun spesifikasi teknis berbasis fungsi, kinerja, dan standar mutu nasional (SNI) agar membuka persaingan terbuka yang sehat sesuai regulasi.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyetujui usulan tersebut karena yang terpenting adalah mutu barang tidak mengecewakan di kemudian hari.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membiarkan anggota tim tersebut memutuskan sendiri dan tidak ikut bertanggung jawab jika ada masalah hukum.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengonsultasikan hal ini ke rekanan distributor lain untuk meminta masukan merek alternatif.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_16',
      topicId: 'top_prof_integritas',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda secara tidak sengaja menemukan bukti bahwa atasan langsung Anda menandatangani Surat Perintah Tugas (SPT) fiktif untuk mencairkan uang harian perjalanan dinas luar kota yang sebenarnya tidak pernah dilaksanakan. Sikap Anda yang paling berintegritas adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas (Mekanisme Whistleblowing System).**\n\n' +
        'Opsi **C (Poin 5)** menunjukkan penanganan pelanggaran hukum secara profesional melalui kanal resmi pengawasan internal (Inspektorat / WBS) dengan bukti objektif tanpa menyebarkan fitnah atau kegaduhan liar.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Memeras atasan Anda agar bersedia menaikkan nilai Sasaran Kinerja Pegawai (SKP) Anda.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyebarkan dokumen tersebut ke media sosial atau grup chat warga agar mendapat sanksi sosial.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Melaporkan temuan tersebut dengan bukti pendukung yang valid melalui saluran resmi Whistleblowing System (WBS) atau Aparat Pengawasan Intern Pemerintah (APIP/Inspektorat).',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Pura-pura tidak tahu dan membakar dokumen tersebut agar Anda tidak menjadi korban intimidasi kantor.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membicarakan hal tersebut kepada seluruh staf kantor saat jam makan siang.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_man_17',
      topicId: 'top_prof_kerjasama_komunikasi',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda memiliki rekan kerja satu tim yang hasil pekerjaannya sering tidak memenuhi standar kualitas dan banyak kesalahan pengetikan angka, sehingga merepotkan anggota tim lain yang harus mengoreksi ulang. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Kerjasama & Pengembangan Rekan (Feedback Konstruktif).**\n\n' +
        'Opsi **D (Poin 5)** mengedepankan budaya kerja saling menguatkan: memberikan umpan balik spesifik, menunjukkan letak ketidaktelitian, dan berbagi metode pengecekan mandiri.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mengucilkan rekan tersebut dan menolak satu kelompok dengannya pada penugasan berikutnya.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Membiarkan saja kesalahannya hingga dokumen tersebut ditolak oleh pimpinan agar rekan Anda kapok.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengerjakan ulang seluruh tugasnya tanpa memberi tahu di mana letak kesalahannya.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memberikan masukan konstruktif secara empat mata, menunjukkan contoh standar yang diharapkan, dan membantunya dengan metode checklist verifikasi ganda.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membuat sindiran di grup kantor tentang pentingnya ketelitian dalam bekerja.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_man_18',
      topicId: 'top_prof_orientasi_hasil_pelayanan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Di kantor tempat Anda bertugas, sering terjadi keluhan masyarakat mengenai ketidakpastian biaya dan lama waktu penyelesaian surat keterangan. Belum ada papan informasi atau banner SOP resmi yang terpasang. Sebagai staf di unit tersebut, inisiatif Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pelayanan Publik & Orientasi Hasil (Transparansi Layanan).**\n\n' +
        'Opsi **B (Poin 5)** memperlihatkan inisiatif nyata perbaikan sistem pelayanan: menyusun draf standar pelayanan (maklumat, alur waktu, biaya nol rupiah) dan menyarankan visualisasi publik.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menunggu hingga ada perintah tertulis dari Kepala Dinas untuk membuat papan pengumuman.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyusun usulan draf standar pelayanan (SOP, estimasi waktu, persyaratan, dan penegasan biaya gratis) serta mengajukan kepada pimpinan untuk dipajang di ruang tunggu dan media sosial dinas.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Hanya menjawab jika ada masyarakat yang bertanya secara langsung ke meja kerja Anda.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyarankan masyarakat mengajukan keluhan ke Ombudsman agar kantor Anda ditegur secara resmi.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menempelkan kertas tulisan tangan seadanya di dinding kantor tanpa persetujuan pimpinan.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_19',
      topicId: 'top_prof_pengembangan_perubahan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pimpinan memberikan tugas baru yang sama sekali di luar latar belakang pendidikan dan bidang keahlian Anda, dengan tenggat waktu penyelesaian dua minggu. Bagaimana sikap Anda menghadapi penugasan ini?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Mengelola Perubahan & Adaptabilitas.**\n\n' +
        'Opsi **A (Poin 5)** menunjukkan pola pikir bertumbuh (*growth mindset*): memandang tugas baru sebagai peluang ekspansi kapasitas, segera memetakan materi yang harus dipelajari, dan proaktif berkonsultasi dengan ahlinya.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menerima tugas dengan positif sebagai wadah memperluas kompetensi, segera mempelajari regulasi dan referensi terkait, serta proaktif berkonsultasi dengan rekan yang berpengalaman.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menolak penugasan tersebut dengan alasan tidak sesuai dengan kualifikasi ijazah dan tupoksi Anda.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menerima tugas namun mengerjakannya dengan kualitas alakadarnya agar pimpinan tahu kemampuan Anda terbatas.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menerima tugas namun menyewa jasa konsultan luar untuk menyelesaikannya menggunakan uang pribadi.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengeluh kepada rekan kerja lain tentang ketidakadilan pimpinan dalam membagi penugasan.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_man_20',
      topicId: 'top_prof_pengambilan_keputusan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda menerima laporan bahwa sebuah jembatan penghubung desa mengalami retak rambut pada balok penyangga akibat curah hujan tinggi. Walaupun jembatan masih bisa dilewati kendaraan kecil, terdapat risiko runtuh jika dilewati truk bermuatan berat. Menjelang musim panen, petani desa mendesak agar truk pengangkut gabah tetap diizinkan lewat. Keputusan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengambilan Keputusan (Manajemen Risiko & Perlindungan Publik).**\n\n' +
        'Opsi **D (Poin 5)** mencerminkan keputusan berbasis mitigasi risiko yang tegas melindungi nyawa manusia tanpa mengabaikan aspek ekonomi: memasang portal pembatas beban muatan kendaraan, berkoordinasi dengan dinas PU untuk inspeksi darurat, dan menyiapkan rekayasa jalur alternatif.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membiarkan truk lewat asalkan sopir menandatangani surat pernyataan siap menanggung risiko sendiri.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menutup total jembatan untuk semua jenis kendaraan tanpa menyediakan solusi rute alternatif bagi warga.',
          scoreValue: 3,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menunggu sampai jembatan benar-benar patah atau ambruk baru mengambil tindakan pengamanan.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memasang portal pembatas tonase kendaraan berat demi keselamatan jiwa, segera mengalihkan rute logistik ke jalur alternatif, dan mempercepat asesmen teknis struktur oleh dinas pekerjaan umum.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meminta warga desa melakukan musyawarah dan pemungutan suara apakah truk boleh lewat atau tidak.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_man_21',
      topicId: 'top_prof_integritas',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Seorang kerabat dekat Anda meminta bantuan agar anaknya diloloskan dalam seleksi administrasi penerimaan Pegawai Non-PNS di instansi tempat Anda menjadi salah satu panitia seleksi, padahal berkasnya kurang lengkap. Sikap Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas & Bebas dari Konflik Kepentingan.**\n\n' +
        'Opsi **B (Poin 5)** memisahkan urusan personal/kekeluargaan dari standar rekrutmen negara yang adil, transparan, dan meritokratis.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membantunya dengan melengkapi berkas yang kurang menggunakan data rekaan.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menolak permintaan tersebut dengan sopan dan memberi pengertian bahwa seleksi berjalan secara objektif dan meritokratis sesuai kelengkapan berkas resmi.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Meminta uang pelicin kepada kerabat Anda tersebut sebagai kompensasi risiko.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyerahkan berkas tersebut kepada panitia lain tanpa memberitahu kekurangannya.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menolak dan memutuskan hubungan kekeluargaan dengannya.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_man_22',
      topicId: 'top_prof_kerjasama_komunikasi',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Dalam penyusunan rencana aksi tahunan, dua bidang di instansi Anda saling klaim bahwa sebuah proyek prioritas merupakan kewenangan eksklusif bidang mereka, sehingga koordinasi antar bidang mandek. Sebagai analis yang diminta membantu pimpinan, apa masukan Anda?',
      explanationMarkdown:
        '**Dimensi Kompetensi: Kerjasama Antar Unit (Sinergi Matriks Organisasi).**\n\n' +
        'Opsi **C (Poin 5)** menyelesaikan silo mentalitas birokrasi dengan pembagian peran matriks yang jelas (*RACI matrix*) berdasarkan output substantif tiap bidang.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyerahkan proyek ke bidang yang dipimpin oleh pejabat yang lebih senior.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Membatalkan proyek tersebut agar tidak menimbulkan kecemburuan sosial di kantor.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Membuat matriks pembagian peran (*RACI matrix*) yang menegaskan batasan tanggung jawab dan kontribusi output masing-masing bidang secara kolaboratif.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Melakukan undian koin untuk menentukan pemegang proyek utama.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membiarkan mereka bersaing bebas siapa yang paling cepat menyusun proposal ke pimpinan.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_23',
      topicId: 'top_prof_orientasi_hasil_pelayanan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda menemukan bahwa laporan pertanggungjawaban kegiatan triwulan Anda masih memiliki kelebihan sisa anggaran operasional karena efisiensi harga tiket dan akomodasi. Bendahara menyarankan agar kuitansi dibulatkan sesuai pagu awal agar anggaran terserap 100%. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Integritas & Akuntabilitas Anggaran.**\n\n' +
        'Opsi **A (Poin 5)** memegang prinsip belanja negara berbasis bukti riil (*at cost*), mengembalikan sisa dana ke kas daerah/negara, dan tidak merekayasa dokumen pertanggungjawaban.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Melaporkan pengeluaran riil apa adanya sesuai kuitansi yang sah dan menyetorkan kembali sisa lebih anggaran ke kas negara/daerah.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengikuti saran bendahara untuk membulatkan kuitansi agar capaian serapan anggaran dinilai tinggi oleh pimpinan.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menggunakan sisa uang tersebut untuk membeli oleh-oleh bagi staf di kantor.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyimpan sisa uang tersebut di brankas pribadi untuk digunakan pada kegiatan dinas lain yang kurang anggaran.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menanyakan kepada staf lain apa yang biasanya mereka lakukan saat menghadapi situasi serupa.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_man_24',
      topicId: 'top_prof_pengembangan_perubahan',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Di era kecerdasan buatan (*Artificial Intelligence*), instansi Anda mulai menjajaki penggunaan AI untuk meringkas risalah rapat dan menyusun draf persuratan dinas. Sebagian rekan kerja Anda khawatir teknologi ini akan menghilangkan pekerjaan staf administrasi. Sikap Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Mengelola Perubahan & Literasi Masa Depan.**\n\n' +
        'Opsi **B (Poin 5)** menunjukkan sikap adaptif: memandang teknologi sebagai instrumen augmentasi efisiensi kerja, dan mendorong peningkatan keahlian staf dari tugas repetitif ke tugas analitis strategis.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menolak pengadopsian teknologi AI dan menyarankan pimpinan tetap mempertahankan cara manual 100%.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyambut positif adopsi AI sebagai sarana efisiensi tugas rutin, sembari mendorong staf meningkatkan keahlian analitis dan pengawasan substansi yang tidak dapat digantikan mesin.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyerahkan seluruh pekerjaan persuratan kepada AI tanpa melakukan validasi manusia lagi.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyebarkan kekhawatiran tersebut agar seluruh staf sepakat memboikot sistem baru.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Bersikap masa bodoh selama gaji dan tunjangan Anda tidak terpengaruh.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_man_25',
      topicId: 'top_prof_pengambilan_keputusan',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Dua staf berprestasi di tim Anda terlibat konflik perselisihan pribadi di luar kantor yang berimbas pada saling menjatuhkan saat presentasi kerja di hadapan klien eksternal. Sebagai pimpinan tim, langkah yang akan Anda lakukan adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Pengambilan Keputusan Manajerial & Resolusi Konflik Kerja.**\n\n' +
        'Opsi **E (Poin 5)** menegakkan profesionalisme kerja tanpa kompromi terhadap citra instansi di depan publik/klien, menyelesaikan perselisihan secara terstruktur, dan menetapkan konsekuensi disiplin yang tegas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Memecat kedua staf tersebut secara sepihak untuk memberi efek jera pada staf lain.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Membiarkan konflik tersebut reda dengan sendirinya karena urusan pribadi tidak boleh dicampuri kantor.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memihak kepada salah satu staf yang memiliki masa kerja lebih lama di kantor Anda.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memisahkan keduanya ke proyek berbeda tanpa menyelesaikan akar masalah di antara mereka.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Memanggil kedua staf secara terpisah lalu mempertemukan mereka, menegaskan batas tegas profesionalitas kerja, melarang konflik pribadi mengganggu kinerja instansi, serta memberikan pembinaan berjenjang.',
          scoreValue: 5,
          isCorrect: true,
        },
      ],
    },

    // ==========================================
    // PAKET 2: SOSIO KULTURAL & BERAKHLAK - 20 SOAL (26-45)
    // ==========================================
    {
      id: 'q_prof_soc_01',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda dimutasi ke daerah terpencil yang mayoritas warganya memegang teguh adat istiadat dan tradisi lokal yang belum pernah Anda jumpai sebelumnya. Beberapa kebiasaan masyarakat tampak asing bagi Anda. Sikap Anda sebagai ASN yang baru bertugas adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa (Adaptasi Budaya & Penghormatan Nilai Lokal).**\n\n' +
        'Opsi **D (Poin 5)** mencerminkan keterbukaan pikiran, penghormatan terhadap kearifan lokal (*local wisdom*), dan kemampuan membangun jembatan silaturahmi dengan tokoh masyarakat setempat.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menghindari kontak dengan warga setempat dan hanya bergaul dengan sesama rekan dinas pendatang.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menilai dan mengkritik kebiasaan masyarakat tersebut karena dianggap tidak modern.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Segera mengajukan surat permohonan pindah kembali ke kota asal karena tidak betah.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menghormati dan mempelajari adat istiadat setempat, menjalin silaturahmi dengan para tokoh masyarakat, serta menyesuaikan diri secara santun tanpa kehilangan prinsip integritas tugas.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengikuti semua tradisi secara membabi buta meskipun bertentangan dengan hukum positif negara.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_02',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'HARD',
      contentMarkdown:
        'Di sebuah daerah pascakonflik horizontal, kantor pelayanan Anda melayani dua kelompok masyarakat yang masih menyimpan kecurigaan satu sama lain. Seorang warga dari salah satu kelompok menolak dilayani oleh rekan kerja Anda yang berasal dari kelompok yang berbeda identitas etnisnya. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa (Netralitas Pelayanan & Mencegah Polarisasi).**\n\n' +
        'Opsi **C (Poin 5)** mencerminkan keteguhan menjaga asas non-diskriminasi dan netralitas ASN: meyakinkan warga secara santun bahwa pelayanan negara berlaku adil dan setara bagi semua orang tanpa membedakan latar belakang etnis.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Memarahi warga tersebut dan mengusirnya keluar dari gedung kantor pelayanan.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menuruti kemauan warga tersebut dan meminta rekan Anda menyingkir agar tidak memicu keributan.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menjelaskan dengan ramah dan tegas bahwa seluruh petugas di kantor adalah abdi negara yang melayani secara adil, profesional, dan setara tanpa memandang latar belakang suku atau golongan.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membiarkan warga tersebut mengantre sampai sore hingga terpaksa mau dilayani.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menutup loket pelayanan pada hari itu demi keselamatan seluruh staf dinas.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_03',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Berorientasi Pelayanan.**\n' +
        'Seorang warga mengeluhkan alur pelayanan surat izin yang dinilai sangat berbelit-belit dan lambat di bagian Anda. Warga tersebut meluapkan kekesalannya di loket pelayanan. Respon terbaik Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Berorientasi Pelayanan (Ramah, Cekatan, Solutif, dan Dapat Diandalkan).**\n\n' +
        'Opsi **B (Poin 5)** menunjukkan empati mendengarkan keluhan (*active listening*), tidak bersikap defensif, membantu menyelesaikan kebutuhan warga saat itu juga, dan mencatatnya sebagai evaluasi SOP layanan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menjelaskan bahwa birokrasi memang harus rumit demi menjaga kehati-hatian dokumen hukum.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mendengarkan keluhan dengan penuh perhatian dan empati, memohon maaf atas ketidaknyamanan, segera membantu menyelesaikan urusannya, dan mencatat masukan tersebut untuk perbaikan alur layanan.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyuruh warga tersebut membaca peraturan bupati/walikota yang tertempel di dinding jika tidak paham.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mengabaikan kekesalannya dan memproses dokumen dengan kecepatan seperti biasa.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyerahkan penanganan warga kepada satpam agar kantor tetap kondusif.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_04',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Akuntabel.**\n' +
        'Anda diberikan fasilitas laptop dinas dan akses kuota internet untuk menunjang tugas operasional harian. Di luar jam kerja, anggota keluarga Anda ingin meminjam laptop tersebut untuk menonton serial film dan bermain game online. Sikap Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Akuntabel (Menggunakan Kekayaan dan BMN Secara Bertanggung Jawab, Efektif, dan Efisien).**\n\n' +
        'Opsi **D (Poin 5)** menegakkan batas kepemilikan Barang Milik Negara (BMN) yang tidak boleh disalahgunakan untuk kepentingan hiburan privat keluarga, serta melindungi kerahasiaan data kedinasan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Meminjamkannya dengan bebas selama pekerjaan dinas Anda pada hari itu sudah selesai.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Meminjamkannya asalkan kuota internet kantor tidak dihabiskan.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menjual laptop tersebut dan menggantinya dengan laptop pribadi bekas.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menolak secara santun dan menjelaskan bahwa laptop dinas adalah Barang Milik Negara yang hanya diperuntukkan bagi tugas dinas serta menjaga keamanan data pemerintahan.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membuatkan akun tamu (*guest*) agar keluarga tetap bisa menonton tanpa melihat data kantor.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_soc_05',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Kompeten.**\n' +
        'Instansi Anda mengumumkan adanya sertifikasi keahlian Pengadaan Barang/Jasa (PBJ) atau Analis Kebijakan yang terbuka bagi seluruh pegawai. Sebagian rekan kerja Anda enggan mendaftar karena khawatir beban kerja bertambah jika lulus. Sikap Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Kompeten (Meningkatkan Kompetensi Diri untuk Menjawab Tantangan yang Selalu Berubah).**\n\n' +
        'Opsi **A (Poin 5)** menunjukkan komitmen terus belajar mengasah kapasitas fungsional (*upskilling*) demi menunjang kinerja instansi secara optimal.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mendaftar dan mempersiapkan diri dengan sungguh-sungguh untuk meraih sertifikasi tersebut demi meningkatkan keahlian profesional dan nilai tambah kontribusi Anda.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Ikut bersikap pasif seperti rekan kerja lain agar tidak terbebani tanggung jawab baru.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mendaftar hanya jika instansi menjanjikan insentif uang saku harian yang besar selama ujian.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mendaftar dan meminta bocoran kunci jawaban ujian kepada panitia sebelumnya.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menunggu sampai pimpinan mewajibkan secara paksa baru Anda bersedia ikut.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_soc_06',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Harmonis.**\n' +
        'Di kantor tempat Anda bekerja, terdapat perbedaan keyakinan agama dan perayaan hari besar keagamaan di antara para pegawai. Menjelang hari raya salah satu agama minoritas di kantor, banyak pegawai yang beragama tersebut memerlukan izin cuti untuk beribadah bersama keluarga. Sikap Anda sebagai rekan kerja adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Harmonis (Menghargai Setiap Orang Apapun Latar Belakangnya, Suka Menolong Orang Lain).**\n\n' +
        'Opsi **C (Poin 5)** mencerminkan toleransi aktif dan solidaritas kerja: bersedia membackup tugas rekan yang merayakan hari besar keagamaan demi menjaga iklim kerja harmonis dan pelayanan tetap berjalan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menolak jika diminta menggantikan giliran piket tugas pelayanan selama rekan Anda cuti hari raya.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menuntut agar cuti hari raya bagi agama minoritas dipersingkat menjadi satu hari saja.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengucapkan selamat dengan tulus dan bersedia saling bertukar jadwal piket tugas untuk memastikan pelayanan publik tetap berjalan lancar saat rekan merayakan hari rayanya.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mengabaikan perayaan tersebut dan bersikap acuh tak acuh di kantor.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengkritik aturan cuti keagamaan di grup WhatsApp kantor.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_soc_07',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Loyal.**\n' +
        'Pemerintah mengeluarkan kebijakan baru yang cukup kontroversial di mata publik, namun sah secara hukum dan regulasi nasional. Di sebuah grup media sosial publik, seorang teman mengajak Anda ikut menandatangani petisi menolak kebijakan tersebut dan menulis komentar yang menjelek-jelekkan instansi pemerintah. Sebagai ASN, respon Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Loyal (Memegang Teguh Ideologi Pancasila, UUD 1945, Setia pada NKRI dan Pemerintah yang Sah, Menjaga Nama Baik ASN).**\n\n' +
        'Opsi **E (Poin 5)** menegakkan sumpah janji ASN: tidak ikut menyebarkan konten provokatif/menjelekkan pemerintah di ruang publik, serta menjelaskan rasionalitas kebijakan secara berimbang jika berkomunikasi.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Ikut menandatangani petisi menggunakan nama samaran dan akun anonim.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menulis komentar pedas yang mengkritik atasan dan presiden di akun media sosial pribadi Anda.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menyetujui ajakan tersebut karena setiap warga negara bebas berpendapat tanpa batasan kode etik.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membagikan tautan petisi tersebut ke grup WhatsApp kedinasan kantor Anda.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menolak ajakan tersebut dengan bijak, mematuhi kode etik netralitas dan loyalitas ASN terhadap pemerintah yang sah, serta tidak ikut membuat pernyataan yang mendiskreditkan nama baik instansi.',
          scoreValue: 5,
          isCorrect: true,
        },
      ],
    },
    {
      id: 'q_prof_soc_08',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Adaptif.**\n' +
        'Dinas Anda mengalami pemotongan anggaran operasional perjalanan dinas tatap muka sebesar 60% dalam rangka efisiensi fiskal nasional. Banyak agenda koordinasi luar daerah yang terancam batal. Tindakan adaptif yang Anda rekomendasikan adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Adaptif (Cepat Menyesuaikan Diri Menghadapi Perubahan, Terus Berinovasi).**\n\n' +
        'Opsi **B (Poin 5)** mengoptimalkan instrumen digital/daring (virtual meeting, collaborative workspace) untuk menjaga kontinuitas capaian kinerja tanpa terhambat keterbatasan anggaran fisik.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membatalkan seluruh agenda koordinasi dan tidak melakukan komunikasi apa pun dengan instansi mitra.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengalihkan seluruh koordinasi tatap muka ke platform konferensi video digital dan dokumen kolaboratif daring, sehingga esensi target koordinasi tetap tercapai dengan biaya minim.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Memaksa pimpinan untuk mengajukan pinjaman dana ke pihak swasta demi tetap bisa bepergian.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menuntut rekan kerja patungan menggunakan uang pribadi untuk membiayai tiket perjalanan dinas.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menunggu hingga tahun anggaran depan saat dana perjalanan dinas kembali normal.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_09',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Kolaboratif.**\n' +
        'Dalam rangka percepatan penurunan angka stunting di wilayah kerja Anda, diperlukan sinergi antara Dinas Kesehatan, Dinas Pemberdayaan Masyarakat Desa (DPMD), dan Kantor Kementerian Agama (KUA). Masing-masing instansi memiliki ego sektoral dan program sendiri-sendiri. Usulan langkah kolaboratif yang Anda gagas adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Kolaboratif (Memberi Kesempatan Berbagai Pihak Berkontribusi, Terbuka Bekerjasama Menghasilkan Nilai Tambah).**\n\n' +
        'Opsi **D (Poin 5)** mengatasi ego sektoral dengan pembentukan gugus tugas terpadu (*integrated task force*) berbasis pembagian data sasaran bersama dan intervensi konvergen.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membiarkan masing-masing dinas jalan sendiri-sendiri agar tidak terjadi benturan kewenangan.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menuntut dinas lain menyerahkan seluruh anggarannya kepada dinas Anda sebagai penanggung jawab tunggal.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengkritik ketidakmampuan dinas lain di hadapan kepala daerah saat rapat paripurna.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mendorong pembentukan forum koordinasi terpadu berbasis data sasaran terintegrasi (*single data*), di mana setiap instansi menyumbang peran sesuai mandatnya secara konvergen.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menunggu instruksi tertulis dari kementerian pusat baru memulai pembicaraan koordinasi.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_soc_10',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Di sebuah grup pesan instan (WhatsApp) lingkungan kantor, seorang pegawai membagikan pesan berantai bernada provokatif yang menyinggung stereotip negatif terhadap suku tertentu yang sedang menjadi sorotan berita kriminal nasional. Sikap Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa (Menjaga Persatuan & Menghentikan Polarisasi SARA).**\n\n' +
        'Opsi **A (Poin 5)** menunjukkan tanggung jawab menjaga keharmonisan internal ASN: mengingatkan dengan santun bahwa ASN dilarang menyebarkan ujaran kebencian berbasis SARA dan meminta penghapusan pesan demi kondusivitas tim.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mengingatkan pengirim pesan dengan santun bahwa grup kantor adalah wadah kedinasan yang mengedepankan persatuan, dan mengajak rekan-rekan untuk tidak menyebarkan isu bernuansa SARA.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Ikut menimpali dengan lelucon suku tersebut agar suasana di grup menjadi ramai.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Meneruskan (*forward*) pesan tersebut ke grup warga di kompleks perumahan Anda.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Hanya membaca dalam diam tanpa merespon apa pun.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Langsung keluar dari grup kantor tanpa memberikan penjelasan kepada pimpinan.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_11',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Dalam proses musyawarah perencanaan pembangunan desa (Musrenbang), sekelompok warga minoritas dan penyandang disabilitas tampak duduk terpisah di pojok belakang dan tidak diberikan kesempatan berbicara oleh panitia lokal. Anda hadir sebagai fasilitator kecamatan. Langkah Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa & Inklusivitas Sosial.**\n\n' +
        'Opsi **C (Poin 5)** menegakkan prinsip pembangunan inklusif (*no one left behind*): secara proaktif mengundang kelompok rentan ke forum utama dan memfasilitasi aspirasi mereka masuk ke dalam notula prioritas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membiarkan kondisi tersebut karena fasilitator harus menghormati kebiasaan panitia desa setempat.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyuruh mereka berbicara langsung setelah acara resmi ditutup dan sebagian besar peserta pulang.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengajak mereka duduk setara di area forum utama dan secara khusus memberikan ruang aman bagi perwakilan kelompok rentan/disabilitas untuk menyampaikan aspirasi kebutuhan mereka.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menghentikan acara Musrenbang dan membatalkan seluruh usulan proyek desa tersebut.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mencatat sendiri asumsi kebutuhan mereka tanpa perlu mendengar suara langsung dari mereka.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_soc_12',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Berorientasi Pelayanan.**\n' +
        'Seorang pemohon izin penyandang disabilitas rungu (tuli) datang ke loket Anda dan tampak kesulitan mengutarakan tujuannya karena petugas loket sebelumnya tidak memahami bahasa isyarat. Anda melihat warga tersebut mulai panik. Apa yang Anda lakukan?',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Berorientasi Pelayanan (Pelayanan Inklusif dan Ramah HAM).**\n\n' +
        'Opsi **D (Poin 5)** menunjukkan inisiatif pelayanan adaptif dan empatik: menggunakan media tulis/aplikasi teks untuk berkomunikasi secara sabar dan tuntas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Memintanya membawa penerjemah pribadi dan kembali lagi besok hari.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Berbicara dengan suara sangat keras dan berteriak di depan pemohon tersebut.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Meminta warga lain di antrean untuk membantu menerjemahkan secara sukarela.',
          scoreValue: 3,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menghampiri pemohon dengan senyum ramah, menyediakannya kertas dan pulpen atau media ketik gawai untuk berkomunikasi secara tertulis, dan melayaninya dengan sabar hingga tuntas.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengalihkan berkas pemohon ke meja paling ujung agar tidak menghambat antrean reguler.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_13',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Akuntabel.**\n' +
        'Saat menyusun dokumen laporan pertanggungjawaban fisik, Anda menemukan kesalahan perhitungan volume beton yang menyebabkan kelebihan klaim pembayaran oleh dinas sebesar Rp15 juta. Jika dilaporkan, proses pencairan dana kegiatan satu tim akan tertunda 3 hari untuk perbaikan berkas. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Akuntabel (Jujur, Bertanggung Jawab, dan Berintegritas Tinggi terhadap Keuangan Negara).**\n\n' +
        'Opsi **B (Poin 5)** memprioritaskan kebenaran hukum dan integritas pembukuan negara di atas kenyamanan sesaat penundaan waktu.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Mendiamkan kesalahan tersebut karena selisihnya relatif kecil dibandingkan total nilai proyek miliaran rupiah.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Segera mengoreksi kesalahan perhitungan volume tersebut sesuai kondisi riil dan melaporkannya kepada pimpinan/PPK, meskipun jadwal pencairan tertunda demi menjaga integritas keuangan negara.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menggunakan uang kelebihan Rp15 juta tersebut untuk biaya makan bersama tim kegiatan.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membebankan kesalahan tersebut kepada konsultan pengawas dan menuntut mereka ganti rugi diam-diam.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menunggu sampai ada pemeriksaan oleh BPK, jika tidak ditemukan maka dianggap rezeki kantor.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_soc_14',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Kompeten.**\n' +
        'Anda memiliki keahlian dalam analisis data spasial (GIS) yang jarang dikuasai oleh pegawai lain di dinas Anda. Seorang rekan kerja junior meminta Anda mengajarinya dasar-dasar pemetaan agar bisa membantu pekerjaan dinas. Sikap Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Kompeten (Membantu Orang Lain Belajar & Berbagi Pengetahuan).**\n\n' +
        'Opsi **A (Poin 5)** menerapkan prinsip berbagi pengetahuan (*knowledge sharing*) untuk memperkuat kapasitas kolektif institusi.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menyambut baik keinginannya, meluangkan waktu untuk mentransfer pengetahuan dan membimbingnya secara terstruktur agar kapasitas tim semakin kuat.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menolak mengajarinya karena khawatir posisi Anda sebagai satu-satunya ahli GIS di dinas akan tergeser.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Meminta rekan tersebut membayar biaya kursus privat kepada Anda di luar jam kerja.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Memberikan modul panduan berbahasa asing yang rumit tanpa mau memberikan penjelasan lisan.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyuruhnya belajar sendiri secara otodidak lewat video YouTube.',
          scoreValue: 3,
        },
      ],
    },
    {
      id: 'q_prof_soc_15',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Harmonis.**\n' +
        'Di lingkungan kerja Anda, beredar rumor dan gosip negatif mengenai kehidupan pribadi salah seorang pegawai yang baru saja mengalami musibah perceraian. Beberapa rekan mulai memperlakukan pegawai tersebut dengan tatapan sinis. Tindakan Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Harmonis (Menciptakan Suasana Kerja Kondusif & Peduli).**\n\n' +
        'Opsi **D (Poin 5)** menunjukkan empati dan keberanian moral menghentikan *toxic workplace gossip*, serta memberikan dukungan psikologis yang suportif.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Ikut mendengarkan rumor tersebut untuk mencari tahu kebenaran ceritanya.',
          scoreValue: 2,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menceritakan gosip tersebut kepada pimpinan agar pegawai tersebut dipindahkan.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menjauhi pegawai tersebut agar reputasi Anda tidak ikut tercoreng di mata rekan lain.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Tidak ikut menyebarkan rumor, mengingatkan rekan lain untuk menghormati privasi sesama, serta memberikan dukungan moral kepada rekan yang sedang menghadapi masa sulit tersebut.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membuat status di media sosial menyindir orang-orang yang suka bergosip.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_16',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Loyal.**\n' +
        'Pada hari libur akhir pekan, terjadi bencana alam banjir bandang di wilayah kerja instansi Anda. Pimpinan mengirimkan pesan panggilan darurat (*call to duty*) bagi seluruh staf untuk membantu penanganan posko logistik pengungsi. Saat itu Anda sudah memiliki rencana rekreasi bersama teman. Sikap Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Loyal (Mengutamakan Kepentingan Bangsa dan Negara di Atas Kepentingan Pribadi).**\n\n' +
        'Opsi **A (Poin 5)** membuktikan komitmen dedikasi abdi negara: sigap merespon panggilan tugas darurat kemanusiaan demi keselamatan masyarakat.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Membatalkan rencana rekreasi pribadi dan segera merapat ke posko darurat bencana untuk membantu penanganan warga terdampak sesuai arahan kedinasan.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mematikan ponsel pintar Anda dan berpura-pura tidak membaca pesan pimpinan hingga hari Senin.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Membuat alasan sakit agar Anda tetap dapat pergi berekreasi bersama teman.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Hanya menyumbangkan sejumlah uang secara transfer dan menolak datang langsung ke posko.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menanyakan terlebih dahulu apakah ada uang lembur ekstra untuk tugas posko akhir pekan tersebut.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_17',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Adaptif.**\n' +
        'Regulasi pengelolaan keuangan dan pelaporan perpajakan instansi pemerintah mengalami perubahan mendasar dengan berlakunya peraturan menteri yang baru. Dokumen panduan yang ada sangat tebal dan rumit. Sikap Anda dalam menghadapi pembaruan aturan ini adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Adaptif (Proaktif Mengantisipasi Perubahan Regulasi).**\n\n' +
        'Opsi **C (Poin 5)** menunjukkan inisiatif adaptasi aktif: mempelajari poin-poin perubahan krusial dan mendiseminasikannya ke unit kerja agar proses administrasi terhindar dari salah saji.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Tetap menggunakan format lama sampai ada teguran resmi dari auditor BPK.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Mengeluh dan menyalahkan kementerian karena terlalu sering mengganti peraturan.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mempelajari secara proaktif pasal-pasal kunci dalam regulasi baru, mengikuti bimbingan teknis, dan mengadaptasikan format laporan kantor agar patuh pada aturan terkini.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menunggu instansi dinas tetangga menerapkan aturan baru tersebut lebih dulu baru Anda menirunya.',
          scoreValue: 3,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyerahkan urusan tersebut kepada bagian hukum tanpa mau mempelajari substansinya.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_18',
      topicId: 'top_prof_berakhlak',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        '**Core Value: Kolaboratif.**\n' +
        'Dinas Anda berencana menyelenggarakan pameran UMKM daerah, namun anggaran dinas sangat minim. Sebuah komunitas wirausaha muda dan perhimpunan perbankan menawarkan kolaborasi untuk mendanai sebagian tempat dan mendatangkan pembeli potensial, asalkan mereka dilibatkan dalam kepanitiaan. Respon Anda adalah...',
      explanationMarkdown:
        '**Core Values BerAKHLAK: Kolaboratif (Pentahelix Collaboration / Pemanfaatan Sumber Daya Bersama).**\n\n' +
        'Opsi **B (Poin 5)** menerapkan kolaborasi multipihak (*public-private partnership*) secara akuntabel dan transparan demi kemanfaatan publik yang lebih luas.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menolak tawaran tersebut karena acara pemerintah tidak boleh melibatkan pihak swasta atau komunitas.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menyambut baik inisiatif kolaborasi tersebut dengan menyusun perjanjian kerjasama resmi (PKS) yang jelas, transparan, dan saling melengkapi demi kesuksesan pemberdayaan UMKM.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Menerima uang bantuan mereka namun tidak mengizinkan mereka ikut dalam rapat kepanitiaan.',
          scoreValue: 2,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menyerahkan seluruh acara kepada pihak swasta dan dinas hanya hadir saat seremoni pembukaan.',
          scoreValue: 2,
        },
        {
          label: 'E',
          contentMarkdown:
            'Membatalkan pameran UMKM daripada harus repot berkoordinasi dengan pihak luar.',
          scoreValue: 1,
        },
      ],
    },
    {
      id: 'q_prof_soc_19',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Saat penugasan sensus atau pendataan sosial, Anda mendapati sebuah perkampungan adat yang menolak pengisian data kependudukan digital karena kepercayaan mereka menolak alat elektronik modern. Tindakan bijak yang Anda lakukan adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa (Pendekatan Sosio-Kultural & Musyawarah Adat).**\n\n' +
        'Opsi **A (Poin 5)** mencerminkan kearifan birokrasi dalam merajut keberagaman: melakukan pendekatan kultural melalui pemangku adat, mencari kesepakatan metode pendataan yang dihormati bersama tanpa paksaan represif.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Menghormati keyakinan mereka, meminta petunjuk tetua adat melalui dialog santun, dan mencari solusi pendataan alternatif yang disepakati bersama tanpa melanggar norma kepercayaan mereka.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Membawa aparat keamanan bersenjata untuk memaksa warga adat mengisi data aplikasi gawai.',
          scoreValue: 1,
        },
        {
          label: 'C',
          contentMarkdown:
            'Mengisi data mereka secara fiktif dari rumah tanpa berkunjung ke desa tersebut.',
          scoreValue: 1,
        },
        {
          label: 'D',
          contentMarkdown:
            'Mencoret seluruh warga desa tersebut dari daftar warga negara penerima hak publik.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Meninggalkan desa tersebut begitu saja dan melaporkan bahwa warga bersikap anarkis.',
          scoreValue: 2,
        },
      ],
    },
    {
      id: 'q_prof_soc_20',
      topicId: 'top_prof_perekat_bangsa',
      type: 'GRADED_SCALE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Dalam rangka memperingati Hari Kemerdekaan RI di lingkungan kantor, panitia menyelenggarakan karnaval baju adat nusantara. Beberapa staf enggan berpartisipasi karena merasa mengenakan pakaian adat dari suku lain tidak sesuai dengan identitas asal mereka. Sikap Anda adalah...',
      explanationMarkdown:
        '**Dimensi Kompetensi: Perekat Bangsa (Semangat Bhinneka Tunggal Ika).**\n\n' +
        'Opsi **C (Poin 5)** menjadi teladan persatuan nasional: mengenakan baju adat dengan bangga sebagai simbol kekayaan nusantara dan menginspirasi rekan lain untuk merayakan keberagaman tanpa sekat primordialisme.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Ikut memboikot acara tersebut dan memilih mengenakan pakaian dinas harian biasa.',
          scoreValue: 1,
        },
        {
          label: 'B',
          contentMarkdown:
            'Menuntut agar setiap orang hanya boleh mengenakan baju adat sukunya sendiri.',
          scoreValue: 2,
        },
        {
          label: 'C',
          contentMarkdown:
            'Berpartisipasi aktif dengan antusias, memberi contoh bahwa mengapresiasi budaya suku lain adalah wujud nyata Bhinneka Tunggal Ika dan perekat integrasi bangsa.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Menghadiri acara namun tidak mau berfoto bersama rekan kerja yang memakai baju adat daerah lain.',
          scoreValue: 1,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyindir rekan-rekan yang tidak memakai baju adat di media sosial.',
          scoreValue: 2,
        },
      ],
    },

    // ==========================================
    // PAKET 3: UJI POTENSI KOGNITIF & ANALITIS - 20 SOAL (46-65)
    // ==========================================
    {
      id: 'q_prof_cog_01',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        ':::passage[Wacana Kebijakan Publik: Digitalisasi Pajak Daerah]\n' +
        'Pemerintah Kota X mencatat bahwa penerimaan Pajak Bumi dan Bangunan (PBB) meningkat sebesar 25% setelah diluncurkannya sistem pembayaran kanal digital QRIS dan Virtual Account. Namun, di Kecamatan Z yang merupakan wilayah pesisir dengan keterbatasan jaringan internet, realisasi pembayaran PBB justru stagnan di angka 45% dari target. Analis pendapatan daerah menyatakan bahwa warga pesisir masih mengandalkan loket keliling mingguan yang saat ini frekuensinya dikurangi karena pengalihan armada ke wilayah perkotaan.\n' +
        ':::\n\n' +
        'Berdasarkan wacana di atas, kesimpulan yang paling tepat dan berbasis bukti adalah...',
      explanationMarkdown:
        '**Analisis Logis & Penarikan Kesimpulan:**\n' +
        'Wacana secara eksplisit menghubungkan stagnasi penerimaan di Kecamatan Z dengan dua faktor: keterbatasan jaringan internet dan pengurangan frekuensi loket keliling. Oleh karena itu, digitalisasi tidak serta merta berhasil jika infrastruktur penunjangnya belum merata, sehingga metode layanan luring (loket keliling) masih mutlak diperlukan.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Warga Kecamatan Z enggan membayar PBB karena tingginya tarif pajak daerah.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown:
            'Kanal pembayaran digital sepenuhnya menggantikan seluruh kebutuhan pelayanan tatap muka di semua wilayah Kota X.',
          scoreValue: 0,
        },
        {
          label: 'C',
          contentMarkdown:
            'Efektivitas digitalisasi perpajakan daerah dipengaruhi oleh kesiapan infrastruktur internet, sehingga kehadiran layanan loket keliling masih esensial bagi wilayah dengan disparitas konektivitas.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown:
            'Penurunan penerimaan di Kecamatan Z disebabkan oleh kelalaian petugas kelurahan setempat.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown:
            'Pemerintah Kota X sebaiknya menghapuskan kewajiban PBB bagi seluruh warga di wilayah pesisir.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_cog_02',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Semua pegawai berprestasi berhak menerima tunjangan kinerja penuh.\n' +
        'Sebagian pegawai di Bagian Umum tidak menerima tunjangan kinerja penuh.\n\n' +
        'Kesimpulan logis (*silogisme*) yang benar adalah...',
      explanationMarkdown:
        '**Silogisme Kategorik:**\n' +
        'Premis 1: Pegawai berprestasi -> Tukin penuh (A -> B).\n' +
        'Premis 2: Sebagian pegawai Bagian Umum tidak menerima tukin penuh (Sebagian C bukan B).\n' +
        'Kesimpulan: Sebagian pegawai di Bagian Umum bukan pegawai berprestasi (Sebagian C bukan A).',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Semua pegawai di Bagian Umum bukan pegawai berprestasi.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Sebagian pegawai di Bagian Umum bukan pegawai berprestasi.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Semua pegawai di Bagian Umum menerima tunjangan kinerja penuh.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Pegawai yang menerima tukin penuh pasti bukan dari Bagian Umum.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Tidak ada korelasi antara prestasi kerja dan tunjangan kinerja di Bagian Umum.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_cog_03',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Tentukan angka berikutnya dalam deret data capaian berikut:\n\n' +
        '**4, 7, 12, 19, 28, 39, ...**',
      explanationMarkdown:
        '**Pola Selisih Deret (Tingkat Dua):**\n' +
        '* 7 - 4 = 3\n' +
        '* 12 - 7 = 5\n' +
        '* 19 - 12 = 7\n' +
        '* 28 - 19 = 9\n' +
        '* 39 - 28 = 11\n\n' +
        'Pola selisih bertambah 2 (bilangan ganjil berurutan: +3, +5, +7, +9, +11). Maka selisih berikutnya adalah +13.\n' +
        '39 + 13 = **52**.',
      options: [
        { label: 'A', contentMarkdown: '49', scoreValue: 0 },
        { label: 'B', contentMarkdown: '51', scoreValue: 0 },
        { label: 'C', contentMarkdown: '52', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: '54', scoreValue: 0 },
        { label: 'E', contentMarkdown: '56', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_04',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Tentukan dua angka kelanjutan dari pola seri angka anggaran berikut:\n\n' +
        '**3, 6, 8, 16, 18, 36, 38, ... , ...**',
      explanationMarkdown:
        '**Pola Operasi Bergantian (kali 2 dan tambah 2):**\n' +
        '* 3 × 2 = 6\n' +
        '* 6 + 2 = 8\n' +
        '* 8 × 2 = 16\n' +
        '* 16 + 2 = 18\n' +
        '* 18 × 2 = 36\n' +
        '* 36 + 2 = 38\n\n' +
        'Langkah berikutnya: 38 × 2 = **76**, lalu 76 + 2 = **78**.',
      options: [
        { label: 'A', contentMarkdown: '76, 78', scoreValue: 5, isCorrect: true },
        { label: 'B', contentMarkdown: '74, 76', scoreValue: 0 },
        { label: 'C', contentMarkdown: '40, 80', scoreValue: 0 },
        { label: 'D', contentMarkdown: '72, 74', scoreValue: 0 },
        { label: 'E', contentMarkdown: '76, 80', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_05',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      contentMarkdown:
        'Enam pejabat fungsional (A, B, C, D, E, dan F) duduk melingkar dalam rapat koordinasi penanganan inflasi daerah:\n' +
        '1. A duduk tepat berhadapan dengan D.\n' +
        '2. B duduk tepat di sebelah kanan A.\n' +
        '3. C tidak duduk bersebelahan dengan D maupun B.\n' +
        '4. E duduk tepat di sebelah kiri D.\n\n' +
        'Siapakah yang duduk tepat berhadapan dengan B?',
      explanationMarkdown:
        '**Penalaran Spasial & Posisi Meja Bundar (6 Posisi):**\n' +
        'Misalkan posisi jam:\n' +
        '* Posisi 12: A\n' +
        '* Posisi 6: D (karena berhadapan dengan A)\n' +
        '* Posisi 2 (kanan A): B\n' +
        '* Posisi 4: E (sebelah kiri D jika D menghadap pusat meja, atau posisi di sisi D)\n' +
        'Jika A di 12, D di 6, B di 2.\n' +
        'Lawan dari B (posisi 2) di meja bundar 6 orang adalah posisi 8 (tepat berhadapan dengan B).\n' +
        'Siapa yang ada di posisi 8? Posisi yang belum terisi adalah C, E, F.\n' +
        'Diketahui E di samping D (posisi 4 atau 8). C tidak bersebelahan dengan D (posisi 4 dan 8 berdampingan dengan 6/D), maka C harus di posisi 10 (sebelah kiri A).\n' +
        'Jika C di 10, dan E di sebelah kiri D (posisi 8 atau 4), sedangkan F di posisi sisanya.\n' +
        'Tepat berhadapan dengan B (posisi 2) adalah posisi 8 yaitu **E** (atau F tergantung arah hadap, di mana E diposisikan di 8).',
      options: [
        { label: 'A', contentMarkdown: 'C', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'E', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'F', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'D', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'A', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_06',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Suatu dinas memiliki 40 orang staf. Rata-rata nilai evaluasi kinerja 25 orang staf perempuan adalah 82, sedangkan rata-rata nilai kinerja 15 orang staf laki-laki adalah 78. Berapakah rata-rata nilai evaluasi kinerja seluruh staf dinas tersebut?',
      explanationMarkdown:
        '**Rata-rata Gabungan (Weighted Mean):**\n' +
        '$$\\bar{x} = \\frac{(25 \\times 82) + (15 \\times 78)}{25 + 15}$$\n' +
        '$$\\bar{x} = \\frac{2050 + 1170}{40} = \\frac{3220}{40} = 80{,}5$$\n' +
        'Jadi nilai rata-rata gabungan adalah **80,5**.',
      options: [
        { label: 'A', contentMarkdown: '79,8', scoreValue: 0 },
        { label: 'B', contentMarkdown: '80,0', scoreValue: 0 },
        { label: 'C', contentMarkdown: '80,5', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: '81,0', scoreValue: 0 },
        { label: 'E', contentMarkdown: '81,2', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_07',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Jika kondisi cuaca ekstrem, maka penerbangan inspeksi helikopter BPBD dibatalkan.\n' +
        'Jika penerbangan inspeksi helikopter BPBD dibatalkan, maka logistik disalurkan lewat jalur darat.\n' +
        'Fakta lapangan: Logistik tidak disalurkan lewat jalur darat.\n\n' +
        'Kesimpulan yang pasti benar adalah...',
      explanationMarkdown:
        '**Modus Tollens Berantai:**\n' +
        'Premis 1: P -> Q (Cuaca ekstrem -> Helikopter batal)\n' +
        'Premis 2: Q -> R (Helikopter batal -> Logistik jalur darat)\n' +
        'Kesimpulan silogisme: P -> R (Cuaca ekstrem -> Logistik jalur darat)\n' +
        'Fakta: ~R (Logistik TIDAK disalurkan lewat jalur darat)\n' +
        'Dengan Modus Tollens (~R -> ~P): Kondisi cuaca **tidak ekstrem**.',
      options: [
        { label: 'A', contentMarkdown: 'Kondisi cuaca tidak ekstrem.', scoreValue: 5, isCorrect: true },
        { label: 'B', contentMarkdown: 'Helikopter BPBD mengalami kerusakan mesin.', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'Kondisi cuaca sangat ekstrem.', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Penerbangan inspeksi helikopter tetap dibatalkan.', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Penyaluran logistik ditunda hingga minggu depan.', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_08',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Sebuah proyek pemutakhiran data kependudukan dapat diselesaikan oleh 12 orang operator dalam waktu 20 hari kerja. Jika target penyelesaian dipercepat menjadi hanya 15 hari kerja, berapakah jumlah operator tambahan yang harus ditugaskan?',
      explanationMarkdown:
        '**Perbandingan Berbalik Nilai:**\n' +
        '$$12 \\times 20 = x \\times 15$$\n' +
        '$$240 = 15x \\implies x = 16\\text{ orang}$$\n' +
        'Operator yang dibutuhkan adalah 16 orang.\n' +
        'Tambahan operator = $16 - 12 = \\mathbf{4\\text{ orang}}$.',
      options: [
        { label: 'A', contentMarkdown: '3 orang', scoreValue: 0 },
        { label: 'B', contentMarkdown: '4 orang', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: '5 orang', scoreValue: 0 },
        { label: 'D', contentMarkdown: '6 orang', scoreValue: 0 },
        { label: 'E', contentMarkdown: '8 orang', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_09',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      contentMarkdown:
        'Tiga tim verifikator (Tim Merah, Tim Hijau, dan Tim Biru) memproses permohonan sertifikat:\n' +
        '* Tim Merah memproses lebih banyak berkas daripada Tim Hijau.\n' +
        '* Tim Biru memproses lebih sedikit berkas daripada Tim Hijau.\n' +
        '* Tim Kuning memproses lebih banyak berkas daripada Tim Merah.\n\n' +
        'Urutan tim dari yang memproses berkas paling banyak hingga paling sedikit adalah...',
      explanationMarkdown:
        '**Penalaran Urutan Relasional:**\n' +
        '* Tim Kuning > Tim Merah\n' +
        '* Tim Merah > Tim Hijau\n' +
        '* Tim Hijau > Tim Biru\n\n' +
        'Maka gabungan urutan dari terbanyak ke tersedikit: **Kuning > Merah > Hijau > Biru**.',
      options: [
        { label: 'A', contentMarkdown: 'Kuning, Merah, Biru, Hijau', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Merah, Kuning, Hijau, Biru', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'Kuning, Merah, Hijau, Biru', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: 'Hijau, Biru, Merah, Kuning', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Kuning, Hijau, Merah, Biru', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_10',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pagu anggaran sebuah sub-kegiatan adalah Rp120.000.000. Sebanyak 45% dialokasikan untuk belanja modal, 35% untuk belanja operasional dan honorarium, dan sisanya untuk biaya pemeliharaan. Berapakah alokasi dana untuk biaya pemeliharaan?',
      explanationMarkdown:
        '**Perhitungan Persentase Anggaran:**\n' +
        'Persentase pemeliharaan = $100\\% - (45\\% + 35\\%) = 100\\% - 80\\% = 20\\%$.\n' +
        'Nilai pemeliharaan = $20\\% \\times \\text{Rp120.000.000} = \\mathbf{\\text{Rp24.000.000}}$.',
      options: [
        { label: 'A', contentMarkdown: 'Rp20.000.000', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Rp22.500.000', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'Rp24.000.000', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: 'Rp26.000.000', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Rp28.000.000', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_11',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Semua dokumen rahasia negara harus disimpan dalam lemari berkas terkunci ganda.\n' +
        'Flashdisk X berisi dokumen rahasia negara.\n\n' +
        'Kesimpulan yang benar adalah...',
      explanationMarkdown:
        '**Silogisme Kategorik:**\n' +
        'Karena Flashdisk X memuat dokumen rahasia negara, maka flashdisk tersebut termasuk kategori yang harus disimpan dalam lemari berkas terkunci ganda.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Flashdisk X boleh dibawa pulang asalkan ada kata sandi.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Flashdisk X harus disimpan dalam lemari berkas terkunci ganda.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Hanya dokumen kertas yang wajib disimpan di lemari terkunci ganda.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Flashdisk X tidak memerlukan pengamanan khusus.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Semua benda di lemari berkas terkunci ganda adalah flashdisk.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_cog_12',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      contentMarkdown:
        'Tentukan nilai $x$ pada barisan angka berikut:\n\n' +
        '**2, 3, 5, 9, 17, 33, x**',
      explanationMarkdown:
        '**Pola Selisih Barisan Eksponensial ($2^n$):**\n' +
        '* $3 - 2 = 1$ ($2^0$)\n' +
        '* $5 - 3 = 2$ ($2^1$)\n' +
        '* $9 - 5 = 4$ ($2^2$)\n' +
        '* $17 - 9 = 8$ ($2^3$)\n' +
        '* $33 - 17 = 16$ ($2^4$)\n\n' +
        'Maka selisih berikutnya adalah $2^5 = 32$.\n' +
        '$x = 33 + 32 = \\mathbf{65}$.\n' +
        '(Atau pola: $2n - 1$: $2(33) - 1 = 65$).',
      options: [
        { label: 'A', contentMarkdown: '49', scoreValue: 0 },
        { label: 'B', contentMarkdown: '55', scoreValue: 0 },
        { label: 'C', contentMarkdown: '63', scoreValue: 0 },
        { label: 'D', contentMarkdown: '65', scoreValue: 5, isCorrect: true },
        { label: 'E', contentMarkdown: '67', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_13',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        ':::passage[Data Tren Stunting dan Sanitasi Daerah]\n' +
        'Berdasarkan laporan dinas kesehatan, Desa Sukamaju mencatat penurunan angka stunting tertinggi (turun 12%), diikuti Desa Mekarjaya (turun 8%), Desa Margahayu (turun 5%), dan Desa Karanganyar (stagnan). Data Dinas Lingkungan Hidup menunjukkan persentase rumah tangga dengan akses jamban sehat adalah: Desa Sukamaju 94%, Desa Mekarjaya 82%, Desa Margahayu 71%, dan Desa Karanganyar 52%.\n' +
        ':::\n\n' +
        'Pernyataan manakah yang paling akurat mencerminkan hubungan antar data di atas?',
      explanationMarkdown:
        '**Analisis Korelasi Data:**\n' +
        'Data memperlihatkan urutan penurunan stunting berbanding lurus dengan urutan persentase kepemilikan jamban sehat (Sukamaju > Mekarjaya > Margahayu > Karanganyar). Hal ini menunjukkan adanya korelasi positif antara ketersediaan sanitasi layak dengan efektivitas penurunan angka stunting balita.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Tingkat penurunan stunting berbanding lurus secara positif dengan tingginya akses rumah tangga terhadap sanitasi jamban sehat.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'B',
          contentMarkdown:
            'Akses sanitasi jamban sehat tidak memiliki kaitan dengan penurunan stunting di pedesaan.',
          scoreValue: 0,
        },
        {
          label: 'C',
          contentMarkdown:
            'Desa Karanganyar memiliki angka stunting terendah di antara seluruh desa.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown:
            'Penurunan stunting di Desa Mekarjaya lebih cepat daripada Desa Sukamaju.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown:
            'Pemerintah sebaiknya menghentikan program jamban sehat dan fokus pada pemberian susu saja.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_cog_14',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Kecepatan rata-rata kendaraan dinas tim patroli dari Kantor Dinas ke Wilayah Bencana adalah 60 km/jam dengan waktu tempuh 2 jam 30 menit. Saat perjalanan kembali ke kantor dinas melewati jalur yang sama, kondisi jalan macet sehingga kecepatan rata-rata turun menjadi 50 km/jam. Berapakah waktu tempuh perjalanan kembali tersebut?',
      explanationMarkdown:
        '**Jarak dan Kecepatan:**\n' +
        'Waktu berangkat = 2,5 jam.\n' +
        'Jarak = $60 \\times 2{,}5 = 150\\text{ km}$.\n' +
        'Waktu pulang = $\\frac{\\text{Jarak}}{\\text{Kecepatan Pulang}} = \\frac{150}{50} = 3\\text{ jam}$.',
      options: [
        { label: 'A', contentMarkdown: '2 jam 45 menit', scoreValue: 0 },
        { label: 'B', contentMarkdown: '3 jam 00 menit', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: '3 jam 15 menit', scoreValue: 0 },
        { label: 'D', contentMarkdown: '3 jam 30 menit', scoreValue: 0 },
        { label: 'E', contentMarkdown: '4 jam 00 menit', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_15',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pilihlah pasangan analogi kata yang memiliki hubungan logika paling setara:\n\n' +
        '**AUDITOR : AKUNTABILITAS = ... : ...**',
      explanationMarkdown:
        '**Analogi Profesi dan Nilai Utama yang Ditegakkan:**\n' +
        'Auditor bertugas menegakkan dan memastikan Akuntabilitas.\n' +
        'Sebagaimana Hakim bertugas menegakkan dan memastikan Keadilan.',
      options: [
        { label: 'A', contentMarkdown: 'Guru : Sekolah', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Hakim : Keadilan', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'Dokter : Obat', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Polisi : Borgol', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Arsitek : Gedung', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_16',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pilihlah pasangan analogi kata yang memiliki hubungan logika paling setara:\n\n' +
        '**REGULASI : PELANGGARAN = VAKSIN : ...**',
      explanationMarkdown:
        '**Analogi Hubungan Preventif (Instrumen dan Hal yang Dicegah):**\n' +
        'Regulasi dibuat untuk mencegah/mengendalikan terjadinya Pelanggaran.\n' +
        'Vaksin dibuat untuk mencegah/mengendalikan terjadinya Infeksi / Penyakit.',
      options: [
        { label: 'A', contentMarkdown: 'Suntik', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Infeksi', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'Dokter', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Rumah Sakit', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Kekebalan', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_17',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Nilai dari:\n\n' +
        '$$\\sqrt{144} + \\sqrt[3]{216} - 3^2 = \\dots$$',
      explanationMarkdown:
        '**Operasi Bilangan Berpangkat dan Akar:**\n' +
        '* $\\sqrt{144} = 12$\n' +
        '* $\\sqrt[3]{216} = 6$ (karena $6^3 = 216$)\n' +
        '* $3^2 = 9$\n\n' +
        'Hasil = $12 + 6 - 9 = 18 - 9 = \\mathbf{9}$.',
      options: [
        { label: 'A', contentMarkdown: '7', scoreValue: 0 },
        { label: 'B', contentMarkdown: '8', scoreValue: 0 },
        { label: 'C', contentMarkdown: '9', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: '11', scoreValue: 0 },
        { label: 'E', contentMarkdown: '15', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_18',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Tentukan angka berikutnya dalam deret Fibonacci modifikasi berikut:\n\n' +
        '**1, 3, 4, 7, 11, 18, 29, ...**',
      explanationMarkdown:
        '**Deret Fibonacci (Jumlah Dua Bilangan Sebelumnya):**\n' +
        '* $1 + 3 = 4$\n' +
        '* $3 + 4 = 7$\n' +
        '* $4 + 7 = 11$\n' +
        '* $7 + 11 = 18$\n' +
        '* $11 + 18 = 29$\n\n' +
        'Angka berikutnya: $18 + 29 = \\mathbf{47}$.',
      options: [
        { label: 'A', contentMarkdown: '40', scoreValue: 0 },
        { label: 'B', contentMarkdown: '45', scoreValue: 0 },
        { label: 'C', contentMarkdown: '47', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: '52', scoreValue: 0 },
        { label: 'E', contentMarkdown: '58', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_19',
      topicId: 'top_prof_potensi_analitis',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Tidak ada pegawai honorer yang menjadi Pejabat Pembuat Komitmen (PPK).\n' +
        'Pak Hendra adalah Pejabat Pembuat Komitmen (PPK).\n\n' +
        'Maka kesimpulan yang benar adalah...',
      explanationMarkdown:
        '**Silogisme Negatif:**\n' +
        'Premis 1: Honorer $\\cap$ PPK = $\\emptyset$ (Tidak ada honorer yang PPK).\n' +
        'Premis 2: Pak Hendra $\\in$ PPK.\n' +
        'Kesimpulan: Pak Hendra **bukan pegawai honorer**.',
      options: [
        { label: 'A', contentMarkdown: 'Pak Hendra adalah pegawai honorer teladan.', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Pak Hendra bukan pegawai honorer.', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'Pak Hendra sebentar lagi diangkat menjadi ASN.', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Semua PPK adalah staf honorer berprestasi.', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Pak Hendra merangkap jabatan staf honorer.', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_cog_20',
      topicId: 'top_prof_potensi_kuantitatif',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      contentMarkdown:
        'Jika $x = 0{,}375$ dan $y = \\frac{3}{8}$, maka hubungan yang benar antara $x$ dan $y$ adalah...',
      explanationMarkdown:
        '**Konversi Pecahan dan Desimal:**\n' +
        '$\\frac{3}{8} = 3 \\div 8 = 0{,}375$.\n' +
        'Karena $x = 0{,}375$ dan $y = 0{,}375$, maka $x = y$.',
      options: [
        { label: 'A', contentMarkdown: '$x > y$', scoreValue: 0 },
        { label: 'B', contentMarkdown: '$x < y$', scoreValue: 0 },
        { label: 'C', contentMarkdown: '$x = y$', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: '$2x = 3y$', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Hubungan $x$ dan $y$ tidak dapat ditentukan', scoreValue: 0 },
      ],
    },

    // ==========================================
    // PAKET 4: LITERASI DIGITAL & SPBE ASN - 15 SOAL (66-80)
    // ==========================================
    {
      id: 'q_prof_dig_01',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Anda menerima sebuah email yang mengatasnamakan Badan Kepegawaian Negara (BKN) dengan subjek "Verifikasi Data Kenaikan Pangkat ASN Segera". Email tersebut meminta Anda mengklik sebuah tautan (*link*) dan memasukkan NIP serta kata sandi (*password*) akun ASN Digital Anda pada halaman web yang terbuka. Tindakan yang paling tepat adalah...',
      explanationMarkdown:
        '**Literasi Keamanan Siber (Phishing Awareness):**\n' +
        'Ciri khas serangan phishing adalah menciptakan kepanikan atau urgensi palsu untuk mencuri kredensial akun. Domain pengirim resmi pemerintah wajib berakhiran `.go.id`. ASN wajib memverifikasi alamat email pengirim dan tidak memasukkan password di tautan asing.',
      options: [
        {
          label: 'A',
          contentMarkdown:
            'Segera mengklik tautan dan memasukkan kata sandi agar berkas kenaikan pangkat tidak tertolak.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown:
            'Memeriksa domain pengirim email dengan teliti, tidak mengklik tautan mencurigakan, dan melaporkannya kepada tim CSIRT/Pranata Komputer instansi sebagai indikasi serangan phishing.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown:
            'Meneruskan email tersebut ke seluruh staf di kantor agar mereka juga mengisi data.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown:
            'Membalas email tersebut dengan menanyakan nomor rekening bank panitia.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown:
            'Mengklik tautan namun memasukkan nomor NIP palsu.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_02',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Menurut UU Pelindungan Data Pribadi (UU PDP No. 27/2022) dan tata kelola SPBE, data NIK KTP, riwayat kesehatan, dan data biometrik masyarakat yang disimpan di sistem layanan dinas diklasifikasikan sebagai...',
      explanationMarkdown:
        '**Regulasi Perlindungan Data Pribadi:**\n' +
        'UU No. 27 Tahun 2022 membagi data pribadi menjadi data pribadi umum dan spesifik. Data kesehatan, biometrik, genetika, dan catatan kejahatan merupakan **Data Pribadi yang Bersifat Spesifik** yang memiliki standar keamanan dan sanksi kebocoran yang sangat ketat.',
      options: [
        { label: 'A', contentMarkdown: 'Data Terbuka Publik yang bebas diunduh siapa saja', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Data Pribadi Spesifik / Sensitif yang wajib dilindungi dengan enkripsi ketat', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'Data Komersial untuk keperluan penjualan periklanan', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Data Arsip Statis yang tidak memiliki batasan akses', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Data Bebas Akses bagi pihak ketiga tanpa persetujuan subjek data', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_dig_03',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Salah satu tujuan utama arsitektur Sistem Pemerintahan Berbasis Elektronik (SPBE) sesuai Perpres No. 95 Tahun 2018 adalah interoperabilitas data dan integrasi layanan, yang bertujuan untuk menghilangkan fenomena...',
      explanationMarkdown:
        '**Tujuan Reformasi SPBE:**\n' +
        'Salah satu masalah terbesar birokrasi digital sebelumnya adalah ego sektoral pembuatan ribuan aplikasi yang terfragmentasi (silo sistem / pulau-pulau aplikasi), yang menyebabkan pemborosan APBD/APBN dan menyulitkan masyarakat.',
      options: [
        { label: 'A', contentMarkdown: 'Silo sistem dan fragmentasi aplikasi yang saling terisolasi (*pulau aplikasi*)', scoreValue: 5, isCorrect: true },
        { label: 'B', contentMarkdown: 'Penggunaan jaringan internet di kantor pemerintahan', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'Tanda tangan elektronik bersertifikasi BSrE', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Transparansi anggaran pengadaan barang dan jasa', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Penggunaan komputer modern di instansi daerah', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_dig_04',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Tanda Tangan Elektronik (TTE) Tersertifikasi yang sah digunakan dalam persuratan dinas di lingkungan instansi pemerintah Indonesia diterbitkan oleh Badan Sertifikasi yang terafiliasi resmi dengan...',
      explanationMarkdown:
        '**Regulasi Keamanan Informasi Pemerintah:**\n' +
        'Otoritas Penyelenggara Sertifikasi Elektronik (PSrE) instansi pemerintah di Indonesia dikelola oleh **Balai Sertifikasi Elektronik (BSrE)** di bawah naungan **Badan Siber dan Sandi Negara (BSSN)**.',
      options: [
        { label: 'A', contentMarkdown: 'Kementerian Keuangan RI', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Balai Sertifikasi Elektronik (BSrE) - Badan Siber dan Sandi Negara (BSSN)', scoreValue: 5, isCorrect: true },
        { label: 'C', contentMarkdown: 'Badan Pengawas Keuangan dan Pembangunan (BPKP)', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'Kementerian Hukum dan HAM RI', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_dig_05',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Saat bekerja di kafe atau tempat umum saat perjalanan dinas luar kota, seorang ASN harus mengakses basis data kepegawaian internal kantor melalui laptop dinas. Praktik keamanan siber yang paling aman untuk dilakukan adalah...',
      explanationMarkdown:
        '**Etika & Keamanan Koneksi Data Dinas:**\n' +
        'Jaringan Wi-Fi publik di kafe/bandara sangat rentan terhadap serangan sniffing (*Man-in-the-Middle attack*). ASN wajib menggunakan Virtual Private Network (VPN) terenkripsi kantor atau hotspot seluler pribadi ber-password.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Menggunakan Wi-Fi publik gratis tanpa kata sandi karena kuota internet lebih hemat.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Menggunakan jaringan Virtual Private Network (VPN) resmi kantor atau tethering data seluler pribadi yang aman terenkripsi.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Mematikan fitur antivirus agar kecepatan unduh dokumen di laptop menjadi maksimal.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Membagikan kata sandi akun dinas kepada staf kafe jika mengalami kendala login.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Meninggalkan laptop dalam keadaan terbuka dan tidak terkunci saat pergi ke toilet.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_06',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Seorang ASN menemukan berita yang viral di media sosial dengan judul heboh yang mengklaim pemerintah akan memotong saldo rekening tabungan PNS sebesar 15% untuk bayar utang negara. Langkah literasi informasi yang benar sebelum menyebarkan berita tersebut adalah...',
      explanationMarkdown:
        '**Literasi Digital & Verifikasi Informasi (Fact Checking):**\n' +
        'ASN wajib menerapkan cek fakta (*fact checking*): memeriksa kredibilitas sumber berita, memverifikasi ke siaran pers resmi kementerian terkait, dan tidak ikut menyebarkan disinformasi (*hoaks*).',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Langsung meneruskannya ke grup alumni dan grup keluarga agar semua orang waspada.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Melakukan verifikasi fakta (*cross-check*) ke kanal resmi pemerintah (misal: situs Kemenkeu/Kominfo) dan tidak menyebarkan informasi sebelum terbukti valid.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Menambahkan opini pribadi yang memperkeruh kepanikan warganet di kolom komentar.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Segera menarik seluruh uang tabungan di bank tanpa mencari kejelasan.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Membuat video TikTok yang membenarkan isi berita tersebut.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_07',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Prinsip "Satu Data Indonesia" (SDI) yang diatur dalam Perpres No. 39 Tahun 2019 mensyaratkan bahwa setiap data yang diproduksi oleh instansi pemerintah harus memenuhi kriteria berikut, KECUALI...',
      explanationMarkdown:
        '**Prinsip Satu Data Indonesia (SDI):**\n' +
        'Sesuai Pasal 5 Perpres No. 39/2019, prinsip SDI mencakup:\n' +
        '1. Memenuhi Standar Data,\n' +
        '2. Memiliki Metadata,\n' +
        '3. Memenuhi Kaidah Interoperabilitas Data, dan\n' +
        '4. Menggunakan Kode Referensi dan/atau Data Induk.\n' +
        'Penyimpanan dalam format eksklusif berbayar yang tidak bisa dibaca sistem lain justru melanggar prinsip keterbukaan dan interoperabilitas.',
      options: [
        { label: 'A', contentMarkdown: 'Memenuhi standar data', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Memiliki metadata', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'Memenuhi kaidah interoperabilitas data', scoreValue: 0 },
        { label: 'D', contentMarkdown: 'Wajib disimpan dalam format file tertutup berbayar yang tidak bisa diakses aplikasi lain', scoreValue: 5, isCorrect: true },
        { label: 'E', contentMarkdown: 'Menggunakan kode referensi dan/atau data induk', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_dig_08',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Sebuah dokumen draf Peraturan Daerah (Perda) yang masih dalam tahap pembahasan tertutup diunggah oleh staf ke platform penyimpanan awan (*cloud storage*) publik dengan setelan tautan "Siapa saja yang memiliki link dapat melihat dan mengunduh". Risiko terbesar dari tindakan tersebut adalah...',
      explanationMarkdown:
        '**Keamanan Informasi & Hak Akses Dokumen:**\n' +
        'Konfigurasi tautan terbuka (*public link*) membuka peluang kebocoran informasi prematur kepada publik yang dapat memicu polemik liar sebelum regulasi difinalisasi secara resmi.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Ukuran file dokumen di laptop staf akan bertambah dua kali lipat.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Potensi kebocoran informasi dan akses tidak sah oleh pihak luar terhadap dokumen kebijakan yang belum resmi ditetapkan.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Kecepatan internet kantor akan otomatis terputus.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Dokumen tersebut akan otomatis hilang dari server dinas.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Komputer dinas akan mengalami mati total secara permanen.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_09',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Dalam pembuatan kata sandi (*password*) akun aplikasi kepegawaian (SIMPEG/SIASN), kombinasi kata sandi manakah yang paling kuat (*strong password*) dan aman dari serangan peretasan brute force?',
      explanationMarkdown:
        '**Standar Password Kuat (NIST Cybersecurity Guidelines):**\n' +
        'Password kuat harus memiliki panjang minimal 12 karakter dan kombinasi huruf kapital, huruf kecil, angka, serta simbol khusus, tanpa menggunakan informasi pribadi yang mudah ditebak (seperti tanggal lahir atau nama kota).',
      options: [
        { label: 'A', contentMarkdown: '1234567890', scoreValue: 0 },
        { label: 'B', contentMarkdown: 'Jakarta2024', scoreValue: 0 },
        { label: 'C', contentMarkdown: 'P@55w0rd!B1r0kr4s1#2026', scoreValue: 5, isCorrect: true },
        { label: 'D', contentMarkdown: 'adminadmin', scoreValue: 0 },
        { label: 'E', contentMarkdown: 'tanggal lahir diikuti nama anak', scoreValue: 0 },
      ],
    },
    {
      id: 'q_prof_dig_10',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Penggunaan autentikasi dua faktor (*Two-Factor Authentication / 2FA*) pada aplikasi kedinasan ASN berfungsi untuk...',
      explanationMarkdown:
        '**Fungsi Autentikasi Multi-Faktor (2FA/MFA):**\n' +
        '2FA menambahkan lapisan keamanan kedua (seperti kode OTP melalui aplikasi authenticator atau SMS) sehingga peretas tidak dapat masuk meskipun berhasil mencuri kata sandi pengguna.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Mempercepat kecepatan mengetik dokumen di komputer dinas.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Menambahkan lapisan perlindungan ekstra sehingga akun tidak dapat diakses hanya dengan kata sandi saja.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Menghapus seluruh file sementara (cache) secara otomatis.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Membuat tampilan antarmuka aplikasi menjadi lebih berwarna-warni.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Menggantikan fungsi tanda tangan elektronik bersertifikat.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_11',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Saat menggunakan teknologi kecerdasan buatan generatif (seperti ChatGPT atau LLM lainnya) untuk membantu menyusun draf dokumen kedinasan, hal yang HARAM dilakukan oleh seorang ASN adalah...',
      explanationMarkdown:
        '**Etika Penggunaan AI di Lingkungan Birokrasi:**\n' +
        'Memasukkan data rahasia negara, dokumen sensitif yang belum diumumkan, data pribadi masyarakat (NIK, rekam medis), atau informasi rahasia dinas ke dalam prompt model AI publik melanggar UU PDP dan UU KIP karena data tersebut berpotensi disimpan dan dilatih oleh penyedia server luar negeri.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Menggunakan AI untuk membetulkan kesalahan ejaan dan tata bahasa draf pidato.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Meminta AI merangkum artikel jurnal ilmiah tentang tata kelola kota.',
          scoreValue: 0,
        },
        {
          label: 'C',
          contentMarkdown: 'Memasukkan dokumen rahasia negara, data pribadi NIK warga, atau draf investigasi audit ke dalam prompt AI publik.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown: 'Menggunakan AI untuk mencari ide konsep tema spanduk hari ulang tahun instansi.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Memeriksa kembali (*fact-check*) kebenaran substansi jawaban yang dihasilkan AI.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_12',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Apa yang dimaksud dengan konsep *Zero Trust Architecture* dalam keamanan sistem informasi SPBE instansi pemerintah?',
      explanationMarkdown:
        '**Konsep Keamanan Siber Modern (Zero Trust):**\n' +
        'Prinsip *Zero Trust* berbunyi: *"Never trust, always verify"*. Sistem tidak mempercayai siapa pun secara otomatis, baik pengguna dari dalam kantor maupun luar jaringan kantor; setiap permintaan akses wajib diverifikasi secara ketat.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Pemerintah tidak mempercayai vendor mana pun dalam pengadaan komputer.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Prinsip keamanan yang berasumsi tidak ada entitas yang dipercaya secara otomatis (*never trust, always verify*), sehingga setiap akses selalu diverifikasi berulang.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Sistem yang tidak menggunakan kata sandi sama sekali.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Penghapusan seluruh data digital setiap hari pukul 00.00 WIB.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Larangan penggunaan gawai seluler bagi seluruh pegawai negeri.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_13',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Sebuah flashdisk dinas yang berisi salinan data arsip persuratan kantor terkena virus *ransomware*, sehingga seluruh file di dalamnya terkunci dengan ekstensi aneh dan muncul pesan pemerasan meminta tebusan uang kripto. Tindakan penanganan awal yang paling tepat adalah...',
      explanationMarkdown:
        '**Insiden Siber Ransomware (Mitigasi Isolasi Cepat):**\n' +
        'Langkah pertama saat komputer terinfeksi ransomware adalah mencabut jaringan (kabel LAN / Wi-Fi) dan melepas penyimpanan eksternal agar virus tidak menyebar ke komputer lain di jaringan dinas, lalu segera lapor ke tim IT/CSIRT.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Segera mentransfer uang tebusan sesuai instruksi peretas.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Segera memutuskan koneksi perangkat dari jaringan kantor (cabut kabel LAN/matikan Wi-Fi), tidak mencolokkan flashdisk ke komputer lain, dan melaporkan ke tim penanganan insiden siber (CSIRT).',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Mencolokkan flashdisk tersebut ke laptop pimpinan untuk meminta pertolongan.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Mengganti nama file yang terkunci satu per satu secara manual.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Mendiamkan saja dan menyembunyikan flashdisk tersebut di laci.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_14',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Pusat Data Nasional (PDN) yang dibangun oleh pemerintah dalam ekosistem SPBE berfungsi untuk...',
      explanationMarkdown:
        '**Fungsi Pusat Data Nasional (PDN):**\n' +
        'PDN mengintegrasikan infrastruktur data terpusat bagi kementerian/lembaga/daerah, meningkatkan efisiensi belanja infrastruktur server, dan menjamin standar keamanan siber yang seragam secara nasional.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Menjual data kependudukan Indonesia kepada perusahaan e-commerce internasional.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Mengonsolidasikan pusat data instansi pemerintah yang tersebar menjadi satu infrastruktur terpadu, efisien, aman, dan berstandar global.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'C',
          contentMarkdown: 'Menggantikan seluruh pegawai negeri dengan robot kecerdasan buatan.',
          scoreValue: 0,
        },
        {
          label: 'D',
          contentMarkdown: 'Menyediakan film dan hiburan gratis bagi seluruh masyarakat.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown: 'Menutup seluruh akses internet internasional di wilayah Indonesia.',
          scoreValue: 0,
        },
      ],
    },
    {
      id: 'q_prof_dig_15',
      topicId: 'top_prof_literasi_digital',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      contentMarkdown:
        'Etika bermedia sosial bagi aparatur negara sesuai Surat Edaran MenPAN-RB mengatur bahwa dalam aktivitas digital di ruang publik maya, seorang ASN wajib...',
      explanationMarkdown:
        '**Etika Digital Aparatur Sipil Negara:**\n' +
        'ASN harus menjunjung netralitas politik, menjaga rahasia jabatan, tidak menyebarkan kebencian/hoaks, serta mengedepankan kesantunan dan citra positif abdi negara di media sosial.',
      options: [
        {
          label: 'A',
          contentMarkdown: 'Menunjukkan gaya hidup mewah (*flexing*) untuk menaikkan prestise kantor dinas.',
          scoreValue: 0,
        },
        {
          label: 'B',
          contentMarkdown: 'Ikut mengampanyekan pasangan calon kepala daerah atau calon presiden di media sosial.',
          scoreValue: 0,
        },
        {
          label: 'C',
          contentMarkdown: 'Menjaga netralitas, tidak menyebarkan ujaran kebencian/hoaks, melindungi rahasia jabatan, dan memperkuat citra profesional institusi pemerintah.',
          scoreValue: 5,
          isCorrect: true,
        },
        {
          label: 'D',
          contentMarkdown: 'Membocorkan draf SK mutasi pegawai ke akun gosip media sosial.',
          scoreValue: 0,
        },
        {
          label: 'E',
          contentMarkdown:
            'Menyerang kebijakan instansi lain di kolom komentar akun kementerian.',
          scoreValue: 0,
        },
      ],
    },
  ];

  console.log(`Menyimpan ${allQuestions.length} butir soal ke basis data...`);

  // Simpan soal dan opsinya secara bertahap / atomic
  for (const q of allQuestions) {
    const existingQ = await db.select().from(questions).where(eq(questions.id, q.id));
    const qData = {
      id: q.id,
      topicId: q.topicId,
      type: q.type,
      contentMarkdown: q.contentMarkdown,
      explanationMarkdown: q.explanationMarkdown,
      difficulty: q.difficulty || 'MEDIUM',
    };

    if (existingQ.length === 0) {
      await db.insert(questions).values(qData);
    } else {
      await db.update(questions).set(qData).where(eq(questions.id, q.id));
    }

    // Hapus opsi lama bila ada, lalu masukkan opsi baru
    await db.delete(questionOptions).where(eq(questionOptions.questionId, q.id));

    // Map kalibrasi bobot unik 1, 2, 3, 4, 5 untuk soal SJT
    const sjtAdjustments: Record<string, Record<string, number>> = {
      q_prof_man_02: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_man_04: { A: 2, B: 1, C: 3, D: 4, E: 5 },
      q_prof_man_05: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_man_07: { A: 1, B: 2, C: 3, D: 5, E: 4 },
      q_prof_man_08: { A: 2, B: 5, C: 1, D: 3, E: 4 },
      q_prof_man_09: { A: 5, B: 2, C: 1, D: 3, E: 4 },
      q_prof_man_10: { A: 1, B: 3, C: 2, D: 4, E: 5 },
      q_prof_man_11: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_man_13: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_man_14: { A: 1, B: 3, C: 5, D: 2, E: 4 },
      q_prof_man_15: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_man_16: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_man_17: { A: 1, B: 2, C: 3, D: 5, E: 4 },
      q_prof_man_18: { A: 2, B: 5, C: 3, D: 4, E: 1 },
      q_prof_man_19: { A: 5, B: 2, C: 1, D: 3, E: 4 },
      q_prof_man_20: { A: 1, B: 3, C: 2, D: 5, E: 4 },
      q_prof_man_21: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_man_22: { A: 2, B: 1, C: 5, D: 3, E: 4 },
      q_prof_man_23: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_man_24: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_man_25: { A: 2, B: 1, C: 3, D: 4, E: 5 },
      q_prof_soc_01: { A: 2, B: 1, C: 3, D: 5, E: 4 },
      q_prof_soc_02: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_soc_03: { A: 2, B: 5, C: 1, D: 3, E: 4 },
      q_prof_soc_04: { A: 1, B: 2, C: 3, D: 5, E: 4 },
      q_prof_soc_05: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_soc_06: { A: 2, B: 1, C: 5, D: 3, E: 4 },
      q_prof_soc_07: { A: 1, B: 2, C: 3, D: 4, E: 5 },
      q_prof_soc_08: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_soc_09: { A: 2, B: 1, C: 3, D: 5, E: 4 },
      q_prof_soc_10: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_soc_11: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_soc_12: { A: 1, B: 2, C: 3, D: 5, E: 4 },
      q_prof_soc_13: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_soc_14: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_soc_15: { A: 2, B: 1, C: 3, D: 5, E: 4 },
      q_prof_soc_16: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_soc_17: { A: 1, B: 2, C: 5, D: 3, E: 4 },
      q_prof_soc_18: { A: 1, B: 5, C: 2, D: 3, E: 4 },
      q_prof_soc_19: { A: 5, B: 1, C: 2, D: 3, E: 4 },
      q_prof_soc_20: { A: 1, B: 2, C: 5, D: 3, E: 4 },
    };

    const optionsToInsert = q.options.map((opt, idx) => {
      let finalScore = opt.scoreValue !== undefined ? opt.scoreValue : opt.isCorrect ? 5 : 0;
      if (sjtAdjustments[q.id] && sjtAdjustments[q.id][opt.label] !== undefined) {
        finalScore = sjtAdjustments[q.id][opt.label];
      }
      return {
        id: `opt_${q.id}_${opt.label.toLowerCase()}`,
        questionId: q.id,
        label: opt.label,
        contentMarkdown: opt.contentMarkdown,
        isCorrect: Boolean(opt.isCorrect || finalScore === 5),
        scoreValue: finalScore,
        orderIndex: idx,
      };
    });

    await db.insert(questionOptions).values(optionsToInsert);
  }
  console.log('✓ Seluruh butir soal dan opsi jawaban berhasil disimpan.');

  // 4. Buat Paket-Paket Ujian
  const packagesData: PackageSeed[] = [
    {
      id: 'pkg_prof_sjt_manajerial',
      title: 'Simulasi SJT Kompetensi Manajerial ASN (PermenPAN-RB No. 38/2017)',
      slug: 'simulasi-sjt-kompetensi-manajerial-asn',
      type: 'SIMULATION',
      durationMinutes: 45,
      passingGradeRules: JSON.stringify({
        correctScore: 5,
        wrongScore: 1,
        emptyScore: 0,
        passingScore: 100, // Dari maks 125 (25 butir soal skala 1-5)
      }),
      questionIds: allQuestions.slice(0, 25).map((q) => q.id),
    },
    {
      id: 'pkg_prof_sjt_sosio_berakhlak',
      title: 'Simulasi Sosio Kultural & Core Values BerAKHLAK (SJT Skala 1–5)',
      slug: 'simulasi-sosio-kultural-dan-berakhlak-asn',
      type: 'SIMULATION',
      durationMinutes: 35,
      passingGradeRules: JSON.stringify({
        correctScore: 5,
        wrongScore: 1,
        emptyScore: 0,
        passingScore: 80, // Dari maks 100 (20 butir soal skala 1-5)
      }),
      questionIds: allQuestions.slice(25, 45).map((q) => q.id),
    },
    {
      id: 'pkg_prof_potensi_kognitif',
      title: 'Uji Potensi Kognitif & Berpikir Analitis ASN',
      slug: 'uji-potensi-kognitif-analitis-asn',
      type: 'SIMULATION',
      durationMinutes: 35,
      passingGradeRules: JSON.stringify({
        correctScore: 5,
        wrongScore: 0,
        emptyScore: 0,
        passingScore: 70, // Dari maks 100 (20 butir soal)
      }),
      questionIds: allQuestions.slice(45, 65).map((q) => q.id),
    },
    {
      id: 'pkg_prof_literasi_digital',
      title: 'Literasi Digital, Keamanan Siber & SPBE ASN',
      slug: 'literasi-digital-keamanan-siber-spbe-asn',
      type: 'PRACTICE',
      durationMinutes: 25,
      passingGradeRules: JSON.stringify({
        correctScore: 5,
        wrongScore: 0,
        emptyScore: 0,
        passingScore: 55, // Dari maks 75 (15 butir soal)
      }),
      questionIds: allQuestions.slice(65, 80).map((q) => q.id),
    },
  ];

  for (const pkg of packagesData) {
    const existingPkg = await db
      .select()
      .from(examPackages)
      .where(eq(examPackages.id, pkg.id));

    const pkgValues = {
      id: pkg.id,
      title: pkg.title,
      slug: pkg.slug,
      categoryId: profilingCategory.id,
      type: pkg.type,
      durationMinutes: pkg.durationMinutes,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: pkg.passingGradeRules,
      isPublished: true,
    };

    if (existingPkg.length === 0) {
      await db.insert(examPackages).values(pkgValues);
      console.log('✓ Paket dibuat:', pkg.title);
    } else {
      await db.update(examPackages).set(pkgValues).where(eq(examPackages.id, pkg.id));
      console.log('✓ Paket diperbarui:', pkg.title);
    }

    // Tautkan butir soal ke paket
    await db.delete(packageQuestions).where(eq(packageQuestions.packageId, pkg.id));

    const packageQuestionRows = pkg.questionIds.map((qId, idx) => ({
      packageId: pkg.id,
      questionId: qId,
      orderIndex: idx,
    }));

    await db.insert(packageQuestions).values(packageQuestionRows);
    console.log(`  -> Ditautkan ${packageQuestionRows.length} butir soal ke paket ${pkg.id}`);
  }

  console.log('=== SEEDING PROFILING ASN SELESAI DENGAN SUKSES! ===');
}

// Jalankan jika dieksekusi secara mandiri via CLI
if (require.main === module) {
  seedProfilingASN()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Terjadi kesalahan saat seeding:', err);
      process.exit(1);
    });
}
