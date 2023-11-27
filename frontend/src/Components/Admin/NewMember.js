import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../Layout/Loader";

const NewMember = () => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [member, setMember] = useState({});
  

  let navigate = useNavigate();

  const onChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setFieldValue("images", files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const newMember = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/admin/MemberList/new`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setMember(data.team);
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

    if (success) {
      navigate("/admin/MemberList");
      toast.success("Member created successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    position: Yup.string().required("Position is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
      .required("At least one image is required")
      .test("fileSize", "Each file must be no more than 10mb", (value) =>
        value.every((file) => file.size <= 1024 * 1024 * 10)
      ),
  });

  return (
    <Fragment>
      <MetaData title={"New Member"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            
            <div className="wrapper my-5">
              {/* {loading && <Loader />}  */}
              <Formik
                initialValues={{
                  name: "",
                  position: "",
                  description: "",
                  images: [],
                  
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);

                  const formData = new FormData();
                  formData.set("name", values.name);
                  formData.set("position", values.position);
                  formData.set("description", values.description);
                  values.images.forEach((image) => {
                    formData.append("images", image);
                  });

                  newMember(formData);
                }}
              >
                {({ setFieldValue }) => (
                  <Form className="shadow-lg" encType="multipart/form-data">
                    <h1 className="mb-4">New Member</h1>

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
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="position_field">Position</label>
                      <Field
                        type="text"
                        id="position_field"
                        className="form-control"
                        name="position"
                      />
                      <ErrorMessage
                        name="position"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description_field">Description</label>
                      <Field
                        type="text"
                        className="form-control"
                        id="description_field"
                        name="description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label>Images</label>

                      <div className="custom-file">
                        <input
                          type="file"
                          name="images"
                          className="custom-file-input"
                          id="customFile"
                          onChange={(e) => onChange(e, setFieldValue)}
                          multiple
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose Images
                        </label>
                      </div>

                      {imagesPreview.map((img) => (
                        <img
                          src={img}
                          key={img}
                          alt="Images Preview"
                          className="mt-3 mr-2"
                          width="55"
                          height="52"
                        />
                      ))}
                      <ErrorMessage
                        name="images"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>
                    <Fragment>
                      <h1 className="my-5"></h1>
                    </Fragment>
                    <button
                      id="login_button"
                      type="submit"
                      className="buttonforLogin"
                      style={{ marginRight: "60px" }}
                    >
                      CREATE
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default NewMember;
