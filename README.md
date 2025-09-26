# 🌦️ Weather Forecast App

A **modern weather application** built with **Next.js, React, and TypeScript** that delivers **real-time weather conditions, a 7-day forecast, and Air Quality Index (AQI)** for cities around the world.  

The app fetches live data from a **Weather API**, processes it through a clean utility layer, and displays it in a **beautiful, responsive UI** styled with **Tailwind CSS**.  

Users can search for any city to instantly get:
- 🌡️ Current weather details (temperature, humidity, wind, pressure, etc.)
- 📅 **7-day forecast prediction** with daily trends
- 🌍 **Air Quality Index (AQI)** with clear indicators for air safety  

Custom **SVG React icons** make the interface visually appealing, while **Next.js App Router** and **TypeScript** ensure scalability and maintainability.

---

## 🚀 Features
- 🌍 Search weather by city name  
- ⏱️ Real-time weather updates  
- 📅 **7-day forecast prediction**  
- 🌡️ Temperature, humidity, wind speed, and pressure details  
- 🌍 **Air Quality Index (AQI) support for all cities**  
- 🎨 Responsive UI powered by Tailwind CSS  
- ☀️ Custom weather icons (SVG with React)  
- 🔍 Modular, component-based structure for scalability  

---

## 🛠️ Tech Stack
- **React** → Functional components for UI rendering  
- **Next.js** → App Router & file-based routing for optimized structure  
- **TypeScript** → Type safety with annotations in components  
- **Tailwind CSS** → Utility-first CSS framework for responsive styling  
- **Git** → Version control (managed with Git & GitHub)  
- **Weather API** → Provides real-time weather and forecast data  
- **SVG React Icons** → Custom weather icons (e.g., ☀️ Sun, 🌧️ CloudRain)  

---

## 📂 Project Structure
weather-app/
├── components/ # Reusable React components
│ ├── AQICard.tsx # Displays Air Quality Index
│ ├── DateDisplay.tsx # Shows current date
│ ├── ForecastCard.tsx # Displays 7-day forecast data
│ ├── SearchBar.tsx # Input field for city search
│ └── WeatherCard.tsx # Main weather details card
│
├── lib/
│ └── weatherApi.ts # API call utilities
│
├── styles/
│ └── globals.css # Global Tailwind CSS styles
│
├── .env.example # Example environment variables
├── .gitignore # Git ignore rules
├── next-env.d.ts # Next.js TypeScript types
├── next.config.js # Next.js configuration
├── package-lock.json
├── package.json
├── postcss.config.js # PostCSS config
├── tailwind.config.ts # Tailwind CSS config
├── tsconfig.json # TypeScript config
└── README.md

## ⚡ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
Install dependencies

bash
Copy code
npm install
Configure Environment Variables
Create a .env.local file in the project root and add:

bash
Copy code
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
Run the development server

bash
Copy code
npm run dev
Open in your browser → http://localhost:3000

📸 Screenshots
(Add app screenshots or a GIF demo here)

Example workflow:

🔍 Search for a city

📊 View current weather and AQI

📅 Explore 7-day forecast

🌐 Deployment
Easily deploy with Vercel, the recommended platform for Next.js apps.

bash
Copy code
vercel
🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

📜 License
This project is licensed under the MIT License.

💡 Future Enhancements
📍 Location-based weather (using Geolocation API)


📊 AQI health impact levels with suggestions
