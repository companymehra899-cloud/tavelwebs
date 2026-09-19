import { describe, expect, it } from "vitest";
import { calculateFuelCost } from "@/lib/calculators/fuel";
import { calculateRoadTrip } from "@/lib/calculators/roadTrip";
import { calculateEvCharging } from "@/lib/calculators/evCharging";
import {
  calculateCostPerPerson,
  calculateDailyBudget,
  calculateTravelBudget,
} from "@/lib/calculators/travelBudget";
import { convertCurrency, convertMany } from "@/lib/calculators/currency";
import { convertTimeZone } from "@/lib/calculators/timeZone";
import { calculateLayover } from "@/lib/calculators/layover";
import { calculateTripDuration } from "@/lib/calculators/tripDuration";
import { calculateFlightTime } from "@/lib/calculators/flightTime";
import { calculateJetLag } from "@/lib/calculators/jetLag";
import { calculateTravelMoney } from "@/lib/calculators/travelMoney";
import { generatePackingList } from "@/lib/calculators/packing";

describe("calculateFuelCost", () => {
  it("calculates a normal metric journey", () => {
    const result = calculateFuelCost({
      distance: 100,
      consumption: 5,
      fuelPrice: 2,
      unitSystem: "metric",
      fuelType: "petrol",
    });
    expect(result.fuelRequiredLitres).toBe(5);
    expect(result.fuelCost).toBe(10);
  });

  it("rejects zero distance", () => {
    expect(() =>
      calculateFuelCost({ distance: 0, consumption: 5, fuelPrice: 2, unitSystem: "metric", fuelType: "petrol" }),
    ).toThrow();
  });

  it("rejects negative fuel price", () => {
    expect(() =>
      calculateFuelCost({ distance: 100, consumption: 5, fuelPrice: -1, unitSystem: "metric", fuelType: "petrol" }),
    ).toThrow();
  });

  it("supports imperial MPG", () => {
    const result = calculateFuelCost({
      distance: 100,
      consumption: 40,
      fuelPrice: 2,
      unitSystem: "imperial",
      fuelType: "petrol",
    });
    expect(result.fuelRequiredLitres).toBeGreaterThan(0);
    expect(result.distanceKm).toBeCloseTo(160.93, 1);
  });
});

describe("calculateRoadTrip", () => {
  it("doubles distance for a round trip", () => {
    const oneWay = calculateRoadTrip({
      distanceKm: 100,
      consumption: 6,
      fuelPrice: 2,
      travelers: 2,
      unitSystem: "metric",
      fuelType: "petrol",
      direction: "one-way",
    });
    const round = calculateRoadTrip({
      distanceKm: 100,
      consumption: 6,
      fuelPrice: 2,
      travelers: 2,
      unitSystem: "metric",
      fuelType: "petrol",
      direction: "round-trip",
    });
    expect(round.distanceKm).toBe(oneWay.distanceKm * 2);
    expect(round.totalTripCost).toBeCloseTo(oneWay.totalTripCost * 2, 1);
  });

  it("adds optional costs and divides per person", () => {
    const result = calculateRoadTrip({
      distanceKm: 100,
      consumption: 5,
      fuelPrice: 2,
      travelers: 4,
      unitSystem: "metric",
      fuelType: "diesel",
      direction: "one-way",
      tolls: 20,
      parking: 5,
      accommodation: 75,
      other: 0,
    });
    expect(result.totalTripCost).toBe(10 + 20 + 5 + 75);
    expect(result.costPerPerson).toBe(27.5);
  });

  it("rejects zero travelers", () => {
    expect(() =>
      calculateRoadTrip({
        distanceKm: 100,
        consumption: 5,
        fuelPrice: 2,
        travelers: 0,
        unitSystem: "metric",
        fuelType: "petrol",
        direction: "one-way",
      }),
    ).toThrow();
  });
});

