import React, { Fragment, useState, useEffect } from 'react'
import MetaData from './Layout/Metadata'
import axios from 'axios';
import Portfolio from './Team/Portfolio';
import Pagination from 'react-js-pagination'

const TeamPortfolio = () => {
    // const [loading, setLoading] = useState(true)
    const [portfolio, setPort] = useState([])
    const [error, setError] = useState()
    const [serviceCount, setServiceCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [resPerPage, setResPerPage] = useState(0)
    const [category, setCategory] = useState('');

    const getPort = async () => {
        let link = `http://localhost:4001/api/v1/members`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setPort(res.data.team)    
        setResPerPage(res.data.resPerPage)
        // setServiceCount(res.data.serviceCount)
        // setLoading(false)
    }
    // let count = serviceCount;
    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        getPort()
    }, [])
    //  console.log(service)
    return (
        <Fragment>
           
                <Fragment>
                    <MetaData title={'Myrmidons Shop'} />
                    
                    <div className="container container-fluid">
                        
                        <section id="portfolio" className="container mt-5">
                            <div className="row">
                                {portfolio && portfolio.map(portfolio => (
                                    <Portfolio key={portfolio._id} portfolio={portfolio} col={4} /> 
                                ))}
                            </div>
                        </section>
                        {/* 
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
                            </div>)} */}
                    </div>
                </Fragment>
        </Fragment>

    )
}

export default TeamPortfolio