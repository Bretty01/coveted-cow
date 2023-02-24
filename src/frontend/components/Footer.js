import React from 'react'
import Facebook from '../images/svg/Facebook'
import Youtube from '../images/svg/Youtube'
import Instagram from '../images/svg/Instagram'
import Twitter from '../images/svg/Twitter'
import '../css/Footer.css'
function Footer(){
    return(
        <div className="footer-block">
            <div className="footer-links">
                <div className="footer-hours">
                    <h3>Hours</h3>
                    <div className="footer-content">
                        <div><span>Sunday:</span><span>10:00am-4:00pm</span></div>
                        <div><span>Monday:</span><span>9:00am-5:30pm</span></div>
                        <div><span>Tuesday:</span><span>9:00am-5:30pm</span></div>
                        <div><span>Wednesday:</span><span>9:00am-5:30pm</span></div>
                        <div><span>Thursday:</span><span>9:00am-5:30pm</span></div>
                        <div><span>Friday:</span><span>9:00am-7:00pm</span></div>
                        <div><span>Saturday:</span><span>9:00am-7:00pm</span></div>
                    </div>
                </div>
                <div className="footer-socials">
                    <h3>Socials</h3>
                    <div className="footer-content">
                        <a><Facebook /><span>Facebook</span></a>
                        <a><Instagram /><span>Instagram</span></a>
                        <a><Twitter /><span>Twitter</span></a>
                        <a><Youtube /><span>Youtube</span></a>
                    </div>
                </div>
            </div>
            <div className="footer-disclaimer">
                <p>Disclaimer: This website is merely for demonstration purposes only and sadly, you can not actually
                    purchase a fluffy stuffed cow. All passwords, however, are securely encrypted. Take precautions anyways
                    and do not submit information that is private to you. Any questions or concerns, please contact
                    me <a href="mailto:b3orban@gmail.com">here</a>.</p>
            </div>
        </div>
    )
}
export default Footer