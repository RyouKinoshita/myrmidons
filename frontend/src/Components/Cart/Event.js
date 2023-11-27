import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import MetaData from "../Layout/Metadata";
import CheckoutSteps from "./CheckoutSteps";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  phoneNo: yup.number().required("Phone number is required"),
  postalCode: yup.number().required("Postal code is required"),
  country: yup.string().required("Country is required"),
});

const Event = ({ event, saveEventInfo }) => {
  const countriesList = Object.values(countries);
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: event?.address || "",
      city: event?.city || "",
      phoneNo: event?.phoneNo || "",
      postalCode: event?.postalCode || "",
      country: event?.country || "",
    },
  });

  const submitHandler = (data) => {
    saveEventInfo(data);
    navigate("/confirm");
  };

  return (
    <Fragment>
      <MetaData title={"Event Info"} />
      <CheckoutSteps shipping />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={handleSubmit(submitHandler)}
            style={{ border: "solid 3px white" }}
          >
            <h1 className="mb-4">Event Info</h1>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                {...register("address")}
              />
              {errors.address && (
                <p className="invalid-feedback d-block">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                {...register("city")}
              />
              {errors.city && (
                <p className="invalid-feedback d-block">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                className={`form-control ${errors.phoneNo ? "is-invalid" : ""}`}
                {...register("phoneNo")}
              />
              {errors.phoneNo && (
                <p className="invalid-feedback d-block">
                  {errors.phoneNo.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="postal_code_field">Postal Code</label>
              <input
                type="number"
                id="postal_code_field"
                className={`form-control ${
                  errors.postalCode ? "is-invalid" : ""
                }`}
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="invalid-feedback d-block">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className={`form-control ${errors.country ? "is-invalid" : ""}`}
                {...register("country")}
              >
                {countriesList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="invalid-feedback d-block">
                  {errors.country.message}
                </p>
              )}
            </div>

            <button
              id="loginbuts"
              type="submit"
              className="buttonforLogin"
              style={{ border: "solid 3px white" }}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Event;
