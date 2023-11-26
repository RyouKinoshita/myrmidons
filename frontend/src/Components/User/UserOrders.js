import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import MetaData from "../Layout/Metadata";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../utils/helpers";
import axios from "axios";

const OrdersList = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  const listOrders = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/orders/me`,
        config
      );
      console.log(data); // Add this line to log the data

      setAllOrders(data.orders);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    listOrders();
    if (error) {
      errMsg(error);
      setError("");
    }
  }, [error, isDeleted]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Event Services",
          field: "eventService",
          sort: "asc",
        },
        {
          label: "No of Items",
          field: "numofItems",
          sort: "asc",
        },
        {
          label: "Event Address",
          field: "eventaddress",
          sort: "asc",
        },
        {
          label: "Event City",
          field: "eventcity",
          sort: "asc",
        },
        {
          label: "Event Country",
          field: "eventcountry",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
      ],
      rows: [],
    };

    allOrders.forEach((order) => {
      data.rows.push({
        id: order._id,
        eventService: order.orderItems
          .map((service) => service.name)
          .join(", "),
        numofItems: order.orderItems.length,
        eventaddress: order.eventInfo.address,
        eventcity: order.eventInfo.city,
        eventcountry: order.eventInfo.country,
        amount: `$${order.totalPrice}`,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes("Finished") ? (
            <p style={{ color: "green" }}>{order.orderStatus}</p>
          ) : order.orderStatus &&
            String(order.orderStatus).includes("Confirmed") ? (
            <p style={{ color: "blue" }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: "red" }}>{order.orderStatus}</p>
          ),
      });
    });
    return data;
  };
  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <div className="row">
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">My Orders</h1>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default OrdersList;
