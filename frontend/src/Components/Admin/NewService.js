import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files); // Log the selected files
    setImagesPreview([]);
    setImages([]);
    setValue("images", files);
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("price", data.price);
    formData.set("description", data.description);
    formData.set("ratings", data.ratings);
    formData.set("category", data.category);
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const base64 = await convertFileToBase64(file);
      formData.append("images", base64);
    }

    newService(formData);
  };

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="shadow-lg"
                encType="multipart/form-data"
                style={{ border: "solid 4px white" }}
              >
                <h1 className="mb-4">New Service</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="invalid-feedback">{errors.name.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className={`form-control ${
                      errors.price ? "is-invalid" : ""
                    }`}
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="invalid-feedback">{errors.price.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    id="description_field"
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="invalid-feedback">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="ratings_field">Ratings</label>
                  <select
                    id="ratings_field"
                    className={`form-control ${
                      errors.ratings ? "is-invalid" : ""
                    }`}
                    {...register("ratings")}
                  >
                    <option value="">Select a rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  {errors.ratings && (
                    <p className="invalid-feedback">{errors.ratings.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    id="category_field"
                    className={`form-control ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    {...register("category")}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="invalid-feedback">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      name="images"
                      className={`custom-file-input ${
                        errors.images ? "is-invalid" : ""
                      }`}
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose images
                    </label>
                    {errors.images && (
                      <p className="invalid-feedback">
                        {errors.images.message}
                      </p>
                    )}
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
                </div>

                <button
                  id="loginsbut"
                  type="submit"
                  className="buttonforLogin"
                  style={{ marginLeft: "15px", width: "340px" }}
                >
                  CREATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default NewService;
