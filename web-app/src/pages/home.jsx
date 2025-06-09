import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/authcontext";
import { WeatherContext } from "../components/weathercontext";

const Header = () => {
    const {location} = useContext(WeatherContext)

    const style = {
        header: {
            textAlign: "center",
            marginBottom: "24px",
        },
        logo: {
            fontSize: "52px",
            marginBottom: "12px",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
        },
        subtitle: {
            color: '#4a5568',
            fontSize: '16px',
        }
    }

    return (
        <div style={style.header}>
            <div style={style.logo}>🌤️</div>
            <h1>Top 10 Weather Day {location ? ` in ${location}` : ''}</h1>
            <p style={style.subtitle}>Weather crowdsourcing<br />Help us identify the most beautiful days!</p>
        </div>
    );
};

const UserWelcome = () => {
    const {loggedIn, userName, signOut} = useContext(AuthContext)

    const style = {
        container: {
            textAlign: "center",
            background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
        },
        title: {
            marginBottom: "4px",
        },
        button: {
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            marginTop: "8px",
        },
    };

    return (
        <div style={style.container}>
            {loggedIn ?
                <div> 
                    <h3 style={style.title}>
                        Welcome back, {userName}! 👋
                    </h3>
                    <p>Ready to vote on today's weather?</p>
                        <button style={style.button} onClick={signOut}>
                            Logout
                        </button>
                </div>
            :
                <div> 
                    <h3 style={style.title}>
                        Welcome!
                    </h3>
                    <p>Ready to vote on today's weather?</p>
                    <button style={style.button}>
                        <Link to={'/authentication'}>Sign In to Vote</Link>    
                    </button>
                </div>
            }
        </div>
    );
};

const WeatherCard = () => {
    const {weatherData, location, fetchError, accessGranted} = useContext(WeatherContext)

    const style = {
        weatherCard: {
            background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
            borderRadius: "20px",
            padding: "28px",
            margin: "24px 0",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(66, 153, 225, 0.3)",
        },
        weatherContent: {
            position: "relative",
            zIndex: 1,
        },
        loading: {
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.9)",
            fontStyle: "italic",
            fontSize: "16px",
            fontWeight: 500,
        },
        location: {
            fontSize: 16,
            marginBottom: 8,
            opacity: 0.95,
            fontWeight: 500,
        },
        temperature: {
            fontSize: 56,
            fontWeight: 200,
            margin: '12px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        conditions: {
            fontSize: 20,
            marginBottom: 20,
            fontWeight: 500,
        },
        weatherDetails: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginTop: 20,
        },
        detailCard: {
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 14,
            borderRadius: 12,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
        },
        detailLabel: {
            fontSize: 12,
            opacity: 0.85,
            marginBottom: 6,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        detailValue: {
            fontSize: 18,
            fontWeight: 600,
            },
    };

    return (
        <div style={style.weatherCard}>
            {location && !fetchError && accessGranted ? (
                <div style={style.weatherContent}>
                    <div style={style.location}>{weatherData.location}</div>
                    <div style={style.temperature}>{weatherData.temperature}°F</div>
                    <div style={style.conditions}>{weatherData.conditions}</div>
                    <div style={style.weatherDetails}>
                        <div style={style.detailCard}>
                            <div style={style.detailLabel}>Feels Like</div>
                            <div style={style.detailValue}>{weatherData.feelsLike}°F</div>
                        </div>
                        <div style={style.detailCard}>
                            <div style={style.detailLabel}>Humidity</div>
                            <div style={style.detailValue}>{weatherData.humidity}%</div>
                        </div>
                        <div style={style.detailCard}>
                            <div style={style.detailLabel}>Wind</div>
                            <div style={style.detailValue}>{weatherData.windSpeed} mph</div>
                        </div>
                        <div style={style.detailCard}>
                            <div style={style.detailLabel}>UV Index</div>
                            <div style={style.detailValue}>{weatherData.uvIndex}</div>
                        </div>
                    </div>
                </div>
            ) : fetchError && accessGranted ? (
                <div style={style.weatherContent}>
                    <p style={style.loading}>There was a problem fetching weather data. Try again later.</p>
                </div>
            ) : !accessGranted ? (
                <div style={style.weatherContent}>
                    <p style={style.loading}>Please enable location access in your browser and reload the page.</p>
                </div>
            ) : null}
        </div>
    );
};

