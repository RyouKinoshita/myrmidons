import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../utils/helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  cardNumber: yup.number().required("Card Number is required"),
  date: yup.date().required("Date is required"),
  cvc: yup.number().required("CVC is required"),
});

const Payment = ({ cartItems, eventInfo }) => {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  const order = {
    orderItems: cartItems,
    eventInfo,
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.date = orderInfo.date;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const createOrder = async (order) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:4001/api/v1/order/new`,
        order,
        config
      );
      // setIsUpdated(data.success)
      setLoading(false);

      toast.success("Service has been Availed. Please wait for Confirmation.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      navigate("/success");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const submitHandler = async (data) => {
    document.querySelector("#pay_btn").disabled = true;
    order.paymentInfo = {
      id: "pi_1DpdYh2eZvKYlo2CYIynhU32",
      status: "succeeded",
    };
    createOrder(order);
    navigate("/success");
  };

  return (
    <Fragment>
      <MetaData title={"Payment"} />
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={handleSubmit(submitHandler)}
            style={{ border: "solid 4px white" }}
          >
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <input
                type="text"
                id="card_num_field"
                className={`form-control ${
                  errors.cardNumber ? "is-invalid" : ""
                }`}
                {...register("cardNumber")}
              />
              {errors.cardNumber && (
                <p className="invalid-feedback d-block">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date_field">Date</label>
              <input
                type="date"
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                id="card_exp_field"
                {...register("date")}
              />
              {errors.date && (
                <p className="invalid-feedback d-block">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <input
                type="text"
                id="card_cvc_field"
                className={`form-control ${errors.cvc ? "is-invalid" : ""}`}
                {...register("cvc")}
              />
              {errors.cvc && (
                <p className="invalid-feedback d-block">{errors.cvc.message}</p>
              )}
            </div>
            <button id="pay_btn" type="submit" className="buttonforLogin">
              Pay {` - ${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
