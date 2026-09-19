"use client";

import type { ComponentType } from "react";
import { RoadTripCalculator } from "./calculators/RoadTripCalculator";
import { FuelCostCalculator } from "./calculators/FuelCostCalculator";
import { FuelTollCalculator } from "./calculators/FuelTollCalculator";
import { EvChargingCalculator } from "./calculators/EvChargingCalculator";
import { DrivingCostCalculator } from "./calculators/DrivingCostCalculator";
import { TravelBudgetCalculator } from "./calculators/TravelBudgetCalculator";
import { DailyBudgetCalculator } from "./calculators/DailyBudgetCalculator";
import { CostPerPersonCalculator } from "./calculators/CostPerPersonCalculator";
import { TripCostCalculator } from "./calculators/TripCostCalculator";
import { CurrencyConverter } from "./calculators/CurrencyConverter";
import { MultiCurrencyConverter } from "./calculators/MultiCurrencyConverter";
import { CurrencyExchangeCalculator } from "./calculators/CurrencyExchangeCalculator";
import { TimeZoneConverter } from "./calculators/TimeZoneConverter";
import { JetLagCalculator } from "./calculators/JetLagCalculator";
import { FlightTimeCalculator } from "./calculators/FlightTimeCalculator";
import { LayoverCalculator } from "./calculators/LayoverCalculator";
import { TripDurationCalculator } from "./calculators/TripDurationCalculator";
import { PackingListGenerator } from "./calculators/PackingListGenerator";
import { TravelChecklist } from "./calculators/TravelChecklist";
import { TripCountdown } from "./calculators/TripCountdown";
import { TravelMoneyCalculator } from "./calculators/TravelMoneyCalculator";

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "road-trip-cost-calculator": RoadTripCalculator,
  "fuel-cost-calculator": FuelCostCalculator,
  "fuel-toll-calculator": FuelTollCalculator,
  "ev-charging-cost-calculator": EvChargingCalculator,
  "driving-cost-calculator": DrivingCostCalculator,
  "travel-budget-calculator": TravelBudgetCalculator,
  "daily-travel-budget-calculator": DailyBudgetCalculator,
  "cost-per-person-calculator": CostPerPersonCalculator,
  "trip-cost-calculator": TripCostCalculator,
  "currency-converter": CurrencyConverter,
  "multi-currency-converter": MultiCurrencyConverter,
  "currency-exchange-calculator": CurrencyExchangeCalculator,
  "time-zone-converter": TimeZoneConverter,
  "jet-lag-calculator": JetLagCalculator,
  "flight-time-calculator": FlightTimeCalculator,
  "layover-calculator": LayoverCalculator,
  "trip-duration-calculator": TripDurationCalculator,
  "packing-list-generator": PackingListGenerator,
  "travel-checklist": TravelChecklist,
  "trip-countdown": TripCountdown,
  "travel-money-calculator": TravelMoneyCalculator,
};
