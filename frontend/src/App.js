import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
function App() {

  return (
   
    <div className="App">
      
        <Header/>
        <Footer/>
    </div>
    
  );
}

export default App;
