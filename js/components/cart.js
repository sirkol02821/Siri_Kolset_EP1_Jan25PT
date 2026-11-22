/* A lot of this has been copied and adapted from my previous JS1 assignment */

/*
CART FUNCTIONS

addToCart()
- Runs when a user clicks the "Add to Cart" button on a product details page.
- Adds a product to the shopping cart and updates the cart data.

getCart()
- Retrieves the current cart data from localStorage.
- Returns an empty array if the cart doesn't exist yet.

saveCart()
- Saves the current cart data to localStorage.
- Used whenever products are added, removed, or updated.

updateCartCount()
- Updates the number displayed on the cart icon in the header.
- Reflects the total number of items currently in the cart.

renderCart()
- Renders cart contents in cart overlay and on cart page.
- Displays products, quantities, prices, and cart total.
*/



/* Updates the cart counter in the header */
                /*function updateCartCount() {...} */

import { isLoggedIn } from "../api/auth.js"; /* to check if user is logged in, used in renderCart */

import {isOnSale} from "./cards.js"; /* to use for calculating sum */

/* Opens and closes the cart-overlay on clicking the cart icon and the close button */
export function toggleCartOverlay(){

    const cartButton = document.getElementById("cart-button");

    const isCartPage = 
        window.location.pathname.includes("/cart/");
    const isCheckoutPage =
        window.location.pathname.includes("/checkout/");

    /* If cart icon is clicked while in cart do nothing */
    if (isCartPage) {
         return;
    }

    /* If cart icon is clicked while in checkout href to Cart page instead of toggle overlay */
    if (isCheckoutPage && cartButton) {
        cartButton.addEventListener("click", () => {
            window.location.href = "/cart/index.html";
        });
        return;
    }

    const cartOverlay = document.getElementById("cart-overlay");

    const closeButton = document.getElementById("close-button");

    if(cartButton && cartOverlay) {
        cartButton.addEventListener("click", () => {
            cartOverlay.classList.remove("hidden");
            document.body.classList.add("no-scroll"); /* Hides the page scrollbar when cart is open */
    });
    }

    if (closeButton && cartOverlay){
        closeButton.addEventListener("click", () => { 
            cartOverlay.classList.add("hidden");
            document.body.classList.remove("no-scroll");/* Shows the page scrollbar when cart is closed */
        });
    }

}


/* Retrieves current cart contents from localStorage */
export function getCart() {
    return JSON.parse(
        localStorage.getItem("cart")
    )|| [];
}


/* Saves updated cart to localStorage */
export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


/* Updating the cart counter overlay to reflect the number of items in the cart */

export function updateCartCount (){
    const cart = getCart();

    const totalItems = cart.reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0);

    const counter = document.getElementById("cart-count");

    if (counter) {
        counter.textContent = totalItems;
    }
}


