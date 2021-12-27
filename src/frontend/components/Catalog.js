import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import Product from './ProductCard.js'
import ProductService from '../utilities/product-service.js'
import "../css/Catalog.css"
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
function Catalog() {
    const location = useLocation()
    const search = location.state || ""
    const[productList, setProductList] = useState([])
    const[data, setData] = useState([])
    const[lastPage, setLastPage] = useState(1)
    const[currentPage, setCurrentPage] = useState(0)
    const[brandFilters, setBrandFilters] = useState([])
    const[sort, setSort] = useState()
    const[filters, setFilters] = useState({"price" : [], "brand" : []})

    useEffect(() => {
        //retrieveProducts()
        getBrandList()
        console.log(search)
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

    const retrieveProducts = () => {
        setProductList([])
        ProductService.getQuery()
            .then(res => {
                setProductList(res.data.products)
                setData(res.data)
            })
            .catch(err => {
                console.log(`Unable to load products, ${err}`)
            });
    }

    const getBrandList = () => {
        ProductService.getBrandList()
            .then(res => {
                setBrandFilters(res.data.brandList)
            })
            .catch(err => {
                console.log(`Unable to load filters for the brands, ${err}`)
            })

    }

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

    const setPriceFilter = (lowVal, highVal, event) => {
        let index = -1
        let currentFilter = filters
        if(event.target.checked) {
            currentFilter["price"].push({"lowValue":lowVal, "highValue":highVal})
        } else {
            index = currentFilter["price"].map(function(o) {return o.lowValue}).indexOf(lowVal)
            if(index !== -1) {
                currentFilter["price"].splice(index, 1)
            }
        }
        setFilters(currentFilter)
        setCurrentPage(0)
        createQuery()
    }

    const setBrandFilter = (brand, event) => {
        let index = -1
        let currentFilter = filters
        if(event.target.checked) {
            currentFilter["brand"].push(brand)
        } else {
            index = currentFilter["brand"].indexOf(brand)
            if(index !== -1) {
                currentFilter["brand"].splice(index, 1)
            }
        }
        setFilters(currentFilter)
        setCurrentPage(0)
        createQuery()
    }

    return (
        <div>
            <div class="sidebar">
                <Dropdown>
                    <Dropdown.Toggle id="sortMenu" >
                        Sort By...
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => applySort("name", 1)}>A-Z</Dropdown.Item>
                        <Dropdown.Item onClick={() => applySort("name", -1)}>Z-A</Dropdown.Item>
                        <Dropdown.Item onClick={() => applySort("price", 1)}>Price: Low to High</Dropdown.Item>
                        <Dropdown.Item onClick={() => applySort("price", -1)}>Price: High to Low</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <br/>
                <Form>
                    <Form.Check type="checkbox" label="0-19.99" onClick={(e) => setPriceFilter(0, 19.99, e)}/>
                    <Form.Check type="checkbox" label="20-29.99" onClick={(e) => setPriceFilter(20, 29.99, e)}/>
                    <Form.Check type="checkbox" label="30-49.99" onClick={(e) => setPriceFilter(30, 49.99, e)}/>
                    <Form.Check type="checkbox" label="50-99.99" onClick={(e) => setPriceFilter(50, 99.99, e)}/>
                    <Form.Check type="checkbox" label="100-199.99" onClick={(e) => setPriceFilter(100, 199.99, e)}/>
                    <Form.Check type="checkbox" label="200-299.99" onClick={(e) => setPriceFilter(200, 299.99, e)}/>
                </Form>
                <br/>
                <Form id="brandFilter">
                    {brandFilters.map(brand => {
                        return(
                            <Form.Check type="checkbox" label={brand}
                                        onClick={(e) => setBrandFilter(brand, e)}/>
                        )
                    })}
                </Form>
            </div>

            <div className="catalog-content">
                <div class="row">
                    {productList.map(product => {
                        return(
                            <Product
                                sku={product.product_description.sku}
                            />
                        )
                    })}
                </div>
                <div>
                    <button type="button" id="prevButton" className="btn btn-primary"
                        onClick={() => {setCurrentPage(page => page - 1)}}>Previous</button>
                    <p>Page {data.page + 1} of {lastPage}</p>
                    <button type="button" id="nextButton" className="btn btn-primary"
                        onClick={() => {setCurrentPage(page => page + 1)}}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Catalog