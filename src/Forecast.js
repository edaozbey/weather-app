// src/Forecast.js
import React, { useEffect, useState } from 'react';

function Forecast({ city, apiKey }) {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        const geoData = await geoRes.json();
        if (!geoData.length) {
          setError('Koordinat bulunamadı');
          return;
        }

        const { lat, lon } = geoData[0];
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setForecast(data.list.slice(0, 5 * 8));
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Hata oluştu');
      }
    };

    fetchForecast();
  }, [city, apiKey]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-3">
      <h5>{city} için 5 Günlük Tahmin</h5>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {forecast.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'inline-block',
              border: '1px solid #ccc',
              margin: '5px',
              padding: '10px',
              minWidth: '120px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}
          >
            <p><strong>{new Date(item.dt_txt).toLocaleString('tr-TR')}</strong></p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt=""
            />
            <p>{item.main.temp}°C</p>
            <p>{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
