import type { TripType } from "../types";

export interface PackingItem {
  id: string;
  label: string;
  category: string;
}

const BASE_ITEMS: PackingItem[] = [
  { id: "passport", label: "Passport / ID", category: "Documents" },
  { id: "tickets", label: "Tickets and reservations", category: "Documents" },
  { id: "insurance", label: "Travel insurance details", category: "Documents" },
  { id: "cards", label: "Bank cards and some cash", category: "Documents" },
  { id: "underwear", label: "Underwear", category: "Clothing" },
  { id: "socks", label: "Socks", category: "Clothing" },
  { id: "tops", label: "Tops / shirts", category: "Clothing" },
  { id: "bottoms", label: "Trousers / shorts", category: "Clothing" },
  { id: "sleepwear", label: "Sleepwear", category: "Clothing" },
  { id: "toothbrush", label: "Toothbrush and toothpaste", category: "Toiletries" },
  { id: "deodorant", label: "Deodorant", category: "Toiletries" },
  { id: "shampoo", label: "Shampoo / soap", category: "Toiletries" },
  { id: "phone", label: "Phone and charger", category: "Electronics" },
  { id: "adapter", label: "Plug adapter", category: "Electronics" },
  { id: "meds", label: "Regular medication", category: "Medication reminder" },
  { id: "firstaid", label: "Small first-aid items", category: "Medication reminder" },
  { id: "bag", label: "Day bag", category: "Travel accessories" },
  { id: "water", label: "Reusable water bottle", category: "Travel accessories" },
  { id: "snacks", label: "Snacks for travel days", category: "Miscellaneous" },
];

const TYPE_EXTRAS: Record<TripType, PackingItem[]> = {
  business: [
    { id: "blazer", label: "Smart jacket", category: "Clothing" },
    { id: "laptop", label: "Laptop and charger", category: "Electronics" },
  ],
  beach: [
    { id: "swim", label: "Swimwear", category: "Clothing" },
    { id: "sunscreen", label: "Sunscreen", category: "Toiletries" },
    { id: "sandals", label: "Sandals", category: "Clothing" },
  ],
  city: [
    { id: "comfy-shoes", label: "Comfortable walking shoes", category: "Clothing" },
    { id: "city-map", label: "Offline maps downloaded", category: "Electronics" },
  ],
  hiking: [
    { id: "boots", label: "Hiking boots", category: "Clothing" },
    { id: "rain", label: "Rain jacket", category: "Clothing" },
    { id: "headlamp", label: "Headlamp", category: "Travel accessories" },
  ],
  winter: [
    { id: "coat", label: "Warm coat", category: "Clothing" },
    { id: "gloves", label: "Gloves and hat", category: "Clothing" },
  ],
  summer: [
    { id: "hat", label: "Sun hat", category: "Clothing" },
    { id: "light", label: "Light breathable clothing", category: "Clothing" },
  ],
  family: [
    { id: "kids-docs", label: "Children's documents", category: "Documents" },
    { id: "snacks-family", label: "Extra snacks", category: "Miscellaneous" },
  ],
  backpacking: [
    { id: "lock", label: "Padlock", category: "Travel accessories" },
    { id: "quickdry", label: "Quick-dry clothing", category: "Clothing" },
  ],
};

export function generatePackingList(input: {
  days: number;
  month: number;
  tripType: TripType;
}): PackingItem[] {
  const items = [...BASE_ITEMS, ...TYPE_EXTRAS[input.tripType]];
  if (input.days >= 7) {
    items.push({ id: "laundry", label: "Laundry bag / detergent sheets", category: "Miscellaneous" });
  }
  if (input.month >= 11 || input.month <= 2) {
    items.push({ id: "layers", label: "Warm layers", category: "Clothing" });
  }
  if (input.month >= 6 && input.month <= 8) {
    items.push({ id: "sunglasses", label: "Sunglasses", category: "Travel accessories" });
  }
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
