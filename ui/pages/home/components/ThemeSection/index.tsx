import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FadeIn } from '~/components/ui/FadeIn';
import { THEME_BADGES } from './useThemeSectionController';

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
    <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5 w-full sm:w-auto">
      <div
        className={`bg-[#024240] rounded-tl-[30px] rounded-br-[30px] h-[52px] sm:h-[60px] lg:h-[76px] flex items-center justify-center shrink-0 px-3 sm:px-4 ${labelWidth ?? 'w-[80px] sm:w-[100px] lg:w-[118px]'}`}
      >
        <span className="font-heading-now text-[22px] sm:text-[30px] lg:text-[40px] leading-none text-white">
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 lg:-mt-4 xl:-mt-16 pb-56 sm:pb-52 lg:pb-64 2xl:pb-80 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-6 sm:gap-x-8 lg:gap-x-16 sm:gap-y-8">
          {THEME_BADGES.map((badge, i) => (
            <FadeIn key={badge.label} delay={i * 0.1}>
              <InfoBadge label={badge.label} labelWidth={badge.labelWidth}>
                {badge.isTheme ? (
                  <p className="font-heading-now text-[20px] sm:text-[26px] lg:text-[36px] leading-[26px] sm:leading-[32px] lg:leading-[40px] text-[#024240] max-w-[280px] sm:max-w-[380px] lg:max-w-[450px]">
                    {badge.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < badge.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="font-sans font-extrabold text-[15px] sm:text-[18px] lg:text-[24px] leading-[20px] sm:leading-[24px] text-[#024240]">
                    {badge.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < badge.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
              </InfoBadge>
            </FadeIn>
          ))}
        </div>
        <motion.img
          src="/assets/DRAW CITY_DARK.svg"
          alt=""
          aria-hidden="true"
          className="absolute bottom-[-50px] sm:bottom-[-85px] md:bottom-[-95px] lg:bottom-[-100px] xl:bottom-[-155px] 2xl:bottom-[-175px] left-1/2 -translate-x-1/2 w-[180%] sm:w-[140%] md:w-[130%] lg:w-[160%] xl:w-[180%] h-auto pointer-events-none"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <FadeIn delay={0.3}>
          <a
            href="/auth/sign-up"
            className="absolute -bottom-[32px] sm:-bottom-[36px] lg:-bottom-[44px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#94D2B9] rounded-full px-8 sm:px-10 lg:px-12 py-3 sm:py-4 font-heading-now text-[24px] sm:text-[28px] lg:text-[36px] text-[#024240] whitespace-nowrap transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#024240] hover:ring-2 hover:ring-[#94D2B9] hover:shadow-[0_8px_30px_rgba(148,210,185,0.3)]"
          >
            INSCREVA-SE AQUI
            <img src="/assets/CHECK.svg" alt="" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
          </a>
        </FadeIn>
      </div>
    </div>
  );
}
