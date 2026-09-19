import { haversineKm } from "@/lib/geo";

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const AIRPORTS: Airport[] = [
  { code: "LHR", name: "Heathrow", city: "London", country: "United Kingdom", lat: 51.47, lon: -0.4543 },
  { code: "LGW", name: "Gatwick", city: "London", country: "United Kingdom", lat: 51.1537, lon: -0.1821 },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lon: 2.5479 },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lon: 4.7683 },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", lat: 50.0379, lon: 8.5622 },
  { code: "MUC", name: "Munich", city: "Munich", country: "Germany", lat: 48.3538, lon: 11.7861 },
  { code: "BER", name: "Brandenburg", city: "Berlin", country: "Germany", lat: 52.3667, lon: 13.5033 },
  { code: "MAD", name: "Barajas", city: "Madrid", country: "Spain", lat: 40.4719, lon: -3.5626 },
  { code: "BCN", name: "El Prat", city: "Barcelona", country: "Spain", lat: 41.2974, lon: 2.0833 },
  { code: "FCO", name: "Fiumicino", city: "Rome", country: "Italy", lat: 41.8003, lon: 12.2389 },
  { code: "MXP", name: "Malpensa", city: "Milan", country: "Italy", lat: 45.63, lon: 8.7231 },
  { code: "ZRH", name: "Zurich", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492 },
  { code: "VIE", name: "Schwechat", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697 },
  { code: "LIS", name: "Humberto Delgado", city: "Lisbon", country: "Portugal", lat: 38.7742, lon: -9.1342 },
  { code: "BRU", name: "Brussels", city: "Brussels", country: "Belgium", lat: 50.9014, lon: 4.4844 },
  { code: "DUB", name: "Dublin", city: "Dublin", country: "Ireland", lat: 53.4213, lon: -6.2701 },
  { code: "CPH", name: "Kastrup", city: "Copenhagen", country: "Denmark", lat: 55.618, lon: 12.6508 },
  { code: "ARN", name: "Arlanda", city: "Stockholm", country: "Sweden", lat: 59.6519, lon: 17.9186 },
  { code: "OSL", name: "Gardermoen", city: "Oslo", country: "Norway", lat: 60.1976, lon: 11.1004 },
  { code: "HEL", name: "Vantaa", city: "Helsinki", country: "Finland", lat: 60.3172, lon: 24.9633 },
  { code: "WAW", name: "Chopin", city: "Warsaw", country: "Poland", lat: 52.1657, lon: 20.9671 },
  { code: "PRG", name: "Vaclav Havel", city: "Prague", country: "Czech Republic", lat: 50.1008, lon: 14.26 },
  { code: "JFK", name: "John F. Kennedy", city: "New York", country: "United States", lat: 40.6413, lon: -73.7781 },
  { code: "LAX", name: "Los Angeles", city: "Los Angeles", country: "United States", lat: 33.9416, lon: -118.4085 },
  { code: "ORD", name: "O'Hare", city: "Chicago", country: "United States", lat: 41.9742, lon: -87.9073 },
  { code: "YYZ", name: "Pearson", city: "Toronto", country: "Canada", lat: 43.6777, lon: -79.6248 },
  { code: "YVR", name: "Vancouver", city: "Vancouver", country: "Canada", lat: 49.1967, lon: -123.1815 },
  { code: "SYD", name: "Kingsford Smith", city: "Sydney", country: "Australia", lat: -33.9399, lon: 151.1753 },
  { code: "MEL", name: "Tullamarine", city: "Melbourne", country: "Australia", lat: -37.669, lon: 144.841 },
  { code: "AKL", name: "Auckland", city: "Auckland", country: "New Zealand", lat: -37.0082, lon: 174.7850 },
  { code: "DXB", name: "Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.2532, lon: 55.3657 },
  { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lon: 103.9915 },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan", lat: 35.5494, lon: 139.7798 },
  { code: "PEK", name: "Capital", city: "Beijing", country: "China", lat: 40.0799, lon: 116.6031 },
];

export function findAirport(query: string): Airport | undefined {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  return AIRPORTS.find(
    (airport) =>
      airport.code.toLowerCase() === normalized ||
      airport.city.toLowerCase() === normalized ||
      airport.name.toLowerCase().includes(normalized),
  );
}

export function airportDistanceKm(from: Airport, to: Airport): number {
  return haversineKm({ lat: from.lat, lon: from.lon }, { lat: to.lat, lon: to.lon });
}
