"use strict";

/* ============================================================
   STATE
   ============================================================ */
const state = {
  variables: [],
  selectedVars: new Set(),
  customPresets: {},
  cache: {},
  lastData: null,
  lastModel: null,
  lastTimezone: "UTC",
  lastUtcOffset: 0,
  sortMode: "default",
  lang: "en",
};

/* ============================================================
   CONFIG & MODELS
   ============================================================ */
const AUTO_VARS = ["weather_code", "is_day"];

const JALALI_MONTHS_FA = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const JALALI_MONTHS_EN = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];

const MODELS = {
  google_weathernext2_ensemble: "Google WeatherNext 2 Ensemble",
  google_weathernext2_ensemble_mean: "Google WeatherNext 2 Ensemble Mean",
  ncep_aigfs025: "NOAA AIGFS 0.25°",
  ecmwf_ifs025: "ECMWF IFS 0.25°",
  gfs_seamless: "NOAA GFS (Seamless)",
  ecmwf_ifs025_ensemble: "ECMWF IFS 0.25° Ensemble",
  ncep_gefs_seamless: "NOAA GEFS (Seamless)",
  ecmwf_aifs025: "ECMWF AIFS 0.25°",
  ecmwf_aifs025_ensemble: "ECMWF AIFS 0.25° Ensemble",
  ncep_gefs05: "NOAA GEFS 0.5° (35-Day)",
  ecmwf_ec46: "ECMWF EC46 (Sub-seasonal)",
  ecmwf_seas5: "ECMWF SEAS5 (Seasonal)",
  ecmwf_seasonal_seamless: "ECMWF Seasonal (Seamless)",
  icon_seamless_eps: "DWD ICON-EPS (Global)",
  icon_eu_eps: "DWD ICON-EU-EPS (Europe)",
  icon_d2_eps: "DWD ICON-D2-EPS (Germany)",
  open_meteo_air_quality: "Open-Meteo Air Quality (CAMS)",
  open_meteo_marine: "Open-Meteo Marine Weather"
};

const MODEL_API_BASE = {
  google_weathernext2_ensemble: "https://ensemble-api.open-meteo.com/v1/ensemble",
  google_weathernext2_ensemble_mean: "https://ensemble-api.open-meteo.com/v1/ensemble",
  ncep_aigfs025: "https://api.open-meteo.com/v1/forecast",
  ecmwf_ifs025: "https://api.open-meteo.com/v1/forecast",
  gfs_seamless: "https://api.open-meteo.com/v1/forecast",
  ecmwf_ifs025_ensemble: "https://ensemble-api.open-meteo.com/v1/ensemble",
  ncep_gefs_seamless: "https://ensemble-api.open-meteo.com/v1/ensemble",
  ecmwf_aifs025: "https://api.open-meteo.com/v1/forecast",
  ecmwf_aifs025_ensemble: "https://ensemble-api.open-meteo.com/v1/ensemble",
  ncep_gefs05: "https://ensemble-api.open-meteo.com/v1/ensemble",
  ecmwf_ec46: "https://seasonal-api.open-meteo.com/v1/seasonal",
  ecmwf_seas5: "https://seasonal-api.open-meteo.com/v1/seasonal",
  ecmwf_seasonal_seamless: "https://seasonal-api.open-meteo.com/v1/seasonal",
  icon_seamless_eps: "https://ensemble-api.open-meteo.com/v1/ensemble",
  icon_eu_eps: "https://ensemble-api.open-meteo.com/v1/ensemble",
  icon_d2_eps: "https://ensemble-api.open-meteo.com/v1/ensemble",
  open_meteo_air_quality: "https://air-quality-api.open-meteo.com/v1/air-quality",
  open_meteo_marine: "https://marine-api.open-meteo.com/v1/marine"
};

const MODEL_MAX_DAYS = {
  ecmwf_ifs025: 15, google_weathernext2_ensemble: 15, google_weathernext2_ensemble_mean: 15,
  ecmwf_ifs025_ensemble: 15, ecmwf_aifs025: 15, ecmwf_aifs025_ensemble: 15,
  ncep_aigfs025: 16, gfs_seamless: 16, ncep_gefs_seamless: 35, ncep_gefs05: 35,
  ecmwf_ec46: 46, ecmwf_seas5: 214, ecmwf_seasonal_seamless: 214,
  icon_seamless_eps: 7, icon_eu_eps: 5, icon_d2_eps: 2,
  open_meteo_air_quality: 7, open_meteo_marine: 7
};

const PRESSURE_LEVELS = [1000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100, 50];

const IRANIAN_CITIES = [
  { en: "Ahvaz", fa: "اهواز", lat: 31.3189, lon: 48.6842 },
  { en: "Arak", fa: "اراک", lat: 34.0950, lon: 49.6981 },
  { en: "Ardabil", fa: "اردبیل", lat: 38.2500, lon: 48.3000 },
  { en: "Bandar Abbas", fa: "بندرعباس", lat: 27.1864, lon: 56.2808 },
  { en: "Birjand", fa: "بیرجند", lat: 32.8663, lon: 59.2211 },
  { en: "Bojnord", fa: "بجنورد", lat: 37.4747, lon: 57.3290 },
  { en: "Bushehr", fa: "بوشهر", lat: 28.9234, lon: 50.8200 },
  { en: "Gorgan", fa: "گرگان", lat: 36.8427, lon: 54.4435 },
  { en: "Hamadan", fa: "همدان", lat: 34.8065, lon: 48.5162 },
  { en: "Ilam", fa: "ایلام", lat: 33.6374, lon: 46.4227 },
  { en: "Isfahan", fa: "اصفهان", lat: 32.6525, lon: 51.6750 },
  { en: "Karaj", fa: "کرج", lat: 35.8328, lon: 50.9917 },
  { en: "Kerman", fa: "کرمان", lat: 30.2911, lon: 57.0678 },
  { en: "Kermanshah", fa: "کرمانشاه", lat: 34.3167, lon: 47.0686 },
  { en: "Khorramabad", fa: "خرم‌آباد", lat: 33.4878, lon: 48.3558 },
  { en: "Mashhad", fa: "مشهد", lat: 36.2975, lon: 59.6059 },
  { en: "Qazvin", fa: "قزوین", lat: 36.2797, lon: 50.0049 },
  { en: "Qom", fa: "قم", lat: 34.6400, lon: 50.8764 },
  { en: "Rasht", fa: "رشت", lat: 37.2761, lon: 49.5886 },
  { en: "Sanandaj", fa: "سنندج", lat: 35.3115, lon: 46.9963 },
  { en: "Sari", fa: "ساری", lat: 36.5633, lon: 53.0601 },
  { en: "Semnan", fa: "سمنان", lat: 35.5729, lon: 53.3971 },
  { en: "Shahr-e Kord", fa: "شهرکرد", lat: 32.3256, lon: 50.8644 },
  { en: "Shiraz", fa: "شیراز", lat: 29.6100, lon: 52.5425 },
  { en: "Tabriz", fa: "تبریز", lat: 38.0739, lon: 46.2961 },
  { en: "Tehran", fa: "تهران", lat: 35.6944, lon: 51.4215 },
  { en: "Urmia", fa: "ارومیه", lat: 37.5486, lon: 45.0675 },
  { en: "Yasuj", fa: "یاسوج", lat: 30.6682, lon: 51.5879 },
  { en: "Yazd", fa: "یزد", lat: 31.8972, lon: 54.3675 },
  { en: "Zahedan", fa: "زاهدان", lat: 29.4929, lon: 60.8503 },
  { en: "Zanjan", fa: "زنجان", lat: 36.6764, lon: 48.4963 },
  { en: "Abadan", fa: "آبادان", lat: 30.3392, lon: 48.3043 },
  { en: "Amol", fa: "آمل", lat: 36.4697, lon: 52.3507 },
  { en: "Andimeshk", fa: "اندیمشک", lat: 32.4500, lon: 48.3500 },
  { en: "Babol", fa: "بابل", lat: 36.5442, lon: 52.6789 },
  { en: "Bandar-e Anzali", fa: "بندر انزلی", lat: 37.4720, lon: 49.4575 },
  { en: "Borujerd", fa: "بروجرد", lat: 33.8973, lon: 48.7516 },
  { en: "Chabahar", fa: "چابهار", lat: 25.2919, lon: 60.6430 },
  { en: "Dezful", fa: "دزفول", lat: 32.3833, lon: 48.4000 },
  { en: "Kashan", fa: "کاشان", lat: 33.9833, lon: 51.4333 },
  { en: "Khomeyni Shahr", fa: "خمینی‌شهر", lat: 32.7000, lon: 51.5333 },
  { en: "Khoy", fa: "خوی", lat: 38.5500, lon: 44.9500 },
  { en: "Kish Island", fa: "جزیره کیش", lat: 26.5578, lon: 53.9806 },
  { en: "Maragheh", fa: "مراغه", lat: 37.3924, lon: 46.2391 },
  { en: "Marand", fa: "مرند", lat: 38.4333, lon: 45.7667 },
  { en: "Marvdasht", fa: "مرودشت", lat: 29.8742, lon: 52.8025 },
  { en: "Meybod", fa: "میبد", lat: 32.2500, lon: 54.0167 },
  { en: "Miandoab", fa: "میاندوآب", lat: 36.9667, lon: 46.1000 },
  { en: "Mianeh", fa: "میانه", lat: 37.4167, lon: 47.7000 },
  { en: "Najafabad", fa: "نجف‌آباد", lat: 32.6333, lon: 51.3667 },
  { en: "Neyshabur", fa: "نیشابور", lat: 36.2133, lon: 58.7958 },
  { en: "Qaem Shahr", fa: "قائم‌شهر", lat: 36.4630, lon: 52.8600 },
  { en: "Qeshm", fa: "قشم", lat: 26.9492, lon: 56.2689 },
  { en: "Rafsanjan", fa: "رفسنجان", lat: 30.4067, lon: 55.9939 },
  { en: "Sabzevar", fa: "سبزوار", lat: 36.2126, lon: 57.6819 },
  { en: "Saveh", fa: "ساوه", lat: 35.0213, lon: 50.3566 },
  { en: "Saqqez", fa: "سقز", lat: 36.2500, lon: 46.2667 },
  { en: "Shahr-e Babak", fa: "شهربابک", lat: 30.1164, lon: 55.1186 },
  { en: "Sirjan", fa: "سیرجان", lat: 29.4500, lon: 55.6833 },
  { en: "Tabas", fa: "طبس", lat: 33.5958, lon: 56.9242 },
  { en: "Torbat-e Heydarieh", fa: "تربت حیدریه", lat: 35.2740, lon: 59.2197 },
  { en: "Varamin", fa: "ورامین", lat: 35.3242, lon: 51.6456 }
];

