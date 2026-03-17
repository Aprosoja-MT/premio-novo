interface CityIllustrationProps {
  className?: string;
}

export function CityIllustration({ className }: CityIllustrationProps) {
  return (
    <div
      className={className}
      style={{ width: "100%", aspectRatio: "1280 / 522", position: "relative" }}
    >
      <img
        src="/assets/city-illustration-source.svg"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
