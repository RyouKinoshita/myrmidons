import React, { Fragment, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NewPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.put(
          `http://localhost:4001/api/v1/password/reset/${token}`,
          values,
          config
        );
        toast.success("Password updated", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    },
  });

  useEffect(() => {
    if (formik.errors.password || formik.errors.confirmPassword) {
      toast.error("Invalid input. Please check your password and try again.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [formik.errors.password, formik.errors.confirmPassword]);

  return (
    <Fragment>
      <MetaData title={"New Password Reset"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={formik.handleSubmit}>
            <h1 className="mb-3">New Password</h1>

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
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="invalid-feedback">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                name="confirmPassword"
                className={`form-control ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="invalid-feedback">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewPassword;
