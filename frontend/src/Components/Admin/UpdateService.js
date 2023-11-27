import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import Loader from "../Layout/Loader";

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

  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  const getServiceDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/service/${id}`
      );
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
          "Content-Type": "application/json",
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
    if (service && service._id !== id) {
      getServiceDetails(id);
    } else {
      setName(service.name);
      setPrice(service.price);
      setDescription(service.description);
      setRatings(service.ratings);
      setCategory(service.category);
      setOldImages(service.images);
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
  }, [error, isUpdated, updateError, service, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("ratings", ratings);
    formData.set("category", category);
    images.forEach((image) => {
      formData.append("images", image);
    });
    updateService(service._id, formData);
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
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
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
                onSubmit={submitHandler}
                encType="multipart/form-data"
                style={{ border: "solid 4px white" }}
              >
                <h1 className="mb-4">Update Service</h1>
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
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="price_field">Ratings</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={ratings}
                    minimum="1"
                    maximum="5"
                    onChange={(e) => setRatings(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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
