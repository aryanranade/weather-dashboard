package com.example.weatherapp.dao;

import com.example.weatherapp.models.FavoriteCity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class FavoriteCityDAO {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final RowMapper<FavoriteCity> favoriteCityRowMapper = new RowMapper<FavoriteCity>() {
        @Override
        public FavoriteCity mapRow(ResultSet rs, int rowNum) throws SQLException {
            FavoriteCity favoriteCity = new FavoriteCity();
            favoriteCity.setId(rs.getInt("id"));
            favoriteCity.setUserId(rs.getInt("user_id"));
            favoriteCity.setCityName(rs.getString("city_name"));
            return favoriteCity;
        }
    };
    
    public void addCity(int userId, String cityName) {
        String sql = "INSERT INTO favorite_cities (user_id, city_name) VALUES (?, ?)";
        jdbcTemplate.update(sql, userId, cityName);
    }
    
    public void deleteCity(int userId, String cityName) {
        String sql = "DELETE FROM favorite_cities WHERE user_id = ? AND city_name = ?";
        jdbcTemplate.update(sql, userId, cityName);
    }
    
    public List<String> getCities(int userId) {
        String sql = "SELECT city_name FROM favorite_cities WHERE user_id = ? ORDER BY city_name";
        return jdbcTemplate.queryForList(sql, String.class, userId);
    }
    
    public List<FavoriteCity> getFavoriteCities(int userId) {
        String sql = "SELECT * FROM favorite_cities WHERE user_id = ? ORDER BY city_name";
        return jdbcTemplate.query(sql, favoriteCityRowMapper, userId);
    }
    
    public boolean exists(int userId, String cityName) {
        String sql = "SELECT COUNT(*) FROM favorite_cities WHERE user_id = ? AND city_name = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, cityName);
        return count != null && count > 0;
    }
    
    public void deleteAllCitiesForUser(int userId) {
        String sql = "DELETE FROM favorite_cities WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}
