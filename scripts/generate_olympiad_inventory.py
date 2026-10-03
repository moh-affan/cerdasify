#!/usr/bin/env python3
"""
Generate comprehensive Todo List and Inventory of Olympiad documents.
Classifies all 381 PDF & DOCX files into competitions, subjects, levels, and tracks import status.
"""

import os
import re

BASE_DIR = "/home/affan/Downloads/olympiad-20261003T112223Z-1-001/olympiad"
TARGET_MD = "/home/affan/projects/cerdasify/INVENTARIS_SOAL_OLYMPIAD.md"

IMPORTED_PATTERNS = [
    ("buku-osn.pdf", "pkg_osn_buku_100", "Kupas Tuntas 100 Soal OSN Matematika SD (100 Soal)"),
    ("soal mtk lagi.pdf", "pkg_mtk_tricky_l1", "Simulasi Matematika Level 1 — 30 Soal Cerita Super Tricky (30 Soal)"),
    ("SEMI FINAL CEO - MATEMATIKA LEVEL 1.pdf", "pkg_ceo_2025_m1", "Olimpiade Semifinal CEO 2025 — Matematika Level 1 (30 Soal)"),
    ("KUNCI-JAWABAN-SEMI FINAL CEO - MATEMATIKA LEVEL 1.pdf", "pkg_ceo_2025_m1", "Kunci Jawaban Resmi CEO 2025 Matematika Level 1"),
    ("SOAL FINAL NAS ORION PDF/MAT  A  ok .pdf", "pkg_orion_2026_ma", "Final Nasional ORION 2026 — Matematika Level A (Kelas 1-2) (35 Soal)"),
    ("Kunci Jawaban Matematika Level A.pdf", "pkg_orion_2026_ma", "Kunci Jawaban & Pembahasan ORION 2026 Matematika Level A"),
    ("english/Soal_Level1_Penyisihan.pdf", "pkg_bing_lvl1_peny", "Olimpiade Bahasa Inggris Level 1 — Babak Penyisihan (40 Soal)"),
    ("english/Soal_Level1_Provinsi.pdf", "pkg_bing_lvl1_prov", "Olimpiade Bahasa Inggris Level 1 — Babak Final Provinsi (40 Soal)"),
    ("english/Soal_Level2_Penyisihan.pdf", "pkg_bing_lvl2_peny", "Olimpiade Bahasa Inggris Level 2 — Babak Penyisihan (40 Soal)"),
    ("english/Soal_Level2_Provinsi.pdf", "pkg_bing_lvl2_prov", "Olimpiade Bahasa Inggris Level 2 — Babak Final Provinsi (40 Soal)"),
    ("english/Kunci_Jawaban_Semua_Level.pdf", "pkg_bing_*", "Kunci Jawaban Resmi Semua Level Bahasa Inggris"),
    ("PENYISIHAN MTK LEVEL 1 PRISMA 2025.docx", "pkg_prisma_2025_m1", "Olimpiade PRISMA 2025 — Matematika Level 1 (28 Soal)"),
    ("PENYISIHAN MTK LEVEL 2 PRISMA 2025.docx", "pkg_prisma_2025_m2", "Olimpiade PRISMA 2025 — Matematika Level 2 (Bergambar) (30 Soal)"),
    ("PENYISIHAN MTK LEVEL 3 PRISMA 2025.docx", "pkg_prisma_2025_m3", "Olimpiade PRISMA 2025 — Matematika Level 3 (Bergambar) (29 Soal)"),
    ("SOAL MATEMATIKA LEVEL 1 PRISMA 2024.pdf", "pkg_prisma_2024_m1", "Mode Latihan PRISMA 2024 — Matematika Level 1 (Bergambar) (23 Soal)"),
    ("Aljabar-Olimpiade-SD-100-Soal-PG", "pkg_aljabar_100", "Simulasi Olimpiade SD — Paket 100 Soal Aljabar Marathon (100 Soal)"),
    ("Latihan-Soal-Aljabar-SD-100-Soal", "pkg_aljabar_100", "Simulasi Olimpiade SD — Paket 100 Soal Aljabar Marathon (100 Soal)"),
    ("01-Buku-Soal-Matematika-Olimpiade-SD.pdf", "pkg_sesi_*", "Buku Soal Sesi 1, 2, 3, 4, 5, 13, 21 (239 Soal)"),
    ("02-Kunci-Jawaban-dan-Pembahasan.pdf", "pkg_sesi_*", "Kunci Jawaban & Pembahasan Buku Soal Sesi 1..21"),
]

def check_imported(relpath):
    for pat, pkg, desc in IMPORTED_PATTERNS:
        if pat.lower() in relpath.lower():
            return True, pkg, desc
    return False, None, None

