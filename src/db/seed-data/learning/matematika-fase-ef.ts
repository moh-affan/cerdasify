// Materi Matematika — Fase E–F & Lanjut (SMA, UTBK/SNBT, TIU CPNS): rumus, teori, dan trik cepat.
// Isi materi ditulis dalam Markdown + KaTeX (dirender MathRenderer); kuis & catatan berupa teks biasa.
// Di dalam rumus KaTeX pakai ^\circ, bukan simbol °, karena ° di luar rumus otomatis dikonversi.

import type { SeedLesson } from './types';

/** Template String.raw → baris Markdown tanpa indentasi. Hindari `${` di dalam teks. */
const md = (s: string) =>
  s
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();

export const matematikaFaseEF: SeedLesson[] = [
  {
    slug: 'mtk-persamaan-fungsi-kuadrat',
    theme: 'Matematika: Aljabar Lanjut',
    emoji: '🎯',
    title: 'Persamaan dan Fungsi Kuadrat',
    titleId: 'Rumus ABC, diskriminan, Vieta, dan titik puncak',
    minutes: 10,
    intro: md(String.raw`
      Bentuk umum: $ax^2 + bx + c = 0$ dengan $a \neq 0$.

      **Rumus ABC**
      $$x_{1,2} = \frac{-b \pm \sqrt{D}}{2a}, \qquad D = b^2 - 4ac$$

      **Teori diskriminan**
      • $D > 0$ → dua akar real berbeda
      • $D = 0$ → dua akar kembar
      • $D < 0$ → tidak punya akar real (imajiner)

      **Rumus Vieta** (jumlah & hasil kali akar, tanpa mencari akarnya)
      $$x_1 + x_2 = -\frac{b}{a} \qquad x_1 x_2 = \frac{c}{a} \qquad |x_1 - x_2| = \frac{\sqrt{D}}{|a|}$$
      $$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2$$

      **Menyusun persamaan kuadrat baru** dari akar $\alpha$ dan $\beta$:
      $$x^2 - (\alpha + \beta)x + \alpha\beta = 0$$
      **Trik substitusi invers**: akar-akar baru $x_1 + 1$ dan $x_2 + 1$ dari $x^2 - 5x + 6 = 0$ → ganti $x$ dengan $(x - 1)$:
      $$(x - 1)^2 - 5(x - 1) + 6 = 0 \Rightarrow x^2 - 7x + 12 = 0$$

      **Fungsi kuadrat** $f(x) = ax^2 + bx + c$
      • $a > 0$ → parabola terbuka ke atas (punya nilai minimum)
      • $a < 0$ → terbuka ke bawah (punya nilai maksimum)
      $$\text{Titik puncak: } \left(-\frac{b}{2a},\ -\frac{D}{4a}\right)$$
      Contoh: $f(x) = x^2 - 4x + 1$ → $x_p = 2$, $y_p = -\frac{16 - 4}{4} = -3$.

      > Definit positif ($f(x) > 0$ untuk semua $x$): $a > 0$ dan $D < 0$.
    `),
    quiz: [
      ['Jumlah akar-akar x² − 7x + 10 = 0 adalah …', ['−7', '7', '10'], 1, 'x₁ + x₂ = −b/a = 7.'],
      ['Hasil kali akar-akar 2x² + 3x − 5 = 0 adalah …', ['−5/2', '5/2', '−3/2'], 0, 'x₁x₂ = c/a = −5/2.'],
      ['x² + 4x + k = 0 memiliki akar kembar. Nilai k = …', ['2', '4', '16'], 1, 'D = 16 − 4k = 0 → k = 4.'],
      ['Nilai minimum f(x) = x² − 6x + 5 adalah …', ['5', '−4', '3'], 1, 'xₚ = 3, f(3) = 9 − 18 + 5 = −4.'],
      ['Jika x₁ dan x₂ akar-akar x² − 3x − 4 = 0, maka x₁² + x₂² = …', ['17', '1', '9'], 0, '(x₁ + x₂)² − 2x₁x₂ = 9 − 2(−4) = 17.'],
    ],
  },
  {
    slug: 'mtk-eksponen-logaritma',
    theme: 'Matematika: Aljabar Lanjut',
    emoji: '🪵',
    title: 'Logaritma dan Persamaan Eksponen',
    titleId: 'Sifat-sifat logaritma dan trik menyamakan basis',
    minutes: 10,
    intro: md(String.raw`
      **Definisi**: logaritma adalah kebalikan dari perpangkatan.
      $$ {}^{a}\log b = c \iff a^c = b \qquad (a > 0,\ a \neq 1,\ b > 0)$$
      Contoh: $ {}^{2}\log 8 = 3$ karena $2^3 = 8$. Jika basis tidak ditulis, basisnya 10.

      **Sifat-sifat logaritma**
      $$ {}^{a}\log (bc) = {}^{a}\log b + {}^{a}\log c \qquad {}^{a}\log \frac{b}{c} = {}^{a}\log b - {}^{a}\log c$$
      $$ {}^{a}\log b^n = n \cdot {}^{a}\log b \qquad {}^{a^m}\log b^n = \frac{n}{m} \cdot {}^{a}\log b$$
      $$ {}^{a}\log b = \frac{\log b}{\log a} \qquad {}^{a}\log b \cdot {}^{b}\log c = {}^{a}\log c \qquad a^{{}^{a}\log b} = b$$

      **Contoh**
      • $ {}^{3}\log 54 - {}^{3}\log 2 = {}^{3}\log 27 = 3$
      • $ {}^{4}\log 8 = {}^{2^2}\log 2^3 = \frac{3}{2}$
      • $\log 25 + \log 4 = \log 100 = 2$

      **Persamaan eksponen**: samakan basisnya, lalu samakan pangkatnya.
      $$2^{x+1} = 32 = 2^5 \Rightarrow x + 1 = 5 \Rightarrow x = 4$$
      Jika basis tidak bisa disamakan, ambil logaritma kedua ruas: $3^x = 7 \Rightarrow x = {}^{3}\log 7$.

      > Trik rantai: pada perkalian logaritma, coret basis dan numerus yang "bersambung" — $ {}^{2}\log 3 \cdot {}^{3}\log 5 \cdot {}^{5}\log 16 = {}^{2}\log 16 = 4$.
    `),
    notes: [
      {
        title: 'Nilai Logaritma Penting',
        explanation: 'Hafalan ini sering dipakai untuk estimasi di soal UTBK.',
        examples: ['log 2 ≈ 0,301', 'log 3 ≈ 0,477', 'log 5 = 1 − log 2 ≈ 0,699', 'ᵃlog 1 = 0 dan ᵃlog a = 1'],
      },
    ],
    quiz: [
      ['²log 32 = …', ['4', '5', '16'], 1, '2⁵ = 32, jadi ²log 32 = 5.'],
      ['log 25 + log 4 = …', ['2', '29', '100'], 0, 'log (25 × 4) = log 100 = 2.'],
      ['³log 5 × ⁵log 81 = …', ['4', '3', '27'], 0, 'Sifat rantai: ³log 81 = 4.'],
      ['⁸log 4 = …', ['1/2', '2/3', '3/2'], 1, '⁸log 4 = (2³)log 2² = 2/3.'],
      ['Jika 3^(2x − 1) = 27, maka x = …', ['1', '2', '3'], 1, '27 = 3³ → 2x − 1 = 3 → x = 2.'],
    ],
  },
  {
    slug: 'mtk-trigonometri-dasar',
    theme: 'Matematika: Trigonometri',
    emoji: '📐',
    title: 'Trigonometri: Perbandingan, Sudut Istimewa, dan Kuadran',
    titleId: 'Sin, cos, tan dan jembatan keledainya',
    minutes: 10,
    intro: md(String.raw`
      **Perbandingan trigonometri** pada segitiga siku-siku (sudut $\theta$):
      $$\sin\theta = \frac{\text{depan}}{\text{miring}} \qquad \cos\theta = \frac{\text{samping}}{\text{miring}} \qquad \tan\theta = \frac{\text{depan}}{\text{samping}}$$
      Jembatan keledai: **SinDeMi, CosSaMi, TanDeSa**.

      **Sudut istimewa**
      $$\begin{array}{c|ccccc} \theta & 0^\circ & 30^\circ & 45^\circ & 60^\circ & 90^\circ \\ \hline \sin & 0 & \frac{1}{2} & \frac{1}{2}\sqrt{2} & \frac{1}{2}\sqrt{3} & 1 \\ \cos & 1 & \frac{1}{2}\sqrt{3} & \frac{1}{2}\sqrt{2} & \frac{1}{2} & 0 \\ \tan & 0 & \frac{1}{3}\sqrt{3} & 1 & \sqrt{3} & - \end{array}$$
      **Trik menghafal**: nilai sin untuk $0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$ adalah $\frac{\sqrt{0}}{2}, \frac{\sqrt{1}}{2}, \frac{\sqrt{2}}{2}, \frac{\sqrt{3}}{2}, \frac{\sqrt{4}}{2}$. Nilai cos adalah urutan **terbalik**-nya.

      **Tanda di setiap kuadran** — "**Semua Sindikat Tangannya Kosong**"
      • Kuadran I ($0^\circ$–$90^\circ$): **semua** positif
      • Kuadran II ($90^\circ$–$180^\circ$): hanya **sin** positif
      • Kuadran III ($180^\circ$–$270^\circ$): hanya **tan** positif
      • Kuadran IV ($270^\circ$–$360^\circ$): hanya **cos** positif

      **Sudut berelasi**
      $$\sin(180^\circ - \alpha) = \sin\alpha \qquad \cos(180^\circ - \alpha) = -\cos\alpha \qquad \sin(90^\circ - \alpha) = \cos\alpha$$
      Contoh: $\sin 150^\circ = \sin 30^\circ = \frac{1}{2}$, $\cos 120^\circ = -\frac{1}{2}$, $\tan 225^\circ = \tan 45^\circ = 1$.

      **Identitas dasar**
      $$\sin^2\theta + \cos^2\theta = 1 \qquad \tan\theta = \frac{\sin\theta}{\cos\theta} \qquad 1 + \tan^2\theta = \sec^2\theta$$
    `),
    quiz: [
      ['sin 30° + cos 60° = …', ['1/2', '1', '√3'], 1, '½ + ½ = 1.'],
      ['cos 150° = …', ['½√3', '−½√3', '−½'], 1, 'Kuadran II, cos negatif: cos 150° = −cos 30° = −½√3.'],
      ['tan 135° = …', ['1', '−1', '√3'], 1, 'Kuadran II, tan negatif: tan 135° = −tan 45° = −1.'],
      ['Jika sin A = 3/5 dan A lancip, maka cos A = …', ['4/5', '3/4', '5/4'], 0, 'Tripel 3, 4, 5: cos A = samping/miring = 4/5.'],
      ['Di kuadran III, perbandingan trigonometri yang bernilai positif adalah …', ['sin', 'cos', 'tan'], 2, 'Semua–Sin–Tan–Cos: kuadran III hanya tan yang positif.'],
    ],
  },
  {
    slug: 'mtk-aturan-sinus-kosinus',
    theme: 'Matematika: Trigonometri',
    emoji: '🔺',
    title: 'Aturan Sinus, Aturan Kosinus, dan Rumus Sudut Rangkap',
    titleId: 'Segitiga sembarang dan identitas trigonometri',
    minutes: 10,
    intro: md(String.raw`
      Pada segitiga $ABC$ dengan sisi $a$ di depan sudut $A$, $b$ di depan $B$, $c$ di depan $C$:

      **Aturan sinus** (dipakai jika diketahui 2 sudut + 1 sisi)
      $$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$$
      ($R$ = jari-jari lingkaran luar segitiga)

      **Aturan kosinus** (dipakai jika diketahui 2 sisi + sudut apitnya, atau 3 sisi)
      $$a^2 = b^2 + c^2 - 2bc\cos A$$
      Contoh: $b = 5$, $c = 8$, $A = 60^\circ$ → $a^2 = 25 + 64 - 2(5)(8)(\tfrac{1}{2}) = 49$, jadi $a = 7$.

      **Luas segitiga** (dua sisi dan sudut apitnya)
      $$L = \frac{1}{2}ab\sin C$$

      **Rumus jumlah & selisih sudut**
      $$\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B$$
      $$\cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$$
      Contoh: $\sin 75^\circ = \sin(45^\circ + 30^\circ) = \frac{\sqrt{6} + \sqrt{2}}{4}$

      **Rumus sudut rangkap**
      $$\sin 2A = 2\sin A\cos A$$
      $$\cos 2A = \cos^2 A - \sin^2 A = 1 - 2\sin^2 A = 2\cos^2 A - 1$$

      > Jika $A = 90^\circ$, aturan kosinus menjadi teorema Pythagoras karena $\cos 90^\circ = 0$.
    `),
    quiz: [
      ['Luas segitiga dengan dua sisi 6 cm dan 10 cm serta sudut apit 30° adalah …', ['30 cm²', '15 cm²', '60 cm²'], 1, 'L = ½ × 6 × 10 × sin 30° = ½ × 60 × ½ = 15 cm².'],
      ['Pada segitiga ABC, a = 10, A = 30°, B = 45°. Panjang b = …', ['10√2', '5√2', '20'], 0, 'b = a sin B / sin A = 10 × (½√2) / ½ = 10√2.'],
      ['Jika sin A = 0,6 dan A lancip, maka sin 2A = …', ['1,2', '0,96', '0,48'], 1, 'cos A = 0,8; sin 2A = 2 × 0,6 × 0,8 = 0,96.'],
      ['Jika sin A = 1/3, maka cos 2A = …', ['7/9', '2/3', '1/9'], 0, 'cos 2A = 1 − 2 sin²A = 1 − 2/9 = 7/9.'],
      ['Pada segitiga dengan b = 3, c = 5, dan A = 120°, panjang a = …', ['7', '√19', '8'], 0, 'a² = 9 + 25 − 2(3)(5)(−½) = 34 + 15 = 49 → a = 7.'],
    ],
  },
  {
    slug: 'mtk-limit-fungsi',
    theme: 'Matematika: Kalkulus',
    emoji: '♾️',
    title: 'Limit Fungsi',
    titleId: 'Bentuk 0/0, limit tak hingga, dan limit trigonometri',
    minutes: 10,
    intro: md(String.raw`
      **Langkah 1 — substitusi langsung.** Jika hasilnya bukan bentuk tak tentu, itulah jawabannya.

      **Bentuk $\frac{0}{0}$** → faktorkan, kalikan sekawan, atau pakai turunan (L'Hôpital).
      $$\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} (x + 2) = 4$$
      **Trik L'Hôpital**: $\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}$ jika bentuknya $\frac{0}{0}$ atau $\frac{\infty}{\infty}$.

      **Limit tak hingga fungsi rasional** — bandingkan pangkat tertinggi:
      • pangkat pembilang < penyebut → $0$
      • pangkat sama → perbandingan koefisien pangkat tertinggi
      • pangkat pembilang > penyebut → $\pm\infty$
      $$\lim_{x \to \infty} \frac{3x^2 + 2x}{5x^2 - 1} = \frac{3}{5}$$

      **Trik selisih akar**
      $$\lim_{x \to \infty} \left(\sqrt{ax^2 + bx + c} - \sqrt{ax^2 + qx + r}\right) = \frac{b - q}{2\sqrt{a}}$$
      Contoh: $\lim_{x \to \infty} (\sqrt{x^2 + 6x} - \sqrt{x^2 + 2x}) = \frac{6 - 2}{2} = 2$

      **Limit trigonometri**
      $$\lim_{x \to 0} \frac{\sin x}{x} = 1 \qquad \lim_{x \to 0} \frac{\sin ax}{bx} = \lim_{x \to 0} \frac{\tan ax}{bx} = \frac{a}{b}$$
      Contoh: $\lim_{x \to 0} \frac{\sin 3x}{2x} = \frac{3}{2}$

      > Pada limit trigonometri bentuk 0/0, $\sin$ dan $\tan$ "boleh dianggap" sama dengan sudutnya saat $x \to 0$.
    `),
    quiz: [
      ['lim (x→3) (x² − 9)/(x − 3) = …', ['0', '3', '6'], 2, '(x + 3)(x − 3)/(x − 3) = x + 3 → 6.'],
      ['lim (x→∞) (2x³ + 1)/(4x³ − x) = …', ['1/2', '0', '∞'], 0, 'Pangkat sama, perbandingan koefisien 2/4 = 1/2.'],
      ['lim (x→∞) (√(x² + 4x) − x) = …', ['4', '2', '0'], 1, 'x = √(x²), jadi (4 − 0)/(2√1) = 2.'],
      ['lim (x→0) tan 4x / sin 2x = …', ['1/2', '2', '4'], 1, '4/2 = 2.'],
      ['lim (x→1) (x² + x − 2)/(x − 1) = …', ['3', '2', '0'], 0, '(x + 2)(x − 1)/(x − 1) = x + 2 → 3.'],
    ],
  },
  {
    slug: 'mtk-turunan-fungsi',
    theme: 'Matematika: Kalkulus',
    emoji: '📉',
    title: 'Turunan Fungsi dan Aplikasinya',
    titleId: 'Rumus turunan, garis singgung, dan nilai maksimum',
    minutes: 10,
    intro: md(String.raw`
      **Rumus dasar turunan**
      $$f(x) = ax^n \Rightarrow f'(x) = anx^{n-1} \qquad f(x) = c \Rightarrow f'(x) = 0$$
      $$(\sin x)' = \cos x \qquad (\cos x)' = -\sin x$$

      **Aturan turunan**
      $$(u \pm v)' = u' \pm v' \qquad (uv)' = u'v + uv' \qquad \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$$
      **Aturan rantai**: $[f(g(x))]' = f'(g(x)) \cdot g'(x)$
      $$\frac{d}{dx}(2x + 1)^5 = 5(2x + 1)^4 \cdot 2 = 10(2x + 1)^4$$

      **Aplikasi turunan**
      • Gradien garis singgung di $x = a$: $m = f'(a)$
      • Fungsi naik jika $f'(x) > 0$, turun jika $f'(x) < 0$
      • Titik stasioner: $f'(x) = 0$. Jika $f''(x) < 0$ → maksimum, $f''(x) > 0$ → minimum

      **Contoh**: $f(x) = x^3 - 3x^2 + 2$
      $$f'(x) = 3x^2 - 6x = 3x(x - 2) = 0 \Rightarrow x = 0 \text{ atau } x = 2$$
      $f''(x) = 6x - 6$: di $x = 0$ bernilai $-6$ → **maksimum** $f(0) = 2$; di $x = 2$ bernilai $6$ → **minimum** $f(2) = -2$.

      > Trik optimasi: dari semua persegi panjang dengan keliling tetap, luas terbesar dicapai saat bentuknya **persegi**.
    `),
    quiz: [
      ['Jika f(x) = 4x³ − 2x + 7, maka f′(1) = …', ['10', '12', '9'], 0, "f'(x) = 12x² − 2, f'(1) = 10."],
      ['Turunan dari f(x) = (3x − 2)⁴ adalah …', ['4(3x − 2)³', '12(3x − 2)³', '3(3x − 2)⁴'], 1, 'Aturan rantai: 4(3x − 2)³ × 3 = 12(3x − 2)³.'],
      ['Gradien garis singgung kurva y = x² + 3x di x = 2 adalah …', ['7', '10', '5'], 0, "y' = 2x + 3 = 7."],
      ['Nilai maksimum lokal f(x) = x³ − 12x adalah …', ['16', '−16', '12'], 0, "f'(x) = 3x² − 12 = 0 → x = ±2. Maksimum di x = −2: −8 + 24 = 16."],
      ['Turunan dari sin 2x adalah …', ['cos 2x', '2 cos 2x', '−2 cos 2x'], 1, 'Aturan rantai: cos 2x × 2.'],
    ],
  },
  {
    slug: 'mtk-integral',
    theme: 'Matematika: Kalkulus',
    emoji: '∫',
    title: 'Integral dan Luas Daerah',
    titleId: 'Integral tak tentu, integral tentu, dan trik luas parabola',
    minutes: 10,
    intro: md(String.raw`
      Integral adalah **kebalikan dari turunan** (antiturunan).

      **Rumus dasar**
      $$\int ax^n\,dx = \frac{a}{n + 1}x^{n+1} + C \quad (n \neq -1)$$
      $$\int \sin x\,dx = -\cos x + C \qquad \int \cos x\,dx = \sin x + C$$
      Contoh: $\int (6x^2 - 4x + 3)\,dx = 2x^3 - 2x^2 + 3x + C$

      **Integral tentu** (Teorema Dasar Kalkulus)
      $$\int_a^b f(x)\,dx = F(b) - F(a)$$
      Contoh: $\int_1^3 2x\,dx = \left[x^2\right]_1^3 = 9 - 1 = 8$

      **Luas daerah antara dua kurva**
      $$L = \int_a^b \big(f_{\text{atas}}(x) - f_{\text{bawah}}(x)\big)\,dx$$

      **Trik kilat luas parabola dan garis**
      Samakan kedua kurva menjadi $ax^2 + bx + c = 0$, hitung $D = b^2 - 4ac$, lalu
      $$L = \frac{D\sqrt{D}}{6a^2}$$
      Contoh: $y = x^2$ dan $y = 2x$ → $x^2 - 2x = 0$, $D = 4$ → $L = \frac{4 \cdot 2}{6} = \frac{4}{3}$.
      Cek: $\int_0^2 (2x - x^2)\,dx = 4 - \frac{8}{3} = \frac{4}{3}$ ✓

      > Jangan lupa $+\,C$ pada integral tak tentu, dan luas daerah selalu bernilai positif.
    `),
    quiz: [
      ['∫(3x² + 2x) dx = …', ['6x + 2 + C', 'x³ + x² + C', '3x³ + 2x² + C'], 1, '3x³/3 + 2x²/2 = x³ + x² + C.'],
      ['∫₀² 3x² dx = …', ['8', '12', '6'], 0, '[x³] dari 0 sampai 2 = 8.'],
      ['∫₁² (2x + 1) dx = …', ['4', '6', '5'], 0, '[x² + x] dari 1 sampai 2 = 6 − 2 = 4.'],
      ['Luas daerah antara y = x² dan y = 4 adalah …', ['32/3', '16/3', '8'], 0, 'x² − 4 = 0, D = 16 → L = 16 × 4 / 6 = 32/3.'],
      ['∫cos x dx = …', ['−sin x + C', 'sin x + C', '−cos x + C'], 1, 'Turunan sin x adalah cos x.'],
    ],
  },
  {
    slug: 'mtk-kombinatorik-peluang',
    theme: 'Matematika: Kombinatorik & Peluang',
    emoji: '🃏',
    title: 'Permutasi, Kombinasi, dan Peluang Majemuk',
    titleId: 'Kapan urutan penting dan kapan tidak',
    minutes: 10,
    intro: md(String.raw`
      **Faktorial**: $n! = n \times (n - 1) \times \dots \times 1$, dengan $0! = 1$.

      **Permutasi** — urutan **penting** (ketua–wakil–sekretaris, susunan angka, antrean):
      $$P(n, r) = \frac{n!}{(n - r)!}$$
      Memilih ketua, wakil, sekretaris dari 5 orang: $P(5, 3) = 5 \times 4 \times 3 = 60$.

      **Kombinasi** — urutan **tidak penting** (tim, panitia, mengambil bola):
      $$C(n, r) = \frac{n!}{r!\,(n - r)!}$$
      Memilih 3 anggota tim dari 5 orang: $C(5, 3) = 10$.

      **Permutasi khusus**
      • Ada unsur sama: $\frac{n!}{k_1!\,k_2!\cdots}$ → kata MATEMATIKA (M², A³, T²): $\frac{10!}{2!\,3!\,2!} = 151.200$
      • Siklis (melingkar): $(n - 1)!$ → 6 orang duduk melingkar: $5! = 120$

      **Peluang kejadian majemuk**
      $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
      • Saling lepas: $P(A \cup B) = P(A) + P(B)$
      • Saling bebas: $P(A \cap B) = P(A) \times P(B)$

      **Trik cepat**
      • Banyak jabat tangan $n$ orang = $C(n, 2) = \frac{n(n - 1)}{2}$
      • $C(n, r) = C(n, n - r)$ → $C(20, 18) = C(20, 2) = 190$
      • Banyak diagonal segi-$n$ = $\frac{n(n - 3)}{2}$
    `),
    notes: [
      {
        title: 'Pertanyaan Kunci',
        pattern: 'Jika AB ≠ BA → permutasi · Jika AB = BA → kombinasi',
        explanation: 'Tukar posisi dua pilihan. Jika hasilnya dianggap berbeda, urutan penting (permutasi). Jika dianggap sama, pakai kombinasi.',
        examples: ['Ketua A, wakil B ≠ ketua B, wakil A → permutasi', 'Tim {A, B} = tim {B, A} → kombinasi'],
      },
    ],
    quiz: [
      ['Dalam pertemuan 10 orang, setiap orang berjabat tangan satu kali dengan yang lain. Banyak jabat tangan …', ['90', '45', '100'], 1, 'C(10, 2) = 10 × 9 / 2 = 45.'],
      ['Banyak susunan huruf dari kata KAKAK adalah …', ['10', '20', '120'], 0, '5! / (3! × 2!) = 120 / 12 = 10.'],
      ['Dari kotak berisi 5 bola merah dan 3 putih diambil 2 bola sekaligus. Peluang keduanya merah …', ['5/14', '5/8', '25/64'], 0, 'C(5, 2) / C(8, 2) = 10/28 = 5/14.'],
      ['7 orang duduk mengelilingi meja bundar. Banyak susunan duduk …', ['5.040', '720', '120'], 1, '(7 − 1)! = 6! = 720.'],
      ['Banyak bilangan 4 angka berbeda yang disusun dari angka 1–6 adalah …', ['360', '1.296', '15'], 0, 'P(6, 4) = 6 × 5 × 4 × 3 = 360.'],
    ],
  },
  {
    slug: 'mtk-matriks',
    theme: 'Matematika: Aljabar Lanjut',
    emoji: '🔲',
    title: 'Matriks: Determinan dan Invers',
    titleId: 'Ordo 2×2, sifat determinan, dan persamaan matriks',
    minutes: 9,
    intro: md(String.raw`
      **Determinan matriks ordo 2×2**
      $$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \Rightarrow \det A = ad - bc$$

      **Invers matriks** (ada jika $\det A \neq 0$)
      $$A^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$
      Trik: **tukar** elemen diagonal utama, **negatifkan** elemen diagonal samping, lalu bagi dengan determinan.
      Contoh: $\begin{pmatrix} 3 & 1 \\ 5 & 2 \end{pmatrix}^{-1} = \frac{1}{1}\begin{pmatrix} 2 & -1 \\ -5 & 3 \end{pmatrix}$

      **Perkalian matriks**: baris × kolom.
      $$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 5 \\ 6 \end{pmatrix} = \begin{pmatrix} 1 \cdot 5 + 2 \cdot 6 \\ 3 \cdot 5 + 4 \cdot 6 \end{pmatrix} = \begin{pmatrix} 17 \\ 39 \end{pmatrix}$$

      **Sifat determinan** ($A$ ordo $n \times n$)
      $$\det(AB) = \det A \cdot \det B \qquad \det(kA) = k^n \det A$$
      $$\det(A^{-1}) = \frac{1}{\det A} \qquad \det(A^T) = \det A$$

      **Persamaan matriks**
      $$AX = B \Rightarrow X = A^{-1}B \qquad XA = B \Rightarrow X = BA^{-1}$$

      > Matriks dengan determinan 0 disebut **singular** dan tidak memiliki invers. Perkalian matriks umumnya tidak komutatif: $AB \neq BA$.
    `),
    quiz: [
      ['Determinan matriks (4 3 / 2 5) adalah …', ['14', '26', '−14'], 0, '4 × 5 − 3 × 2 = 20 − 6 = 14.'],
      ['Matriks A berordo 2×2 dengan det A = 3. Nilai det(2A) = …', ['6', '12', '9'], 1, 'det(kA) = k² det A = 4 × 3 = 12.'],
      ['Matriks (2 x / 4 6) singular jika x = …', ['3', '12', '2'], 0, '12 − 4x = 0 → x = 3.'],
      ['Jika det A = 2 dan det B = 5, maka det(AB) = …', ['7', '10', '2,5'], 1, 'det(AB) = det A × det B = 10.'],
      ['Invers dari matriks (2 1 / 1 1) adalah …', ['(1 −1 / −1 2)', '(1 1 / 1 2)', '(2 −1 / −1 1)'], 0, 'det = 1, tukar diagonal utama dan negatifkan diagonal samping.'],
    ],
  },
  {
    slug: 'mtk-trik-cepat-utbk-tiu',
    theme: 'Matematika: Trik Berhitung',
    emoji: '🏎️',
    title: 'Trik Hitung Cepat UTBK dan TIU CPNS',
    titleId: 'Perkalian kilat, persen berantai, deret angka, angka satuan',
    minutes: 10,
    phaseMin: 'D',
    intro: md(String.raw`
      **1. Perkalian dekat 100**
      $97 \times 96$: kekurangan dari 100 adalah 3 dan 4.
      • Dua angka depan: $97 - 4 = 93$ (atau $96 - 3$)
      • Dua angka belakang: $3 \times 4 = 12$
      • Hasil: **9.312**

      **2. Puluhan sama, satuan berjumlah 10**
      $43 \times 47$: $4 \times 5 = 20$ dan $3 \times 7 = 21$ → **2.021**

      **3. Persen berantai** — kalikan faktornya, jangan dijumlahkan!
      • Naik 20% lalu turun 20%: $1{,}2 \times 0{,}8 = 0{,}96$ → **turun 4%**
      • Diskon 20% + 10%: $0{,}8 \times 0{,}9 = 0{,}72$ → total diskon **28%**, bukan 30%

      **4. Membandingkan pecahan** — kali silang:
      $\frac{5}{8}$ vs $\frac{7}{11}$ → $5 \times 11 = 55$ vs $8 \times 7 = 56$ → $\frac{7}{11}$ lebih besar.

      **5. Deret angka TIU** — cek berurutan:
      • Selisih tetap atau bertingkat: $2, 5, 10, 17, 26, \dots$ (selisih 3, 5, 7, 9) → **37**
      • Rasio: $3, 6, 12, 24, \dots$ → **48**
      • Loncat (dua barisan selang-seling): $1, 10, 3, 20, 5, 30, \dots$ → **7**
      • Fibonacci (jumlah dua suku sebelumnya): $1, 1, 2, 3, 5, 8, \dots$ → **13**

      **6. Angka satuan bilangan berpangkat** — cari siklusnya:
      Satuan $7^n$: $7, 9, 3, 1, 7, 9, \dots$ (siklus 4). $2026 : 4$ bersisa 2 → satuan $7^{2026}$ adalah **9**.

      **7. Estimasi** — bulatkan dulu, lalu pilih opsi terdekat:
      $49{,}8\% \times 401 \approx \frac{1}{2} \times 400 = 200$

      > Di ujian, lihat opsi jawaban dulu. Sering kali angka satuan atau estimasi sudah cukup untuk memilih jawaban tanpa menghitung lengkap.
    `),
    quiz: [
      ['98 × 97 = …', ['9.506', '9.406', '9.516'], 0, '98 − 3 = 95, 2 × 3 = 06 → 9.506.'],
      ['62 × 68 = …', ['4.216', '4.116', '3.616'], 0, '6 × 7 = 42, 2 × 8 = 16 → 4.216.'],
      ['Harga barang naik 10% lalu turun 10%. Dibanding harga awal, harganya …', ['Tetap', 'Turun 1%', 'Naik 1%'], 1, '1,1 × 0,9 = 0,99 → turun 1%.'],
      ['Angka satuan dari 3¹⁰⁰ adalah …', ['3', '9', '1'], 2, 'Siklus 3, 9, 7, 1 (panjang 4). 100 habis dibagi 4 → satuannya 1.'],
      ['Suku berikutnya dari 1, 2, 4, 7, 11, … adalah …', ['15', '16', '18'], 1, 'Selisih 1, 2, 3, 4, lalu 5 → 11 + 5 = 16.'],
    ],
  },
];
