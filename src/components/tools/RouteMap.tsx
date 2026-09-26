"use client";

import { useEffect, useRef, useState } from "react";

export interface RouteMapPoint {
  lat: number;
  lon: number;
  label?: string;
}

export interface RouteMapProps {
  origin: RouteMapPoint;
  destination: RouteMapPoint;
  geometry?: [number, number][];
  height?: string;
}

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

interface LeafletVector {
  bindTooltip(content: string, options?: Record<string, unknown>): LeafletVector;
}

interface LeafletMapInstance {
  addLayer(layer: unknown): void;
  fitBounds(bounds: LeafletBounds, options?: Record<string, unknown>): void;
  remove(): void;
}

interface LeafletBounds {
  pad(amount: number): LeafletBounds;
}

interface LeafletStatic {
  map(element: HTMLElement, options?: Record<string, unknown>): LeafletMapInstance;
  tileLayer(url: string, options?: Record<string, unknown>): unknown;
  circleMarker(latlng: [number, number], options?: Record<string, unknown>): LeafletVector;
  polyline(latlngs: [number, number][], options?: Record<string, unknown>): unknown;
  latLngBounds(latlngs: [number, number][]): LeafletBounds;
}

type LoadStatus = "loading" | "ready" | "error";

let leafletLoader: Promise<LeafletStatic> | null = null;

function loadLeaflet(): Promise<LeafletStatic> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet is only available in the browser."));
  }
  const existing = (window as unknown as { L?: LeafletStatic }).L;
  if (existing) {
    return Promise.resolve(existing);
  }
  if (leafletLoader) {
    return leafletLoader;
  }
  leafletLoader = new Promise<LeafletStatic>((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => {
      const namespace = (window as unknown as { L?: LeafletStatic }).L;
      if (namespace) {
        resolve(namespace);
      } else {
        leafletLoader = null;
        reject(new Error("Leaflet failed to initialise."));
      }
    };
    script.onerror = () => {
      leafletLoader = null;
      reject(new Error("Leaflet failed to load."));
    };
    document.head.appendChild(script);
  });
  return leafletLoader;
}

export function RouteMap({ origin, destination, geometry, height = "20rem" }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) {
      return;
    }
    setStatus("loading");

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) {
          return;
        }
        const points: [number, number][] =
          geometry && geometry.length > 1
            ? geometry
            : [
                [origin.lat, origin.lon],
                [destination.lat, destination.lon],
              ];

        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        });
        map.addLayer(
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        );
        map.addLayer(
          L.polyline(points, { color: "#0284c7", weight: 4, opacity: 0.85 }),
        );
        map.addLayer(
          L.circleMarker([origin.lat, origin.lon], {
            radius: 7,
            color: "#ffffff",
            weight: 2,
            fillColor: "#16a34a",
            fillOpacity: 1,
          }).bindTooltip(origin.label ?? "Start"),
        );
        map.addLayer(
          L.circleMarker([destination.lat, destination.lon], {
            radius: 7,
            color: "#ffffff",
            weight: 2,
            fillColor: "#0284c7",
            fillOpacity: 1,
          }).bindTooltip(destination.label ?? "Destination"),
        );

        map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [origin.lat, origin.lon, origin.label, destination.lat, destination.lon, destination.label, geometry]);

  return (
    <div
      className="relative isolate z-0 overflow-hidden rounded-2xl border border-border bg-surface-muted"
      style={{ height }}
      role="img"
      aria-label="Map showing the driving route between the start and destination"
    >
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-surface-muted/70 text-sm text-muted">
          Loading map…
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-surface-muted px-4 text-center text-sm text-muted">
          Map unavailable. Your distance and cost were still calculated.
        </div>
      ) : null}
    </div>
  );
}
