// ============================================================
// RESTAURANT.JS — Silver Spoons Menu Board
// ============================================================
//
// This app follows the CRUD pattern:
//
//   C — Create : user fills the form → dish is added
//   R — Read   : showMenu() draws every dish on screen
//   U — Update : Edit button → change a dish → save
//   D — Delete : Remove button → dish is gone
//
// The golden rule: change the array first, then call showMenu().
// showMenu() ALWAYS redraws the whole board from the array.
// ============================================================


// ============================================================
// 1. SAVE & LOAD  (localStorage keeps data after page refresh)
// ============================================================

// localStorage is like a tiny notebook in the browser.
// It can only store text, so we convert our array to text first.

function saveMenu() {
    // JSON.stringify turns the array into a text string
    localStorage.setItem("silverSpoons", JSON.stringify(menu));
}

function loadMenu() {
    const saved = localStorage.getItem("silverSpoons");
    // If nothing was saved yet, getItem returns null
    if (saved === null) return null;
    // JSON.parse turns the text string back into an array
    return JSON.parse(saved);
}


// ============================================================
// 2. THE MENU ARRAY  (the single source of truth)
// ============================================================

// Every dish is an object with 5 properties.
// This is the only place data lives — the screen just reflects it.

const seedMenu = [
    // Rice & Biryani
    { name: "Chettinad Chicken Curry",   price: 220, type: "non-veg", spice: "spicy",  special: true  },
    { name: "Mutton Biryani",            price: 280, type: "non-veg", spice: "medium", special: false },
    { name: "Vegetable Biryani",         price: 160, type: "veg",     spice: "medium", special: false },
    { name: "Curd Rice",                 price: 70,  type: "veg",     spice: "mild",   special: false },
    { name: "Lemon Rice",                price: 75,  type: "veg",     spice: "mild",   special: false },
    // Dosas & Tiffin
    { name: "Masala Dosa",               price: 90,  type: "veg",     spice: "mild",   special: false },
    { name: "Ghee Roast Dosa",           price: 110, type: "veg",     spice: "mild",   special: true  },
    { name: "Idli Sambar",               price: 60,  type: "veg",     spice: "mild",   special: false },
    { name: "Medu Vada",                 price: 55,  type: "veg",     spice: "mild",   special: false },
    { name: "Uttapam",                   price: 85,  type: "veg",     spice: "mild",   special: false },
    { name: "Onion Rava Dosa",           price: 100, type: "veg",     spice: "mild",   special: false },
    // Curries & Seafood
    { name: "Prawn Roast",               price: 260, type: "non-veg", spice: "spicy",  special: false },
    { name: "Fish Curry",                price: 230, type: "non-veg", spice: "spicy",  special: false },
    { name: "Egg Masala",                price: 140, type: "non-veg", spice: "medium", special: false },
    { name: "Rasam",                     price: 40,  type: "veg",     spice: "spicy",  special: false },
    { name: "Chicken Chettinad Biryani", price: 300, type: "non-veg", spice: "spicy",  special: true  },
    // Drinks & Desserts
    { name: "Filter Coffee",             price: 40,  type: "veg",     spice: "mild",   special: false },
    { name: "Payasam",                   price: 65,  type: "veg",     spice: "mild",   special: false },
    { name: "Buttermilk",                price: 30,  type: "veg",     spice: "mild",   special: false },
    { name: "Mango Lassi",               price: 55,  type: "veg",     spice: "mild",   special: false },
];

// Try to load saved data. If nothing saved, use seedMenu.
let menu = loadMenu();
if (menu === null) {
    menu = seedMenu;
    saveMenu();
}


// ============================================================
// 3. EDIT STATE
// ============================================================

// This variable tracks whether we are editing a dish or adding one.
// null  = we are ADDING a new dish
// 0,1,2 = we are EDITING the dish at that position in the array

let editingIndex = null;


// ============================================================
// 4. READ — showMenu()
// ============================================================
// This function is called every time the menu changes.
// It clears the board and redraws every dish card from scratch.

