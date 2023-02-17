import {useState, useEffect} from 'react'
import { useStateValue } from '../StateProvider.js'
import {useNavigate} from 'react-router-dom'
import UserService from "../utilities/UserService"
import "../css/Account.css"
const Account = () => {
    const navigate = useNavigate()
    const [{loggedinuser}, dispatch] = useStateValue()
    const [modal, setModal] = useState(false)
    const [errorMessage, setError] = useState(null)
    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const id = loggedinuser._id
        const oldPassword = e.target[0].value
        const newPassword = e.target[1].value
        const reenterPassword = e.target[2].value
        if(newPassword !== reenterPassword) return setError("Passwords do not match.")
        UserService.updatePassword(id, oldPassword, newPassword).then(() => {
            navigate("/")
        }).catch(err => {
            setError("Unable to change password: " +err.response.statusText)
        })
    }

    const deleteAccount = async () => {
        const res = await UserService.deleteUser(loggedinuser._id)
        console.log(res)
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