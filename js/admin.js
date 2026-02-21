// ===============================
// 🔐 ADMIN PASSWORD PROTECTION
// ===============================
const ADMIN_PASSWORD = "admin2026";
const enteredPassword = prompt("Enter Admin Password:");

if (enteredPassword !== ADMIN_PASSWORD) {
  alert("Access Denied");
  window.location.href = "/";
}

// ===============================
// IMPORTS
// ===============================
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUD_NAME = "dohz7ml9s";
const UPLOAD_PRESET = "eminisotore";

// ===============================
// DOM ELEMENTS
// ===============================
const form = document.getElementById("productForm");
const adminProducts = document.getElementById("adminProducts");

// ===============================
// ADD PRODUCT
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const name = document.getElementById("name").value;
    const shortDescription = document.getElementById("shortDescription").value;
    const fullDescription = document.getElementById("fullDescription").value;
    const price = Number(document.getElementById("price").value);
    const stock = Number(document.getElementById("stock").value);
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("image").files[0];
    const currency = document.querySelector(
      'input[name="currency"]:checked'
    ).value;

    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    // ===============================
    // Upload Image to Cloudinary
    // ===============================
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    const imageUrl = data.secure_url;

    // ===============================
    // Save Product to Firestore
    // ===============================
    await addDoc(collection(db, "products"), {
      name,
      shortDescription,
      fullDescription,
      price,
      stock,
      category,
      currency,
      imageUrl,
      createdAt: new Date()
    });

    alert("✅ Product Added Successfully!");
    form.reset();
    loadProducts();

  } catch (error) {
    console.error("Error:", error);
    alert("❌ Failed to add product.");
  }
});

// ===============================
// LOAD PRODUCTS
// ===============================
async function loadProducts() {
  adminProducts.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((docSnap) => {
    const product = docSnap.data();

    adminProducts.innerHTML += `
      <div>
        <img src="${product.imageUrl}" />
        <h4>${product.name}</h4>
        <p>${product.shortDescription}</p>
        <small><strong>Category:</strong> ${product.category}</small><br>
        <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
      </div>
    `;
  });
}

// ===============================
// DELETE PRODUCT
// ===============================
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

loadProducts();