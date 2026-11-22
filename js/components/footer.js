const BASE = "/Siri_Kolset_EP1_Jan25PT";

export function createFooter() {
    const footer = document.getElementById("footer");

    if (!footer) {
        return;
    }

    footer.innerHTML = /* html */ `
        <div class="footer-content">

            <section class="footer-links">
                <h2>Shop</h2>
                <ul>
                    <li><a href="${BASE}/index.html">All Products</a></li>
                </ul>
            </section>

            <section class="footer-account">
                <h2>Account</h2>
                <ul>
                    <li><a href="${BASE}/account/login.html">Login</a></li>
                    <li><a href="${BASE}/account/register.html">Register</a></li>
                </ul>
            </section>

            <section class="footer-contact">
                <h2>Contact</h2>
                <ul>
                    <li><a href="mailto:info@aytozee.com">Email Us</a></li>
                </ul>
            </section>

        </div>

        <div class="footer-socials">
            <a href="#"><img src="${BASE}/assets/icons/facebook.svg" alt="Facebook"></a>
            <a href="#"><img src="${BASE}/assets/icons/instagram.svg" alt="Instagram"></a>
            <a href="#"><img src="${BASE}/assets/icons/youtube.svg" alt="Youtube"></a>
        </div>

        <div class="footer-bottom">
            <img src="${BASE}/assets/logo/aytozee-logo.svg" alt="AyToZee logo" class="logo">
            <p>&copy; 2026 AyToZee. All rights reserved.</p>
        </div>
    `;
}