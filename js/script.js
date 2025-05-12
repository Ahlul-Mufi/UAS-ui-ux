/**
 * Data Produk
 * Array berisi informasi produk yang tersedia di toko
 */
const products = [
  {
    name: "Premium food",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "food",
    description: "Makanan hewan berkualitas tinggi yang dirancang untuk memberikan nutrisi optimal bagi anjing, kucing, dan hewan peliharaan lainnya.",
    rating: [1, 1, 1, 1, 0.5]
  },
  {
    name: "Interactive Cat Toy",
    price: 12.99,
    image: "https://plus.unsplash.com/premium_photo-1664371206022-59b8607e00ac?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cat",
    description: "Mainan interaktif yang merangsang instink berburu kucing Anda, memberikan hiburan selama berjam-jam.",
    rating: [1, 1, 1, 1, 1]
  },
  {
    name: "Large Bird Cage",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "bird",
    description: "Kandang burung besar yang luas dan tahan lama, cocok untuk burung beo dan burung besar lainnya, dengan ruang untuk mainan dan tenggeran.",
    rating: [1, 1, 1, 1, 0]
  },
  {
    name: "Aquarium Starter Kit",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1583949184685-33fda190a216?q=80&w=1572&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "fish",
    description: "Paket lengkap untuk memulai akuarium, termasuk tangki, filter, pemanas, dan elemen dekoratif untuk lingkungan ikan yang sehat.",
    rating: [1, 1, 1, 0.5, 0]
  },
  {
    name: "Premium Dog Leash",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "dog",
    description: "Tali anjing yang kokoh dan bergaya, dirancang untuk kenyamanan dan kontrol saat berjalan, cocok untuk semua ukuran anjing.",
    rating: [1, 1, 1, 1, 0]
  },
  {
    name: "Premium Cat",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "cat",
    description: "Tempat tidur kucing yang lembut dan nyaman, memberikan tempat istirahat yang ideal untuk kucing Anda.",
    rating: [1, 1, 1, 1, 0.5]
  },
  {
    name: "Premium Bird",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "bird",
    description: "Makanan burung premium yang kaya nutrisi, dirancang untuk menjaga kesehatan dan vitalitas burung peliharaan Anda.",
    rating: [1, 1, 1, 1, 1]
  },
  {
    name: "Pet Grooming Kit",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "small-animal",
    description: "Kit perawatan lengkap untuk hewan kecil, termasuk sikat, gunting kuku, dan sampo untuk menjaga kebersihan dan kesehatan hewan peliharaan Anda.",
    rating: [1, 1, 1, 1, 0]
  }
];

/**
 * Fungsi untuk memuat partial HTML dari file eksternal
 * @param {string} elementId - ID elemen HTML tempat partial dimuat
 * @param {string} url - URL file partial
 */
