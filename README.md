<h1 align="center">🌤️ Weather Dashboard</h1>

<p align="center">
  A modern, responsive, full-stack weather application with user authentication, personalized favorite cities, and dynamic day/night themes. Built with a React frontend and a Spring Boot (Java) backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Render-%46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🚀 Live Demo

**Frontend (Vercel):** [https://weather-dashboard-omega-mocha.vercel.app](https://weather-dashboard-omega-mocha.vercel.app)  
**Backend API (Render):** Deployed live via Docker containers.

## ✨ Features

- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and Spring Security.
- **Real-Time Weather Data:** Integrated with the OpenWeatherMap API for accurate, up-to-date conditions.
- **5-Day Forecasts:** detailed granular forecasts with weather icons.
- **Favorite Cities:** Save locations to your account for quick access across devices.
- **Dynamic UI:** Beautiful, glassmorphic UI styled with Tailwind CSS and Framer Motion that changes based on dawn/dusk times in the searched city.
- **Zero-Config Deployment:** Ready to be deployed instantly using Render (PostgreSQL + Dockerized Spring Boot) and Vercel.

## 🛠️ Architecture and Tech Stack

### Frontend (`/frontend`)
- **React 18** (Create React App)
- **Tailwind CSS** (Styling & Responsive Design)
- **Framer Motion** (Micro-animations and transitions)
- **Axios** (API requests & interceptors)

### Backend (`/backend`)
- **Java 17**
- **Spring Boot 3.2**
- **Spring Security & JWT** (Stateless authentication)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (Relational Database)

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Database Setup
Ensure you have a PostgreSQL database running locally (or use a cloud instance).
Create a new database for the application (e.g., `weatherdb`).

### 2. Backend Setup
The backend requires environment variables to connect to your database and external APIs safely.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. You can either set these environment variables in your IDE or terminal:
   - `SPRING_DATASOURCE_URL` (e.g., `jdbc:postgresql://localhost:5432/weatherdb`)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET` (A strong random string)
   - `OPENWEATHER_API_KEY` (Your API key from openweathermap.org)
3. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary NPM packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root directory and add your local API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```
4. Start the React development server:
   ```bash
   npm start
   ```

## 🌐 Deployment Instructions

This repository is pre-configured for cloud deployment:
1. **Database:** Deploy a free PostgreSQL database on Render.
2. **Backend:** Deploy the Web Service on Render using the included `Dockerfile` and linking the database environment variables.
3. **Frontend:** Deploy the React app on Vercel, which will automatically route according to the included `vercel.json`. Set the `REACT_APP_API_URL` environment variable to point to your live Render backend.

Detailed step-by-step generic deployment instructions can be found in the included walkthrough documents.

---
*Created by [Aryan Ranade](https://github.com/aryanranade)*
