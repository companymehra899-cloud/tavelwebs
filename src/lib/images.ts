export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80";

export const CATEGORY_IMAGES: Record<string, string> = {
  "road-trips":
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
  "travel-budget":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  "travel-time":
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  "travel-planning":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  currency:
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=900&q=80",
};

const TOOL_IMAGES: Record<string, string> = {
  "road-trip-cost-calculator":
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
  "fuel-cost-calculator":
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80",
  "fuel-toll-calculator":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  "ev-charging-cost-calculator":
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
  "driving-cost-calculator":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
  "travel-budget-calculator":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  "daily-travel-budget-calculator":
    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80",
  "cost-per-person-calculator":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  "travel-money-calculator":
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80",
  "trip-cost-calculator":
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80",
  "currency-converter":
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=900&q=80",
  "multi-currency-converter":
    "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&w=900&q=80",
  "currency-exchange-calculator":
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80",
  "time-zone-converter":
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
  "jet-lag-calculator":
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=900&q=80",
  "flight-time-calculator":
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  "layover-calculator":
    "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80",
  "trip-duration-calculator":
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80",
  "packing-list-generator":
    "https://images.unsplash.com/photo-1553531384-cc95ac17e38e?auto=format&fit=crop&w=900&q=80",
  "travel-checklist":
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
  "trip-countdown":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
};

export function toolImage(slug: string, category?: string): string {
  return TOOL_IMAGES[slug] ?? (category ? CATEGORY_IMAGES[category] : HERO_IMAGE) ?? HERO_IMAGE;
}

export function categoryImage(categoryId: string): string {
  return CATEGORY_IMAGES[categoryId] ?? HERO_IMAGE;
}
