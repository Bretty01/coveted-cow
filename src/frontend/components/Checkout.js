import React from 'react'
import '../css/Checkout.css'
import Subtotal from './Subtotal.js'
import { useStateValue } from '../StateProvider'
import ProductCart from './ProductCart.js'

function Checkout(){

    const[{basket}] = useStateValue();

    return(
        <div className="checkout main">
            <div className="checkout-content">
                {
                    basket.length === 0 ? (
                        <div className="basket-zero">
                            <h2 className="checkout-title">Your shopping basket is empty.</h2>
                            <p>Any items you wish to purchase will display here.</p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="basketTitle">Items in the Shopping Basket:</h2>
                            {
                                basket.map(item => (
                                    <ProductCart
                                        id={item.id}
                                        name={item.name}
                                        image={item.image}
                                        price={item.price}
                                        quantity={item.quantity}
                                        total={item.total}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </div>
            {
                basket.length > 0 && (
                    <div className="checkout-subtotal">
                        <Subtotal/>
                    </div>
                )
            }
        </div>
    )
}

export default Checkout