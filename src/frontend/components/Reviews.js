import {useState} from "react"
import {useStateValue} from "../StateProvider"
import "../css/Reviews.css"
import ProductService from "../utilities/product-service"
import {setAlert} from "./Alert"
const Reviews = (props) => {
    const[{loggedinuser}, dispatch] = useStateValue()
    //useState variables
    const [ratingNumber, setRating] = useState(5)
    const [buttonDisabled, setDisable] = useState(false)
    /**
     * Function: handleReview
     * Purpose: Takes review information and submits it to the backend.
     * @param e Event handler for the review form.
     */
    const handleReview = (e) => {
        e.preventDefault()
        ProductService.submitReview(props.productId, e.target[0].value, parseInt(e.target[1].value), e.target[2].value,
          loggedinuser._id).then(res => {
            setAlert("success", "Thank you for submitting your review!")
            //Disable the submit button to prevent multiple submissions.
            setDisable(true)
        }).catch(err => console.error(err))
    }
    return (
        <div>
            <div className="review-write">
                {loggedinuser ?
                    (
                        <form onSubmit={handleReview}>
                            <h2>Write a review!</h2>
                            <div>
                                <label htmlFor="review-title">Title</label>
                                <input id="review-title" type="text" maxLength="80" required/>
                            </div>
                            <div>
                                <label htmlFor="review-rating">Rating</label>
                                <input id="review-rating" type="range" min="1" max="5" defaultValue="5"
                                       onInput={(e) => setRating(e.target.value)} required />
                                <span id="rating-number">{ratingNumber}</span>
                            </div>
                            <div>
                                <label htmlFor="review-description">Review</label>
                                <textarea id="review-description" rows="4" />
                            </div>
                            <input className="button-generic" type="submit" disabled={buttonDisabled}/>
                        </form>
                    ) : (<span>To write a review, you will need to log in.
                        Click <a href="/login">here</a> to log in or click <a href="/signup">here</a> to signup.</span>)}
            </div>
            <div className="review-list">
                <div className="review-list-header">
                    <span>{props.reviewCount} Reviews</span>
                </div>
                {props.reviewCount > 0 ? (
                    props.reviews.map(review => {
                        return (
                            <div className="review">
                                <div className="review-top">
                                    <span>{review.user.name}</span>
                                    <span><strong>{review.rating}/5</strong></span>
                                </div>
                                <div className="review-middle">
                                    <span>{review.title}</span>
                                </div>
                                <div className="review-bottom">
                                    <p>{review.description}</p>
                                    <span>Date Reviewed: {new Intl.DateTimeFormat('en-US')
                                        .format(new Date(review.date))}</span>
                                </div>
                            </div>)
                    }
                    )
                ) : (
                    <div>
                        No reviews. Be the first to write a review
                    </div>
                )}
            </div>
        </div>
    )
}
export default Reviews