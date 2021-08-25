import React from 'react'
import '../css/Navlinks.css'
import { Link } from 'react-router-dom';
function Navlinks(){
    return(
        <div className="nav_links">
            <div className="nav_links_outer">
                <div className="nav_links_inner">
                    <Link>Today's Deals</Link>
                    <Link>Customer Service</Link>
                    <Link>Gift Cards</Link>
                    <Link>Registry</Link>
                    <Link>Sell</Link>
                </div>
            </div>
        </div>
    )
}
export default Navlinks