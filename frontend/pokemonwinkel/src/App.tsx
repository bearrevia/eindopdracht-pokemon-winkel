import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Webshop from "../pages/webshop";
import Register from "../pages/register";
import Login from "../pages/login";
import Header from "../components/Header";
import "./App.css";

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean | null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check of user al ingelogd is (token in localStorage)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Webshop />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
