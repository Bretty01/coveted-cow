import React from 'react';
import {Search, ShoppingBasket} from "@material-ui/icons";
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.js'
import '../css/Header.css';
import {auth} from '../Firebase.js'
function Header() {
    const [{basket, loggedinuser}, dispatch] = useStateValue();

    const logoutUser = () => {
        if(loggedinuser){
            auth.signOut();
        }
    }

    return(
        <nav className="header">
            <Link to="/" className>
                <img className="header_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo"/>
            </Link>
            <div className="header_search">
                <input type="text" className="header_searchInput"/>
                <Search className="header_searchIcon" />
            </div>
            <div className="header_nav">
                <Link to={!loggedinuser && "/login"} className="header_link">
                    <div onClick={logoutUser} className="header_option">
                        <span className="header_optionOne">Hello, {loggedinuser?.email}</span>
                        <span className="header_optionTwo">{loggedinuser ? 'Sign Out' : 'Sign In'}</span>
                    </div>
                </Link>
            </div>
            <Link to="/checkout" className="header_link">
                <div className="header_optionBasket">
                    <ShoppingBasket/>
                    <span className="header_optionTwo header_productCount">{basket?.length}</span>
                </div>
            </Link>
        </nav>
    )
}

export default Header