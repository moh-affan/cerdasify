import { db } from './index';
import { questionOptions, questions } from './schema';
import { eq } from 'drizzle-orm';

// Pemetaan kalibrasi bobot unik (1, 2, 3, 4, 5) untuk setiap opsi pada 45 soal SJT
// Berdasarkan analisis level kematangan kompetensi ASN (PermenPAN-RB No. 38/2017 & Core Values BerAKHLAK)
const calibratedSJTScores: Record<string, { A: number; B: number; C: number; D: number; E: number }> = {
  // === MANAJERIAL (q_prof_man_01 s.d. 25) ===
  q_prof_man_01: { A: 1, B: 2, C: 3, D: 5, E: 4 }, // D=5 (regulasi sah), E=4 (cek teknis), C=3 (menolak tanpa solusi), B=2 (lepas tanggung jawab), A=1 (kompromi fiktif)
  q_prof_man_02: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (tolak santun+edukasi), E=4 (tolak & lapor UPG/taruh di meja resmi), D=3 (marah depan publik), B=2 (masuk kotak amal), A=1 (terima)
  q_prof_man_03: { A: 2, B: 5, C: 3, D: 1, E: 4 }, // B=5 (dialog 4 mata+komitmen), E=4 (lapor pimpinan formal), C=3 (nota dinas sanksi), A=2 (kerjakan sendiri), D=1 (sindir grup)
  q_prof_man_04: { A: 2, B: 1, C: 3, D: 4, E: 5 }, // E=5 (sinergi kolaboratif), D=4 (tunda cari jalan keluar), C=3 (pilih seksi target besar), A=2 (potong 50:50), B=1 (diam abai)
  q_prof_man_05: { A: 1, B: 5, C: 2, D: 3, E: 4 }, // B=5 (proaktif mitigasi offline+IT), E=4 (layani manual tanpa kepastian), D=3 (satpam tertibkan), C=2 (salahkan vendor), A=1 (tutup loket usir warga)
  q_prof_man_06: { A: 2, B: 3, C: 5, D: 1, E: 4 }, // C=5 (streamlining+spesialisasi), E=4 (bantuan staf lintas bidang), B=3 (lembur tanpa ubah alur), A=2 (minta turunkan target), D=1 (loloskan tanpa cek)
  q_prof_man_07: { A: 1, B: 2, C: 3, D: 5, E: 4 }, // D=5 (modul+coaching sabar), E=4 (ingatkan formal), C=3 (bantu kerjakan sesekali), B=2 (usul mutasi), A=1 (biarkan honorer terus)
  q_prof_man_08: { A: 2, B: 5, C: 1, D: 3, E: 4 }, // B=5 (teladan+quick wins), E=4 (motivasi+pelatihan), A=2 (langsung potong TPP), D=3 (usul mutasi), C=1 (larut status quo)
  q_prof_man_09: { A: 5, B: 2, C: 1, D: 3, E: 4 }, // A=5 (henti zona bahaya+kajian ahli), E=4 (alihkan ke zona aman), D=3 (serahkan mandor), B=2 (tunggu seharian), C=1 (paksa cor abaikan nyawa)
  q_prof_man_10: { A: 1, B: 3, C: 2, D: 4, E: 5 }, // E=5 (telaah data stunting+kemasan komunikasi), D=4 (bagi rata anggaran), B=3 (bela B tanpa alternatif), C=2 (diam cari aman), A=1 (pilih A demi politisi)
  q_prof_man_11: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (tegur pribadi lalu lapor), E=4 (tolak ikut serta tapi diam), D=3 (foto viralkan), B=2 (abaikan urusan masing2), A=1 (ikut titip absen)
  q_prof_man_12: { A: 1, B: 2, C: 3, D: 5, E: 4 }, // D=5 (diskusi santai+fasilitasi panggung), E=4 (minta pimpinan tunjuk), C=3 (paksa mendadak), B=2 (biarkan bersaing), A=1 (klaim ide orang lain)
  q_prof_man_13: { A: 5, B: 1, C: 2, D: 3, E: 4 }, // A=5 (layani tuntas walau lewat jam), E=4 (pandu aplikasi online), D=3 (terima tumpuk besok), C=2 (marah wajah masam), B=1 (tutup tirai usir lansia)
  q_prof_man_14: { A: 1, B: 3, C: 5, D: 2, E: 4 }, // C=5 (manajemen waktu+tingkatkan kapasitas), E=4 (dorong rekan muda), B=3 (ikut jika ada promosi), D=2 (limpahkan tugas dinas), A=1 (tolak karena rugi libur)
  q_prof_man_15: { A: 1, B: 5, C: 2, D: 3, E: 4 }, // B=5 (spesifikasi fungsi/SNI non-kunci merek), E=4 (konsultasi ahli PBJ alternatif), C=2 (setuju demi mutu), D=3 (lepas tangan), A=1 (setuju jika diskon)
  q_prof_man_16: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (lapor via WBS/APIP bukti valid), E=4 (klarifikasi langsung ke atasan/pejabat pengawas), D=3 (diam amankan diri), B=2 (viralkan sosmed), A=1 (peras atasan)
  q_prof_man_17: { A: 1, B: 2, C: 3, D: 5, E: 4 }, // D=5 (feedback 4 mata+checklist), E=4 (lapor supervisor untuk pelatihan), C=3 (kerjakan ulang sendiri), B=2 (biarkan sampai kena tegur), A=1 (kucilkan rekan)
  q_prof_man_18: { A: 2, B: 5, C: 3, D: 4, E: 1 }, // B=5 (draf standar maklumat pelayanan), D=4 (usulkan saran kotak keluhan resmi), C=3 (jawab pasif jika ditanya), A=2 (tunggu perintah), E=1 (tempel sembarangan)
  q_prof_man_19: { A: 5, B: 2, C: 1, D: 3, E: 4 }, // A=5 (terima positif+belajar proaktif), E=4 (terima sambil minta supervisi pendamping), D=3 (sewa jasa luar), B=2 (tolak alasan ijazah), C=1 (kerjakan alakadarnya)
  q_prof_man_20: { A: 1, B: 3, C: 1, D: 5, E: 4 }, // D=5 (portal beban+rute alternatif+PU), E=4 (musyawarah cari solusi angkut ringan), B=3 (tutup total tanpa rute), A=2 (surat pernyataan sopir), C=1 (tunggu runtuh)
  q_prof_man_21: { A: 1, B: 5, C: 1, D: 3, E: 4 }, // B=5 (tolak santun+tegaskan meritokrasi), E=4 (arahkan lengkapi berkas resmi jika waktu ada), D=3 (serahkan panitia lain), A=1 (manipulasi berkas palsu), C=2 (minta uang pelicin)
  q_prof_man_22: { A: 2, B: 1, C: 5, D: 3, E: 4 }, // C=5 (matriks RACI peran kolaboratif), E=4 (fasilitasi pimpinan bagi target), A=2 (serahkan pejabat senior), D=3 (undian acak), B=1 (batalkan proyek)
  q_prof_man_23: { A: 5, B: 1, C: 1, D: 3, E: 4 }, // A=5 (lapor riil at cost+setor kas), E=4 (konsultasi ke auditor/inspektorat), D=3 (simpan brankas kegiatan lain), C=2 (beli oleh-oleh), B=1 (rekayasa kuitansi 100%)
  q_prof_man_24: { A: 1, B: 5, C: 2, D: 3, E: 4 }, // B=5 (sambut efisiensi+upskilling staf), E=4 (pelajari batasan etika AI kedinasan), C=2 (serahkan 100% tanpa validasi), D=3 (provokasi tolak sistem), A=1 (tolak total pertahankan manual)
  q_prof_man_25: { A: 2, B: 1, C: 3, D: 4, E: 5 }, // E=5 (mediasi terpisah+temu+tegaskan profesionalisme), D=4 (pisahkan tim sementara sambil pantau), C=3 (dampingi presentasi), A=2 (pecat sepihak), B=1 (biarkan saling jatuhkan)

  // === SOSIAL KULTURAL & BERAKHLAK (q_prof_soc_01 s.d. 20) ===
  q_prof_soc_01: { A: 2, B: 1, C: 3, D: 5, E: 4 }, // D=5 (hormati adat+silaturahmi tokoh), E=4 (ikuti tradisi positif sewajarnya), C=3 (minta mutasi), A=2 (hanya gaul pendatang), B=1 (kritik adat warga)
  q_prof_soc_02: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (tegaskan layanan adil non-diskriminatif), E=4 (mediasi dengan kepala loket), D=3 (biarkan antre), B=2 (turuti ganti petugas), A=1 (marahi usir warga)
  q_prof_soc_03: { A: 2, B: 5, C: 1, D: 3, E: 4 }, // B=5 (active listening+solusi cepat+evaluasi alur), E=4 (arahkan ke meja pengaduan khusus), D=3 (abaikan proses biasa), A=2 (defensif bela birokrasi), C=1 (suruh baca perbup)
  q_prof_soc_04: { A: 1, B: 2, C: 1, D: 5, E: 4 }, // D=5 (tolak santun tegaskan aturan BMN & kerahasiaan), E=4 (sediakan perangkat pribadi lain), B=2 (pinjamkan batasi kuota), A=1 (pinjamkan bebas game), C=1 (jual ganti bekas)
  q_prof_soc_05: { A: 5, B: 1, C: 2, D: 1, E: 4 }, // A=5 (daftar sungguh-sungguh tingkatkan kapasitas), E=4 (pelajari kurikulum sebelum daftar), C=2 (ikut jika ada uang saku), B=1 (pasif agar bebas beban), D=1 (cari bocoran kunci)
  q_prof_soc_06: { A: 1, B: 1, C: 5, D: 2, E: 4 }, // C=5 (tulus+tukar jadwal piket layanan prima), E=4 (ucapkan selamat hari raya), D=2 (acuh tak acuh), A=1 (tolak ganti piket), B=1 (tuntut pangkas cuti)
  q_prof_soc_07: { A: 1, B: 1, C: 2, D: 3, E: 5 }, // E=5 (tolak bijak+jaga nama baik & loyalitas), D=3 (ingatkan teman secara santun), C=2 (setuju kebebasan liar), B=1 (tulis komentar pedas), A=1 (petisi akun anonim)
  q_prof_soc_08: { A: 1, B: 5, C: 1, D: 2, E: 4 }, // B=5 (alihkan video conf+kolaborasi daring efisien), E=4 (seleksi agenda paling urgen), D=2 (patungan uang pribadi), C=1 (pinjam swasta), A=1 (batalkan total komunikasi mandek)
  q_prof_soc_09: { A: 2, B: 1, C: 1, D: 5, E: 4 }, // D=5 (forum terpadu single data konvergen), E=4 (usulkan rapat pimpinan bersama), A=2 (jalan sendiri-sendiri), C=1 (kritik saat paripurna), B=1 (klaim anggaran dinas lain)
  q_prof_soc_10: { A: 5, B: 1, C: 1, D: 3, E: 4 }, // A=5 (ingatkan santun persatuan cegah SARA), E=4 (lapor admin grup untuk take down), D=3 (diam membaca), B=1 (timpali lelucon), C=1 (forward grup lain)
  q_prof_soc_11: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (ajak duduk setara beri ruang aspirasi), E=4 (catat aspirasi tertulis pasca rapat), B=2 (bicara setelah acara tutup), A=1 (biarkan diskriminasi), D=3 (hentikan acara sepihak)
  q_prof_soc_12: { A: 1, B: 1, C: 3, D: 5, E: 4 }, // D=5 (senyum ramah+media tulis/teks sabar tuntas), E=4 (arahkan ke loket prioritas inklusif), C=3 (minta warga antrean bantu), A=1 (usir suruh bawa penerjemah), B=1 (teriak suara keras)
  q_prof_soc_13: { A: 1, B: 5, C: 1, D: 3, E: 4 }, // B=5 (koreksi volume riil walau pencairan tunda), E=4 (laporkan PPK buat adendum tepat), D=3 (tuntut konsultan ganti rugi), A=1 (diamkan selisih 15jt), C=1 (pakai makan-makan)
  q_prof_soc_14: { A: 5, B: 1, C: 1, D: 3, E: 4 }, // A=5 (transfer pengetahuan mentoring terstruktur), E=4 (bagikan referensi belajar mandiri terbimbing), D=3 (beri modul asing rumit), C=1 (minta bayar kursus pribadi), B=1 (tolak takut tersaingi)
  q_prof_soc_15: { A: 2, B: 1, C: 1, D: 5, E: 4 }, // D=5 (hentikan rumor+jaga privasi+dukung moral), E=4 (ingatkan batasan profesional kantor), A=2 (ikut dengar rumor), C=1 (jauhi rekan kena musibah), B=1 (lapor pimpinan minta dimutasi)
  q_prof_soc_16: { A: 5, B: 1, C: 1, D: 3, E: 4 }, // A=5 (batalkan rekreasi sigap ke posko darurat), E=4 (bantu koordinasi posko logistik dari jarak jauh), D=3 (hanya transfer uang), E_alt: 2 (tanya uang lembur), B=1 (matikan hp pura-pura tidur), C=1 (alasan sakit palsu)
  q_prof_soc_17: { A: 1, B: 1, C: 5, D: 3, E: 4 }, // C=5 (pelajari proaktif poin regulasi+adaptasi laporan), E=4 (koordinasi bagian keuangan samakan persepsi), D=3 (tunggu dinas tetangga tiru), B=1 (mengeluh salahkan kementerian), A=1 (tetap format lama tunggu BPK)
  q_prof_soc_18: { A: 1, B: 5, C: 2, D: 3, E: 4 }, // B=5 (kerjasama PKS resmi transparan saling dukung), E=4 (konsultasi pimpinan batasan keterlibatan swasta), D=3 (serahkan swasta dinas tinggal seremoni), C=2 (ambil uang tolak rapat), A=1 (tolak mentah-mentah pameran batal)
  q_prof_soc_19: { A: 5, B: 1, C: 1, D: 2, E: 4 }, // A=5 (pendekatan kultural tetua adat sepakati metode), E=4 (laporkan pimpinan cari solusi regulasi afirmatif), D=2 (coret hak warga), E_alt: 3 (tinggalkan lapor anarkis), B=1 (paksa aparat bersenjata), C=1 (isi fiktif)
  q_prof_soc_20: { A: 1, B: 2, C: 5, D: 3, E: 4 }, // C=5 (antusias teladan bhinneka tunggal ika), E=4 (ajak rekan ikut dengan pendekatan santai), D=3 (hadir tapi tolak foto), B=2 (tuntut hanya baju suku sendiri), A=1 (boikot pakai seragam biasa)
};

