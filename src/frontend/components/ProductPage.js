import React, { useState, useEffect } from "react"
import ProductService from  "../utilities/product-service"
import "../css/ProductPage.css"

const ProductPage = props => {
    const initialState = {
        id: null,
        name: "",
        price: null,
        image: "",
        product_description: []
    }
    const [product, setProduct] = useState(initialState)
    const [isRendered, setRenderState] = useState(false)
    
    const getProduct = (id) => {
        console.log(product)
        ProductService.getById(id)
            .then(res => {
                setProduct(res.data)
                setRenderState(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getProduct(props.match.params.id)
    }, [props.match.params.id])


    return(
        <div id="top">
            { isRendered ? (
                <div>
                    <h2>{product.name}</h2>
                    <div className="product-page-upper">
                        <img className="product-image" src={product.image || "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"} />
                        <div className="product-page-sales">
                            <h3><strong>$</strong>{product.price}</h3>
                            <div className="product-page-checkout">Checkout</div>
                        </div>
                    </div>
                    <div className="container">{product.product_description.details}</div>

                    <h2>Details</h2>
                    <div className="container">
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
                        <div className="row">
                            <div className="row">
                                <div className="col-4">Dimensions</div>
                            </div>
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
                    </div>
                </div>
            ) : (
                <div>
                    <p>Product not found</p>
                </div>
            )}
        </div>
    )
    
    
    
}
export default ProductPage