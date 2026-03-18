import type { ReactNode } from 'react';

interface CurvedSectionProps {
  fillColor: string;
  bgAbove?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function CurvedSection({ fillColor, bgAbove, children, className = '', id }: CurvedSectionProps) {
  return (
    <div className={className} id={id}>
      <div style={{ backgroundColor: bgAbove }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1280 120"
          preserveAspectRatio="none"
          className="block w-full h-[80px] md:h-[120px] lg:h-[160px]"
        >
          <path
            d="M640 0C862.257 0 1077.04 20 1280 55V120H0V55C202.961 20 417.743 0 640 0Z"
            fill={fillColor}
          />
        </svg>
      </div>
      <div style={{ backgroundColor: fillColor }} className="-mt-px">
        {children}
      </div>
    </div>
  );
}
