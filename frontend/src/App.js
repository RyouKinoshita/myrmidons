
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
import Login from './Components/User/Login'
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
        </Routes>
        <Footer />
      </Router>
    </div>
    
  );
}

export default App;
