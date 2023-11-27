import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MetaData from '../Layout/Metadata'
import CheckoutSteps from './CheckoutSteps'
import { getUser } from '../../utils/helpers'
const ConfirmOrder = ({cartItems, eventInfo}) => {
    console.log(eventInfo)
    const [user, setUser] = useState(getUser() ? getUser() : {})
    let navigate = useNavigate();
    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price, 0)
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm" style={{backgroundColor:"gray", border:"solid 3px white"}}>
                    <h4 className="mb-3" style={{color:"yellow",fontWeight:"bold"}}>Shipping Info</h4>
                    {getUser() && <p style={{color:"white",fontWeight:"bold"}}><b style={{color:"white",fontWeight:"bold"}}>Name:</b> {user && user.name}</p>}
                    <p className="mb-4" style={{color:"white",fontWeight:"bold"}}><b style={{color:"white",fontWeight:"bold"}}>Address:</b> {`${eventInfo.address}, ${eventInfo.city}, ${eventInfo.postalCode}, ${eventInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4" style={{color:"yellow",fontWeight:"bold"}}>Your Cart Items:</h4>

                    {cartItems.map(item => (
                        <Fragment>
                            <hr />
                            <div className="cart-item my-1" key={item.service} style={{backgroundColor:"gray"}} >
                                <div className="row">
                                    <div className="col-4 col-lg-2" >
                                        <img src={item.image} alt="Laptop" height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-6">
                                        <Link to={`/service/${item.service}`} style={{color:"white",fontWeight:"bold"}}>{item.name}</Link>
                                         
                                                
                                       
                                    </div>
                                    

                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p style={{color:"yellow",fontWeight:"bold"}}><b>${(item.price).toFixed(2)}</b></p>
                                        <p style={{color:"white",fontWeight:"bold"}}>{item.date}</p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}

                </div>

                <div className="col-12 col-lg-4 my-5">
                    <div id="order_summary" style={{backgroundColor:"gray"}}>
                        <h4 style={{color:"yellow",fontWeight:"bold"}}>Order Summary</h4>
                        <hr />
                        <p style={{color:"yellow",fontWeight:"bold"}}>Subtotal:  <span className="order-summary-values" style={{color:"white",fontWeight:"bold"}}>${itemsPrice}</span></p>
                        
                        <p style={{color:"yellow",fontWeight:"bold"}}>Tax:  <span className="order-summary-values" style={{color:"white",fontWeight:"bold"}}>${taxPrice}</span></p>

                        <hr />

                        <p style={{color:"yellow",fontWeight:"bold"}}>Total: <span className="order-summary-values" style={{color:"white",fontWeight:"bold"}}>${totalPrice}</span></p>

                        <hr />
                        <button id="loginbuts" className="buttonforLogin" onClick={processToPayment} style={{width:"330px"}}>Proceed to Payment</button>
                    </div>
                </div>


            </div>

        </Fragment>
    )
}

export default ConfirmOrder