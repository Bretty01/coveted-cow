import React from 'react'
import '../css/Navlinks.css'
import { Link } from 'react-router-dom';
function Navlinks(){
    return(
        <div className="nav-links">
            <Link to="/catalog" className="button-secondary">Products</Link>
            <Link to="/about" className="button-secondary">About</Link>
            <Link to="/account" className="button-secondary">Account</Link>
        </div>
    )
}
export default Navlinks