describe("calculateEvCharging", () => {
  it("calculates energy and cost", () => {
    const result = calculateEvCharging({
      distance: 200,
      consumptionKwhPer100km: 17,
      electricityPrice: 0.4,
      startBatteryPercent: 20,
      targetBatteryPercent: 80,
      batteryCapacityKwh: 60,
      chargingType: "home",
      unitSystem: "metric",
    });
    expect(result.energyRequiredKwh).toBe(36);
    expect(result.chargingCost).toBeCloseTo(14.4, 2);
  });

  it("rejects a target below the start", () => {
    expect(() =>
      calculateEvCharging({
        distance: 100,
        consumptionKwhPer100km: 17,
        electricityPrice: 0.4,
        startBatteryPercent: 80,
        targetBatteryPercent: 20,
        batteryCapacityKwh: 60,
        chargingType: "home",
        unitSystem: "metric",
      }),
    ).toThrow();
  });
});

describe("travel budget calculators", () => {
  it("totals travel budget categories", () => {
    const result = calculateTravelBudget({
      travelers: 2,
      days: 4,
      accommodationPerNight: 100,
      foodPerDay: 40,
      transport: 200,
      activities: 100,
      other: 50,
    });
    expect(result.accommodationTotal).toBe(300);
    expect(result.foodTotal).toBe(320);
    expect(result.totalTripCost).toBe(970);
    expect(result.costPerTraveler).toBe(485);
  });

  it("calculates daily, weekly and trip totals", () => {
    const result = calculateDailyBudget({
      accommodation: 80,
      food: 30,
      localTransport: 10,
      activities: 20,
      other: 10,
      days: 10,
    });
    expect(result.dailyTotal).toBe(150);
    expect(result.weeklyTotal).toBe(1050);
    expect(result.tripTotal).toBe(1500);
  });

  it("splits cost equally and by custom shares", () => {
    const equal = calculateCostPerPerson({ totalCost: 300, travelers: 3 });
    expect(equal.equalSplit).toBe(100);
    const custom = calculateCostPerPerson({ totalCost: 300, travelers: 2, shares: [1, 2] });
    expect(custom.shares[0].amount).toBe(100);
    expect(custom.shares[1].amount).toBe(200);
  });

  it("rejects zero travelers", () => {
    expect(() => calculateCostPerPerson({ totalCost: 100, travelers: 0 })).toThrow();
  });
});

describe("currency", () => {
  it("converts using a rate", () => {
    const result = convertCurrency({ amount: 100, from: "EUR", to: "GBP", rate: 0.85 });
    expect(result.converted).toBe(85);
  });

  it("converts into many currencies and flags missing rates", () => {
    const rows = convertMany(100, "EUR", { GBP: 0.85, USD: 1.1 }, ["GBP", "USD", "JPY"]);
    expect(rows[0].value).toBe(85);
    expect(rows[1].value).toBe(110);
    expect(Number.isNaN(rows[2].value)).toBe(true);
  });
});

describe("time zone conversion", () => {
  it("converts between zones and handles date rollover", () => {
    const result = convertTimeZone({
      date: "2026-01-15",
      time: "23:30",
      fromTimeZone: "Europe/London",
      toTimeZone: "Australia/Sydney",
    });
    expect(result.convertedDate).toBe("2026-01-16");
  });

  it("handles the same time zone", () => {
    const result = convertTimeZone({
      date: "2026-06-01",
      time: "12:00",
      fromTimeZone: "Europe/Berlin",
      toTimeZone: "Europe/Berlin",
    });
    expect(result.convertedTime).toBe("12:00");
  });

  it("handles a DST transition day", () => {
    const result = convertTimeZone({
      date: "2026-03-29",
      time: "12:00",
      fromTimeZone: "Europe/London",
      toTimeZone: "America/New_York",
    });
    // London moves to BST on 29 March 2026 (UTC+1) while New York is on EDT (UTC-4).
    expect(result.convertedTime).toBe("07:00");
  });
});

