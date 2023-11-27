import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Loader from "../Layout/Loader";
const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4001/api/v1/members")
      .then((response) => {
        setTeam(response.data.team);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">{/* Navbar content */}</div>

      {/* Recent Projects Section */}
      <div
        className="recent-projects-section"
        style={{
          backgroundColor: "gray",
          color: "white",
          padding: "15px",
          marginTop: "-15px",
          marginBottom: "1cm",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px",
            fontFamily: "Georgia, serif",
          }}
        >
          Team Members
        </h1>
      </div>
      {loading ? (
            <Loader />
          ) : (
<Slider {...settings}>
      {team.map((teams) => (
        <div key={teams._id}>
          <div className="card" style={{height:"950px"}}>
          <Carousel>
              {teams.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.url}
                    alt={`${teams.name} Image ${index + 1}`}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </Carousel>
            <div className="container" style={{ padding: "0 25px" }}>
              <h2
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {teams.name}
              </h2>{" "}
              <p className="title" style={{ color: "yellow" }}>
                {teams.position}
              </p>
              <p style={{ color: "black" }}>{teams.description}</p>
              <p>{teams.email}</p>
            </div>
          </div>
          
        </div>
      ))}      
    </Slider>
          )}
   
    </div>
 );
}; 


export default Team;
