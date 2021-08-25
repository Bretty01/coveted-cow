import React from 'react'
import '../css/Checkout.css'
import Subtotal from './Subtotal.js'
import { useStateValue } from '../StateProvider'
import ProductCart from './ProductCart.js'

function Checkout(){

    const[{basket}] = useStateValue();

    return(
        <div className="checkout">
            <div className="checkout_left">
                {
                    basket.length === 0 ? (
                        <div>
                            <h2 className="checkout_title">Your shopping basket is empty.</h2>
                            <p>Any items you wish to purchase will display here.</p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="basketTitle">Items in the Shopping Basket:</h2>
                            {
                                basket.map(item => (
                                    <ProductCart
                                        id={item.id}
                                        title={item.title}
                                        image={item.image}
                                        price={item.price}
                                        rating={item.rating}
                                    />
                                ))
                            }
                        </div>
                    )

                }

            </div>
            {
                basket.length > 0 && (
                    <div className="checkout_right">
                        <Subtotal/>
                    </div>
                )
            }
        </div>
    )
}

export default Checkout