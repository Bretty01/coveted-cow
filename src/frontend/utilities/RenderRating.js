import React from "react";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
export default function renderRating(reviewCount, reviewScore) {
    let reviewStars = [<StarOutlineIcon />, <StarOutlineIcon />, <StarOutlineIcon />,
        <StarOutlineIcon />, <StarOutlineIcon />]
    if(reviewCount > 0) {
        const initialStars = Math.floor(reviewScore)
        const partialStar = reviewScore % initialStars > 0.4
        for(let i = 0; i < initialStars; i++) {
            reviewStars[i] = <StarIcon />
        }
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