/* */
export function addToCart(data) {

    let cart = getCart();

    const existingProduct = cart.find(
        item => item.id === data.id
    );
    
    if(existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            ...data,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}


/* Calculate the total price of all items in the cart using discounted price where applicable*/
    /* use isOnSale to check that the discounted price is actually lower than price */
    /* used in renderCart
 and renderCartPage */

export function calculateCartTotal() {
    const cart= getCart();

    return cart.reduce((sum, item) => {
        let price;
        if (isOnSale(item)) {
            price = item.discountedPrice;
        } else {
            price = item.price;
        }

        return sum + price * (item.quantity || 1);
    }, 0);
}


/* Creating innerHTML of the items in the cart */

export function createCartItemHTML (data, index) {

    let pricingHTML;

    if (isOnSale(data)) {
        pricingHTML = `
            <span class="original-price">
                ${data.price} NOK
            </span>
            <span class="discounted-price">
                ${data.discountedPrice} NOK
            </span>
        `;
    } else {
        pricingHTML = `
            <span>
                ${data.price} NOK
            </span>
        `;
    }


    return /* html */ `
        <div class="cart-item">
            <img src="${data.image.url}" alt="${data.image.alt}" loading="lazy">
            <div class="cart-item-details">
                <h3>${data.title}</h3>
                <div class="cart-price">${pricingHTML}</div>

                <div class="quantity">
                    <span class="minus" data-index="${index}">-</span>
                    <span class="quantity-number">${data.quantity || 1}</span>
                    <span class="plus" data-index="${index}">+</span>
                </div>
            </div>
        </div>
    `

}


/* This is the product-information part of the cart, html elements are in <aside> */
    /* renderCart()

    - Retrieves cart data from localStorage.
    - Displays cart contents.
    - Displays appropriate empty-cart messages.
    - Updates cart footer visibility.
    - Enables/disables checkout.
    - Updates the displayed cart total.
    - Re-renders the cart after any cart modification.
    */
export function renderCart(){
    const cart = getCart();

    /* If cart is empty or user is not logged in hide cart-footer */
    const cartFooter = document.querySelector(".cart-footer");
    
    if(cartFooter) {
        if (cart.length === 0 || !isLoggedIn() && cartFooter) {
        cartFooter.classList.add("hidden");
        } else {
            cartFooter.classList.remove("hidden");
        }
    }

    const cartItems = document.getElementById("cart-items");

    const total = calculateCartTotal();

    if (!cartItems) {
        return;
    }

        /* If cart is empty display: */
    if(cart.length === 0) {
        cartItems.classList.add("cart-empty");

        const cartTotal = document.getElementById("cart-total");
        if(cartTotal){
            cartTotal.textContent= "Total: 0 NOK";
        }

        /* If a user is not logged in display "unavailable" */
        if (!isLoggedIn()) {
            cartItems.innerHTML = /* html */ `
            <div>
                <p>Your cart is unavailable while logged out.</p>
                <a href="/account/login.html" class="btn btn-primary">Log in</a>
            </div>
            `;
        } 

        /* If a user is logged in and the cart is empty display "empty" */
        else {
            cartItems.innerHTML =/* html */`
                <div>
                    <p>Oh no! Your cart is empty.</p>
                    <a href="../index.html" class="btn btn-primary">Browse products</a>
                </div>
            `;
        }
        return;
    }

    /* Clear the cart items container before rendering new items */
    cartItems.innerHTML = "";
    
    /* Render each item in the cart, checking for discounted prices and displaying both prices if applicable */
    cart.forEach((data, index) => {
        cartItems.classList.remove("cart-empty");
        cartItems.innerHTML += createCartItemHTML (data, index);
    });

    /* Update the cart total */
    const cartTotal = document.getElementById("cart-total");
    if (cartTotal) {
        cartTotal.textContent = `Total: ${total.toFixed(2)} NOK`;
    }
}





export function increaseQuantity(index) {
    
    const cart = getCart();
    
    cart[index].quantity = (cart[index].quantity || 1) + 1;
        
    saveCart(cart)
    
    renderCart();
    updateCartCount()
}

export function decreaseQuantity(index) {

    const cart = getCart();

    index = Number(index);

    if(!cart[index]) {
        console.error("Invalid cart index:", index);
        return;
    }

    if(cart[index].quantity > 1) {
        cart[index].quantity--;
    } else{
        cart.splice(index, 1);
    }
    
    saveCart(cart)
    
    renderCart();
    updateCartCount();
}


/*  Main layout of the cart overlay  */

export function createCartOverlay() {

    const cartOverlay = document.getElementById("cart-overlay");
    
    cartOverlay.innerHTML = /* html */ `
        <div class="cart-container">

            <div class="cart-header">
                <h2>Your cart</h2>
                <button id="close-button" class="btn btn-secondary" aria-label="Close cart">✕</button>
            </div>

            <div id="cart-items" class="cart-items"> 
                <!-- cart-item elements inserted here -->
            </div>
            
            <div class="cart-footer">
                <button id="clear-cart" class="btn btn-secondary">Clear cart</button>
                <p id="cart-total">Total: 0 NOK</p>
                <a href="/cart/index.html" id="cart-page-button" class="btn btn-primary">Go to cart</a>
            </div>
        </div>
        `;

        /* Clear Cart */
    const clearCartButton = document.getElementById("clear-cart");

        if (clearCartButton) {
            clearCartButton.addEventListener("click", () => {
                const confirmed = confirm(
                    "Are you sure you want to empty your cart?"
                );
                if (confirmed) {
                    clearCart();
                }
            });
        }
}


/* Setting up quantity controls */
    /* Event delegation for plus and minus buttons in the cart overlay (as they don't exist until the cart is rendered and there is an item) */

export function setupQuantityControls() {
    document.addEventListener("click", (event) => {
        const minusButton = event.target.closest(".minus");
        
        if (minusButton) {decreaseQuantity(minusButton.dataset.index);}

        const plusButton = event.target.closest(".plus");

        if (plusButton) {increaseQuantity(plusButton.dataset.index);}
    });
}

export function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
}
