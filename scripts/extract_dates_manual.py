#!/usr/bin/env python3
"""
URLと公開日の手動マッピングを適用するスクリプト。

使用方法:
    python3 scripts/extract_dates_manual.py

目的:
    自動取得やURLパターン抽出が失敗したURLに対し、
    手動で特定した公開日を適用する最終フォールバック処理。

注意:
    - "Approximate" コメントが付いている日付は推定値
    - 正確な公開日が判明した場合、このマッピングを更新すること
    - 新規ケース追加時にsource_url_verified: false の場合、
      実際にアクセスして日付を確認すること
"""
import re
import json
import glob
from pathlib import Path
from datetime import datetime

# URLと公開日の手動マッピング
# キー: 完全なURL文字列
# 値: YYYY-MM-DD 形式の日付文字列
# コメント: 日付の出典または推定理由
url_date_mapping = {
    # PDFファイル（ファイル名に日付を含む場合）
    # 例: Dole-Case-Study_FINAL_4.6.2017.pdf -> 2017-04-06
    "https://albert.ai/wp-content/uploads/2017/04/Dole-Case-Study_FINAL_4.6.2017.pdf": "2017-04-06",
    
    # プレスリリース（URLパスに日付が含まれる）
    # 形式: /YYYY/MMDD_番号.html
    "https://corp.rakuten.co.jp/news/press/2025/0922_01.html": "2025-09-22",
    "https://www.recruit.co.jp/newsroom/pressrelease/2025/0226_15516.html": "2025-02-26",
    
    # URLにIDのみで日付が含まれない場合
    # 記事内容から公開日を確認して設定
    "https://www.cyberagent.co.jp/news/detail/id=29393": "2024-10-04",
    
    # ニュースリリースページ（年月のみが確定可能）
    # 日は01日として推定
    "https://www.kewpie.com/newsrelease/2020/1913/": "2020-08-01",
    "https://www.kurasushi.co.jp/author/004211.html": "2024-06-01",
    "https://www.lawson.co.jp/company/activity/environment/preservation/waste/": "2023-01-01",
    "https://www.nichireifoods.co.jp/news/2025/info_id43989/": "2025-01-01",
    "https://www.casio.co.jp/topics/article/2025/K-097/": "2025-01-01",
    "https://www.tokyu-land.co.jp/news/2022/000765.html": "2022-01-01",
    "https://www.jetro.go.jp/biznews/2024/08/3adca438f1592414.html": "2024-08-01",
    "https://www.tokyu-fudosan-hd.co.jp/news/companies/pdf/3052.pdf": "2023-01-01",
    "https://www.meti.go.jp/shingikai/mono_info_service/digital_jinzai/pdf/014_04_00.pdf": "2024-01-01",
    
    # URLパスから直接日付を抽出可能
    "https://www.itoen.co.jp/news/article/64855/": "2024-03-21",
    "https://www.kirinholdings.com/jp/newsroom/release/2023/1219_02.html": "2023-12-19",
    "https://www.leopalace21.co.jp/news/2023/0303_3474.html": "2023-03-03",
    "https://www.leopalace21.co.jp/news/2025/0624.html": "2025-06-24",
    "https://www.mec.co.jp/news/detail/2023/04/11_mec230411_jisedai": "2023-04-11",
    "https://www.mitsuifudosan.co.jp/corporate/news/2023/1010/": "2023-10-10",
    "https://www.yokogawa.co.jp/news/press-releases/2022/2022-03-22-ja/": "2022-03-22",
    "https://sre-group.co.jp/news/2023/230213.html": "2023-02-13",
    "https://www.biprogy.com/pdf/news/info_200817_iot_tenken.pdf": "2020-08-17",
    "https://www.cas.go.jp/jp/seisaku/digitaldenen/menubook/2023/1021.html": "2023-10-21",
    
    # n8nケーススタディ（公式サイトの公開日不明のため推定）
    "https://n8n.io/case-studies/beglobal/": "2025-01-01",
    "https://n8n.io/case-studies/bordr/": "2025-01-01",
    "https://n8n.io/case-studies/flow-ai/": "2025-01-01",
    "https://n8n.io/case-studies/itnt-media-group/": "2025-01-01",
    
    # その他サイト（推定値）
    "https://dfarobotics.com/topics/0wcgld56sz/": "2023-03-01",
    "https://engineering.reiwatravel.co.jp/blog/newt-ml-llm": "2024-01-01",
    "https://investor.lkcoffee.com/": "2024-01-01",
    "https://jp.ricoh.com/news/stories/articles/ai-citizen-development-dify": "2025-01-01",
    "https://paramo.sh/case-studies/skilletz-cafe/": "2025-01-01",
    "https://vrr.cec-ltd.co.jp/case/wiseimaging_toyota02/": "2024-01-01",
    "https://www.cambridge.org/engage/api-gateway/coe/assets/orp/resource/item/68450b3d1a8f9bdab5d4aa32/original/looking-into-how-artificial-intelligence-supports-operational-improvements-in-southeast-asia-s-expanding-enterprises-evidence-from-case-studies.pdf": "2025-06-01",
    "https://www.fas-calm.co.jp/case/aoyagi.html": "2024-01-01",
    "https://www.hitachi.co.jp/products/infrastructure/connective-industries/contents/casestudy/02/index.html": "2023-01-01",
    "https://www.ibm.com/jp-ja/case-studies/jfe-steel": "2023-01-01",
    "https://www.makeitfuture.com/case-studies/from-specialty-coffee-to-business-automation": "2025-01-01",
    "https://www.mjs.co.jp/products/case/takamoto/": "2024-01-01",
    "https://www.seiko-sol.co.jp/products/ai_platform/lp/": "2024-01-01",
    "https://www.stepon.co.jp/uri/ai-satei/": "2024-01-01",
    "https://www.wav.tech/": "2024-01-01",
    "https://www.wav.tech/zh": "2024-01-01",
    "https://www.lepolehorloger.fr/": "2024-01-01",
    
    # 既存ケースから取得した既知の日付
    "https://growwai.id/mengatur-otomasi-marketing-untuk-ukm-di-n8n-dengan-mudah/": "2025-08-09",
    "https://sns.userlocal.jp/document/casestudy/kfc/": "2022-10-01",
    "https://www.tabsquare.ai/": "2020-09-25",
    "https://www.xiaoyizc.com/105.html": "2025-10-01",
    "https://www.digitaling.com/articles/945356.html": "2023-06-29",
}

# 全ケースファイルを取得
case_files = sorted(glob.glob("src/content/cases/*.md"))

# 更新履歴と未対応URLを記録
updates = []
not_found_urls = set()

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
    
    # 手動マッピングから日付を取得
    new_date = url_date_mapping.get(url)
    if not new_date:
        not_found_urls.add(url)
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
print(f"Updated {len(updates)} files with manual dates:")
for u in updates[:15]:
    print(f"  {u['file']}: {u['old_date']} -> {u['new_date']}")
if len(updates) > 15:
    print(f"  ... and {len(updates) - 15} more")

# マッピングに存在しないURL（今後追加が必要）
if not_found_urls:
    print(f"\n{len(not_found_urls)} URLs without mapping:")
    for url in sorted(not_found_urls):
        print(f"  - {url}")
