import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './authcontext';
import tzLookup from 'tz-lookup';
import { DateTime } from 'luxon';

export const WeatherContext = createContext();
const weatherApiKey = process.env.REACT_APP_WEATHER_APP_API;

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState({})
    const [location, setLocation] = useState('')
    const [fetchError, setFetchError] = useState(false)
    const [accessGranted, setAccessGranted] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setLocationDate} = useContext(AuthContext)

    const loadWeatherData = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setAccessGranted(true)
                setLoading(true)

                try {
                    const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}&aqi=no`
                    );

                    if (!response.ok) {
                    throw new Error(`Weather API error: ${response.status}`);
                    }

                    const data = await response.json();

                    const currentWeatherData = {
                        location: `${data.location.name}, ${data.location.region}`,
                        temperature: Math.round(data.current.temp_f),
                        conditions: data.current.condition.text,
                        humidity: data.current.humidity,
                        windSpeed: Math.round(data.current.wind_mph),
                        uvIndex: data.current.uv,
                        feelsLike: Math.round(data.current.feelslike_f),
                        pressure: Math.round(data.current.pressure_in * 100) / 100,
                        visibility: Math.round(data.current.vis_miles),
                        timestamp: new Date().toISOString(),
                        isManualEntry: false
                    };

                    setLocation(`${data.location.name}, ${data.location.region}`);
                    setWeatherData(currentWeatherData);
                } catch (error) {
                    setFetchError(true)
                }
            },
            (error) => {
            }
        );
    };

    useEffect(() => {
        const fetchTimeForLocation = async () => {
            if (!location) return;

            try {
                // Step 1: Get coordinates of the location
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
                const results = await response.json();

                if (!results.length) {
                    console.warn('No location results found');
                    return;
                }

                const { lat, lon } = results[0];

                // Step 2: Get the timezone
                const timezone = tzLookup(lat, lon);

                // Step 3: Get the current date in that timezone
                const localDate = DateTime.now().setZone(timezone).toFormat('yyyy-MM-dd');
                setLocationDate(localDate);
            } catch (error) {
                console.error('Error getting location time:', error);
            }
        };

        fetchTimeForLocation();
    }, [location]);

    useEffect(() => {
        if (weatherData) {
            setLoading(false)
        }
    }, [weatherData])

    useEffect(() => {
        loadWeatherData()
    }, [])

    return (
        <WeatherContext.Provider
        value={{
            weatherData,
            location,
            fetchError,
            accessGranted,
            loading
        }}
        >
        {children}
        </WeatherContext.Provider>
    );
};
