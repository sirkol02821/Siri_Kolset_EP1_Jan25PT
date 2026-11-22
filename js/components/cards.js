
/* Making reuseable isOnSale function checking for discount */

export function isOnSale(product){
    return product.discountedPrice < product.price;
}


/*  Making reuseable function turning the rating from API into stars   */
/* Returns ★ if the rounded product rating is greater than the index, otherwise returns ☆ */

export function ratingToStars(rating){

    if (rating === 0){      /* if the product has no ratings */
        return `
            <span class="rating-no-rating">☆☆☆☆☆</span>
            <span class="rating-new">(New product)</span>
            `
    }
    const fullStars = Math.round(rating);
    const stars = Array.from ({ length: 5 }, (_, index) => {
        if (index < fullStars) {
            return "★";
        } else {
            return "☆";
        }
    }).join(""); /* removes comma between array items */
    return stars;
}



/*      PRODUCT CARDS       */

/*Creating product cards from API fetching in api/products.js*/

export function createCard(product) {
    

    /* check for discount */

    const onSale = isOnSale(product);

    /* Showing rating as stars */
    const stars = ratingToStars(product.rating);
    
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

    return /* html */ `
        <article class="product-card">
            <a href="/product/index.html?id=${product.id}" class="product-image-wrapper">
                <img class="product-image" src="${product.image.url}" alt="${product.image.alt}">
                <span class="image-overlay">View Details</span>
            </a>
            <div class="product-card-content">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">${stars}</div>
                <div class="product-pricing">${pricingHTML}</div>
                <a href="/product/index.html?id=${product.id}" class="btn btn-secondary">
                    View Details
                </a>
            </div>
        </article>
    `;
}

/* Calculating savings on discounted products */
    /* used in carousel.js to sort based on savingsPercent  */

export function savingsPercent(product){
    
    if(!isOnSale(product) )
        {return null;}

    return Math.round(
        ((product.price - product.discountedPrice) / product.price * 100)
    );
}
