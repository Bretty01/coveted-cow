import React, {useState} from 'react'
import '../css/Login.css'
import { Link, useHistory} from 'react-router-dom'
import { auth } from '../Firebase.js'
import Logo from '../images/svg/Logo.js'
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
            <Link to="/">
                <Logo />
            </Link>
            <div className="login-container">
                <h1>Sign In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input value={email} onChange={event => setEmail(event.target.value)} type="email" />
                    <h5>Password</h5>
                    <input value={password} onChange={event => setPassword(event.target.value)} type="password" />
                    <button onClick={loginuser} type="submit"
                             className="button-login button-generic">Sign In</button>
                </form>

                <button onClick={signUpUser} className="button-register button-generic">Create an Account</button>
            </div>
        </div>
    )
}

export default Login