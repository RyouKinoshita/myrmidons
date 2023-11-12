import React, { Fragment } from 'react';

const BG = () => {
  const imageUrl = 'https://res.cloudinary.com/dz6vwc893/image/upload/v1699767641/MYRMIDONS/3_sr1fhx.jpg';

  return (
    <div className="card p-3 rounded">
    <Fragment>
      <div className="image-container" style={{ position: 'relative' }}>
        <img src={imageUrl} alt="Cloudinary Image" style={{ width: '100%', height: '900px' }} />
  
        <div className="image-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: 'white', textAlign: 'left', padding: '70px' }}>
          <h2 style={{ fontSize: '5rem', fontWeight: 'bold' , textAlign: 'left'}}><br/><br/><br/>MYRMIDONS EVENT PRODUCTIONS</h2>
          <p
   
  style={{
   
  fontSize: '1.3rem' }}>We, Myrmidons Productions, unite to bring imagination to life through dynamic and impactful productions. Together, we shape stories that resonates and visual that inspire. With friendship as our foundation, we deliver excellence, innovation, and passion in every project we undertake.</p>
        </div>
      </div>
    </Fragment>
  </div>
  
  );
};

export default BG;