import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [hoveredPortfolio, setHoveredPortfolio] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4001/api/v1/portfolio")
      .then((response) => {
        setPortfolios(response.data.portfolios);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleMouseEnter = (portfolio) => {
    setHoveredPortfolio(portfolio);
  };

  const handleMouseLeave = () => {
    setHoveredPortfolio(null);
  };

  return (
    <div >
      <div className="navbar"></div>

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
          Recent Projects
        </h1>
      </div>

      <Fragment >
  {portfolios.map((portfolio) => (
    <Row xs={1} md={1} className="g-4" key={portfolio.id} >
      <Col className="mx-auto"> {/* Center the column */}
        <Card style={{display:"flex", justifyContent:"center",alignItems:"center",height:"50vh",margin:"0"}}>
          <Card.Body
            style={{
              backgroundColor: "#DCDCDC",
              border: "6px solid yellow",
              fontWeight: "bold",
              fontFamily: "Impact",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Row className="text-center"> {/* Center the row content */}
              <Col md={4}>
                <Carousel>
                  {portfolio.images.map((image, index) => (
                    <div key={index} className="image-container" style={{ height: "300px" }}>
                      <img
                        src={image.url}
                        alt={`portfolio-image-${index}`}
                        className="image-content"
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
              <Col md={8} className="text-left"> {/* Align the content to the left */}
                <Card.Title
                  style={{
                    fontSize: "70px",
                    color: "black",
                    textDecoration: "underline",
                    textAlign: "center",
                    marginTop: "70px",
                  
                  }}
                >
                 {portfolio.name}
                </Card.Title>
                <Card.Title
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Arial",
                    textAlign: "left",
                    color: "black",
                    textAlign: "center"
                    
                  }}
                >
                  
                  <time
                    dateTime={portfolio.date}
                    className="card__date"
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Arial",
                      textAlign: "left",
                      color: "black",
                      fontSize: "50px",
                    }}
                  >
                   {new Date(portfolio.date).toLocaleDateString()}
                  </time>
                </Card.Title>
                <Card.Title
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Arial",
                    textAlign: "left",
                    color: "black",
                    textAlign: "center",
                    fontSize: "30px",
                  }}
                >
                  Location: {portfolio.location}
                </Card.Title>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  ))}
  <br />
</Fragment>
    </div>
  );
};

export default Portfolio;
