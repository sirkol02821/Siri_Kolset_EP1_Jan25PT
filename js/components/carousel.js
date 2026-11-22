import { getProducts } from "../api/products.js";
import { isOnSale, savingsPercent } from "./cards.js";

let currentIndex = 0;
let carouselProducts = []; 


export async function createCarousel (){
    const products = await getProducts();

    /* Filter products to only show products with over 4.5 rating, and that are on discount in carousel*/
    carouselProducts = products.filter(product =>
        product.rating >= 4.5 &&
        isOnSale(product)
        )
        .sort((a,b) =>
            savingsPercent(b) - savingsPercent(a)
        )
        .slice(0,3);

    renderCarousel();
}

function renderCarousel() {
    if(!carouselProducts.length){return;} /* if API doesn't have at least 3 products matching the criteria, stop the function */
    
    const carousel = document.getElementById("carousel");
    const product = carouselProducts [currentIndex];
    const onSale = isOnSale(product);
    const dealRank = currentIndex + 1;
    
    let pricingHTML;
        if (onSale){
            pricingHTML = `
                <p class="product-price original-price">
                    ${product.price.toFixed(2)} NOK
                </p>
                <p class="product-discount">
                    ${product.discountedPrice.toFixed(2)} NOK
                </p>
            `
        } else {
            pricingHTML = `
                <p class="product-price">
                    ${product.price.toFixed(2)} NOK
                </p>
            `
    }


    carousel.innerHTML = /* html */ `
        <button id="carousel-previous" class="btn carousel-btn">←</button>
        <article class="carousel-card">
            <div class="carousel-rank">
                <h3>#${dealRank}</h3>
                <p>top rated deal</p>
            </div>
            <div class="carousel-image-wrapper">
                <img src="${product.image.url}" alt="${product.image.alt}">
                <p class="carousel-badge">Save ${savingsPercent(product)}%</p>
            </div>
            <h2>${product.title}</h2>
            <div class="carousel-pricing">${pricingHTML}</div>
            <a href="./product/index.html?id=${product.id}" class="btn btn-primary">
                View Details
            </a>
        </article>
        <button id="carousel-next" class="btn carousel-btn">→</button>
        `
        setupCarouselButtons();
}

function setupCarouselButtons(){
    const previousButton = document.getElementById("carousel-previous");
    const nextButton = document.getElementById("carousel-next");

    previousButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + carouselProducts.length)% carouselProducts.length;
        renderCarousel();
    })

    nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1)% carouselProducts.length;
    renderCarousel();
    })    
}