const WMO_ICONS = {
  0: { day: "☀️", night: "🌙", en: "Clear sky", fa: "آسمان صاف" },
  1: { day: "🌤️", night: "🌙", en: "Mainly clear", fa: "عمدتاً صاف" },
  2: { day: "⛅", night: "☁️", en: "Partly cloudy", fa: "نیمه‌ابری" },
  3: { day: "☁️", night: "☁️", en: "Overcast", fa: "ابری" },
  45: { day: "🌫️", night: "🌫️", en: "Fog", fa: "مه" },
  48: { day: "🌫️", night: "🌫️", en: "Depositing rime fog", fa: "مه یخ‌زده" },
  51: { day: "🌦️", night: "🌧️", en: "Light drizzle", fa: "نم‌نم باران سبک" },
  53: { day: "🌦️", night: "🌧️", en: "Moderate drizzle", fa: "نم‌نم باران متوسط" },
  55: { day: "🌧️", night: "🌧️", en: "Dense drizzle", fa: "نم‌نم باران شدید" },
  56: { day: "🌧️", night: "🌧️", en: "Light freezing drizzle", fa: "نم‌نم باران یخ‌زده سبک" },
  57: { day: "🌧️", night: "🌧️", en: "Dense freezing drizzle", fa: "نم‌نم باران یخ‌زده شدید" },
  61: { day: "🌧️", night: "🌧️", en: "Slight rain", fa: "باران سبک" },
  63: { day: "🌧️", night: "🌧️", en: "Moderate rain", fa: "باران متوسط" },
  65: { day: "🌧️", night: "🌧️", en: "Heavy rain", fa: "باران شدید" },
  66: { day: "🌧️", night: "🌧️", en: "Light freezing rain", fa: "باران یخ‌زده سبک" },
  67: { day: "🌧️", night: "🌧️", en: "Heavy freezing rain", fa: "باران یخ‌زده شدید" },
  71: { day: "🌨️", night: "🌨️", en: "Slight snowfall", fa: "برف سبک" },
  73: { day: "🌨️", night: "🌨️", en: "Moderate snowfall", fa: "برف متوسط" },
  75: { day: "❄️", night: "❄️", en: "Heavy snowfall", fa: "برف شدید" },
  77: { day: "❄️", night: "❄️", en: "Snow grains", fa: "دانه‌های برف" },
  80: { day: "🌧️", night: "🌧️", en: "Slight rain showers", fa: "رگبار سبک" },
  81: { day: "🌧️", night: "🌧️", en: "Moderate rain showers", fa: "رگبار متوسط" },
  82: { day: "🌧️", night: "🌧️", en: "Violent rain showers", fa: "رگبار شدید" },
  85: { day: "🌨️", night: "🌨️", en: "Slight snow showers", fa: "رگبار برف سبک" },
  86: { day: "🌨️", night: "🌨️", en: "Heavy snow showers", fa: "رگبار برف شدید" },
  95: { day: "⛈️", night: "⛈️", en: "Thunderstorm", fa: "طوفان تندری (رعد و برق)" },
  96: { day: "⛈️", night: "⛈️", en: "Thunderstorm with slight hail", fa: "رعد و برق با تگرگ سبک" },
  99: { day: "⛈️", night: "⛈️", en: "Thunderstorm with heavy hail", fa: "رعد و برق با تگرگ شدید" }
};

const VAR_INFO = {
  temperature_2m: ["Air temperature at 2 m", "temp"],
  relative_humidity_2m: ["Relative humidity at 2 m", "fixed:%"],
  dew_point_2m: ["Dew point at 2 m", "temp"],
  apparent_temperature: ["Feels-like temperature", "temp"],
  precipitation: ["Total precipitation", "precip"],
  rain: ["Rainfall amount", "precip"],
  snowfall: ["Snowfall amount", "fixed:cm"],
  snow_depth: ["Snow depth", "fixed:m"],
  pressure_msl: ["Mean sea-level pressure", "fixed:hPa"],
  surface_pressure: ["Surface pressure", "fixed:hPa"],
  surface_temperature: ["Skin temperature", "temp"],
  cloud_cover: ["Total cloud cover", "fixed:%"],
  cloud_cover_low: ["Low cloud cover", "fixed:%"],
  cloud_cover_mid: ["Mid cloud cover", "fixed:%"],
  cloud_cover_high: ["High cloud cover", "fixed:%"],
  wind_speed_10m: ["Wind speed at 10 m", "wind"],
  wind_speed_100m: ["Wind speed at 100 m", "wind"],
  wind_direction_10m: ["Wind direction at 10 m", "fixed:°"],
  wind_direction_100m: ["Wind direction at 100 m", "fixed:°"],
  wind_gusts_10m: ["Wind gusts at 10 m", "wind"],
  visibility: ["Horizontal visibility", "fixed:m"],
  et0_fao_evapotranspiration: ["Reference evapotranspiration", "precip"],
  vapour_pressure_deficit: ["Vapour pressure deficit", "fixed:kPa"],
  sea_surface_temperature: ["Sea-surface temperature", "temp"],
  snowfall_water_equivalent: ["Snowfall water equivalent", "precip"],
  pm2_5: ["Fine particulate matter (PM2.5)", "fixed:μg/m³"],
  pm10: ["Coarse particulate matter (PM10)", "fixed:μg/m³"],
  carbon_monoxide: ["Carbon monoxide (CO)", "fixed:μg/m³"],
  nitrogen_dioxide: ["Nitrogen dioxide (NO2)", "fixed:μg/m³"],
  sulphur_dioxide: ["Sulphur dioxide (SO2)", "fixed:μg/m³"],
  ozone: ["Ozone (O3)", "fixed:μg/m³"],
  european_aqi: ["European AQI", "dimensionless"],
  us_aqi: ["US AQI", "dimensionless"],
  dust: ["Saharan dust", "fixed:μg/m³"],
  uv_index: ["UV Index", "dimensionless"],
  wave_height: ["Wave height", "fixed:m"],
  wave_direction: ["Wave direction", "fixed:°"],
  wave_period: ["Wave period", "fixed:s"],
  swell_wave_height: ["Swell wave height", "fixed:m"],
  swell_wave_direction: ["Swell wave direction", "fixed:°"],
  swell_wave_period: ["Swell wave period", "fixed:s"]
};

for (const lvl of PRESSURE_LEVELS) {
  VAR_INFO[`temperature_${lvl}hPa`] = [`Air temperature at ${lvl} hPa`, "temp"];
  VAR_INFO[`relative_humidity_${lvl}hPa`] = [`Relative humidity at ${lvl} hPa`, "fixed:%"];
  VAR_INFO[`dew_point_${lvl}hPa`] = [`Dew point at ${lvl} hPa`, "temp"];
  VAR_INFO[`cloud_cover_${lvl}hPa`] = [`Cloud cover at ${lvl} hPa`, "fixed:%"];
  VAR_INFO[`wind_speed_${lvl}hPa`] = [`Wind speed at ${lvl} hPa`, "wind"];
  VAR_INFO[`wind_direction_${lvl}hPa`] = [`Wind direction at ${lvl} hPa`, "fixed:°"];
  VAR_INFO[`vertical_velocity_${lvl}hPa`] = [`Vertical velocity at ${lvl} hPa`, "fixed:m/s"];
  VAR_INFO[`geopotential_height_${lvl}hPa`] = [`Geopotential height at ${lvl} hPa`, "fixed:m"];
}

const SDK_MAP = {};
const SURFACE_MAP = {
  temperature_2m: [2, 0], relative_humidity_2m: [3, 0], dew_point_2m: [4, 0],
  apparent_temperature: [5, 0], precipitation: [6, 0], rain: [7, 0],
  snowfall: [8, 0], snow_depth: [9, 0], weather_code: [10, 0],
  pressure_msl: [11, 0], surface_pressure: [12, 0], surface_temperature: [13, 0],
  cloud_cover: [14, 0], cloud_cover_low: [15, 0], cloud_cover_mid: [16, 0],
  cloud_cover_high: [17, 0], wind_speed_10m: [18, 0], wind_speed_100m: [19, 0],
  wind_direction_10m: [20, 0], wind_direction_100m: [21, 0], wind_gusts_10m: [22, 0],
  visibility: [23, 0], et0_fao_evapotranspiration: [24, 0],
  vapour_pressure_deficit: [25, 0], sea_surface_temperature: [26, 0],
  snowfall_water_equivalent: [27, 0], is_day: [28, 0]
};
for (const [k, v] of Object.entries(SURFACE_MAP)) SDK_MAP[k] = v;
for (const lvl of PRESSURE_LEVELS) {
  SDK_MAP[`temperature_${lvl}hPa`] = [2, lvl];
  SDK_MAP[`relative_humidity_${lvl}hPa`] = [3, lvl];
  SDK_MAP[`dew_point_${lvl}hPa`] = [4, lvl];
  SDK_MAP[`cloud_cover_${lvl}hPa`] = [14, lvl];
  SDK_MAP[`wind_speed_${lvl}hPa`] = [18, lvl];
  SDK_MAP[`wind_direction_${lvl}hPa`] = [20, lvl];
  SDK_MAP[`vertical_velocity_${lvl}hPa`] = [60, lvl];
  SDK_MAP[`geopotential_height_${lvl}hPa`] = [61, lvl];
}

const DEFAULT_VARS_ENSEMBLE = [];
for (const lvl of PRESSURE_LEVELS) {
  DEFAULT_VARS_ENSEMBLE.push(`temperature_${lvl}hPa`, `geopotential_height_${lvl}hPa`, `vertical_velocity_${lvl}hPa`, `dew_point_${lvl}hPa`);
}
const DEFAULT_VARS_MEAN = [
  "temperature_2m", "relative_humidity_2m", "dew_point_2m", "apparent_temperature",
  "precipitation", "rain", "snowfall", "snow_depth", "pressure_msl", "surface_pressure", "surface_temperature",
  "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high",
  "wind_speed_10m", "wind_speed_100m", "wind_direction_10m", "wind_direction_100m",
  "wind_gusts_10m", "visibility", "et0_fao_evapotranspiration", "vapour_pressure_deficit"
];
const DEFAULT_VARS_AIR_QUALITY = ["pm2_5", "pm10", "european_aqi", "nitrogen_dioxide", "ozone"];
const DEFAULT_VARS_MARINE = ["wave_height", "wave_direction", "wave_period", "sea_surface_temperature"];

