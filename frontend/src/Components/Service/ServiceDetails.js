import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MetaData from "../Layout/Metadata";
import { getUser, getToken, successMsg, errMsg } from "../../utils/helpers";

// import { useAlert} from '@blaumaus/react-alert'
import axios from "axios";
// import service from '../../../../backend/models/service'

const ServiceDetails = ({ addItemToCart, cartItems }) => {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [success, setSuccess] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);

  let { id } = useParams();
  // const alert = useAlert();

  const serviceDetails = async (id) => {
    let link = `http://localhost:4001/api/v1/service/${id}`;
    console.log(link);
    let res = await axios.get(link);
    console.log(res);
    if (!res) setError("Service not found");
    setService(res.data.service);
    const allDates = res.data.order.flatMap((orderItem) =>
      orderItem.orderItems.map((item) => item.date)
    );
    const uniqueDates = [...new Set(allDates)];
    setDisabledDates(uniqueDates);
    setLoading(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  let navigate = useNavigate();
  const addToCart = async () => {
    if (selectedDate) {
      // Pass both service ID, quantity, and date to the addItemToCart function
      await addItemToCart(id, selectedDate);
      navigate("/");
      // Reset the selected date after adding to cart
      setSelectedDate(null);
    } else {
      // Handle case when date is not selected
      setError("Please select a date before adding to cart.");
    }
  };

  const filterDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Convert date to string in 'YYYY-MM-DD' format
    const formattedDateLocal = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    // Check if the date is in the list of disabled dates (orderItemIds)
    return !disabledDates.includes(formattedDateLocal);
  };
  useEffect(() => {
    serviceDetails(id);
  }, [id, error, success]);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  return (
    <Fragment>
      <div
        className="container"
        style={{ backgroundColor: "gray", width: "1500px", height: "auto" }}
      >
        <Fragment>
          <div className="container mt-5">
            <div className="row d-flex justify-content-around align-items-center">
              <div className="col-12 col-lg-5">
                <Card
                  style={{
                    backgroundColor: "#DCDCDC",
                    border: "solid 3px black",
                    
                  }}
                >
                  <Card.Body>
                    <Carousel pause="hover" >
                      {service.images &&
                        service.images.map((image) => (
                          <Carousel.Item
                            key={image.public_id}
                            style={{ marginLeft: "15px", color:"black" }}
                          >
                            <img
                              className="d-block w-100"
                              src={image.url}
                              alt={service.title}
                            />
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  </Card.Body>
                </Card>
              </div>

              <div className="col-12 col-lg-5 mt-5">
                <Card
                  style={{
                    backgroundColor: "#DCDCDC",
                    border: "solid 3px black",
                    marginBottom:"40px"
                  }}
                >
                  <Card.Body>
                    <h3
                      style={{
                        fontSize: "36px",
                        color: "black",
                        // textDecoration: "underline",
                        textAlign: "center",
                        marginLeft: "10px",
                      }}
                    >
                      {service.name}
                    </h3>
                    <p
                      id="product_id"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "5px",
                      }}
                    >
                      Service # {service._id}
                    </p>

                    <hr />

                    <hr />

                    <p
                      id="product_price"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "5px",
                      }}
                    >
                      ${service.price}
                    </p>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "2px",
                        fontSize: "18px",
                      }}
                    >
                      Please Select a Date{" "}
                    </h3>
                    <div style={{ textAlign: "center" }}>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        filterDate={filterDate}
                        placeholderText="Select a date"
                      />
                    </div>
                    <button
                      type="button"
                      id="loginbuts"
                      className="buttonforLogin"
                      onClick={addToCart}
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "130px",
                        marginTop: "20px",
                        border: "solid 2px black",
                        
                      }}
                    >
                      Add to Cart
                    </button>

                    <h4
                      className="mt-2"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "2px",
                        fontSize: "18px",
                      }}
                    >
                      Description:
                    </h4>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "black",
                        textAlign: "center",
                        marginLeft: "2px",
                        fontSize: "14px",
                      }}
                    >
                      {service.description}
                    </p>
                    <hr />
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </Fragment>
      </div>
    </Fragment>
  );
};
export default ServiceDetails;
