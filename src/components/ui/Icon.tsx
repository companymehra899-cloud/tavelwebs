import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "car"
  | "map"
  | "coins"
  | "clock"
  | "plane"
  | "suitcase"
  | "calculator"
  | "route"
  | "fuel"
  | "toll"
  | "bolt"
  | "wallet"
  | "calendar"
  | "users"
  | "grid"
  | "exchange"
  | "globe"
  | "moon"
  | "backpack"
  | "check"
  | "hourglass"
  | "cash"
  | "road"
  | "receipt"
  | "search"
  | "heart"
  | "menu"
  | "close"
  | "arrow-right"
  | "arrow-down"
  | "chevron-down"
  | "copy"
  | "share"
  | "print"
  | "refresh"
  | "star"
  | "pin"
  | "sparkle"
  | "shield"
  | "sliders"
  | "download"
  | "compass"
  | "info"
  | "euro"
  | "plus";

const ICONS: Record<IconName, ReactNode> = {
  car: (
    <>
      <path d="M5 13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13" />
      <path d="M3 13h18v4.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z" />
      <path d="M7 19v1.5M17 19v1.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M15 5.2a5.5 5.5 0 1 1-9.8 9.6" />
      <path d="M9 7v4M7.8 8.2h2.4a1.2 1.2 0 0 1 0 2.4H7.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  plane: (
    <>
      <path d="M21.5 2.5 2.5 9.8l6.9 3 3 6.9 9.1-17.2Z" />
      <path d="M21.5 2.5 9.4 12.8" />
    </>
  ),
  suitcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12h18" />
    </>
  ),
  calculator: (
    <>
      <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
      <path d="M8.5 7h7" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01" />
      <path d="M8.5 19h7" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M9 19h7.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H15" />
    </>
  ),
  fuel: (
    <>
      <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5V21" />
      <path d="M3 21h10" />
      <path d="M4 12h8" />
      <path d="M12 9h2.5a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9.5L17 6" />
    </>
  ),
  toll: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 10v4M17.5 10v4" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />,
  wallet: (
    <>
      <path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M21 9.5A1.5 1.5 0 0 1 19.5 11H16a2.5 2.5 0 0 1 0-5h3.5A1.5 1.5 0 0 1 21 7.5v2Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M8 2.5v4M16 2.5v4M3.5 10h17" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" />
      <path d="M17.5 20a6 6 0 0 0-1.8-4.3" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  exchange: (
    <>
      <path d="M7 4v13M7 4 3.5 7.5M7 4l3.5 3.5" />
      <path d="M17 20V7M17 20l-3.5-3.5M17 20l3.5-3.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </>
  ),
  moon: <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a6.8 6.8 0 0 0 11 11Z" />,
  backpack: (
    <>
      <path d="M6.5 9V7a5.5 5.5 0 0 1 11 0v2" />
      <rect x="4" y="9" width="16" height="11.5" rx="2.5" />
      <path d="M9 9V6.5M15 9V6.5" />
      <path d="M4 14.5h16" />
    </>
  ),
  check: <path d="M20 6.5 9.5 17 4 11.5" />,
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M6.5 3c0 4 5.5 6 5.5 9s-5.5 5-5.5 9" />
      <path d="M17.5 3c0 4-5.5 6-5.5 9s5.5 5 5.5 9" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  road: (
    <>
      <path d="M4 21 7.5 3M20 21 16.5 3" />
      <path d="M12 5v3M12 11v3M12 17v2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-1.8-3 1.8-3-1.8L6 21V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  heart: (
    <path d="M12 20.5S3.5 15.6 3.5 9.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.5 3.6c0 5.8-8.5 10.7-8.5 10.7Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.8" />
      <circle cx="6" cy="12" r="2.8" />
      <circle cx="18" cy="19" r="2.8" />
      <path d="m8.5 10.8 7-4.1M8.5 13.2l7 4.1" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3.5h10V9" />
      <rect x="4" y="9" width="16" height="8" rx="2" />
      <path d="M7 17h10v4H7z" />
    </>
  ),
  refresh: (
    <>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9L21 9" />
      <path d="M21 3.5V9h-5.5" />
      <path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3 15" />
      <path d="M3 20.5V15h5.5" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  pin: (
    <>
      <path d="M12 21.5s7-6.3 7-11.5a7 7 0 1 0-14 0c0 5.2 7 11.5 7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8L12 3.5Z" />
  ),
  shield: <path d="M12 3.5 5.5 6.2v5.9c0 4.1 2.9 7.3 6.5 9.4 3.6-2.1 6.5-5.3 6.5-9.4V6.2L12 3.5Z" />,
  sliders: (
    <>
      <path d="M4 7.5h9M18.5 7.5H20M4 16.5h2M11.5 16.5H20" />
      <circle cx="15.5" cy="7.5" r="2.2" />
      <circle cx="8.5" cy="16.5" r="2.2" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5V15M7.5 10.5 12 15l4.5-4.5" />
      <path d="M5 20.5h14" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-1.9 5.1-5.1 1.9 1.9-5.1 5.1-1.9Z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
  euro: (
    <>
      <path d="M17.5 6.6A6.5 6.5 0 1 0 17.5 17.4" />
      <path d="M4.5 10h9M4.5 14h9" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, strokeWidth = 1.75, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {ICONS[name]}
    </svg>
  );
}

export function isIconName(value: string): value is IconName {
  return value in ICONS;
}

export function resolveIcon(value: string): IconName {
  return isIconName(value) ? value : "calculator";
}
