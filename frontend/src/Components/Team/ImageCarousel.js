// ImageCarousel.js

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageCarousel = ({ images }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image.url}
            alt={`Image ${index + 1}`}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
