import React, {useState, useEffect} from 'react'
import {Search, ShoppingBasket, Menu} from "@mui/icons-material"
import { Link , useNavigate, useLocation} from 'react-router-dom'
import { useStateValue } from '../StateProvider.js'
import Navlinks from './Navlinks.js'
import '../css/Header.css'
import Logo from '../images/svg/Logo'
import Alert from './Alert.js'
import UserService from "../utilities/UserService"
function Header() {
    let navigate = useNavigate()
    const { pathname } = useLocation();
    //useState variables
    const [menuSwitch, setMenuSwitch] = useState(-1)
    const [searchSwitch, setSearchSwitch] = useState(true)
    const [{basket, loggedinuser}, dispatch] = useStateValue();

    //useEffect variables

    //Any time a new page is navigated to, scroll to the top of the page.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    useEffect(() => {
        menuAnimation()
    }, [menuSwitch])

    const logoutUser = async () => {
        if(loggedinuser){
            dispatch({
                type: 'SET_LOGIN',
                user: null
            })
            UserService.deleteCookie().catch(err => console.error("Unable to delete cookie: " + err))
            navigate("/")
        } else {
            navigate("/login")
        }
    }

    /**
     * Function: handleInput
     * Purpose: Handles the search bar input to create a search query for the catalog
     * @param event Search bar form event handler
     */
    const handleInput = (event) => {
        event.preventDefault()
        navigate("/catalog/" + event.target[0].value, {
            state: event.target[0].value,
            replace: true
        })
    }

    /**
     * Function: changeMenuState
     * Purpose: Switches the mobile menu on and off.
     */
    const changeMenuState = () => {
        setMenuSwitch((menuSwitch === 0) ? 1 : 0)
    }

    /**
     * Function: menuAnimation
     * Purpose: Depending on the state of the mobile menu popup, scroll in/scroll out the menu page.
     */
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

    /**
     * Function: toggleSearchBar
     * Purpose: On click of the search icon on mobile. Pop up the search bar or hide the search bar.
     */
    const toggleSearchBar = () => {
        const search = document.getElementById("mobile-searchbar")
        setSearchSwitch(!searchSwitch)
        searchSwitch ? (search.className = "visible") : (search.className = "")

    }

    return(
        <div>
            <div>
                {
                    //Mobile Header
                }
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
                {
                    //Desktop header
                }
                <div className="header-desktop-block">
                    <div className="header header-desktop">
                        <Link to="/" id="header-left" >
                            <Logo />
                            <img alt="Coveted Cow"
                                 src="https://fontmeme.com/permalink/220219/4690785ad27bbbaacf4dcf2e65c29223.png" />
                        </Link>
                        <div id="header-middle">
                            <form onSubmit={handleInput}>
                                <input type="text" className="header-searchInput" />
                                <label>
                                    <input type="submit" style={{"display": "none"}}/>
                                    <Search className="header-searchIcon"/>
                                </label>

                            </form>
                        </div>
                        <div id="header-right">
                            <div className="header-login">
                                <div onClick={logoutUser} className="header_option">
                                    <span>{loggedinuser?.name}</span>
                                    <span>{loggedinuser ? 'Sign Out' : 'Sign In'}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="header-checkout">
                                <ShoppingBasket/>
                                <span className="header-productCount">{basket?.length}</span>
                            </Link>
                        </div>
                    </div>
                    <Navlinks />
                </div>
            </div>
            {
                //Mobile search pop up
            }
            <div id="mobile-searchbar">
                <form onSubmit={handleInput}>
                    <input type="text" className="header-searchInput" />
                    <label>
                        <input type="submit" style={{"display": "none"}}/>
                        <Search className="header-searchIcon"/>
                    </label>
                </form>
            </div>
            {
                //Mobile pop up menu
            }
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
                <Link to="/about">
                    <h1 onClick={() => changeMenuState()}>About</h1>
                </Link>
                <div id="mobile-menu-user">
                    <Link to={!loggedinuser && "/login"} className="header_link">
                        <div onClick={logoutUser} className="header_option">
                            <span className="header_optionOne">{loggedinuser?.name}</span>
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