function showMenu() {

    const board = document.getElementById("menu-board");
    const countEl = document.getElementById("dish-count");

    // Update the dish count text
    if (menu.length === 0) {
        countEl.textContent = "";
    } else {
        countEl.textContent = menu.length + " dishes on today's menu";
    }

    // If the array is empty, show a friendly message and stop
    if (menu.length === 0) {
        board.innerHTML = `<div class="empty-state">The leaf is empty. Add today's first dish, Praneet!</div>`;
        return;
    }

    // Build an HTML card for each dish in the array.
    // .map() loops over every item and returns a new array of HTML strings.
    // .join("") glues all those strings into one big string.
    board.innerHTML = menu.map(function(dish, i) {

        // i is the position of this dish in the array (0, 1, 2 ...)
        // We store it on the buttons as data-i so we know which dish was clicked.

        const dot         = dish.type === "veg" ? "veg-dot" : "nonveg-dot";
        const badge       = dish.special ? `<div class="special-badge">⭐ Today's Special</div>` : "";
        const cardClass   = dish.special ? "menu-card special" : "menu-card";
        const activeClass = i === editingIndex ? " editing-card" : "";
        const spiceIcons  = { mild: "🌶", medium: "🌶🌶", spicy: "🌶🌶🌶" };
        const starLabel   = dish.special ? "★ Unmark" : "☆ Special";

        return `
            <div class="${cardClass}${activeClass}" data-i="${i}">
                ${badge}
                <div class="card-header">
                    <span class="dot ${dot}"></span>
                    <span class="card-name">${dish.name}</span>
                </div>
                <div class="card-price">&#8377;${dish.price}</div>
                <div class="card-spice">${spiceIcons[dish.spice]} ${dish.spice}</div>
                <div class="card-actions">
                    <button class="btn-special" data-i="${i}">${starLabel}</button>
                    <button class="btn-edit"    data-i="${i}">Edit</button>
                    <button class="btn-remove"  data-i="${i}">Remove</button>
                </div>
            </div>
        `;

    }).join("");

    // --- Attach button listeners after the HTML is written ---
    // We do this here because setting innerHTML destroys old buttons.

    // DELETE: Remove a dish
    document.querySelectorAll(".btn-remove").forEach(function(btn) {
        btn.addEventListener("click", function() {
            const i = parseInt(btn.getAttribute("data-i"));
            if (i === editingIndex) resetForm();  // cancel edit if we deleted the dish being edited
            menu.splice(i, 1);   // remove 1 item at position i
            saveMenu();
            showMenu();
        });
    });

    // UPDATE (trigger): Load dish into the form for editing
    document.querySelectorAll(".btn-edit").forEach(function(btn) {
        btn.addEventListener("click", function() {
            const i = parseInt(btn.getAttribute("data-i"));
            startEditing(i);
        });
    });

    // UPDATE (special toggle): Flip the special flag true/false
    document.querySelectorAll(".btn-special").forEach(function(btn) {
        btn.addEventListener("click", function() {
            const i = parseInt(btn.getAttribute("data-i"));
            menu[i].special = !menu[i].special;  // ! flips true→false or false→true
            saveMenu();
            showMenu();
        });
    });
}


// ============================================================
// 5. UPDATE helpers — startEditing() and resetForm()
// ============================================================

// startEditing(i): fills the form with that dish's data
function startEditing(i) {
    editingIndex = i;               // remember which dish we're changing
    const dish = menu[i];

    // Fill in each form field with the existing values
    document.getElementById("dish-name").value  = dish.name;
    document.getElementById("dish-price").value = dish.price;
    document.getElementById("dish-spice").value = dish.spice;
    document.querySelector(`input[name="dish-type"][value="${dish.type}"]`).checked = true;

    // Switch the button text and show Cancel
    document.getElementById("submit-btn").textContent   = "Update Dish";
    document.getElementById("cancel-edit-btn").style.display = "block";
    document.querySelector(".form-section").classList.add("editing");

    // Scroll to the form so the user can see it (helpful on mobile)
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });

    showMenu();  // re-render so the blue outline appears on the right card
}

// resetForm(): clears the form and goes back to "Add" mode
function resetForm() {
    editingIndex = null;

    document.getElementById("add-form").reset();
    document.getElementById("submit-btn").textContent        = "Add to Board";
    document.getElementById("cancel-edit-btn").style.display = "none";
    document.querySelector(".form-section").classList.remove("editing");
}


// ============================================================
// 6. CREATE & UPDATE — form submit
// ============================================================

document.getElementById("add-form").addEventListener("submit", function(event) {
    event.preventDefault();  // stop the browser from refreshing the page

    // Read what the user typed / selected
    const name  = document.getElementById("dish-name").value.trim();
    const price = parseFloat(document.getElementById("dish-price").value);
    const type  = document.querySelector('input[name="dish-type"]:checked').value;
    const spice = document.getElementById("dish-spice").value;

    // Basic validation
    if (!name)                     { alert("Please enter a dish name!");  return; }
    if (isNaN(price) || price <= 0){ alert("Please enter a valid price!"); return; }

    if (editingIndex === null) {

        // --- CREATE: no dish is selected for editing → add a new one ---
        menu.push({ name, price, type, spice, special: false });

    } else {

        // --- UPDATE: a dish is selected → overwrite its values ---
        menu[editingIndex].name  = name;
        menu[editingIndex].price = price;
        menu[editingIndex].type  = type;
        menu[editingIndex].spice = spice;
        // .special is kept as-is (we don't reset it when editing)

        resetForm();  // go back to "Add" mode after saving
    }

    saveMenu();
    showMenu();
    document.getElementById("add-form").reset();
});


// ============================================================
// 7. Cancel Edit button
// ============================================================

document.getElementById("cancel-edit-btn").addEventListener("click", function() {
    resetForm();
    showMenu();  // remove blue outline from the card
});


// ============================================================
// 8. DELETE ALL — Clear Board button
// ============================================================

document.getElementById("clear-btn").addEventListener("click", function() {
    const ok = window.confirm("Clear the whole menu? This cannot be undone.");
    if (ok) {
        menu = [];
        resetForm();
        saveMenu();
        showMenu();
    }
});


// ============================================================
// 9. FIRST LOAD — draw the board when the page opens
// ============================================================

showMenu();
