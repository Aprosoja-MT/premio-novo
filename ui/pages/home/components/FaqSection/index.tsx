import { CurvedSection } from '~/components/ui/CurvedSection';
import { FadeIn } from '~/components/ui/FadeIn';
import { FAQS, useFaqSectionController } from './useFaqSectionController';

export function FaqSection() {
  const { openIndex, toggle } = useFaqSectionController();

  return (
    <CurvedSection fillColor="#0B4B49" bgAbove="#F0F0ED" id="faq">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] sm:pt-[150px] lg:pt-[180px] pb-10 sm:pb-12 lg:pb-16">
        <FadeIn>
          <div className="mx-auto max-w-[1156px] rounded-[20px] sm:rounded-[29px] overflow-hidden">
            <div className="bg-[#002827] px-6 sm:px-10 lg:px-14 py-4 sm:py-5 lg:py-6">
              <h2 className="font-heading-now text-[24px] sm:text-[32px] lg:text-[40px] leading-none text-[#F1F1EE]">
                PERGUNTAS FREQUENTES
              </h2>
            </div>

            <div className="bg-[#023b39] px-6 sm:px-10 lg:px-14 py-5 sm:py-6 lg:py-8 flex flex-col gap-1">
              {FAQS.map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center gap-3 sm:gap-4 py-3 text-left"
                  >
                    <span className="shrink-0 flex items-center justify-center w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border-2 border-white/40 font-sans font-bold text-[12px] sm:text-[13px] text-white">
                      {index + 1}
                    </span>
                    <span className="font-sans font-bold text-[14px] sm:text-[15px] lg:text-[16px] text-white leading-snug flex-1">
                      {faq.question}
                    </span>
                  </button>
                  {faq.answer && (
                    <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="flex gap-3 sm:gap-4 pb-4">
                          <div className="shrink-0 w-[34px] sm:w-[38px] flex justify-center">
                            <div className="w-[2px] bg-white/20 rounded-full" />
                          </div>
                          <p className="font-sans font-medium text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed text-white/80">
                            {faq.answer.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < faq.answer.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </CurvedSection>
  );
}
