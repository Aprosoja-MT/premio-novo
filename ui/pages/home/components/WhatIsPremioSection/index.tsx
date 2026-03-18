import { ChevronDown } from 'lucide-react';
import { CurvedSection } from '~/components/ui/CurvedSection';
import { FadeIn } from '~/components/ui/FadeIn';
import { DESCRIPTION } from './useWhatIsPremioSectionController';

export function WhatIsPremioSection() {
  return (
    <CurvedSection fillColor="#0B4B49" bgAbove="#F0F0ED" id="o-que-e">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <FadeIn direction="right" className="flex flex-col gap-6 lg:gap-8 max-w-full lg:max-w-[560px]">
          <h2 className="font-heading-now text-[36px] sm:text-[44px] lg:text-[64px] leading-[42px] sm:leading-[50px] lg:leading-[67px] text-[#F1F1EE] text-center lg:text-left">
            O QUE É O PRÊMIO{' '}
            <br />
            <span className="text-[#94D2B9]">APROSOJA MT</span>
            <br />
            DE JORNALISMO
          </h2>

          <p className="font-sans font-medium text-[14px] lg:text-[16px] leading-normal text-white text-center lg:text-left">
            {DESCRIPTION}
          </p>

          <a
            href="/documents/Regulamento Oficial.docx" download
            className="self-center lg:self-start flex items-center gap-2 h-[44px] px-6 border-[1.5px] border-[#94D2B9] rounded-[30px] text-[13px] font-bold font-sans text-white uppercase whitespace-nowrap hover:bg-[#94D2B9]/10 transition-colors"
          >
            BAIXE O REGULAMENTO
            <ChevronDown size={16} strokeWidth={2} />
          </a>
        </FadeIn>

        <FadeIn direction="left" delay={0.15} className="shrink-0 w-full max-w-[300px] sm:max-w-[380px] lg:w-[600px] lg:max-w-none flex items-center justify-center">
          <img
            src="/assets/MIC.png"
            alt="Microfone Aprosoja"
            className="w-full select-none"
            draggable={false}
          />
        </FadeIn>
      </div>
    </CurvedSection>
  );
}
