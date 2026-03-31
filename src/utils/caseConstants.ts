// 業種・ドメイン・企業規模の静的パス生成用キー配列
export const INDUSTRY_KEYS = [
  'manufacturing', 'retail', 'logistics', 'construction',
  'legal', 'food', 'hotel', 'realestate', 'entertainment',
] as const;

export const DOMAIN_KEYS = [
  'sales', 'marketing', 'production', 'hr', 'accounting', 'customer_support', 'logistics',
] as const;

export const COMPANY_SIZE_KEYS = ['small', 'mid', 'large'] as const;

// 業種ラベル
export const industryLabels: Record<string, string> = {
  manufacturing: '製造業',
  retail: '小売・EC業',
  logistics: '物流・運輸',
  construction: '建設業',
  legal: '士業',
  food: '飲食業',
  hotel: '宿泊業',
  realestate: '不動産業',
  entertainment: '娯楽業',
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

// 業種グラデーション
export const industryGradients: Record<string, string> = {
  manufacturing: 'from-blue-500 to-blue-600',
  retail: 'from-purple-500 to-purple-600',
  logistics: 'from-orange-500 to-orange-600',
  construction: 'from-yellow-500 to-yellow-600',
  legal: 'from-red-500 to-red-600',
  food: 'from-green-500 to-green-600',
  hotel: 'from-pink-500 to-pink-600',
  realestate: 'from-indigo-500 to-indigo-600',
  entertainment: 'from-teal-500 to-teal-600',
};

// 業種バッジ色
export const industryBadgeColors: Record<string, string> = {
  manufacturing: 'bg-blue-100 text-blue-800',
  retail: 'bg-purple-100 text-purple-800',
  logistics: 'bg-orange-100 text-orange-800',
  construction: 'bg-yellow-100 text-yellow-800',
  legal: 'bg-red-100 text-red-800',
  food: 'bg-green-100 text-green-800',
  hotel: 'bg-pink-100 text-pink-800',
  realestate: 'bg-indigo-100 text-indigo-800',
  entertainment: 'bg-teal-100 text-teal-800',
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
  { value: 'manufacturing', label: '製造業' },
  { value: 'retail', label: '小売・EC業' },
  { value: 'logistics', label: '物流・運輸' },
  { value: 'construction', label: '建設業' },
  { value: 'legal', label: '士業' },
  { value: 'food', label: '飲食業' },
  { value: 'hotel', label: '宿泊業' },
  { value: 'realestate', label: '不動産業' },
  { value: 'entertainment', label: '娯楽業' },
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
