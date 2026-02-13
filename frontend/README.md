# Weather Dashboard Frontend Setup Instructions

## Prerequisites
- Node.js 16 or higher
- npm or yarn
- Backend server running on http://localhost:8080

## Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

## Configuration

1. **Backend API URL:**
   - The frontend is configured to connect to `http://localhost:8080/api`
   - If your backend runs on a different port, update the `API_BASE_URL` in `src/services/api.js`

2. **OpenWeatherMap API:**
   - Make sure your backend has a valid OpenWeatherMap API key configured
   - The frontend fetches weather data through the backend API

## Running the Application

1. **Start the development server:**
```bash
npm start
```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The app will automatically redirect to login/register page

## Features

### Authentication
- **Register:** Create a new account with name, email, and password
- **Login:** Sign in with email and password
- **JWT Token:** Automatic token management and storage
- **Protected Routes:** Dashboard requires authentication

### Weather Dashboard
- **Search:** Search for weather by city name
- **Current Location:** Get weather using browser geolocation
- **Current Weather:** Temperature, humidity, wind speed, sunrise/sunset
- **5-Day Forecast:** Extended weather forecast with icons
- **Weather Icons:** Real weather icons from OpenWeatherMap

### Favorite Cities
- **Add to Favorites:** Click heart icon on weather cards
- **Remove from Favorites:** Click heart icon again or remove button
- **Favorites List:** View all favorite cities with current weather
- **Quick Access:** Click any favorite city to view its weather

### UI/UX Features
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Modern UI:** Tailwind CSS with gradients and shadows
- **Animations:** Framer Motion for smooth transitions
- **Loading States:** Visual feedback during API calls
- **Error Handling:** User-friendly error messages

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── SearchBar.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── FavoritesList.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   └── Dashboard.jsx
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   ├── api.js
│   │   └── services.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Troubleshooting

1. **CORS Issues:** Make sure backend CORS is configured for `http://localhost:3000`
2. **API Connection:** Verify backend is running on `http://localhost:8080`
3. **Authentication:** Clear localStorage if experiencing login issues
4. **Weather Data:** Check if OpenWeatherMap API key is valid in backend

## Production Build

To create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment.
