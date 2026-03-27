import { useState, useMemo } from 'react';

interface Case {
  slug: string;
  title: string;
  industry: string;
  domain: string;
  metric_value: number;
  metric_unit: string;
  excerpt: string;
  date: string;
  problem_tags: string[];
}

interface CaseFilterProps {
  cases: Case[];
}

const INDUSTRIES = [
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

const DOMAINS = [
  { value: 'all', label: '全ての領域' },
  { value: 'sales', label: '営業' },
  { value: 'production', label: '生産・製造' },
  { value: 'hr', label: '人事' },
  { value: 'accounting', label: '会計' },
  { value: 'customer_support', label: 'カスタマーサポート' },
  { value: 'logistics', label: '物流' },
];

export default function CaseFilter({ cases }: CaseFilterProps) {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [minMetric, setMinMetric] = useState(0);

  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      const industryMatch = selectedIndustry === 'all' || caseItem.industry === selectedIndustry;
      const domainMatch = selectedDomain === 'all' || caseItem.domain === selectedDomain;
      const metricMatch = caseItem.metric_value >= minMetric;
      return industryMatch && domainMatch && metricMatch;
    });
  }, [cases, selectedIndustry, selectedDomain, minMetric]);

  const industryLabels: Record<string, string> = {
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

  const domainLabels: Record<string, string> = {
    sales: '営業',
    production: '生産・製造',
    hr: '人事',
    accounting: '会計',
    customer_support: 'カスタマーサポート',
    logistics: '物流',
  };

  return (
    <div>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              業種で絞り込み
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              領域で絞り込み
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {DOMAINS.map((dom) => (
                <option key={dom.value} value={dom.value}>
                  {dom.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最小効果: {minMetric}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={minMetric}
              onChange={(e) => setMinMetric(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          該当事例: <span className="font-bold text-blue-600">{filteredCases.length}</span> 件
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <article
            key={caseItem.slug}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <a href={`/cases/${caseItem.slug}`} className="block p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {industryLabels[caseItem.industry] || caseItem.industry}
                </span>
                <span className="text-xs text-gray-500">
                  {domainLabels[caseItem.domain] || caseItem.domain}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {caseItem.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {caseItem.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-blue-600">
                    +{caseItem.metric_value % 1 === 0 ? caseItem.metric_value : caseItem.metric_value.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">{caseItem.metric_unit}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(caseItem.date).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {caseItem.problem_tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </article>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">該当する事例が見つかりませんでした。</p>
          <button
            onClick={() => {
              setSelectedIndustry('all');
              setSelectedDomain('all');
              setMinMetric(0);
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            フィルターをリセット
          </button>
        </div>
      )}
    </div>
  );
}
