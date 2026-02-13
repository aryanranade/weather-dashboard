package com.example.weatherapp.controllers;

import com.example.weatherapp.models.FavoriteCity;
import com.example.weatherapp.models.WeatherResponse;
import com.example.weatherapp.security.JwtUtil;
import com.example.weatherapp.services.FavoriteCityService;
import com.example.weatherapp.services.WeatherService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class CityController {
    
    @Autowired
    private FavoriteCityService favoriteCityService;
    
    @Autowired
    private WeatherService weatherService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getFavoriteCities(@PathVariable int userId) {
        try {
            List<String> cities = favoriteCityService.getCities(userId);
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch favorite cities: " + e.getMessage());
        }
    }
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> addFavoriteCity(@PathVariable int userId, @RequestParam String city) {
        try {
            favoriteCityService.addCity(userId, city);
            return ResponseEntity.ok("City added to favorites successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add city to favorites: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> removeFavoriteCity(@PathVariable int userId, @RequestParam String city) {
        try {
            favoriteCityService.deleteCity(userId, city);
            return ResponseEntity.ok("City removed from favorites successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove city from favorites: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}/weather")
    public ResponseEntity<?> getFavoriteCitiesWeather(@PathVariable int userId) {
        try {
            List<String> cities = favoriteCityService.getCities(userId);
            List<WeatherResponse> weatherList = new java.util.ArrayList<>();
            
            for (String city : cities) {
                try {
                    WeatherResponse weather = weatherService.getCurrentWeather(city);
                    weatherList.add(weather);
                } catch (Exception e) {
                    // Skip cities that fail to fetch weather data
                    System.err.println("Failed to fetch weather for city: " + city + " - " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(weatherList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch favorite cities weather: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}/check")
    public ResponseEntity<?> checkIfCityIsFavorite(@PathVariable int userId, @RequestParam String city) {
        try {
            boolean isFavorite = favoriteCityService.isCityFavorite(userId, city);
            return ResponseEntity.ok(isFavorite);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to check favorite status: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{userId}/all")
    public ResponseEntity<?> deleteAllFavoriteCities(@PathVariable int userId) {
        try {
            favoriteCityService.deleteAllCitiesForUser(userId);
            return ResponseEntity.ok("All favorite cities removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove all favorite cities: " + e.getMessage());
        }
    }
}
