import {Link} from "react-router-dom";
import Logo from "../images/svg/Logo";
import React, {useState} from "react";
import UserService from "../utilities/UserService";

const Signup = () => {
    const [errorMessage, setError] = useState(null)
    const signUpUser = (e) => {
        console.log(e)
        const user = e.target[0].value
        const email = e.target[1].value
        const newPassword = e.target[2].value
        const reEnterPassword = e.target[3].value
        e.preventDefault()
        if(!email || !newPassword || !reEnterPassword) return setError("Please fill out all fields.")
        if(newPassword != reEnterPassword) return setError("Passwords do not match.")
        UserService.signupUser(email, newPassword, user).then(res => {
            setError(null)
        }).catch(err => {
            console.log(err)
            //setError(err.response.data.message)
        })
    }

    return (
        <div className="login">
            <Link to="/">
                <Logo />
            </Link>
            <div className="login-container">
                <h1>Sign Up</h1>
                <form onSubmit={signUpUser}>
                    <h5>Username</h5>
                    <input type="text" required/>
                    <h5>E-mail</h5>
                    <input type="email" required/>
                    <h5>Enter New Password</h5>
                    <input type="password"
                           required/>
                    <h5>Re-Enter New Password</h5>
                    <input type="password"
                           required />
                    <button type="submit" className="button-login button-generic">Sign Up</button>
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
export default Signup