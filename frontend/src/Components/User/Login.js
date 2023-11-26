import React, { Fragment, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import Metadata from "../Layout/Metadata";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { authenticate, getUser } from "../../utils/helpers";
import OAuth from "./OAuth";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search
    ? new URLSearchParams(location.search).get("redirect")
    : "";

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:4001/api/v1/login`,
        { email, password },
        config
      );
      console.log(data);
      authenticate(data, () => navigate("/"));
      window.location.reload();

      toast.success("You have successfully logged in!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error("Invalid user or password", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  useEffect(() => {
    if (getUser() && redirect === "event") {
      navigate(`/${redirect}`);
      toast.success("You have successfully logged in!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, []);

  return (
    <Fragment>
      <Metadata title={"Login"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={formik.handleSubmit}>
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                name="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                name="password"
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>

            <Link to="/password/forgot" className="float-right mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
            >
              LOGIN
            </button>
            <OAuth />
            <Link to="/register" className="float-right mt-3">
              New User?
            </Link>
          </form>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Fragment>
  );
};

export default Login;
