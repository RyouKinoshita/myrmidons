import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errMsg, successMsg } from "../../utils/helpers";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from "../Layout/Loader";

const UpdateUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    role: Yup.string().oneOf(["user", "admin"]).required("Role is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const getUserDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/user/${id}`,
        config
      );
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/user/${id}`,
        userData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user && user._id !== id) {
      getUserDetails(id);
    } else {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
    }
    if (error) {
      errMsg(error);
      setError("");
    }
    if (isUpdated) {
      successMsg("User updated successfully");
      navigate("/admin/users");
    }
  }, [error, isUpdated, id, user, setValue]);

  const submitHandler = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      role: data.role,
    };
    updateUser(user._id, userData);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Update User`} />
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <div className="row wrapper">
                <div className="col-10 col-lg-5">
                  <form
                    className="shadow-lg"
                    onSubmit={handleSubmit(submitHandler)}
                    style={{ border: "solid 4px white" }}
                  >
                    <h1 className="mt-2 mb-5">Update User</h1>
                    <div className="form-group">
                      <label htmlFor="name_field">Name</label>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            id="name_field"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                          />
                        )}
                      />
                      {errors.name && (
                        <p className="invalid-feedback">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email_field">Email</label>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            id="email_field"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="invalid-feedback">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="role_field">Role</label>
                      <Controller
                        name="role"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <select
                            {...field}
                            id="role_field"
                            className={`form-control ${
                              errors.role ? "is-invalid" : ""
                            }`}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      />
                      {errors.role && (
                        <p className="invalid-feedback">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="buttonforLogin"
                      style={{ marginLeft: "0px" }}
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

export default UpdateUser;
