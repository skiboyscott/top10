import React, { createContext, useEffect, useState } from 'react';

export const WeatherContext = createContext();
const weatherApiKey = '80d6e7abc10f400ebc713153250406'

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState({})
    const [location, setLocation] = useState('')
    const [fetchError, setFetchError] = useState(false)
    const [accessGranted, setAccessGranted] = useState(false)
    const [loading, setLoading] = useState(false)

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
