import { useEffect, useRef } from 'react';

// Leaflet map with OpenStreetMap tiles (no API key required).
// markers: [{ lat, lng, popup }] — popup is an HTML string.
export default function MapView({ markers = [], zoom = 14, height = 340 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const valid = markers.filter((m) => m.lat != null && m.lng != null);
      if (!valid.length) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: 'map-pin',
        html: '<i class="bi bi-geo-alt-fill"></i>',
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        popupAnchor: [0, -28],
      });

      const layerMarkers = valid.map((m) => {
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
        if (m.popup) marker.bindPopup(m.popup);
        return marker;
      });

      if (valid.length === 1) {
        map.setView([valid[0].lat, valid[0].lng], zoom);
      } else {
        map.fitBounds(L.featureGroup(layerMarkers).getBounds().pad(0.2));
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey, zoom]);

  if (!markers.some((m) => m.lat != null && m.lng != null)) {
    return (
      <div
        className="map-container d-flex align-items-center justify-content-center bg-light text-secondary"
        style={{ height }}
      >
        <span>
          <i className="bi bi-geo-alt me-2" />
          Location not available
        </span>
      </div>
    );
  }

  return <div ref={containerRef} className="map-container" style={{ height }} />;
}
