import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import Product from './ProductCard.js'
import ProductService from '../utilities/product-service.js'
import {setAlert} from './Alert.js'
import "../css/Catalog.css"
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'

function Catalog() {
    const location = useLocation()
    const search = location.state ? location.state.search : ""
    const[productList, setProductList] = useState([])
    const[data, setData] = useState([])
    const[lastPage, setLastPage] = useState(1)
    const[currentPage, setCurrentPage] = useState(0)
    const[brandFilters, setBrandFilters] = useState([])
    const[sort, setSort] = useState("")
    const[filters, setFilters] = useState({"price" : [], "brand" : []})
    const[isExpanded, setExpand] = useState(false);
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
    }, [sort, currentPage])

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

    const disablePageButtons = () => {
        currentPage === 0 ? (document.getElementById("prevButton").style.visibility="hidden") :
            (document.getElementById("prevButton").style.visibility="visible")
        currentPage === lastPage - 1 ? (document.getElementById("nextButton").style.visibility="hidden") :
            (document.getElementById("nextButton").style.visibility="visible")
    }

    const createQuery = () => {
        let queryString = `?page=${currentPage}`
        if(search !== "" && search !== null) {
            queryString += `&search=${search}`
        }
        if(sort) {
            queryString += `&sort=${sort}`
        }
        if(Object.keys(filters.price).length > 0 || Object.keys(filters.brand).length > 0) {
            queryString += `&filters=${JSON.stringify(filters)}`
        }
        console.log(queryString)

        getQuery(queryString)
    }

    const getQuery = (queryString) => {
        setProductList([])
        setData([])
        ProductService.getQuery(queryString)
            .then(res => {
                setProductList(res.data.products)
                setData(res.data)
            })
    }

    const applySort = (type, order) => {
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

    const setBrandFilter = (event) => {
        const brand = event.target.value
        let index = -1
        let currentFilter = filters
        if(event.target.classList[2] === "off") {
            event.target.className = "button-brand button-secondary on"
            currentFilter["brand"].push(brand)
        } else {
            event.target.className = "button-brand button-secondary off"
            index = currentFilter["brand"].indexOf(brand)
            if(index !== -1) {
                currentFilter["brand"].splice(index, 1)
            }
        }
        setFilters(currentFilter)
        setCurrentPage(0)
        createQuery()
    }

    const mobileFilterExpand = () => {
        var filter = document.getElementById("filter-block")
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
            <div className="mobile-sortFilter">
                <div id="sortFilter-buttons">
                    <button type="button" className="button-secondary" id="button-filter"
                        onClick={() => mobileFilterExpand()}>Filter</button>
                    <div className="dropdown-sort">
                        <button className="button-secondary">Sort By...</button>
                        <div className="sort-content">
                            <a onClick={() => applySort("name", 1)}>A-Z</a>
                            <a onClick={() => applySort("name", -1)}>Z-A</a>
                            <a onClick={() => applySort("price", 1)}>Price: Low to High</a>
                            <a onClick={() => applySort("price", -1)}>Price: High to Low</a>
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
                                <button className="button-brand button-secondary off" value={brand}
                                        onClick={(e) => setBrandFilter(e)}>{brand}</button>
                            )
                        })}

                    </div>
                </div>
            </div>
            <div className="catalog-content">
                <div className="sidebar">
                    <div className="dropdown-sort">
                        <button className="button-secondary">Sort By...</button>
                        <div className="sort-content">
                            <a onClick={() => applySort("name", 1)}>A-Z</a>
                            <a onClick={() => applySort("name", -1)}>Z-A</a>
                            <a onClick={() => applySort("price", 1)}>Price: Low to High</a>
                            <a onClick={() => applySort("price", -1)}>Price: High to Low</a>
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
                                <button className="button-brand button-secondary off" value={brand}
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
                            />
                        )
                    })}
                    <div className="page-buttons">
                        <button type="button" id="prevButton" className="button-generic" href=".main"
                                onClick={() => {
                                    setCurrentPage(page => page - 1)
                                }}>Previous
                        </button>
                        <p>Page {data.page + 1} of {lastPage}</p>
                        <button type="button" id="nextButton" className="button-generic" href=".main"
                                onClick={() => {
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