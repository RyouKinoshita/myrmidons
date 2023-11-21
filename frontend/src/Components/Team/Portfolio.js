import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import './style.css';

const Portfolio = ({portfolio}) => {
	return ( 
	
		<Fragment>
            
		<div class="container">
  <div class="images">
    <img src={portfolio.images[0].url} alt={portfolio.name}
 />
  </div>
  <div class="slideshow-buttons">
    <div class="one"></div>
    <div class="two"></div>
    <div class="three"></div>
    <div class="four"></div>
  </div>
 
  <div class="product">
    <br/>
    
    <br/>
    <p>{portfolio.position}</p>
    <h1>{portfolio.name}</h1>
    
    <p class="desc">{portfolio.description}</p>
   
  </div>
</div>
			</Fragment>
		
	      )
}
export default Portfolio