const PRESETS = {
  "Upper-air standard": ["temperature_500hPa", "temperature_700hPa", "temperature_850hPa", "geopotential_height_500hPa", "geopotential_height_700hPa", "geopotential_height_850hPa"],
  "Vertical motion": ["vertical_velocity_500hPa", "vertical_velocity_700hPa", "vertical_velocity_850hPa"],
  "Surface essentials": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "precipitation", "cloud_cover"],
  "Cyclogenesis watch": ["pressure_msl", "geopotential_height_500hPa", "vertical_velocity_500hPa", "wind_speed_500hPa"]
};

const CATEGORY_ORDER = ["temperature", "dew_point", "humidity", "geopotential", "wind_speed", "wind_direction", "vertical_velocity", "cloud", "precipitation", "pressure", "visibility", "air_quality", "marine", "other"];

/* ============================================================
   I18N
   ============================================================ */
const I18N = {
  en: {
    location: "Location", model: "Model", variables: "Variables",
    sort: "Sort", selectAll: "Select All", clear: "Clear", info: "ℹ Info",
    discover: "🔎 Discover", refresh: "🔄 Refresh",
    presets: "Presets", apply: "Apply", savePreset: "+ Save current",
    delete: "Delete", exportJSON: "Export JSON",
    timeRange: "Time Range", forecastDays: "Forecast days", pastDays: "Past days",
    timezone: "Timezone", timeOfDay: "Time of day", displayTz: "Display tz",
    allHours: "All hours", local: "Local", utc: "UTC",
    display: "Display", spread: "Spread",
    spreadNone: "None", spreadIQR: "IQR band (25–75%)", spreadP10: "10–90% band", spreadSpag: "Spaghetti (all members)", spreadBoth: "Spaghetti + IQR",
    showMean: "Show ensemble mean", highlightMembers: "Highlight members",
    autoScale: "Auto-scale Y", pad: "Pad %", logY: "Log Y (positive only)",
    dayGrid: "Day grid", hourGrid: "Hour grid",
    weatherIcons: "Weather icons (WMO)", darkMode: "Dark mode",
    units: "Units", temperature: "Temperature", windSpeed: "Wind speed", precipitation: "Precipitation",
    export: "Export", saveCSV: "💾 CSV", savePNG: "🖼 PNG",
    fetchPlot: "▶ Fetch & Plot",
    ready: "Ready. Click Fetch & Plot to begin.",
    selectCity: "— Select City —", searchCity: "Search city...",
    fetching: "Fetching data...", discovering: "Discovering variables...", discoveryComplete: "Discovery complete",
    cachedList: "Cached list", cached: "cached", curatedDefaults: "Curated defaults. Click Discover to probe.",
    noData: "No data returned.",
    sortDefault: "Default", sortName: "Name (A–Z)", sortClass: "Classification", sortLevel: "Pressure level",
    toastFetched: "Fetched", toastSelectVar: "Select at least one variable.", toastCoordinates: "Enter valid coordinates.",
    toastCSVSaved: "CSV saved.", toastPNGSaved: "PNG saved.", toastNoData: "No data. Fetch first.", toastPresetSaved: "Preset saved.",
    toastPresetDeleted: "Preset deleted.", toastCannotDelete: "Cannot delete built-in preset.", toastCannotOverwrite: "Cannot overwrite built-in preset.",
    toastPresetApplied: "Preset applied.", toastDiscoveryFailed: "Discovery failed.", toastFetchFailed: "Fetch failed:",
    weatherHint: "Weather icons are fetched automatically and never plotted.", weatherHintOff: "Weather icons off (toggle in Display).",
    calendar: "Calendar", searchResult: "Search Result", noCityFound: "No city found.", searchFailed: "Search failed.",
    yAxisBasis: "Y-Axis Basis",
    basisMean: "Mean only",
    basisMembers: "All members (Spaghetti)"
  },
  fa: {
    location: "موقعیت", model: "مدل", variables: "متغیرها",
    sort: "مرتب‌سازی", selectAll: "انتخاب همه", clear: "پاک کردن", info: "ℹ اطلاعات",
    discover: "🔎 کشف", refresh: "🔄 به‌روزرسانی",
    presets: "تنظیمات پیش‌فرض", apply: "اعمال", savePreset: "+ ذخیره فعلی",
    delete: "حذف", exportJSON: "خروجی JSON",
    timeRange: "بازه زمانی", forecastDays: "روزهای پیش‌بینی", pastDays: "روزهای گذشته",
    timezone: "منطقه زمانی", timeOfDay: "ساعت روز", displayTz: "منطقه نمایش",
    allHours: "همه ساعات", local: "محلی", utc: "UTC",
    display: "نمایش", spread: "پراکندگی",
    spreadNone: "هیچ", spreadIQR: "بازه IQR (۲۵–۷۵٪)", spreadP10: "بازه ۱۰–۹۰٪", spreadSpag: "اسپاگتی (همه اعضا)", spreadBoth: "اسپاگتی + IQR",
    showMean: "نمایش میانگین مجموعه", highlightMembers: "اعضای برجسته",
    autoScale: "مقیاس خودکار Y", pad: "حاشیه ٪", logY: "مقیاس لگاریتمی (فقط مثبت)",
    dayGrid: "خطوط روز", hourGrid: "خطوط ساعت",
    weatherIcons: "آیکون آب‌وهوا (WMO)", darkMode: "حالت تاریک",
    units: "واحدها", temperature: "دما", windSpeed: "سرعت باد", precipitation: "بارش",
    export: "خروجی", saveCSV: "💾 CSV", savePNG: "🖼 PNG",
    fetchPlot: "▶ دریافت و رسم نمودار",
    ready: "آماده. روی دریافت و رسم نمودار کلیک کنید.",
    selectCity: "— انتخاب شهر —", searchCity: "جستجوی شهر...",
    fetching: "در حال دریافت داده...", discovering: "در حال کشف متغیرها...", discoveryComplete: "کشف کامل شد",
    cachedList: "فهرست ذخیره‌شده", cached: "ذخیره‌شده", curatedDefaults: "پیش‌فرض‌های آماده. روی کشف کلیک کنید.",
    noData: "داده‌ای برگردانده نشد.",
    sortDefault: "پیش‌فرض", sortName: "نام (الف–ی)", sortClass: "دسته‌بندی", sortLevel: "سطح فشار",
    toastFetched: "دریافت شد", toastSelectVar: "حداقل یک متغیر انتخاب کنید.", toastCoordinates: "مختصات معتبر وارد کنید.",
    toastCSVSaved: "CSV ذخیره شد.", toastPNGSaved: "PNG ذخیره شد.", toastNoData: "داده‌ای موجود نیست. ابتدا دریافت کنید.", toastPresetSaved: "پیش‌فرض ذخیره شد.",
    toastPresetDeleted: "پیش‌فرض حذف شد.", toastCannotDelete: "امکان حذف پیش‌فرض داخلی وجود ندارد.", toastCannotOverwrite: "امکان بازنویسی پیش‌فرض داخلی وجود ندارد.",
    toastPresetApplied: "پیش‌فرض اعمال شد.", toastDiscoveryFailed: "کشف متغیرها ناموفق بود.", toastFetchFailed: "دریافت ناموفق بود:",
    weatherHint: "آیکون‌های آب‌وهوا به‌طور خودکار دریافت می‌شوند و هرگز رسم نمی‌شوند.", weatherHintOff: "آیکون‌های آب‌وهوا خاموش است (در بخش نمایش فعال کنید).",
    calendar: "تقویم", searchResult: "نتیجه جستجو", noCityFound: "شهری یافت نشد.", searchFailed: "جستجو ناموفق بود.",
    yAxisBasis: "مبنای محور Y",
    basisMean: "فقط میانگین",
    basisMembers: "همه اعضا (اسپاگتی)",
  }
};

function t(key) { return I18N[state.lang]?.[key] ?? I18N.en[key] ?? key; }

function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.body.dir = lang === "fa" ? "rtl" : "ltr";

  document.getElementById("lang-en").classList.toggle("active-lang", lang === "en");
  document.getElementById("lang-fa").classList.toggle("active-lang", lang === "fa");

  const map = {
    "lbl-location": "location", "lbl-model": "model", "lbl-variables": "variables", "lbl-sort": "sort",
    "lbl-presets": "presets", "lbl-time": "timeRange", "lbl-forecast": "forecastDays", "lbl-past": "pastDays",
    "lbl-timezone": "timezone", "lbl-tod": "timeOfDay", "lbl-displaytz": "displayTz", "lbl-display": "display",
    "lbl-spread": "spread", "lbl-highlight": "highlightMembers", "lbl-pad": "pad", "lbl-units": "units",
    "lbl-tempunit": "temperature", "lbl-windunit": "windSpeed", "lbl-precipunit": "precipitation", "lbl-export": "export",
    "lbl-lat": "lat", "lbl-lon": "lon", "lbl-calendar": "calendar", "lbl-y-basis": "yAxisBasis"
  };
  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  }

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });

  document.getElementById("city-search-input").placeholder = t("searchCity");
  document.getElementById("fetch-btn").textContent = t("fetchPlot");
  document.getElementById("opt-sort-default").textContent = t("sortDefault");
  document.getElementById("opt-sort-name").textContent = t("sortName");
  document.getElementById("opt-sort-class").textContent = t("sortClass");
  document.getElementById("opt-sort-level").textContent = t("sortLevel");

  const cbMap = {
    "show-mean": "showMean", "autoscale": "autoScale", "log-y": "logY", "show-day-grid": "dayGrid",
    "show-hour-grid": "hourGrid", "show-icons": "weatherIcons", "dark-mode": "darkMode"
  };
  for (const [id, key] of Object.entries(cbMap)) {
    const cb = document.getElementById(id);
    if (cb && cb.nextElementSibling) cb.nextElementSibling.textContent = t(key);
  }
}

/* ============================================================
   UTILS
   ============================================================ */
function $(id) { return document.getElementById(id); }

function toast(msg, isError = false) {
  const el = $("toast");
  el.textContent = msg;
  el.className = "show" + (isError ? " error" : "");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = ""; }, 4000);
}
function setStatus(msg) { $("status-bar").textContent = msg; }
function progress(active) { $("progress").classList.toggle("active", active); }

