import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CurvedSection } from "~/components/ui/CurvedSection";
import {
  CATEGORY_CARDS,
  SLIDES,
  useCategoriesSectionController,
} from "./useCategoriesSectionController";

export function CategoriesSection() {
  const { podiumSwiper, cardsSwiper, slidePodiumPrev, slidePodiumNext, slideCardsPrev, slideCardsNext } =
    useCategoriesSectionController();

  return (
    <CurvedSection fillColor="#F0F0ED" bgAbove="#0B4B49">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="font-heading-now text-[44px] lg:text-[64px] leading-[50px] lg:leading-[67px] text-[#024240]">
              CONFIRA AS
              <br />
              PREMIAÇÕES
              <br />
              POR CATEGORIA
            </h2>
            <img
              src="/assets/photograph-draw.png"
              alt=""
              className="w-[320px] lg:w-[420px] select-none -mt-6"
              draggable={false}
            />
          </div>

          <div className="flex flex-col items-center gap-4 pt-2 flex-1 min-w-0">
            <div className="relative w-full flex items-center gap-3">
              <button
                onClick={slidePodiumPrev}
                className="shrink-0 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
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
                    <div className="flex flex-col items-center gap-4">
                      <button className="bg-[#94D2B9] rounded-full px-8 h-[50px] lg:h-[55px] font-heading-now text-[24px] lg:text-[32px] leading-none text-[#024240] whitespace-nowrap pointer-events-none">
                        {slide.category}
                      </button>
                      <img
                        src={slide.podium}
                        alt={`Pódio ${slide.category}`}
                        className="w-full max-w-[560px] lg:max-w-[680px] select-none"
                        draggable={false}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={slidePodiumNext}
                className="shrink-0 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
              >
                <ChevronRight size={28} strokeWidth={2.5} />
              </button>
            </div>

            <p className="font-sans text-[11px] font-semibold tracking-widest text-[#024240]/50 uppercase">
              ARRASTE PARA O LADO
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center mt-8 h-[54px]">
          <img
            src="/assets/categories-divider.svg"
            alt=""
            className="absolute inset-0 w-full h-full select-none"
            style={{ objectFit: "fill" }}
            draggable={false}
          />
          <span className="relative font-heading-now text-[32px] lg:text-[43px] leading-none text-[#024240] mt-5">
            CATERGORIAS
          </span>
        </div>

        <div className="relative z-10 mx-auto mt-8 mb-[-300px] max-w-[1156px] rounded-[29px] backdrop-blur-[30px] bg-[rgba(148,210,185,0.86)] px-14 lg:px-16 py-8 lg:py-10">
          <div className="relative">
            <button
              onClick={slideCardsPrev}
              className="absolute left-[-48px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>

            <Swiper
              ref={cardsSwiper}
              modules={[Navigation]}
              slidesPerView={3}
              spaceBetween={16}
              loop
              style={{ alignItems: "stretch" }}
            >
              {CATEGORY_CARDS.map((card) => (
                <SwiperSlide key={card.title} className="h-auto!">
                  <div className="bg-[rgba(188,233,215,0.85)] rounded-[17px] p-8 flex flex-col gap-4 h-full">
                    <h3 className="font-heading-now text-[36px] lg:text-[48px] leading-[1.1] text-[#024240] whitespace-pre-line">
                      {card.title}
                    </h3>
                    <p className="font-sans font-medium text-[14px] lg:text-[15px] leading-[19px] text-[#024240]">
                      {card.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={slideCardsNext}
              className="absolute right-[-48px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-[28px] h-[28px] text-[#024240]"
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </CurvedSection>
  );
}
