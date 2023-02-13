import React, {useState, useEffect} from 'react'
import {Search, ShoppingBasket, Menu} from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useStateValue } from '../StateProvider.js'
import Navlinks from './Navlinks.js'
import '../css/Header.css'
import Logo from '../images/svg/Logo'
import {auth} from '../Firebase.js'
import {Container} from 'react-bootstrap'
import Alert from './Alert.js'
function Header() {
    const [inputText, setInputText] = useState("")
    const [menuSwitch, setMenuSwitch] = useState(-1)
    const [searchSwitch, setSearchSwitch] = useState(true)
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
        if(window.screen.width >= 768) {
            setInputText(document.getElementsByClassName("header-searchInput")[0].value)
        }
        else {
            setInputText(document.getElementsByClassName("header-searchInput")[1].value)
        }
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
            menuBox.focus()
        }
        else if (menuSwitch === 1) {
            menuIcon.style.animation = 'rotate-ccw 500ms ease-out forwards'
            menuBox.style.animation = "slide-menu-off 500ms ease-out forwards"
        }

    }

    const toggleSearchBar = () => {
        const search = document.getElementById("mobile-searchbar")
        setSearchSwitch(!searchSwitch)
        searchSwitch ? (search.className = "visible") : (search.className = "")

    }

    return(
        <div>
            <div>
                <div className="header header-mobile">
                    <div id="header-left">
                        <input type="checkbox" id="header-menu" onClick={() => changeMenuState()}/>
                        <label className="btn" htmlFor="header-menu">
                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                                 id="header-menu-icon">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                            </svg>
                        </label>
                    </div>
                    <div id="header-middle">
                        <Link to="/" className="header-home">
                            <Logo />
                        </Link>
                    </div>
                    <div id="header-right">
                        <Search className="header-searchIcon" onClick={toggleSearchBar}/>
                        <Link to="/checkout" className="header-checkout">
                            <ShoppingBasket/>
                            <span className="header-productCount">{basket?.length}</span>
                        </Link>
                    </div>

                </div>
                <div className="header-desktop-block">
                    <div className="header header-desktop">
                        <Link to="/" id="header-left" >
                            <Logo />
                            <img src="https://fontmeme.com/permalink/220219/4690785ad27bbbaacf4dcf2e65c29223.png" />
                        </Link>
                        <div id="header-middle">
                            <input type="text" className="header-searchInput" onChange={handleInput}/>
                            <Link to={{
                                pathname: "/catalog",
                                state:{search: inputText}
                            }}>
                                <Search className="header-searchIcon"/>
                            </Link>
                        </div>
                        <div id="header-right">
                            <Link to={!loggedinuser && "/login"} className="header-login">
                                <div onClick={logoutUser} className="header_option">
                                    <span>Hello, {loggedinuser?.email}</span>
                                    <span>{loggedinuser ? 'Sign Out' : 'Sign In'}</span>
                                </div>
                            </Link>
                            <Link to="/checkout" className="header-checkout">
                                <ShoppingBasket/>
                                <span className="header-productCount">{basket?.length}</span>
                            </Link>
                        </div>
                    </div>
                    <Navlinks />
                </div>
            </div>
            <div id="mobile-searchbar">
                <input type="text" className="header-searchInput" onChange={handleInput}/>
                <Link to={{
                    pathname: "/catalog",
                    state:{search: inputText}
                }} onClick={toggleSearchBar}>
                    <Search className="header-searchIcon"/>
                </Link>
            </div>
            <div id="mobile-menu" onfocusout={changeMenuState}>
                <Link to="/">
                    <h1 onClick={() => changeMenuState()}>Home</h1>
                </Link>
                <Link to="/catalog">
                    <h1 onClick={() => changeMenuState()}>Products</h1>
                </Link>
                <Link to="/checkout">
                    <h1 onClick={() => changeMenuState()}>Checkout</h1>
                </Link>
                <div id="mobile-menu-user">
                    <Link to={!loggedinuser && "/login"} className="header_link">
                        <div onClick={logoutUser} className="header_option">
                            <span className="header_optionOne">Hello, {loggedinuser?.email}</span>
                            <span className="header_optionTwo">{loggedinuser ? 'Sign Out' : 'Sign In'}</span>
                        </div>
                    </Link>
                </div>

            </div>
            <Alert/>
        </div>
    )
}

export default Header