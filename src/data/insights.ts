export interface InsightItem {
  title: string;
  body: string;
}

export interface Insight {
  heading: string;
  items: InsightItem[];
  footer?: string;
}

const insights: Record<string, Insight> = {
  'food-small-marketing': {
    heading: '小規模飲食店オーナーが今すぐできること',
    items: [
      {
        title: '1. SNS投稿をAIに任せる',
        body: 'ChatGPT または Gemini でメニュー情報を入力するだけでキャプション・ハッシュタグ・画像テンプレートが完成。週1〜2時間の作業が15〜30分に短縮できます。',
      },
      {
        title: '2. LINE公式アカウントで問い合わせを自動化する',
        body: 'LINE公式アカウントのクイック返信を設定。「今日のメニューは？」「営業時間は？」などの定型質問はAIに任せ、調理と接客に集中できます。応答時間が数時間→5分以内になった事例があります。',
      },
      {
        title: '3. グルメ系インフルエンサーを無料で集める',
        body: 'ChatGPT でエリア内のグルメ系インフルエンサーやGoogleマップ上位レビュアーをリサーチし、無料試食イベントに招待。食費のみの投資でInstagramやGoogleマップへの口コミ投稿を獲得できます。',
      },
      {
        title: '4. 在庫と仕込み量を数値化する',
        body: 'Googleスプレッドシートに売上を記録し、週次でAIにパターン分析させる。「金曜ディナーはカレー系が1.5倍」などの傾向が4週間で見えてきます。',
      },
    ],
    footer: 'まず1つだけ始める — SNS投稿の自動化が最も費用対効果が高く、失敗リスクが低いです。月額数千円のツール投資で効果が出たら次のステップへ進みましょう。',
  },
};

export function getInsight(industry: string, companySize: string, domain: string): Insight | undefined {
  return insights[`${industry}-${companySize}-${domain}`];
}