function parseMemberSpec(spec, n) {
  if (!spec || !spec.trim()) return [];
  spec = spec.trim().toLowerCase();
  if (spec === "all") return Array.from({ length: n }, (_, i) => i);
  const out = new Set();
  for (const tok of spec.split(",")) {
    const s = tok.trim();
    if (!s) continue;
    if (s.includes("-")) {
      const [a, b] = s.split("-").map(Number);
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
          if (i >= 0 && i < n) out.add(i);
        }
      }
    } else {
      const i = Number(s);
      if (!isNaN(i) && i >= 0 && i < n) out.add(i);
    }
  }
  return [...out].sort((a, b) => a - b);
}

function modeInt(values) {
  if (!values || values.length === 0) return NaN;
  const counts = new Map();
  for (const v of values) {
    if (v == null || isNaN(v)) continue;
    const k = Math.round(v);
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  if (counts.size === 0) return NaN;
  let bestK = NaN, bestC = -1;
  for (const [k, c] of counts) {
    if (c > bestC || (c === bestC && k > bestK)) { bestK = k; bestC = c; }
  }
  return bestK;
}

function varUnit(name) {
  const info = VAR_INFO[name];
  if (!info) return "";
  const cat = info[1];
  if (cat === "temp") return $("temp-unit").value === "fahrenheit" ? "°F" : "°C";
  if (cat === "wind") return { ms: "m/s", kmh: "km/h", mph: "mph", kn: "kn" }[$("wind-unit").value] || "m/s";
  if (cat === "precip") return $("precip-unit").value === "inch" ? "in" : "mm";
  if (cat.startsWith("fixed:")) return cat.split(":")[1];
  return "";
}

function varCategory(name) {
  if (name.startsWith("temperature_") || ["apparent_temperature", "surface_temperature", "sea_surface_temperature"].includes(name)) return "temperature";
  if (name.startsWith("dew_point_")) return "dew_point";
  if (name.startsWith("relative_humidity_") || name === "vapour_pressure_deficit") return "humidity";
  if (name.startsWith("geopotential_height_")) return "geopotential";
  if (name.startsWith("wind_speed_") || name.startsWith("wind_gusts")) return "wind_speed";
  if (name.startsWith("wind_direction_")) return "wind_direction";
  if (name.startsWith("vertical_velocity_")) return "vertical_velocity";
  if (name.startsWith("cloud_cover")) return "cloud";
  if (["precipitation", "rain", "snowfall", "snowfall_water_equivalent", "snow_depth"].includes(name)) return "precipitation";
  if (["pressure_msl", "surface_pressure"].includes(name)) return "pressure";
  if (name === "visibility") return "visibility";
  if (["pm2_5", "pm10", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "european_aqi", "us_aqi", "dust", "uv_index"].includes(name)) return "air_quality";
  if (["wave_height", "wave_direction", "wave_period", "swell_wave_height", "swell_wave_direction", "swell_wave_period"].includes(name)) return "marine";
  return "other";
}

function varLevelKey(name) {
  const m = name.match(/_(\d+)hPa$/);
  if (m) return [1, -parseInt(m[1])];
  const m2 = name.match(/_(\d+)m$/);
  if (m2) return [0, parseInt(m2[1])];
  return [0, 0];
}

function sortVariables(list, mode) {
  if (mode === "name") return [...list].sort((a, b) => a.localeCompare(b));
  if (mode === "classification") {
    const idx = Object.fromEntries(CATEGORY_ORDER.map((c, i) => [c, i]));
    return [...list].sort((a, b) => {
      const ca = idx[varCategory(a)] ?? 99, cb = idx[varCategory(b)] ?? 99;
      if (ca !== cb) return ca - cb;
      const la = varLevelKey(a), lb = varLevelKey(b);
      if (la[0] !== lb[0]) return la[0] - lb[0];
      if (la[1] !== lb[1]) return la[1] - lb[1];
      return a.localeCompare(b);
    });
  }
  if (mode === "level") {
    return [...list].sort((a, b) => {
      const la = varLevelKey(a), lb = varLevelKey(b);
      if (la[0] !== lb[0]) return la[0] - lb[0];
      if (la[1] !== lb[1]) return la[1] - lb[1];
      const ca = varCategory(a), cb = varCategory(b);
      if (ca !== cb) return ca.localeCompare(cb);
      return a.localeCompare(b);
    });
  }
  return [...list];
}

/* ============================================================
   STORAGE
   ============================================================ */
const SETTINGS_KEY = "wx_settings", PRESETS_KEY = "wx_presets", CACHE_KEY = "wx_cache";
function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { return {}; } }
function saveSettings(obj) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj)); } catch { } }
function loadPresets() { try { return JSON.parse(localStorage.getItem(PRESETS_KEY) || "{}"); } catch { return {}; } }
function savePresets(obj) { try { localStorage.setItem(PRESETS_KEY, JSON.stringify(obj)); } catch { } }
function loadCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; } }
function saveCache(obj) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(obj)); } catch { } }

/* ============================================================
   API
   ============================================================ */
async function fetchEnsemble(params, modelId = "") {
  if (!modelId) modelId = params.models || "";
  const base = MODEL_API_BASE[modelId] || "https://api.open-meteo.com/v1/forecast";
  const url = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (k === "models" && (modelId === "open_meteo_air_quality" || modelId === "open_meteo_marine")) continue;
    if (Array.isArray(v)) v.forEach(x => url.searchParams.append(k, x));
    else url.searchParams.set(k, v);
  }
  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.reason || `HTTP ${resp.status}`);
  }
  return resp.json();
}

async function fetchForecast(opts) {
  const { modelId, lat, lon, variables, forecastDays, pastDays, timezone, tempUnit, windUnit, precipUnit } = opts;
  const isSpecialModel = (modelId === "open_meteo_air_quality" || modelId === "open_meteo_marine");
  const hourlyRequest = isSpecialModel ? [...variables] : [...new Set([...variables, ...AUTO_VARS])];
  
  const params = { latitude: lat, longitude: lon, hourly: hourlyRequest, forecast_days: forecastDays, past_days: pastDays, timezone };
  if (!isSpecialModel) {
    params.models = modelId;
    params.temperature_unit = tempUnit;
    params.wind_speed_unit = windUnit;
    params.precipitation_unit = precipUnit;
  }

  const raw = await fetchEnsemble(params, modelId);
  raw._model = modelId;
  return raw;
}

async function searchCity(query) {
  if (!query) return;
  const lang = state.lang === "fa" ? "fa" : "en";
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding error");
    const data = await res.json();
    if (!data.results || data.results.length === 0) { toast(t("noCityFound"), true); return; }
    
    const sel = $("city-select");
    for (let i = sel.options.length - 1; i >= 0; i--) {
      if (sel.options[i].text.startsWith("🔍")) sel.remove(i);
    }
    
    let firstVal = null, firstTimezone = null;
    data.results.forEach(c => {
      const label = `🔍 ${c.name}${c.admin1 ? ', ' + c.admin1 : ''} (${c.country})`;
      const opt = document.createElement("option");
      opt.value = `${c.latitude},${c.longitude}`;
      opt.textContent = label;
      sel.appendChild(opt);
      if (!firstVal) { firstVal = opt.value; firstTimezone = c.timezone; }
    });
    
    if (firstVal) {
      sel.value = firstVal;
      const [lat, lon] = firstVal.split(",");
      $("lat").value = lat; $("lon").value = lon;
      
      if (firstTimezone) {
        const tzSelect = $("timezone");
        if (![...tzSelect.options].some(o => o.value === firstTimezone)) {
          const opt = document.createElement("option");
          opt.value = firstTimezone; opt.textContent = firstTimezone;
          tzSelect.appendChild(opt);
        }
        tzSelect.value = firstTimezone;
      }
      saveSettingsNow();
      toast(t("searchResult") + ": " + sel.options[sel.selectedIndex].text.replace("🔍 ", ""));
    }
  } catch (e) { toast(t("searchFailed"), true); }
}

async function discoverVariables(modelId, lat, lon, statusCallback) {
  let candidates = [];
  if (modelId === "open_meteo_air_quality") {
    candidates = ["pm2_5", "pm10", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "european_aqi", "us_aqi", "dust", "uv_index", "ammonia", "methane"];
  } else if (modelId === "open_meteo_marine") {
    candidates = ["wave_height", "wave_direction", "wave_period", "swell_wave_height", "swell_wave_direction", "swell_wave_period", "sea_surface_temperature"];
  } else {
    candidates = [...new Set([...DEFAULT_VARS_ENSEMBLE, ...DEFAULT_VARS_MEAN, "temperature_80m", "wind_speed_80m", "wind_direction_80m", "sea_surface_temperature", "snowfall_water_equivalent"])];
  }

  const mapped = candidates.filter(c => SDK_MAP[c] || modelId === "open_meteo_air_quality" || modelId === "open_meteo_marine");
  const found = new Set();
  const CHUNK = 20;
  const total = Math.ceil(mapped.length / CHUNK);

  for (let i = 0; i < mapped.length; i += CHUNK) {
    const chunk = mapped.slice(i, i + CHUNK);
    if (statusCallback) statusCallback(`${Math.floor(i / CHUNK) + 1}/${total}...`);
    try {
      const params = { latitude: lat, longitude: lon, hourly: chunk, forecast_days: 1 };
      if (modelId !== "open_meteo_air_quality" && modelId !== "open_meteo_marine") params.models = modelId;
      const data = await fetchEnsemble(params, modelId);
      if (data.hourly) {
        for (const k of Object.keys(data.hourly)) {
          if (k === "time") continue;
          const base = k.replace(/_member\d+$/, "");
          if (!AUTO_VARS.includes(base)) found.add(base);
        }
      }
    } catch (e) { console.warn(`Chunk ${Math.floor(i / CHUNK) + 1} failed:`, e); }
    if (i + CHUNK < mapped.length) await new Promise(r => setTimeout(r, 1500));
  }
  return [...found];
}

/* ============================================================
   DATA PROCESSING
   ============================================================ */
