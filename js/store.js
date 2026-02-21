// ==============================
// STORE.JS (PROFESSIONAL VERSION)
// ==============================

import {
  addToCart,
  getCart,
  removeFromCart,
  changeQuantity,
  checkoutWhatsApp,
  updateCartCount
} from "./cart.js";

const exchangeRate = 1500; // 1 USD = 1500 NGN (adjust anytime)
// ==============================
// FETCH PRODUCTS FROM FIRESTORE
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔁 Use your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyCiJa7P5IDrTpCWP10RgW81WFulcqIBR4U",
  authDomain: "afri-d548a.firebaseapp.com",
  projectId: "afri-d548a",
  storageBucket: "afri-d548a.appspot.com",
  messagingSenderId: "367284086998",
  appId: "1:367284086998:web:21fe5c619b5c7d3d0c0177"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allProducts = [];

// ==============================
// RENDER PRODUCTS
// ==============================

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = [];

  querySnapshot.forEach((doc) => {
    products.push({
      id: doc.id,
      ...doc.data()
    });
  });

 
  allProducts = products;
  renderProducts(allProducts);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  
  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    // ✅ CALCULATE PRICE FIRST
    let priceHTML = "";

    if (product.currency === "NGN") {
      priceHTML = `₦${product.price}`;
    }

    if (product.currency === "USD") {
      const usd = (product.price / exchangeRate).toFixed(2);
      priceHTML = `$${usd}`;
    }

    if (product.currency === "BOTH") {
      const usd = (product.price / exchangeRate).toFixed(2);
      priceHTML = `₦${product.price} | $${usd}`;
    }

    // ✅ THEN USE IT INSIDE HTML
    card.innerHTML = `
      <img src="${product.imageUrl}" />
      <h3>${product.name}</h3>
      <p>${product.shortDescription || ""}</p>
      <div class="product-price">${priceHTML}</div>

      <div class="product-buttons">
        <button class="btn-cart">Add to Cart</button>
        <button class="btn-learn">Learn More</button>
      </div>
    `;

    // ADD TO CART
    card.querySelector(".btn-cart").addEventListener("click", () => {
      addToCart(product);
      openCartDrawer();
    });

    // LEARN MORE
  
   
    card.querySelector(".btn-learn").addEventListener("click", () => {
      openModal(product.fullDescription || "No description available.");
    });

    grid.appendChild(card);
  });
}


// ==============================
// CART DRAWER SYSTEM
// ==============================

function createCartDrawer() {
  const drawer = document.createElement("div");
  drawer.id = "cartDrawer";

  drawer.innerHTML = `
    <div class="cart-overlay"></div>
    <div class="cart-panel">
      <h2>Your Cart</h2>
      <div id="cartItems"></div>
      <div class="cart-footer">
        <button id="checkoutBtn">Checkout via WhatsApp</button>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);

  // Close when clicking overlay
  drawer.querySelector(".cart-overlay").addEventListener("click", closeCartDrawer);

  // Checkout
  document.getElementById("checkoutBtn").addEventListener("click", checkoutWhatsApp);
}

function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("active");
  renderCartItems();
}

function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("active");
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const cart = getCart();

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>₦${item.price}</p>
      <div class="qty-controls">
        <button class="minus">-</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
      </div>
      <button class="remove">Remove</button>
      <hr/>
    `;

    div.querySelector(".plus").addEventListener("click", () => {
      changeQuantity(item.id, 1);
      renderCartItems();
    });

    div.querySelector(".minus").addEventListener("click", () => {
      changeQuantity(item.id, -1);
      renderCartItems();
    });

    div.querySelector(".remove").addEventListener("click", () => {
      removeFromCart(item.id);
      renderCartItems();
    });

    container.appendChild(div);
  });
}


// ==============================
// CART ICON CLICK
// ==============================

//document.querySelector(".cart").addEventListener("click", () => {
  //openCartDrawer();
//});

document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.querySelector(".cart");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      openCartDrawer();
    });
  }
});
// ==============================
// INIT
// ==============================

createCartDrawer();
loadProducts();
updateCartCount();

// ==============================
// CATEGORY FILTER
// ==============================

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.getAttribute("data-category");

    const filtered = allProducts.filter(product =>
      product.category === category
    );

    renderProducts(filtered);
  });
});

// ==============================
function openModal(text) {
  const modal = document.getElementById("productModal");
  const modalText = document.getElementById("modalText");

  modalText.innerText = text;
  modal.style.display = "flex";
}

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("productModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// ==============================
// SEARCH FUNCTION
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(value)
      );

      renderProducts(filtered);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.style.display = "none";
  }
});