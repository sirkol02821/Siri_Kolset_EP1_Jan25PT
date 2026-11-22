import { ratingToStars } from "./cards.js";

import { isLoggedIn } from "../api/auth.js";

/* Making the cards containing customer reviews */
export function createReviewCard(review){
    return`
        <article class="review">
            <img src="../assets/icons/user.svg" alt="User image">
            <h3 class="review-username">${review.username}</h3>
            <div class="review-rating">${ratingToStars(review.rating)}</div>
            <p class="review-description">${review.description}</p>
        </article>
        `;
}



export function createReviewForm(){
    /* check if user is logged in   */
    
    if(!isLoggedIn()){
        
        return `
            <section class="review-login-required">
                <h3>Want to share your experience?</h3>
                <p>Please log in to leave a review.</p>
                <a href="../account/login.html" class="btn btn-primary login-button">Log in</a>
            </section>
        `;
    }

    return `
        <section class="leave-review">
            <h2>Leave a Review</h2>

            <form id="review-form">
                <label for="rating">Rating:</label>
                <select id="rating" required>
                    <option value="" disabled selected>Choose rating</option>

                    <option value="5">★★★★★ 5/5</option>
                    <option value="4">★★★★☆ 4/5</option>
                    <option value="3">★★★☆☆ 3/5</option>
                    <option value="2">★★☆☆☆ 2/5</option>
                    <option value="1">★☆☆☆☆ 1/5</option>
                </select>
                <label for="description">Review:</label>
                <textarea id="description" required></textarea>
                <button type="submit" class="btn btn-primary">Submit review</button>
            </form>

            <div id="review-success" class="review-success hidden">
                <h3>Thank you for your review!</h3>
                <p>It will appear after moderation.</p>
            </div>

        </section>
    `;
}