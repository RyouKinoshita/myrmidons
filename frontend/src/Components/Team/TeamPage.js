import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
  const [team, setTeam] = useState([]);


  useEffect(() => {
    axios
      .get("http://localhost:4001/api/v1/members")
      .then((response) => {
        setTeam(response.data.team);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

      {/* Team Members Section */}
      <div className="row">
        {/* Mapping through 'team' array */}
        {team.map((teams) => (
          <div
            className="column"
            key={teams._id}
            style={{
              float: "left",
              width: "33.3%",
              marginBottom: "16px",
              padding: "0 8px",
            }}
          >
            <div
              className="card"
              style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)" }}
            >
              <img
                src={teams.images[0].url}
                alt={teams.name}
                style={{ width: "100%", height: "500px" }}
              />
              <div className="container" style={{ padding: "0 25px" }}>
                <h2
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "cyan",
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
  
      </div>
    </div>
  );
};

export default Team;
