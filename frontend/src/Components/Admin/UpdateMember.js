import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import Loader from "../Layout/Loader";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const UpdateMember = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [members, setMember] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  let { id } = useParams();
  let navigate = useNavigate();

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

  const getMemberDetails = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/MemberList/${id}`,
        config
      );
      // console .log(data)
      setMember(data.team);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateMember = async (id, memberData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/MemberList/${id}`,
        memberData,
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
      setName(members.name);
      setPosition(members.position);
      setDescription(members.description);
      setOldImages(members.images);

      setValue("name", members.name);
      setValue("position", members.position);
      setValue("description", members.description);
      setValue("images", []);
    };
    if (members && members._id !== id) {
      getMemberDetails(id);
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
      navigate("/admin/MemberList");
      successMsg("Member updated successfully");
    }
  }, [error, isUpdated, updateError, members, id]);

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("position", data.position);
    formData.set("description", data.description);
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const base64 = await convertFileToBase64(file);
      formData.append("images", base64);
    }
    updateMember(members._id, formData);
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
          <MetaData title={"Update Member"} />
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
                    <h1 className="mb-4">Update Member</h1>
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
                      <label htmlFor="position_field">Position</label>
                      <input
                        type="text"
                        id="position_field"
                        className={`form-control ${
                          errors.position ? "is-invalid" : ""
                        }`}
                        {...register("position")}
                      />
                      {errors.position && (
                        <p className="invalid-feedback">
                          {errors.position.message}
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
                      />
                      {errors.description && (
                        <p className="invalid-feedback">
                          {errors.description.message}
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
                      {/* {members.images &&
                        members.images.map((img) => (
                          <img
                            key={img}
                            src={img.url}
                            alt={img.url}
                            className="mt-3 mr-2"
                            width="55"
                            height="52"
                          />
                        ))} */}
                    </div>
                    <button
                      id="loginsbut"
                      type="submit"
                      className="buttonforLogin"
                      style={{ marginLeft: "20px" }}
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

export default UpdateMember;
