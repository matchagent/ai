import { useState, useMemo } from 'react';

interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  industry: string;
  problem_tags: string[];
}

interface SearchBoxProps {
  items: SearchItem[];
}

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

export default function SearchBox({ items }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(lowerQuery);
      const inExcerpt = item.excerpt.toLowerCase().includes(lowerQuery);
      const inTags = item.problem_tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      const inIndustry = (industryLabels[item.industry] || '').toLowerCase().includes(lowerQuery);
      return inTitle || inExcerpt || inTags || inIndustry;
    }).slice(0, 5);
  }, [query, items]);

  const handleSelect = (slug: string) => {
    window.location.href = `/cases/${slug}`;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="事例を検索..."
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {results.map((item) => (
              <li key={item.slug}>
                <button
                  onClick={() => handleSelect(item.slug)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {industryLabels[item.industry] || item.industry}
                        </span>
                        {item.problem_tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {isOpen && query && results.length === 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
            <p className="text-gray-500">「{query}」に一致する結果が見つかりませんでした</p>
          </div>
        </>
      )}
    </div>
  );
}
