import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (Ahmedabad)
const center = {
  lat: 23.0225,
  lng: 72.5714
};

const GoogleDeliveryMap = ({ deliveryLocation, orderStatus, userLocation, restaurantLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  });

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Calculate route when locations are available
  useEffect(() => {
    if (!isLoaded || !restaurantLocation || !userLocation) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: restaurantLocation,
        destination: userLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed: ${status}`);
        }
      }
    );
  }, [isLoaded, restaurantLocation, userLocation]);

  if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Radar Matrix...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={deliveryLocation || center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#7c93a3"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#c8d7d4"}]
          }
           // Add more premium styles here
        ]
      }}
    >
      {/* Restaurant Marker */}
      {restaurantLocation && (
        <Marker 
          position={restaurantLocation}
          label="R"
          title="Restaurant"
        />
      )}

      {/* User Marker */}
      {userLocation && (
        <Marker 
          position={userLocation}
          label="U"
          title="Delivery Point"
        />
      )}

      {/* Real-time Delivery Marker */}
      {deliveryLocation && (
        <Marker 
          position={deliveryLocation}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Scooter icon
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }}
          title="Delivery Agent"
        />
      )}

      {/* Route Line */}
      {directions && (
        <DirectionsRenderer 
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#f97316",
              strokeOpacity: 0.8,
              strokeWeight: 5
            }
          }}
        />
      )}
    </GoogleMap>
  );
};

export default React.memo(GoogleDeliveryMap);
