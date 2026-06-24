import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BookingPage.css";

const climateData = {
  bali: { temp: "27°C - 31°C", condition: "Warm Tropical Climate", humidity: "Moderate" },
  dubai: { temp: "30°C - 40°C", condition: "Hot Desert Climate", humidity: "Dry Weather" },
  london: { temp: "10°C - 20°C", condition: "Cool & Cloudy", humidity: "Frequent Rain" },
  paris: { temp: "12°C - 22°C", condition: "Mild Climate", humidity: "Pleasant Weather" },
  maldives: { temp: "28°C - 32°C", condition: "Sunny Beach Weather", humidity: "High Humidity" },
  korea: { temp: "5°C - 25°C", condition: "Cool Seasonal Weather", humidity: "Chilly Evenings" },
  switzerland: { temp: "-2°C - 12°C", condition: "Snowy Mountain Climate", humidity: "Cold Breeze" },
  thailand: { temp: "26°C - 34°C", condition: "Tropical Weather", humidity: "Humid Climate" },
  singapore: { temp: "27°C - 33°C", condition: "Warm Tropical Weather", humidity: "High Humidity" },
  japan: { temp: "6°C - 22°C", condition: "Pleasant Seasonal Climate", humidity: "Moderate" },
  goa: { temp: "25°C - 33°C", condition: "Sunny Beach Weather", humidity: "Humid" },
  kerala: { temp: "23°C - 32°C", condition: "Tropical Monsoon Climate", humidity: "High Humidity" },
  kashmir: { temp: "-5°C - 15°C", condition: "Snowy Cold Climate", humidity: "Cool Breeze" },
  manali: { temp: "-3°C - 18°C", condition: "Hill Station Climate", humidity: "Cold Air" },
};

export default function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    destination: params.get("destination") || "",
    people: "",
    date: "",
  });
  const [weather, setWeather] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!form.destination || !form.date) { setWeather(null); return; }
    const key = form.destination.toLowerCase().replace(/\s+/g, "");
    const dateObj = new Date(form.date);
    const diffDays = (dateObj - new Date()) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      const info = climateData[key];
      setWeather(info ? { source: "seasonal", ...info } : null);
      return;
    }
    // Try live OpenWeatherMap API
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${form.destination}&units=metric&appid=766a6b615aedc7e60e2e75d5b4505aa4`)
      .then(r => r.json())
      .then(data => {
        if (data.list) {
          const forecast = data.list.find(item => item.dt_txt.includes(form.date));
          if (forecast) {
            setWeather({ source: "live", temp: `${forecast.main.temp}°C`, condition: forecast.weather[0].main, humidity: `${forecast.main.humidity}%` });
            return;
          }
        }
        const info = climateData[key];
        setWeather(info ? { source: "seasonal", ...info } : null);
      })
      .catch(() => {
        const info = climateData[key];
        setWeather(info ? { source: "seasonal", ...info } : null);
      });
  }, [form.destination, form.date]);

  function handleSubmit(e) {
    e.preventDefault();
    const peopleVal = parseInt(form.people, 10);
    if (isNaN(peopleVal) || peopleVal < 1) { alert("Please enter a valid number of people (minimum 1)."); return; }
    const bookingData = {
      name: form.name,
      email: form.email,
      destination: form.destination.charAt(0).toUpperCase() + form.destination.slice(1).toLowerCase(),
      people: peopleVal,
      date: form.date,
      bookingCreatedAt: new Date().toISOString(),
    };
    localStorage.setItem("booking", JSON.stringify(bookingData));
    navigate("/payment");
  }

  return (
    <div>
      <Navbar />
      <div className="booking-page">
        <div className="booking-container">
          <h2>Book Your Trip</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Name" required value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            <input type="email" placeholder="Enter Email" required value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            <input type="text" placeholder="Destination" required value={form.destination}
              onChange={e => setForm(f => ({...f, destination: e.target.value}))} />
            <input type="number" placeholder="Number of People" required min="1" step="1"
              value={form.people} onChange={e => setForm(f => ({...f, people: e.target.value}))} />
            <input type="date" required min={today} value={form.date}
              onChange={e => setForm(f => ({...f, date: e.target.value}))} />

            {weather && (
              <div className="weather-box">
                <h3>🌤 Weather Forecast</h3>
                <p>Temperature: {weather.temp}</p>
                <p>Condition: {weather.condition}</p>
                <p>Humidity: {weather.humidity}</p>
                {weather.source === "seasonal" && <small>Based on seasonal climate data</small>}
              </div>
            )}
            {!weather && form.destination && form.date && (
              <div className="weather-box">Select destination and date to view weather forecast.</div>
            )}

            <button type="submit">Proceed to Payment</button>
          </form>
        </div>
      </div>
    </div>
  );
}