function processEnsembleData(raw) {
  const hourly = raw.hourly;
  if (!hourly || !hourly.time) throw new Error("No hourly data in response.");
  const rawTimes = hourly.time;
  const times = rawTimes.map(t => new Date(t));
  const variables = {};
  const groups = {};
  
  for (const k of Object.keys(hourly)) {
    if (k === "time") continue;
    const base = k.replace(/_member\d+$/, "");
    if (!groups[base]) groups[base] = [];
    groups[base].push(k);
  }

  for (const [base, keys] of Object.entries(groups)) {
    const members = keys.map(k => hourly[k]);
    const nTime = times.length;
    const mean = new Float64Array(nTime), p10 = new Float64Array(nTime), p25 = new Float64Array(nTime);
    const p75 = new Float64Array(nTime), p90 = new Float64Array(nTime), std = new Float64Array(nTime);
    const isCategorical = (base === "weather_code" || base === "is_day");

    for (let t = 0; t < nTime; t++) {
      const rawVals = members.map(m => m[t]);
      if (isCategorical) {
        const code = modeInt(rawVals);
        mean[t] = p10[t] = p25[t] = p75[t] = p90[t] = code;
        std[t] = 0;
        continue;
      }
      const vals = rawVals.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
      if (vals.length === 0) {
        mean[t] = p10[t] = p25[t] = p75[t] = p90[t] = std[t] = NaN;
        continue;
      }
      const n = vals.length;
      mean[t] = vals.reduce((a, b) => a + b, 0) / n;
      p10[t] = vals[Math.floor(n * 0.10)]; p25[t] = vals[Math.floor(n * 0.25)];
      p75[t] = vals[Math.floor(n * 0.75)]; p90[t] = vals[Math.floor(n * 0.90)];
      const m = mean[t];
      std[t] = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / n);
    }

    variables[base] = {
      members: members.map(m => Array.from(m)), mean: Array.from(mean),
      p10: Array.from(p10), p25: Array.from(p25), p75: Array.from(p75), p90: Array.from(p90),
      std: Array.from(std), unit: varUnit(base)
    };
  }

  return { times, rawTimes, variables, timezone: raw.timezone || "UTC", utcOffset: raw.utc_offset_seconds || 0 };
}

/* ============================================================
   PLOTS
   ============================================================ */
function getJalaliString(rawTimeStr) {
  if (!rawTimeStr) return "";
  const parts = rawTimeStr.split("T");
  if (parts.length < 2) return rawTimeStr;
  const [datePart, timePart] = parts;
  const [y, m, d] = datePart.split("-").map(Number);
  const j = jalaali.toJalaali(y, m, d);
  const monthName = state.lang === "fa" ? JALALI_MONTHS_FA[j.jm - 1] : JALALI_MONTHS_EN[j.jm - 1];
  return `${j.jd} ${monthName} ${j.jy} - ${timePart}`;
}

function buildWeatherIconAnnotations(timeIndex, rawTimes, weatherCodes, isDayArray, opts, xaxisRef, yaxisRef) {
  const annotations = [];
  if (!weatherCodes || weatherCodes.length === 0) return annotations;
  const dayBuckets = new Map();
  for (let i = 0; i < timeIndex.length; i++) {
    const key = timeIndex[i].toDateString();
    if (!dayBuckets.has(key)) dayBuckets.set(key, []);
    dayBuckets.get(key).push(i);
  }

  for (const [, indices] of dayBuckets) {
    let bestIdx = null, bestScore = Infinity;
    for (const i of indices) {
      const code = weatherCodes[i];
      if (code == null || isNaN(code)) continue;
      const codeInt = Math.round(code);
      if (!WMO_ICONS[codeInt]) continue;
      const hour = timeIndex[i].getHours();
      const score = Math.abs(hour - 12);
      if (score < bestScore) { bestScore = score; bestIdx = i; }
    }
    if (bestIdx === null) continue;
    const codeInt = Math.round(weatherCodes[bestIdx]);
    const iconSet = WMO_ICONS[codeInt];
    let isDay = true;
    if (isDayArray && bestIdx < isDayArray.length && isDayArray[bestIdx] != null && !isNaN(isDayArray[bestIdx])) {
      isDay = isDayArray[bestIdx] >= 0.5;
    } else {
      const h = timeIndex[bestIdx].getHours();
      isDay = h >= 6 && h < 18;
    }

    const emoji = isDay ? iconSet.day : iconSet.night;
    const desc = state.lang === "fa" ? iconSet.fa : iconSet.en;
    const dateStr = getJalaliString(rawTimes[bestIdx]);

    annotations.push({
      x: timeIndex[bestIdx], y: 1.03, xref: xaxisRef, yref: `${yaxisRef} domain`,
      text: emoji, showarrow: false, font: { size: 16 }, align: "center",
      hovertext: `${desc} (WMO ${codeInt})<br>${dateStr}`,
      hoverlabel: { bgcolor: opts.dark ? "#374151" : "#ffffff" }, opacity: 0.95
    });
  }
  return annotations;
}

