# Weather Model Explorer | کاوشگر مدل‌های هواشناسی

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue)](https://your-username.github.io/weather-explorer/)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, client-side web application to visualize ensemble weather, marine, and air quality forecasts from the free [Open-Meteo API](https://open-meteo.com/). 

یک وب‌اپلیکیشن تعاملی و سمت کلاینت برای مشاهده و تحلیل پیش‌بینی‌های ensemble مدل‌های هواشناسی، دریایی و آلودگی هوا که از API رایگان [Open-Meteo](https://open-meteo.com/) دریافت می‌شوند.

---

## 🇬🇧 English

### Features
- **Multiple Models:** Support for Google WeatherNext 2, ECMWF IFS, NOAA GEFS, ICON ensembles, and specialized APIs (Air Quality & Marine).
- **Multi-Variable Subplots:** Plot multiple variables (Temperature, Rain, AQI, Wave Height) simultaneously.
- **Ensemble Spread:** Visualize uncertainty using IQR bands, 10-90% bands, or spaghetti plots.
- **AQI Color Bands:** Background colors automatically indicate if the air is safe (green) or hazardous (red/purple).
- **WMO Weather Icons:** Automatic daily weather icons based on the `weather_code`.
- **Bilingual & RTL Support:** Full English and Persian (فارسی) interface with automatic RTL layout and Jalali calendar integration.
- **Global City Search:** Built-in Geocoding API to search for any city worldwide, alongside a pre-defined list of Iranian cities.
- **Dark Mode & Export:** Toggle dark theme, export data to CSV, or save charts as PNG.

### How to Run Locally
Because the app uses ES6 modules and fetches external APIs, it must be served over HTTP (not `file://`).

```bash
# Using Python 3
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 🇮🇷 فارسی

### ویژگی‌ها
- **مدل‌های متنوع:** پشتیبانی از مدل‌های گوگل (WeatherNext 2)، ECMWF، NOAA، ICON و APIهای تخصصی (آلودگی هوا و دریایی).
- **نمودارهای چندگانه:** امکان رسم هم‌زمان چندین متغیر (دما، بارش، شاخص AQI، ارتفاع موج) در نمودارهای جداگانه.
- **پراکندگی (Spread):** نمایش عدم قطعیت پیش‌بینی با استفاده از باندهای IQR، بازه ۱۰-۹۰٪ یا نمودارهای اسپاگتی.
- **باندهای رنگی AQI:** پس‌زمینه نمودار آلودگی هوا به صورت خودکار با رنگ (سبز برای پاک، قرمز برای خطرناک) مشخص می‌شود.
- **آیکون‌های WMO:** نمایش خودکار آیکون‌های آب‌وهوا (آفتاب، باران، برف) بر اساس کدهای WMO.
- **دو زبانه و راست‌چین:** رابط کاربری کامل انگلیسی و فارسی با پشتیبانی خودکار از راست‌چین (RTL) و تقویم جلالی (شمسی).
- **جستجوی شهر:** امکان جستجوی هر شهر در جهان با استفاده از Geocoding API، در کنار لیست پیش‌فرض شهرهای ایران.
- **حالت تاریک و خروجی:** تغییر تم، ذخیره داده‌ها به صورت CSV و ذخیره نمودارها به صورت PNG.

### نحوه اجرا در سیستم لوکال
از آنجا که این پروژه از ماژول‌ها و APIهای خارجی استفاده می‌کند، باید روی یک سرور محلی اجرا شود (نه فایل `file://`).

```bash
# با استفاده از پایتون ۳
python3 -m http.server 8000
```
سپس در مرورگر خود به آدرس `http://localhost:8000` بروید.

---

## 📂 Project Structure | ساختار پروژه

```text
weather-explorer/
├── index.html          # Main HTML structure
├── README.md           # This file
├── LICENSE             # MIT License
├── css/
│   └── styles.css      # Application styling (Light & Dark themes)
└── js/
    ├── jalaali.js      # Persian calendar conversion library
    └── app.js          # Core application logic, API calls, and Plotly rendering
```

---

## 🤝 Contributing | مشارکت
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
از ارسال Pull Request استقبال می‌شود. برای تغییرات عمده، لطفاً ابتدا یک Issue باز کنید تا در مورد آن صحبت کنیم.

## 📄 License | لایسنس
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.