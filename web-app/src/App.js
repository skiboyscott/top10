import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Authentication } from './pages/authentication';
import { AuthProvider } from './components/authcontext';
import { WeatherProvider } from './components/weathercontext';


function App() {

  const style = {
        maxWidth: "420px",
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
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/authentication" element={<Authentication />} />
            </Routes>
          </BrowserRouter>
        </WeatherProvider>
      </AuthProvider>
    </div>
  );
}

export default App;