function buildPlot(timeIndex, rawTimes, varData, opts) {
  const traces = [];
  const layout = {
    margin: { t: 80, r: 30, b: 50, l: 70 },
    title: { text: opts.title, font: { size: 12 } },
    paper_bgcolor: opts.dark ? "#1f2937" : "#ffffff",
    plot_bgcolor: opts.dark ? "#1f2937" : "#ffffff",
    font: { color: opts.dark ? "#f3f4f6" : "#1f2937", size: 10 },
    hovermode: "x unified",
    hoverlabel: { bgcolor: opts.dark ? "#111827" : "#ffffff", bordercolor: opts.dark ? "#374151" : "#d0d4dc", font: { size: 11, color: opts.dark ? "#f3f4f6" : "#1f2937" }, namelength: -1 },
    legend: { orientation: "h", y: 1.04, x: 0, font: { size: 10 } },
    grid: { rows: varData.length, columns: 1, pattern: "independent" },
    annotations: [], shapes: []
  };

  const nVars = varData.length;
  const rowHeight = 1 / nVars;
  const calendarSystem = $("calendar-system").value;
  const jalaliStrings = rawTimes.map(getJalaliString);

  const AQI_BANDS = {
    "us_aqi": [{ y0: 0, y1: 50, color: "rgba(0, 228, 0, 0.10)" }, { y0: 50, y1: 100, color: "rgba(255, 255, 0, 0.10)" }, { y0: 100, y1: 150, color: "rgba(255, 126, 0, 0.10)" }, { y0: 150, y1: 200, color: "rgba(255, 0, 0, 0.10)" }, { y0: 200, y1: 300, color: "rgba(143, 63, 151, 0.10)" }, { y0: 300, y1: 500, color: "rgba(126, 0, 35, 0.10)" }],
    "european_aqi": [{ y0: 0, y1: 20, color: "rgba(80, 240, 230, 0.10)" }, { y0: 20, y1: 40, color: "rgba(80, 240, 100, 0.10)" }, { y0: 40, y1: 60, color: "rgba(240, 240, 80, 0.10)" }, { y0: 60, y1: 80, color: "rgba(240, 100, 80, 0.10)" }, { y0: 80, y1: 100, color: "rgba(200, 80, 240, 0.10)" }, { y0: 100, y1: 500, color: "rgba(120, 0, 0, 0.10)" }],
    "pm2_5": [{ y0: 0, y1: 10, color: "rgba(0, 228, 0, 0.10)" }, { y0: 10, y1: 25, color: "rgba(255, 255, 0, 0.10)" }, { y0: 25, y1: 50, color: "rgba(255, 126, 0, 0.10)" }, { y0: 50, y1: 100, color: "rgba(255, 0, 0, 0.10)" }, { y0: 100, y1: 200, color: "rgba(143, 63, 151, 0.10)" }, { y0: 200, y1: 500, color: "rgba(126, 0, 35, 0.10)" }],
    "pm10": [{ y0: 0, y1: 20, color: "rgba(0, 228, 0, 0.10)" }, { y0: 20, y1: 50, color: "rgba(255, 255, 0, 0.10)" }, { y0: 50, y1: 100, color: "rgba(255, 126, 0, 0.10)" }, { y0: 100, y1: 200, color: "rgba(255, 0, 0, 0.10)" }, { y0: 200, y1: 400, color: "rgba(143, 63, 151, 0.10)" }, { y0: 400, y1: 600, color: "rgba(126, 0, 35, 0.10)" }],
    "nitrogen_dioxide": [{ y0: 0, y1: 40, color: "rgba(0, 228, 0, 0.10)" }, { y0: 40, y1: 100, color: "rgba(255, 255, 0, 0.10)" }, { y0: 100, y1: 200, color: "rgba(255, 126, 0, 0.10)" }, { y0: 200, y1: 400, color: "rgba(255, 0, 0, 0.10)" }, { y0: 400, y1: 800, color: "rgba(143, 63, 151, 0.10)" }],
    "ozone": [{ y0: 0, y1: 100, color: "rgba(0, 228, 0, 0.10)" }, { y0: 100, y1: 160, color: "rgba(255, 255, 0, 0.10)" }, { y0: 160, y1: 240, color: "rgba(255, 126, 0, 0.10)" }, { y0: 240, y1: 300, color: "rgba(255, 0, 0, 0.10)" }, { y0: 300, y1: 500, color: "rgba(143, 63, 151, 0.10)" }],
    "sulphur_dioxide": [{ y0: 0, y1: 40, color: "rgba(0, 228, 0, 0.10)" }, { y0: 40, y1: 80, color: "rgba(255, 255, 0, 0.10)" }, { y0: 80, y1: 200, color: "rgba(255, 126, 0, 0.10)" }, { y0: 200, y1: 400, color: "rgba(255, 0, 0, 0.10)" }, { y0: 400, y1: 1000, color: "rgba(143, 63, 151, 0.10)" }]
  };

  varData.forEach((entry, i) => {
    const { name, d } = entry;
    const xaxisRef = i === 0 ? "x" : `x${i + 1}`;
    const yaxisRef = i === 0 ? "y" : `y${i + 1}`;

    if (AQI_BANDS[name]) {
      AQI_BANDS[name].forEach(band => {
        layout.shapes.push({ type: "rect", xref: xaxisRef, yref: yaxisRef, x0: timeIndex[0], x1: timeIndex[timeIndex.length - 1], y0: band.y0, y1: band.y1, fillcolor: band.color, line: { width: 0 }, layer: "below" });
      });
    }

    layout[`xaxis${i === 0 ? "" : i + 1}`] = {
      type: "date", showgrid: false,
      tickformatstops: [
        { dtickrange: [null, 60_000], value: "%H:%M:%S" }, { dtickrange: [60_000, 3_600_000], value: "%H:%M" },
        { dtickrange: [3_600_000, 86_400_000], value: "%d %B<br>%H:%M" }, { dtickrange: [86_400_000, "M1"], value: "%d %B" },
        { dtickrange: ["M1", "M12"], value: "%B %Y" }, { dtickrange: ["M12", null], value: "%Y" }
      ],
      hoverformat: calendarSystem === "jalali" ? "%d %B %Y — %H:%M" : "%a %b %d, %Y — %H:%M",
      zeroline: false, anchor: yaxisRef
    };
    if (i > 0) layout[`xaxis${i + 1}`].matches = "x";

    if (calendarSystem === "jalali") {
      let tickVals = [], tickText = [];
      let start = new Date(timeIndex[0]); start.setHours(12, 0, 0, 0);
      let end = new Date(timeIndex[timeIndex.length - 1]);
      let totalDays = (end - start) / 86400000;
      let step = totalDays > 90 ? 7 : totalDays > 30 ? 3 : totalDays > 14 ? 2 : 1;
      let curr = new Date(start), dayIndex = 0, lastMonth = -1;

      while (curr <= end) {
        const j = jalaali.toJalaali(curr.getFullYear(), curr.getMonth() + 1, curr.getDate());
        const monthName = state.lang === "fa" ? JALALI_MONTHS_FA[j.jm - 1] : JALALI_MONTHS_EN[j.jm - 1];
        tickVals.push(new Date(curr));
        if (j.jm !== lastMonth) { tickText.push(`${j.jd} ${monthName}`); lastMonth = j.jm; }
        else if (dayIndex % step === 0) { tickText.push(state.lang === "fa" ? j.jd.toLocaleString('fa-IR') : `${j.jd}`); }
        else { tickText.push(""); }
        curr.setDate(curr.getDate() + 1); dayIndex++;
      }
      if (tickVals.length > 0) {
        layout[`xaxis${i === 0 ? "" : i + 1}`].tickvals = tickVals;
        layout[`xaxis${i === 0 ? "" : i + 1}`].ticktext = tickText;
        layout[`xaxis${i === 0 ? "" : i + 1}`].tickmode = "array";
      }
    }

    layout[`yaxis${i + 1}`] = { title: { text: `${name} [${d.unit || ""}]`, font: { size: 9 } }, showgrid: true, gridcolor: opts.dark ? "#374151" : "#e5e7eb", zeroline: false, anchor: xaxisRef };
    const top = 1 - i * rowHeight, bottom = 1 - (i + 1) * rowHeight + 0.01;
    layout[`yaxis${i + 1}`].domain = [bottom, top];

    const isSingleMember = d.members.length <= 1, spread = opts.spread;
    if (!isSingleMember) {
      if (spread === "iqr" || spread === "spaghetti_band") {
        traces.push({ x: timeIndex, y: d.p75, type: "scatter", mode: "lines", line: { width: 0 }, showlegend: i === 0 && nVars > 0, name: "IQR (25–75%)", fillcolor: "rgba(76,143,209,0.25)", fill: "tonexty", xaxis: xaxisRef, yaxis: yaxisRef, hoverinfo: "skip" });
        traces.push({ x: timeIndex, y: d.p25, type: "scatter", mode: "lines", line: { width: 0 }, showlegend: false, fillcolor: "rgba(76,143,209,0.25)", fill: "tonexty", xaxis: xaxisRef, yaxis: yaxisRef, hoverinfo: "skip" });
      }
      if (spread === "p10_90") {
        traces.push({ x: timeIndex, y: d.p90, type: "scatter", mode: "lines", line: { width: 0 }, showlegend: i === 0 && nVars > 0, name: "10–90%", fillcolor: "rgba(127,179,224,0.18)", fill: "tonexty", xaxis: xaxisRef, yaxis: yaxisRef, hoverinfo: "skip" });
        traces.push({ x: timeIndex, y: d.p10, type: "scatter", mode: "lines", line: { width: 0 }, showlegend: false, fillcolor: "rgba(127,179,224,0.18)", fill: "tonexty", xaxis: xaxisRef, yaxis: yaxisRef, hoverinfo: "skip" });
      }
      if (spread === "spaghetti" || spread === "spaghetti_band") {
        for (let m = 0; m < d.members.length; m++) {
          traces.push({ x: timeIndex, y: d.members[m], type: "scatter", mode: "lines", line: { color: "#999", width: 0.5 }, opacity: 0.15, showlegend: false, hoverinfo: "skip", xaxis: xaxisRef, yaxis: yaxisRef });
        }
      }
    }

    if (opts.highlight.length > 0) {
      const colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#a65628", "#f781bf", "#999999"];
      opts.highlight.forEach((m, k) => {
        if (m < d.members.length) {
          traces.push({ x: timeIndex, y: d.members[m], type: "scatter", mode: "lines", line: { color: colors[k % colors.length], width: 1.2 }, name: `member ${m}`, showlegend: i === 0, xaxis: xaxisRef, yaxis: yaxisRef, customdata: jalaliStrings, hovertemplate: calendarSystem === "jalali" ? "<b>%{fullData.name}</b><br>%{customdata}<br>%{y}<extra></extra>" : "<b>%{fullData.name}</b><br>%{x|%a %b %d, %Y — %H:%M}<br>%{y}<extra></extra>" });
        }
      });
    }

    if (opts.showMean) {
      traces.push({ x: timeIndex, y: d.mean, type: "scatter", mode: "lines", line: { color: "#1f77b4", width: 2 }, name: "Ensemble mean", showlegend: i === 0, xaxis: xaxisRef, yaxis: yaxisRef, customdata: jalaliStrings, hovertemplate: calendarSystem === "jalali" ? "<b>%{fullData.name}</b><br>%{customdata}<br>%{y}<extra></extra>" : "<b>%{fullData.name}</b><br>%{x|%a %b %d, %Y — %H:%M}<br>%{y}<extra></extra>" });
    }

    traces.push({ x: [timeIndex[0], timeIndex[timeIndex.length - 1]], y: [0, 0], type: "scatter", mode: "lines", line: { color: "#888", width: 0.5, dash: "dash" }, showlegend: false, hoverinfo: "skip", xaxis: xaxisRef, yaxis: yaxisRef });

    if (opts.showDayGrid) {
      let lastDay = null;
      for (let t = 0; t < rawTimes.length; t++) {
        const dayStr = rawTimes[t].substring(0, 10);
        if (dayStr !== lastDay) {
          lastDay = dayStr;
          layout.shapes.push({ type: "line", x0: timeIndex[t], x1: timeIndex[t], y0: 0, y1: 1, xref: xaxisRef, yref: `${yaxisRef} domain`, line: { color: opts.dark ? "#555" : "#ccc", width: 0.8, dash: "dot" } });
        }
      }
    }

    if (opts.showHourGrid) {
      for (let t = 0; t < rawTimes.length; t++) {
        const hourStr = rawTimes[t].substring(11, 13);
        if (parseInt(hourStr) % 6 === 0) {
          layout.shapes.push({ type: "line", x0: timeIndex[t], x1: timeIndex[t], y0: 0, y1: 1, xref: xaxisRef, yref: `${yaxisRef} domain`, line: { color: opts.dark ? "#3f4a5a" : "#e2e6ee", width: 0.6, dash: "dot" } });
        }
      }
    }

    if (i === 0 && opts.showIcons && opts.weatherCodes) {
      const iconAnns = buildWeatherIconAnnotations(timeIndex, rawTimes, opts.weatherCodes, opts.isDayArray, opts, xaxisRef, yaxisRef);
      layout.annotations.push(...iconAnns);
    }
  });

  // --- Auto-scale Y (با پشتیبانی از انتخاب مبنا) ---
  if (opts.autoscale) {
    varData.forEach((entry, i) => {
      const d = entry.d;
      let mn = Infinity, mx = -Infinity, hasData = false;

      if (opts.yBasis === "members" && d.members && d.members.length > 0) {
        for (let m = 0; m < d.members.length; m++) {
          const arr = d.members[m];
          for (let t = 0; t < arr.length; t++) {
            const val = arr[t];
            if (val != null && !isNaN(val)) {
              if (val < mn) mn = val;
              if (val > mx) mx = val;
              hasData = true;
            }
          }
        }
      } else {
        for (let t = 0; t < d.mean.length; t++) {
          const val = d.mean[t];
          if (val != null && !isNaN(val)) {
            if (val < mn) mn = val;
            if (val > mx) mx = val;
            hasData = true;
          }
        }
      }

      if (hasData) {
        const span = mx - mn || Math.max(Math.abs(mx), 1);
        const pad = span * (opts.paddingPct / 100);
        let ymin = mn - pad;
        if (mn >= 0 && ymin < 0) ymin = 0;

        const bands = AQI_BANDS[entry.name];
        let topLimit = mx + pad;
        
        if (bands) {
          let bandIndex = bands.findIndex(b => mx <= b.y1);
          if (bandIndex === -1) bandIndex = bands.length - 1;
          
          topLimit = bands[bandIndex].y1;
          if (bandIndex === 0 && bands.length > 1) topLimit = bands[1].y1;
          if (topLimit < mx + pad) topLimit = mx + pad;
        }
        
        layout[`yaxis${i + 1}`].range = [ymin, topLimit];
      }
    });
  }

  return { traces, layout };
}
/* ============================================================
   UI HELPERS & APP LOGIC
   ============================================================ */
function renderVariableList() {
  const container = $("var-list"), userVars = state.variables.filter(v => !AUTO_VARS.includes(v)), sorted = sortVariables(userVars, state.sortMode);
  container.innerHTML = "";
  for (const name of sorted) {
    const label = document.createElement("label"); label.className = "var-item";
    const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = state.selectedVars.has(name);
    cb.addEventListener("change", () => { if (cb.checked) state.selectedVars.add(name); else state.selectedVars.delete(name); });
    const span = document.createElement("span"); span.textContent = name;
    label.appendChild(cb); label.appendChild(span); container.appendChild(label);
  }
}

function populateModelDropdown() {
  const sel = $("model"), current = sel.value || "google_weathernext2_ensemble";
  sel.innerHTML = "";
  for (const [id, label] of Object.entries(MODELS)) {
    const opt = document.createElement("option"); opt.value = id; opt.textContent = label; sel.appendChild(opt);
  }
  if ([...sel.options].some(o => o.value === current)) sel.value = current;
}

function renderPresets() {
  const sel = $("preset-select"), all = { ...PRESETS, ...state.customPresets }, current = sel.value;
  sel.innerHTML = "";
  for (const name of Object.keys(all)) {
    const opt = document.createElement("option"); opt.value = name; opt.textContent = name + (name in state.customPresets ? " ★" : ""); sel.appendChild(opt);
  }
  if (current && [...sel.options].some(o => o.value === current)) sel.value = current;
}

