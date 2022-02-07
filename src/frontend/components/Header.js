import React, {useState, useEffect} from 'react';
import {Search, ShoppingBasket, Menu} from "@material-ui/icons";
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.js'
import '../css/Header.css';
import {auth} from '../Firebase.js'
import {Container} from 'react-bootstrap'
function Header() {
    const [inputText, setInputText] = useState("")
    const [menuSwitch, setMenuSwitch] = useState(-1)
    const [{basket, loggedinuser}, dispatch] = useStateValue();
    const logoutUser = () => {
        if(loggedinuser){
            auth.signOut();
        }
    }
    useEffect(() => {
        menuAnimation()
    }, [menuSwitch])

    const handleInput = (event) => {
        setInputText(document.getElementsByClassName("header_searchInput")[0].value)
    }

    const changeMenuState = () => {
        setMenuSwitch((menuSwitch === 0) ? 1 : 0)
    }

    const menuAnimation = () => {
        const menuIcon = document.getElementById("header-menu-icon")
        const menuBox = document.getElementById("mobile-menu")

        if (menuSwitch === 0) {
            menuIcon.style.animation = 'rotate-cw 500ms ease-out forwards'
            menuBox.style.animation = "slide-menu-on 500ms ease-out forwards"
        }
        else if (menuSwitch === 1) {
            menuIcon.style.animation = 'rotate-ccw 500ms ease-out forwards'
            menuBox.style.animation = "slide-menu-off 500ms ease-out forwards"
        }

        console.log(menuBox.getAnimations())
    }

    return(
        <div>
            <div className="header">
                <Container fluid className="header-mobile">
                    <input type="checkbox" id="header-menu" onClick={() => changeMenuState()}/>
                    <label className="btn" htmlFor="header-menu">
                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                             id="header-menu-icon">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                    </label>
                    <Link to="/" className="header-home">
                        <img className="header_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo"/>
                    </Link>
                    <div className="header-end">
                        <Search className="header-searchIcon"/>
                        <ShoppingBasket/>
                    </div>

                </Container>
                <Container fluid className="header-desktop">
                    <Link to="/">
                        <img className="header_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo"/>
                    </Link>
                        <div className="header-searchIcon">
                            <input type="text" className="header_searchInput" onChange={handleInput}/>
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
            <div id="mobile-menu">
                <Link to="/">
                    <h1 onClick={() => changeMenuState()}>Home</h1>
                </Link>
                <Link to="/catalog">
                    <h1 onClick={() => changeMenuState()}>Products</h1>
                </Link>
            </div>
        </div>
    )
}

export default Header