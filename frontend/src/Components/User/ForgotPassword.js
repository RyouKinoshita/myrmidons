import React, { Fragment, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import MetaData from "../Layout/Metadata";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Layout/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `http://localhost:4001/api/v1/password/forgot`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(data.message);
        
        toast.success(data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
       
        navigate("/login");

      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    },
  });
  const timeoutId = setTimeout(() => {
    setLoading(false);
  }, 1000);
  return (
    <Fragment>
      {loading ? (
            <Loader />
          ) : (
      <div style={{backgroundImage:"linear-gradient(315deg, #838487,#AFB0B3)",backgroundImage:"-webkit-linear-gradient(315deg, #838487,#AFB0B3)"}}>
      <MetaData title={"Forgot Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={formik.handleSubmit} style={{backgroundColor:"#a7a2a9", borderRadius: "20px",marginTop:"0px"}}>
            <h1 className="mb-3" style={{color:"black",fontWeight: "bold"}}>Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field" style={{color:"black",fontWeight: "bold"}}>Enter Email</label>
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
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
            </div>

            <button
              id="loginsbut"
              type="submit"
              className="buttonforLogin"
              disabled={formik.isSubmitting}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
      
      </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
