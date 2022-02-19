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

export function setAlert(status, message){
    document.getElementById("alert-message").textContent = message
    document.getElementById("alert-box").className = "enable"
    document.getElementById("alert-left").className = status
    setTimeout(()=>{
        document.getElementById("alert-box").className =""
    }, 5000)
}

export default Alert