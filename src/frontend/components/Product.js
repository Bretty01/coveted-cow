import React, { useState, useEffect } from 'react'
import '../css/Product.css'
import { useStateValue } from '../StateProvider.js'
import ProductService from '../utilities/product-service.js'

function Product(props){
    //const[{basket}, dispatch] = useStateValue()
    const[products, setProducts] = useState([])
    useEffect(() => {
        retrieveProducts();
    }, [])

    //console.log('basket content', basket)
    /*
    const addToBasket = () => {
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: id,
                title: title,
                image: image,
                price: price,
                rating: rating
            }
        })
    }*/

    const retrieveProducts = () => {
        if(props.sku !== undefined) {
            ProductService.find(parseInt(props.sku), "sku")
                .then(res => {
                    console.log(res.data);
                    setProducts(res.data.products)
                })
                .catch(err => {
                    console.log(`Unable to load products, ${err}`);
                });
        }
        else{
            ProductService.getAll()
                .then(res => {
                    console.log(res.data);
                    setProducts(res.data.products);
                })
                .catch(err => {
                    console.log(`Unable to load products, ${err}`);
                });
        }
    };
    return (
        <div className="product col-12 col-sm-6">
                <img src={products[0]?.image || "https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"}
                     alt="Product Image" />
                <div className="product_info">
                    <p>{products[0]?.name || ""}</p>
                    <p className="product_price">
                        <small>$</small>
                        <strong>{products[0]?.price || "0"}</strong>
                    </p>
                </div>
               { /*
                <button onClick={addToBasket}>Add to Basket</button>*/ }
        </div>
    )
}
export default Product