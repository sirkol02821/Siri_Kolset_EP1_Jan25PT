import { renderCart, clearCart } from "../components/cart.js";

renderCart();


/* adding "clear cart" functionality */
/* since cart overlay doesn't open on cart page:
        - createCartOverlay doesn't run on the cart-page the "Clear Cart" eventlistener needs to be added here*/
const clearCartButton =
    document.getElementById("clear-cart");

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