describe("layover", () => {
  it("calculates hours and minutes", () => {
    const result = calculateLayover({
      arrivalDate: "2026-05-01",
      arrivalTime: "10:15",
      departureDate: "2026-05-01",
      departureTime: "13:45",
    });
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(30);
  });

  it("supports timezone-aware mode", () => {
    const result = calculateLayover({
      arrivalDate: "2026-05-01",
      arrivalTime: "10:00",
      departureDate: "2026-05-01",
      departureTime: "14:00",
      arrivalTimeZone: "Europe/London",
      departureTimeZone: "Europe/Berlin",
    });
    expect(result.timezoneAware).toBe(true);
    expect(result.hours).toBe(3);
  });

  it("rejects a departure before arrival", () => {
    expect(() =>
      calculateLayover({
        arrivalDate: "2026-05-01",
        arrivalTime: "15:00",
        departureDate: "2026-05-01",
        departureTime: "12:00",
      }),
    ).toThrow();
  });
});

describe("trip duration", () => {
  it("counts inclusive days and nights", () => {
    const result = calculateTripDuration({ startDate: "2026-07-01", endDate: "2026-07-07", inclusive: true });
    expect(result.nights).toBe(6);
    expect(result.days).toBe(7);
    expect(result.weeks).toBe(1);
  });

  it("rejects an end date before the start", () => {
    expect(() =>
      calculateTripDuration({ startDate: "2026-07-10", endDate: "2026-07-01", inclusive: true }),
    ).toThrow();
  });
});

describe("flight time", () => {
  it("estimates duration from distance", () => {
    const result = calculateFlightTime({
      originLat: 51.47,
      originLon: -0.4543,
      destinationLat: 40.6413,
      destinationLon: -73.7781,
      averageSpeedKmh: 850,
    });
    expect(result.distanceKm).toBeGreaterThan(5000);
    expect(result.estimatedMinutes).toBeGreaterThan(300);
  });

  it("rejects an invalid coordinate", () => {
    expect(() =>
      calculateFlightTime({
        originLat: 200,
        originLon: 0,
        destinationLat: 0,
        destinationLon: 0,
      }),
    ).toThrow();
  });
});

describe("jet lag", () => {
  it("detects direction and builds a plan", () => {
    const result = calculateJetLag({
      originTimeZone: "Europe/London",
      destinationTimeZone: "America/New_York",
      departureIso: "2026-05-01T10:00:00Z",
      arrivalIso: "2026-05-01T14:00:00Z",
      direction: "auto",
      tripDays: 7,
    });
    // London is on BST (UTC+1) and New York on EDT (UTC-4) on 1 May 2026.
    expect(result.direction).toBe("west");
    expect(result.timeDifferenceHours).toBe(5);
    expect(result.adjustmentSchedule.length).toBeGreaterThan(0);
  });
});

describe("travel money", () => {
  it("adds an emergency buffer", () => {
    const result = calculateTravelMoney({
      tripDays: 10,
      dailyBudget: 100,
      emergencyBufferPercent: 10,
      travelers: 2,
    });
    expect(result.baseBudget).toBe(2000);
    expect(result.emergencyBuffer).toBe(200);
    expect(result.totalBudget).toBe(2200);
  });

  it("rejects a zero daily budget", () => {
    expect(() =>
      calculateTravelMoney({ tripDays: 10, dailyBudget: 0, emergencyBufferPercent: 10, travelers: 2 }),
    ).toThrow();
  });
});

describe("packing list", () => {
  it("is deterministic for the same input", () => {
    const first = generatePackingList({ days: 10, month: 12, tripType: "winter" });
    const second = generatePackingList({ days: 10, month: 12, tripType: "winter" });
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
    expect(first.some((item) => item.label.toLowerCase().includes("warm"))).toBe(true);
  });

  it("adds beach items for a beach trip", () => {
    const list = generatePackingList({ days: 5, month: 7, tripType: "beach" });
    expect(list.some((item) => item.id === "swim")).toBe(true);
  });
});
