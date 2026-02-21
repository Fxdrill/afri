// ==========================
// PROFESSIONAL CART SYSTEM
// ==========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UPDATE CART ICON COUNT
export function updateCartCount() {
  const cartIcon = document.querySelector(".cart");
  if (!cartIcon) return;

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIcon.innerText = "🛒 " + totalQty;
}

// SAVE TO LOCAL STORAGE
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ADD TO CART
export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  alert(product.name + " added to cart");
}

// REMOVE ITEM
export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// CHANGE QUANTITY
export function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  }

  saveCart();
}

// GET CART ITEMS
export function getCart() {
  return cart;
}

// CLEAR CART
export function clearCart() {
  cart = [];
  saveCart();
}

// WHATSAPP CHECKOUT
export function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let message = "Hello, I want to order:%0A%0A";

  cart.forEach(item => {
    message += `${item.name} x${item.quantity} - ₦${item.price * item.quantity}%0A`;
  });

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  message += `%0ATotal: ₦${total}`;

  const phone = "2347067291452";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  clearCart();
}

// AUTO LOAD COUNT ON PAGE LOAD
updateCartCount();