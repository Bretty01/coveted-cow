import React from 'react'
import '../css/ProductCart.css'
import {useStateValue} from '../StateProvider.js'

function ProductCart({id, name, image, price, quantity, total}){
    const [{basket}, dispatch] = useStateValue();

    const removeItem = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            id: id
        })
    }

    return(
        <div className="productCart">
            <div className="productCart-upper">
                <img className="productCart-image" src={image} alt="" />
            </div>
            <div className="productCart-info">
                <div className="productCart-title">
                    <p className="productCart-title">{name}</p>
                </div>
                <div className="productCart-price">
                    <p>Cost:</p>
                    <p>${price}</p>
                </div>
                <div className="productCart-quantity">
                    <p>Quantity: </p>
                    <p>{quantity}</p>
                </div>
                <div className="productCart-total">
                    <p>Total: </p>
                    <p>{total}</p>
                </div>

                {
                    //TODO: Add rating system.
                }

                <button class="button-generic" onClick={removeItem}>Remove</button>
            </div>
        </div>
    )
}

export default ProductCart