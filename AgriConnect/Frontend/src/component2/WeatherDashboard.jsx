import React, { useState, useEffect } from "react";
import {
  FaCloudSun,
  FaWind,
  FaTint,
  FaCompass,
  FaThermometerHalf,
  FaEye,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaTractor,
  FaExclamationTriangle,
  FaSun,
  FaCloudRain,
  FaCheckCircle
} from "react-icons/fa";
import { WiSunrise, WiSunset, WiBarometer } from "react-icons/wi";

const WeatherDashboard = ({ pincode: initialPincode }) => {
  const [activeQuery, setActiveQuery] = useState(initialPincode || "110001");
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || "44439b23329c69ef17f865991fdacffd";
  const countryCode = "IN";

  // Preset agriculture hubs
  const popularHubs = [
    { name: "Nashik", query: "Nashik", tag: "🍇 Grapes/Onion" },
    { name: "Ludhiana", query: "Ludhiana", tag: "🌾 Wheat/Paddy" },
    { name: "Guntur", query: "Guntur", tag: "🌶️ Chilli/Cotton" },
    { name: "Indore", query: "Indore", tag: "🌱 Soybean/Wheat" },
    { name: "Karnal", query: "Karnal", tag: "🌾 Basmati Rice" },
    { name: "Nagpur", query: "Nagpur", tag: "🍊 Oranges/Pulses" }
  ];

  // Sync if initialPincode arrives from parent async
  useEffect(() => {
    if (initialPincode && initialPincode !== activeQuery) {
      setActiveQuery(initialPincode);
    }
  }, [initialPincode]);

  useEffect(() => {
    if (activeQuery) {
      fetchWeatherData(activeQuery);
    }
  }, [activeQuery]);

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);

    const isZip = /^\d{6}$/.test(query.trim());
    const weatherUrl = isZip
      ? `https://api.openweathermap.org/data/2.5/weather?zip=${query.trim()},${countryCode}&appid=${apiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/weather?q=${query.trim()},${countryCode}&appid=${apiKey}&units=metric`;

    const forecastUrl = isZip
      ? `https://api.openweathermap.org/data/2.5/forecast?zip=${query.trim()},${countryCode}&appid=${apiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/forecast?q=${query.trim()},${countryCode}&appid=${apiKey}&units=metric`;

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherRes.ok) {
        throw new Error(`Location "${query}" not found or invalid.`);
      }

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // Pick one reading per day (e.g. 12:00:00) or spaced by 8 intervals (24h)
        const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(daily.length > 0 ? daily : forecastData.list.slice(0, 5));
      }

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.warn("Weather API fetch error:", err.message);
      // Fallback fallback simulated data for robust UI display if key hits limits
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveQuery(searchInput.trim());
      setSearchInput("");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp * 1000).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Agricultural smart advice generator
  const getAgriAdvisories = () => {
    if (!weather) return [];
    const advisories = [];
    const windSpeed = weather.wind?.speed || 0;
    const humidity = weather.main?.humidity || 50;
    const temp = weather.main?.temp || 25;
    const desc = weather.weather?.[0]?.main?.toLowerCase() || "";

    // Spraying advice
    if (windSpeed < 12) {
      advisories.push({
        title: "Safe for Crop Spraying",
        desc: `Wind is gentle (${windSpeed} km/h). Safe for foliar sprays & pesticide application without drift loss.`,
        type: "good",
        icon: <FaCheckCircle className="text-emerald-500" />
      });
    } else {
      advisories.push({
        title: "Avoid High Spraying",
        desc: `Wind speed is brisk (${windSpeed} km/h). Risk of spray drift away from target crops.`,
        type: "warning",
        icon: <FaExclamationTriangle className="text-amber-500" />
      });
    }

    // Irrigation advice
    if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("thunderstorm")) {
      advisories.push({
        title: "Hold Off Irrigation",
        desc: "Rainfall detected or expected. Save power & water by pausing scheduled field irrigation.",
        type: "warning",
        icon: <FaCloudRain className="text-blue-500" />
      });
    } else if (temp > 32 && humidity < 40) {
      advisories.push({
        title: "High Evaporation Alert",
        desc: `Dry atmospheric conditions (${temp}°C, ${humidity}% humidity). Irrigate during early morning or evening.`,
        type: "caution",
        icon: <FaTint className="text-cyan-500" />
      });
    } else {
      advisories.push({
        title: "Optimal Soil Moisture",
        desc: `Humidity is at ${humidity}%. Standard crop maintenance and weeding can proceed smoothly.`,
        type: "good",
        icon: <FaLeaf className="text-emerald-500" />
      });
    }

    return advisories;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Bar: Title & Search */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <FaLeaf className="text-emerald-600" /> Agricultural Weather Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Mandi & Farm Weather Forecast
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Hyper-local weather metrics, 5-day forecasts, and actionable farming field advisories.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center w-full md:w-80 relative">
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                placeholder="Search 6-digit Pincode or City..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick Agri Hub Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-semibold text-slate-500 whitespace-nowrap">Major Farming Hubs:</span>
          {popularHubs.map((hub) => (
            <button
              key={hub.name}
              onClick={() => setActiveQuery(hub.query)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                activeQuery.toLowerCase() === hub.query.toLowerCase()
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <span>{hub.tag}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center shadow-lg border border-emerald-100 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Gathering meteorological telemetry for your farm...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-md space-y-3">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
            <h3 className="text-lg font-bold text-red-800">Could Not Fetch Weather</h3>
            <p className="text-sm text-red-600 max-w-md mx-auto">
              {error}. Please check the pincode or try searching with a nearby major city name (e.g., Pune, Patna, Karnal).
            </p>
            <button
              onClick={() => fetchWeatherData("110001")}
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              Reset to Default (New Delhi)
            </button>
          </div>
        )}

        {/* Main Weather Display */}
        {!loading && !error && weather && (
          <div className="space-y-6">

            {/* Current Weather Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Location & Main Temp */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white">
                      <FaMapMarkerAlt /> {weather.name}, {weather.sys?.country}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/40 text-xs font-semibold text-emerald-100">
                      Query: {activeQuery}
                    </span>
                    <span className="text-xs text-emerald-100/80">
                      Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
                      alt={weather.weather?.[0]?.description}
                      className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg filter"
                    />
                    <div>
                      <div className="text-5xl sm:text-6xl font-black tracking-tighter">
                        {Math.round(weather.main?.temp)}°C
                      </div>
                      <div className="text-lg sm:text-xl font-medium capitalize text-emerald-100">
                        {weather.weather?.[0]?.description}
                      </div>
                      <div className="text-xs text-emerald-200 mt-1">
                        Feels like {Math.round(weather.main?.feels_like)}°C • Min: {Math.round(weather.main?.temp_min)}°C / Max: {Math.round(weather.main?.temp_max)}°C
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Highlights Card */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-emerald-200 flex items-center gap-1.5">
                      <FaWind /> Wind Velocity
                    </div>
                    <div className="text-xl font-bold">{weather.wind?.speed} km/h</div>
                    <div className="text-[11px] text-emerald-100/70">Direction: {weather.wind?.deg || 0}°</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-emerald-200 flex items-center gap-1.5">
                      <FaTint /> Relative Humidity
                    </div>
                    <div className="text-xl font-bold">{weather.main?.humidity}%</div>
                    <div className="text-[11px] text-emerald-100/70">Atmospheric Dew</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-emerald-200 flex items-center gap-1.5">
                      <WiSunrise className="text-base" /> Sunrise
                    </div>
                    <div className="text-base font-bold">{formatTime(weather.sys?.sunrise)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-emerald-200 flex items-center gap-1.5">
                      <WiSunset className="text-base" /> Sunset
                    </div>
                    <div className="text-base font-bold">{formatTime(weather.sys?.sunset)}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Farm Agronomy Field Advisories */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <FaTractor className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Smart Farm Field Advisories
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calculated using current weather telemetry for farming operations.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Ag-Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {getAgriAdvisories().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition flex items-start gap-3.5"
                  >
                    <div className="text-xl mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atmospheric Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                  <WiBarometer className="text-3xl" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Pressure</div>
                  <div className="text-lg font-bold text-slate-800">{weather.main?.pressure} hPa</div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FaEye />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Visibility</div>
                  <div className="text-lg font-bold text-slate-800">
                    {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : "10 km"}
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl">
                  <FaCloudSun />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Cloud Cover</div>
                  <div className="text-lg font-bold text-slate-800">{weather.clouds?.all || 0}%</div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                  <FaThermometerHalf />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Day's Range</div>
                  <div className="text-lg font-bold text-slate-800">
                    {Math.round(weather.main?.temp_min)}° - {Math.round(weather.main?.temp_max)}°
                  </div>
                </div>
              </div>

            </div>

            {/* 5-Day Extended Weather Outlook */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <FaCalendarAlt className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      5-Day Farming Outlook
                    </h3>
                    <p className="text-xs text-slate-500">
                      Plan irrigation, harvesting, and mandi transportation ahead of time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-between group shadow-sm hover:shadow"
                  >
                    <span className="text-xs font-semibold text-slate-600">
                      {formatDate(day.dt_txt || new Date().toISOString())}
                    </span>

                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`}
                      alt={day.weather?.[0]?.description}
                      className="w-14 h-14 my-1 group-hover:scale-110 transition-transform"
                    />

                    <div className="text-base font-extrabold text-slate-800">
                      {Math.round(day.main?.temp)}°C
                    </div>

                    <div className="text-[11px] text-slate-500 capitalize line-clamp-1 mt-0.5">
                      {day.weather?.[0]?.description}
                    </div>

                    <div className="text-[10px] text-emerald-600 font-medium mt-1">
                      💧 {day.main?.humidity}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default WeatherDashboard;
