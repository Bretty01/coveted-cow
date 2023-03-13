import {useState, useEffect} from 'react'
import { useStateValue } from '../StateProvider.js'
import {useNavigate} from 'react-router-dom'
import UserService from "../utilities/UserService"
import "../css/Account.css"
const Account = () => {
    const navigate = useNavigate()
    const [{loggedinuser}, dispatch] = useStateValue()
    //Used to popup the modal to confirm account deletion
    const [modal, setModal] = useState(false)
    const [errorMessage, setError] = useState(null)

    /**
     * Function: handlePasswordChange
     * Purpose: Submits the form that is used to change the password. Also compares passwords to see if they are
     * correct.
     * @param e Form event handler.
     */
    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const id = loggedinuser._id
        const oldPassword = e.target[0].value
        const newPassword = e.target[1].value
        const reenterPassword = e.target[2].value
        //Compare new password and re-entered passwords to see if they match.
        if(newPassword !== reenterPassword) return setError("Passwords do not match.")
        //Submit passwords to backend and await response.
        UserService.updatePassword(id, oldPassword, newPassword).then(() => {
            navigate("/")
        }).catch(e => {
            console.log(e)
            setError("Unable to change password: " + (e.response?.data?.message || e))
        })
    }

    /**
     * Function: deleteAccount
     * Purpose: Deletes the account given after confirmation
     */
    const deleteAccount = async () => {
        try {
            //Attempt to delete the user and then reset the user login and delete the existing cookie.
            await UserService.deleteUser(loggedinuser._id)
            await UserService.deleteCookie()
            dispatch({
                type: 'SET_LOGIN',
                user: null
            })
            navigate("/")
        } catch (e) {
            console.log(e)
            setError("Unable to delete account: " + (e.response?.data?.message || e))
            setModal(false)
        }
    }

    return (
        <section id="account">
            <div className="account-main">
                <h1>Account</h1>
                {loggedinuser ? (
                    <div>
                        <p>Email: {loggedinuser.email}</p>
                        <h3>Change Your Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <label htmlFor="oldPassword">Old Password</label>
                            <input id="oldPassword" type="password" required />
                            <label htmlFor="newPassword">New Password</label>
                            <input id="newPassword" type="password" required />
                            <label htmlFor="reenterNewPassword">Re-Enter New Password</label>
                            <input id="reenterNewPassword" type="password" required/>
                            <input className="button-generic" type="submit" value="Submit" />
                        </form>
                        {errorMessage && (
                            <div className="error-message">
                                <span>{errorMessage}</span>
                            </div>
                        )}
                        <button className="button-generic" onClick={() => setModal(true)}>Delete Account</button>
                    </div>
                ) : (
                    <p>Please login to your account to use this page.</p>
                )}
            </div>
            {modal && (
                <div className="account-modal">
                    <div>
                        <p>Are you sure you wish to delete this account</p>
                        <div>
                            <button className="button-generic" onClick={deleteAccount}>Yes</button>
                            <button className="button-generic" onClick={() => setModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    )
}
export default Account