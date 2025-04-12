import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaBell, FaChevronDown } from "react-icons/fa";
import user from "./user.png";
import EventEmitter from "../../utils/EventEmitter";
import { Link } from "react-router-dom";
import "./navigation.css"
import axios from "axios";

function TopNavigation() {
  const [username, setUsername ] = useState(localStorage.getItem('username'));
  const [role, setRole ] = useState(localStorage.getItem('role'));
  const [logged, setLogged ] = useState(false);
  const [date, setDate] = useState(new Date());
  const [weather, setWeather] = useState(null);

  const handleSession = () => {
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
    setLogged(true);
  }
  const handleLogout = () => {
    setUsername(null);
    setRole(null);
    setLogged(false);
  }
  useEffect(() => {
    let listner = EventEmitter.addListener('login', handleSession);
    let listner2 = EventEmitter.addListener('logout', handleLogout);

    return () => {
      listner.remove();
      listner2.remove();
    }}, 
  [])
  useEffect(() => {
    const mouseTarget = document.getElementById("menuChevron");
    const menuContainer = document.getElementById("menuContainer");
    mouseTarget.addEventListener("mouseenter", () => {
      mouseTarget.style.transform = "rotate(180deg)";
      menuContainer.style.transform = "translateX(0px)";
    });

    menuContainer.addEventListener("mouseleave", () => {
      mouseTarget.style.transform = "rotate(0deg)";
      menuContainer.style.transform = "translateX(300px)";
    });
  }, []);

  useEffect(() => {
    // Fetch weather data from OpenWeatherMap API
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('district')||'Colombo'}&appid=3ca1b71cf73d793ea485f6d257cedd49`);
        setWeather(response.data);
        console.log(response.data.main)
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather(); // Call the fetchWeather function when the component mounts
  }, []);

  return (
    <div className="topContainer">
      <div className="inputBox">
        <span className="data">{`TODAY: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}</span>
        {weather && (
          <span className="data">{(weather.main.temp - 273.15).toFixed(1)}°C</span>
        )}
        {weather && ( // Check if weather data is available before rendering
          <div className="weather-token">
            <img className="token-img" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} height={45} alt="weather-icon" />
            <span>{weather.weather[0].main}</span>
          </div>
        )}
        {/* <div className="weather-token">
          <img src={process.env.PUBLIC_URL + '/we-icons/clear.png'} height={25} alt="weather-icon"/>
          <span>Sunny</span>
        </div> */}
      </div>

      {username&&<div className="profileContainer">
        <i className="profileIcon">
          <FaBell />
        </i>
        <div className="profileImage">
          <img src={user} alt="" />
          <span className="hint">{username}</span>
        </div>
        {/* <p className="profileName">{username}</p> */}
        <i className="menuChevron" id="menuChevron">
          <FaChevronDown />
        </i>

        <div className="menuContainer" id="menuContainer">
          <ul>
            <li><Link to={'/profile'}>My Profile</Link></li>
            <li>Commitments</li>
            <li>Settings</li>
            {/* <li>Logout</li> */}
          </ul>
        </div>
      </div>}
    </div>
  );
}

export default TopNavigation;