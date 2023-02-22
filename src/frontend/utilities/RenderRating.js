import React from "react";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

/**
 * Function: renderRating
 * Purpose: Takes the passed in review score and count and generates a star rating visual.
 * @param reviewCount The total count of reviews
 * @param reviewScore The average rating of the product.
 * @returns {JSX.Element[]} An array of 5 JSX elements that resemble the 5 star rating that is visualized to the user.
 */
export default function renderRating(reviewCount, reviewScore) {
    //The default is a blank 0 star rating. If no changes are made (no reviews to count), then return the 5 outlined stars.
    let reviewStars = [<StarOutlineIcon />, <StarOutlineIcon />, <StarOutlineIcon />,
        <StarOutlineIcon />, <StarOutlineIcon />]
    if(reviewCount > 0) {
        //If the score, for example, is 3.5. That means the first 3 stars are guaranteed to be filled stars.
        //  initialStars states which stars of the 5 need to be filled.
        const initialStars = Math.floor(reviewScore)
        //partialStar is a boolean that determines if the next star is a half star (remainder is 0.5-0.9),
        //  or if the next star is an empty star (remainder is 0-0.4)
        const partialStar = reviewScore % initialStars > 0.4
        //Append first of the stars as filled stars
        for(let i = 0; i < initialStars; i++) {
            reviewStars[i] = <StarIcon />
        }
        //Append the partial star/empty star as the next star if need be and append the remaining spots as empty stars.
        if(reviewScore !== 5) {
            reviewStars[initialStars] = partialStar ? <StarHalfIcon /> : <StarOutlineIcon />
            if(initialStars < 4) {
                for(let i = initialStars + 1; i <= 4; i++) {
                    reviewStars[i] = <StarOutlineIcon />
                }
            }
        }
    }
    return reviewStars
}