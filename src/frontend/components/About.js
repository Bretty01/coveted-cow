import "../css/About.css"
const About = () => {
    return (
        <div className="main">
            <div id="about">
                <h1>About Us</h1>
                <div className="about-us">
                    <img src="/images/cow-about-1.jpg" alt="About"/>
                    <div>
                        <p>For over 75 years, we have been committed to bring the more adorable and comfortable floofs
                        to your doorstep. Once started as a small shop in the woods by the original owner of
                        Coveted Cow, Mac Mooch, we have since become a cultural phenomenon by showing everyone how it
                        really feels to be loved by your very own floof.</p>
                        <p>To this present day, we have delivered from your favourite brands, including Feel Moo Inc.
                        and Aurora. We have also expanded our catalog to include products beyond your normal cows. We
                        hope to continue to give the best quality plushies that you will adore for years to come.</p>
                    </div>
                </div>
                <div className="about-location">
                    <h2>Our Location</h2>
                    <p>Come visit us at the following location:</p>
                    <div>
                        <div className="about-address">
                            <span>100 Higgins Ave.</span>
                            <span>Gilmour Island, Hudson Bay</span>
                            <span>Nunavut, Canada</span>
                            <span>C0W 0W0</span>
                            <span>(123)456-7890</span>
                        </div>
                        <img src="/images/Gilmour_Island.jpg" alt="Gilmour Island"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default About