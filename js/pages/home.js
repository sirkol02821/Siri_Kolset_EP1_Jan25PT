
import { getProducts } from "../api/products.js";
import { createCard } from "../components/cards.js";
import { createTagNav} from "../components/header.js";
import { createCarousel } from "../components/carousel.js";
import loader from "../components/loader.js";


/* don't show carousel if in a product tag category */
const activeTag = new URLSearchParams(window.location.search).get("tag");

const carouselSection = document.querySelector(".carousel-section");

if (activeTag && carouselSection) {
    carouselSection.classList.add("hidden");
} else {
    createCarousel();
}
/* Change Hero section based on which tag category is active */
const heroTitle = document.getElementById("hero-title");
const heroInfo = document.getElementById("hero-info");

if (activeTag && heroTitle) {
    heroTitle.textContent = activeTag;
    heroInfo.classList.add("hidden");
}

/* Show product cards */
async function displayProducts() {
    
    loader.showLoader();
    
    try {
        const products = await getProducts();

        createTagNav(products);

        const productGrid = document.getElementById("product-grid");
        const params = new URLSearchParams(window.location.search);
        const selectedTag = params.get("tag");

        let productsToRender = products;

        if (selectedTag) {
            productsToRender = products.filter(product => product.tags.includes(selectedTag));
        }

        productGrid.innerHTML= "";

        productsToRender.forEach(product => {
            productGrid.innerHTML += createCard(product);
        });
    } finally{
        loader.hideLoader();
    }
}

displayProducts();
