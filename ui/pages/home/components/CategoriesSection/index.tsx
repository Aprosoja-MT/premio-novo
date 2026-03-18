import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CurvedSection } from "~/components/ui/CurvedSection";
import { FadeIn } from "~/components/ui/FadeIn";
import {
  CATEGORY_CARDS,
  SLIDES,
  useCategoriesSectionController,
} from "./useCategoriesSectionController";

export function CategoriesSection() {
  const { podiumSwiper, cardsSwiper, slidePodiumPrev, slidePodiumNext, slideCardsPrev, slideCardsNext } =
    useCategoriesSectionController();

  return (
    <CurvedSection fillColor="#F0F0ED" bgAbove="#0B4B49" id="categoria">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-4">
          <FadeIn direction="right" className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            <h2 className="font-heading-now text-[36px] sm:text-[44px] lg:text-[64px] leading-[42px] sm:leading-[50px] lg:leading-[67px] text-[#024240] text-center lg:text-left">
              CONFIRA AS
              <br />
              PREMIAÇÕES
              <br />
              POR CATEGORIA
            </h2>
            <img
              src="/assets/photograph-draw.png"
              alt=""
              className="w-[220px] sm:w-[320px] lg:w-[420px] select-none -mt-4 sm:-mt-6"
              draggable={false}
            />
          </FadeIn>

          <FadeIn direction="left" delay={0.15} className="flex flex-col items-center gap-4 pt-0 lg:pt-2 flex-1 min-w-0 w-full">
            <div className="relative w-full flex items-center gap-2 sm:gap-3">
              <button
                onClick={slidePodiumPrev}
                className="shrink-0 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
                aria-label="Slide anterior"
              >
                <ChevronLeft size={28} strokeWidth={2.5} />
              </button>

              <Swiper
                ref={podiumSwiper}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                loop
                className="w-full categories-swiper"
              >
                {SLIDES.map((slide) => (
                  <SwiperSlide key={slide.category}>
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <button className="bg-[#94D2B9] rounded-full px-6 sm:px-8 h-[44px] sm:h-[50px] lg:h-[55px] font-heading-now text-[20px] sm:text-[24px] lg:text-[32px] leading-none text-[#024240] whitespace-nowrap pointer-events-none">
                        {slide.category}
                      </button>
                      <img
                        src={slide.podium}
                        alt={`Pódio ${slide.category}`}
                        className="w-full max-w-[320px] sm:max-w-[560px] lg:max-w-[680px] select-none"
                        draggable={false}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={slidePodiumNext}
                className="shrink-0 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
                aria-label="Próximo slide"
              >
                <ChevronRight size={28} strokeWidth={2.5} />
              </button>
            </div>

            <p className="font-sans text-[11px] font-semibold tracking-widest text-[#024240]/50 uppercase">
              ARRASTE PARA O LADO
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="relative flex items-center justify-center mt-6 sm:mt-8 h-[44px] sm:h-[54px]">
            <img
              src="/assets/categories-divider.svg"
              alt=""
              className="absolute inset-0 w-full h-full select-none"
              style={{ objectFit: "fill" }}
              draggable={false}
            />
            <span className="relative font-heading-now text-[24px] sm:text-[32px] lg:text-[43px] leading-none text-[#024240] mt-3 sm:mt-5">
              CATERGORIAS
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div id="carrossel-categorias" className="relative z-10 mx-auto mt-6 sm:mt-8 mb-[-200px] sm:mb-[-260px] lg:mb-[-300px] max-w-[1156px] rounded-[20px] sm:rounded-[29px] backdrop-blur-[30px] bg-[rgba(148,210,185,0.86)] px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-10">
            <div className="relative">
              <button
                onClick={slideCardsPrev}
                className="hidden sm:flex absolute left-[-36px] lg:left-[-48px] top-1/2 -translate-y-1/2 z-10 items-center justify-center w-[28px] h-[28px] text-[#024240]"
                aria-label="Card anterior"
              >
                <ChevronLeft size={28} strokeWidth={2.5} />
              </button>

              <Swiper
                ref={cardsSwiper}
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 12 },
                  1024: { slidesPerView: 3, spaceBetween: 16 },
                }}
                spaceBetween={12}
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                style={{ alignItems: "stretch" }}
              >
                {CATEGORY_CARDS.map((card) => (
                  <SwiperSlide key={card.title} className="h-auto!">
                    <div className="bg-[rgba(188,233,215,0.85)] rounded-[14px] sm:rounded-[17px] p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 h-full">
                      <h3 className="font-heading-now text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1] text-[#024240] whitespace-pre-line">
                        {card.title}
                      </h3>
                      <p className="font-sans font-medium text-[13px] sm:text-[14px] lg:text-[15px] leading-[19px] text-[#024240]">
                        {card.text}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={slideCardsNext}
                className="hidden sm:flex absolute right-[-36px] lg:right-[-48px] top-1/2 -translate-y-1/2 z-10 items-center justify-center w-[28px] h-[28px] text-[#024240]"
                aria-label="Próximo card"
              >
                <ChevronRight size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </CurvedSection>
  );
}
