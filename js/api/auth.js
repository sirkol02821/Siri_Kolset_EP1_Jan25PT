const API_BASE_URL = "https://v2.api.noroff.dev";
// End-points
// Register: /auth/register
// Login: /auth/login


/* sending User registration data to the API registration endpoint */
export async function registerUser(user){
   
    try {        
        const fetchOptions ={ /* options: send data → convert object to JSON → tell API it's JSON */
            method: "POST",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        }
        const registerUrl = `${API_BASE_URL}/auth/register`;

                                    /*fetch from registerUrl, using fetchOptions object created above*/ 
        const response = await fetch(registerUrl, fetchOptions)
    

        //Check if API accepted the request 
        if (!response.ok) { 
            const errorData = await response.json();
            
            throw new Error (errorData.errors?.[0]?.message || "Registration failed.");
        } 
        const data = await response.json(); //Parsing JSON

        return data; // return the data to where the function was called in register.js

    } catch (error) {
        console.error("Fetch error", error.message); // catch and handle any errors
        throw error;
    }
}




export async function loginUser(user) {
    
    

    try {
        const fetchOptions ={ /* options: send data → convert object to JSON → tell API it's JSON */
            method: "POST",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        }

        const response = await fetch(loginUrl, fetchOptions)



        //Check if API accepted the request 
        if (!response.ok) { 
            const errorData = await response.json();
            throw new Error ( errorData.errors?.[0]?.message || "Invalid email or password.");
        } 
        
        const data = await response.json(); //Parsing JSON

        /* Creating access token when user logs in */
        const accessToken = data.data.accessToken; 
        localStorage.setItem(
            "accessToken", 
            accessToken);

        /* Saving username when user logs in to be displayed in the header account-dropdown */
        const username = data.data.name;
        localStorage.setItem(
            "username",
            username);
        

        /* get saved cart (if there is one) when user logs in */
        const savedCart = localStorage.getItem("savedCart");
        if(savedCart){
            localStorage.setItem ("cart", savedCart);
            localStorage.removeItem("savedCart");
        }
        
        return data;
        
    } catch (error) {
        console.error("Fetch error", error.message); // catch and handle any errors
        throw error;
    }
}


const loginUrl = `${API_BASE_URL}/auth/login`;


export function isLoggedIn() {
    return !!localStorage.getItem("accessToken");
}

/* When a user logs out */
    // - save cart
    // - remove accessToken
    // - remove username
export function logout (){
    const cart = localStorage.getItem("cart");
    if (cart) {
        localStorage.setItem("savedCart", cart); //
    }
    localStorage.removeItem("cart");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
}
