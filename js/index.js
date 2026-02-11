import { initializeStorage } from "./services/storage-service.js";

initializeStorage();

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    //get users from storage and find specific user
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user=users.find(
        u=> u.username===usernameInput && u.password ===passwordInput
    );

    if (!user) {
        alert("Invalid username or password.");
        return;
    }

    //if user exists
    user.online=true;
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href='./pages/chat.html';
})