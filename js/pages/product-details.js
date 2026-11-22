import { getSingleProduct } from "../api/singleProduct.js";


/* importing checking for discount and displaying rating as stars functions from card.js */
import { isOnSale , ratingToStars } from "../components/cards.js";

/* Importing Reviews section from components/reviews.js */
import { createReviewCard , createReviewForm} from "../components/reviews.js";

/* Importing Add to Cart section from components/cart.js */
import { addToCart } from "../components/cart.js";

/* Importing login check to be used for "add to cart" button behaviour */
import { isLoggedIn } from "../api/auth.js";

/* Making tag navigation visible in the header on product/index.html 
(not universal on all pages as it requires API fetch which is expensive) */
import{getProducts} from "../api/products.js";
import { createTagNav } from "../components/header.js";
async function initialiseTagNav() {
    const products = await getProducts();
    createTagNav(products);
};
initialiseTagNav();



/*  Generating the <main> content for products/index.html   */

const id = new URLSearchParams(window.location.search).get("id");

const product = await getSingleProduct(id)

const productDetails = document.getElementById("product-details")   


/*  Changing the text in class="review-link" to reflect whether the product has reviews or not   */
let reviewLink; 
    if (product.rating > 0) {
        reviewLink = "Read or leave a review";
    } else {
        reviewLink = "Be the first to leave a review";
    }


/*  Content for "reviews" section */
let reviewsHTML;
    if (product.reviews.length > 0) {
        reviewsHTML = product.reviews
            .map(review => createReviewCard(review))
            .join("");
    } else {
        reviewsHTML =`
            <p class="no-reviews">
                No reviews yet. Be the first to leave a review!
            </p>`;
    }

/*  Making an array of tags */
const tagsHTML = product.tags.map( tag => `
        <span class="product-tag">${tag}</span>`)
        .join("");

/* Changing the innerHTML of the pricing section if the product is discounted*/
const onSale = isOnSale(product);

let pricingHTML;
    if (onSale){
        pricingHTML = `
            <p class="product-price original-price">
                ${product.price.toFixed(2)} NOK
            </p>
            <p class="product-discount">
                ${product.discountedPrice.toFixed(2)} NOK
            </p>
        `;
    } else {
        pricingHTML = `
            <p class="product-price">
                ${product.price.toFixed(2)} NOK
            </p>
        `;
    }

let buttonHTML;
if(isLoggedIn()){
    buttonHTML = /* html */ `
        <button id="add-to-cart" class="btn btn-primary">Add to Cart</button>
    `;
} else {
    buttonHTML = /* html */ `
        <button id="login-to-cart" class="btn btn-primary">Login to Add to Cart</button>
    `;
}

productDetails.innerHTML=   /* html */ `
    <section class="product-image-main">
        <img src="${product.image.url}" alt="${product.image.alt}">
    </section>
    <section class="product-basics">
        <h1>${product.title}</h1>
        <div class="product-tags">${tagsHTML}</div>
        <div class="product-rating">${ratingToStars(product.rating)}</div>
        <a href="#reviews" class="review-link">${reviewLink}</a>
        <div class="product-pricing">${pricingHTML}</div>
        ${buttonHTML}
        <button id="share-button" class="share-button" aria-label="Share product" title="Copy URL">
            <span class="share-icon"><img src="../assets/icons/share.svg" alt="share icon" class="icon"></span>
            <span id="share-text">Click on the share icon to copy link!</span>
        </button>
    </section>
    <section class="product-description">
        <h2>Description</h2>
        <p>${product.description}</p>
    </section>
    <section class="product-reviews">
        <h2>Reviews</h2>
        <div id="reviews">${reviewsHTML}  <!-- Review cards from components/reviews.js go here --></div>
        <div class="form-container">${createReviewForm()}</div>
    </section>
`;

/* SHARE PRODUCT BUTTON */
const shareButton = document.getElementById("share-button")
const shareText = document.getElementById("share-text");

if(shareButton) {
    shareButton.addEventListener("click", async () =>{
        try {    
            await navigator.clipboard.writeText(window.location.href);
            shareText.textContent = "Link copied!"; /* Changing text next to share button and changing it back with timeout*/
            setTimeout(() => {
                shareText.textContent = "Click on the share icon to copy link!";
            }, 3000);
        } catch (error){
            alert("Unable to share product.");
        }  
    });
}


/* ADD TO CART BUTTON */

    /* when user is logged in and "add to cart" button is displayed add product to cart */
const addToCartButton = document.getElementById("add-to-cart");

if(addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        addToCart(product);
    });
}    

    /*  when NO user is logged in and "log in to add to cart" button is displayed, save current page url, redirect to login page, on login user is returned to saved url */
const loginToCartButton = document.getElementById("login-to-cart");

if(loginToCartButton) {
    loginToCartButton.addEventListener("click", () => {
     saveReturnURL();
     window.location.href = "/account/login.html";
    });   
}  


/* REVIEW BUTTONS */
    /* Event listener for Submit Review button */
const reviewForm = document.getElementById("review-form");

    /* Add event listener for review form submission only if the review form exists (if user is logged in) */
if (reviewForm) {
    reviewForm.addEventListener("submit", (event) =>{
        event.preventDefault();
        
        reviewForm.classList.add("hidden");
        
        document.getElementById("review-success").classList.remove("hidden");
    });
}

    /* Saving the current URL when the user presses the login button (to leave a review) */
const loginButton = document.querySelector(".login-button");

if(loginButton) {
    loginButton.addEventListener("click", saveReturnURL);
}

/* saving the URL of the current page when the user clicks login buttons ("log to add to cart" and "log in to leave a review") */
function saveReturnURL(){
    localStorage.setItem(
        "returnURL",
        window.location.href
    );
}
