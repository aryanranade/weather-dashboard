package com.example.weatherapp.models;

import java.util.List;

public class WeatherResponse {
    private String cityName;
    private String country;
    private double temperature;
    private double feelsLike;
    private int humidity;
    private double windSpeed;
    private String description;
    private String icon;
    private long sunrise;
    private long sunset;
    private double precipitation;
    private List<ForecastDay> forecast;
    
    // Constructors
    public WeatherResponse() {}
    
    // Getters and Setters
    public String getCityName() {
        return cityName;
    }
    
    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
    
    public double getFeelsLike() {
        return feelsLike;
    }
    
    public void setFeelsLike(double feelsLike) {
        this.feelsLike = feelsLike;
    }
    
    public int getHumidity() {
        return humidity;
    }
    
    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }
    
    public double getWindSpeed() {
        return windSpeed;
    }
    
    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public long getSunrise() {
        return sunrise;
    }
    
    public void setSunrise(long sunrise) {
        this.sunrise = sunrise;
    }
    
    public long getSunset() {
        return sunset;
    }
    
    public void setSunset(long sunset) {
        this.sunset = sunset;
    }
    
    public double getPrecipitation() {
        return precipitation;
    }
    
    public void setPrecipitation(double precipitation) {
        this.precipitation = precipitation;
    }
    
    public List<ForecastDay> getForecast() {
        return forecast;
    }
    
    public void setForecast(List<ForecastDay> forecast) {
        this.forecast = forecast;
    }
    
    // Inner class for forecast days
    public static class ForecastDay {
        private String date;
        private double minTemp;
        private double maxTemp;
        private String description;
        private String icon;
        
        public ForecastDay() {}
        
        public ForecastDay(String date, double minTemp, double maxTemp, String description, String icon) {
            this.date = date;
            this.minTemp = minTemp;
            this.maxTemp = maxTemp;
            this.description = description;
            this.icon = icon;
        }
        
        // Getters and Setters
        public String getDate() {
            return date;
        }
        
        public void setDate(String date) {
            this.date = date;
        }
        
        public double getMinTemp() {
            return minTemp;
        }
        
        public void setMinTemp(double minTemp) {
            this.minTemp = minTemp;
        }
        
        public double getMaxTemp() {
            return maxTemp;
        }
        
        public void setMaxTemp(double maxTemp) {
            this.maxTemp = maxTemp;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public String getIcon() {
            return icon;
        }
        
        public void setIcon(String icon) {
            this.icon = icon;
        }
    }
}
