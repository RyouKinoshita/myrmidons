import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdatePassword = () => {
  const [error, setError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const updatePassword = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:4001/api/v1/password/update`,
        formData,
        config
      );
      setIsUpdated(data.success);
      setLoading(false);
      toast.success("password updated", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/me");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error]);

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    password: Yup.string()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .required("New Password is required"),
  });

  return (
    <Fragment>
      <MetaData title={"Change Password"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <Formik
            initialValues={{ oldPassword: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              const formData = new FormData();
              formData.set("oldPassword", values.oldPassword);
              formData.set("password", values.password);
              updatePassword(formData);
            }}
          >
            {({ errors, touched }) => (
              <Form className="shadow-lg">
                <h1 className="mt-2 mb-5">Update Password</h1>
                <div className="form-group">
                  <label htmlFor="old_password_field">Old Password</label>
                  <Field
                    type="password"
                    id="old_password_field"
                    className="form-control"
                    name="oldPassword"
                  />
                  {errors.oldPassword && touched.oldPassword ? (
                    <div className="invalid-feedback d-block">
                      {errors.oldPassword}
                    </div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="new_password_field">New Password</label>
                  <Field
                    type="password"
                    id="new_password_field"
                    className="form-control"
                    name="password"
                  />
                  {errors.password && touched.password ? (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
                  disabled={loading ? true : false}
                >
                  Update Password
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePassword;
