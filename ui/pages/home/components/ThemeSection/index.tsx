import type { ReactNode } from "react";
import { THEME_BADGES } from "./useThemeSectionController";

function InfoBadge({
  label,
  labelWidth,
  children,
}: {
  label: string;
  labelWidth?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-5">
      <div
        className={`bg-[#024240] rounded-tl-[30px] rounded-br-[30px] h-[60px] lg:h-[76px] flex items-center justify-center shrink-0 px-4 ${labelWidth ?? "w-[100px] lg:w-[118px]"}`}
      >
        <span className="font-heading-now text-[30px] lg:text-[40px] leading-[50px] text-white">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export function ThemeSection() {
  return (
    <div className="bg-[#0B4B49]">
      <div className="relative w-full bg-[#F0F0ED]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-12 pb-32 lg:pb-40 flex flex-wrap items-center justify-center gap-x-8 lg:gap-x-16 gap-y-8">
          {THEME_BADGES.map((badge) => (
            <InfoBadge key={badge.label} label={badge.label} labelWidth={badge.labelWidth}>
              {badge.isTheme ? (
                <p className="font-heading-now text-[26px] lg:text-[36px] leading-[32px] lg:leading-[40px] text-[#024240] max-w-[380px] lg:max-w-[450px]">
                  {badge.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < badge.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ) : (
                <p className="font-sans font-extrabold text-[18px] lg:text-[24px] leading-[24px] text-[#024240]">
                  {badge.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < badge.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}
            </InfoBadge>
          ))}
        </div>
      </div>
    </div>
  );
}
