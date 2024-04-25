import "./dashboard.css";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const [city, setCity] = useState();
    const [data, setData] = useState(null);
    const [gmail, setGmail] = useState();
    const [weatherHistory, setWeatherHistory] = useState([]);
    const [displayedForecasts, setDisplayedForecasts] = useState(4);

    useEffect(() => {
        const storedWeatherHistory = localStorage.getItem('weatherHistory');
        if (storedWeatherHistory) {
            setWeatherHistory(JSON.parse(storedWeatherHistory));
        }
    }, []);

    const saveWeatherToHistory = (weatherData) => {
        const updatedHistory = [...weatherHistory, weatherData];
        setWeatherHistory(updatedHistory);
        localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
    };

    const clearWeatherHistory = () => {
        setWeatherHistory([]);
        localStorage.removeItem('weatherHistory');
    };

    const handleSearch = async () => {
        if (!city) {
            alert("Input city is required");
            return;
        }
        console.log(city);
        try {
            const response = await fetch(`http://localhost:5000/api/forecast/${city}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to fetch forecast");
            }

            const jsonData = await response.json();
            setDisplayedForecasts(4);
            setData(jsonData);
            saveWeatherToHistory(jsonData);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw new Error("Failed to fetch forecast");
        }
    };

    const handleLoadMore = () => {
        setDisplayedForecasts(displayedForecasts + 10);
    };

    const isValidEmail = (email) => {
        // Regex pattern for email validation
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const handleSubmit = async () => {
        if (isValidEmail(gmail)) {
            const isConfirmed = await checkEmailConfirmed();
            const isSubscribed = await checkEmailSubscribed();

            if (isConfirmed && isSubscribed) {
                alert("This email is already confirmed and subscribed");
            }
            else if (!isConfirmed && !isSubscribed) {
                sendConfirmationEmail();
                alert("A confirm email has been sent");
            }
            else if (isConfirmed && !isSubscribed) {
                if (window.confirm("This email is already confirmed but has been unsubscribed. Do you want to send a confirmation email again?")) {
                    sendConfirmationEmail();
                    alert("A confirmation email has been sent");
                }
            }
            else {
                alert("Please enter a valid email");
            }
        };
    }

    const checkEmailConfirmed = async () => {
        const form = {
            email: gmail,
        };
        try {
            const response = await fetch('http://localhost:5000/api/checkConfirmed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });


            if (!response.ok) {
                console.log('Failed to fetch')
            }

            const responseStatus = parseInt(response.status);
            if (responseStatus === 200) { return true; }
            else if (responseStatus === 201) { return false; };
        } catch (error) {
            alert('An error happend when checking email ', error.message);
        }
    }

    const checkEmailSubscribed = async () => {
        const form = {
            email: gmail,
        };
        try {
            const response = await fetch('http://localhost:5000/api/checkSubscribed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });


            if (!response.ok) {
                console.log('Failed to fetch')
            }

            const responseStatus = parseInt(response.status);
            if (responseStatus === 200) { return true; }
            else if (responseStatus === 201) { return false; };
        } catch (error) {
            alert('An error happend when checking email ', error.message);
        }
    }

    const sendConfirmationEmail = async () => {
        const form = {
            email: gmail,
        };

        try {
            const response = await fetch('http://localhost:5000/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Failed to send confirmation email');
            }

            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            alert('An error happend when sending email ', error.message);
        }
    };

    const handleUnsubscribe = async () => {
        if (isValidEmail(gmail)) {
            const isSubscribed = await checkEmailSubscribed();

            const form = {
                email: gmail,
            };

            if (isSubscribed) {
                try {
                    const response = await fetch('http://localhost:5000/api/unsubscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(form)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to unsubscribe');
                    }

                    const responseData = await response.json();
                    alert(responseData.message);
                } catch (error) {
                    alert('An error happend when unsubscribing', error.message);
                }
            }
            else {
                alert('Email is not subscribed');
            }
        }
        else {
            alert("Please enter a valid email");
        }
    };

    console.log(data);

    return (
        <div>
            <h1>Weather Dashboard</h1>
            <div className="container">
                <div className="weather-input">
                    <h3>Enter a City Name</h3>
                    <input className="city-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="E.g., New York, London, Tokyo" />
                    <button className="search-btn" onClick={handleSearch}>Search</button>
                    <div className="margin"></div>

                    <h3>Subscribe to receive daily weather forecast</h3>
                    <input className="email-input" type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} placeholder="E.g., youremailhere@gmail.com" />
                    <button className="subcribe-btn" onClick={handleSubmit}>Register</button>
                    <button className="unsubscribe-btn" onClick={handleUnsubscribe}>Unsubscribe</button>
                </div>
                {
                    data ? (
                        <div className="weather-data">
                            <div className="current-weather">
                                <div className="details">
                                    <h2>{data.location.name} ( {data.location.localtime} )</h2>
                                    <h6>Temperature: {data.current.temp_c}°C</h6>
                                    <h6>Wind: {data.current.wind_mph} M/S</h6>
                                    <h6>Humidity: {data.current.humidity} %</h6>
                                </div>
                                <div className="icon">
                                    <img src={data.current.condition.icon} alt="icon" />
                                </div>
                            </div>

                            <div className="days-forecast">
                                <h2>{displayedForecasts}-Days Forecast</h2>
                                <ul className="weather-cards">
                                    {
                                        data.forecast.forecastday.slice(0, displayedForecasts).map((item, index) => (
                                            <li className="card" key={index}>
                                                <h3>( {item.date} )</h3>
                                                <div className="icon">
                                                    <img src={item.day.condition.icon} alt="icon" />
                                                </div>
                                                <h6>Temp: {item.day.avgtemp_c} C</h6>
                                                <h6>Wind: {item.day.maxwind_mph} M/S</h6>
                                                <h6>Humidity: {item.day.avghumidity}%</h6>
                                            </li>
                                        ))
                                    }
                                </ul>
                                {displayedForecasts < 14 && (
                                    <button onClick={handleLoadMore} className="load-btn">Load More</button>
                                )}
                            </div>
                            {
                                weatherHistory.length !== 0 ? (<ul>
                                    <h2>History</h2>
                                    {weatherHistory.map((weather, index) => (
                                        <div key={index} className="history-card">
                                            <div className="weather-data">
                                                <div className="current-weather">
                                                    <div className="details">
                                                        <h2>{weather.location.name} ( {weather.location.localtime} )</h2>
                                                        <h6>Temperature: {weather.current.temp_c}°C</h6>
                                                        <h6>Wind: {weather.current.wind_mph} M/S</h6>
                                                        <h6>Humidity: {weather.current.humidity} %</h6>
                                                    </div>
                                                    <div className="icon">
                                                        <img src={weather.current.condition.icon} alt="icon" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="load-btn" onClick={clearWeatherHistory}>Clear History</button>
                                </ul>
                                ) : null
                            }
                        </div>

                    ) :
                        (
                            <div className="weather-data">
                                <div className="current-weather">
                                    <div className="details">
                                        <h2>_______ ( ______ )</h2>
                                        <h6>Temperature: __°C</h6>
                                        <h6>Wind: __ M/S</h6>
                                        <h6>Humidity: __%</h6>
                                    </div>
                                </div>
                                <div className="days-forecast">
                                    <h2>4-Days Forecast</h2>
                                    <ul className="weather-cards">
                                        <li className="card">
                                            <h3>( ______ )</h3>
                                            <h6>Temp: __C</h6>
                                            <h6>Wind: __ M/S</h6>
                                            <h6>Humidity: __%</h6>
                                        </li>
                                        <li className="card">
                                            <h3>( ______ )</h3>
                                            <h6>Temp: __C</h6>
                                            <h6>Wind: __ M/S</h6>
                                            <h6>Humidity: __%</h6>
                                        </li>
                                        <li className="card">
                                            <h3>( ______ )</h3>
                                            <h6>Temp: __C</h6>
                                            <h6>Wind: __ M/S</h6>
                                            <h6>Humidity: __%</h6>
                                        </li>
                                        <li className="card">
                                            <h3>( ______ )</h3>
                                            <h6>Temp: __C</h6>
                                            <h6>Wind: __ M/S</h6>
                                            <h6>Humidity: __%</h6>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                }
            </div>
        </div>)
};

export default Dashboard;