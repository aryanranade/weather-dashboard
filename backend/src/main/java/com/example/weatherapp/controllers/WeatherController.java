package com.example.weatherapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.weatherapp.models.WeatherResponse;
import com.example.weatherapp.security.JwtUtil;
import com.example.weatherapp.services.WeatherService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {
    
    @Autowired
    private WeatherService weatherService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/city/{city}")
    public ResponseEntity<?> getWeatherByCity(@PathVariable String city) {
        try {
            WeatherResponse weather = weatherService.getCurrentWeather(city);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch weather: " + e.getMessage());
        }
    }
    
    @GetMapping("/city/{city}/forecast")
    public ResponseEntity<?> getWeatherWithForecastByCity(@PathVariable String city) {
        try {
            WeatherResponse weather = weatherService.getWeatherWithForecast(city);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch weather forecast: " + e.getMessage());
        }
    }
    
    @GetMapping("/coordinates")
    public ResponseEntity<?> getWeatherByCoordinates(@RequestParam double lat, @RequestParam double lon) {
        try {
            WeatherResponse weather = weatherService.getCurrentWeatherByCoordinates(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch weather: " + e.getMessage());
        }
    }
    
    @GetMapping("/coordinates/forecast")
    public ResponseEntity<?> getWeatherWithForecastByCoordinates(@RequestParam double lat, @RequestParam double lon) {
        try {
            WeatherResponse weather = weatherService.getWeatherWithForecastByCoordinates(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch weather forecast: " + e.getMessage());
        }
    }
    
    @GetMapping("/current-location")
    public ResponseEntity<?> getCurrentLocationWeather(HttpServletRequest request) {
        try {
            // Extract user ID from JWT token
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.badRequest().body("No authentication token provided");
            }
            
            // For current location, we'll need the frontend to provide coordinates
            // This endpoint is here for future use when implementing geolocation
            return ResponseEntity.badRequest().body("Please provide coordinates using /coordinates endpoint");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch current location weather: " + e.getMessage());
        }
    }
    
    @GetMapping("/city-suggestions")
    public ResponseEntity<?> getCitySuggestions(@RequestParam String query) {
        try {
            java.util.List<java.util.Map<String, String>> suggestions = weatherService.getCitySuggestions(query);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch city suggestions: " + e.getMessage());
        }
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}