#!/usr/bin/env python3
"""
ケースファイルのメタデータを抽出し、URLリストを作成するスクリプト。

使用方法:
    python3 scripts/update_dates.py

処理内容:
    1. src/content/cases/*.md から全ケースファイルを読み込む
    2. 各ファイルのフロントマターから source_url, date, source_url_verified を抽出
    3. URL -> ファイル一覧 のマッピングを作成
    4. ユニークなURLリストを /tmp/urls_to_fetch.txt に保存

出力:
    - コンソール: ファイル数、URL数のサマリー
    - /tmp/urls_to_fetch.txt: フェッチ対象のURL一覧
"""
import re
import json
import glob
from pathlib import Path
from urllib.parse import urlparse
import subprocess

# 全ケースファイルを取得
# src/content/cases/ ディレクトリ内の全Markdownファイルを対象とする
case_files = sorted(glob.glob("src/content/cases/*.md"))

# メタデータ格納用辞書
url_to_files = {}      # URL -> ファイルリスト（重複URL管理用）
file_metadata = {}     # ファイルパス -> メタデータ辞書

for filepath in case_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # --- で囲まれたYAMLフロントマターを抽出
    # re.DOTALL: 改行を含む任意の文字にマッチ
    frontmatter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        continue
    
    frontmatter = frontmatter_match.group(1)
    
    # フロントマターから各フィールドを正規表現で抽出
    # ^: 行頭, $: 行末, MULTILINE: 各行を独立して処理
    url_match = re.search(r'^source_url:\s*(.+)$', frontmatter, re.MULTILINE)
    date_match = re.search(r'^date:\s*(.+)$', frontmatter, re.MULTILINE)
    verified_match = re.search(r'^source_url_verified:\s*(.+)$', frontmatter, re.MULTILINE)
    
    if url_match:
        url = url_match.group(1).strip()
        current_date = date_match.group(1).strip() if date_match else None
        verified = verified_match.group(1).strip() if verified_match else 'false'
        
        # ファイルごとのメタデータを記録
        file_metadata[filepath] = {
            'url': url,
            'current_date': current_date,
            'verified': verified == 'true'
        }
        
        # URL -> ファイルの逆引きマップを構築
        if url not in url_to_files:
            url_to_files[url] = []
        url_to_files[url].append(filepath)

# サマリー出力
print(f"Total files: {len(case_files)}")
print(f"Files with URLs: {len(file_metadata)}")
print(f"Unique URLs: {len(url_to_files)}")
print()

# フェッチ用URLリストを一時ファイルに保存
# このファイルは fetch_dates.sh によって読み込まれる
with open('/tmp/urls_to_fetch.txt', 'w') as f:
    for url in sorted(url_to_files.keys()):
        f.write(f"{url}\n")

print("URL list saved to /tmp/urls_to_fetch.txt")
print()

# サンプルエントリを表示（デバッグ用）
print("Sample entries:")
for i, (filepath, meta) in enumerate(list(file_metadata.items())[:5]):
    print(f"  {filepath}: {meta['url']} -> {meta['current_date']}")