function populateCityDropdown() {
  const sel = $("city-select"), current = sel.value;
  let currentText = ""; if (sel.selectedIndex >= 0) currentText = sel.options[sel.selectedIndex].text;
  sel.innerHTML = `<option value="">${t("selectCity")}</option>`;
  for (const c of IRANIAN_CITIES) {
    const opt = document.createElement("option"); opt.value = `${c.lat},${c.lon}`; opt.textContent = state.lang === "fa" ? c.fa : c.en; sel.appendChild(opt);
  }
  if (current && ![...sel.options].some(o => o.value === current)) {
    const opt = document.createElement("option"); opt.value = current; opt.textContent = currentText || `Custom (${current})`; sel.appendChild(opt);
  }
  if (current && [...sel.options].some(o => o.value === current)) sel.value = current;
  else {
    const tehran = IRANIAN_CITIES.find(c => c.en === "Tehran");
    if (tehran) sel.value = `${tehran.lat},${tehran.lon}`;
  }
}

function updateWeatherHint() {
  const on = $("show-icons").checked; $("hint-weather-code").textContent = on ? t("weatherHint") : t("weatherHintOff");
}

function setLanguage(lang) {
  applyLanguage(lang); populateCityDropdown(); renderPresets(); updateWeatherHint(); if (state.lastData) renderPlot(); saveSettingsNow();
}

function saveSettingsNow() {
  saveSettings({
    city: $("city-select").value, lat: $("lat").value, lon: $("lon").value,
    model: $("model").value, timezone: $("timezone").value, forecastDays: $("forecast-days").value,
    pastDays: $("past-days").value, tod: $("tod").value, displayTz: $("display-tz").value,
    tempUnit: $("temp-unit").value, windUnit: $("wind-unit").value, precipUnit: $("precip-unit").value,
    spread: $("spread").value, sortMode: $("sort-mode").value, highlight: $("highlight-members").value,
    showMean: $("show-mean").checked, autoscale: $("autoscale").checked, 
    yBasis: $("y-basis").value,
    padding: $("padding").value,
    logY: $("log-y").checked, showDayGrid: $("show-day-grid").checked, showHourGrid: $("show-hour-grid").checked,
    showIcons: $("show-icons").checked, darkMode: $("dark-mode").checked, calendarSystem: $("calendar-system").value,
    lang: state.lang, selectedVars: [...state.selectedVars]
  });
}

function loadSettingsIntoUI() {
  const s = loadSettings();
  if (!s || Object.keys(s).length === 0) {
    const tehran = IRANIAN_CITIES.find(c => c.en === "Tehran");
    if (tehran) { $("lat").value = tehran.lat; $("lon").value = tehran.lon; $("city-select").value = `${tehran.lat},${tehran.lon}`; }
    applyModelDefaults(); return;
  }
  
  if (s.city) $("city-select").value = s.city;
  $("lat").value = s.lat ?? "35.6944"; $("lon").value = s.lon ?? "51.4215";
  $("model").value = s.model ?? "google_weathernext2_ensemble"; $("timezone").value = s.timezone ?? "Asia/Tehran";
  $("forecast-days").value = s.forecastDays ?? 15; $("past-days").value = s.pastDays ?? 0;
  $("tod").value = s.tod ?? "all"; $("display-tz").value = s.displayTz ?? "local";
  $("temp-unit").value = s.tempUnit ?? "celsius"; $("wind-unit").value = s.windUnit ?? "ms";
  $("precip-unit").value = s.precipUnit ?? "mm"; $("spread").value = s.spread ?? "none";
  $("sort-mode").value = s.sortMode ?? "default"; $("highlight-members").value = s.highlight ?? "";
  $("show-mean").checked = s.showMean ?? true; $("autoscale").checked = s.autoscale ?? true;
  $("y-basis").value = s.yBasis ?? "mean"; // <--- خط جدید
  $("padding").value = s.padding ?? 5; $("log-y").checked = s.logY ?? false;
  $("show-day-grid").checked = s.showDayGrid ?? true; $("show-hour-grid").checked = s.showHourGrid ?? false;
  $("show-icons").checked = s.showIcons ?? true; $("dark-mode").checked = s.darkMode ?? false;
  $("calendar-system").value = s.calendarSystem ?? "gregorian";
  state.sortMode = s.sortMode ?? "default";
  state.selectedVars = new Set((s.selectedVars || []).filter(v => !AUTO_VARS.includes(v)));
  if (s.darkMode) document.body.dataset.theme = "dark";

  applyLanguage(s.lang || "en"); populateCityDropdown(); renderPresets(); applyModelDefaults();
  
  if (state.selectedVars.size === 0 && state.variables.length > 0) {
    state.selectedVars.add(state.variables[0]); state.selectedVars.add(state.variables[1] || state.variables[0]);
  }
  renderVariableList(); updateWeatherHint();
}

function applyModelDefaults() {
  const modelId = $("model").value;
  const maxDays = MODEL_MAX_DAYS[modelId] || 16;
  $("forecast-days").max = maxDays;
  if (parseInt($("forecast-days").value) > maxDays) $("forecast-days").value = maxDays;

  const ignoreCache = (modelId === "open_meteo_air_quality" || modelId === "open_meteo_marine");
  const cacheEntry = state.cache[modelId];

  if (cacheEntry && cacheEntry.variables && cacheEntry.variables.length > 0 && !ignoreCache) {
    state.variables = cacheEntry.variables.filter(v => !AUTO_VARS.includes(v));
    $("cache-info").innerHTML = `${t("cachedList")}: ${state.variables.length} <span class="badge ok">${t("cached")}</span>`;
  } else {
    if (modelId === "open_meteo_air_quality") state.variables = [...DEFAULT_VARS_AIR_QUALITY];
    else if (modelId === "open_meteo_marine") state.variables = [...DEFAULT_VARS_MARINE];
    else {
      const isTrueEnsemble = ["google_weathernext2_ensemble", "ecmwf_ifs025_ensemble", "ncep_gefs_seamless", "ecmwf_aifs025_ensemble", "ncep_gefs05"].includes(modelId) || modelId.startsWith("icon_");
      state.variables = isTrueEnsemble ? [...DEFAULT_VARS_ENSEMBLE] : [...DEFAULT_VARS_MEAN];
    }
    $("cache-info").textContent = t("curatedDefaults");
  }
  
  const validVars = new Set(state.variables);
  for (const v of Array.from(state.selectedVars)) { if (!validVars.has(v)) state.selectedVars.delete(v); }
  renderVariableList();
}

async function fetchAndPlot() {
  const modelId = $("model").value, lat = parseFloat($("lat").value), lon = parseFloat($("lon").value);
  const selected = [...state.selectedVars].filter(v => !AUTO_VARS.includes(v));
  if (selected.length === 0) { toast(t("toastSelectVar"), true); return; }
  if (isNaN(lat) || isNaN(lon)) { toast(t("toastCoordinates"), true); return; }
  progress(true); setStatus(t("fetching"));

  try {
    const raw = await fetchForecast({ modelId, lat, lon, variables: selected, forecastDays: $("forecast-days").value, pastDays: $("past-days").value, timezone: $("timezone").value, tempUnit: $("temp-unit").value, windUnit: $("wind-unit").value, precipUnit: $("precip-unit").value });
    const processed = processEnsembleData(raw);
    state.lastData = processed; state.lastModel = modelId; state.lastTimezone = processed.timezone; state.lastUtcOffset = processed.utcOffset;
    renderPlot(); toast(`${t("toastFetched")} ${Object.keys(processed.variables).length} variable(s).`);
  } catch (e) {
    toast(`${t("toastFetchFailed")} ${e.message}`, true); setStatus(`Error: ${e.message}`);
  } finally { progress(false); }
}

