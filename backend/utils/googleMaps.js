
/**
 * Calculates dynamic ETA using Google Maps Distance Matrix API
 * Fallback to manual Haversine calculation if API Key is missing or fails
 */
const getDynamicETA = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const duration = data.rows[0].elements[0].duration.value; // in seconds
        return Math.ceil(duration / 60); // return in minutes
      }
    } catch (err) {
      console.error('[Maps] API Error:', err.message);
    }
  }

  // Fallback: Haversine distance-based simple ETA
  return calculateHaversineETA(origin, destination);
};

const calculateHaversineETA = (origin, destination) => {
  const R = 6371; // Earth radius in km
  const dLat = (destination.lat - origin.lat) * Math.PI / 180;
  const dLng = (destination.lng - origin.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Assuming average speed of 20km/h in city traffic (3 mins per km)
  return Math.ceil(distance * 3) + 2; // +2 mins for padding
};

module.exports = { getDynamicETA };
