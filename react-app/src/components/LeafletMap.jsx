import { useEffect, useRef } from "react";

// Leaflet is loaded via CDN in index.html; access via window.L
export default function LeafletMap({ lat, lng, label }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for Leaflet CDN to load
    const init = () => {
      if (!window.L) return;
      if (mapRef.current) return; // already created

      mapRef.current = window.L.map(containerRef.current).setView([lat, lng], 10);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      window.L.marker([lat, lng])
        .addTo(mapRef.current)
        .bindPopup(label)
        .openPopup();
    };

    if (window.L) {
      init();
    } else {
      // poll until Leaflet is ready
      const interval = setInterval(() => {
        if (window.L) {
          clearInterval(interval);
          init();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
