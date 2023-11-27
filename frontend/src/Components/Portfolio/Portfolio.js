import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap'

const Portfolio = () => {
  const [portfolio, setPortfolios] = useState([]);

  const [hoveredPortfolio, setHoveredPortfolio] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4001/api/v1/portfolio')
      .then(response => {
        setPortfolios(response.data.portfolios);
        console.log(portfolio)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMouseEnter = (portfolio) => {
    setHoveredPortfolio(portfolio);
  };

  const handleMouseLeave = () => {
    setHoveredPortfolio(null);
  };

  return (
    <div>
      <div className="navbar">
      </div>

      <div className="recent-projects-section" style={{ backgroundColor: 'gray', color: 'white', padding: '15px', marginTop: '-15px', marginBottom: '1cm' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '40px', fontFamily: 'Georgia, serif' }}>Recent Projects</h1>
      </div>

      <div className="portfolio-section">
        <div className="container">
          <div className="row portfolio-container">
            {portfolio.map(portfolio => (
              <div
                key={portfolio._id}
                className="col-lg-4 col-md-4 col-sm-4 portfolio-item mix"
                onMouseEnter={() => handleMouseEnter(portfolio)}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative', marginBottom: '1cm' }}
              >
                 <div className="pd" style={{ position: 'relative' }}>
                  <img
                    src={portfolio.images[0].url}
                    alt={portfolio.name}
                    style={{ width: '100%', height: '100%' }}
                  />
                {/* <div className="col-12 col-lg-5 img-fluid" id="portfolios_image">
                            <Carousel pause='hover'>
                                {portfolios.images && portfolios.images.map(images => (
                                    <Carousel.Item key={images.public_id}>
                                        <img src={images.} alt={portfolios.name} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div> */}

                  {hoveredPortfolio && hoveredPortfolio._id === portfolio._id && (
                    <div
                      className="hovered-content"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(150, 100, 150, 0.8)',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'yellow',
                        fontWeight: 'bold',
                      }}
                    >
                      <p>Name: {portfolio.name}</p>
                      <p>Location: {portfolio.location}</p>
                      <p>Date: {portfolio.date}</p>
                    </div>
                  )}
                </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
