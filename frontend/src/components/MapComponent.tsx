import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Fallback if no API key is provided
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(30, 41, 59, 0.5); border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; color: var(--text-muted); text-align: center; padding: 2rem;">
            <p style="margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Google Maps API Key Required</p>
            <p style="font-size: 0.8125rem;">Please add your key to .env to view the live simulation.</p>
          </div>
        `;
      }
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
    });

    loader.load().then((google) => {
      const center = { lat: 33.9535, lng: -118.3392 }; // Demo Stadium Location
      const map = new google.maps.Map(mapRef.current as HTMLElement, {
        center: center,
        zoom: 16,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        ],
        disableDefaultUI: true,
      });

      // Default Route (Crowded)
      const defaultPath = [
        { lat: 33.9585, lng: -118.3442 },
        { lat: 33.9565, lng: -118.3392 },
        { lat: 33.9535, lng: -118.3392 },
      ];

      new google.maps.Polyline({
        path: defaultPath,
        geodesic: true,
        strokeColor: "#94a3b8",
        strokeOpacity: 0.5,
        strokeWeight: 4,
        map: map,
      });

      // AI Optimized Route
      const optimizedPath = [
        { lat: 33.9585, lng: -118.3442 },
        { lat: 33.9585, lng: -118.3392 },
        { lat: 33.9555, lng: -118.3392 },
        { lat: 33.9535, lng: -118.3392 },
      ];

      new google.maps.Polyline({
        path: optimizedPath,
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: 1.0,
        strokeWeight: 6,
        map: map,
      });

      // Add a label/InfoWindow for optimized route
      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="color: #1e293b; padding: 4px; font-weight: bold;">AI Optimized Route (40% faster)</div>',
        position: { lat: 33.957, lng: -118.3392 },
      });
      infoWindow.open(map);

      // Markers
      new google.maps.Marker({ position: defaultPath[0], map: map, label: "A" });
      new google.maps.Marker({ position: center, map: map, label: "Gate" });
    });
  }, []);

  return <div ref={mapRef} className={className} style={{ minHeight: '300px', width: '100%' }} />;
};

export default MapComponent;