const ManualInput = () => {
    const [temp, setTemp] = useState('')
    const [tempFeel, setTempFeel] = useState('')
    const [condition, setCondition] = useState('')
    const [humidity, setHumidity] = useState('')
    const [windSpeed, setWindSpeed] = useState('')

    const style = {
        manualInput: {
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "20px",
            margin: "20px 0",
            border: "2px solid #e2e8f0",
            display: "none", // Change to 'block' if you want it visible by default
        },
        heading: {
            color: "#2d3748",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "18px",
        },
        inputGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
        },
        inputGroup: {
            display: "flex",
            flexDirection: "column",
        },
        fullWidth: {
            gridColumn: "1 / -1",
        },
        select: {
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            background: "white",
            transition: "border-color 0.2s",
        },
        input: {
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            background: "white",
            transition: "border-color 0.2s",
        },
        submitBtn: {
            width: "100%",
            background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
        },
    };

    const conditionChange = (e) => {
        setCondition(e.target.value);
    };

    const handleManualSubmit = () => {
        console.log("Manual weather data submitted!", temp, tempFeel, condition, humidity, windSpeed);
        // Replace this with your actual logic
    };

    return (
        <div style={style.manualInput}>
            <h3 style={style.heading}>⚡ Enter Current Weather Conditions</h3>
            <div style={style.inputGrid}>
                <div style={style.inputGroup}>
                    <label>Temperature (°F)</label>
                    <input style={style.input} type="number" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="72" min="-50" max="120" />
                </div>
                <div style={style.inputGroup}>
                    <label>Feels Like (°F)</label>
                    <input style={style.input} type="number" value={tempFeel} onChange={(e) => setTempFeel(e.target.value)} placeholder="75" min="-50" max="120" />
                </div>
                <div style={{ ...style.inputGroup, ...style.fullWidth }}>
                    <label>Weather Conditions</label>
                    <select style={style.select} value={condition} onChange={conditionChange}>
                        <option value="">Select conditions...</option>
                        <option value="Sunny">Sunny</option>
                        <option value="Partly Cloudy">Partly Cloudy</option>
                        <option value="Cloudy">Cloudy</option>
                        <option value="Light Rain">Light Rain</option>
                        <option value="Rain">Rain</option>
                        <option value="Thunderstorms">Thunderstorms</option>
                        <option value="Snow">Snow</option>
                        <option value="Fog">Fog</option>
                        <option value="Windy">Windy</option>
                    </select>
                </div>
                <div style={style.inputGroup}>
                <label>Humidity (%)</label>
                <input style={style.input} type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="55" min="0" max="100" />
                </div>
                <div style={style.inputGroup}>
                <label>Wind Speed (mph)</label>
                <input style={style.input} type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} placeholder="7" min="0" max="200" />
                </div>
            </div>
            <button style={style.submitBtn} onClick={handleManualSubmit}>
                Use This Weather Data
            </button>
        </div>
    );
};

