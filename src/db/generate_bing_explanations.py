import sqlite3
import json

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
all_opts_rows = cur.fetchall()
all_opts = {}
for qid, lbl, txt in all_opts_rows:
    all_opts.setdefault(qid, {})[lbl] = txt

print(f"Loaded {len(correct_rows)} English questions with correct answers.")
