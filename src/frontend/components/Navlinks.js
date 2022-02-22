import React from 'react'
import '../css/Navlinks.css'
import { Link } from 'react-router-dom';
function Navlinks(){
    return(
        <div className="nav-links">
            <Link to="/catalog" className="button-secondary">Products</Link>
            <Link className="button-secondary">Customer Service</Link>
            <Link className="button-secondary">Gift Cards</Link>
            <Link className="button-secondary">Registry</Link>
            <Link className="button-secondary">Sell</Link>
        </div>
    )
}
export default Navlinks