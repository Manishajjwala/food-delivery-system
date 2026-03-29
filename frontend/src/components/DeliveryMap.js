import React, { useEffect, useRef, useState } from 'react';

// Default Coordinates for Ahmedabad (Restaurant)
const RESTAURANT_COORDS = [23.0120, 72.5028]; 
// Fallback User Coordinates (Satellite area)
const DEFAULT_USER_COORDS = [23.0300, 72.5170];

const DeliveryMap = ({ orderStatus, liveEta }) => {
  const markerRef = useRef(null);      // Delivery Truck
  const userMarkerRef = useRef(null);  // Blue User Icon
  const mapInstance = useRef(null);
  const routingControlRef = useRef(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [userCoords, setUserCoords] = useState(DEFAULT_USER_COORDS);

  // Helper to format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Get User's Real-Time GPS Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = [position.coords.latitude, position.coords.longitude];
          setUserCoords(newCoords);
          console.log("Real-time location found:", newCoords);
        },
        (err) => console.warn("Geolocation failed, using default:", err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // 2. Initialize Map (Locked & Non-Interactive)
  useEffect(() => {
    const initMap = () => {
      if (!window.L || mapInstance.current) return;

      const L = window.L;
      
      // Initialize map (Fully Locked)
      mapInstance.current = L.map('delivery-map', {
        zoomControl: false,
        attributionControl: false, 
        dragging: false,       // Prevent manual dragging
        touchZoom: false,     // Prevent mobile pinch
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false            // Disable click/tap interactions
      }).setView(RESTAURANT_COORDS, 16);

      // Add Tile Layer (Light theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Custom Icons
      const restaurantIcon = L.divIcon({
        html: `<div class="bg-warmOrange p-2 rounded-full shadow-lg border-2 border-white text-white">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const userIcon = L.divIcon({
        html: `<div class="bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white text-white">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const deliveryIcon = L.divIcon({
        html: `<div class="bg-green-500 p-2 rounded-2xl shadow-xl border-2 border-white text-white animate-bounce" 
                    style="transition: all 1s linear; will-change: transform, left, top;">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
               </div>`,
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      // Add Markers (Strictly Non-Draggable + Non-Interactive)
      L.marker(RESTAURANT_COORDS, { icon: restaurantIcon, draggable: false, interactive: false }).addTo(mapInstance.current);
      userMarkerRef.current = L.marker(userCoords, { icon: userIcon, draggable: false, interactive: false }).addTo(mapInstance.current);
      markerRef.current = L.marker(RESTAURANT_COORDS, { icon: deliveryIcon, draggable: false, interactive: false }).addTo(mapInstance.current);

      // 3. Routing (Follow Street Paths)
      if (L.Routing) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(RESTAURANT_COORDS[0], RESTAURANT_COORDS[1]),
            L.latLng(userCoords[0], userCoords[1])
          ],
          addWaypoints: false,
          draggableWaypoints: false,
          routeWhileDragging: false,
          createMarker: () => null, // NEVER allow routing to add extra markers
          fitSelectedRoutes: true,
          show: false,
          lineOptions: {
            styles: [{ color: '#f97316', weight: 4, opacity: 0.6, dashArray: '10, 10' }]
          }
        }).addTo(mapInstance.current);

        routingControlRef.current.on('routesfound', (e) => {
          setRoutePoints(e.routes[0].coordinates);
        });
      }
    };

    if (window.L) {
      initMap();
    } else {
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          initMap();
          clearInterval(checkLeaflet);
        }
      }, 500);
      return () => clearInterval(checkLeaflet);
    }
  }, []);

  // 4. Update Destination when User Coordinates found
  useEffect(() => {
    if (userMarkerRef.current && userCoords && routingControlRef.current) {
      userMarkerRef.current.setLatLng(userCoords);
      if (window.L && window.L.latLng) {
        routingControlRef.current.setWaypoints([
          window.L.latLng(RESTAURANT_COORDS[0], RESTAURANT_COORDS[1]),
          window.L.latLng(userCoords[0], userCoords[1])
        ]);
      }
    }
  }, [userCoords]);

  // 5. Smooth Tracking Logic (Truck Movement)
  useEffect(() => {
    if (!markerRef.current || orderStatus !== 'Out for Delivery' || routePoints.length === 0) return;

    const progress = Math.min(1, Math.max(0, (1500 - liveEta) / (1500 - 120)));
    const pointIndex = Math.floor(progress * (routePoints.length - 1));
    const targetPoint = routePoints[pointIndex];

    if (targetPoint && markerRef.current) {
      markerRef.current.setLatLng([targetPoint.lat, targetPoint.lng]);
      if (mapInstance.current) {
        mapInstance.current.setView([targetPoint.lat, targetPoint.lng], 16, { animate: true });
      }
    }
  }, [orderStatus, liveEta, routePoints]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl shadow-inner select-none pointer-events-none">
      <div id="delivery-map" className="w-full h-full z-0 pointer-events-none"></div>
      
      {/* Visual Shield for Extra Safety */}
      <div className="absolute inset-0 bg-transparent z-[1000] pointer-events-auto cursor-default"></div>

      <div className="absolute bottom-4 left-4 z-[1001] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50 animate-in fade-in zoom-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live GPS Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
