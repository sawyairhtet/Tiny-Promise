import type { SVGProps } from "react";
import type { ArchetypeKey } from "../config/flowerPalettes";

type IconProps = SVGProps<SVGSVGElement>;

const STROKE = "currentColor";
const FILL = "currentColor";

function Svg(props: IconProps & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function LotusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 18c-4 0-7-2.5-7-5 1.5.5 3 1 5 1-1.5-1-2.5-3-2.5-5 1.8.7 3.2 1.9 4.5 3.5C13.3 11 14.7 9.7 16.5 9c0 2-1 4-2.5 5 2 0 3.5-.5 5-1 0 2.5-3 5-7 5z"
        fill={FILL}
      />
      <path d="M12 18v2" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function LilyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 4c1.5 2 1.5 5 0 7-1.5-2-1.5-5 0-7zM5 9.5c2 .2 4 1.7 5 4-2.5-.2-4.7-1.5-5-4zM19 9.5c-.3 2.5-2.5 3.8-5 4 1-2.3 3-3.8 5-4zM7 14c1.8 0 3.5 1.2 4 3.5-2-.2-3.5-1.5-4-3.5zM17 14c-.5 2-2 3.3-4 3.5.5-2.3 2.2-3.5 4-3.5z"
        fill={FILL}
      />
      <circle cx="12" cy="12" r="1.2" fill={FILL} />
      <path d="M12 17v3" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function RoseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="10" r="5" fill={FILL} opacity="0.85" />
      <path
        d="M12 7c1.5 0 2.5 1 2.5 2.5S13.5 12 12 12s-2.5-1-2.5-2.5S10.5 7 12 7z"
        fill={STROKE}
        opacity="0.35"
      />
      <path d="M12 15v5" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 18c1.5-.5 2.5-1.8 2.5-3"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TulipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 4c-2 1.5-4 4-4 6.5 0 1.5 1 2.5 2 2.5V7c.7-1.2 1.3-2.2 2-3z"
        fill={FILL}
      />
      <path
        d="M12 4c2 1.5 4 4 4 6.5 0 1.5-1 2.5-2 2.5V7c-.7-1.2-1.3-2.2-2-3z"
        fill={FILL}
      />
      <path
        d="M12 5c-.6 1.2-1 2.5-1 4v4.5h2V9c0-1.5-.4-2.8-1-4z"
        fill={FILL}
      />
      <path d="M12 13.5V20" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function CherryBlossomIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g transform="translate(12 11)">
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * 4;
          const y = Math.sin(a) * 4;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="2.4"
              ry="3.2"
              transform={`rotate(${(i * 72).toFixed(1)} ${x} ${y})`}
              fill={FILL}
            />
          );
        })}
        <circle r="1.4" fill={STROKE} opacity="0.65" />
      </g>
      <path
        d="M14 14c2 1 3.5 3 4 6"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function BluebellIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 4v8" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M6.5 9c.3 2.2 1.4 3.6 2.5 4 1.1-.4 2.2-1.8 2.5-4-.5.4-1.5.6-2.5.6S7 9.4 6.5 9z"
        fill={FILL}
      />
      <path
        d="M11.5 12c.3 2.2 1.4 3.6 2.5 4 1.1-.4 2.2-1.8 2.5-4-.5.4-1.5.6-2.5.6s-2-.2-2.5-.6z"
        fill={FILL}
      />
      <path
        d="M16 15c.3 2 1.4 3.4 2.5 3.8 1.1-.4 2.2-1.8 2.5-3.8-.5.4-1.5.6-2.5.6s-2-.2-2.5-.6z"
        fill={FILL}
        opacity="0.85"
      />
    </Svg>
  );
}

function IrisIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 3c-1 2-1 4 0 6 1-2 1-4 0-6z"
        fill={FILL}
      />
      <path
        d="M5 11c2.5-1 5-1 7 0-1.5 1.5-4 2-7 0z"
        fill={FILL}
      />
      <path
        d="M19 11c-2.5-1-5-1-7 0 1.5 1.5 4 2 7 0z"
        fill={FILL}
      />
      <path
        d="M12 11c-1 2.5-1 5 0 7 1-2.5 1-5 0-7z"
        fill={FILL}
        opacity="0.85"
      />
      <circle cx="12" cy="11" r="1.3" fill={STROKE} opacity="0.7" />
      <path d="M12 18v2" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function DaffodilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g transform="translate(12 10)">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const x = Math.cos(a) * 4;
          const y = Math.sin(a) * 4;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="2"
              ry="3"
              transform={`rotate(${((i * 60) + 90).toFixed(1)} ${x} ${y})`}
              fill={FILL}
              opacity="0.85"
            />
          );
        })}
        <circle r="2.2" fill={STROKE} opacity="0.55" />
        <circle r="1.3" fill={STROKE} />
      </g>
      <path d="M12 16v4" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function OrchidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 4c-2 1.5-3 3.5-3 5.5 1 .5 2 .8 3 .8s2-.3 3-.8c0-2-1-4-3-5.5z"
        fill={FILL}
      />
      <path
        d="M6 8c-1 2-1 4 0 5.5 1.5-.5 2.8-1.5 3.5-3-1-.8-2.2-1.8-3.5-2.5z"
        fill={FILL}
      />
      <path
        d="M18 8c1 2 1 4 0 5.5-1.5-.5-2.8-1.5-3.5-3 1-.8 2.2-1.8 3.5-2.5z"
        fill={FILL}
      />
      <path
        d="M9.5 13c.5 1.5 1.5 2.5 2.5 3 1-.5 2-1.5 2.5-3-.8.3-1.6.4-2.5.4s-1.7-.1-2.5-.4z"
        fill={FILL}
      />
      <circle cx="12" cy="11" r="1.2" fill={STROKE} opacity="0.7" />
      <path d="M12 16v4" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function DahliaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g transform="translate(12 11)">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = Math.cos(a) * 3.5;
          const y = Math.sin(a) * 3.5;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="1.4"
              ry="2.8"
              transform={`rotate(${((i * 30) + 90).toFixed(1)} ${x} ${y})`}
              fill={FILL}
              opacity={i % 2 === 0 ? 1 : 0.7}
            />
          );
        })}
        <circle r="1.6" fill={STROKE} opacity="0.55" />
      </g>
      <path d="M12 17v3" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function WisteriaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3v3" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="8" cy="7" rx="2.2" ry="1.6" fill={FILL} opacity="0.85" />
      <ellipse cx="8" cy="10" rx="1.8" ry="1.4" fill={FILL} opacity="0.85" />
      <ellipse cx="8" cy="13" rx="1.4" ry="1.2" fill={FILL} opacity="0.85" />
      <ellipse cx="8" cy="15.5" rx="1" ry="0.9" fill={FILL} opacity="0.85" />

      <ellipse cx="14" cy="9" rx="2" ry="1.5" fill={FILL} opacity="0.75" />
      <ellipse cx="14" cy="12" rx="1.6" ry="1.3" fill={FILL} opacity="0.75" />
      <ellipse cx="14" cy="14.5" rx="1.2" ry="1.1" fill={FILL} opacity="0.75" />
      <ellipse cx="14" cy="16.5" rx="0.9" ry="0.8" fill={FILL} opacity="0.75" />
      <path d="M14 6v2" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function LavenderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 20V10" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="12" cy="4" rx="1.4" ry="1.8" fill={FILL} />
      <ellipse cx="11" cy="6" rx="1.4" ry="1.4" fill={FILL} />
      <ellipse cx="13" cy="6.5" rx="1.4" ry="1.4" fill={FILL} />
      <ellipse cx="11" cy="8.5" rx="1.4" ry="1.3" fill={FILL} />
      <ellipse cx="13" cy="9" rx="1.4" ry="1.3" fill={FILL} />
      <ellipse cx="12" cy="10.5" rx="1.3" ry="1.2" fill={FILL} />
      <path d="M9 14l-2 4" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M15 14l2 4" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

const ICONS: Record<ArchetypeKey, (p: IconProps) => React.ReactElement> = {
  lotus: LotusIcon,
  lily: LilyIcon,
  rose: RoseIcon,
  tulip: TulipIcon,
  cherryBlossom: CherryBlossomIcon,
  bluebell: BluebellIcon,
  iris: IrisIcon,
  daffodil: DaffodilIcon,
  orchid: OrchidIcon,
  dahlia: DahliaIcon,
  wisteria: WisteriaIcon,
  lavender: LavenderIcon,
};

export interface FlowerIconProps extends IconProps {
  archetype: ArchetypeKey;
}

export function FlowerIcon({ archetype, ...rest }: FlowerIconProps) {
  const Icon = ICONS[archetype];
  return <Icon {...rest} />;
}