const VotingSection = () => {
    const {loggedIn, votedToday, submitVote} = useContext(AuthContext)
    const {location, weatherData} = useContext(WeatherContext)

    const vote = (top10) => {
        submitVote(top10, weatherData)
    }

    const style = {
        questionSection: {
            textAlign: 'center',
            margin: '32px 0 24px',
            padding: '20px',
            background: 'rgba(247, 250, 252, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.5)',
        },
        questionHeading: {
            color: '#2d3748',
            fontSize: '22px',
            marginBottom: '12px',
            fontWeight: 700,
        },
        questionText: {
            color: '#4a5568',
            fontSize: '15px',
            lineHeight: 1.5,
            fontWeight: 500,
        },
        voteButtons: {
            display: 'flex',
            gap: '16px',
            margin: '28px 0',
        },
        voteBtn: {
            flex: 1,
            padding: '20px 16px',
            border: 'none',
            borderRadius: '16px',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        voteBtnHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
        },
        voteBtnActive: {
            transform: 'translateY(-1px)',
        },
        voteBtnDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
        },
        yesBtn: {
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(72, 187, 120, 0.3)',
        },
        noBtn: {
            background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(237, 137, 54, 0.3)',
        },
        feedback: {
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            borderRadius: '16px',
            padding: '24px',
            margin: '24px 0',
            textAlign: 'center',
            borderLeft: '4px solid #48bb78',
            display: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        feedbackShow: {
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        feedbackError: {
            borderLeftColor: '#e53e3e',
            background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
        },
        goToSignIn: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40px'
        }
    };

    return(
        <div>
            <div style={style.questionSection}>
                <h2>Is today a "Top 10" weather day?</h2>
                <p>Would you consider today's weather to be one of the 10 best days of the year{location ? ` in ${location}` : ''}?</p>
            </div>
            {loggedIn ?
                votedToday ?
                    <div style={style.questionSection}>
                        <h1>Thank you for voting today! Come back tomorrow to vote again!</h1>
                    </div>
                :
                    <div style={style.voteButtons}>
                        <button style={{...style.voteBtn, ...style.yesBtn}} onClick={() => vote(true)}>
                            👍 Yes!
                        </button>
                        <button style={{...style.voteBtn, ...style.noBtn}} onClick={() => vote(false)}>
                            👎 Not quite
                        </button>
                    </div>
            : null
            }
            <div style={style.feedback}>
                <h3>Thank you!</h3>
                <p>Your response helps us understand what makes a perfect weather day{location ? ` in ${location}` : ''}.</p>
            </div>
        </div>
    )
};

const StatSection = () => {
    const {todaysVotesData} = useContext(AuthContext)

    const style = {
        statsSection: {
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            borderRadius: '18px',
            padding: '24px',
            marginTop: '28px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        statsHeader: {
            color: '#2d3748',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 700,
        },
        statItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            padding: '12px 0',
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        },
        statItemLast: {
            borderBottom: 'none',
            marginBottom: '0',
        },
        statLabel: {
            color: '#4a5568',
            fontWeight: 600,
            fontSize: '15px',
        },
        statValue: {
            color: '#2d3748',
            fontWeight: 700,
            fontSize: '18px',
            background: 'linear-gradient(135deg, #4299e1, #3182ce)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },
    };

    return(
        <div style={style.statsSection}>
            <h3 style={style.statsHeader}>📊 Today's Community Votes</h3>
            <div style={style.statItem}>
                <span style={style.statLabel}>🌟 Top 10 Day Votes</span>
                <span style={style.statValue}>{todaysVotesData.yesVotes != null ? todaysVotesData.yesVotes : 0}</span>
            </div>
            <div style={style.statItem}>
                <span style={style.statLabel}>😐 Regular Day Votes</span>
                <span style={style.statValue}>{todaysVotesData.noVotes != null ? todaysVotesData.noVotes : 0}</span>
            </div>
            <div style={{ ...style.statItem, ...style.statItemLast }}>
                <span style={style.statLabel}>📈 Total Responses</span>
                <span style={style.statValue}>{todaysVotesData.totalVotes != null ? todaysVotesData.totalVotes : 0}</span>
            </div>
        </div>
    )
};

const MainContent = () => {

    return(
        <div>
            <UserWelcome />
            <WeatherCard />
            <ManualInput />
            <VotingSection />
            <StatSection />
        </div>
    )
};

export const Home = () => {

    return(
        <div>
            <Header />
            <MainContent />
        </div>
    )
}