function renderPlot() {
  if (!state.lastData) return;
  const { times, rawTimes, variables } = state.lastData;
  const tod = $("tod").value;
  let filteredIndices = times.map((_, i) => i);
  if (tod !== "all") { const hour = parseInt(tod); filteredIndices = filteredIndices.filter(i => times[i].getUTCHours() === hour); }
  const timeIndex = filteredIndices.map(i => times[i]), rawTimeIndex = filteredIndices.map(i => rawTimes[i]);

  const varData = [];
  state.selectedVars.forEach(name => {
    if (AUTO_VARS.includes(name)) return;
    if (!variables[name]) return;
    const d = variables[name];
    const filtered = {
      mean: filteredIndices.map(i => d.mean[i]), p10: filteredIndices.map(i => d.p10[i]), p25: filteredIndices.map(i => d.p25[i]),
      p75: filteredIndices.map(i => d.p75[i]), p90: filteredIndices.map(i => d.p90[i]), std: filteredIndices.map(i => d.std[i]),
      members: d.members.map(m => filteredIndices.map(i => m[i])), unit: d.unit
    };
    varData.push({ name, d: filtered });
  });

  let weatherCodes = null, isDayArray = null;
  if (variables.weather_code && variables.weather_code.mean) weatherCodes = filteredIndices.map(i => variables.weather_code.mean[i]);
  if (variables.is_day && variables.is_day.mean) isDayArray = filteredIndices.map(i => variables.is_day.mean[i]);
  if (varData.length === 0) { toast(t("toastSelectVar"), true); return; }

  const highlight = parseMemberSpec($("highlight-members").value, varData[0]?.d.members.length || 0);
  
  let cityName = "Custom Location";
  const citySelect = $("city-select"), lat = $("lat").value, lon = $("lon").value, currentVal = `${lat},${lon}`;
  if (citySelect.value === currentVal && citySelect.selectedIndex >= 0) {
    cityName = citySelect.options[citySelect.selectedIndex].text.replace("🔍 ", "").trim();
  } else {
    const searchInput = $("city-search-input").value.trim(); cityName = searchInput ? searchInput : "Custom Location";
  }
  const locationStr = `${cityName} (${lat}, ${lon})`;

  const opts = {
    title: `${locationStr} — ${MODELS[state.lastModel] || state.lastModel} — ${state.lastTimezone}`,
    spread: $("spread").value, showMean: $("show-mean").checked, highlight, 
    autoscale: $("autoscale").checked,
    yBasis: $("y-basis").value, // <--- خط جدید
    paddingPct: parseFloat($("padding").value) || 5, logY: $("log-y").checked, showDayGrid: $("show-day-grid").checked,
    showHourGrid: $("show-hour-grid").checked, showIcons: $("show-icons").checked, dark: $("dark-mode").checked, weatherCodes, isDayArray
  };

  const { traces, layout } = buildPlot(timeIndex, rawTimeIndex, varData, opts);
  Plotly.react("plot-container", traces, layout, { responsive: true, displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d"] });

  const nIcons = layout.annotations.filter(a => a.text && a.yref && a.yref.includes("domain")).length;
  const iconNote = opts.showIcons ? (weatherCodes ? ` · ${nIcons} icon(s)` : " · no weather_code") : "";
  setStatus(`${t("toastFetched")} ${varData.length} var(s) · ${timeIndex.length} steps${iconNote}`);
}

function exportCSV() {
  if (!state.lastData) { toast(t("toastNoData"), true); return; }
  const { times, variables } = state.lastData, sel = [...state.selectedVars].filter(n => variables[n] && !AUTO_VARS.includes(n));
  if (sel.length === 0) { toast(t("toastSelectVar"), true); return; }
  const headers = ["time"]; sel.forEach(n => headers.push(`${n}_mean`, `${n}_p10`, `${n}_p90`, `${n}_std`));
  const rows = times.map((t, i) => {
    const row = [t.toISOString()]; sel.forEach(n => { const d = variables[n]; row.push(d.mean[i], d.p10[i], d.p90[i], d.std[i]); }); return row;
  });
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" }), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "ensemble_forecast.csv"; a.click(); URL.revokeObjectURL(a.href); toast(t("toastCSVSaved"));
}

function exportPNG() {
  if (!state.lastData) { toast(t("toastNoData"), true); return; }
  Plotly.downloadImage("plot-container", { format: "png", width: 1600, height: 1000, filename: "ensemble_forecast" });
  toast(t("toastPNGSaved"));
}
async function discoverVariables(modelId, lat, lon, statusCallback) {
  let candidates = [];
  
  if (modelId === "open_meteo_air_quality") {
    candidates = ["pm2_5", "pm10", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "european_aqi", "us_aqi", "dust", "uv_index", "ammonia", "methane"];
  } else if (modelId === "open_meteo_marine") {
    candidates = ["wave_height", "wave_direction", "wave_period", "swell_wave_height", "swell_wave_direction", "swell_wave_period", "sea_surface_temperature"];
  } else {
    candidates = [...new Set([
      ...DEFAULT_VARS_ENSEMBLE, ...DEFAULT_VARS_MEAN,
      "temperature_80m", "wind_speed_80m", "wind_direction_80m",
      "sea_surface_temperature", "snowfall_water_equivalent"
    ])];
  }

  const mapped = candidates.filter(c => SDK_MAP[c] || modelId === "open_meteo_air_quality" || modelId === "open_meteo_marine");
  const found = new Set();
  const CHUNK = 20;
  const total = Math.ceil(mapped.length / CHUNK);

  for (let i = 0; i < mapped.length; i += CHUNK) {
    const chunk = mapped.slice(i, i + CHUNK);
    if (statusCallback) statusCallback(`${Math.floor(i / CHUNK) + 1}/${total}...`);
    try {
      const params = { 
        latitude: lat, longitude: lon, 
        hourly: chunk, forecast_days: 1 
      };
      if (modelId !== "open_meteo_air_quality" && modelId !== "open_meteo_marine") {
        params.models = modelId;
      }
      
      const data = await fetchEnsemble(params, modelId);
      if (data.hourly) {
        for (const k of Object.keys(data.hourly)) {
          if (k === "time") continue;
          const base = k.replace(/_member\d+$/, "");
          if (!AUTO_VARS.includes(base)) found.add(base);
        }
      }
    } catch (e) { 
      console.warn(`Chunk ${Math.floor(i / CHUNK) + 1} failed:`, e); 
    }
    if (i + CHUNK < mapped.length) await new Promise(r => setTimeout(r, 1500));
  }
  return [...found];
}

async function doDiscover(force = false) {
  const modelId = $("model").value;
  const lat = parseFloat($("lat").value);
  const lon = parseFloat($("lon").value);

  // اگر کش وجود دارد و کاربر دکمه Refresh را نزده است، از کش استفاده کن
  if (!force && state.cache[modelId] && state.cache[modelId].variables.length > 0) {
    state.variables = state.cache[modelId].variables;
    renderVariableList();
    $("cache-info").innerHTML = `${t("cachedList")}: ${state.variables.length} <span class="badge ok">${t("cached")}</span>`;
    return;
  }

  progress(true);
  setStatus(t("discovering"));
  
  try {
    const found = await discoverVariables(modelId, lat, lon, msg => setStatus(`${t("discovering")} ${msg}`));
    
    if (found.length > 0) {
      state.variables = found;
      state.cache[modelId] = { variables: found, timestamp: Date.now() };
      saveCache(state.cache);
    } else {
      toast("No variables found via Discovery. Using defaults.", true);
    }
    
    renderVariableList();
    $("cache-info").innerHTML = `${t("discoveryComplete")}: ${found.length} <span class="badge ok">fresh</span>`;
    toast(`${t("discoveryComplete")}: ${found.length} variables.`);
  } catch (e) {
    toast(`${t("toastDiscoveryFailed")} ${e.message}`, true);
  } finally {
    progress(false);
  }
}

function wireEvents() {
  $("lang-en").addEventListener("click", () => setLanguage("en")); $("lang-fa").addEventListener("click", () => setLanguage("fa"));
  $("city-search-btn").addEventListener("click", () => { const q = $("city-search-input").value.trim(); if (q) searchCity(q); });
  $("city-search-input").addEventListener("keypress", (e) => { if (e.key === "Enter") { const q = $("city-search-input").value.trim(); if (q) searchCity(q); } });
  $("city-select").addEventListener("change", () => { const val = $("city-select").value; if (!val) return; const [lat, lon] = val.split(","); $("lat").value = lat; $("lon").value = lon; saveSettingsNow(); });
  
  $("fetch-btn").addEventListener("click", fetchAndPlot); $("discover-btn").addEventListener("click", () => doDiscover(false));
  $("refresh-cache-btn").addEventListener("click", () => doDiscover(true)); $("save-csv").addEventListener("click", exportCSV); $("save-png").addEventListener("click", exportPNG);
  
  $("model").addEventListener("change", () => { applyModelDefaults(); saveSettingsNow(); });
  $("sort-mode").addEventListener("change", () => { state.sortMode = $("sort-mode").value; renderVariableList(); saveSettingsNow(); });
  
  $("select-all-btn").addEventListener("click", () => { state.variables.filter(v => !AUTO_VARS.includes(v)).forEach(v => state.selectedVars.add(v)); renderVariableList(); });
  $("clear-btn").addEventListener("click", () => { state.selectedVars.clear(); renderVariableList(); });
  $("info-btn").addEventListener("click", () => {
    const sel = [...state.selectedVars].filter(v => !AUTO_VARS.includes(v)); if (sel.length === 0) { toast(t("toastSelectVar")); return; }
    const lines = sel.map(n => { const info = VAR_INFO[n]; return `${n}  [${varUnit(n)}]\n  ${info ? info[0] : "(no description)"}`; }); alert(lines.join("\n\n"));
  });

  $("apply-preset").addEventListener("click", () => { const name = $("preset-select").value, all = { ...PRESETS, ...state.customPresets }, vars = all[name] || []; state.selectedVars = new Set(vars.filter(v => state.variables.includes(v) && !AUTO_VARS.includes(v))); renderVariableList(); toast(t("toastPresetApplied")); });
  $("save-preset").addEventListener("click", () => {
    const sel = [...state.selectedVars].filter(v => !AUTO_VARS.includes(v)); if (sel.length === 0) { toast(t("toastSelectVar")); return; }
    const name = prompt("Preset name:"); if (!name || !name.trim()) return; if (name in PRESETS) { toast(t("toastCannotOverwrite"), true); return; }
    state.customPresets[name.trim()] = sel; savePresets(state.customPresets); renderPresets(); $("preset-select").value = name.trim(); toast(t("toastPresetSaved"));
  });
  $("delete-preset").addEventListener("click", () => {
    const name = $("preset-select").value; if (!name) return; if (name in PRESETS) { toast(t("toastCannotDelete"), true); return; }
    if (!confirm(`Delete preset "${name}"?`)) return; delete state.customPresets[name]; savePresets(state.customPresets); renderPresets(); toast(t("toastPresetDeleted"));
  });
  $("save-preset-file").addEventListener("click", () => { const blob = new Blob([JSON.stringify(state.customPresets, null, 2)], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "presets.json"; a.click(); URL.revokeObjectURL(a.href); });

  $("dark-mode").addEventListener("change", () => { document.body.dataset.theme = $("dark-mode").checked ? "dark" : "light"; if (state.lastData) renderPlot(); saveSettingsNow(); });
  
  // <--- لیست زیر آپدیت شد تا y-basis را بشناسد
  ["spread", "show-mean", "highlight-members", "autoscale", "padding", "log-y", "show-day-grid", "show-hour-grid", "tod", "display-tz", "calendar-system", "y-basis"].forEach(id => {
    $(id).addEventListener("change", () => { if (state.lastData) renderPlot(); saveSettingsNow(); });
  });
  
  $("show-icons").addEventListener("change", () => { updateWeatherHint(); if (state.lastData) renderPlot(); saveSettingsNow(); });

  $("sidebar-toggle").addEventListener("click", () => { $("sidebar").classList.toggle("collapsed"); setTimeout(() => window.dispatchEvent(new Event("resize")), 300); });
  window.addEventListener("beforeunload", saveSettingsNow);
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); fetchAndPlot(); }
    if (e.ctrlKey && e.key === "r") { e.preventDefault(); doDiscover(true); }
  });
  window.addEventListener("resize", () => { const el = $("plot-container"); if (el && el.data) Plotly.Plots.resize(el); });
}

function boot() {
  state.cache = loadCache(); state.customPresets = loadPresets();
  const saved = loadSettings(); state.lang = saved.lang || "en";
  populateModelDropdown(); renderPresets(); populateCityDropdown(); applyLanguage(state.lang); loadSettingsIntoUI(); wireEvents(); setStatus(t("ready"));
  if (location.protocol === "file:") console.warn("Running from file:// — some browsers block API fetches. For best results, serve with: python3 -m http.server 8000");
}

document.addEventListener("DOMContentLoaded", boot);
