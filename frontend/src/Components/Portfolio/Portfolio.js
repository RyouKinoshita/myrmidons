// Import necessary React components
import React, { useState } from 'react';
// import './App.css'; // Import your custom CSS file for styling

// Sample data for the gallery (replace with your own data)
const galleryData = [
  { id: 1, name: 'Web Design', category: 'web', imageUrl: 'https://via.placeholder.com/500' },
  { id: 2, name: 'Graphic Design', category: 'design', imageUrl: 'https://via.placeholder.com/500' },
  { id: 3, name: 'Photography', category: 'photo', imageUrl: 'https://via.placeholder.com/500' },
  // Add more items as needed
];


// Gallery component
const Portfolio = ({portfolios}) => {
  // State to track the hovered image
  const [hoveredImage, setHoveredImage] = useState(null);

  // Handle hover events
  const handleMouseEnter = (id) => {
    setHoveredImage(id);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return (
    <div className="portfolio-section">
      <div className="container">
        <div className="row portfolio-container">
          {/* Map through gallery data and render each item */}
          {galleryData.map((portfolios) => (
            <div
              key={portfolios.id}
              className={`col-lg-4 col-md-6 col-sm-6 portfolio-item mix ${portfolios.category}`}
              onMouseEnter={() => handleMouseEnter(portfolios.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="portfolio-overlay">
                <p>{hoveredImage === portfolios.id ? portfolios.name : ''}</p>
                <a href="portfolio.name"></a>
              </div>
              <div className="pd">
                <img src={portfolios.imageUrl} alt={portfolios.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
};



export default Portfolio;
