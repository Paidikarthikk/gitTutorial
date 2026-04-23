const products = [
  {
    id: "book-01",
    title: "The Infinite Library",
    author: "Iris Collins",
    category: "fiction",
    price: 18.9,
    rating: 4.9,
    description: "A literary adventure through mystery, passion, and discovery in a world built on stories.",
  },
  {
    id: "book-02",
    title: "Mindset for Success",
    author: "Noah Wells",
    category: "business",
    price: 14.5,
    rating: 4.7,
    description: "Proven frameworks to build habits, confidence, and smart decision-making for career growth.",
  },
  {
    id: "book-03",
    title: "Everyday Science",
    author: "Lina Patel",
    category: "nonfiction",
    price: 12.0,
    rating: 4.8,
    description: "Understand the science behind daily routines, weather, and the human body with easy examples.",
  },
  {
    id: "book-04",
    title: "Storytime Stars",
    author: "Luna Hart",
    category: "kids",
    price: 9.75,
    rating: 4.6,
    description: "Colorful tales and joyful characters for early readers who love imagination.",
  },
  {
    id: "book-05",
    title: "Creative Business",
    author: "Marek Johnson",
    category: "business",
    price: 21.99,
    rating: 4.5,
    description: "Launch your brand, design memorable customer experiences, and build a flexible business plan.",
  },
  {
    id: "book-06",
    title: "Modern Memoirs",
    author: "Ava Brown",
    category: "nonfiction",
    price: 17.4,
    rating: 4.8,
    description: "A collection of real stories that inspire empathy, curiosity, and quiet reflection.",
  },
  {
    id: "book-07",
    title: "Moonlight Quest",
    author: "Leo Maxwell",
    category: "fiction",
    price: 15.25,
    rating: 4.7,
    description: "A magical quest of friendship, courage, and unexpected secrets under the night sky.",
  },
  {
    id: "book-08",
    title: "Bright Beginnings",
    author: "Eva Garcia",
    category: "kids",
    price: 11.6,
    rating: 4.9,
    description: "A playful adventure with singing animals, silly rhymes, and helpful lessons for little readers.",
  },
];

const cart = JSON.parse(localStorage.getItem("booknestCart") || "{}");
const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sortSelect = document.getElementById("sortSelect");
const resultsNotice = document.getElementById("resultsNotice");
const shopNowBtn = document.getElementById("shopNowBtn");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPanel = document.getElementById("checkoutPanel");
const checkoutForm = document.getElementById("checkoutForm");

