import React from 'react'
import '../css/ProductCart.css'
import {useStateValue} from '../StateProvider.js'

function ProductCart({id, title, image, price, rating}){
    const [{basket}, dispatch] = useStateValue();

    const removeItem = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            id: id
        })
    }

    return(
        <div className="productCart">
            <img className="productCart-image" src={image} alt="" />
            <div className="productCart-info">
                <p className="productCart-title">{title}</p>
                <p className="productCart-price">${price}</p>

                {
                    //TODO: Add rating system.
                }
                <button onClick={removeItem}>Remove from the cart</button>
            </div>
        </div>
    )
}

export default ProductCart