async function loadPartial(elementId, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Gagal memuat ${url}`);
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;

    // Inisialisasi berbagai fungsi berdasarkan halaman yang dimuat
    if (elementId === 'navbar') {
      initializeHamburgerMenu();
      updateCartCount();
      highlightActiveLink();
    }
    if (window.location.pathname.includes('cart.html')) {
      renderCart();
    }
    if (window.location.pathname.includes('pembayaran.html')) {
      renderCheckout();
    }
    if (window.location.pathname.includes('history.html')) {
      renderOrderHistory();
    }
    if (window.location.pathname.includes('products.html')) {
      initializeFilters();
    }
    if (window.location.pathname.includes('product-detail.html')) {
      initializeProductDetail();
    }
  } catch (error) {
    console.error(error);
    document.getElementById(elementId).innerHTML = `<p>Error memuat ${url}</p>`;
  }
}

/**
 * Fungsi untuk inisialisasi menu hamburger
 */
function initializeHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  } else {
    console.error('Hamburger atau nav-links tidak ditemukan di DOM');
  }
}

/**
 * Fungsi untuk menyorot tautan aktif di navbar berdasarkan halaman saat ini
 */
function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Sorot Home untuk index.html
    if (href === 'index.html' && currentPage === 'index.html') {
      link.classList.add('active');
    }
    // Sorot Articles untuk articles.html dan article-detail.html
    else if (href === 'articles.html' && (currentPage === 'articles.html' || currentPage === 'article-detail.html')) {
      link.classList.add('active');
    }
    // Sorot Shop untuk products.html, product-detail.html, cart.html, dan pembayaran.html
    else if (href === 'products.html' && (currentPage === 'products.html' || currentPage === 'product-detail.html' || currentPage === 'cart.html' || currentPage === 'pembayaran.html')) {
      link.classList.add('active');
    }
    // Sorot History untuk history.html
    else if (href === 'history.html' && currentPage === 'history.html') {
      link.classList.add('active');
    }
    // Sorot tautan saat ini jika tidak ada aturan khusus
    else if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Fungsi untuk mengelola keranjang belanja
 */

/**
 * Mendapatkan data keranjang dari localStorage
 * @returns {Array} Array berisi item keranjang
 */
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * Menyimpan data keranjang ke localStorage
 * @param {Array} cart - Array berisi item keranjang
 */
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Menambahkan produk ke keranjang
 * @param {Object} product - Objek produk dengan properti name, price, dan image
 */
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

/**
 * Memperbarui jumlah item di ikon keranjang di navbar
 */
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  } else {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const span = document.createElement('span');
      span.className = 'cart-count';
      span.textContent = count;
      cartIcon.appendChild(span);
    }
  }
}

/**
 * Merender isi keranjang di halaman cart.html
 */
function renderCart() {
  const cart = getCart();
  const cartItemsList = document.getElementById('cart-items-list');
  const cartItemCount = document.getElementById('cart-item-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShipping = document.getElementById('cart-shipping');
  const cartTax = document.getElementById('cart-tax');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItemsList) return;

  cartItemsList.innerHTML = '';

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="remove-item" data-index="${index}"><i class="fas fa-trash"></i> Hapus</p>
      </div>
      <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
        <input type="text" value="${item.quantity}" readonly>
        <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
      </div>
    `;
    cartItemsList.appendChild(cartItem);
  });

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  cartItemCount.textContent = itemCount;
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartShipping.textContent = `$${shipping.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Merender ringkasan pesanan di halaman pembayaran.html
 */
function renderCheckout() {
  const cart = getCart();
  const orderItemsList = document.getElementById('order-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShipping = document.getElementById('cart-shipping');
  const cartTax = document.getElementById('cart-tax');
  const cartTotal = document.getElementById('cart-total');

  if (!orderItemsList) return;

  orderItemsList.innerHTML = '';

  cart.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.style.marginBottom = '15px';
    orderItem.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <span>${item.name} (x${item.quantity})</span>
        <span>$${parseFloat(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    orderItemsList.appendChild(orderItem);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartShipping.textContent = `$${shipping.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Merender riwayat pesanan di halaman history.html
 */
function renderOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderHistoryList = document.getElementById('order-history-list');

  if (!orderHistoryList) return;

  orderHistoryList.innerHTML = '';

  if (orders.length === 0) {
    orderHistoryList.innerHTML = `
      <p style="text-align: center; color: #666;">Belum ada pesanan.</p>
    `;
    return;
  }

  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.style.backgroundColor = '#f9f9f9';
    orderCard.style.padding = '20px';
    orderCard.style.marginBottom = '20px';
    orderCard.style.borderRadius = '5px';
    orderCard.innerHTML = `
      <h3 style="margin-bottom: 10px;">Pesanan ${order.id}</h3>
      <p style="color: #666; margin-bottom: 10px;">Tanggal: ${new Date(order.timestamp).toLocaleString()}</p>
      <div style="margin-bottom: 10px;">
        <strong>Item:</strong>
        <ul style="margin: 5px 0; padding-left: 20px;">
          ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${parseFloat(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Detail Pengiriman:</strong>
        <p style="margin: 5px 0;">Nama: ${order.shippingDetails.fullName}</p>
        <p style="margin: 5px 0;">Email: ${order.shippingDetails.email}</p>
        <p style="margin: 5px 0;">Telepon: ${order.shippingDetails.phone}</p>
        <p style="margin: 5px 0;">Alamat: ${order.shippingDetails.address}</p>
      </div>
      <p style="margin-bottom: 10px;"><strong>Metode Pembayaran:</strong> ${order.paymentMethod === 'credit-card' ? 'Kartu Kredit' : 'PayPal'}</p>
      <p style="margin-bottom: 10px;"><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
    `;
    orderHistoryList.appendChild(orderCard);
  });
}

/**
 * Inisialisasi filter kategori di halaman products.html
 */
function initializeFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const productCards = document.querySelectorAll('.product-card');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

/**
 * Inisialisasi detail produk di halaman product-detail.html
 */
function initializeProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  const productContent = document.getElementById('product-content');

  if (!productContent) return;

  const product = products.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === productId);

  if (product) {
    document.title = `${product.name} | PawParadise`;
    productContent.innerHTML = `
      <div class="product-header" style="margin-bottom: 40px;">
        <h1 style="font-size: 36px; margin-bottom: 15px;">${product.name}</h1>
        <div class="product-meta" style="display: flex; justify-content: space-between; color: #666; margin-bottom: 20px;">
          <span><i class="fas fa-paw"></i> Kategori: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
          <span><i class="fas fa-dollar-sign"></i> $${product.price.toFixed(2)}</span>
        </div>
        <div class="product-image" style="height: 500px; overflow: hidden; border-radius: 10px; margin-bottom: 30px;">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </div>
      <div class="product-details">
        <h2 style="font-size: 28px; margin: 40px 0 20px;">Deskripsi Produk</h2>
        <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">${product.description}</p>
        <div class="product-rating" style="margin-bottom: 20px;">
          ${product.rating.map(r => r === 1 ? '<i class="fas fa-star"></i>' : r === 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>').join('')}
        </div>
        <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Tambah ke Keranjang</button>
      </div>
    `;
    // Inisialisasi ulang event listener untuk tombol add-to-cart yang baru ditambahkan
    initializeCart();
  } else {
    productContent.innerHTML = `
      <h2 style="font-size: 28px; text-align: center; color: #666;">Produk Tidak Ditemukan</h2>
      <p style="text-align: center; margin-bottom: 20px;">Produk yang Anda cari tidak tersedia.</p>
    `;
  }
}

/**
 * Inisialisasi interaksi keranjang di berbagai halaman
 */
function initializeCart() {
  // Tombol tambah ke keranjang
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const product = {
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image
      };
      addToCart(product);
      alert(`${product.name} ditambahkan ke keranjang!`);
    });
  });

  // Interaksi halaman keranjang
  if (window.location.pathname.includes('cart.html')) {
    const cartItemsList = document.getElementById('cart-items-list');
    const updateCartButton = document.getElementById('update-cart');

    // Hapus item
    cartItemsList.addEventListener('click', (e) => {
      if (e.target.closest('.remove-item')) {
        const index = e.target.closest('.remove-item').dataset.index;
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        updateCartCount();
      }
    });

    // Perbarui jumlah
    cartItemsList.addEventListener('click', (e) => {
      const button = e.target.closest('.quantity-btn');
      if (button) {
        const index = button.dataset.index;
        const action = button.dataset.action;
        const cart = getCart();
        if (action === 'increase') {
          cart[index].quantity += 1;
        } else if (action === 'decrease' && cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        }
        saveCart(cart);
        renderCart();
        updateCartCount();
      }
    });

    // Tombol perbarui keranjang
    updateCartButton.addEventListener('click', () => {
      renderCart();
      alert('Keranjang diperbarui!');
    });
  }
}

/**
 * Inisialisasi halaman checkout di pembayaran.html
 */
function initializeCheckout() {
  const checkoutForm = document.getElementById('checkout-form');
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  const creditCardDetails = document.getElementById('credit-card-details');

  if (!checkoutForm) return;

  // Tampilkan/sembunyikan detail kartu kredit berdasarkan metode pembayaran
  paymentMethods.forEach(method => {
    method.addEventListener('change', () => {
      creditCardDetails.style.display = method.value === 'credit-card' ? 'block' : 'none';
    });
  });

  // Tangani pengiriman formulir checkout
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(checkoutForm);
    const paymentMethod = formData.get('payment-method');

    // Validasi detail kartu kredit jika dipilih
    if (paymentMethod === 'credit-card') {
      const cardNumber = formData.get('card-number');
      const expiryDate = formData.get('expiry-date');
      const cvv = formData.get('cvv');
      if (!cardNumber || !expiryDate || !cvv) {
        alert('Harap lengkapi detail kartu kredit.');
        return;
      }
    }

    // Simpan detail pesanan
    const order = {
      id: `ORDER-${Date.now()}`,
      items: getCart(),
      shippingDetails: {
        fullName: formData.get('full-name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address')
      },
      paymentMethod: paymentMethod,
      timestamp: new Date().toISOString(),
      total: getCart().reduce((sum, item) => sum + item.price * item.quantity, 0) + (getCart().length > 0 ? 5.99 : 0) + (getCart().reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.07)
    };

    // Simpan pesanan ke localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Kosongkan keranjang
    saveCart([]);
    updateCartCount();

    // Tampilkan pesan sukses dan arahkan ke history.html
    alert(`Pesanan ${order.id} berhasil! Terima kasih atas pembelian Anda.`);
    window.location.href = 'history.html';
  });
}

/**
 * Inisialisasi aplikasi saat DOM siap
 */
document.addEventListener('DOMContentLoaded', () => {
  loadPartial('navbar', 'views/navbar.html');
  loadPartial('footer', 'views/footer.html');
  initializeCart();
  if (window.location.pathname.includes('pembayaran.html')) {
    initializeCheckout();
  }
});