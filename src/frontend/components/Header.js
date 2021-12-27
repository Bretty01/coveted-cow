import React, {useState} from 'react';
import {Search, ShoppingBasket, Menu} from "@material-ui/icons";
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.js'
import '../css/Header.css';
import {auth} from '../Firebase.js'
import {Container} from 'react-bootstrap'
function Header() {
    const [inputText, setInputText] = useState("")
    const [{basket, loggedinuser}, dispatch] = useStateValue();
    const logoutUser = () => {
        if(loggedinuser){
            auth.signOut();
        }
    }

    const handleInput = (event) => {
        setInputText(document.getElementsByClassName("header_searchInput")[0].value)
    }
    return(
    <div className="header">
        <Container fluid className="header-mobile">
            <Menu className="header-menu"/>
            <img className="header_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo"/>
            <div className="header-end">
                <Search className="header-searchIcon"/>
                <ShoppingBasket/>
            </div>

        </Container>
        <Container fluid className="header-desktop">
                <Link to="/" className>
                    <img className="header_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo"/>
                </Link>
                <div className="header-searchIcon">
                    <input type="text" className="header_searchInput" onChange={handleInput}/>
                    {//TODO: Fix where search was not working when on catalog page (maybe use POST?)
                    }
                    <Link to={{
                        pathname: "/catalog",
                        state:{search: inputText}
                    }}>
                        <Search className="header-searchIcon"/>
                    </Link>
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
            </Container>
        </div>
    )
}

export default Header