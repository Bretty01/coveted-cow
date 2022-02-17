import React from 'react'
import '../css/Alert.css'

function Alert() {
    return(
        <div id="alert-box">
            <img id="alert-icon"/>
            <p id="alert-message">ALERT</p>
        </div>
    )
}

export function setAlert(status, message){
    document.getElementById("alert-message").textContent = message
    document.getElementById("alert-box").className = "enable " + status
    setTimeout(()=>{
        document.getElementById("alert-box").className =""
    }, 5000)
}

export default Alert