import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container, Row, Col, Form, Button, Spinner, Alert
} from 'react-bootstrap';
import { allCities } from './cities';
import WeatherCard from './WeatherCard';
import './App.css';

const initialCities = ['İstanbul', 'Ankara', 'İzmir'];

function App() {
  const [selectedCities, setSelectedCities] = useState(initialCities);
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCity, setNewCity] = useState('');

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherForCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(selectedCities.map(async (city) => {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          return { ...data, error: !response.ok };
        }));
        setWeatherList(results);
      } catch (err) {
        setError('Veriler alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForCities();
  }, [selectedCities, apiKey]);

  const handleAddCity = (e) => {
    e.preventDefault();
    if (newCity && !selectedCities.includes(newCity)) {
      setSelectedCities([...selectedCities, newCity]);
      setNewCity('');
    }
  };

  const handleDeleteCity = (cityName) => {
    setSelectedCities(selectedCities.filter((c) => c !== cityName));
  };

  const weeklyForecast = [
    { day: 'P', icon: '☀️' },
    { day: 'S', icon: '🌤️' },
    { day: 'Ç', icon: '⛅' },
    { day: 'P', icon: '🌦️' },
    { day: 'C', icon: '🌧️' },
    { day: 'C', icon: '⛈️' },
    { day: 'P', icon: '🌤️' },
  ];

  return (
    <Container className="py-4">
      <h1 className="title text-center mb-4">Weather Forecast</h1>

      <Form onSubmit={handleAddCity} className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={4}>
            <Form.Select
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            >
              <option value="">Choose a city</option>
              {allCities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button
              type="submit"
              className="custom-add-btn"
              disabled={!newCity}
            >
              Ekle
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <Row className="justify-content-center">
          {weatherList.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={3} className="mb-4 d-flex flex-column align-items-center">
              <div className="hover-card-wrapper">
                <WeatherCard
                  isNight={item.dt && new Date(item.dt * 1000).getHours() >= 18}
                  temp={item.main?.temp || '--'}
                  city={item.name}
                  forecast={weeklyForecast}
                />
              </div>
              <Button
                variant="danger"
                size="sm"
                className="custom-delete-btn mt-2 w-100"
                onClick={() => handleDeleteCity(item.name)}
              >
                Delete
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default App;
