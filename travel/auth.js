//SIGNUP LOGIC
function handleSignup(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful! Please login.");

    window.location.href = "login.html";
}



//LOGIN LOGIC && to check if all website is logged or not
function handleLogin(event) {
    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        alert("No user found. Please signup first.");
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        

        // ✅ NEW LINE (IMPORTANT)
        localStorage.setItem("isLoggedIn", true);

        window.location.href = "index.html";
    } else {
        alert("Invalid email or password");
    }
}

//CHECK LOGIN STATUS ON PAGE LOAD
function checkLogin() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        alert("Please login to continue");
        window.location.href = "login.html";
    }
}


//LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}