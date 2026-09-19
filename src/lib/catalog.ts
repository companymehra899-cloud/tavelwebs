import type { ToolCategoryId, ToolFaq } from "./types";

export interface ToolExplanation {
  heading: string;
  body: string;
}

export interface ToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategoryId;
  categoryLabel: string;
  keywords: string[];
  related: string[];
  explanation: ToolExplanation[];
  formula: string;
  faqs: ToolFaq[];
  icon: string;
}

export const CATEGORIES: { id: ToolCategoryId; label: string; description: string }[] = [
  {
    id: "road-trips",
    label: "Road Trip Tools",
    description: "Work out fuel, toll and driving costs before you set off.",
  },
  {
    id: "travel-budget",
    label: "Travel Budget",
    description: "Plan trip costs, daily spend and cost per person.",
  },
  {
    id: "travel-time",
    label: "Travel Time",
    description: "Time zones, flight times, layovers and jet lag planning.",
  },
  {
    id: "travel-planning",
    label: "Travel Planning",
    description: "Packing lists, checklists and countdowns for your trip.",
  },
  {
    id: "currency",
    label: "Currency",
    description: "Convert between major travel currencies using live rates.",
  },
];

export const TOOLS: ToolMeta[] = [
  {
    slug: "road-trip-cost-calculator",
    title: "Road Trip Cost Calculator",
    shortTitle: "Road Trip Cost",
    description:
      "Estimate the full cost of a road trip including fuel, tolls, parking, accommodation and other expenses, with a per-person breakdown.",
    category: "road-trips",
    categoryLabel: "Road Trip Tools",
    keywords: ["road trip", "fuel", "toll", "driving", "cost", "route"],
    related: [
      "fuel-cost-calculator",
      "fuel-toll-calculator",
      "ev-charging-cost-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "What this road trip calculator does",
        body: "It combines your route distance, vehicle fuel consumption and fuel price with optional toll, parking, accommodation and other costs to produce a total trip cost and a per-person share.",
      },
      {
        heading: "How the fuel cost is calculated",
        body: "Fuel required is distance multiplied by fuel consumption per 100 km, divided by 100. Fuel cost is fuel required multiplied by the price per litre (or gallon in imperial mode).",
      },
    ],
    formula:
      "Fuel required = distance × consumption ÷ 100. Fuel cost = fuel required × fuel price. Total = fuel + tolls + parking + accommodation + other.",
    faqs: [
      {
        question: "Does the calculator include return travel?",
        answer:
          "Yes. Choose one-way or round trip and the distance is doubled automatically for a round trip.",
      },
      {
        question: "Are toll prices live?",
        answer:
          "No. Tolls are entered by you, because toll prices vary by route, vehicle and time. The tool never invents toll data.",
      },
    ],
    icon: "car",
  },
  {
    slug: "fuel-cost-calculator",
    title: "Fuel Cost Calculator",
    shortTitle: "Fuel Cost",
    description:
      "Calculate how much fuel a journey needs and what it costs, with support for km or miles, L/100km or MPG, petrol or diesel.",
    category: "road-trips",
    categoryLabel: "Road Trip Tools",
    keywords: ["fuel", "petrol", "diesel", "mpg", "l/100km", "cost", "petrol cost"],
    related: [
      "road-trip-cost-calculator",
      "fuel-toll-calculator",
      "ev-charging-cost-calculator",
      "driving-cost-calculator",
    ],
    explanation: [
      {
        heading: "Metric and imperial support",
        body: "Switch between kilometres and miles, and between litres per 100 km and miles per gallon. Conversions use standard factors so results stay consistent.",
      },
      {
        heading: "Cost per km and mile",
        body: "The tool also shows the fuel cost per kilometre and per mile so you can compare journeys or vehicles.",
      },
    ],
    formula:
      "Fuel required = distance × consumption ÷ 100 (metric) or miles ÷ MPG × 4.546 for imperial gallons.",
    faqs: [
      {
        question: "Which MPG does this use?",
        answer:
          "Imperial mode uses US gallons for MPG. If you know your figure in imperial gallons, multiply by 1.201 to convert.",
      },
      {
        question: "Can I use it for a round trip?",
        answer: "Yes. Double your distance, or use the Road Trip Cost Calculator which has a round-trip toggle.",
      },
    ],
    icon: "fuel",
  },
  {
    slug: "fuel-toll-calculator",
    title: "Fuel + Toll Calculator",
    shortTitle: "Fuel + Toll",
    description:
      "Add fuel and toll costs together for a driving journey and see the total and per-person share.",
    category: "road-trips",
    categoryLabel: "Road Trip Tools",
    keywords: ["fuel", "toll", "motorway", "driving", "cost"],
    related: [
      "road-trip-cost-calculator",
      "fuel-cost-calculator",
      "driving-cost-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "Why enter tolls yourself",
        body: "Toll data is route and vehicle specific and changes frequently. Enter the toll amount you expect so the tool never shows invented prices.",
      },
      {
        heading: "Combining costs",
        body: "The calculator adds fuel and tolls to give a total driving cost, then divides by the number of travellers for a per-person figure.",
      },
    ],
    formula: "Total driving cost = fuel cost + tolls. Cost per person = total ÷ travellers.",
    faqs: [
      {
        question: "Can toll data be connected later?",
        answer:
          "Yes. Toll costs are handled behind a service layer, so a live rating API can be connected without changing the UI.",
      },
    ],
    icon: "toll",
  },
  {
    slug: "ev-charging-cost-calculator",
    title: "EV Charging Cost Calculator",
    shortTitle: "EV Charging Cost",
    description:
      "Estimate the electricity needed and charging cost for an electric vehicle journey, for home or public charging.",
    category: "road-trips",
    categoryLabel: "Road Trip Tools",
    keywords: ["ev", "electric vehicle", "charging", "kwh", "cost"],
    related: [
      "road-trip-cost-calculator",
      "fuel-cost-calculator",
      "driving-cost-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "Energy required",
        body: "Energy needed for the drive is distance multiplied by consumption in kWh per 100 km, divided by 100. If you plan to charge from a starting percentage to a target percentage, the tool uses the larger of the drive energy and the battery top-up energy.",
      },
      {
        heading: "Home vs public charging",
        body: "Choose home or public charging and enter the price per kWh that applies to you. Prices are user-provided because tariffs differ a lot.",
      },
    ],
    formula:
      "Energy = distance × kWh/100km ÷ 100. Cost = energy × price per kWh. Cost per km = cost ÷ distance.",
    faqs: [
      {
        question: "Why is battery capacity needed?",
        answer:
          "Battery capacity converts a percentage charge into kWh, so the tool can estimate the cost of topping up to your target level.",
      },
    ],
    icon: "bolt",
  },
  {
    slug: "travel-budget-calculator",
    title: "Travel Budget Calculator",
    shortTitle: "Travel Budget",
    description:
      "Build a full trip budget from accommodation, food, transport, activities and other costs, with totals per traveller and per day.",
    category: "travel-budget",
    categoryLabel: "Travel Budget",
    keywords: ["travel budget", "trip cost", "holiday budget", "vacation cost"],
    related: [
      "daily-travel-budget-calculator",
      "cost-per-person-calculator",
      "travel-money-calculator",
      "trip-cost-calculator",
    ],
    explanation: [
      {
        heading: "Build a realistic budget",
        body: "Enter your nightly accommodation, daily food spend, transport, activities and any other costs. The tool totals each category and shows the trip total, cost per traveller and a daily budget.",
      },
      {
        heading: "Editable presets",
        body: "Budget, mid-range and comfortable presets fill in starting values you can freely edit. They are not recommendations, only a convenient starting point.",
      },
    ],
    formula:
      "Accommodation = nightly rate × nights. Food = daily food × days × travellers. Total = sum of all categories.",
    faqs: [
      {
        question: "How are nights calculated?",
        answer: "Nights are days minus one, with a minimum of one night.",
      },
      {
        question: "Can I budget for several people?",
        answer: "Yes. Food and totals scale with the number of travellers you enter.",
      },
    ],
    icon: "wallet",
  },
  {
    slug: "daily-travel-budget-calculator",
    title: "Daily Travel Budget Calculator",
    shortTitle: "Daily Travel Budget",
    description:
      "Turn your daily accommodation, food, transport and activity costs into a daily, weekly and full-trip total.",
    category: "travel-budget",
    categoryLabel: "Travel Budget",
    keywords: ["daily budget", "per day", "travel spend", "holiday budget"],
    related: [
      "travel-budget-calculator",
      "cost-per-person-calculator",
      "travel-money-calculator",
      "trip-cost-calculator",
    ],
    explanation: [
      {
        heading: "From daily to trip total",
        body: "Add your typical daily costs and the number of trip days. The tool shows a daily total, a weekly total and the full trip total.",
      },
    ],
    formula: "Daily total = accommodation + food + local transport + activities + other. Trip total = daily total × days.",
    faqs: [
      {
        question: "Does the weekly total assume seven days?",
        answer: "Yes. The weekly figure multiplies the daily total by seven for easy comparison.",
      },
    ],
    icon: "calendar",
  },
  {
    slug: "cost-per-person-calculator",
    title: "Cost Per Person Calculator",
    shortTitle: "Cost Per Person",
    description:
      "Split a trip cost equally or by custom shares and see exactly what each traveller pays.",
    category: "travel-budget",
    categoryLabel: "Travel Budget",
    keywords: ["split cost", "per person", "share", "group travel"],
    related: [
      "travel-budget-calculator",
      "daily-travel-budget-calculator",
      "travel-money-calculator",
      "trip-cost-calculator",
    ],
    explanation: [
      {
        heading: "Equal and custom splits",
        body: "By default the total is split equally. You can enter custom share weights per traveller and the tool allocates the total proportionally.",
      },
    ],
    formula: "Equal share = total cost ÷ travellers. Custom share = (traveller weight ÷ total weights) × total cost.",
    faqs: [
      {
        question: "What are share weights?",
        answer:
          "They are relative values. For example, weights of 1 and 2 mean one traveller pays a third and the other pays two thirds.",
      },
    ],
    icon: "users",
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    shortTitle: "Currency Converter",
    description:
      "Convert between 15 major travel currencies using live European Central Bank reference rates.",
    category: "currency",
    categoryLabel: "Currency",
    keywords: ["currency", "exchange rate", "convert", "forex", "money"],
    related: [
      "multi-currency-converter",
      "currency-exchange-calculator",
      "travel-money-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "Where the rates come from",
        body: "Rates come from a public European Central Bank reference feed. They update on working days and are shown with a last-updated timestamp.",
      },
      {
        heading: "Rates can change",
        body: "Exchange rates fluctuate and the rate you get from a bank or card may include a margin. Always treat converted amounts as an estimate.",
      },
    ],
    formula: "Converted amount = amount × exchange rate (base to target).",
    faqs: [
      {
        question: "Are these live interbank rates?",
        answer:
          "They are daily ECB reference rates, not live trading rates. Your bank or card provider will apply its own rate and fees.",
      },
      {
        question: "What happens if the rate feed is down?",
        answer:
          "The tool shows a clear unavailable message rather than inventing a rate.",
      },
    ],
    icon: "coins",
  },
  {
    slug: "multi-currency-converter",
    title: "Multi-Currency Converter",
    shortTitle: "Multi-Currency",
    description:
      "Convert one amount into many currencies at once, ideal for comparing spending across a trip.",
    category: "currency",
    categoryLabel: "Currency",
    keywords: ["multi currency", "convert many", "exchange", "compare currencies"],
    related: [
      "currency-converter",
      "currency-exchange-calculator",
      "travel-money-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "One amount, many currencies",
        body: "Enter an amount and a base currency, then see the equivalent in a curated list of major travel currencies in a single table.",
      },
    ],
    formula: "Each target = amount × rate from base to target.",
    faqs: [
      {
        question: "Can I choose which currencies to show?",
        answer: "The table shows the major supported currencies so you can compare at a glance.",
      },
    ],
    icon: "grid",
  },
  {
    slug: "currency-exchange-calculator",
    title: "Currency Exchange Calculator",
    shortTitle: "Exchange Calculator",
    description:
      "Compare a live reference rate with the rate and fee a provider offers, so you can see the real cost of exchanging money.",
    category: "currency",
    categoryLabel: "Currency",
    keywords: ["exchange rate", "fee", "margin", "bank", "money exchange"],
    related: [
      "currency-converter",
      "multi-currency-converter",
      "travel-money-calculator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "Reference rate vs offered rate",
        body: "Enter the amount, the rate your bank or exchange desk offers and any fixed fee. The tool compares it with the live ECB reference rate and shows how much the difference costs you.",
      },
    ],
    formula: "Effective cost = amount × (reference rate − offered rate) + fixed fee.",
    faqs: [
      {
        question: "Is the reference rate live?",
        answer: "Yes, it uses the same ECB reference feed as the currency converter.",
      },
    ],
    icon: "exchange",
  },
  {
    slug: "time-zone-converter",
    title: "Time Zone Converter",
    shortTitle: "Time Zone",
    description:
      "Convert a date and time between IANA time zones with correct daylight saving handling.",
    category: "travel-time",
    categoryLabel: "Travel Time",
    keywords: ["time zone", "timezone", "converter", "dst", "world clock"],
    related: [
      "jet-lag-calculator",
      "flight-time-calculator",
      "layover-calculator",
      "trip-duration-calculator",
    ],
    explanation: [
      {
        heading: "Daylight saving handled automatically",
        body: "The converter uses the browser's time zone database (IANA) so daylight saving transitions are handled without hardcoded rules.",
      },
      {
        heading: "Date changes",
        body: "Converting across large distances can change the calendar date. The result shows both the converted date and time.",
      },
    ],
    formula: "The source local time is resolved to UTC, then rendered in the destination time zone.",
    faqs: [
      {
        question: "Why does the date sometimes change?",
        answer:
          "When the time difference pushes the converted time past midnight, the calendar day changes. This is expected and shown clearly.",
      },
    ],
    icon: "globe",
  },
  {
    slug: "jet-lag-calculator",
    title: "Jet Lag Calculator",
    shortTitle: "Jet Lag",
    description:
      "Estimate your time difference and get a general adjustment plan for light exposure and sleep after flying.",
    category: "travel-time",
    categoryLabel: "Travel Time",
    keywords: ["jet lag", "sleep", "time difference", "travel fatigue"],
    related: [
      "time-zone-converter",
      "flight-time-calculator",
      "layover-calculator",
      "trip-duration-calculator",
    ],
    explanation: [
      {
        heading: "How the estimate works",
        body: "The tool calculates the time difference between your origin and destination, estimates a recovery window and spreads the adjustment across the first days of your trip.",
      },
      {
        heading: "General guidance only",
        body: "Suggestions are general travel guidance, not medical advice. Individual sleep needs and health conditions vary.",
      },
    ],
    formula: "Time difference = destination UTC offset − origin UTC offset. Recovery estimate grows with the size of the shift.",
    faqs: [
      {
        question: "Is this medical advice?",
        answer:
          "No. It is general travel guidance for adjusting your routine. Speak to a health professional for personal advice.",
      },
    ],
    icon: "moon",
  },
  {
    slug: "flight-time-calculator",
    title: "Flight Time Calculator",
    shortTitle: "Flight Time",
    description:
      "Calculate the great-circle distance between two places and an estimated flight duration from an adjustable average speed.",
    category: "travel-time",
    categoryLabel: "Travel Time",
    keywords: ["flight time", "distance", "air travel", "duration", "great circle"],
    related: [
      "time-zone-converter",
      "layover-calculator",
      "jet-lag-calculator",
      "trip-duration-calculator",
    ],
    explanation: [
      {
        heading: "Straight-line distance",
        body: "Distance is the great-circle distance between two coordinates, which is the shortest path over the Earth's surface.",
      },
      {
        heading: "Estimated duration only",
        body: "Duration uses a configurable average speed. It is an estimate and not the actual scheduled duration of any airline.",
      },
    ],
    formula: "Distance uses the haversine formula. Duration = distance ÷ average speed.",
    faqs: [
      {
        question: "Why is my real flight longer?",
        answer:
          "Real flights include taxiing, routing around airspace and weather, and headwinds. The estimate is a simple straight-line figure.",
      },
    ],
    icon: "plane",
  },
  {
    slug: "layover-calculator",
    title: "Layover Calculator",
    shortTitle: "Layover",
    description:
      "Work out the exact time between an arrival and the next departure, optionally across different time zones.",
    category: "travel-time",
    categoryLabel: "Travel Time",
    keywords: ["layover", "connection", "transit", "stopover", "airport"],
    related: [
      "flight-time-calculator",
      "time-zone-converter",
      "jet-lag-calculator",
      "trip-duration-calculator",
    ],
    explanation: [
      {
        heading: "Local times by default",
        body: "If you leave the time zones blank, the tool treats both times as local to the same place. Add IANA time zones for cross-time-zone connections.",
      },
    ],
    formula: "Layover = next departure − arrival, converted to hours and minutes.",
    faqs: [
      {
        question: "Should I include time zones?",
        answer:
          "If you arrive and depart in different time zones, yes. Otherwise the local-time calculation is correct.",
      },
    ],
    icon: "clock",
  },
  {
    slug: "trip-duration-calculator",
    title: "Trip Duration Calculator",
    shortTitle: "Trip Duration",
    description:
      "Find the number of days, nights, weeks, weekdays and weekend days between two dates.",
    category: "travel-time",
    categoryLabel: "Travel Time",
    keywords: ["trip duration", "days", "nights", "date difference", "holiday length"],
    related: [
      "trip-countdown",
      "travel-checklist",
      "packing-list-generator",
      "travel-budget-calculator",
    ],
    explanation: [
      {
        heading: "Inclusive or exclusive",
        body: "Inclusive mode counts both the start and end date as trip days. Exclusive mode counts the difference only. Nights are always the difference between the dates.",
      },
    ],
    formula: "Days = end date − start date (+1 if inclusive). Weeks = floor(days ÷ 7).",
    faqs: [
      {
        question: "What counts as a weekend?",
        answer: "Saturday and Sunday are counted as weekend days.",
      },
    ],
    icon: "calendar-days",
  },
  {
    slug: "packing-list-generator",
    title: "Packing List Generator",
    shortTitle: "Packing List",
    description:
      "Generate a deterministic packing list from your trip length, month and trip type, then customise and print it.",
    category: "travel-planning",
    categoryLabel: "Travel Planning",
    keywords: ["packing list", "what to pack", "checklist", "luggage", "travel list"],
    related: [
      "travel-checklist",
      "trip-countdown",
      "trip-duration-calculator",
      "travel-money-calculator",
    ],
    explanation: [
      {
        heading: "Rule-based, not random",
        body: "The list is generated from structured rules based on trip type, length and month, so the same inputs always produce the same list.",
      },
      {
        heading: "Make it yours",
        body: "Add custom items, remove anything you do not need, tick items as packed, then print or save your list.",
      },
    ],
    formula: "A base packing set is combined with trip-type items and month or duration modifiers.",
    faqs: [
      {
        question: "Does this use AI?",
        answer:
          "No. It uses deterministic rules so the output is predictable and repeatable.",
      },
      {
        question: "Is my list saved?",
        answer: "Yes, it is saved in your browser's local storage on this device.",
      },
    ],
    icon: "backpack",
  },
  {
    slug: "travel-checklist",
    title: "Travel Checklist",
    shortTitle: "Travel Checklist",
    description:
      "A practical pre-trip checklist covering booking, documents, money, packing and preparing your home.",
    category: "travel-planning",
    categoryLabel: "Travel Planning",
    keywords: ["travel checklist", "todo", "before travel", "documents", "preparation"],
    related: [
      "packing-list-generator",
      "trip-countdown",
      "trip-duration-calculator",
      "travel-money-calculator",
    ],
    explanation: [
      {
        heading: "Stay organised",
        body: "The checklist is grouped into stages from before booking to preparing your home. Tick items off, add your own tasks and reset when you plan the next trip.",
      },
      {
        heading: "Saved on your device",
        body: "Your checklist is stored in local storage and needs no account.",
      },
    ],
    formula: "Checklist state is stored as a list of completed task ids in local storage.",
    faqs: [
      {
        question: "Can I add my own tasks?",
        answer: "Yes. Add custom tasks at any time, and remove them when they are no longer needed.",
      },
    ],
    icon: "check",
  },
  {
    slug: "trip-countdown",
    title: "Trip Countdown",
    shortTitle: "Trip Countdown",
    description:
      "Count down the days, hours, minutes and seconds until your trip, using your local time zone.",
    category: "travel-planning",
    categoryLabel: "Travel Planning",
    keywords: ["countdown", "trip timer", "days until", "departure"],
    related: [
      "travel-checklist",
      "packing-list-generator",
      "trip-duration-calculator",
      "time-zone-converter",
    ],
    explanation: [
      {
        heading: "A live countdown",
        body: "Pick a date and time, name your trip, and the countdown updates every second in your own time zone.",
      },
      {
        heading: "Saved locally",
        body: "Your trip name and date are stored on your device so the countdown is ready when you return.",
      },
    ],
    formula: "Remaining time = trip date and time − current time, split into days, hours, minutes and seconds.",
    faqs: [
      {
        question: "Which time zone is used?",
        answer: "Your device's local time zone is used for the countdown.",
      },
    ],
    icon: "hourglass",
  },
  {
    slug: "travel-money-calculator",
    title: "Travel Money Calculator",
    shortTitle: "Travel Money",
    description:
      "Work out how much money to plan for a trip from your daily budget, trip length, travellers and an emergency buffer.",
    category: "travel-planning",
    categoryLabel: "Travel Planning",
    keywords: ["travel money", "spending money", "cash", "budget", "emergency fund"],
    related: [
      "travel-budget-calculator",
      "currency-converter",
      "daily-travel-budget-calculator",
      "cost-per-person-calculator",
    ],
    explanation: [
      {
        heading: "A planning figure from your inputs",
        body: "The recommended budget is based only on the values you enter: daily spend, trip length, travellers and your chosen emergency buffer percentage.",
      },
      {
        heading: "No unsupported claims",
        body: "The tool does not claim to know real prices in any destination. It simply scales your own figures.",
      },
    ],
    formula: "Base = daily budget × days × travellers. Buffer = base × buffer%. Total = base + buffer.",
    faqs: [
      {
        question: "How big should my buffer be?",
        answer:
          "That is your choice. A common approach is 10 to 20 percent of the base budget for unexpected costs.",
      },
    ],
    icon: "cash",
  },
  {
    slug: "driving-cost-calculator",
    title: "Driving Cost Calculator",
    shortTitle: "Driving Cost",
    description:
      "Estimate the total running cost of a drive, including fuel and optional wear-and-tear cost per kilometre.",
    category: "road-trips",
    categoryLabel: "Road Trip Tools",
    keywords: ["driving cost", "car cost", "running cost", "wear and tear"],
    related: [
      "fuel-cost-calculator",
      "road-trip-cost-calculator",
      "fuel-toll-calculator",
      "ev-charging-cost-calculator",
    ],
    explanation: [
      {
        heading: "Fuel plus running costs",
        body: "Enter distance, fuel consumption and fuel price, then optionally add an extra cost per kilometre for wear and tear such as tyres and servicing.",
      },
    ],
    formula: "Driving cost = fuel cost + (distance × extra cost per km).",
    faqs: [
      {
        question: "What should I use for wear and tear?",
        answer:
          "It depends on your vehicle. Enter your own estimate per kilometre or leave it at zero.",
      },
    ],
    icon: "road",
  },
  {
    slug: "trip-cost-calculator",
    title: "Trip Cost Calculator",
    shortTitle: "Trip Cost",
    description:
      "Combine transport, accommodation, food and activity costs into one trip total with a per-person figure.",
    category: "travel-budget",
    categoryLabel: "Travel Budget",
    keywords: ["trip cost", "total cost", "holiday cost", "vacation cost"],
    related: [
      "travel-budget-calculator",
      "daily-travel-budget-calculator",
      "cost-per-person-calculator",
      "travel-money-calculator",
    ],
    explanation: [
      {
        heading: "A simple total",
        body: "Enter your transport, accommodation, food and activities costs and the tool totals them and divides by the number of travellers.",
      },
    ],
    formula: "Total = transport + accommodation + food + activities + other. Per person = total ÷ travellers.",
    faqs: [
      {
        question: "How is this different from the travel budget calculator?",
        answer:
          "The travel budget calculator builds costs from nightly and daily rates, while this tool takes category totals directly.",
      },
    ],
    icon: "receipt",
  },
];

export const TOOL_MAP: Record<string, ToolMeta> = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, tool]),
);

export function getTool(slug: string): ToolMeta | undefined {
  return TOOL_MAP[slug];
}

export function getRelatedTools(slug: string): ToolMeta[] {
  const tool = TOOL_MAP[slug];
  if (!tool) {
    return [];
  }
  return tool.related.map((relatedSlug) => TOOL_MAP[relatedSlug]).filter(Boolean);
}

export function searchTools(query: string): ToolMeta[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return TOOLS.filter((tool) => {
    const haystack = [tool.title, tool.shortTitle, tool.description, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function toolsByCategory(category: ToolCategoryId): ToolMeta[] {
  return TOOLS.filter((tool) => tool.category === category);
}
