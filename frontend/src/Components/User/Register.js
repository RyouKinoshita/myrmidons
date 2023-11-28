import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Metadata from "../Layout/Metadata";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      console.log(error);
      setError();
    }
  }, [error.isAuthenticated, navigate]);

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const register = async (userData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/register`,
        userData,
        config
      );
      console.log(data.user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setIsAuthenticated(false);
      setError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Password is required"),
    password: Yup.string()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .required("Password is required"),
    avatar: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "Up to 10mb of file size only", (value) => {
        return value && value.size <= 1024 * 1024 * 10; // 10 MB
      }),
  });

  return (
    <Fragment>
      <Metadata title={"Register User"} />
      <div
        className="body"
        style={{ backgroundImage: "linear-gradient(315deg, #838487,#AFB0B3)" }}
      >
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <Formik
              initialValues={{ name: "", email: "", password: "", avatar: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);

                const formData = new FormData();
                formData.set("name", values.name);
                formData.set("email", values.email);
                formData.set("password", values.password);
                formData.set("avatar", avatar);

                register(formData);
              }}
            >
              {({ setFieldValue, errors, touched }) => (
                <Form
                  className="shadow-lg"
                  encType="multipart/form-data"
                  style={{
                    backgroundColor: "#a7a2a9",
                    borderRadius: "20px",
                    marginTop: "0px",
                  }}
                >
                  <h1
                    className="mb-3"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    Register
                  </h1>

                  <div className="form-group">
                    <label
                      htmlFor="name_field"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name_field"
                      className="form-control"
                      name="name"
                    />
                    {errors.name && touched.name ? (
                      <div className="invalid-feedback d-block">
                        {errors.name}
                      </div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="email_field"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email_field"
                      className="form-control"
                      name="email"
                    />
                    {errors.email && touched.email ? (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="password_field"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password_field"
                      className="form-control"
                      name="password"
                    />
                    {errors.password && touched.password ? (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="avatar_upload"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      Avatar
                    </label>
                    <div className="d-flex align-items-center">
                      <div>
                        <figure className="avatar mr-3 item-rtl">
                          <img
                            src={avatarPreview}
                            className="rounded-circle"
                            alt="Avatar Preview"
                          />
                        </figure>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          name="avatar"
                          className="custom-file-input"
                          id="customFile"
                          accept="images/*"
                          onChange={(event) => {
                            setFieldValue(
                              "avatar",
                              event.currentTarget.files[0]
                            );
                            onChange(event);
                          }}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose Avatar
                        </label>
                      </div>
                    </div>
                    {errors.avatar && touched.avatar ? (
                      <div className="invalid-feedback d-block">
                        {errors.avatar}
                      </div>
                    ) : null}
                  </div>

                  <button
                    id="loginsbut"
                    type="submit"
                    className="buttonforLogin"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    REGISTER
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
