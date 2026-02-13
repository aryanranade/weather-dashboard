package com.example.weatherapp.models;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private int userId;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String email, String name, int userId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
}
