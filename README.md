# 🌦️ Weather Model Explorer | کاوشگر مدل‌های هواشناسی

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue?style=for-the-badge&logo=github)](https://Fouladi-K.github.io/weather-explorer/)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![API: Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-00b0ff?style=flat-square)](https://open-meteo.com/)

**Weather Model Explorer** is a powerful, fully client-side web application designed to visualize ensemble weather forecasts, marine conditions, and air quality data. By leveraging the free [Open-Meteo API](https://open-meteo.com/), this app allows meteorology enthusiasts, researchers, and developers to compare multiple global weather models in real-time.

🚀 **[View the Live Demo Here](https://Fouladi-K.github.io/weather-explorer/)**

**کاوشگر مدل‌های هواشناسی** یک وب‌اپلیکیشن تعاملی و سمت کلاینت است که برای مشاهده و تحلیل پیش‌بینی‌های ensemble (احتمالاتی) مدل‌های هواشناسی، شرایط دریایی و داده‌های آلودگی هوا طراحی شده است. این برنامه با استفاده از API رایگان [Open-Meteo](https://open-meteo.com/) به شما اجازه می‌دهد تا مدل‌های مختلف جوی را با هم مقایسه کنید.

🚀 **[مشاهده دموی آنلاین پروژه اینجا کلیک کنید](https://Fouladi-K.github.io/weather-explorer/)**

---

## ✨ Key Features | ویژگی‌های کلیدی

*   **Comprehensive Model Support:** Choose from a wide range of global deterministic, ensemble, AI-based, and seasonal weather models.
*   **Multi-Variable Subplots:** Plot multiple weather variables (e.g., Temperature, Precipitation, Wind Speed) simultaneously on separate, synchronized charts.
*   **Ensemble Spread Visualization:** Understand forecast uncertainty using IQR bands (25-75%), 10-90% bands, or Spaghetti plots.
*   **Air Quality Index (AQI) Color Bands:** Automatically displays background colors on AQI and pollutant charts (PM2.5, PM10, NO2, O3) to indicate if the air is safe (green) or hazardous (red/purple).
*   **WMO Weather Icons:** Automatically fetches and displays daily weather icons (sun, rain, snow, thunderstorms) based on WMO weather codes.
*   **Bilingual & RTL Support:** Full support for English and Persian (فارسی), including automatic RTL (Right-to-Left) layout adjustment.
*   **Jalali (Persian) Calendar:** Seamlessly switch between the Gregorian calendar and the Persian Jalali calendar for the x-axis and tooltips.
*   **Global City Search:** Built-in Geocoding API integration allows users to search for any city worldwide, alongside a pre-defined list of major Iranian cities.
*   **Data Export:** Export plotted data to CSV or save high-resolution charts as PNG.
*   **Dark Mode:** Easy on the eyes with a fully styled dark theme.

---

## 📊 Supported Weather Models | مدل‌های هواشناسی پشتیبانی‌شده

This application integrates with multiple state-of-the-art weather models provided by Open-Meteo:

### 1. Global Deterministic Models
*   **ECMWF IFS 0.25°** (European Centre for Medium-Range Weather Forecasts)
*   **NOAA GFS (Seamless)** (Global Forecast System - USA)
*   **NOAA AIGFS 0.25°** (Artificial Intelligence Global Forecast System)

### 2. Global Ensemble Models
*   **Google WeatherNext 2 Ensemble** (64-member AI ensemble)
*   **Google WeatherNext 2 Ensemble Mean**
*   **ECMWF IFS 0.25° Ensemble**
*   **NOAA GEFS (Seamless)** & **NOAA GEFS 0.5° (35-Day Extended)**
*   **ECMWF AIFS 0.25° Ensemble**

### 3. Regional Ensembles (DWD ICON - Germany)
*   **DWD ICON-EPS (Global)**
*   **DWD ICON-EU-EPS (Europe)**
*   **DWD ICON-D2-EPS (Germany - 2km high resolution)**

### 4. Extended & Seasonal Models
*   **ECMWF EC46** (Sub-seasonal forecasting up to 46 days)
*   **ECMWF SEAS5** (Seasonal forecasting up to 7 months)
*   **ECMWF Seasonal (Seamless)**

### 5. Specialized APIs (Air & Marine)
*   **Open-Meteo Air Quality (CAMS)**: PM2.5, PM10, CO, NO2, SO2, Ozone, European/US AQI, Pollen, and UV Index.
*   **Open-Meteo Marine Weather**: Wave height, wave period, wave direction, and sea surface temperature.

---

## 🚀 How to Run Locally | نحوه اجرا در سیستم لوکال

Because this application uses JavaScript modules and fetches data from external APIs (CORS), it must be served via a local HTTP server. Opening the `index.html` file directly (via `file://`) will block API requests.

از آنجا که این برنامه از ماژول‌های جاوااسکریپت استفاده می‌کند و داده‌ها را از APIهای خارجی دریافت می‌کند، باید روی یک سرور HTTP محلی اجرا شود. باز کردن مستقیم فایل `index.html` (با پروتکل `file://`) باعث مسدود شدن درخواست‌ها می‌شود.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/weather-explorer.git
cd weather-explorer

# 2. Start a local server (Python 3)
python3 -m http.server 8000
```
Then, open your browser and navigate to: **`http://localhost:8000`**
سپس مرورگر خود را باز کرده و به آدرس **`http://localhost:8000`** بروید.

---

## 📂 Project Structure | ساختار پروژه

```text
weather-explorer/
├── index.html          # Main HTML structure
├── README.md           # Project documentation
├── LICENSE             # MIT License
├── css/
│   └── styles.css      # Application styling (Light & Dark themes, RTL)
└── js/
    ├── jalaali.js      # Persian calendar conversion library
    └── app.js          # Core logic, API calls, and Plotly.js rendering
```

## 🛠️ Technologies Used | تکنولوژی‌های استفاده‌شده

*   **HTML5 / CSS3 / Vanilla JavaScript (ES6+)**
*   **Plotly.js** for interactive, high-performance charting.
*   **[Open-Meteo API](https://open-meteo.com/)** for weather, air quality, marine, and geocoding data.
*   **jalaali-js** for accurate Persian calendar conversions.

## 🤝 Contributing | مشارکت
Pull requests are welcome! If you have suggestions for new features or improvements, please open an issue first to discuss what you would like to change.
از ارسال Pull Request استقبال می‌شود! اگر پیشنهادی برای اضافه کردن ویژگی جدید دارید، لطفاً ابتدا یک Issue باز کنید.

## 📄 License | لایسنس
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مشاهده کنید.
