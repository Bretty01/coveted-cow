import React from 'react'
import {Carousel} from 'react-bootstrap'
import '../css/Home.css'
import Product from './ProductCard.js'
import ProductService from "../utilities/product-service.js"

function Home(){
    return(

        <div className="home">
            <Carousel fade controls={false} id="home-carousel" className="d-block">
                <Carousel.Item>
                    <img
                        className="rounded d-block w-100"
                        src="https://m.media-amazon.com/images/I/81us3MK2yfL._AC_SL1500_.jpg"
                        alt="Carousel 1"
                    />
                    <Carousel.Caption className="text-dark w-100 position-relative">
                        <h3>Oh My!</h3>
                        <p>That is quite the floof!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="rounded d-block"
                        src="https://m.media-amazon.com/images/I/41-ya4K3XlL._AC_.jpg"
                        alt="Carousel 2"
                    />
                    <Carousel.Caption className="text-dark w-100 position-relative">
                        <h3>Oh Dear!</h3>
                        <p>I don't know if I can handle that much floof!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="rounded d-block"
                        src="https://m.media-amazon.com/images/I/91lJdPSCBSL._AC_SL1500_.jpg"
                        alt="Carousel 3"
                    />
                    <Carousel.Caption className="text-dark w-100 position-relative">
                        <h3>DANGER!</h3>
                        <p>FLOOF OVERLOAD!</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div>
                <h1>Today's deals</h1>
                <div className="row home-row">

                    <Product
                        sku={15688421}
                    />
                    <Product
                        sku={14955531}
                    />
                    <Product
                        sku={10177818}
                    />
                    <Product
                        sku={17400959}
                    />
                </div>
            </div>
        </div>
    )
}
export default Home