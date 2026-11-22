import { loginUser, isLoggedIn, logout } from "../api/auth.js";

const loginForm = document.getElementById("login-form");


/* If a logged in user manages to navigate to the login page display this */
if(isLoggedIn()) {
    const username = localStorage.getItem("username");

    loginForm.innerHTML = /* html */ `
        <div class="logged-in-message">
            <h1>Already Logged In</h1>
            <p>You are already logged in as <strong>${username}</strong>.</p>
            <p>Log out if you would like to switch accounts.</p>
            <button id="logout-button" class="btn btn-secondary">Logout</button>
        </div>
    `;
    const logoutButton =
    document.getElementById("logout-button");

    logoutButton.addEventListener("click", () => {
        logout();
    window.location.reload();

});

} else { /* Behaviour of submit button if no user is logged in */

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const errorMessage = document.getElementById("form-error");
        errorMessage.textContent = "";

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        if (!email) { errorMessage.textContent = "Please enter an email address.";
            return;
        }

        if (!password) { errorMessage.textContent = "Please enter your password.";
            return;
        }

        try{
            await loginUser ({
                email, 
                password
            });

            /* Return user to the page they were on when they clicked the "login-button" */
                /* added eventlistener in reviews.js on  href="../account/login.html" */
            const returnURL = localStorage.getItem("returnURL");
            if (returnURL) {
                localStorage.removeItem("returnURL");
                window.location.href = returnURL;
            } else {
                window.location.href = "/index.html";
            }
        } catch(error) {
            errorMessage.textContent = error.message;
        }
    });
}