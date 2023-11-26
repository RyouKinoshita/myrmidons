import React, { useState, useRef } from "react";
import emailLogo from "./email-logo.png";
import phoneLogo from "./phone-logo.png";
import locationLogo from "./location-logo.png";
import axios from "axios";
import emailjs from "@emailjs/browser";

const AboutUs = () => {
  const imageUrl =
    "https://res.cloudinary.com/dljixcnvk/image/upload/v1699772774/about/375198686_687556942843684_6240065041052319830_n_jwsxre.jpg";
  const googleDriveFileLink =
    "https://drive.google.com/file/d/15cpLuozwNj_Ssz8zo7DeqCEi4DS_XV6p/view?usp=sharing";

  const handleButtonClick = () => {
    window.open(googleDriveFileLink, "_blank");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_sop8umz",
        "template_lnbbkak",
        form.current,
        "xijqvz5nJnaM4JB47"
      )
      .then(
        (result) => {
          console.log(result.text);
          setSubmitMessage("Email sent successfully!");

          // Reset form data upon successful submission
          setFormData({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          console.log(error.text);
          setSubmitMessage("Failed to send email. Please try again.");
        }
      );
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={imageUrl}
          alt="Myrmidons"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scale(1.9)",
          }}
        />
      </div>

      <div style={{ backgroundColor: "gray", color: "white", padding: "40px" }}>
        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "55px",
            fontFamily: "Georgia, serif",
          }}
        >
          myr·mi·dons
        </h1>
        <div>
          <p style={{ fontSize: "20px", textAlign: "justify" }}>
            MYRMIDONS Productions stands as a beacon of excellence in the realm
            of event production. MYRMIDONS develop competence and skill as it is
            supported by a team of experienced production members, each of which
            has a lot of experience in all parts of event management. MYRMIDONS
            members of production are students bringing their expertise in the
            industry. These students are not just passionate about event
            production; they're actively learning and evolving their skills in
            relevant fields, ensuring that your event benefits from the latest
            industry trends and techniques.
          </p>
          <button
            onClick={handleButtonClick}
            style={{
              padding: "12px 20px",
              fontSize: "18px",
              marginTop: "20px",
              display: "block",
              margin: "auto",
              backgroundColor: "gray",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Download our Portfolio
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: "#FCF4A3",
          color: "black",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "bold" }}>
            If you are interested, Contact Us!
          </h1>
          <div style={{ padding: "25px" }}>
            <p style={{ fontSize: "20px" }}>
              <img
                src={emailLogo}
                alt="Email Logo"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />{" "}
              myrmiproductions@gmail.com
            </p>
            <p style={{ fontSize: "20px" }}>
              <img
                src={phoneLogo}
                alt="Phone Logo"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />{" "}
              09786321836
            </p>
            <p style={{ fontSize: "20px" }}>
              <img
                src={locationLogo}
                alt="Location Logo"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />{" "}
              No. 5 East Capitol Drive corner Sta. Rosa Street, Kapitolyo, Pasig
              City
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {submitMessage && (
            <div
              style={{
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: submitMessage.includes("Successfully")
                  ? "green"
                  : "red",
                color: "white",
                marginBottom: "10px",
              }}
            >
              {submitMessage}
            </div>
          )}
          <form
            ref={form}
            onSubmit={sendEmail}
            style={{ textAlign: "left", width: "100%" }}
          >
            <label
              style={{ marginBottom: "10px", textAlign: "left", width: "100%" }}
            >
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  width: "100%",
                }}
              />
            </label>

            <label
              style={{ marginBottom: "10px", textAlign: "left", width: "100%" }}
            >
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  width: "100%",
                }}
              />
            </label>

            <label
              style={{ marginBottom: "10px", textAlign: "left", width: "100%" }}
            >
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  minHeight: "100px",
                  width: "100%",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "black",
                color: "white",
                border: "white",
                borderRadius: "25px",
                cursor: "pointer",
                width: "25%",
                marginTop: "20px",
                display: "block",
                margin: "auto",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
