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

    useEffect(() => {
        getProduct(props.match.params.id)
    }, [props.match.params.id])

    useEffect(() => {
        var tabs = document.getElementsByClassName("tablinks")
        if(tabs && tabs.length > 0) {
            tabs[0].click()
        }
    }, [isRendered])

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
    return(
        <div id="top">
            { isRendered ? (
                <div id="main-content">
                    <h2>{product.name}</h2>
                    <div className="product-page-upper">
                        <img className="product-image" src={product.image || "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"} />
                        <div className="product-page-sales">
                            <p><strong>${product.price}</strong></p>
                            <div className="product-page-checkout">
                                <input type="number" className="input-quantity button-generic" min="0" max="50"/>
                                <button className="button-generic">Add to Checkout</button>
                            </div>
                        </div>
                    </div>
                    <div className="product-page-description">{product.product_description.details}</div>

                    <div id="specs">
                        <div className="tab">
                            <button className="tablinks" onClick={(e) => swapTabs(e, "details")}>Details</button>
                            <button className="tablinks" onClick={(e) => swapTabs(e, "dimensions")}>Dimensions</button>
                        </div>
                        <div className="container">
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