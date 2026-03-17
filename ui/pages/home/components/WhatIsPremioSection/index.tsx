import { ChevronDown } from "lucide-react";
import { CurvedSection } from "~/components/ui/CurvedSection";
import { DESCRIPTION } from "./useWhatIsPremioSectionController";

export function WhatIsPremioSection() {
  return (
    <CurvedSection fillColor="#0B4B49" bgAbove="#F0F0ED">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16 flex items-center justify-between gap-8 lg:gap-12">
        <div className="flex flex-col gap-6 lg:gap-8 max-w-[480px] lg:max-w-[560px]">
          <h2 className="font-heading-now text-[44px] lg:text-[64px] leading-[50px] lg:leading-[67px] text-[#F1F1EE]">
            O QUE É O PRÊMIO{" "}
            <br />
            <span className="text-[#94D2B9]">APROSOJA MT</span>
            <br />
            DE JORNALISMO
          </h2>

          <p className="font-sans font-medium text-[14px] lg:text-[16px] leading-normal text-white">
            {DESCRIPTION}
          </p>

          <a
            href="#regulamento"
            className="self-start flex items-center gap-2 h-[44px] px-6 border-[1.5px] border-[#94D2B9] rounded-[30px] text-[13px] font-bold font-sans text-white uppercase whitespace-nowrap hover:bg-[#94D2B9]/10 transition-colors"
          >
            BAIXE O REGULAMENTO
            <ChevronDown size={16} strokeWidth={2} />
          </a>
        </div>

        <div className="shrink-0 w-[420px] lg:w-[600px] flex items-center justify-center">
          <img
            src="/assets/MIC.png"
            alt="Microfone Aprosoja"
            className="w-full max-w-[400px] lg:max-w-[580px] select-none"
            draggable={false}
          />
        </div>
      </div>
    </CurvedSection>
  );
}
