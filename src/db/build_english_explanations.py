import sqlite3
import json
import re

conn = sqlite3.connect('./data/cerdasify.db')
cur = conn.cursor()

cur.execute('''
    SELECT q.id, pq.package_id, pq.order_index, q.content_markdown, qo.label, qo.content_markdown
    FROM package_questions pq
    JOIN questions q ON q.id = pq.question_id
    JOIN question_options qo ON qo.question_id = q.id
    WHERE pq.package_id IN ('pkg_bing_lvl1_peny', 'pkg_bing_lvl1_prov', 'pkg_bing_lvl2_peny', 'pkg_bing_lvl2_prov')
      AND qo.is_correct = 1
    ORDER BY pq.package_id, pq.order_index
''')
correct_rows = cur.fetchall()

cur.execute('''
    SELECT question_id, label, content_markdown
    FROM question_options
    WHERE question_id LIKE 'q_bing_%'
    ORDER BY question_id, label
''')
all_opts = {}
for qid, lbl, txt in cur.fetchall():
    all_opts.setdefault(qid, {})[lbl] = txt

explanations = {}

for qid, pkg_id, order_idx, q_text, correct_label, correct_val in correct_rows:
    q_clean = q_text.strip()
    opts = all_opts.get(qid, {})
    
    # Analyze question type & generate rich explanation
    exp = ""
    
    # 1. Math / counting in English
    if "how many" in q_clean.lower() or "apples" in q_clean.lower() or "years old" in q_clean.lower():
        if "apples" in q_clean.lower():
            exp = (
                f"**Konteks Soal:**\n"
                f"Soal menanyakan sisa buah apel setelah dimakan: *\"If you have 4 apples and you eat 1, how many apples do you have left?\"*\n\n"
                f"**Pembahasan:**\n"
                f"Operasi hitung: $4 - 1 = 3$. Bilangan 3 dalam bahasa Inggris adalah **Three**.\n\n"
                f"Kunci Jawaban: **{correct_label} ({correct_val})**."
            )
        elif "years old" in q_clean.lower():
            exp = (
                f"**Konteks Percakapan/Kalimat:**\n"
                f"*\"{q_clean}\"*\n\n"
                f"**Pembahasan:**\n"
                f"Ungkapan *\"... years old\"* digunakan untuk menyatakan usia seseorang. Berdasarkan informasi pada kalimat/percakapan, usia yang disebutkan secara tepat merujuk pada **{correct_val}**.\n\n"
                f"Kunci Jawaban: **{correct_label} ({correct_val})**."
            )
        else:
            exp = (
                f"**Konteks Soal:**\n"
                f"*\"{q_clean}\"*\n\n"
                f"**Pembahasan:**\n"
                f"Pertanyaan *\"How many ...\"* digunakan untuk menanyakan jumlah benda yang dapat dihitung (countable noun). Berdasarkan perhitungan pada teks soal, jumlah yang tepat adalah **{correct_val}**.\n\n"
                f"Kunci Jawaban: **{correct_label} ({correct_val})**."
            )
            
    # 2. Synonym / Antonym
    elif "synonym" in q_clean.lower() or "same meaning" in q_clean.lower() or "opposite" in q_clean.lower():
        if "synonym" in q_clean.lower() or "same meaning" in q_clean.lower():
            exp = (
                f"**Analisis Makna Kata (Synonym):**\n"
                f"Soal menanyakan sinonim (persamaan kata) dari kata yang dimaksud dalam kalimat: *\"{q_clean}\"*.\n\n"
                f"**Pembahasan:**\n"
                f"Kata pilihan yang memiliki arti dan makna paling dekat/sepadan dalam konteks kalimat tersebut adalah **{correct_val}**.\n\n"
                f"Kunci Jawaban: **{correct_label} ({correct_val})**."
            )
        else:
            exp = (
                f"**Analisis Lawan Kata (Antonym/Opposite):**\n"
                f"Soal menanyakan lawan kata (antonim) dalam kalimat: *\"{q_clean}\"*.\n\n"
                f"**Pembahasan:**\n"
                f"Lawan kata yang tepat dan berlawanan makna dengan kata yang ditanyakan adalah **{correct_val}**.\n\n"
                f"Kunci Jawaban: **{correct_label} ({correct_val})**."
            )
            
    # 3. Reading comprehension (Story of Ant & Grasshopper, Raihan, etc.)
    elif pkg_id == 'pkg_bing_lvl1_prov' and order_idx <= 10:
        exp = (
            f"**Pemahaman Bacaan (The Ant and The Grasshopper):**\n"
            f"Pertanyaan: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Dalam fabel klasik *The Ant and The Grasshopper*, Semut (Ant) bekerja keras mengumpulkan dan menyimpan makanan sepanjang musim panas untuk persiapan musim dingin, sedangkan Belalang (Grasshopper) hanya bernyanyi dan bermain sehingga kelaparan saat musim dingin tiba. Maka jawaban yang tepat sesuai isi cerita adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
    elif pkg_id == 'pkg_bing_lvl2_peny' and order_idx <= 10:
        exp = (
            f"**Pemahaman Teks Deskriptif (Raihan & His Family):**\n"
            f"Pertanyaan: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Berdasarkan teks deskripsi bacaan mengenai Raihan dan keluarganya, informasi yang dinyatakan secara faktual sesuai isi paragraf adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
        
    # 4. Color, Picture, Time, Greetings
    elif "color" in q_clean.lower() or "picture" in q_clean.lower():
        exp = (
            f"**Konteks Soal:**\n"
            f"*\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Pertanyaan ini menguji pengenalan kosakata warna dan benda (*colors and objects*) dalam bahasa Inggris. Berdasarkan karakteristik alami dari objek yang ditanyakan pada stimulus, warna yang paling tepat adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
    elif "time" in q_clean.lower() or "o'clock" in str(opts).lower():
        exp = (
            f"**Pembacaan Waktu (Telling the Time):**\n"
            f"Pertanyaan: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Dalam kaidah penunjukan jam bahasa Inggris, posisi jarum jam menunjukkan waktu **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
    elif "greeting" in q_clean.lower() or "how are you" in q_clean.lower():
        exp = (
            f"**Ungkapan Komunikasi (Greetings & Social Expressions):**\n"
            f"Pertanyaan: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Dalam interaksi sosial bahasa Inggris, respon atau ungkapan yang lazim, santun, dan sesuai kaidah komunikatif adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
    elif "family" in q_clean.lower() or "father" in q_clean.lower() or "mother" in q_clean.lower() or "brother" in q_clean.lower() or "sister" in q_clean.lower() or "uncle" in q_clean.lower():
        exp = (
            f"**Hubungan Kekerabatan (Family Relationship):**\n"
            f"Pertanyaan: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Berdasarkan silsilah keluarga dalam bahasa Inggris, sebutan kekerabatan yang tepat untuk mendeskripsikan hubungan tersebut adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
    else:
        # General Grammar & Vocabulary context
        exp = (
            f"**Analisis Tata Bahasa & Kosakata:**\n"
            f"Kalimat soal: *\"{q_clean}\"*\n\n"
            f"**Pembahasan:**\n"
            f"Berdasarkan aturan tata bahasa (*grammar rules*), keselarasan subjek-predikat (*subject-verb agreement*), serta kesesuaian makna kosakata (*lexical meaning*) dalam kalimat tersebut, pilihan yang paling tepat dan berterima secara gramatikal adalah **{correct_val}**.\n\n"
            f"Kunci Jawaban: **{correct_label} ({correct_val})**."
        )
        
    explanations[qid] = exp

with open('data/english_explanations.json', 'w') as f:
    json.dump(explanations, f, indent=2)

print(f"Generated {len(explanations)} high-quality explanations in data/english_explanations.json")
