import React from 'react';

interface MathFractionProps {
  num: number | string;
  den: number | string;
  whole?: number | string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  lineColor?: string;
}

export const MathFraction: React.FC<MathFractionProps> = ({
  num,
  den,
  whole,
  size = 'md',
  className = '',
  lineColor,
}) => {
  const sizeMap = {
    xs: { text: 'text-[11px]', padding: 'px-0.5', line: 'border-b', gap: 'my-[1px]' },
    sm: { text: 'text-xs sm:text-sm', padding: 'px-1', line: 'border-b-2', gap: 'my-[1px]' },
    md: { text: 'text-sm sm:text-base', padding: 'px-1.5', line: 'border-b-2', gap: 'my-[1.5px]' },
    lg: { text: 'text-lg sm:text-xl', padding: 'px-2', line: 'border-b-2', gap: 'my-[2px]' },
    xl: { text: 'text-xl sm:text-2xl', padding: 'px-2.5', line: 'border-b-3', gap: 'my-[2px]' },
    '2xl': { text: 'text-2xl sm:text-4xl', padding: 'px-3', line: 'border-b-3', gap: 'my-[2.5px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <span className={`inline-flex items-center align-middle font-rounded font-extrabold ${className}`}>
      {whole !== undefined && whole !== null && whole !== '' && (
        <span className={`${currentSize.text} mr-1 font-black`}>{whole}</span>
      )}
      <span className="inline-flex flex-col items-center justify-center text-center leading-none mx-0.5 select-none">
        <span className={`${currentSize.text} ${currentSize.padding} font-black leading-tight pt-0.5`}>
          {num}
        </span>
        <span
          className={`w-full ${currentSize.line} ${lineColor || 'border-current'} ${currentSize.gap} rounded-full`}
          style={{ minWidth: '12px' }}
        />
        <span className={`${currentSize.text} ${currentSize.padding} font-black leading-tight pb-0.5`}>
          {den}
        </span>
      </span>
    </span>
  );
};

interface FormattedMathTextProps {
  text: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  lineColor?: string;
}

export const FormattedMathText: React.FC<FormattedMathTextProps> = ({
  text,
  size = 'md',
  className = '',
  lineColor,
}) => {
  if (!text) return null;

  // Matches mixed fractions like "1 1/4" or simple fractions like "3/4"
  const fractionRegex = /(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fractionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // Mixed fraction: whole num/den
      parts.push(
        <MathFraction
          key={match.index}
          whole={match[1]}
          num={match[2]}
          den={match[3]}
          size={size}
          lineColor={lineColor}
        />
      );
    } else if (match[4] !== undefined) {
      // Simple fraction: num/den
      parts.push(
        <MathFraction
          key={match.index}
          num={match[4]}
          den={match[5]}
          size={size}
          lineColor={lineColor}
        />
      );
    }

    lastIndex = fractionRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
