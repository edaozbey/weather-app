import React from 'react';
import './WeatherCard.css';

function WeatherCard({ isNight, temp, city, forecast }) {
  return (
    <div className={`weather-card ${isNight ? 'night' : 'day'}`}>
      <div className="weather-top">
        <p className="city">{city}</p>
        <div className="icon-temp">
          <div className="weather-icon">{isNight ? '🌙☁️' : '☀️☁️'}</div>
          <h1 className="temperature">{temp}°</h1>
        </div>
        <p className="subtitle">Sunny 29°/21°</p>
      </div>
      <div className="weather-bottom">
        <p className="section-title">Weather This Week</p>
        <div className="forecast">
          {forecast.map((day, i) => (
            <div key={i} className="day">
              <span>{day.day}</span>
              <span>{day.icon}</span>
            </div>
          ))}
        </div>
        <div className="graph-line"></div>
      </div>
    </div>
  );
}

export default WeatherCard;
