import './App.css'
import WelcomeContainer from './assets/Components/welcomeContainer'
import SignInContainer from './assets/Components/signInContainer'
import DarkModeBtn from './assets/Components/DarkModeBtn'
import { useEffect, useState } from 'react'
import apiClient from './assets/api/apiClient'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import UserProfile from './assets/Components/UserProfile'
import Register from './assets/Components/Register'
import PreviewWebsite from './assets/Components/pages/PreviewWebsite'
import { Navigate } from 'react-router-dom';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await apiClient.get("User/me");
          setUser(response.data.data);
        } catch (err) {
          setError("Failed to fetch user data");
          localStorage.removeItem("token");
        }
      }
    };
    fetchUser();
  }, []);

  function toggle() {
    setIsDarkMode(prev => !prev)
  }

  return (
    <Router>
      <div className={`container ${isDarkMode ? 'dark' : ''}`}>
        <DarkModeBtn toggle={toggle} isDarkMode={isDarkMode} />
        <Routes>
          <Route path='/'
            element={
              <div className="big-container">
                <WelcomeContainer />
                <SignInContainer setUser={setUser} />
              </div> }>
          </Route>
          
          <Route path="/property/:id" element={<PreviewWebsite user={user} />} />
          <Route path="/home/*" element={<UserProfile user={user} />} />
          <Route path="/Register" element={<Register />} /> 
        </Routes>
      </div>
    </Router>

  )
}

export default App
