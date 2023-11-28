import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import Loader from "../Layout/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const UpdateService = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [ratings, setRatings] = useState(0);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [error, setError] = useState("");
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

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
  let { id } = useParams();
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

  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  const onChange = async (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    setValue("images", files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const getServiceDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/service/${id}`
      );
      console.log("Fetched Service Details:", data);
      setService(data.service);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/service/${id}`,
        serviceData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setUpdateError(error.response.data.message);
    }
  };
  useEffect(() => {
    const setFormValues = () => {
      setName(service.name);
      setPrice(service.price);
      setDescription(service.description);
      setRatings(service.ratings);
      setCategory(service.category);
      setOldImages(service.images);

      // Set form values using setValue from react-hook-form
      setValue("name", service.name);
      setValue("price", service.price);
      setValue("description", service.description);
      setValue("ratings", service.ratings);
      setValue("category", service.category);
      setValue("images", []); // Clear any previous selected images
    };

    if (service && service._id !== id) {
      getServiceDetails(id);
    } else {
      setFormValues();
      setLoading(false); // Move setLoading here to ensure it's set after form values are updated
    }

    if (error) {
      errMsg(error);
    }
    if (updateError) {
      errMsg(updateError);
    }
    if (isUpdated) {
      navigate("/admin/service");
      successMsg("Service updated successfully");
    }
  }, [error, isUpdated, updateError, service, id, setValue]);

  const submitHandler = async (data) => {
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
    updateService(service._id, formData);
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Update Service"} />
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <Fragment>
                <div className="wrapper my-5">
                  <form
                    className="shadow-lg"
                    onSubmit={handleSubmit(submitHandler)}
                    encType="multipart/form-data"
                    style={{ border: "solid 4px white" }}
                  >
                    <h1 className="mb-4">Update Service</h1>
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
                        <p className="invalid-feedback">
                          {errors.name.message}
                        </p>
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
                        <p className="invalid-feedback">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="description_field">Description</label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        id="description_field"
                        rows="8"
                        {...register("description")}
                      ></textarea>
                      {errors.description && (
                        <p className="invalid-feedback">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="ratings_field">Ratings</label>
                      <input
                        type="text"
                        id="ratings_field"
                        className={`form-control ${
                          errors.ratings ? "is-invalid" : ""
                        }`}
                        {...register("ratings")}
                      />
                      {errors.ratings && (
                        <p className="invalid-feedback">
                          {errors.ratings.message}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="category_field">Category</label>
                      <select
                        className={`form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        id="category_field"
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
                          id="customFile"
                          onChange={onChange}
                          multiple
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose Images
                        </label>
                        {oldImages &&
                          oldImages.map((img) => (
                            <img
                              key={img}
                              src={img.url}
                              alt={img.url}
                              className="mt-3 mr-2"
                              width="55"
                              height="52"
                            />
                          ))}
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
                      {errors.images && (
                        <p className="invalid-feedback">
                          {errors.images.message}
                        </p>
                      )}
                    </div>
                    <button
                      id="loginsbut"
                      type="submit"
                      className="buttonforLogin"
                      disabled={loading ? true : false}
                    >
                      UPDATE
                    </button>
                  </form>
                </div>
              </Fragment>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

export default UpdateService;
