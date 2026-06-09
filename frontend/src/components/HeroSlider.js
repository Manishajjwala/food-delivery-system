import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, AlertTriangle } from 'lucide-react';

// Background images for the slider
const heroImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', // Multi-food spread
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop', // Pizza
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=2080&auto=format&fit=crop', // Burgers
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1992&auto=format&fit=crop'  // Indian food / rich dishes
];

const ALLOWED_CITIES = ['Ahmedabad', 'Gota', 'Sarkhej', 'Bopal', 'Amdavad', 'Ahmedbad', 'Chandkheda', 'Vastrapur', 'Prahlad Nagar', 'Satellite', 'Navrangpura', 'Nikol', 'Naroda', 'Memnagar', 'Gurukul', 'Thaltej', 'Bapunagar', 'Sabarmati', 'Amraiwadi', 'Maninagar', 'Vatva', 'Narol', 'Danilimda', 'Juhapura', 'Paldi', 'Ambawadi', 'Ellisbridge'];

const OTHER_AREAS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Surat', 'Rajkot', 'Vadodara', 'Rajasthan', 'Maharashtra', 'Delhi', 'UP', 'Bihar', 'MP', 'Punjab', 'Haryana'];

const HeroSlider = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [locationError, setLocationError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);

  // Handle slide transitions every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const checkIsAhmedabad = (addressObj) => {
    if (!addressObj) return false;
    // Check all possible fields for Ahmedabad mention
    const searchString = JSON.stringify(addressObj).toLowerCase();
    return searchString.includes('ahmedabad') || searchString.includes('amdavad') || searchString.includes('gota');
  };

  const requestLocation = () => {
    setLocationError('');
    setIsDetecting(true);
    if (navigator.geolocation) {
      setLocationInput('Detecting your location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await res.json();

            const isAllowed = checkIsAhmedabad(data.address);

            if (!isAllowed && data.address && (data.address.city || data.address.state)) {
              setLocationInput('');
              return;
            }

            const address = data.address || {};
            const area = address.neighbourhood || address.suburb || address.city_district || address.road || '';
            const tempCity = address.city || address.town || address.village || 'Ahmedabad';

            const locationString = area ? `${area}, ${tempCity}` : tempCity;
            setLocationInput(locationString);
          } catch (error) {
            console.error("Geo error:", error);
            setLocationInput('');
          } finally {
            setIsDetecting(false);
          }
        },
        (err) => {
          setIsDetecting(false);
          setLocationInput('');
          console.warn("Geolocation failed", err);
        },
        { timeout: 8000 }
      );
    } else {
      setIsDetecting(false);
      setLocationInput('');
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (isDetecting) return;

    const trimmedInput = locationInput.trim().toLowerCase();
    const isAhmedabad = ALLOWED_CITIES.some(c => trimmedInput.includes(c.toLowerCase())) ||
      trimmedInput.includes('ahmedabad') ||
      trimmedInput.includes('amdavad');

    if (locationInput && !isAhmedabad) {
      setLocationError("Delivery only available in Ahmedabad area for now.");
      return;
    }

    if (onSearch) onSearch(searchInput);
    scrollToMenu();
  };

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gray-900 font-sans">
      {/* Background Image Slider with Dark Overlay */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[4000ms] ease-linear scale-100"
            style={{
              backgroundImage: `url('${img}')`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-gray-900/80 via-black/40 to-black/50" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-[4.5rem] font-black text-white mb-6 tracking-tight font-sans drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] fill-mode-both">
          Fresh Food Delivered Fast
        </h1>
        <p className="text-xl md:text-2xl text-white/95 mb-14 max-w-3xl mx-auto font-semibold drop-shadow-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] delay-200 fill-mode-both">
          Craving something delicious? Discover the best dishes delivered straight to your door.
        </p>

        {/* Premium Search Bar */}
        <form
          id="hero-search-form"
          onSubmit={handleSearchSubmit}
          className="w-full max-w-4xl mx-auto group animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] delay-300 fill-mode-both relative z-[30]"
        >
          {/* Combined Location & Search Container */}
          <div className="flex flex-col sm:flex-row items-center w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full shadow-[0_12px_45px_rgba(0,0,0,0.25)] border-2 border-white/60 focus-within:border-warmOrange focus-within:shadow-[0_12px_45px_rgba(249,115,22,0.25)] transition-all duration-300 overflow-visible relative">
            {/* Location Input Section */}
            <div className="flex items-center w-full sm:w-[45%] px-6 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200/60 bg-transparent relative">
              <MapPin className="text-warmOrange mr-3 flex-shrink-0" size={24} />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationInput(val);

                  if (!val.trim() || isDetecting) {
                    setLocationError('');
                    return;
                  }

                  const searchVal = val.trim().toLowerCase();

                  // Check if they typed another state/city
                  const isOtherArea = OTHER_AREAS.some(area => searchVal.includes(area.toLowerCase()));
                  const isAhmedabad = ALLOWED_CITIES.some(c =>
                    c.toLowerCase().includes(searchVal) ||
                    searchVal.includes(c.toLowerCase())
                  ) || searchVal.includes('ahmedabad') || searchVal.includes('amdavad');

                  // Flexible logic: Only show error if they types an Other Area OR it's clearly not Ahmedabad after 8 chars
                  if (isOtherArea || (!isAhmedabad && searchVal.length > 8)) {
                    setLocationError("Delivery only available in Ahmedabad for now.");
                  } else {
                    setLocationError('');
                  }
                }}
                placeholder="Enter delivery location"
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 font-bold focus:outline-none truncate text-lg"
              />
              <button
                onClick={(e) => { e.preventDefault(); requestLocation(); }}
                className={`ml-2 flex-shrink-0 p-2 rounded-full transition-colors flex items-center justify-center group/btn outline-none ${isDetecting ? 'animate-spin text-gray-400' : 'text-warmOrange hover:bg-orange-100'}`}
                title="Detect Location"
                disabled={isDetecting}
              >
                <Navigation size={20} className={`${!isDetecting && 'transform group-hover/btn:scale-110 group-hover/btn:-rotate-45'} transition-all`} />
              </button>

              {/* Compact Tooltip-style Error Message */}
              {locationError && (
                <div className="absolute top-full left-4 mt-2 z-[40] animate-in fade-in slide-in-from-top-2 duration-300 w-[max-content] max-w-[280px]">
                  <div className="bg-red-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-shake">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span className="leading-tight">{locationError}</span>
                  </div>
                  <div className="absolute -top-1 left-6 w-3 h-3 bg-red-600 rotate-45 -z-10" />
                </div>
              )}
            </div>

            {/* Food Search Section */}
            <div className="flex items-center w-full sm:w-[55%] px-6 py-3 sm:py-4 bg-transparent">
              <Search className="text-gray-400 mr-3 flex-shrink-0 group-focus-within:text-warmOrange transition-colors" size={24} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 text-lg font-bold focus:outline-none"
                placeholder="Search for delicious food..."
              />
            </div>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] delay-500 fill-mode-both">
          {/* Order Now Button */}
          <button
            type="submit"
            form="hero-search-form"
            className="w-full sm:w-[260px] px-8 py-4 sm:py-5 rounded-full bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold text-xl border-2 border-transparent shadow-[0_8px_20px_rgba(249,115,22,0.5)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.6)] transform hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center whitespace-nowrap"
          >
            Order Now
          </button>

          {/* Explore Menu Button */}
          <button
            onClick={(e) => { e.preventDefault(); scrollToMenu(); }}
            className="group w-full sm:w-[260px] px-8 py-4 sm:py-5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xl border-2 border-white/50 hover:border-white/80 backdrop-blur-md transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 transform hover:-translate-y-1.5 hover:scale-[1.03] whitespace-nowrap"
          >
            Explore Menu
            <svg className="w-6 h-6 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-warmOrange w-8 opacity-100' : 'bg-white/50 hover:bg-white w-2 opacity-70'
              }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
