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

const NewService = () => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [service, setService] = useState({});

  const categories = [
    "Digital Marketing",
    "Social Media Management",
    "Graphics & Video Production",
    "Web Development",
    "Customer Service & QA",
    "Project Management",
    "Photography",
    "KOL",
    "Studio Services",
    "PC/Mobile Game Management",
  ];

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

  const newService = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/admin/service/new`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setService(data.service);
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
      navigate("/admin/service");
      toast.success("Service created successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    description: Yup.string().required("Description is required"),
    ratings: Yup.number()
      .required("Ratings is required")
      .positive("Ratings must be a positive number")
      .integer("Ratings must be an integer"),
    category: Yup.string().required("Category is required"),
    images: Yup.array()
      .required("At least one image is required")
      .test("fileSize", "Each file must be no more than 10mb", (value) =>
        value.every((file) => file.size <= 1024 * 1024 * 10)
      ),
  });

  return (
    <Fragment>
      <MetaData title={"New Service"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <Formik
                initialValues={{
                  name: "",
                  price: "",
                  description: "",
                  ratings: "",
                  category: "",
                  images: [],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);

                  const formData = new FormData();
                  formData.set("name", values.name);
                  formData.set("price", values.price);
                  formData.set("description", values.description);
                  formData.set("ratings", values.ratings);
                  formData.set("category", values.category);
                  values.images.forEach((image, index) => {
                    formData.append(`images`, image);
                  });

                  newService(formData);
                }}
              >
                {({ setFieldValue, errors, touched }) => (
                  <Form
                    className="shadow-lg"
                    encType="multipart/form-data"
                    style={{ border: "solid 4px white" }}
                  >
                    <h1 className="mb-4">New Service</h1>

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
                      <label htmlFor="price_field">Price</label>
                      <Field
                        type="text"
                        id="price_field"
                        className="form-control"
                        name="price"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description_field">Description</label>
                      <Field
                        as="textarea"
                        className="form-control"
                        id="description_field"
                        rows="8"
                        name="description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ratings_field">Ratings</label>
                      <Field
                        as="select"
                        id="ratings_field"
                        className="form-control"
                        name="ratings"
                      >
                        <option value="">Select a rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Field>
                      <ErrorMessage
                        name="ratings"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category_field">Category</label>
                      <Field
                        as="select"
                        className="form-control"
                        id="category_field"
                        name="category"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
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

                    <button
                      id="loginsbut"
                      type="submit"
                      className="buttonforLogin"
                      
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

export default NewService;
