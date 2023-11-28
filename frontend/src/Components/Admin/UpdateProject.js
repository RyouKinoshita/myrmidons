import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import Loader from "../Layout/Loader";
// import { get } from "mongoose";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const UpdateProject = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [error, setError] = useState("");
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  let { id } = useParams();
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    location: Yup.string().required("Location is required"),
    date: Yup.date().required("Date is required"),
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

  const onChange = (e) => {
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
          setImages((oldArray) => [...oldArray, reader.result]); // Store file instead of reader.result
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const getPortfolio = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/portfolio/${id}`
      );
      setProject(data.portfolios);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/portfolio/${id}`,
        projectData,
        config
      );
      console.log(data);
      setIsUpdated(data.success);
    } catch (error) {
      setUpdateError(error.response.data.message);
    }
  };

  useEffect(() => {
    const setFormValues = () => {
      setName(project.name);
      setLocation(project.location);
      setDate(project.date);
      setOldImages(project.images);

      const formattedDate = new Date(project.date).toISOString().split("T")[0];
      setDate(formattedDate);

      setValue("name", project.name);
      setValue("location", project.location);
      setValue("date", formattedDate);
      setValue("images", []);
    };

    if (project && project._id !== id) {
      getPortfolio(id);
    } else {
      setFormValues();
      setLoading(false);
    }

    if (error) {
      errMsg(error);
    }
    if (updateError) {
      errMsg(updateError);
    }
    if (isUpdated) {
      navigate("/admin/portfolio");
      successMsg("Project updated successfully");
    }
  }, [error, isUpdated, updateError, project, id]);

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("location", location);
    const formattedDate = new Date(data.date).toISOString().split("T")[0];

    formData.set("date", formattedDate);
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const base64 = await convertFileToBase64(file);
      formData.append("images", base64);
    }
    updateProject(project._id, formData);
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
          <MetaData title={"Update Project"} />
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
                    <h1 className="mb-4">Update Project</h1>
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
                      <label htmlFor="location_field">Location</label>
                      <input
                        type="text"
                        id="location_field"
                        className={`form-control ${
                          errors.location ? "is-invalid" : ""
                        }`}
                        {...register("location")}
                      />
                      {errors.location && (
                        <p className="invalid-feedback">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="date_field">Date</label>
                      <input
                        type="date"
                        className={`form-control ${
                          errors.date ? "is-invalid" : ""
                        }`}
                        id="date_field"
                        {...register("date")}
                      />
                      {errors.date && (
                        <p className="invalid-feedback">
                          {errors.date.message}
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
                              key={img.url}
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
                      id="loginbut"
                      type="submit"
                      className="buttonforLogin"
                      style={{ marginLeft: "3px", width: "800px" }}
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

export default UpdateProject;
