import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Layout/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const NewProject = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(0);
  const [date, setDate] = useState("");

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [project, setProject] = useState({});

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

  const timeoutId = setTimeout(() => {
    setLoading(false);
  }, 1000);

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

  const newProject = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/admin/portfolio/new`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setProject(data.project);
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
      navigate("/admin/portfolio");
      toast.success("Project created successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("location", data.location);
    formData.set("date", data.date);

    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const base64 = await convertFileToBase64(file);
      formData.append("images", base64);
    }

    newProject(formData);
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
          <MetaData title={"New Project"} />
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
                    <h1 className="mb-4">New Project</h1>

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
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
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
                      <div className="invalid-feedback">
                        {errors.location?.message}
                      </div>
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
                      <div className="invalid-feedback">
                        {errors.date?.message}
                      </div>
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
                        <div className="invalid-feedback">
                          {errors.images?.message}
                        </div>
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
                      style={{ marginRight: "50px" }}
                      disabled={loading ? true : false}
                    >
                      CREATE
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
export default NewProject;
