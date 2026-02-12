import { initializeStorage } from "./services/storage-service.js";

initializeStorage();


const form = document.querySelector(".signup-form");
if (form) {
    form.addEventListener("submit", handleSignup);
}

function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        alert("Username already exists.");
        return;
    }

    const newUser = {
        id: "u" + (users.length + 1),
        username,
        password,
        groups: [],
        online: false
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "../index.html";
}