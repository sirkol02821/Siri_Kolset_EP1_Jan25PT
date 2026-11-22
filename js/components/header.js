const BASE = "/Siri_Kolset_EP1_Jan25PT";

/* Import check if user is logged in */
import { isLoggedIn, logout } from "../api/auth.js";

/* Creating <header> content  */
    /* createHeader is responsible for:
        - xxx
    
    */
export function createHeader(){


    const header = document.getElementById ("header");

    /* getting username saved in localStorage in login.js when user logs in to display in account-dropdown */
    const username = localStorage.getItem("username");

    /* Changing the account dropdown content based on login status */
    const accountLinks = isLoggedIn()
        ?`
            <p class="username">Logged in as<br> 
                <strong>${username}</strong>
            </p>
            <a href="#" class="logout-link">Logout</a>
        `
        : `
            <a href="${BASE}/account/login.html" class="login-link">Login</a>
            <a href="${BASE}/account/register.html" class="register-link">Register</a>
        `
        ;

    header.innerHTML = /* html */ `

        <div class="header-top">
            <!-- Menu icon -->
            <button id="menu-button" class="menu-button" aria-label="Open menu">
                <img src="${BASE}/assets/icons/menu.svg" alt="menu icon" class="icon">
            </button>
            <!-- Account icon -->
            <div class="account-menu">
                <button id="account-button" class="account-button" aria-label="Account">
                    <img src="${BASE}/assets/icons/user.svg" alt="User icon" class="icon">
                </button>
                <div id="account-dropdown" class="account-dropdown hidden">
                    ${accountLinks}<!-- Content of the dropdown is created based on login status -->
                </div>
            </div>
            <!-- Cart icon -->
            <button id="cart-button" class="cart-button" aria-label="Open shopping cart">
                <img src="${BASE}/assets/icons/cart.svg" alt="cart icon" class="icon">
                <span id="cart-count">0</span>
            </button>
        </div>

        <div class="header-middle">    
            <a href="${BASE}/index.html" class="logo-link">
                <img src="${BASE}/assets/logo/aytozee-logo.svg" alt="AyToZee logo" class="logo">
            </a>
        </div>
        
        <nav class="header-bottom navbar hidden">
            <ul id=tag-nav>
                <!-- List of tags created in the createTagNav function --> 
            </ul>
        </nav>

    `

    /* clicking Logout button */
    const logoutLink =document.querySelector(".logout-link");
    if (logoutLink){
        logoutLink.addEventListener("click", (event) =>{
            event.preventDefault();
            logout();
            window.location.reload();
        });
    }

    /* Clicking on "Menu" button on mobile opens <nav> */

    const menuButton = document.getElementById("menu-button");

    const navbar = document.querySelector (".navbar");

    menuButton.addEventListener("click", () => {navbar.classList.toggle("open");  
    });
    
    /* Adding "scrolled" class to reduce the size of header when scrolling in header.css */
    let isScrolled = false;
    window.addEventListener("scroll", () => {
        if (!isScrolled && window.scrollY > 80) {
            header.classList.add("scrolled");
            isScrolled = true;
        }
        if (isScrolled && window.scrollY < 40) {
            header.classList.remove("scrolled");
            isScrolled = false;
        }
    });

    /* Clicking outside <nav> closes <nav> */

    document.addEventListener("click", (event) => {

        const clickedInsideNav =
            navbar.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (
            !clickedInsideNav &&
            !clickedMenuButton
        ) {
            navbar.classList.remove("open");
        }

    });

    /*  Clicking on the "account-button" opens the dropdown */
    const accountButton = document.getElementById("account-button");
    const accountDropdown = document.getElementById("account-dropdown");
    accountButton.addEventListener("click", () => {
        accountDropdown.classList.toggle("hidden");
    });

    

    /* Clicking outside the account dropdown closes it */
    document.addEventListener("click", (event) => {
        const clickedDropdown = accountDropdown.contains(event.target);
        const clickedAccountButton = accountButton.contains(event.target);

        if (!clickedDropdown && !clickedAccountButton) {
            accountDropdown.classList.add("hidden");
        }
    });
}


/* NAV */
    /* Creating the content of <nav> in <header> from API "tags" and removing duplicates */
        /* will ONLY be on pages which already fetch products (index.html, and product/index.html) */

export function createTagNav(products){
    const allTags = products.flatMap(
        product => product.tags
    );
    const uniqueTags = [...new Set(allTags)].sort((a, b) => a.localeCompare (b));

    const nav = document.getElementById("tag-nav");

    nav.innerHTML = /* html */ `
        <li>
            <a 
                href="/index.html" class="all-products-link">
                All products
                </a>
        </li>
    `;
    uniqueTags.forEach(tag => {
        nav.innerHTML += /* html */ `
            <li>
                <a href="${BASE}/index.html?tag=${tag}" class="tag-link">${tag}</a>
            </li>
        `;
    });

    const activeTag = new URLSearchParams(window.location.search).get("tag")
    const links = document.querySelectorAll(".tag-link")

    /* Adding "active"class if URL tagparameter = href */
    links.forEach(link => {
        const tag = new URL(link.href).searchParams.get("tag");

        if (tag === activeTag) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    /* Adding "active"class to "All products" if URL has no tagparameter */
    if(!activeTag){
        const allProductsLink = document.querySelector(".all-products-link");
        allProductsLink.classList.add("active")};

}

    /* Making a simple "browse products" link on pages that do not already fetch products */
        /* displayed on:
            - Login
            - Register
            - Cart
            - Checkout
            - Success 
        */
export function createShopLink(){
    const nav = document.getElementById("tag-nav");

    if (!nav) return;
    
    nav.innerHTML = /* html */ `
        <li>
            <a href="${BASE}/index.html" class="all-products-link">← Browse Products</a>
        </li>
    `;
}