/**
 * Le Havre de Thé - Logique du panier et envoi WhatsApp
 * Code commenté pour faciliter les modifications par une débutante
 */

/* ============================================
   DONNÉES DES PRODUITS
   À modifier pour ajouter/supprimer des produits
   ============================================ */
const PRODUCTS = [
    {
        id: 1,
        name: "Infusion pomme, cannelle et figue",
        description: "Une douceur automnale aux saveurs réconfortantes.",
        price: 5
    },
    {
        id: 2,
        name: "Infusion camomille, fleur d'oranger",
        description: "Apaisante et délicate, pour un moment de détente.",
        price: 5
    },
    {
        id: 3,
        name: "Thé à la menthe et au citron vert",
        description: "Fraîcheur et vitalité dans une tasse.",
        price: 4
    },
    {
        id: 4,
        name: "Thé à la vanille",
        description: "Doux et onctueux, un délice gourmand.",
        price: 4
    },
    {
        id: 5,
        name: "Thé aux fruits rouges",
        description: "Notes acidulées et fruitées.",
        price: 4
    },
    {
        id: 6,
        name: "Infusion bissap, clou de girofle, menthe",
        description: "Exotique et rafraîchissante.",
        price: 5
    },
    {
        id: 7,
        name: "Infusion kinkéliba, gingembre, citron, clou de girofle",
        description: "Tonifiante aux saveurs d'Afrique.",
        price: 6
    },
    {
        id: 8,
        name: "Infusion au curcuma et citron",
        description: "Digestive et réconfortante.",
        price: 5
    }
];

/* ============================================
   PANIER
   Structure : { productId: quantity }
   ============================================ */
let cart = {};

/* Numéro WhatsApp pour les commandes */
const WHATSAPP_NUMBER = "002250544611468";

/* ============================================
   AFFICHAGE DU CATALOGUE
   Crée les cartes produits dans la grille
   ============================================ */
function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    PRODUCTS.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price} €</p>
            <button type="button" class="btn-add" data-id="${product.id}">
                Ajouter au panier
            </button>
        `;
        grid.appendChild(card);
    });

    // Ajouter les écouteurs de clic sur les boutons
    document.querySelectorAll(".btn-add").forEach((btn) => {
        btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
    });
}

/* ============================================
   GESTION DU PANIER
   ============================================ */

/**
 * Ajoute un produit au panier (ou augmente sa quantité)
 */
function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    cart[productId]++;
    updateCartDisplay();
}

/**
 * Modifie la quantité d'un produit dans le panier
 */
function setQuantity(productId, quantity) {
    if (quantity <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = quantity;
    }
    updateCartDisplay();
}

/**
 * Met à jour l'affichage du panier (liste, total, compteur)
 */
function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartEmpty = document.getElementById("cart-empty");
    const cartFooter = document.getElementById("cart-footer");
    const cartCount = document.getElementById("cart-count");

    // Nombre total d'articles
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

    // Construire la liste des articles
    cartItems.innerHTML = "";
    let totalPrice = 0;

    Object.keys(cart)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((productId) => {
            const product = PRODUCTS.find((p) => p.id === productId);
            if (!product) return;

            const quantity = cart[productId];
            const lineTotal = product.price * quantity;
            totalPrice += lineTotal;

            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <span class="cart-item-name">${product.name}</span>
                <div class="cart-item-qty">
                    <button type="button" aria-label="Réduire">−</button>
                    <span>${quantity}</span>
                    <button type="button" aria-label="Augmenter">+</button>
                </div>
                <span class="cart-item-price">${lineTotal} €</span>
            `;

            // Boutons + et -
            const minusBtn = li.querySelector(".cart-item-qty button:first-child");
            const plusBtn = li.querySelector(".cart-item-qty button:last-child");

            minusBtn.addEventListener("click", () =>
                setQuantity(productId, quantity - 1)
            );
            plusBtn.addEventListener("click", () =>
                setQuantity(productId, quantity + 1)
            );

            cartItems.appendChild(li);
        });

    document.getElementById("cart-total").textContent = `${totalPrice} €`;
}

/* ============================================
   ENVOI WHATSAPP
   Génère le message et ouvre le lien
   ============================================ */
function sendToWhatsApp() {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
        alert("Votre panier est vide. Ajoutez des produits avant de commander.");
        return;
    }

    let message = "Bonjour, je souhaite commander :\n\n";

    let totalPrice = 0;

    Object.keys(cart)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((productId) => {
            const product = PRODUCTS.find((p) => p.id === productId);
            if (!product) return;

            const quantity = cart[productId];
            const lineTotal = product.price * quantity;
            totalPrice += lineTotal;

            message += `• ${product.name} x${quantity} - ${lineTotal} €\n`;
        });

    message += `\nTotal : ${totalPrice} €`;

    // Encoder pour l'URL (caractères spéciaux, accents, retours à la ligne)
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}

/* ============================================
   INITIALISATION
   Au chargement de la page
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartDisplay();

    document
        .getElementById("btn-whatsapp")
        .addEventListener("click", sendToWhatsApp);
});
