import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

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

  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  const getPortfolio = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/portfolio/${id}`
      );
      setProject(data.portfolios);
      setImagesPreview(data.portfolios.images.map((img) => img.url));
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json", // Set content type to multipart/form-data
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/portfolio/${id}`,
        projectData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setUpdateError(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching project data...");
        const response = await axios.get(
          `http://localhost:4001/api/v1/portfolio/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        console.log("API Response:", response.data);

        const projectData = response.data.portfolios;

        // Initialize state with fetched data
        setName(projectData.name);
        setLocation(projectData.location);
        setDate(projectData.date);
        setImagesPreview(projectData.images.map((img) => img.url));
        setOldImages(projectData.images);
        setProject(projectData); // Set the project state

        setLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);

        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while fetching project data");
        }
      }
    };

    fetchData();

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
  }, [error, isUpdated, updateError, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("location", location);
    formData.set("date", date);
    images.forEach((image) => {
      formData.append("images", image);
    });
    updateProject(project._id, formData);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]); // Store file instead of reader.result
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
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
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Update Project</h1>
                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location_field">Location</label>
                  <input
                    type="text"
                    id="location_field"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date_field">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date_field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
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
                  {imagesPreview.map((img, index) => (
                    <img
                      src={img}
                      key={index}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>
                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
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
  );
};

export default UpdateProject;
