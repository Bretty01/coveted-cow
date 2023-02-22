import React, { useState, useEffect, useRef } from "react"
import ProductService from  "../utilities/product-service"
import Reviews from "./Reviews"
import "../css/ProductPage.css"
import { useStateValue } from '../StateProvider.js'
import Alert, {setAlert} from "./Alert.js"
import { useParams } from "react-router-dom"
import renderRating from "../utilities/RenderRating"
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
const ProductPage = () => {
    let {productId} = useParams()
    const initialState = {
        id: null,
        name: "",
        price: null,
        image: "",
        product_description: []
    }
    const [reviewScore, setReviewScore] = useState([<StarOutlineIcon />, <StarOutlineIcon />, <StarOutlineIcon />,
        <StarOutlineIcon />, <StarOutlineIcon />, ])
    const [product, setProduct] = useState(initialState)
    const [isRendered, setRenderState] = useState(false)
    const[{basket}, dispatch] = useStateValue()
    const descriptionTabs = [
        useRef(null),
        useRef(null),
        useRef(null)
    ]

    useEffect(() => {
        setReviewScore(renderRating(product?.reviewCount, product?.reviewScore))
    }, [product])

    useEffect(() => {
        getProduct(productId)
    }, [productId])

    useEffect(() => {
        if(isRendered){
            descriptionTabs[0].current.click()
        }
    }, [isRendered])

    const getProduct = (id) => {
        ProductService.getById(id)
            .then(res => {
                setProduct(res.data)
                setRenderState(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const addToBasket = () => {
        const quantity = parseInt(document.getElementById("input-quantity").value)
        if(quantity === "" || quantity <= 0 || !quantity) {
            setAlert("error", "Please enter a valid quantity.")
            return
        }
        for(var item in basket) {
            if(basket[item].id === product._id) {
                setAlert("notice", "You may not have more than one of the same item in your shopping cart.")
                return
            }
        }
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: quantity,
                total: product.price * quantity
            }
        })
        setAlert("success", "Successfully added " + quantity + " " + product.name + " to your shopping cart.")
    }

    const swapTabs = (e, tab) => {

        var content, tablinks;

        content = document.getElementsByClassName("content");
        for (var i = 0; i < content.length; i++) {
            content[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tab).style.display = "block";
        e.currentTarget.className += " active";
    }

    const getFutureDate = () => {
        const date = new Date()
        var tomorrow = new Date().setDate(date.getDate() + 1)
        var fiveDays = new Date().setDate(date.getDate() + 5)
        tomorrow = new Date(tomorrow)
        fiveDays = new Date(fiveDays)
        return new Intl.DateTimeFormat("en-US").format(tomorrow) + " to " +
            new Intl.DateTimeFormat("en-US").format(fiveDays)
    }

    return(
        <div className="main">
            { isRendered ? (
                <div id="main-content">
                    <strong>{product.name}</strong>
                    <div className="product-page-upper">
                        <img className="product-image" src={product.image ||
                        "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"} />
                        <div className="product-page-sales">
                            <div className="sales-upper">
                                <p><strong>${product.price}</strong></p>
                                <div className="product-page-ratings" title={product?.reviewScore}>
                                    {reviewScore.map(star => {
                                        return star
                                    })}
                                    <span><strong>{product.reviewScore}</strong>({product?.reviewCount})</span>
                                </div>
                            </div>
                            <div className="sales-middle">
                                <p>Expect your product to arrive anywhere from {getFutureDate()}</p>
                            </div>
                            <div className="product-page-checkout sales-bottom">
                                <div>
                                    <input type="number" id="input-quantity" className="button-generic"
                                           min="0" max="50"/>
                                    <button className="button-generic" onClick={addToBasket}>Add to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-page-description">{product.product_description.details}</div>

                    <div id="product-page-specs">

                        <div className="tab">
                            <button className="tablinks" ref={descriptionTabs[0]}
                                    onClick={(e) => swapTabs(e, "details")}>Details</button>
                            <button className="tablinks" ref={descriptionTabs[1]}
                                    onClick={(e) => swapTabs(e, "dimensions")}>Dimensions</button>
                            <button className="tablinks" ref={descriptionTabs[2]}
                                    onClick={(e) => swapTabs(e, "reviews")}>Reviews</button>
                        </div>
                        <div className="specs-details">
                            <div id="details" className="content">
                                <div className="row">
                                    <div className="col-4">SKU</div>
                                    <div className="col-8">{product.product_description.sku}</div>
                                </div>
                                <div className="row">
                                    <div className="col-4">Release Date</div>
                                    <div className="col-8">{product.product_description.release_date}</div>
                                </div>
                                <div className="row">
                                    <div className="col-4">Brand</div>
                                    <div className="col-8">{product.product_description.brand}</div>
                                </div>
                            </div>
                            <div id="dimensions" className="content">
                                <div className="row">
                                    <div className="col-4">Width</div>
                                    <div className="col-8">{product.product_description.specs.width} in.</div>
                                </div>
                                <div className="row">
                                    <div className="col-4">Height</div>
                                    <div className="col-8">{product.product_description.specs.height} in.</div>
                                </div>
                                <div className="row">
                                    <div className="col-4">Depth</div>
                                    <div className="col-8">{product.product_description.specs.depth} in.</div>
                                </div>
                                <div className="row">
                                    <div className="col-4">Weight</div>
                                    <div className="col-8">{product.product_description.specs.weight} lbs.</div>
                                </div>
                            </div>
                            <div id="reviews" className="content">
                                <Reviews reviewScore={product.reviewScore} reviewCount={product.reviewCount}
                                reviews={product.reviews} productId={productId}/>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="main">
                    <p>Product not found</p>
                </div>
            )}
        </div>
    )
    
    
    
}
export default ProductPage