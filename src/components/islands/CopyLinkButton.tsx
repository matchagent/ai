import { useState, useEffect, useRef } from 'react';

interface Props {
  url: string;
}

export default function CopyLinkButton({ url }: Props) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      timerRef.current = setTimeout(() => setState('idle'), 2000);
    } catch {
      // clipboard API unavailable (e.g. non-secure context)
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="URLをクリップボードにコピー"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors cursor-pointer"
    >
      {state === 'copied' ? (
        <>
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span aria-live="polite">コピーしました!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span aria-live="polite">URLをコピー</span>
        </>
      )}
    </button>
  );
}