// Khusus penyesuaian detail opsi agar memiliki gradasi unik 1,2,3,4,5
const adjustments: Record<string, Record<'A' | 'B' | 'C' | 'D' | 'E', number>> = {
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

async function main() {
  console.log('=== MEMULAI KALIBRASI PRESISI BOBOT 1-5 SJT CAT PROFILING ASN ===');

  let updatedCount = 0;
  for (const [qId, scoreMap] of Object.entries(adjustments)) {
    for (const [lbl, score] of Object.entries(scoreMap)) {
      const isBest = score === 5;
      await db
        .update(questionOptions)
        .set({
          scoreValue: score,
          isCorrect: isBest,
        })
        .where(
          eq(questionOptions.id, `opt_${qId}_${lbl.toLowerCase()}`)
        );
      updatedCount++;
    }
  }

  console.log(`✓ Berhasil mengkalibrasi ${Object.keys(adjustments).length} soal SJT (${updatedCount} opsi jawaban).`);

  // Verifikasi Ulang
  let allPerfect = true;
  for (const qId of Object.keys(adjustments)) {
    const opts = await db.select().from(questionOptions).where(eq(questionOptions.questionId, qId));
    const scores = opts.map((o) => o.scoreValue).sort((a, b) => a - b);
    const is1to5 = [1, 2, 3, 4, 5].every((val, idx) => scores[idx] === val);
    if (!is1to5) {
      console.error(`[ERROR] ${qId} belum terkalibrasi sempurna:`, scores);
      allPerfect = false;
    }
  }

  if (allPerfect) {
    console.log('★ SELURUH 45 SOAL SJT RESMI TERVERIFIKASI MEMILIKI BOBOT UNIK [1, 2, 3, 4, 5]!');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
