package com.example.weatherapp.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.weatherapp.models.WeatherResponse;

@Service
public class WeatherService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${openweather.api.key}")
    private String apiKey;
    
    @Value("${openweather.api.url}")
    private String apiUrl;
    
    public WeatherResponse getCurrentWeather(String city) {
        String url = apiUrl + "/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
        
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
        if (response == null) {
            throw new RuntimeException("Failed to fetch weather data for city: " + city);
        }
        
        return mapToWeatherResponse(response);
    }
    
    public WeatherResponse getCurrentWeatherByCoordinates(double lat, double lon) {
        String url = apiUrl + "/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";
        
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
        if (response == null) {
            throw new RuntimeException("Failed to fetch weather data for coordinates: " + lat + ", " + lon);
        }
        
        return mapToWeatherResponse(response);
    }
    
    public WeatherResponse getWeatherWithForecast(String city) {
        // Get current weather
        WeatherResponse weatherResponse = getCurrentWeather(city);
        
        // Get 5-day forecast
        String forecastUrl = apiUrl + "/forecast?q=" + city + "&appid=" + apiKey + "&units=metric";
        Map<String, Object> forecastResponse = restTemplate.getForObject(forecastUrl, Map.class);
        
        if (forecastResponse != null) {
            List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecastResponse.get("list");
            List<WeatherResponse.ForecastDay> forecast = processForecastData(forecastList);
            weatherResponse.setForecast(forecast);
        }
        
        return weatherResponse;
    }
    
    public WeatherResponse getWeatherWithForecastByCoordinates(double lat, double lon) {
        // Get current weather
        WeatherResponse weatherResponse = getCurrentWeatherByCoordinates(lat, lon);
        
        // Get 5-day forecast
        String forecastUrl = apiUrl + "/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";
        Map<String, Object> forecastResponse = restTemplate.getForObject(forecastUrl, Map.class);
        
        if (forecastResponse != null) {
            List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecastResponse.get("list");
            List<WeatherResponse.ForecastDay> forecast = processForecastData(forecastList);
            weatherResponse.setForecast(forecast);
        }
        
        return weatherResponse;
    }
    
    private WeatherResponse mapToWeatherResponse(Map<String, Object> response) {
        WeatherResponse weatherResponse = new WeatherResponse();
        
        // Map main weather data
        Map<String, Object> main = (Map<String, Object>) response.get("main");
    weatherResponse.setTemperature(toDouble(main.get("temp")));
    weatherResponse.setFeelsLike(toDouble(main.get("feels_like")));
    // humidity is usually an integer, but handle as Number for safety
    Object humidityObj = main.get("humidity");
    weatherResponse.setHumidity(humidityObj == null ? null : ((Number) humidityObj).intValue());
        
        // Map wind data
        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
    weatherResponse.setWindSpeed(toDouble(wind.get("speed")));
        
        // Map precipitation data
        Map<String, Object> rain = (Map<String, Object>) response.get("rain");
        Map<String, Object> snow = (Map<String, Object>) response.get("snow");
        double precipitation = 0.0;
        if (rain != null && rain.containsKey("1h")) {
            precipitation = toDouble(rain.get("1h"));
        } else if (rain != null && rain.containsKey("3h")) {
            precipitation = toDouble(rain.get("3h"));
        } else if (snow != null && snow.containsKey("1h")) {
            precipitation = toDouble(snow.get("1h"));
        } else if (snow != null && snow.containsKey("3h")) {
            precipitation = toDouble(snow.get("3h"));
        }
        weatherResponse.setPrecipitation(precipitation);
        
        // Map weather description
        List<Map<String, Object>> weather = (List<Map<String, Object>>) response.get("weather");
        Map<String, Object> weatherInfo = weather.get(0);
        weatherResponse.setDescription((String) weatherInfo.get("description"));
        weatherResponse.setIcon((String) weatherInfo.get("icon"));
        
        // Map city information
        weatherResponse.setCityName((String) response.get("name"));
        Map<String, Object> sys = (Map<String, Object>) response.get("sys");
        weatherResponse.setCountry((String) sys.get("country"));
        weatherResponse.setSunrise(((Number) sys.get("sunrise")).longValue());
        weatherResponse.setSunset(((Number) sys.get("sunset")).longValue());
        
        return weatherResponse;
    }
    
    private List<WeatherResponse.ForecastDay> processForecastData(List<Map<String, Object>> forecastList) {
        List<WeatherResponse.ForecastDay> forecast = new ArrayList<>();
        Map<String, WeatherResponse.ForecastDay> dailyForecast = new java.util.HashMap<>();
        
        for (Map<String, Object> item : forecastList) {
            String dateTime = (String) item.get("dt_txt");
            String date = dateTime.split(" ")[0];
            
            Map<String, Object> main = (Map<String, Object>) item.get("main");
            double temp = toDouble(main.get("temp"));
            
            List<Map<String, Object>> weather = (List<Map<String, Object>>) item.get("weather");
            Map<String, Object> weatherInfo = weather.get(0);
            String description = (String) weatherInfo.get("description");
            String icon = (String) weatherInfo.get("icon");
            
            if (!dailyForecast.containsKey(date)) {
                WeatherResponse.ForecastDay day = new WeatherResponse.ForecastDay();
                day.setDate(formatDate(date));
                day.setMinTemp(temp);
                day.setMaxTemp(temp);
                day.setDescription(description);
                day.setIcon(icon);
                dailyForecast.put(date, day);
            } else {
                WeatherResponse.ForecastDay day = dailyForecast.get(date);
                day.setMinTemp(Math.min(day.getMinTemp(), temp));
                day.setMaxTemp(Math.max(day.getMaxTemp(), temp));
            }
        }
        
        // Convert to list and limit to 5 days
        forecast.addAll(dailyForecast.values());
        return forecast.stream().limit(5).collect(java.util.stream.Collectors.toList());
    }
    
    private String formatDate(String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        return date.format(DateTimeFormatter.ofPattern("MMM dd"));
    }
    
    public List<Map<String, String>> getCitySuggestions(String query) {
        // Limit query length to avoid issues
        if (query == null || query.trim().length() < 2) {
            return new ArrayList<>();
        }
        
        // Use OpenWeather's Geocoding API for city suggestions
        String url = "https://api.openweathermap.org/geo/1.0/direct?q=" + query.trim() + "&limit=5&appid=" + apiKey;
        
        try {
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
            List<Map<String, String>> suggestions = new ArrayList<>();
            
            if (response != null) {
                for (Map<String, Object> city : response) {
                    Map<String, String> suggestion = new java.util.HashMap<>();
                    suggestion.put("name", (String) city.get("name"));
                    suggestion.put("country", (String) city.get("country"));
                    if (city.get("state") != null) {
                        suggestion.put("state", (String) city.get("state"));
                    }
                    suggestions.add(suggestion);
                }
            }
            
            return suggestions;
        } catch (Exception e) {
            System.err.println("Error fetching city suggestions: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Safely convert various numeric representations (Integer, Double, Long, etc.) to a double.
     * If obj is null or cannot be converted, returns 0.0.
     */
    private double toDouble(Object obj) {
        if (obj == null) return 0.0;
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            return Double.parseDouble(obj.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }
}
