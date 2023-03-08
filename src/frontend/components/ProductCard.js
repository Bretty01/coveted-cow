import React, { useState, useEffect } from 'react'
import '../css/Product.css'
import { useStateValue } from '../StateProvider.js'
import ProductService from '../utilities/product-service.js'
import { Link } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import renderRating from '../utilities/RenderRating'

function ProductCard(props){
    //useState variables
    const[products, setProducts] = useState([])
    const [reviewScore, setReviewScore] = useState([<StarOutlineIcon />, <StarOutlineIcon />, <StarOutlineIcon />,
        <StarOutlineIcon />, <StarOutlineIcon />, ])
    //useEffect callbacks
    useEffect(() => {
        retrieveProducts()
    }, [])
    useEffect(() => {
        if(products[0]?.reviews) {
            setReviewScore(renderRating(products[0].reviewCount, products[0].reviewScore))
        }
    }, [products])

    /**
     * Function: retrieveProducts
     * Purpose: Gets the product information based on the sku provided and sets the product card based on the returned
     *  information.
     */
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
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(`Unable to load products, ${err}`);
                });
        }
    };
    return (
        <Link to={"/product/" + products[0]?._id}
              className="product col-12 col-md-4 col-lg-3">
            <img src={products[0]?.image ? ("/images" + products[0]?.image) : "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"}
                 alt="Product Image" />
            <div className="product_info">
                <span>{products[0]?.name || ""}</span>
                <div className="star-rating">{reviewScore.map(star => {
                    return star
                })}({products[0]?.reviewCount})</div>
                <span className="product-price"><strong>${products[0]?.price || "0"}</strong></span>
            </div>
        </Link>
    )
}
export default ProductCard