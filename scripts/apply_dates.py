#!/usr/bin/env python3
"""
Webページから取得した公開日をケースファイルに適用するスクリプト。

使用方法:
    python3 scripts/apply_dates.py

入力:
    /tmp/url_dates.json - fetch_dates.sh が生成したURLと日付のマッピング

処理内容:
    1. JSONファイルを読み込み、日付形式を正規化（YYYY-MM-DD）
    2. 各ケースファイルの source_url に対応する日付を検索
    3. 現在のdateと異なる場合、ファイルを更新

正規化対応フォーマット:
    - ISO 8601: 2023-12-19
    - スラッシュ区切り: 2023/12/19, 12/19/2023
    - 日本語表記: 2023年12月19日
    - 年月のみ: 2023-12 -> 2023-12-01
    - 年のみ: 2023 -> 2023-01-01
"""
import re
import json
import glob
from pathlib import Path
from datetime import datetime

# fetch_dates.sh の出力を読み込み
with open('/tmp/url_dates.json', 'r') as f:
    url_dates = json.load(f)


def normalize_date(date_str):
    """
    様々な日付形式を YYYY-MM-DD に正規化する。
    
    Args:
        date_str: 入力日付文字列
        
    Returns:
        YYYY-MM-DD 形式の文字列、または正規化できない場合はNone
    """
    if not date_str:
        return None
    
    # 前後の空白を除去
    date_str = date_str.strip()
    
    # 末尾の余分な文字（JS等）を除去
    date_str = re.sub(r'[A-Za-z]+$', '', date_str).strip()
    
    # 対応フォーマット一覧
    formats = [
        '%Y-%m-%d',       # ISO 8601: 2023-12-19
        '%Y/%m/%d',       # スラッシュ区切り: 2023/12/19
        '%m/%d/%Y',       # 米国形式: 12/19/2023
        '%Y年%m月%d日',    # 日本語表記
    ]
    
    # 各フォーマットでパースを試行
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # 年のみの場合（2023 -> 2023-01-01）
    if re.match(r'^\d{4}$', date_str):
        return f"{date_str}-01-01"
    
    # 年月のみの場合（2023-12 -> 2023-12-01）
    match = re.match(r'^(\d{4})-(\d{2})$', date_str)
    if match:
        return f"{match.group(1)}-{match.group(2)}-01"
    
    return None


# 全URLの日付を正規化
normalized_dates = {}
for url, date in url_dates.items():
    norm_date = normalize_date(date)
    if norm_date:
        normalized_dates[url] = norm_date
    else:
        print(f"Warning: Could not normalize date '{date}' for {url}")

print(f"Normalized {len(normalized_dates)} dates")

# 全ケースファイルを取得
case_files = sorted(glob.glob("src/content/cases/*.md"))

# 更新履歴を記録
updates = []
no_date_urls = set()

for filepath in case_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # フロントマター（---で囲まれた部分）を抽出
    frontmatter_match = re.search(r'^(---\n.*?\n---)', content, re.DOTALL)
    if not frontmatter_match:
        continue
    
    frontmatter = frontmatter_match.group(1)
    
    # source_url を抽出
    url_match = re.search(r'^source_url:\s*(.+)$', frontmatter, re.MULTILINE)
    if not url_match:
        continue
    
    url = url_match.group(1).strip()
    
    # 新しい日付を取得
    new_date = normalized_dates.get(url)
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
        # 新しい日付行を作成
        new_date_line = f"date: {new_date}"
        
        # フロントマター内の日付を置換
        new_frontmatter = frontmatter.replace(current_date_line, new_date_line, 1)
        
        # ファイル全体でフロントマターを置換
        new_content = content.replace(frontmatter, new_frontmatter, 1)
        
        # ファイルに書き戻し
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        updates.append({
            'file': filepath,
            'url': url,
            'old_date': current_date,
            'new_date': new_date
        })

# 更新サマリーを出力
print(f"\nUpdated {len(updates)} files:")
for u in updates[:10]:
    print(f"  {u['file']}: {u['old_date']} -> {u['new_date']}")
if len(updates) > 10:
    print(f"  ... and {len(updates) - 10} more")

# 日付が取得できなかったURLを一覧表示
if no_date_urls:
    print(f"\n{len(no_date_urls)} URLs without date data:")
    for url in list(no_date_urls)[:5]:
        print(f"  - {url}")
    if len(no_date_urls) > 5:
        print(f"  ... and {len(no_date_urls) - 5} more")
