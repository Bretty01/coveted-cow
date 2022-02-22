import React, {useState, useEffect} from 'react'
import CurrencyFormat from 'react-currency-format'
import {useStateValue} from '../StateProvider.js'
import {setAlert} from './Alert.js'
import '../css/Subtotal.css'

function Subtotal(){

    const getCartTotal = (basket) => {
        //Needed to grab just the cost, but the whole object was being added to the basket.
        //  The check is to make sure the price number is grabbed.
        var total = basket?.reduce((amount, item) => (amount.total || amount) + item.total)
        return total.price || total
    }
    const [{basket}, dispatch] = useStateValue();

    const processTransaction = () => {
        dispatch({
            type: 'REMOVE_ALL'
        })
    }

    return(
        <div className="subtotal">
            <CurrencyFormat
                renderText={(value) => (
                    <div>
                        <span>Total ({basket.length} items): </span>
                        <span><b>{value}</b></span>
                    </div>

                )}
                decimalScale={2}
                value={getCartTotal(basket)}
                displayType="text"
                thousandSeperator={true}
                prefix={"$"}
            />
            <div><span>PST:</span><span>6.00%</span></div>
            <div><span>GST</span><span>5.00%</span></div>
            <CurrencyFormat
                renderText={(value) => (
                    <div>
                        <span>Subtotal: </span>
                        <span><b>{value}</b></span>
                    </div>
                )}
                decimalScale={2}
                value={getCartTotal(basket) * 1.11}
                displayType="text"
                thousandSeperator={true}
                prefix={"$"}
            />
            <button onClick={processTransaction} className="button-generic button-checkout">Checkout</button>
        </div>
    )
}
export default Subtotal