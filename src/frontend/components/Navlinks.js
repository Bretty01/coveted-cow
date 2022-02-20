import React from 'react'
import '../css/Navlinks.css'
import { Link } from 'react-router-dom';
function Navlinks(){
    return(
        <div className="nav-links">
            <Link to="/catalog">Products</Link>
            <Link>Customer Service</Link>
            <Link>Gift Cards</Link>
            <Link>Registry</Link>
            <Link>Sell</Link>
        </div>
    )
}
export default Navlinks