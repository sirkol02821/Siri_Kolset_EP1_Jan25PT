/*      GUIDE       */
/* This file contains imports of the universal js and should be included on every html page */

/* Universal js:
- header
- footer
- cart overlay
- loader

page-specific:
- reviews.js only needed for the product cards on index.html and for the product/index.html
- carousel.js only needed for index.html page

*/

import {createHeader, createTagNav, createShopLink} from "./components/header.js";
import { createCartOverlay, toggleCartOverlay, updateCartCount, renderCart, setupQuantityControls, clearCart } from "./components/cart.js";
import { createFooter } from "./components/footer.js";

createHeader();
createFooter();


/* not initializing cart-overlay functionality while on the cart or checkout page */

const isCartPage =
    window.location.pathname.includes("/cart/");

const isCheckoutPage =
    window.location.pathname.includes("/checkout/");


if (!isCartPage && !isCheckoutPage) {
    createCartOverlay();
}


/* If not on home page or product page (aka on a page which doesn't fetch products) show the simple "browse products" nav */
const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";

const isProductPage =
    window.location.pathname.includes("/product/");

if (!isHomePage && !isProductPage) {
    createShopLink();
}


toggleCartOverlay();
updateCartCount();
renderCart();

setupQuantityControls();
