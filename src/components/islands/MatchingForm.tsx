import { useState } from 'react';

const INDUSTRIES = [
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

const BUDGET_RANGES = [
  { value: '50', label: '50万円以下' },
  { value: '100', label: '50万円〜100万円' },
  { value: '300', label: '100万円〜300万円' },
  { value: '500', label: '300万円〜500万円' },
  { value: '1000', label: '500万円〜1,000万円' },
  { value: '1001', label: '1,000万円以上' },
];

const COMPANY_SIZES = [
  { value: 'small', label: '少人数（1〜10名）' },
  { value: 'mid', label: '中規模（11〜100名）' },
  { value: 'large', label: '大規模（101名以上）' },
];

interface MatchingResult {
  partner_id: string;
  score: number;
  reason: string;
}

export default function MatchingForm() {
  const [industry, setIndustry] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchingResult[] | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          problem_description: problemDescription,
          budget: parseInt(budget, 10),
          company_size: companySize,
        }),
      });

      if (!response.ok) {
        throw new Error('マッチングに失敗しました');
      }

      const data = await response.json() as { results: Array<{ partner_id: string; score: number; reason: string }> };
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            業種 <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
            解決したい課題 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="problem"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            rows={4}
            placeholder="例：在庫管理の効率化、顧客対応の自動化など"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              予算目安 <span className="text-red-500">*</span>
            </label>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              企業規模 <span className="text-red-500">*</span>
            </label>
            <select
              id="size"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'マッチング中...' : 'パートナーを探す'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">マッチング結果</h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.partner_id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}位
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    スコア: {result.score}点
                  </span>
                </div>
                <p className="text-gray-700">{result.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
