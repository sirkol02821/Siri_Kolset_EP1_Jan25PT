import { registerUser, isLoggedIn, logout } from "../api/auth.js";

const registerForm = document.getElementById("register-form");

/* If a logged in user manages to navigate to the register page display this */
if(isLoggedIn()) {
    const username = localStorage.getItem("username");

    registerForm.innerHTML = /* html */ `
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

} else {

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const usernameRegex = /^[A-Za-z0-9_]+$/;  /* name can contain "A-Z" "a-z" "0-9" and "_" */

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        const errorMessage = document.getElementById("register-error");
        errorMessage.textContent = "";

        if (username.includes(" ")){
            errorMessage.textContent = "Username may not contain spaces."
            return;
        }
        if (!usernameRegex.test(username)) {
            errorMessage.textContent = "Username may only contain letters, numbers and underscores.";
            return;
        }

        if(!email.endsWith("@stud.noroff.no")) {
            errorMessage.textContent = "Please use a stud.noroff.no email address.";
            return;
        }
        if(password.length < 8) {
            errorMessage.textContent = "Password must be at least 8 characters.";
            return;
        }
        if(password !== confirmPassword) {
            errorMessage.textContent ="Passwords do not match.";
            return;
        }

        try{
            await registerUser({
                name: username, 
                email, 
                password
            })
            window.location.href = "./login.html"
        } catch (error) {
            errorMessage.textContent = error.message;
        }

    });
}