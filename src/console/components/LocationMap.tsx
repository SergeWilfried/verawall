// Location map for geo-driven risk decisions. Plots the subject's recent
// COARSE fixes — geohash cells only, never raw coordinates — on an
// OpenStreetMap base. Consecutive fixes are joined so an impossible jump
// reads at a glance; mock-GPS fixes are flagged red. Leaflet is loaded
// lazily so it never weighs on pages that don't show a map.
import { useEffect, useRef, useState } from 'react';
import { consoleApi, type LocationFix } from '../api';

const B32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// Decode a geohash to its cell centre and bounding box (its true precision —
// what we actually know, ~±2.4 km at length 5).
function decodeGeohash(hash: string): { lat: number; lon: number; latErr: number; lonErr: number } {
  let latMin = -90, latMax = 90, lonMin = -180, lonMax = 180;
  let even = true;
  for (const ch of hash.toLowerCase()) {
    const idx = B32.indexOf(ch);
    if (idx < 0) continue;
    for (let bit = 4; bit >= 0; bit--) {
      const on = (idx >> bit) & 1;
      if (even) {
        const mid = (lonMin + lonMax) / 2;
        if (on) lonMin = mid; else lonMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (on) latMin = mid; else latMax = mid;
      }
      even = !even;
    }
  }
  return {
    lat: (latMin + latMax) / 2, lon: (lonMin + lonMax) / 2,
    latErr: (latMax - latMin) / 2, lonErr: (lonMax - lonMin) / 2,
  };
}

const haversineKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
  const r = 6371, rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad, dLon = (bLon - aLon) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(s));
};

interface Props { subject: string; height?: number }

export function LocationMap({ subject, height = 420 }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [fixes, setFixes] = useState<LocationFix[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setFixes(null); setError(null);
    consoleApi.locations(subject)
      .then((f) => { if (alive) setFixes(f); })
      .catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Could not load locations.'); });
    return () => { alive = false; };
  }, [subject]);

  useEffect(() => {
    if (!fixes || !boxRef.current) return;
    let map: import('leaflet').Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !boxRef.current) return;

      // oldest → newest, so the travel line reads in time order.
      const pts = fixes
        .map((f) => ({ ...f, ...decodeGeohash(f.geohash) }))
        .filter((p) => Number.isFinite(p.lat))
        .reverse();
      if (pts.length === 0) { setError('No coarse location fixes on record.'); return; }

      map = L.map(boxRef.current, { attributionControl: true, scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '© OpenStreetMap',
      }).addTo(map);

      const latlngs = pts.map((p) => [p.lat, p.lon] as [number, number]);

      // The travel path — red so an impossible hop is obvious.
      if (pts.length > 1) {
        L.polyline(latlngs, { color: '#D71A28', weight: 2, dashArray: '6 5', opacity: 0.8 }).addTo(map!);
      }

      pts.forEach((p, i) => {
        const latest = i === pts.length - 1;
        const color = p.mock ? '#D71A28' : latest ? '#1D1D1B' : '#7A8593';
        // The cell we actually know (geohash bbox), not a precise pin.
        L.rectangle(
          [[p.lat - p.latErr, p.lon - p.lonErr], [p.lat + p.latErr, p.lon + p.lonErr]],
          { color, weight: 1, fillColor: color, fillOpacity: 0.12 },
        ).addTo(map!);
        L.circleMarker([p.lat, p.lon], {
          radius: latest ? 8 : 6, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1,
        }).addTo(map!).bindPopup(
          `<b>${p.mock ? 'Mock-GPS fix' : latest ? 'Latest fix' : 'Prior fix'}</b><br>` +
          `geohash <code>${p.geohash}</code> (~5&nbsp;km cell)<br>` +
          `${new Date(p.ts).toLocaleString()}`,
        );
      });

      // Distance + gap between the two most recent fixes — the impossible-travel evidence.
      if (pts.length > 1) {
        const a = pts[pts.length - 2], b = pts[pts.length - 1];
        const km = Math.round(haversineKm(a.lat, a.lon, b.lat, b.lon));
        const mins = Math.max(1, Math.round((new Date(b.ts).getTime() - new Date(a.ts).getTime()) / 60000));
        if (km >= 100) {
          const mid = L.latLng((a.lat + b.lat) / 2, (a.lon + b.lon) / 2);
          L.marker(mid, {
            icon: L.divIcon({
              className: '',
              html: `<div style="background:#D71A28;color:#fff;font:700 11px/1.4 Barlow,system-ui;padding:3px 8px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.3)">${km.toLocaleString()} km · ${mins} min</div>`,
              iconSize: [0, 0],
            }),
          }).addTo(map!);
        }
      }

      map.fitBounds(L.latLngBounds(latlngs).pad(0.35), { maxZoom: 13 });
      setTimeout(() => map && map.invalidateSize(), 60);
    })();

    return () => { cancelled = true; if (map) map.remove(); };
  }, [fixes]);

  if (error) {
    return <div style={{ fontSize: '12.5px', color: '#7A8593' }}>{error}</div>;
  }

  return (
    <div>
      <div
        ref={boxRef}
        style={{ height, width: '100%', borderRadius: 6, overflow: 'hidden', border: '1px solid #E3E7EB', background: '#EEF1F4' }}
      />
      <div style={{ marginTop: 8, fontSize: '11.5px', color: '#7A8593', lineHeight: 1.5 }}>
        Shaded squares are the coarse geohash cells (~5&nbsp;km) — the platform never receives precise coordinates.
        Red marks a mock-GPS (fake-location) fix; the dashed line traces travel between fixes.
      </div>
    </div>
  );
}
