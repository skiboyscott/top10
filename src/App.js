import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Authentication, ResetPassword } from './pages/authentication';
import { AuthProvider } from './components/authcontext';
import { WeatherProvider } from './components/weathercontext';
import { VoteProvider } from './components/votecontext';

const WebsiteIssues = () => {

    const style = {
        container: {
            textAlign: "center",
            background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
        },
        text: {
            fontSize: '16px',
        }
    }

    return (
        <div style={style.container}>
            <p style={style.text}>We are currently experiencing technical issues receiving information from our backend. We hope to be fully operational soon. We thank you for your patience.</p>
        </div>
    );
}

function App() {
  const webIssues = false

  const style = {
        maxWidth: "375px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.96)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(20px)",
  }

  return (
    <div style={style}>
      <AuthProvider>
        <WeatherProvider>
          <VoteProvider>
            <BrowserRouter basename="/">
              {webIssues && <WebsiteIssues />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authentication" element={<Authentication />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </BrowserRouter>
          </VoteProvider>
        </WeatherProvider>
      </AuthProvider>
    </div>
  );
}

export default App;