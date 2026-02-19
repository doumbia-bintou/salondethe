
/**
 * Le Havre de Thé - Logique du panier et envoi WhatsApp
 */

const PRODUCTS = [
    {
        id: 1,
        name: "Infusion pomme, cannelle et figue",
        description: "Une douceur automnale aux saveurs réconfortantes.",
        price: 5,
        image: "images/the1.jpg"
    },
    {
        id: 2,
        name: "Infusion camomille, fleur d'oranger",
        description: "Apaisante et délicate, pour un moment de détente.",
        price: 5,
        image: "images/the2.jpg"
    },
    {
        id: 3,
        name: "Thé à la menthe et au citron vert",
        description: "Fraîcheur et vitalité dans une tasse.",
        price: 4,
        image: "images/the3.jpg"
    },
    {
        id: 4,
        name: "Thé à la vanille",
        description: "Doux et onctueux, un délice gourmand.",
        price: 4,
        image: "images/the4.jpg"
    },
    {
        id: 5,
        name: "Thé aux fruits rouges",
        description: "Notes acidulées et fruitées.",
        price: 4,
        image: "images/the1.jpg"
    },
    {
        id: 6,
        name: "Infusion bissap, clou de girofle, menthe",
        description: "Exotique et rafraîchissante.",
        price: 5,
        image: "images/the2.jpg"
    },
    {
        id: 7,
        name: "Infusion kinkéliba, gingembre, citron, clou de girofle",
        description: "Tonifiante aux saveurs d'Afrique.",
        price: 6,
        image: "images/the3.jpg"
    },
    {
        id: 8,
        name: "Infusion au curcuma et citron",
        description: "Digestive et réconfortante.",
        price: 5,
        image: "images/the4.jpg"
    }
];

let cart = {};
const WHATSAPP_NUMBER = "002250544611468";

function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    PRODUCTS.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-body">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} €</p>
                <button type="button" class="btn-add" data-id="${product.id}">
                    Ajouter au panier
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll(".btn-add").forEach((btn) => {
        btn.addEventListener("click", () =>
            addToCart(parseInt(btn.dataset.id))
        );
    });
}

function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    cart[productId]++;
    updateCartDisplay();
}

function setQuantity(productId, quantity) {
    if (quantity <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = quantity;
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartEmpty = document.getElementById("cart-empty");
    const cartFooter = document.getElementById("cart-footer");
    const cartCount = document.getElementById("cart-count");

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartCount.textContent = totalItems;

    if (totalItems === 0) {
        cartEmpty.style.display = "block";
        cartFooter.style.display = "none";
        cartItems.innerHTML = "";
        return;
    }

    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";

    cartItems.innerHTML = "";
    let totalPrice = 0;

    Object.keys(cart)
        .map(Number)
        .forEach((productId) => {
            const product = PRODUCTS.find((p) => p.id === productId);
            if (!product) return;

            const quantity = cart[productId];
            const lineTotal = product.price * quantity;
            totalPrice += lineTotal;

            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <span>${product.name} x${quantity}</span>
                <span>${lineTotal} €</span>
            `;
            cartItems.appendChild(li);
        });

    document.getElementById("cart-total").textContent = `${totalPrice} €`;
}

function sendToWhatsApp() {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
        alert("Votre panier est vide.");
        return;
    }

    let message = "Bonjour, je souhaite commander :\n\n";
    let totalPrice = 0;

    Object.keys(cart)
        .map(Number)
        .forEach((productId) => {
            const product = PRODUCTS.find((p) => p.id === productId);
            const quantity = cart[productId];
            const lineTotal = product.price * quantity;
            totalPrice += lineTotal;

            message += `• ${product.name} x${quantity} - ${lineTotal} €\n`;
        });

    message += `\nTotal : ${totalPrice} €`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartDisplay();
    document
        .getElementById("btn-whatsapp")
        .addEventListener("click", sendToWhatsApp);
});
