import React, { Fragment, useEffect, useState } from "react";
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

  const updatePassword = async (values) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:4001/api/v1/password/update`,
        values,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error]);

  return (
    <Fragment>
      <MetaData title={"Change Password"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <Formik
            initialValues={{
              oldPassword: "",
              password: "",
            }}
            validationSchema={Yup.object({
              oldPassword: Yup.string().required("Old password is required"),
              password: Yup.string().required("New password is required"),
            })}
            onSubmit={updatePassword}
          >
            <Form className="shadow-lg" style={{ backgroundColor: "gray" }}>
              <h1
                className="mt-2 mb-5"
                style={{ color: "black", fontWeight: "bold" }}
              >
                Update Password
              </h1>
              <div className="form-group">
                <label
                  htmlFor="oldPassword"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  Old Password
                </label>
                <Field
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  className="form-control"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="password"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  New Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              <button
                type="submit"
                className="buttonforLogin"
                id="loginsbut"
                disabled={loading ? true : false}
              >
                Update Password
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePassword;
