import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import Home from "./Components/Home";
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import Profile from "./Components/User/Profile";
import NewPassword from "./Components/User/NewPassword";
import ForgotPassword from "./Components/User/ForgotPassword";
// import TeamPortfolio from './Components/TeamPortfolio';
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ServiceDetails from "./Components/Service/ServiceDetails";
import AboutUs from "./Components/About/AboutUs";
import Portfolio from "./Components/Portfolio/Portfolio";
import Dashboard from "./Components/Admin/Dashboard";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function App() {

  const App = () => {
    return (
      <div className="app">
        <h1>Image Gallery</h1>
        <Portfolio />
      </div>
    );
  };

  const [state, setState] = useState({
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  });
<<<<<<< HEAD

  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity);
=======
  const addItemToCart = async (id,selectedDate) => {
    console.log(id,selectedDate);
  const parsedDate = new Date(selectedDate);
>>>>>>> 2d14254e9c452295c443f6abf9a3863443823275
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/service/${id}`
      );
      const item = {
        service: data.service._id,
        name: data.service.name,
        price: data.service.price,
        image: data.service.images[0].url,
        date: parsedDate,
        
      };

      const isItemExist = state.cartItems.find(
        (i) => i.service === item.service
      );
      console.log(isItemExist, state);
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item]
      // })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.service === isItemExist.service ? item : i
          ),
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item],
        });
      }

      toast.success("Item Added to Cart", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
      // navigate('/')
    }
  };

  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/about" element={<AboutUs />} />
<<<<<<< HEAD
          <Route path="/portfolio" element={<Portfolio />}/>
=======
          {/* <Route path="/members" element={<TeamPortfolio />} /> */}
>>>>>>> 2d14254e9c452295c443f6abf9a3863443823275
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route
            path="/password/forgot"
            element={<ForgotPassword />}
            exact="true"
          />
          <Route
            path="/password/reset/:token"
            element={<NewPassword />}
            exact="true"
          />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route
            path="/service/:id"
            element={
              <ServiceDetails
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
              />
            }
            exact="true"
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
