package com.example.weatherapp.services;

import com.example.weatherapp.dao.FavoriteCityDAO;
import com.example.weatherapp.models.FavoriteCity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteCityService {
    
    @Autowired
    private FavoriteCityDAO favoriteCityDAO;
    
    public void addCity(int userId, String cityName) {
        // Check if city already exists for user
        if (favoriteCityDAO.exists(userId, cityName)) {
            throw new RuntimeException("City already exists in favorites");
        }
        
        favoriteCityDAO.addCity(userId, cityName);
    }
    
    public void deleteCity(int userId, String cityName) {
        favoriteCityDAO.deleteCity(userId, cityName);
    }
    
    public List<String> getCities(int userId) {
        return favoriteCityDAO.getCities(userId);
    }
    
    public List<FavoriteCity> getFavoriteCities(int userId) {
        return favoriteCityDAO.getFavoriteCities(userId);
    }
    
    public boolean isCityFavorite(int userId, String cityName) {
        return favoriteCityDAO.exists(userId, cityName);
    }
    
    public void deleteAllCitiesForUser(int userId) {
        favoriteCityDAO.deleteAllCitiesForUser(userId);
    }
}
