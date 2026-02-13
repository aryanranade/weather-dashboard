import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getUserByEmail: async (email) => {
    const response = await api.get(`/auth/user/${email}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/auth/user/id/${id}`);
    return response.data;
  },
};

export const weatherService = {
  getWeatherByCity: async (city) => {
    const response = await api.get(`/weather/city/${city}`);
    return response.data;
  },

  getWeatherWithForecast: async (city) => {
    const response = await api.get(`/weather/city/${city}/forecast`);
    return response.data;
  },

  getWeatherByCoordinates: async (lat, lon) => {
    const response = await api.get(`/weather/coordinates?lat=${lat}&lon=${lon}`);
    return response.data;
  },

  getWeatherWithForecastByCoordinates: async (lat, lon) => {
    const response = await api.get(`/weather/coordinates/forecast?lat=${lat}&lon=${lon}`);
    return response.data;
  },

  getCitySuggestions: async (query) => {
    const response = await api.get(`/weather/city-suggestions?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export const favoritesService = {
  getFavoriteCities: async (userId) => {
    const response = await api.get(`/favorites/${userId}`);
    return response.data;
  },

  addFavoriteCity: async (userId, city) => {
    const response = await api.post(`/favorites/${userId}?city=${city}`);
    return response.data;
  },

  removeFavoriteCity: async (userId, city) => {
    const response = await api.delete(`/favorites/${userId}?city=${city}`);
    return response.data;
  },

  getFavoriteCitiesWeather: async (userId) => {
    const response = await api.get(`/favorites/${userId}/weather`);
    return response.data;
  },

  checkIfCityIsFavorite: async (userId, city) => {
    const response = await api.get(`/favorites/${userId}/check?city=${city}`);
    return response.data;
  },

  deleteAllFavoriteCities: async (userId) => {
    const response = await api.delete(`/favorites/${userId}/all`);
    return response.data;
  },
};
