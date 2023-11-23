import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MetaData from '../Layout/Metadata'
import { getUser, getToken, successMsg, errMsg } from '../../utils/helpers'

// import { useAlert} from '@blaumaus/react-alert'
import axios from 'axios'
// import service from '../../../../backend/models/service'



const ServiceDetails = ({ addItemToCart, cartItems }) => {

    const [loading, setLoading] = useState(true)
    const [service, setService] = useState({})
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [user, setUser] = useState(getUser())
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [selectedDate, setSelectedDate] = useState(null);
    const [success, setSuccess] = useState('')
    const [disabledDates, setDisabledDates] = useState([]);

    let { id } = useParams()
    // const alert = useAlert();

    const serviceDetails = async (id) => {
        let link = `http://localhost:4001/api/v1/service/${id}`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        if (!res)
            setError('Service not found')
        setService(res.data.service)
        const allDates = res.data.order.flatMap(orderItem =>
            orderItem.orderItems.map(item => item.date)
        );
        const uniqueDates = [...new Set(allDates)];
        setDisabledDates(uniqueDates)
        setLoading(false)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };
      
      
      let navigate = useNavigate()
      const addToCart = async () => {
        if (selectedDate) {
          // Pass both service ID, quantity, and date to the addItemToCart function
          await addItemToCart(id, selectedDate);
          navigate('/')
          // Reset the selected date after adding to cart
          setSelectedDate(null);

        } else {
          // Handle case when date is not selected
          setError('Please select a date before adding to cart.');
        }
        
      };
      
      const filterDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Convert date to string in 'YYYY-MM-DD' format
        const formattedDateLocal = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        // Check if the date is in the list of disabled dates (orderItemIds)
        return !disabledDates.includes(formattedDateLocal);
      };
    useEffect(() => {
        serviceDetails(id)
        
      
    }, [id, error, success]);

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (
        <Fragment>
           
                <Fragment>
                    <MetaData title={service.name} />
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="service_image">
                            <Carousel pause='hover'>
                                {service.images && service.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className="d-block w-100" src={image.url} alt={service.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{service.name}</h3>
                            <p id="product_id">Service # {service._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(service.ratings / 5) * 100}%` }}></div>
                            </div>
                            

                            <hr />

                            <p id="product_price">${service.price}</p>
                            <h3>Date Selected: </h3>
                            <DatePicker selected={selectedDate}
                                onChange={handleDateChange}
                                filterDate={filterDate}
                                placeholderText="Select a date" />
                            <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4"  onClick={addToCart}>Add to Cart</button>
                            
                            <h4 className="mt-2">Description:</h4>
                            <p>{service.description}</p>
                            <hr />
                                      
                          </div>    
                          </div>              
                </Fragment>
           
        </Fragment>
    

    )
                                }
export default ServiceDetails