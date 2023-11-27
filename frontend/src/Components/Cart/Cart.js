import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import { useParams, useNavigate } from "react-router-dom";

const Cart = ({ cartItems, removeItemFromCart }) => {
  const navigate = useNavigate();

  const removeCartItemHandler = (id) => {
    removeItemFromCart(id);
  };
  const checkoutHandler = () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));

    if (userDetails) {
      // User is authenticated, proceed with checkout
      navigate("/event");
    } else {
      // User is not authenticated, redirect to login
      navigate("/login?redirect=event");
    }
  };

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  return (
    <Fragment>
      <MetaData title={"Your Cart"} />
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is Empty</h2>
      ) : (
        <Fragment>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8" style={{backgroundColor:"#DCDCDC"}}>
              {cartItems.map((item) => (
                <Fragment >
                  <hr />

                  <div className="cart-item" key={item.service} >
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt="Laptop"
                          height="90"
                          width="150"
                          style={{border:"solid 2px black"}}
                        />
                      </div>

                      <div className="col-5 col-lg-3" >
                        <Link to={`/service/${item.service}`} style={{color:"black"}}>{item.name}</Link>
                      </div>
                      <div className="col-5 col-lg-3">
                        <p style={{color:"black"}}>{item.date}</p>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price" style={{color:"black"}}>${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() => removeCartItemHandler(item.service)}
                        ></i>
                        {/* <i id="delete_cart_item" className="fa fa-trash btn btn-danger" ></i> */}
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
            </div>

            <div className="col-12 col-lg-4 my-0" >
              <div id="order_summary" style={{backgroundColor:"#DCDCDC", marginRight:"20px", justifyContent:"center"}}>
                <h4 style={{color:"black"}}>Order Summary</h4>
                <hr />

                <p style={{color:"black"}}>
                  Est. total:{" "}
                  <span className="order-summary-values">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.price, 0)
                      .toFixed(2)}
                  </span>
                </p>

                <hr />
                <button
                  id="loginbuts"
                  className="buttonforLogin" style={{width:"330px",fontWeight:"bold",alignItems: "center", marginLeft:"130px"}}
                  onClick={checkoutHandler}
                  
                >
                  Check out
                </button>
                {/*<button id="checkout_btn" className="btn btn-primary btn-block" >Check out</button>*/}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
