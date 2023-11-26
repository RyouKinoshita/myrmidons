import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../utils/helpers";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdateProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    avatar: Yup.mixed().test(
      "fileSize",
      "File size should be less than 10MB",
      (value) => {
        if (value) {
          return value.size <= 10000000; // 10MB in bytes
        }
        return true; // Allow when no file selected
      }
    ),
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/me`,
        config
      );
      setAvatarPreview(data.user.avatar.url);
    } catch (error) {
      toast.error("User not found", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const updateProfile = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("avatar", avatar);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:4001/api/v1/me/update`,
        formData,
        config
      );

      toast.success("User updated", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/me", { replace: true });
    } catch (error) {
      toast.error("User update failed", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Update Profile"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <Formik
            initialValues={{
              name: "",
              email: "",
              avatar: null,
            }}
            validationSchema={validationSchema}
            onSubmit={updateProfile}
          >
            {({ errors, touched }) => (
              <Form className="shadow-lg" encType="multipart/form-data">
                <h1 className="mt-2 mb-5">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <Field
                    type="text"
                    id="name_field"
                    className="form-control"
                    name="name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <Field
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
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
                        accept="image/*"
                        onChange={(e) => {
                          onChange(e);
                          setFieldValue("avatar", e.currentTarget.files[0]);
                        }}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                  <ErrorMessage
                    name="avatar"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <button
                  type="submit"
                  className="buttonforLogin"
                  disabled={loading}
                >
                  Update
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
