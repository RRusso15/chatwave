import { seedData } from "../../data/seed-data.js";
//load seed data if nothing is in local storage
export function initializeStorage() {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(seedData.users));
    }

    if (!localStorage.getItem("groups")) {
        localStorage.setItem("groups", JSON.stringify(seedData.groups));
    }

    if (!localStorage.getItem("messages")) {
        localStorage.setItem("messages", JSON.stringify(seedData.messages));
    }
}
