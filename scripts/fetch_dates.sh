#!/bin/bash
# =============================================================================
# Webページから公開日を抽出するシェルスクリプト
# =============================================================================
# 
# 使用方法:
#     ./fetch_dates.sh
#
# 入力:
#     /tmp/urls_to_fetch.txt - 処理対象のURL一覧（update_dates.pyが生成）
#
# 出力:
#     /tmp/url_dates.json - URLと公開日のマッピング（JSON形式）
#
# 抽出方法:
#     1. article:published_time (Open Graphメタタグ)
#     2. datePublished (JSON-LD構造化データ)
#     3. publish-date / publication_date (汎用メタタグ)
#     4. URLパターン (/YYYY/MM/DD/ または YYYYMMDD)
#
# =============================================================================

# 入出力ファイルパス
URL_FILE="/tmp/urls_to_fetch.txt"
OUTPUT_FILE="/tmp/url_dates.json"

# JSONの開始
# 注意: 各URLの後にカンマを付けるため、最後にsed等で修正が必要
echo "{" > "$OUTPUT_FILE"

# 進捗カウンター
line_num=0
total=$(wc -l < "$URL_FILE")

# URLファイルを1行ずつ処理
while IFS= read -r url; do
    line_num=$((line_num + 1))
    echo "[$line_num/$total] Fetching: $url"
    
    # curlでページを取得（タイムアウト10秒、Mozilla伪装）
    # -s: サイレント, -L: リダイレクト追従
    html=$(curl -sL --max-time 10 --user-agent "Mozilla/5.0" "$url" 2>/dev/null)
    
    if [ -z "$html" ]; then
        echo "  Failed to fetch"
        continue
    fi
    
    # 各種メタタグから公開日を抽出（優先順位順）
    date=""
    
    # 1. Open Graphの article:published_time を試行
    # 例: <meta property="article:published_time" content="2023-12-19T10:00:00+09:00">
    if [ -z "$date" ]; then
        date=$(echo "$html" | grep -oP '<meta[^>]*property="article:published_time"[^>]*content="\K[^"]+' | head -1)
    fi
    
    # 2. JSON-LDの datePublished を試行
    # 例: "datePublished": "2023-12-19"
    if [ -z "$date" ]; then
        date=$(echo "$html" | grep -oP '"datePublished"\s*:\s*"\K[^"]+' | head -1)
    fi
    
    # 3. 汎用メタタグ publish-date を試行
    if [ -z "$date" ]; then
        date=$(echo "$html" | grep -oP '<meta[^>]*name="publish-date"[^>]*content="\K[^"]+' | head -1)
    fi
    
    # 4. 汎用メタタグ publication_date を試行
    if [ -z "$date" ]; then
        date=$(echo "$html" | grep -oP '<meta[^>]*name="publication_date"[^>]*content="\K[^"]+' | head -1)
    fi
    
    # 5. URLパターンから日付を抽出 (/YYYY/MM/DD/)
    # 例: https://example.com/2023/12/19/article.html
    if [ -z "$date" ]; then
        # \d{4}/\d{1,2}/\d{1,2}/ にマッチする部分を抽出
        url_date=$(echo "$url" | grep -oP '/\d{4}/\d{1,2}/\d{1,2}/' | head -1 | tr -d '/')
        if [ -n "$url_date" ]; then
            # YYYYMMDD -> YYYY-MM-DD に変換
            date="${url_date:0:4}-${url_date:4:2}-${url_date:6:2}"
        fi
    fi
    
    # 6. URL中の8桁数字を日付として解釈 (YYYYMMDD)
    # 例: https://example.com/news/20231219.html
    if [ -z "$date" ]; then
        url_date=$(echo "$url" | grep -oP '\d{8}' | head -1)
        if [ -n "$url_date" ] && [ "${#url_date}" -eq 8 ]; then
            date="${url_date:0:4}-${url_date:4:2}-${url_date:6:2}"
        fi
    fi
    
    # 結果をJSONに出力
    if [ -n "$date" ]; then
        # 時刻部分を除去（T以降を削除）
        date=$(echo "$date" | cut -d'T' -f1 | cut -d' ' -f1)
        echo "  Found date: $date"
        
        # JSONエスケープ（URL中の " を \" に置換）
        json_url=$(echo "$url" | sed 's/"/\\"/g')
        
        # JSONエントリを追加（末尾のカンマに注意）
        echo "  \"$json_url\": \"$date\"," >> "$OUTPUT_FILE"
    else
        echo "  No date found"
    fi
    
    # サーバー負荷軽減のため0.5秒待機
    sleep 0.5
    
done < "$URL_FILE"

# JSONの終了（最後のカンマはapply_dates.pyで処理）
echo "}" >> "$OUTPUT_FILE"

echo "Results saved to $OUTPUT_FILE"
