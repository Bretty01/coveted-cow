import React, {useState, useEffect} from 'react'
import '../css/Login.css'
import { Link, useNavigate} from 'react-router-dom'
import UserService from "../utilities/UserService";
import Logo from '../images/svg/Logo.js'
import {useStateValue} from "../StateProvider";
function Login(){

    const [{loggedin}, dispatch] = useStateValue()
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setError] = useState(null)

    const loginuser = async event => {
        event.preventDefault()
        UserService.loginUser(email, password).then(res => {
            console.log(res)
            if(res.status === 200) {
                dispatch({
                    type: 'SET_LOGIN',
                    user: res.data?.userInfo
                })
                UserService.setCookie(res.data).then((r) => {
                    console.log(r)
                    navigate('/')
                }).catch(err => {
                    console.error(err)
                    setError("Unable to login: " + err.response.data.message)
                })
            }
            setError(null)
        })
            .catch(err => {
                console.error(err)
                setError("Unable to login: " + err.response.data.message)
            })
    }

    return(
        <div className="login">
            <Link to="/">
                <Logo />
            </Link>
            <div className="login-container">
                <h1>Sign In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input value={email} onChange={event => setEmail(event.target.value)} type="email" aria-required={true}/>
                    <h5>Password</h5>
                    <input value={password} onChange={event => setPassword(event.target.value)} type="password"
                           aria-required={true}/>
                    <button onClick={loginuser} type="submit"
                             className="button-login button-generic">Sign In</button>
                    <button className="button-register button-generic" onClick={() => navigate("/signup")}>
                        Create an Account</button>
                </form>
                {errorMessage && (
                    <div className="login-message">
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login