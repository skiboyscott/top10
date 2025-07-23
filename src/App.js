import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { AuthProvider } from './components/authcontext';
import { WeatherProvider } from './components/weathercontext';
import { VoteProvider } from './components/votecontext';
import { ForgotPassword, SignIn, SignUp, ResetPassword } from './pages/authentication';

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

  return (
    <AuthProvider>
      <WeatherProvider>
        <VoteProvider>
          <BrowserRouter basename="/">
            {webIssues && <WebsiteIssues />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </BrowserRouter>
        </VoteProvider>
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;