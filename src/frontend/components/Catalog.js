import React, {useState, useEffect} from 'react'
import Product from './ProductCard.js'
import ProductService from '../utilities/product-service.js'

function Catalog() {
    const[productList, setProductList] = useState([])
    const[data, setData] = useState([])
    const[lastPage, setLastPage] = useState(1)
    useEffect(() => {
        retrieveProducts(0);
    }, [])
    useEffect(() => {
        calculatePageNumber()
        disablePageButtons()
    }, [data])

    const retrieveProducts = (num) => {
        setProductList([])
        ProductService.getAll(num)
            .then(res => {
                setProductList(res.data.products)
                setData(res.data)
                console.log(res)
            })
            .catch(err => {
                console.log(`Unable to load products, ${err}`)
            });
    }

    const calculatePageNumber = () => {
        const remainderProduct = data.total_results % data.entries_per_page
        const totalPages = parseInt(data.total_results / data.entries_per_page)
        remainderProduct === 0 ? (setLastPage(totalPages)) : (setLastPage(totalPages + 1))
    }

    const disablePageButtons = () => {
        data.page === 0 ? (document.getElementById("prevButton").style.visibility="hidden") :
            (document.getElementById("prevButton").style.visibility="visible")
        data.page === lastPage - 1 ? (document.getElementById("nextButton").style.visibility="hidden") :
            (document.getElementById("nextButton").style.visibility="visible")
    }

    return (
        <div>
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
                    onClick={() => {retrieveProducts(data.page - 1)}}>Previous</button>
                <p>Page {data.page + 1} of {lastPage}</p>
                <button type="button" id="nextButton" className="btn btn-primary"
                    onClick={() => {retrieveProducts(data.page + 1)}}>Next</button>
            </div>
        </div>
    )
}

export default Catalog