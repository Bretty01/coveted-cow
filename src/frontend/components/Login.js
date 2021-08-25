import React, {useState} from 'react'
import '../css/Login.css'
import { Link, useHistory} from 'react-router-dom'
import { auth } from '../Firebase.js'
function Login(){

    const history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginuser = event => {
        event.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                history.push('/')
            })
            .catch(e => alert(e.message))
    }

    const signUpUser = event => {
        event.preventDefault()
        auth.createUserWithEmailAndPassword(email, password)
            .then(auth => {
                history.push('/');
            })
            .catch(e => alert(e.message))
    }

    return(
        <div className="login">
            <Link>
                <img className="login_logo" src="https://image.flaticon.com/icons/png/512/2636/2636252.png" alt="logo" />
            </Link>
            <div className="login_container">
                <h1>Sign In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input value={email} onChange={event => setEmail(event.target.value)} type="email" />
                    <h5>Password</h5>
                    <input value={password} onChange={event => setPassword(event.target.value)} type="password" />
                    <button onClick={loginuser} type="submit" className="login_signInBtn">Sign In</button>
                </form>
                <p>By signing in, you agree to the Terms and Conditions</p>
                <button onClick={signUpUser} className="login_registerBtn">Create an Account</button>
            </div>
        </div>
    )
}

export default Login