interface CityDrawProps {
  className?: string;
}

export function CityDraw({ className }: CityDrawProps) {
  return (
    <div
      className={className}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <img
        src="/assets/city-draw-source.svg"
        alt="Ilustração de cidade desenhada"
        draggable={false}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
