package com.example.weatherapp.models;

public class FavoriteCity {
    private int id;
    private int userId;
    private String cityName;
    
    // Constructors
    public FavoriteCity() {}
    
    public FavoriteCity(int userId, String cityName) {
        this.userId = userId;
        this.cityName = cityName;
    }
    
    public FavoriteCity(int id, int userId, String cityName) {
        this.id = id;
        this.userId = userId;
        this.cityName = cityName;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public String getCityName() {
        return cityName;
    }
    
    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
    
    @Override
    public String toString() {
        return "FavoriteCity{" +
                "id=" + id +
                ", userId=" + userId +
                ", cityName='" + cityName + '\'' +
                '}';
    }
}
