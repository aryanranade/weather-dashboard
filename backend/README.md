# Weather Dashboard Backend Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- OpenWeatherMap API key

## Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE weatherdb;
```

2. **Create Tables:**
```sql
USE weatherdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE favorite_cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  city_name VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Configuration

1. **Update application.properties:**
   - Change `spring.datasource.password` to your MySQL password
   - Add your OpenWeatherMap API key to `openweather.api.key`

2. **Get OpenWeatherMap API Key:**
   - Visit: https://openweathermap.org/api
   - Sign up for a free account
   - Get your API key

## Running the Application

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Run the application:**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user/{email}` - Get user by email
- `GET /api/auth/user/id/{id}` - Get user by ID

### Weather
- `GET /api/weather/city/{city}` - Get weather by city name
- `GET /api/weather/city/{city}/forecast` - Get weather with 5-day forecast
- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Get weather by coordinates
- `GET /api/weather/coordinates/forecast?lat={lat}&lon={lon}` - Get weather with forecast by coordinates

### Favorite Cities
- `GET /api/favorites/{userId}` - Get user's favorite cities
- `POST /api/favorites/{userId}?city={city}` - Add city to favorites
- `DELETE /api/favorites/{userId}?city={city}` - Remove city from favorites
- `GET /api/favorites/{userId}/weather` - Get weather for all favorite cities
- `GET /api/favorites/{userId}/check?city={city}` - Check if city is favorite
- `DELETE /api/favorites/{userId}/all` - Remove all favorite cities

## Authentication
All weather and favorites endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Testing
You can test the API using tools like Postman or curl. Make sure to:
1. Register a user first
2. Login to get a JWT token
3. Use the token for authenticated requests
