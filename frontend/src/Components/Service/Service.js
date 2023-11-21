import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
const Service = ({service}) => {
	return ( 
	
		<Fragment>
		<div className="col-sm-12 col-md-6 col-lg-3 my-3">
	          <div className="card p-3 rounded">
			  <Carousel pause='hover'>
                                {service.images && service.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className="d-block w-100" src={image.url} alt={service.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
	            <div className="card-body d-flex flex-column">
	              <h5 className="card-title">
	                <a href="">{service.name}</a>
	              </h5>
	              <div className="ratings mt-auto">
	                <div className="rating-outer">
	                  <div className="rating-inner" style={ {width: `${(service.ratings / 5) * 100}%`}}></div>
	                </div>
	              </div>
	              <p className="card-text">${service.price}</p>
				  {/* {`/product/${service._id}`} */}
	              <Link to={`/service/${service._id}`} id="view_btn" className="btn btn-block">View Details</Link>
	            </div>
	          </div>
	        </div>
			</Fragment>
		
	      )
}
export default Service