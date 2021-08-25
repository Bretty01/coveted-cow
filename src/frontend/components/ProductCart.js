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
            <img className="productCart_image" src={image} alt="" />
            <div className="productCart_info">
                <p className="productCart_title">{title}</p>
                <p className="productCart_price">${price}</p>

                <div className="productCart_rating">
                    {
                        Array(rating)
                            .fill()
                            .map((_) => (
                            <span>*</span>
                        ))
                    }
                </div>
                <button onClick={removeItem}>Remove from the cart</button>
            </div>
        </div>
    )
}

export default ProductCart