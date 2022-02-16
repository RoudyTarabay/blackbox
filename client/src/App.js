import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"
import Signup from './components/Singup';
import Login from './components/Login';
import Videos from './components/Videos';

function App() {
  const [isSignup, setIsSignup] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('blackbox_token'));
  useEffect(() => {
    if (localStorage.getItem('blackbox_token')) {
      setToken(localStorage.getItem('blackbox_token'))
    }
  }, [token])
  return (
    <div className="app-container">
      {
        !token ? (isSignup ?
          <Signup setIsSignup={setIsSignup} />
          :
          <Login setIsSignup={setIsSignup} setToken={setToken} />) :
          <Videos />
      }
    </div>
  );
}

export default App;
