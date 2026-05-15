"use client";

import type { WeatherEffect } from "@/types/garden";

interface WeatherLayerProps {
  effect: WeatherEffect | null;
}

function pseudo(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const KEYFRAMES = `
  @keyframes weatherRain {
    from { transform: translateY(-10px); }
    to { transform: translateY(110px); }
  }
  @keyframes weatherPollen {
    0% { transform: translate(0px, 0px); opacity: 0; }
    8% { opacity: 0.5; }
    92% { opacity: 0.5; }
    100% { transform: translate(4px, -115px); opacity: 0; }
  }
  @keyframes weatherFirefly {
    0%, 100% { opacity: 0; }
    30%, 70% { opacity: 0.85; }
  }
  @keyframes weatherFog {
    from { transform: translateX(-60px); opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    to { transform: translateX(160px); opacity: 0; }
  }
  @keyframes weatherAurora {
    0%, 100% { transform: translateY(0px); opacity: 0.5; }
    50% { transform: translateY(3px); opacity: 0.85; }
  }
`;

function RainEffect() {
  const drops = Array.from({ length: 50 }, (_, i) => {
    const x = pseudo(i, 0) * 100;
    const len = 2 + pseudo(i, 1) * 3;
    return (
      <line
        key={i}
        x1={x}
        y1={0}
        x2={x + 0.3}
        y2={len}
        stroke="rgba(180,210,235,0.3)"
        strokeWidth={0.3}
        strokeLinecap="round"
        style={{
          animation: `weatherRain ${1.2 + pseudo(i, 3) * 0.8}s linear ${pseudo(i, 2) * 2}s infinite`,
        }}
      />
    );
  });
  return <>{drops}</>;
}

function PollenEffect() {
  const dots = Array.from({ length: 20 }, (_, i) => {
    const x = pseudo(i, 0) * 100;
    const startY = 85 + pseudo(i, 1) * 15;
    return (
      <circle
        key={i}
        cx={x}
        cy={startY}
        r={0.3 + pseudo(i, 2) * 0.35}
        fill={`hsla(${45 + pseudo(i, 5) * 20}, 80%, 65%, 0.5)`}
        style={{
          animation: `weatherPollen ${7 + pseudo(i, 4) * 5}s ease-in-out ${pseudo(i, 3) * 6}s infinite`,
        }}
      />
    );
  });
  return <>{dots}</>;
}

function FirefliesEffect() {
  const flies = Array.from({ length: 12 }, (_, i) => {
    const cx = 5 + pseudo(i, 0) * 90;
    const cy = 10 + pseudo(i, 1) * 80;
    const r = 0.3 + pseudo(i, 2) * 0.3;
    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill={`hsla(${48 + pseudo(i, 5) * 15}, 90%, 70%, 0.9)`}
        filter="url(#fireflyGlow)"
        style={{
          animation: `weatherFirefly ${3 + pseudo(i, 4) * 4}s ease-in-out ${pseudo(i, 3) * 5}s infinite`,
        }}
      />
    );
  });
  return (
    <>
      <defs>
        <filter id="fireflyGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {flies}
    </>
  );
}

function FogEffect() {
  const bands = Array.from({ length: 4 }, (_, i) => {
    const y = 55 + pseudo(i, 1) * 35;
    const h = 4 + pseudo(i, 2) * 6;
    const w = 30 + pseudo(i, 3) * 25;
    return (
      <rect
        key={i}
        x={0}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill="rgba(255,255,255,0.06)"
        style={{
          animation: `weatherFog ${15 + pseudo(i, 5) * 10}s linear ${pseudo(i, 4) * 12}s infinite`,
        }}
      />
    );
  });
  return <>{bands}</>;
}

function AuroraEffect() {
  const bands = [
    { hue: 140, y: 6, width: 3.5, delay: 0 },
    { hue: 200, y: 12, width: 4, delay: 1.5 },
    { hue: 290, y: 18, width: 3, delay: 3 },
  ];
  return (
    <>
      {bands.map((b, i) => (
        <path
          key={i}
          d={`M 0,${b.y} Q 25,${b.y - 3} 50,${b.y} T 100,${b.y}`}
          fill="none"
          stroke={`hsla(${b.hue},70%,55%,0.15)`}
          strokeWidth={b.width}
          strokeLinecap="round"
          style={{
            animation: `weatherAurora ${8 + i * 2}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function WeatherLayer({ effect }: WeatherLayerProps) {
  if (!effect) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <style>{KEYFRAMES}</style>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {effect === "rain" && <RainEffect />}
        {effect === "pollen" && <PollenEffect />}
        {effect === "fireflies" && <FirefliesEffect />}
        {effect === "fog" && <FogEffect />}
        {effect === "aurora" && <AuroraEffect />}
      </svg>
    </div>
  );
}
