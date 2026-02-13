package com.example.weatherapp.services;

import com.example.weatherapp.dao.UserDAO;
import com.example.weatherapp.models.AuthRequest;
import com.example.weatherapp.models.AuthResponse;
import com.example.weatherapp.models.User;
import com.example.weatherapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse register(User user) {
        // Check if user already exists
        if (userDAO.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Save user
        userDAO.createUser(user);
        
        // Generate JWT token
        Optional<User> savedUser = userDAO.findByEmail(user.getEmail());
        if (savedUser.isPresent()) {
            String token = jwtUtil.generateToken(user.getEmail(), savedUser.get().getId(), user.getName());
            return new AuthResponse(token, user.getEmail(), user.getName(), savedUser.get().getId());
        }
        
        throw new RuntimeException("Failed to create user");
    }
    
    public AuthResponse login(AuthRequest authRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        
        // Get user details
        Optional<User> userOptional = userDAO.findByEmail(authRequest.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getId());
    }
    
    public User getUserByEmail(String email) {
        Optional<User> userOptional = userDAO.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return userOptional.get();
    }
    
    public User getUserById(int id) {
        Optional<User> userOptional = userDAO.findById(id);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        return userOptional.get();
    }
}
