import React, { Fragment, useState, useEffect } from 'react'
import MetaData from './Layout/Metadata'
import axios from 'axios';
import BG from './Layout/BG'
import Service from './Service/Service';

import Pagination from 'react-js-pagination'

const categories = [
    'Digital Marketing',
    'Social Media Management',
    'Graphics & Video Production',
    'Web Development',
    'Customer Service & QA',
    'Project Management',
    'Photography',
    'KOL',
    'Studio Services',
    'PC/Mobile Game Management'
   
]

const Home = () => {
    // const [loading, setLoading] = useState(true)
    const [service, setService] = useState([])
    const [error, setError] = useState()
    const [serviceCount, setServiceCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [resPerPage, setResPerPage] = useState(0)
    const [category, setCategory] = useState('');

    
    const getService = async () => {
        let link = `http://localhost:4001/api/v1/service`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setService(res.data.services)
      
        setResPerPage(res.data.resPerPage)
        setServiceCount(res.data.serviceCount)
        // setLoading(false)

    }
    let count = serviceCount;
    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        getService()
    }, [])
    //  console.log(service)
    return (
        <Fragment>
           
                <Fragment>
                    <MetaData title={'Myrmidons Shop'} />
                    <BG/>
                    <div className="container container-fluid">
                        <h1 id="products_heading">Services</h1>
                        <section id="products" className="container mt-5">
                            <div className="row">
                                {service && service.map(service => (
                                    <Service key={service._id} service={service} col={4} />
                                    
                                ))}
                            </div>

                        </section>

                        {resPerPage <= count && (
                            <div className="d-flex justify-content-center mt-5">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resPerPage}
                                    totalItemsCount={serviceCount}
                                    onChange={setCurrentPageNo}
                                    nextPageText={'Next'}
                                    prevPageText={'Prev'}
                                    firstPageText={'First'}
                                    lastPageText={'Last'}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>)}
                    </div>
                </Fragment>


           
        </Fragment>

    )
}

export default Home