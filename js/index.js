import { initializeStorage } from "./services/storage-service.js";

initializeStorage();

const loginForm = document.querySelector(".login-form");

if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        alert("Invalid username or password.");
        return;
    }

    user.online = true;
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "./pages/chat.html";
}