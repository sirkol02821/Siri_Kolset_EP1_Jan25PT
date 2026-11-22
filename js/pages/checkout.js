import { getCart, calculateCartTotal, clearCart } from "../components/cart.js";

import { isOnSale } from "../components/cards.js";


/* Lsting the products from the cart */
function createCheckoutItemHTML(data){

    let pricingHTML;
    
    if (isOnSale(data)) {
        pricingHTML = `
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
        <div class="checkout-item cart-item">
            <img src="${data.image.url}" alt="${data.image.alt}" loading="lazy">
            <div class="checkout-item-details cart-item-details">
                <h3>${data.title}</h3>
                <div class="checkout-price">${pricingHTML}</div>
                <div class="quantity">
                    <span class="quantity-number">x ${data.quantity || 1}</span>
                </div>
            </div>
        </div>
    `   
}

/* COMPLETE PURCHASE submit button  */
/* Saving cart and shippingDetails in localStorage, then clearing cart when "Complete Purchase" button is clicked */
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const cart = getCart();
        const shippingCost = 99;
        const subtotal = calculateCartTotal();
        const total = subtotal + shippingCost;

        localStorage.setItem("lastOrder", JSON.stringify(cart));
        localStorage.setItem("lastOrderTotal", total);

        const shippingDetails = {
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            postalCode: document.getElementById("postal-code").value,
            city: document.getElementById("city").value,
        };
        localStorage.setItem("shippingDetails", JSON.stringify(shippingDetails));

        clearCart();

        window.location.href = "/success/index.html";
    });
}





function renderCheckoutPage() {
    const cart = getCart();

    //Guard against reaching the checkoutpage with an empty cart
    if(cart.length === 0){
        document.querySelector("main").innerHTML = /* html */ `
        <section class="empty-checkout">
            <h1>No Items in Cart</h1>
            <p>You need at least one item in your cart before checking out.</p>
            <a href="/index.html" class="btn btn-primary">Browse Products</a>  
        </section>    
        `;
        return;
    }

    const checkoutItems = document.getElementById("checkout-items");
    const checkoutTotal = document.getElementById("checkout-total");

    const shippingCost = 99;
    const subtotal = calculateCartTotal();
    const total = subtotal + shippingCost;

    if(!checkoutItems){
        return;
    }
    checkoutItems.innerHTML = "";

    cart.forEach((item) =>{
        checkoutItems.innerHTML += createCheckoutItemHTML(item);
    });

    if(checkoutTotal){
        checkoutTotal.innerHTML = /* html */ `
        <p>Subtotal: ${subtotal.toFixed(2)} NOK</p>
        <p>Shipping: ${shippingCost.toFixed(2)} NOK</p>
        <p class="checkout-total">Total: ${total.toFixed(2)} NOK</p>
        `
    }
}

renderCheckoutPage();

