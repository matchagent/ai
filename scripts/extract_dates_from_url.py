#!/usr/bin/env python3
"""
URLパターンから日付を抽出するスクリプト（フォールバック処理）。

使用方法:
    python3 scripts/extract_dates_from_url.py

目的:
    fetch_dates.sh で取得できなかったURLに対し、
    URLのパス構造から日付を推定して補完する。

対応パターン:
    - /YYYY/MM/DD/        -> YYYY-MM-DD
    - /YYYY-MM-DD/        -> YYYY-MM-DD
    - /articles/YYMMDD/   -> 20YY-MM-DD (ITmedia形式)
    - -YYYYMMDD-          -> YYYY-MM-DD
    - /YYYYMM/            -> YYYY-MM-01
    - /news/YYYY/MM/DD/   -> YYYY-MM-DD
    - /press/YYYY/MM/DD/  -> YYYY-MM-DD
    - /release/YYYY/MM/DD/ -> YYYY-MM-DD
"""
import re
import json
import glob
from pathlib import Path
from datetime import datetime

# 既に取得済みの日付データを読み込み
with open('/tmp/url_dates.json', 'r') as f:
    url_dates = json.load(f)


# URLパターンと対応する日付抽出関数の定義
# 各タプル: (正規表現パターン, マッチ結果から日付文字列を生成するラムダ)
url_patterns = [
    # /2023/12/19/ または /2023/1/5/ 形式
    (r'/(\d{4})/(\d{1,2})/(\d{1,2})/', 
     lambda m: f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"),
    
    # /2023-12-19/ 形式（ハイフン区切り）
    (r'/(\d{4})-(\d{2})-(\d{2})/', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # /articles/231219/ 形式（ITmedia等の2桁年形式）
    # 20XX年として解釈
    (r'/articles/(\d{2})(\d{2})(\d{2})/', 
     lambda m: f"20{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # -20231219- または _20231219_ 形式
    (r'[-_](\d{4})(\d{2})(\d{2})[-_\.]', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # /202312/ 形式（年月のみ）
    # 日は01日として補完
    (r'/(\d{4})(\d{2})/', 
     lambda m: f"{m.group(1)}-{m.group(2)}-01"),
    
    # /20231219_12345.html 形式（プレスリリース等）
    (r'/(\d{4})(\d{2})(\d{2})_\d+\.html', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # /news/2023/12/19/ 形式
    (r'/news/(\d{4})/(\d{2})/(\d{2})/', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # /press/2023/12/19/ 形式
    (r'/press/(\d{4})/(\d{2})/(\d{2})/', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    
    # /release/2023/12/19/ 形式
    (r'/release/(\d{4})/(\d{2})/(\d{2})/', 
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
]


def extract_date_from_url(url):
    """
    URLから各種パターンに基づいて日付を抽出する。
    
    Args:
        url: 対象URL文字列
        
    Returns:
        YYYY-MM-DD 形式の日付文字列、またはマッチしない場合はNone
    """
    for pattern, formatter in url_patterns:
        match = re.search(pattern, url)
        if match:
            try:
                return formatter(match)
            except (IndexError, ValueError):
                # パターンはマッチしたが、フォーマット失敗
                continue
    return None


# 全ケースファイルを取得
case_files = sorted(glob.glob("src/content/cases/*.md"))

# 更新履歴と未対応URLを記録
updates = []
no_date_urls = set()

for filepath in case_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # フロントマターを抽出
    frontmatter_match = re.search(r'^(---\n.*?\n---)', content, re.DOTALL)
    if not frontmatter_match:
        continue
    
    frontmatter = frontmatter_match.group(1)
    
    # source_url を抽出
    url_match = re.search(r'^source_url:\s*(.+)$', frontmatter, re.MULTILINE)
    if not url_match:
        continue
    
    url = url_match.group(1).strip()
    
    # 既に日付が取得済みのURLはスキップ
    if url in url_dates:
        continue
    
    # URLパターンから日付を抽出
    new_date = extract_date_from_url(url)
    if not new_date:
        no_date_urls.add(url)
        continue
    
    # 現在の日付を抽出
    date_match = re.search(r'^(date:\s*.+)$', frontmatter, re.MULTILINE)
    if not date_match:
        continue
    
    current_date_line = date_match.group(1)
    current_date = current_date_line.replace('date:', '').strip()
    
    # 日付が異なる場合のみ更新
    if current_date != new_date:
        new_date_line = f"date: {new_date}"
        new_frontmatter = frontmatter.replace(current_date_line, new_date_line, 1)
        new_content = content.replace(frontmatter, new_frontmatter, 1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        updates.append({
            'file': filepath,
            'url': url,
            'old_date': current_date,
            'new_date': new_date
        })

# 更新サマリー
print(f"Updated {len(updates)} files from URL patterns:")
for u in updates[:15]:
    print(f"  {u['file']}")
    print(f"    URL: {u['url']}")
    print(f"    {u['old_date']} -> {u['new_date']}")
if len(updates) > 15:
    print(f"  ... and {len(updates) - 15} more")

# URLパターンからも取得できなかったURL
if no_date_urls:
    print(f"\n{len(no_date_urls)} URLs still without date:")
    for url in sorted(no_date_urls):
        print(f"  - {url}")
