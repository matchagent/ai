import { useState, useMemo } from 'react';
import CaseCard from './CaseCard';
import type { Case } from './CaseCard';

export type { Case };

interface CaseFilterProps {
  cases: Case[];
  initialIndustry?: string;
  initialCompanySize?: string;
  initialDomain?: string;
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
  { value: 'marketing', label: 'マーケティング' },
  { value: 'production', label: '生産・製造' },
  { value: 'hr', label: '人事' },
  { value: 'accounting', label: '会計' },
  { value: 'customer_support', label: 'カスタマーサポート' },
  { value: 'logistics', label: '物流' },
];

const COMPANY_SIZES = [
  { value: 'all', label: '全ての規模' },
  { value: 'small', label: '少人数（1〜10名）' },
  { value: 'mid', label: '中規模（11〜100名）' },
  { value: 'large', label: '大企業（101名以上）' },
];

// 業種ラベル（ナビゲーション用）
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

export default function CaseFilter({ cases, initialIndustry = 'all', initialCompanySize = 'all', initialDomain = 'all' }: CaseFilterProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [selectedCompanySize, setSelectedCompanySize] = useState(initialCompanySize);

  const buildUrl = (industry: string, companySize: string, domain: string): string | null => {
    if (industry !== 'all') {
      if (companySize !== 'all' && domain !== 'all') return `/cases/${industry}/${companySize}/${domain}`;
      if (companySize !== 'all') return `/cases/${industry}/${companySize}`;
      if (domain !== 'all') return `/cases/${industry}/domain/${domain}`;
      return `/cases/${industry}`;
    }
    if (companySize !== 'all' && domain !== 'all') return `/cases/size/${companySize}/${domain}`;
    if (companySize !== 'all') return `/cases/size/${companySize}`;
    if (domain !== 'all') return `/cases/domain/${domain}`;
    return null;
  };

  const navigate = (industry: string, companySize: string, domain: string) => {
    const url = buildUrl(industry, companySize, domain);
    if (url) {
      window.location.href = url;
    } else {
      setSelectedIndustry(industry);
      setSelectedCompanySize(companySize);
      setSelectedDomain(domain);
    }
  };

  const handleIndustryChange = (industry: string) => {
    navigate(industry, selectedCompanySize, selectedDomain);
  };

  const handleCompanySizeChange = (companySize: string) => {
    navigate(selectedIndustry, companySize, selectedDomain);
  };

  const handleDomainChange = (domain: string) => {
    navigate(selectedIndustry, selectedCompanySize, domain);
  };

  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      const industryMatch = selectedIndustry === 'all' || caseItem.industry === selectedIndustry;
      const domainMatch = selectedDomain === 'all' || caseItem.domain === selectedDomain;
      const companySizeMatch = selectedCompanySize === 'all' || caseItem.company_size === selectedCompanySize;
      return industryMatch && domainMatch && companySizeMatch;
    });
  }, [cases, selectedIndustry, selectedDomain, selectedCompanySize]);

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
              onChange={(e) => handleIndustryChange(e.target.value)}
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
              企業規模で絞り込み
            </label>
            <select
              value={selectedCompanySize}
              onChange={(e) => handleCompanySizeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {COMPANY_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
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
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {DOMAINS.map((dom) => (
                <option key={dom.value} value={dom.value}>
                  {dom.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          該当事例: <span className="font-bold text-blue-600">{filteredCases.length}</span> 件
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <CaseCard key={caseItem.slug} caseItem={caseItem} />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">該当する事例が見つかりませんでした。</p>
          <button
            onClick={() => {
              setSelectedIndustry('all');
              setSelectedDomain('all');
              setSelectedCompanySize('all');
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
