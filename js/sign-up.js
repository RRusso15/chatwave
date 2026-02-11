import { initializeStorage } from "./services/storage-service.js";

initializeStorage();


const form = document.querySelector(".signup-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    //validation
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    //Check if username already exists
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        alert("Username already exists.");
        return;
    }

    // Create new user
    const newUser = {
        id: "u" + (users.length + 1),
        username: username,
        password: password,
        groups: [],
        online: false
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");

    // Redirect to sign-in page
    window.location.href = "../index.html";
});
