/* Generating an ordernumber to be displayed on success/index.html */

const orderNumber = document.getElementById("order-number");

if (orderNumber) {
    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    orderNumber.textContent =
        `Order #AYZ-${randomNumber}`;
}

/* Getting cart and shippingDetails saved in localStorage (from when "complete purchase" button is clicked on checkout/index.html) */
function renderOrderSummary() {
    const order = JSON.parse(localStorage.getItem("lastOrder")) || [];
    const shippingDetails = JSON.parse(localStorage.getItem("shippingDetails"));

    const totalPaid = localStorage.getItem("lastOrderTotal");
    
    const successItems = document.getElementById("success-items");
    const successTotal = document.getElementById("success-total");
    const shippingDetailsContainer = document.getElementById("shipping-details");

    order.forEach(item => {
        successItems.innerHTML += `
            <p>${item.quantity|| 1} × ${item.title}</p>
        `;
    });

    if (successTotal && totalPaid) {
        successTotal.innerHTML = `
            <h3>${Number(totalPaid).toFixed(2)} NOK</h3>
            <p>Payment completed</p>`
    }
    if (shippingDetailsContainer) {
        shippingDetailsContainer.innerHTML = /* html */`
            <p>${shippingDetails.firstName} ${shippingDetails.lastName}</p>
            <p>${shippingDetails.address}</p>
            <p>${shippingDetails.postalCode} ${shippingDetails.city}</p>
        `;
    }
}



/* safeguard against users navigating to success/index.html without having completed a purchase*/
const lastOrder =
    JSON.parse(localStorage.getItem("lastOrder"));

if (!lastOrder || lastOrder.length === 0) {

    document.querySelector("main").innerHTML = `
        <section class="empty-success">
            <h1>No Order Found</h1>

            <p>
                You haven't completed a purchase yet.
            </p>

            <a href="/index.html" class="btn btn-primary">
                Browse Products
            </a>
        </section>
    `;

} else {

    renderOrderSummary();

    /* Removing the saved lastOrder so navigating back to success/index.html will show the "no order found" message */
    localStorage.removeItem("lastOrder");
    localStorage.removeItem("lastOrderTotal");
    localStorage.removeItem("shippingDetails");

}