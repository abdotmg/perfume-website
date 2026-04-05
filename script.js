let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= USER =================
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function isLoggedIn() {
    return getLoggedInUser() !== null;
}

// ================= CART =================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function addToCart(name, price, image) {
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    saveCart();
    showMessage(name + " added to cart ✔");
}

function displayCart() {
    let container = document.getElementById("cart-items");
    let totalBox = document.getElementById("cart-total");

    if (!container || !totalBox) {
        return;
    }

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
        totalBox.innerHTML = "Total: $0";
        return;
    }

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${cart[i].image}" alt="${cart[i].name}">
                <div class="cart-item-info">
                    <h3>${cart[i].name}</h3>
                    <p>Price: $${cart[i].price}</p>
                    <p>Quantity: ${cart[i].quantity}</p>

                    <div class="cart-buttons">
                        <button onclick="increaseQuantity(${i})">+</button>
                        <button onclick="decreaseQuantity(${i})">-</button>
                        <button onclick="removeItem(${i})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }

    totalBox.innerHTML = "Total: $" + total;
}

function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function clearCart() {
    cart = [];
    saveCart();
    showMessage("Cart cleared ✔");
}

function updateCartCount() {
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }

    let elements = document.querySelectorAll("#cart-count");
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerText = count;
    }
}

// ================= SEARCH =================
function searchPerfumes() {
    let input = document.getElementById("search");
    if (!input) return;

    let value = input.value.toLowerCase();
    let cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (title.includes(value)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// ================= MESSAGE =================
function showMessage(text) {
    let msg = document.createElement("div");
    msg.className = "toast-message";
    msg.innerText = text;
    document.body.appendChild(msg);

    setTimeout(function () {
        msg.classList.add("show");
    }, 100);

    setTimeout(function () {
        msg.classList.remove("show");
        setTimeout(function () {
            msg.remove();
        }, 300);
    }, 2000);
}

// ================= REGISTER =================
function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("register-name").value.trim();
    let email = document.getElementById("register-email").value.trim();
    let password = document.getElementById("register-password").value;
    let confirmPassword = document.getElementById("register-confirm-password").value;

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            alert("This email already has an account.");
            return;
        }
    }

    let newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    alert("Account created successfully ✔");
    window.location.href = "profile.html";
}

// ================= LOGIN =================
function loginUser(event) {
    event.preventDefault();

    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            localStorage.setItem("loggedInUser", JSON.stringify(users[i]));
            alert("Login successful ✔");
            window.location.href = "profile.html";
            return;
        }
    }

    alert("Wrong email or password.");
}

// ================= LOGOUT =================
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully ✔");
    window.location.href = "login.html";
}

// ================= PROFILE =================
function loadProfile() {
    let user = getLoggedInUser();

    let nameEl = document.getElementById("profile-name");
    let emailEl = document.getElementById("profile-email");

    if (!nameEl || !emailEl) {
        return;
    }

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    nameEl.innerText = user.name;
    emailEl.innerText = user.email;
}

// ================= NAV PROFILE =================
function toggleProfileMenu(event) {
    if (event) {
        event.stopPropagation();
    }

    let menu = document.getElementById("profile-menu");
    if (!menu) return;

    if (menu.classList.contains("show-menu")) {
        menu.classList.remove("show-menu");
    } else {
        menu.classList.add("show-menu");
    }
}

function loadNavProfile() {
    let user = getLoggedInUser();

    let guestMenu = document.getElementById("guest-menu");
    let userMenu = document.getElementById("user-menu");
    let nameEl = document.getElementById("nav-user-name");
    let emailEl = document.getElementById("nav-user-email");

    if (!guestMenu || !userMenu) return;

    if (user) {
        guestMenu.style.display = "none";
        userMenu.style.display = "block";

        if (nameEl) nameEl.innerText = user.name;
        if (emailEl) emailEl.innerText = user.email;
    } else {
        guestMenu.style.display = "block";
        userMenu.style.display = "none";
    }
}

document.addEventListener("click", function (e) {
    let menu = document.getElementById("profile-menu");
    let box = document.querySelector(".profile-box");

    if (!menu || !box) return;

    if (!box.contains(e.target)) {
        menu.classList.remove("show-menu");
    }
});

// ================= CHECKOUT =================
function checkout(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    if (!isLoggedIn()) {
        alert("Please login or create an account first.");
        window.location.href = "login.html";
        return;
    }

    let fullName = document.getElementById("full-name").value.trim();
    let phoneNumber = document.getElementById("phone-number").value.trim();
    let emailAddress = document.getElementById("email-address").value.trim();
    let address = document.getElementById("address").value.trim();
    let city = document.getElementById("city").value.trim();
    let notes = document.getElementById("notes").value.trim();

    if (fullName === "" || phoneNumber === "" || emailAddress === "" || address === "" || city === "") {
        alert("Please fill all checkout information.");
        return;
    }

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }

    let order = {
        customerName: fullName,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        address: address,
        city: city,
        notes: notes,
        items: cart,
        total: total,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order completed successfully ✔");

    cart = [];
    saveCart();

    document.getElementById("full-name").value = "";
    document.getElementById("phone-number").value = "";
    document.getElementById("email-address").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
    document.getElementById("notes").value = "";

    window.location.href = "index.html";
}

// ================= PAGE LOAD =================
window.onload = function () {
    updateCartCount();
    displayCart();
    loadProfile();
    loadNavProfile();

    let loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
};
