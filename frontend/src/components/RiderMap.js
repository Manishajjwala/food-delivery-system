import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'lucide-react';

const RiderMap = ({ destination, riderLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const destMarkerRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet Map
    if (!window.L || mapInstance.current) return;

    mapInstance.current = window.L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([23.1256, 72.5401], 15);

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Initial Rider Marker (Bike)
    const bikeIcon = window.L.divIcon({
      className: 'custom-bike-icon',
      html: `<div class="w-10 h-10 bg-warmOrange rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m19 19-2-8-3 3h-2l-2 2H8" /><path d="M12 15V7" /><path d="M12 7 9 9" /><circle cx="7" cy="15" r="3" /><circle cx="16" cy="15" r="3" /></svg>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    markerRef.current = window.L.marker([23.1256, 72.5401], { icon: bikeIcon }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update Rider Location
  useEffect(() => {
    if (riderLocation && markerRef.current && mapInstance.current) {
      const newPos = [riderLocation.lat, riderLocation.lng];
      markerRef.current.setLatLng(newPos);
      mapInstance.current.panTo(newPos);
    }
  }, [riderLocation]);

  // Handle Destination Marker
  useEffect(() => {
    if (destination && mapInstance.current) {
      if (destMarkerRef.current) destMarkerRef.current.remove();

      const destIcon = window.L.divIcon({
        className: 'dest-icon',
        html: `<div class="w-8 h-8 bg-black rounded-xl border-2 border-white shadow-lg flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      destMarkerRef.current = window.L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(mapInstance.current);
      
      // Auto-fit bounds
      const group = new window.L.featureGroup([markerRef.current, destMarkerRef.current]);
      mapInstance.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [destination]);

  const openGoogleMaps = () => {
    if (destination) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`, '_blank');
    }
  };

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border-4 border-white/5">
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {destination && (
        <button 
          onClick={openGoogleMaps}
          className="absolute bottom-6 right-6 z-10 bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all"
        >
          <Navigation size={20} className="text-warmOrange" />
          Get Directions
        </button>
      )}
    </div>
  );
};

export default RiderMap;
