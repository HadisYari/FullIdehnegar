export function   LiquidWaveTop() {
  const waves = [
    {
      d: "M0,55 C150,20 350,90 500,55 C650,20 850,90 1000,55 L1000,100 L0,100 Z",
      opacity: 0.12,
      anim: "animate-wave-slower",
    },
    {
      d: "M0,58 C180,30 320,85 500,58 C680,30 820,85 1000,58 L1000,100 L0,100 Z",
      opacity: 0.2,
      anim: "animate-wave-slow",
    },
    {
      d: "M0,62 C120,40 280,88 500,62 C720,36 880,80 1000,62 L1000,100 L0,100 Z",
      opacity: 0.32,
      anim: "animate-wave-medium",
    },
    {
      d: "M0,66 C200,42 360,90 500,66 C640,42 800,90 1000,66 L1000,100 L0,100 Z",
      opacity: 0.48,
      anim: "animate-wave-fast",
    },
    {
      d: "M0,72 C160,48 340,92 500,72 C660,52 840,92 1000,72 L1000,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-faster",
      fill: "#0f0f52",
    },
  ];

  return (
    <div className="absolute left-0 top-0 z-0 w-full -translate-y-[88%] overflow-hidden leading-none pointer-events-none">
      <div className="relative h-[80px] w-full sm:h-[110px] md:h-[150px]">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-[80px] w-1/2 sm:h-[110px] md:h-[150px]">
                <path d={wave.d} fill={wave.fill || "#e6304c"} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}