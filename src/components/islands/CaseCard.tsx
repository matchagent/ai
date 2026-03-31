import type { ReactNode } from 'react';
import {
  industryGradients,
  industryBadgeColors,
  industryLabels,
  companySizeBadgeColors,
  companySizeLabels,
  domainBadgeColors,
  domainLabels,
  getMetricColor,
} from '@/utils/caseConstants';

interface Case {
  slug: string;
  title: string;
  industry: string;
  domain: string;
  company_size: string;
  metric_value: number;
  metric_unit: string;
  excerpt: string;
  date: string;
  problem_tags: string[];
  metric_verified?: boolean;
}

interface CaseCardProps {
  caseItem: Case;
}

// 業種アイコン（ReactNode: CaseCard 専用）
const industryIcons: Record<string, ReactNode> = {
  manufacturing: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
      <path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>
    </svg>
  ),
  retail: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  logistics: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="16" height="13" x="4" y="3" rx="2"/>
      <path d="M8 21h8"/><path d="M12 17v4"/><path d="m9 9 2 2 4-4"/>
    </svg>
  ),
  construction: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
      <path d="M14 2v6h6"/><path d="M2 15h10"/><path d="m5 12-3 3 3 3"/>
    </svg>
  ),
  legal: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m12 19 7-7 3 3-7 7-3-3z"/>
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="m2 2 7.5 8.6"/><path d="M22 22l-5.5-5.5"/>
    </svg>
  ),
  food: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  hotel: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 22h20"/>
      <path d="M4 22V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v13"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h8"/>
      <path d="M12 6v-3"/>
    </svg>
  ),
  realestate: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  entertainment: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/>
      <path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
    </svg>
  ),
};

export default function CaseCard({ caseItem }: CaseCardProps) {
  const gradientClass = industryGradients[caseItem.industry] || 'from-gray-500 to-gray-600';
  const badgeColorClass = industryBadgeColors[caseItem.industry] || 'bg-gray-100 text-gray-800';
  const metricColorClass = getMetricColor(caseItem.metric_value);
  const formattedValue = caseItem.metric_value % 1 === 0
    ? caseItem.metric_value.toString()
    : caseItem.metric_value.toFixed(1);

  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <a href={`/cases/${caseItem.slug}`} className="block">
        {/* カードヘッダー: 業種カラー背景 */}
        <div className={`h-20 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
          {/* 背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id={`pattern-${caseItem.slug}`} patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="2" cy="2" r="1" fill="white"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill={`url(#pattern-${caseItem.slug})`}/>
            </svg>
          </div>

          {/* アイコンとバッジ */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                {industryIcons[caseItem.industry]}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded ${badgeColorClass}`}>
                  {industryLabels[caseItem.industry] || caseItem.industry}
                </span>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${companySizeBadgeColors[caseItem.company_size] || 'bg-gray-100 text-gray-800'}`}>
                  {companySizeLabels[caseItem.company_size] || caseItem.company_size}
                </span>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${domainBadgeColors[caseItem.domain] || 'bg-gray-100 text-gray-800'}`}>
                  {domainLabels[caseItem.domain] || caseItem.domain}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* カード本文 */}
        <div className="p-5">
          {/* タイトル */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {caseItem.title}
          </h3>

          {/* 概要 */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {caseItem.excerpt}
          </p>

          {/* メトリクス表示 */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${metricColorClass} mb-4`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span className="text-2xl font-bold">+{formattedValue}</span>
            <span className="text-sm font-medium">{caseItem.metric_unit}</span>
            {caseItem.metric_verified && (
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-label="検証済み">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            )}
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {caseItem.problem_tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* フッター */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {new Date(caseItem.date).toLocaleDateString('ja-JP')}
            </span>
            <span className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              詳細を見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

// 型をエクスポート（CaseFilter.tsx で使用可能に）
export type { Case };
