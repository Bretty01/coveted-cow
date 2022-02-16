import React, { useState, useEffect } from 'react'
import '../css/Product.css'
import { useStateValue } from '../StateProvider.js'
import ProductService from '../utilities/product-service.js'
import { Link } from 'react-router-dom'

function ProductCard(props){
    const[products, setProducts] = useState([])
    useEffect(() => {
        retrieveProducts()
    }, [])



    const retrieveProducts = () => {
        if(props.sku !== undefined) {
            ProductService.find(parseInt(props.sku), "sku")
                .then(res => {
                    setProducts(res.data.products)
                })
                .catch(err => {
                    console.log(`Unable to load products, ${err}`);
                });
        }
        else{
            ProductService.getAll()
                .then(res => {
                    setProducts(res.data.products);
                })
                .catch(err => {
                    console.log(`Unable to load products, ${err}`);
                });
        }
    };
    return (
        <Link to={location => products.length > 0 && `/product/${products[0]._id}`} className="product col-12 col-md-3">
            <img src={products[0]?.image || "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"}
                 alt="Product Image" />
            <div className="product_info">
                <p>{products[0]?.name || ""}</p>
                <p className="product-price">
                    <strong>${products[0]?.price || "0"}</strong>
                </p>
            </div>
            { /*
                <button onClick={addToBasket}>Add to Basket</button>*/ }
        </Link>
    )
}
export default ProductCard