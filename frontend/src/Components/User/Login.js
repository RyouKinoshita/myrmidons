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
<div className="body" style={{backgroundImage:"linear-gradient(315deg, #838487,#AFB0B3)",backgroundImage:"-webkit-linear-gradient(315deg, #838487,#AFB0B3)"}}>
      <div className="row wrapper"  >
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={formik.handleSubmit} style={{backgroundColor:"#a7a2a9", borderRadius: "20px",marginTop:"40px"}}>
            <h1 className="mb-3" style={{color:"black",fontWeight: "bold"}}>Login</h1>
            <div className="form-group">
              <label htmlFor="email_field" style={{color:"black",fontWeight: "bold"}}>Email</label>
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
              <label htmlFor="password_field" style={{color:"black",fontWeight: "bold"}}>Password</label>
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

            <Link to="/password/forgot" className="float-right mb-4"  style={{color:"black",fontWeight: "bold"}}>
              Forgot Password?
            </Link>
                <br/>
                
                <br/>
            <button
              id="loginsbut"
              type="submit"
              className="buttonforLogin"
              style={{fontWeight: "bold", fontSize:"20px", color:"black"}}
            >
              LOGIN
            </button>
            <OAuth />
            
          </form>
        </div>
      </div>

      <br />
      <br />
      
      <br />
      </div> 
    </Fragment>
  );
};

export default Login;