def classify_group(relpath):
    r = relpath.lower()
    if "prisma" in r:
        return "1. Olimpiade PRISMA (2024–2026)"
    elif "ceo" in r:
        return "2. Chaanakya Ekadanta Olympiad (CEO)"
    elif "orion" in r:
        return "3. Kompetisi Nasional ORION (Final & Grand Final 2025–2026)"
    elif "fabi" in r:
        return "4. Festival Anak Berprestasi Indonesia (FABI 13 & 14)"
    elif "jso" in r:
        return "5. Java Science Olympiad (JSO 2024–2026)"
    elif "kmsi" in r:
        return "6. Kompetisi Matematika, Sains & Inggris (KMSI 2023–2025)"
    elif "english" in r or "b ing" in r or "inggris" in r:
        return "7. Olimpiade Bahasa Inggris Nasional"
    elif "buku-osn" in r or "aljabar" in r or "soal mtk lagi" in r or "buku-soal" in r:
        return "8. Koleksi Master Olimpiade Matematika SD & OSN"
    elif "imocsea" in r or "isocsea" in r:
        return "10. IMOCSEA & ISOCSEA International Papers"
    elif "level 1" in r or "level 2" in r or "omnas" in r or "topaz" in r or "upac" in r or "komas" in r or "baiz" in r:
        return "9. Koleksi Bank Soal Per Level (Omnas, Topaz, Komas, dll.)"
    else:
        return "11. Berkas Soal Lainnya & Campuran"

def main():
    all_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        for f in sorted(files):
            ext = os.path.splitext(f)[1].lower()
            if ext in [".pdf", ".docx", ".doc"]:
                p = os.path.join(root, f)
                rel = os.path.relpath(p, BASE_DIR)
                is_imp, pkg, desc = check_imported(rel)
                all_files.append({
                    "rel": rel,
                    "filename": f,
                    "ext": ext,
                    "size_kb": os.path.getsize(p) // 1024,
                    "is_imported": is_imp,
                    "package_id": pkg,
                    "desc": desc,
                    "group": classify_group(rel)
                })

    all_files.sort(key=lambda x: (x["group"], x["rel"]))

    total_files = len(all_files)
    imported_cnt = sum(1 for x in all_files if x["is_imported"])
    unimported_cnt = total_files - imported_cnt
    pct = (imported_cnt / total_files) * 100 if total_files else 0

    groups = {}
    for x in all_files:
        groups.setdefault(x["group"], []).append(x)

    md = []
    md.append("# Inventaris & Todo List Impor Berkas Olimpiade Cerdasify 📋\n")
    md.append("> **Direktori Sumber:** `/home/affan/Downloads/olympiad-20261003T112223Z-1-001/olympiad/`\n")
    md.append("Dokumen ini memetakan seluruh naskah soal (**PDF** dan **Word/DOCX**) yang tersimpan di direktori unduhan olimpiade. Digunakan sebagai panduan kerja (*tracking todo list*) untuk melanjutkan proses importasi bank soal secara bertahap hingga seluruh berkas tuntas terintegrasi ke dalam basis data **Cerdasify**.\n")
    md.append("---\n")
    md.append("## Ringkasan Progres Importasi\n")
    md.append(f"- **Total Berkas Naskah Soal & Kunci:** `{total_files}` berkas\n")
    md.append(f"- **Sudah Diimpor ke Database:** `{imported_cnt}` berkas (`{pct:.1f}%`)\n")
    md.append(f"- **Belum Diimpor (Antrean Todo):** `{unimported_cnt}` berkas\n")
    md.append(f"- **Total Soal di Cerdasify Saat Ini:** `847` butir soal (100% lengkap kunci & pembahasan)\n")
    md.append(f"- **Total Paket Ujian Aktif Saat Ini:** `21` paket ujian\n")
    md.append("\n---\n")

    def get_group_order(title):
        m = re.match(r"^(\d+)\.", title)
        return int(m.group(1)) if m else 99

    sorted_group_titles = sorted(groups.keys(), key=get_group_order)

    for g_title in sorted_group_titles:
        items = groups[g_title]
        g_imp = sum(1 for i in items if i["is_imported"])
        g_total = len(items)
        md.append(f"\n## {g_title} ({g_imp}/{g_total} Selesai)\n")
        
        md.append("| Status | Format | Nama Berkas & Jalur | Paket / Keterangan di Cerdasify |")
        md.append("| :---: | :---: | :--- | :--- |")
        
        for item in items:
            status_box = "[x]" if item["is_imported"] else "[ ]"
            status_text = "**SUDAH**" if item["is_imported"] else "Belum"
            badge = "`PDF`" if item["ext"] == ".pdf" else "`DOCX`"
            desc_text = f"**{item['package_id']}**: {item['desc']}" if item["is_imported"] else "*Siap diimpor ke paket baru*"
            
            # Escape pipes in relpath
            clean_rel = item["rel"].replace("|", "/")
            md.append(f"| {status_box} {status_text} | {badge} | `{clean_rel}` ({item['size_kb']} KB) | {desc_text} |")

    content = "\n".join(md)
    with open(TARGET_MD, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Generated {TARGET_MD} with {total_files} files across {len(groups)} groups.")

if __name__ == "__main__":
    main()
