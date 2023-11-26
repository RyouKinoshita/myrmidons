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
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ServiceDetails from "./Components/Service/ServiceDetails";
import AboutUs from "./Components/About/AboutUs";
import Portfolio from "./Components/Portfolio/Portfolio";
import TeamPage from "./Components/Team/TeamPage";
import Dashboard from "./Components/Admin/Dashboard";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import MemberList from "./Components/Admin/MemberList";
import NewMember from "./Components/Admin/NewMember";
import UpdateMember from "./Components/Admin/UpdateMember";
import ServicesList from "./Components/Admin/ServicesList";
import NewService from "./Components/Admin/NewService";
import UpdateService from "./Components/Admin/UpdateService";
import UsersList from "./Components/Admin/UsersList";
import UpdateUser from "./Components/Admin/UpdateUser";
import ProjectList from "./Components/Admin/ProjectList";
import NewProject from "./Components/Admin/NewProject";
import UpdateProject from "./Components/Admin/UpdateProject";
import OrdersList from "./Components/Admin/OrdersList";
import UserOrders from "./Components/User/UserOrders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./Components/Cart/Cart";
import Event from "./Components/Cart/Event";
import ConfirmOrder from "./Components/Cart/ConfirmOrder";
import Payment from "./Components/Cart/Payment";
import OrderSuccess from "./Components/Cart/OrderSuccess";
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
    shippingInfo: localStorage.getItem("eventInfo")
      ? JSON.parse(localStorage.getItem("eventInfo"))
      : {},
  });

  const addItemToCart = async (id, selectedDate) => {
    console.log(id, selectedDate);

    const parsedDate = new Date(selectedDate);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1; // Month is zero-indexed, so add 1
    const day = parsedDate.getDate();

    const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
    console.log(formattedDate);

    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/service/${id}`
      );
      const item = {
        service: data.service._id,
        name: data.service.name,
        price: data.service.price,
        image: data.service.images[0].url,
        date: formattedDate,
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
  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter((i) => i.service !== id),
    });
    toast.success("Item Removed in Cart", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  };
  const saveEventInfo = async (data) => {
    setState({
      ...state,
      eventInfo: data,
    });
    localStorage.setItem("eventInfo", JSON.stringify(data));
    console.log(saveEventInfo);
  };
  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/teampage" element={<TeamPage />} />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/orders/me" element={<UserOrders />} exact="true" />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
              />
            }
            exact="true"
          />

          <Route
            path="/event"
            element={
              <Event
                eventInfo={state.eventInfo}
                saveEventInfo={saveEventInfo}
              />
            }
          />
          <Route
            path="/confirm"
            element={
              <ConfirmOrder
                cartItems={state.cartItems}
                eventInfo={state.eventInfo}
              />
            }
          />
          <Route
            path="/payment"
            element={
              <Payment
                cartItems={state.cartItems}
                eventInfo={state.eventInfo}
              />
            }
          />
          <Route path="/success" element={<OrderSuccess />} />
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
          <Route path="/admin/service/new" element={<NewService />} />
          <Route path="/admin/service/:id" element={<UpdateService />} />
          <Route path="/admin/portfolio/new" element={<NewProject />} />
          <Route path="/admin/portfolio/:id" element={<UpdateProject />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/portfolio" element={<ProjectList />} />
          <Route path="/admin/NewMember" element={<NewMember />} />
          <Route path="/admin/UpdateMember/:id" element={<UpdateMember />} />
          <Route path="/admin/MemberList" element={<MemberList />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service"
            element={
              <ProtectedRoute isAdmin={true}>
                <ServicesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProjectList />
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
