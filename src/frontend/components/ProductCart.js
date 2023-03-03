import React from 'react'
import '../css/ProductCart.css'
import {useStateValue} from '../StateProvider.js'
import CurrencyFormat from 'react-currency-format'

function ProductCart({id, name, image, price, quantity, total}){
    const [{basket}, dispatch] = useStateValue();

    /**
     * Function: removeItem
     * Purpose: on clicking the "Remove" button, pass in the "REMOVE_FROM_CART" function to remove the item from the
     *  shopping cart.
     */
    const removeItem = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            id: id
        })
    }

    return(
        <div className="productCart">
            <div className="productCart-upper">
                <img className="productCart-image" src={"/images" + image} alt={name} />
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
                    <CurrencyFormat
                        renderText={(value) => (
                            <p>{value}</p>
                        )}
                        decimalScale={2}
                        value={total}
                        displayType="text"
                        thousandSeperator={true}
                        prefix={"$"}
                    />
                </div>
                <button className="button-generic" onClick={removeItem}>Remove</button>
            </div>
        </div>
    )
}

export default ProductCart