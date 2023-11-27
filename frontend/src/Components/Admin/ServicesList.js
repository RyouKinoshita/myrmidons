import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../Layout/Metadata";
import Loader from "../Layout/Loader";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  //   const [users, setUsers] = useState([]);
  //   const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  let navigate = useNavigate();
  const getAdminServices = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/service`,
        config
      );
      console.log(data);
      setServices(data.services);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    getAdminServices();

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (deleteError) {
      toast.error(deleteError, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (isDeleted) {
      toast.success("Service deleted successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/admin/service");
    }
  }, [error, deleteError, isDeleted]);

  const deleteService = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.delete(
        `http://localhost:4001/api/v1/admin/service/${id}`,
        config
      );

      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const servicesList = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Description",
          field: "description",
          sort: "asc",
        },
        {
          label: "Ratings",
          field: "ratings",
          sort: "asc",
        },
        {
          label: "Category",
          field: "category",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    services.forEach((service) => {
      data.rows.push({
        id: service._id,
        name: service.name,
        price: `$${service.price}`,
        description: service.description,
        ratings: service.ratings,
        category: service.category,
        actions: (
          <Fragment>
            <div className="button-container">
              <Link
                to={`/admin/service/${service._id}`}
                className="btn btn-primary py-1 px-2"
                title="Edit Service"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-danger py-1 px-2 ml-2"
                title="Delete Service"
                onClick={() => deleteServiceHandler(service._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteServiceHandler = (id) => {
    deleteService(id);
  };

  return (
    <Fragment>
      <MetaData title={"All Services"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1
              className="my-5"
              style={{ color: "white", fontWeight: "bold", marginLeft: "15px" }}
            >
              All Services
            </h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={servicesList()}
                className="px-3"
                bordered
                striped
                hover
                style={{ color: "white", fontWeight: "bold" }}
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ServicesList;
