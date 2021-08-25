import React from 'react'
import '../css/Footer.css'
function Footer(){
    return(
        <div className="footerArea">
            <div className="footer_top" onClick={window.scrollTo(0,0)}>
                <p>Back To Top</p>
            </div>
            <div className="footer_links">
                <div className="footer_linkarea">
                    <span>test</span>
                </div>
                <div className="footer_linkarea">
                    <span>test</span>
                </div>
                <div className="footer_linkarea">
                    <span>test</span>
                </div>
                <div className="footer_linkarea">
                    <span>test</span>
                </div>
            </div>
        </div>
    )
}
export default Footer