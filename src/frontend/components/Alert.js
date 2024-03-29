import React from 'react'
import '../css/Alert.css'

function Alert() {
    return(
        <div id="alert-box">
            <div id="alert-left">
                <img id="alert-icon"/>
            </div>
            <div id="alert-right">
                <span id="alert-message">ALERT</span>
            </div>
        </div>
    )
}

/**
 * Function: setAlert
 * Purpose: sets a popup alert with the notice type and the message wanted.
 * @param status The class to set for the component. "success" = checkmark/green, "notice" = exclamation mark/yellow
 *                  "error" = X mark/red
 * @param message The message to show to the user.
 */
export function setAlert(status, message){
    try {
        document.getElementById("alert-message").textContent = message
        document.getElementById("alert-box").className = "enable"
        document.getElementById("alert-left").className = status
        setTimeout(()=>{
            document.getElementById("alert-box").className =""
        }, 5000)
    } catch (e) {
        console.warn("Unable to show alert: " + e)
    }

}

export default Alert