import { CurvedSection } from "~/components/ui/CurvedSection";
import { FAQS, useFaqSectionController } from "./useFaqSectionController";

export function FaqSection() {
  const { openIndex, toggle } = useFaqSectionController();

  return (
    <CurvedSection fillColor="#0B4B49" bgAbove="#F0F0ED">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[180px] pb-12 lg:pb-16">
        <div className="mx-auto max-w-[1156px] rounded-[29px] overflow-hidden">
          <div className="bg-[#002827] px-10 lg:px-14 py-5 lg:py-6">
            <h2 className="font-heading-now text-[32px] lg:text-[40px] leading-none text-[#F1F1EE]">
              PERGUNTAS FREQUENTES
            </h2>
          </div>

          <div className="bg-[#023b39] px-10 lg:px-14 py-6 lg:py-8 flex flex-col gap-1">
            {FAQS.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 py-3 text-left"
                >
                  <span className="shrink-0 flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 border-white/40 font-sans font-bold text-[13px] text-white">
                    {index + 1}
                  </span>
                  <span className="font-sans font-bold text-[15px] lg:text-[16px] text-white leading-snug flex-1">
                    {faq.question}
                  </span>
                </button>
                {openIndex === index && faq.answer && (
                  <div className="flex gap-4 pb-4">
                    <div className="shrink-0 w-[38px] flex justify-center">
                      <div className="w-[2px] bg-white/20 rounded-full" />
                    </div>
                    <p className="font-sans font-medium text-[14px] lg:text-[15px] leading-relaxed text-white/80">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CurvedSection>
  );
}
