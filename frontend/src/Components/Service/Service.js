import React, { Fragment } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
const Service = ({ service }) => {
	return (

		<Fragment>
		<Row xs={1} md={1} className="g-4">
		  <Col>
			<Card style={{ width: '1200px'}}>
			  <Card.Body style={{backgroundColor: "#DCDCDC", border: "6px solid yellow", fontWeight: "bold", fontFamily:"Impact",textAlign:"center"}}>
				<Row>
				  <Col md={4}>
				  <div className="image-container" id='cardcon'>
  <Card.Img
    variant="top"
    src={service.images && service.images.length > 0 ? service.images[0].url : "holder.js/100px160"}
    alt={service.name}
    className="image-content" id='cardcont'
  />
</div>
				  </Col>
				  <Col md={8}>
					<Card.Title style={{
						fontSize: "50px",
						color:"black",
						textDecoration: "underline"
					}}>{service.name}</Card.Title>
					<Card.Title style={{fontWeight: "bold", fontFamily:"Arial",textAlign:"left",color:"black"}}>Category: {service.category}</Card.Title>
					<Card.Title style={{fontWeight: "bold", fontFamily:"Arial",textAlign:"left",color:"black"}}>Price: ${service.price}</Card.Title>
					<Card.Title style={{fontWeight: "bold", fontFamily:"Arial",textAlign:"left",color:"black",fontSize: "15px"}}>Description: </Card.Title>
					<Card.Text style={{fontFamily:"Arial",textAlign:"left",color:"black",fontSize: "14px"}}>
					  {service.description}
					</Card.Text>
					<Link to={`/service/${service._id}`} id="view_btn" className="btn btn-block">View Details</Link>
				  </Col>
				</Row>
			  </Card.Body>
			</Card>
			
		  </Col>
		</Row>
		<br/>
	  </Fragment>
		
	)
}
export default Service