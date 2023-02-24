import {Link, useNavigate} from "react-router-dom";
import Logo from "../images/svg/Logo";
import React, {useState} from "react";
import UserService from "../utilities/UserService";
import {useStateValue} from "../StateProvider"
const Signup = () => {
    const navigate = useNavigate();
    const [{loggedin}, dispatch] = useStateValue()
    //useState variables
    const [errorMessage, setError] = useState(null)

    /**
     * Function: signUpUser
     * Purpose: Checks the user credentials to see if they are valid, then submits them to the backend.
     * @param e Event handler for the signup form.
     */
    const signUpUser = (e) => {
        const user = e.target[0].value
        const email = e.target[1].value
        const newPassword = e.target[2].value
        const reEnterPassword = e.target[3].value
        e.preventDefault()
        //If certain form elements are not filled out, or the passwords do not match each other, throw an error to
        //  the user.
        if(!email || !newPassword || !reEnterPassword) return setError("Please fill out all fields.")
        if(newPassword !== reEnterPassword) return setError("Passwords do not match.")
        //Submit user information. If successful, set the user login and set a cookie.
        UserService.signupUser(email, newPassword, user).then(res => {
            console.log(res)
            if(res.status === 201) {
                const userData = {
                    "userInfo" : {
                        _id: res.data.userId,
                        "name": user,
                        "email": email
                    }
                }
                dispatch({
                    type: 'SET_LOGIN',
                    user: userData
                })
                UserService.setCookie(userData).then(() => {
                    setError(null)
                    navigate("/")
                }).catch(e => {
                    setError(e)
                    console.error(e)
                })
            }
        }).catch(err => {
            setError(err.response.data.message)
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