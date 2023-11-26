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
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  let navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
  });

  const getProfile = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/me`,
        config
      );
      setUser(data.user);
      initialValues.name = data.user.name;
      initialValues.email = data.user.email;
      setAvatarPreview(data.user.avatar.url);
      setLoading(false);
    } catch (error) {
      toast.error("user not found", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const updateProfile = async (values) => {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("avatar", avatar);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/me/update`,
        formData,
        config
      );
      setIsUpdated(data.success);
      setLoading(false);
      toast.success("user updated", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/me", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("user not found", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const onChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error("File size should be less than 10MB", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Fragment>
      <MetaData title={"Update Profile"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={updateProfile}
          >
            {({ errors, touched }) => (
              <Form className="shadow-lg" encType="multipart/form-data">
                <h1 className="mt-2 mb-5">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <Field
                    name="name"
                    type="text"
                    className={
                      "form-control" +
                      (errors.name && touched.name ? " is-invalid" : "")
                    }
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
                    name="email"
                    type="text"
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
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
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
                  disabled={loading ? true : false}
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
