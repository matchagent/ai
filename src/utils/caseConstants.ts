// 業種・ドメイン・企業規模の静的パス生成用キー配列
export const INDUSTRY_KEYS = [
  'mfg', 'rtl', 'log', 'const',
  'leg', 'food', 'htl', 're', 'ent', 'rep',
] as const;

export const DOMAIN_KEYS = [
  'sales', 'marketing', 'production', 'hr', 'accounting', 'customer_support', 'logistics',
] as const;

export const COMPANY_SIZE_KEYS = ['small', 'mid', 'large'] as const;

// 業種ラベル
export const industryLabels: Record<string, string> = {
  mfg: '製造業',
  rtl: '小売(EC)業',
  log: '物流(運輸)業',
  const: '建設業',
  leg: '士業',
  food: '飲食業',
  htl: '宿泊業',
  re: '不動産業',
  ent: '娯楽業',
  rep: '修理(メンテナンス)業',
};

// ドメインラベル
export const domainLabels: Record<string, string> = {
  sales: '営業',
  marketing: 'マーケティング',
  production: '生産・製造',
  hr: '人事',
  accounting: '会計',
  customer_support: 'カスタマーサポート',
  logistics: '物流',
};

// 企業規模ラベル（短縮版: バッジ・タイトル用）
export const companySizeLabels: Record<string, string> = {
  small: '少人数',
  mid: '中規模',
  large: '大企業',
};

// 企業規模ラベル（フル版: 説明文・詳細表示用）
export const companySizeFullLabels: Record<string, string> = {
  small: '少人数（1〜10名）',
  mid: '中規模（11〜100名）',
  large: '大企業（101名以上）',
};

// 業種アイコン（SVG内側コンテンツ。<svg>ラッパーは使用箇所で記述）
export const industryIconSvgs: Record<string, string> = {
  mfg: `<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>`,
  rtl: `<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>`,
  log: `<rect width="16" height="13" x="4" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="m9 9 2 2 4-4"/>`,
  const: `<path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="M2 15h10"/><path d="m5 12-3 3 3 3"/>`,
  leg: `<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.5 8.6"/><path d="M22 22l-5.5-5.5"/>`,
  food: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
  htl: `<path d="M2 22h20"/><path d="M4 22V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v13"/><path d="M9 22v-4h6v4"/><path d="M8 6h8"/><path d="M12 6v-3"/>`,
  re: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  ent: `<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>`,
  rep: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
};

// 業種グラデーション
export const industryGradients: Record<string, string> = {
  mfg: 'from-blue-500 to-blue-600',
  rtl: 'from-purple-500 to-purple-600',
  log: 'from-orange-500 to-orange-600',
  const: 'from-yellow-500 to-yellow-600',
  leg: 'from-red-500 to-red-600',
  food: 'from-green-500 to-green-600',
  htl: 'from-pink-500 to-pink-600',
  re: 'from-indigo-500 to-indigo-600',
  ent: 'from-teal-500 to-teal-600',
  rep: 'from-stone-500 to-stone-600',
};

// 業種バッジ色
export const industryBadgeColors: Record<string, string> = {
  mfg: 'bg-blue-100 text-blue-800',
  rtl: 'bg-purple-100 text-purple-800',
  log: 'bg-orange-100 text-orange-800',
  const: 'bg-yellow-100 text-yellow-800',
  leg: 'bg-red-100 text-red-800',
  food: 'bg-green-100 text-green-800',
  htl: 'bg-pink-100 text-pink-800',
  re: 'bg-indigo-100 text-indigo-800',
  ent: 'bg-teal-100 text-teal-800',
  rep: 'bg-stone-100 text-stone-800',
};

// 企業規模バッジ色
export const companySizeBadgeColors: Record<string, string> = {
  small: 'bg-orange-100 text-orange-800',
  mid: 'bg-blue-100 text-blue-800',
  large: 'bg-purple-100 text-purple-800',
};

// ドメインバッジ色
export const domainBadgeColors: Record<string, string> = {
  sales: 'bg-indigo-100 text-indigo-800',
  marketing: 'bg-pink-100 text-pink-800',
  production: 'bg-teal-100 text-teal-800',
  hr: 'bg-cyan-100 text-cyan-800',
  accounting: 'bg-amber-100 text-amber-800',
  customer_support: 'bg-rose-100 text-rose-800',
  logistics: 'bg-lime-100 text-lime-800',
};

// メトリクス色分け
export const getMetricColor = (value: number): string => {
  if (value >= 50) return 'text-green-600 bg-green-50 border-green-200';
  if (value >= 20) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (value >= 10) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

// CaseFilter セレクトボックス用
export const INDUSTRIES = [
  { value: 'all', label: '全ての業種' },
  { value: 'mfg', label: '製造業' },
  { value: 'rtl', label: '小売(EC)業' },
  { value: 'log', label: '物流(運輸)業' },
  { value: 'const', label: '建設業' },
  { value: 'leg', label: '士業' },
  { value: 'food', label: '飲食業' },
  { value: 'htl', label: '宿泊業' },
  { value: 're', label: '不動産業' },
  { value: 'ent', label: '娯楽業' },
  { value: 'rep', label: '修理(メンテナンス)業' },
];

export const DOMAINS = [
  { value: 'all', label: '全ての領域' },
  { value: 'sales', label: '営業' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'production', label: '生産・製造' },
  { value: 'hr', label: '人事' },
  { value: 'accounting', label: '会計' },
  { value: 'customer_support', label: 'カスタマーサポート' },
  { value: 'logistics', label: '物流' },
];

export const COMPANY_SIZES = [
  { value: 'all', label: '全ての規模' },
  { value: 'small', label: '少人数（1〜10名）' },
  { value: 'mid', label: '中規模（11〜100名）' },
  { value: 'large', label: '大企業（101名以上）' },
];
