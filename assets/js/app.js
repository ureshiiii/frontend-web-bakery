// Data
const products = [
    {
        id: 1,
        name: "Classic Butter Croissant",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Sourdough Loaf",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1585478402481-9e44ebf9328e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Strawberry Cream Cake",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Chocolate Glazed Donut",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Assorted Macarons (6pk)",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Blueberry Muffin",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
    }
];

// State
let cart = [];

// Elements
const productGrid = document.getElementById('productQueue');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount'); // Optional: for a badge
const layoutElement = document.querySelector('.cart-overlay');
const sidebarElement = document.querySelector('.cart-sidebar');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    
    // Event delegation for static cart toggle button if exists
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.cart-toggle-btn') || e.target.closest('.close-cart') || e.target.classList.contains('cart-overlay')) {
            toggleDrawer();
        }
    });

    // Close drawer on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            sidebarElement.classList.remove('open');
            layoutElement.classList.remove('open');
        }
    });
});

// Functions
function renderProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    <i class="ph ph-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </article>
    `).join('');
}

function renderCart() {
    const container = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.total-amount');
    const emptyMsg = document.querySelector('.empty-cart');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
        if (totalEl) totalEl.innerText = '$0.00';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-title">${item.name}</div>
                <div class="item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (totalEl) totalEl.innerText = '$' + total.toFixed(2);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty++;
        showToast(`Updated quantity for ${product.name}`);
    } else {
        cart.push({ ...product, qty: 1 });
        showToast(`Added ${product.name} to cart`);
    }

    renderCart();
    
    // Open drawer on mobile when adding item
    if (window.innerWidth < 1024) {
        const sidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-overlay');
        if (sidebar && !sidebar.classList.contains('open')) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }
    }
}

function updateQty(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].qty += change;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    showToast('Item removed from cart');
}

function toggleDrawer() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
