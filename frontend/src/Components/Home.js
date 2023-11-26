import React, { Fragment, useState, useEffect } from 'react'
import MetaData from './Layout/Metadata'
import axios from 'axios';
import BG from './Layout/BG'
import Service from './Service/Service';
import CloseIcon from '@mui/icons-material/Close';
import Search from "./Layout/Search";
import Pagination from 'react-js-pagination'
import { useParams,useNavigate } from "react-router-dom";
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
    const [filteredServiceCount, setFilteredServiceCount] = useState(0)
    const [category, setCategory] = useState("");
    let { keyword } = useParams();
    let navigate = useNavigate();
    const getService = async (page = 1, keyword = "") => {
        let link = `http://localhost:4001/api/v1/service?page=${page}`;

        if (keyword) {
            link += `&keyword=${keyword}`;
        }

        if (category) {
            navigate('/')
            link += `&category=${category}`;
        }
        
        
        
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setService(res.data.services)
        setFilteredServiceCount(res.data.filteredServiceCount)
        setResPerPage(res.data.resPerPage)
        setServiceCount(res.data.serviceCount)
        // setLoading(false)

    }
    let count = serviceCount;
    if (keyword) {
        count = filteredServiceCount;
      }
    
    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    // useEffect(() => {
    //     getService(currentPage, category,keyword)
    // }, [currentPage, category,keyword])
    // //  console.log(service)
    const clearCategory = () => {
        setCategory("");
      };
    useEffect(() => {
        setCurrentPage(1); // Reset current page when keyword changes
    }, [keyword]);

    useEffect(() => {
        getService(currentPage,keyword,category);
    }, [currentPage, category, keyword]);
    return (
        <Fragment>
           
                <Fragment>
                    <MetaData title={'Myrmidons Shop'} />
                    <BG/>
                    <br/>
                    <div className="container">
                        <h1 id="products_heading">Categories</h1>
                        <br/>
                    </div>
                    <ul
          className="pl-0" 
          style={{ display: "flex", listStyle: "none", padding: 0 }}
        >
            
          {categories.map((cat) => (
            <li
              key={cat}
              className={`category_btn ${category === cat ? "active" : ""}`}
              style={{
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </li>
          ))}
          
          {category && (
            
            <li className="clear_btn" onClick={clearCategory}>
             
              <CloseIcon/> Clear
            </li>
          )}
        </ul>
        <div className="container" style={{display: "relative",justifycontent: "center", width: "975px", backgroundColor:"gray"}}>
          <Search />
        </div>
        
                    <div className="container container-fluid">
                        <h1 id="products_heading">Services</h1>
                        <section id="products" className="container mt-5">
                            <div className="row">
                                {service && service.map(service => (
                                    <Service key={service._id} service={service} col={3} />
                                    
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