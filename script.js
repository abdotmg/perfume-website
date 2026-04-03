let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

window.onload = function () {
    updateCartCount();
    displayCart();

    let loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
};