function saveCart() {
  localStorage.setItem("booknestCart", JSON.stringify(cart));
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartCount() {
  const totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
  cartToggle.setAttribute("aria-label", `Cart with ${totalQuantity} items`);
}

function renderToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toast.hideTimeout);
  toast.hideTimeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function updateCartSidebar() {
  cartItemsContainer.innerHTML = "";
  const items = Object.values(cart);
  if (!items.length) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty. Add a book to get started.</p>";
  }
  let total = 0;
  items.forEach((item) => {
    const line = products.find((book) => book.id === item.id);
    const itemTotal = line.price * item.quantity;
    total += itemTotal;
    const card = document.createElement("div");
    card.className = "cart-item";
    card.innerHTML = `
      <div>
        <h4>${line.title}</h4>
        <p>${line.author}</p>
        <p>${formatPrice(line.price)} × ${item.quantity} = ${formatPrice(itemTotal)}</p>
      </div>
      <div class="item-actions">
        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
        <button class="quantity-btn" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(card);
  });
  cartTotal.textContent = formatPrice(total);
  renderOrderSummary();
}

function renderOrderSummary() {
  summaryItems.innerHTML = "";
  const items = Object.values(cart);
  let total = 0;
  if (!items.length) {
    summaryItems.innerHTML = "<p>Your order summary is empty. Add books to begin.</p>";
  }
  items.forEach((item) => {
    const book = products.find((product) => product.id === item.id);
    const lineTotal = book.price * item.quantity;
    total += lineTotal;
    const row = document.createElement("div");
    row.className = "summary-card";
    row.innerHTML = `
      <span>${item.quantity} × ${book.title}</span>
      <strong>${formatPrice(lineTotal)}</strong>
    `;
    summaryItems.appendChild(row);
  });
  summaryTotal.textContent = formatPrice(total);
}

function addToCart(id) {
  if (!cart[id]) {
    cart[id] = { id, quantity: 0 };
  }
  cart[id].quantity += 1;
  saveCart();
  updateCartCount();
  updateCartSidebar();
  renderToast("Book added to cart");
}

function updateCartItem(id, action) {
  const item = cart[id];
  if (!item) return;
  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
  } else if (action === "remove") {
    delete cart[id];
  }
  if (item && item.quantity <= 0) delete cart[id];
  saveCart();
  updateCartCount();
  updateCartSidebar();
}

function renderProducts(list) {
  productsContainer.innerHTML = "";
  if (!list.length) {
    productsContainer.innerHTML = "<p>No books match your search. Try a different term or category.</p>";
    resultsNotice.textContent = "No results found.";
    return;
  }
  resultsNotice.textContent = `Showing ${list.length} books`;
  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-badge">${product.category}</div>
      <div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-author">by ${product.author}</p>
      </div>
      <p class="product-description">${product.description}</p>
      <div class="product-meta">
        <span class="product-price">${formatPrice(product.price)}</span>
        <span>⭐ ${product.rating}</span>
      </div>
      <div class="product-actions">
        <button class="primary-btn" data-add="${product.id}">Add to cart</button>
        <button class="secondary-btn" data-add="${product.id}">Quick add</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = navLinks.find((button) => button.classList.contains("active")).dataset.filter;
  const sortValue = sortSelect.value;

  let filtered = [...products];
  if (selectedCategory !== "all") {
    filtered = filtered.filter((product) => product.category === selectedCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter((product) => {
      return [product.title, product.author, product.category, product.description].some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    });
  }
  if (sortValue === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }
  renderProducts(filtered);
}

function setActiveCategory(categoryButton) {
  navLinks.forEach((button) => button.classList.remove("active"));
  categoryButton.classList.add("active");
  applyFilters();
}

navLinks.forEach((button) => {
  button.addEventListener("click", () => setActiveCategory(button));
});

sortSelect.addEventListener("change", applyFilters);
searchBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyFilters();
});
shopNowBtn.addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

productsContainer.addEventListener("click", (event) => {
  const bookId = event.target.dataset.add;
  if (bookId) addToCart(bookId);
});

cartToggle.addEventListener("click", () => {
  cartSidebar.classList.toggle("open");
  cartSidebar.setAttribute("aria-hidden", cartSidebar.classList.contains("open") ? "false" : "true");
});
closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
});

cartItemsContainer.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (action && id) {
    updateCartItem(id, action);
  }
});

checkoutBtn.addEventListener("click", () => {
  checkoutPanel.scrollIntoView({ behavior: "smooth" });
  cartSidebar.classList.remove("open");
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const items = Object.values(cart);
  if (!items.length) {
    renderToast("Add books to your cart before checking out.");
    return;
  }
  const name = document.getElementById("nameField").value.trim();
  if (!name) {
    renderToast("Please enter your name to complete checkout.");
    return;
  }
  cartItemsContainer.innerHTML = "";
  summaryItems.innerHTML = "";
  Object.keys(cart).forEach((key) => delete cart[key]);
  saveCart();
  updateCartCount();
  updateCartSidebar();
  renderToast(`Thanks, ${name}! Your order is confirmed.`);
  checkoutForm.reset();
});

function init() {
  updateCartCount();
  updateCartSidebar();
  renderProducts(products);
  const storedSearch = searchInput.value.trim();
  if (storedSearch) applyFilters();
}

init();
