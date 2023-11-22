import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ event, confirmOrder, payment }) => {
    return (
        <div className="checkout-progress d-flex justify-content-center mt-5">

            {event ? <Link to='/event' className="float-right">
                <div className="triangle2-active"></div>
                <div className="step active-step">Event Location/Details</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Event Location/Details</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

            {confirmOrder ? <Link to='/order/confirm' className="float-right">
                <div className="triangle2-active"></div>
                <div className="step active-step">Confirm Event</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Confirm Event</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

            {payment ? <Link to='/payment' className="float-right">
                <div className="triangle2-active"></div>
                <div className="step active-step">Event Payment</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Event Payment</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

        </div>
    )
}

export default CheckoutSteps