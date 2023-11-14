
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
import Login from './Components/User/Login'
import Register from './Components/User/Register';
import Profile from './Components/User/Profile'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
function App() {

  return (
   
    <div className="App">
      
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
        </Routes>
        <Footer />
      </Router>
    </div>
    
  );
}

export default App;
