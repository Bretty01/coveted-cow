import React, {useState, useEffect, useRef} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Product from './ProductCard.js'
import ProductService from '../utilities/product-service.js'
import {setAlert} from './Alert.js'
import "../css/Catalog.css"
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'

function Catalog() {
    const location = useLocation()
    const {search} = useParams()
    //useState variables
    const[productList, setProductList] = useState([])
    const[data, setData] = useState([])
    const[lastPage, setLastPage] = useState(1)
    const[currentPage, setCurrentPage] = useState(0)
    const[brandFilters, setBrandFilters] = useState([])
    const[sort, setSort] = useState("")
    const[filters, setFilters] = useState({"price" : [], "brand" : []})
    const[isExpanded, setExpand] = useState(false)
    //useRef variables
    const topRef = useRef(null)
    //useEffect callbacks
    useEffect(() => {
        getBrandList()
    }, [])
    useEffect(() => {
        calculatePageNumber()
    }, [data])
    useEffect(() => {
        disablePageButtons()
    }, [lastPage])
    useEffect(() => {
        createQuery()
    }, [sort, currentPage, search])

    /**
     * Function: getBrandList
     * Purpose: Get every unique brand and sets them as a filter.
     */
    const getBrandList = () => {
        ProductService.getBrandList()
            .then(res => {
                setBrandFilters(res.data.brandList)
            })
            .catch(err => {
                console.log(`Unable to load filters for the brands, ${err}`)
            })

    }

    /**
     * Function: calculatePageNumber
     * Purpose: Displays how many pages there are to the user.
     */
    const calculatePageNumber = () => {
        const remainderProduct = data.total_results % data.entries_per_page
        const totalPages = parseInt(data.total_results / data.entries_per_page)
        data.total_results <= data.entries_per_page ? (setLastPage(1)) : (
            remainderProduct === 0 ? (setLastPage(totalPages)) : (setLastPage(totalPages + 1))
        )
    }

    /**
     * Function: disablePageButtons
     * Purpose: Determines which if either of the "Previous" and "Next" buttons are disabled or not.
     * If on last page -> Next button is disabled
     * If on first page -> Previous button is disabled
     * If there is only 1 page -> Both buttons are disabled
     */
    const disablePageButtons = () => {
        currentPage === 0 ? (document.getElementById("prevButton").style.visibility="hidden") :
            (document.getElementById("prevButton").style.visibility="visible")
        currentPage === lastPage - 1 ? (document.getElementById("nextButton").style.visibility="hidden") :
            (document.getElementById("nextButton").style.visibility="visible")
    }

    /**
     * Function: createQuery
     * Purpose: Parses together a query that can be passed into the backend by a GET http request.
     */
    const createQuery = () => {
        let queryString = `?page=${currentPage}`
        //search is obtained by the URL
        // ex: "/catalog/cow" the search term would be "cow"
        if(search && search !== "") {
            queryString += `&search=${search}`
        }
        if(sort) {
            queryString += `&sort=${sort}`
        }
        if(Object.keys(filters.price).length > 0 || Object.keys(filters.brand).length > 0) {
            queryString += `&filters=${JSON.stringify(filters)}`
        }
        getQuery(queryString)
    }

    /**
     * Function: getQuery
     * Purpose: Passes the built query into the api and sets the results.
     * @param queryString The finished query string to be sent out.
     */
    const getQuery = (queryString) => {
        //Future Brett should check if Past Brett did the right thing here. Present Brett doesnt think it does anything
        // setting the state right here.
        setProductList([])
        setData([])

        //Pass the query string into the API and set the data.
        ProductService.getQuery(queryString)
            .then(res => {
                setProductList(res.data.products)
                setData(res.data)
            })
    }

    /**
     * Function: applySort
     * Purpose: Takes the passed in sort values, and updates the state so it's the new sort value. The new sort value
     * will then be taken to create a new query.
     * @param type The type of sort (sort by alphabet, sort by price, etc.)
     * @param order The order in which the sort is applied (1 = ascending, -1 = descending)
     */
    const applySort = (type, order) => {
        //Reset the page to page 1
        setCurrentPage(0)
        setSort(`${type},${order}`)
    }

    /**
     * Function: setPriceFilter
     * Purpose: Get the price number boxes and create a query to send to the backend.
     * @param event Form event handlers for the price boxes.
     */
    const setPriceFilter = (event) => {
        var lowVal
        var highVal
        //Value different between mobile and desktop versions.
        if(window.screen.width >= 768) {
            lowVal = parseFloat(document.getElementsByClassName("price-low")[1].value)
            highVal = parseFloat(document.getElementsByClassName("price-high")[1].value)
        }
        else {
            lowVal = parseFloat(document.getElementsByClassName("price-low")[0].value)
            highVal = parseFloat(document.getElementsByClassName("price-high")[0].value)
        }
        let currentFilter = filters
        //Set the price filter only if both number boxes are filled, otherwise the filter is invalid and submit no
        //  price filter
        if(lowVal && highVal) {
            if(currentFilter["price"]){
                currentFilter["price"] = []
            }
            currentFilter["price"].push({"lowValue":lowVal, "highValue":highVal})
        }
        else {
            currentFilter["price"] = []
        }
        setFilters(currentFilter)
        setCurrentPage(0)
        createQuery()
    }

    /**
     * Function: setBrandFilter
     * Purpose: Takes the brand based on the button clicked, and adds it to the filter. Removes the brand from the
     * filter if the button is no longer active.
     * @param event Event handler for the button pressed.
     */
    const setBrandFilter = (event) => {
        const brand = event.target.value
        let index = -1
        let currentFilter = filters
        //Enable the button and pass the brand to the filter.
        if(event.target.classList[2] === "off") {
            event.target.className = "button-brand button-secondary on"
            currentFilter["brand"].push(brand)
        }
        //Disable the button and remove the brand from the filter.
        else {
            event.target.className = "button-brand button-secondary off"
            index = currentFilter["brand"].indexOf(brand)
            if(index !== -1) {
                currentFilter["brand"].splice(index, 1)
            }
        }
        //Update the filters, reset the page number and set the updated product query.
        setFilters(currentFilter)
        setCurrentPage(0)
        createQuery()
    }

    /**
     * Function: mobileFilterExpand
     * Purpose: Extends or retracts the window for the filter section on mobile devices.
     */
    const mobileFilterExpand = () => {
        let filter = document.getElementById("filter-block")
        if(isExpanded) {
            filter.className = "";
            setExpand(false);
        }
        else {
            filter.className = "expand"
            setExpand(true);
        }
    }

    return (
        <div className="main">
            {
                //Mobile sorts and filters dropdown at top of page.
            }
            <div className="mobile-sortFilter">
                <div id="sortFilter-buttons">
                    <button type="button" className="button-secondary" id="button-filter"
                        onClick={() => mobileFilterExpand()}>Filter</button>
                    <div className="dropdown-sort">
                        <button className="button-secondary">Sort By...</button>
                        <div className="sort-content">
                            <button onClick={() => applySort("name", 1)}>A-Z</button>
                            <button onClick={() => applySort("name", -1)}>Z-A</button>
                            <button onClick={() => applySort("price", 1)}>Price: Low to High</button>
                            <button onClick={() => applySort("price", -1)}>Price: High to Low</button>
                        </div>
                    </div>
                </div>
                <div id="filter-block">
                    <div className="filter-price">
                        <h4>Price</h4>
                        <div>
                            <input type="number" className="price-low"/>
                            <span>to</span>
                            <input type="number" className="price-high"/>
                        </div>
                        <button className="button-secondary" onClick={(e) => setPriceFilter(e)}>Update</button>
                    </div>
                    <div id="brandFilter">
                        <h4>Brand</h4>
                        {brandFilters.map(brand => {
                            return (
                                <button key={brand} className="button-brand button-secondary off" value={brand}
                                        onClick={(e) => setBrandFilter(e)}>{brand}</button>
                            )
                        })}

                    </div>
                </div>
            </div>
            {
                //Main product catalog section
            }
            <div className="catalog-content"  ref={topRef}>
                {
                    //Side fixed bar containing the sorts and filters for desktop
                }
                <div className="sidebar">
                    <div className="dropdown-sort">
                        <button className="button-secondary">Sort By...</button>
                        <div className="sort-content">
                            <button onClick={() => applySort("name", 1)}>A-Z</button>
                            <button onClick={() => applySort("name", -1)}>Z-A</button>
                            <button onClick={() => applySort("price", 1)}>Price: Low to High</button>
                            <button onClick={() => applySort("price", -1)}>Price: High to Low</button>
                        </div>
                    </div>
                    <div className="filter-price">
                        <h4>Price</h4>
                        <div>
                            <input type="number" className="price-low"/>
                            <span>to</span>
                            <input type="number" className="price-high"/>
                        </div>
                        <button className="button-secondary" onClick={(e) => setPriceFilter(e)}>Update</button>
                    </div>
                    <div id="brandFilter">
                        <h4>Brand</h4>
                        {brandFilters.map(brand => {
                            return (
                                <button key={brand} className="button-brand button-secondary off" value={brand}
                                        onClick={(e) => setBrandFilter(e)}>{brand}</button>
                            )
                        })}

                    </div>
                </div>
                <div className="row">
                    {productList?.map(product => {
                        return(
                            <Product
                                sku={product.product_description.sku}
                                key={product.product_description.sku}
                            />
                        )
                    })}
                    <div className="page-buttons">
                        <button type="button" id="prevButton" className="button-generic"
                                onClick={() => {
                                    topRef.current.scrollIntoView()
                                    setCurrentPage(page => page - 1)
                                }}>Previous
                        </button>
                        <p>Page {data.page + 1} of {lastPage}</p>
                        <button type="button" id="nextButton" className="button-generic"
                                onClick={() => {
                                    topRef.current.scrollIntoView()
                                    setCurrentPage(page => page + 1)
                                }}>Next
                        </button>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Catalog