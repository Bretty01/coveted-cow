import React from 'react'
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
                    <p>
                        Subtotal({basket.length} items) : <b>{`${value}`}</b>
                    </p>
                )}
                decimalScale={2}
                value={getCartTotal(basket)}
                displayType={"text"}
                thousandSeperator={true}
                prefix={"$"}
            />
            <button onClick={processTransaction} className="checkout_button">Checkout</button>
        </div>
    )
}
export default Subtotal