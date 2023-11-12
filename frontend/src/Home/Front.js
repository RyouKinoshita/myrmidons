import React from 'react';
const CloudinaryImage = () => {
  const imageUrl = 'https://res.cloudinary.com/dz6vwc893/image/upload/v1699767641/MYRMIDONS/3_sr1fhx.jpg';

  return (
    <div>
      <img
        src={imageUrl}
        alt="Cloudinary Image"
        style={{ width: '1530px', height: '630px' }}
      />
    </div>
  );
};

export default CloudinaryImage;
