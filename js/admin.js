// ======================
// LOCALSTORAGE DATABASE
// ======================
const DB = {
  init() {
    if (!localStorage.getItem("products")) {
      const defaultProducts = [
        {
          id: 1,
          name: "Premium Dog Food",
          price: 24.99,
          category: "Dog Food",
          stock: 156,
          status: "In Stock",
          image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4",
          description:
            "High-quality nutrition for your dog with real chicken as the first ingredient.",
        },
      ];
      this.save("products", defaultProducts);
    }

    if (!localStorage.getItem("articles")) {
      const defaultArticles = [
        {
          id: 1,
          title: "10 Essential Dog Training Tips",
          author: "John Doe",
          date: "2023-06-15",
          views: 1245,
          status: "Published",
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
          content:
            "Training your dog is essential for a happy and harmonious relationship...",
        },
      ];
      this.save("articles", defaultArticles);
    }

    if (!localStorage.getItem("users")) {
      const defaultUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@pawparadise.com",
          role: "Administrator",
          joined: "2023-01-01",
          status: "Active",
        },
      ];
      this.save("users", defaultUsers);
    }

    if (!localStorage.getItem("transactions")) {
      const defaultTransactions = [
        {
          id: "PP-1001",
          customer: "John Smith",
          date: "2023-06-15",
          amount: 86.21,
          payment: "Credit Card",
          status: "Completed",
          items: [{ productId: 1, quantity: 2, price: 24.99 }],
        },
        {
          id: "PP-1002",
          customer: "Jane Doe",
          date: "2025-05-19",
          amount: 49.98,
          payment: "PayPal",
          status: "Processing",
          items: [{ productId: 1, quantity: 2, price: 24.99 }],
        },
        {
          id: "PP-1003",
          customer: "Ahmad Yani",
          date: "2025-05-19T18:40:00+07:00",
          amount: 75.5,
          payment: "Bank Transfer",
          status: "Processing",
          items: [{ productId: 1, quantity: 3, price: 24.99 }],
        },
      ];
      this.save("transactions", defaultTransactions);
    }
  },

  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  load(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  getNextId(key) {
    const items = this.load(key);
    return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  },
};

// Initialize database
DB.init();

// ======================
// UTILITIES
// ======================
const Utils = {
  showAlert(message, type = "success") {
    const existingAlert = document.querySelector(".alert");
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" aria-label="Close alert">×</button>
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 300);
    }, 3000);

    alert.querySelector(".btn-close").addEventListener("click", () => {
      alert.remove();
    });
  },

  redirect(url) {
    window.location.href = url;
  },

  formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  },

  getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },
};

// ======================
// PRODUCTS CRUD
// ======================
const Products = {
  renderList() {
    const products = DB.load("products");
    const table = document.getElementById("products-table");
    if (!table) return;

    if (products.length === 0) {
      table.querySelector("tbody").innerHTML =
        '<tr><td colspan="6" class="text-center">No products found</td></tr>';
      return;
    }

    table.querySelector("tbody").innerHTML = products
      .map(
        (product) => `
      <tr data-id="${product.id}">
        <td><img src="${
          product.image
        }" width="50" height="50" class="rounded" alt="${product.name}"></td>
        <td>${product.name}</td>
        <td>Rp${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td><span class="badge ${
          product.status === "In Stock" ? "bg-success" : "bg-danger"
        }">${product.status}</span></td>
        <td>
          <button type="button" class="btn btn-sm btn-primary btn-edit" data-id="${
            product.id
          }" aria-label="Edit product">Edit</button>
          <button type="button" class="btn btn-sm btn-danger btn-delete" data-id="${
            product.id
          }" aria-label="Delete product">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  },

  handleForm() {
    const form = document.getElementById("product-form");
    if (!form) return;

    const editId = Utils.getUrlParam("edit");

    if (editId) {
      const product = DB.load("products").find((p) => p.id == editId);
      if (product) {
        Object.keys(product).forEach((key) => {
          if (form.elements[key]) {
            form.elements[key].value = product[key];
          }
        });

        const imagePreview = document.getElementById("image-preview");
        if (imagePreview && product.image) {
          imagePreview.src = product.image;
          imagePreview.style.display = "block";
        }
      }
    }

    const imageInput = document.getElementById("image-upload");
    if (imageInput) {
      imageInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const imagePreview = document.getElementById("image-preview");
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const productData = Object.fromEntries(formData.entries());
      const products = DB.load("products");

      productData.price = parseFloat(productData.price);
      productData.stock = parseInt(productData.stock);

      const imageFile = formData.get("image-file");
      if (imageFile && imageFile.name) {
        productData.image = "https://via.placeholder.com/300";
      } else if (!productData.image && editId) {
        const existingProduct = products.find((p) => p.id == editId);
        if (existingProduct) productData.image = existingProduct.image;
      }

      if (editId) {
        const index = products.findIndex((p) => p.id == editId);
        if (index === -1) {
          Utils.showAlert("Produk tidak ditemukan!", "danger");
          return;
        }
        products[index] = {
          ...products[index],
          ...productData,
          id: parseInt(editId),
        };
        Utils.showAlert("Produk berhasil diperbarui!");
      } else {
        productData.id = DB.getNextId("products");
        products.push(productData);
        Utils.showAlert("Produk berhasil ditambahkan!");
      }

      DB.save("products", products);
      setTimeout(() => Utils.redirect("manage-products.html"), 1500);
    });
  },

  deleteProduct(id) {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const products = DB.load("products").filter((p) => p.id != id);
      DB.save("products", products);
      this.renderList();
      Utils.showAlert("Produk berhasil dihapus!", "danger");
    }
  },
};

// ======================
// ARTICLES CRUD
// ======================
const Articles = {
  renderList() {
    const articles = DB.load("articles");
    const table = document.getElementById("articles-table");
    if (!table) return;

    if (articles.length === 0) {
      table.querySelector("tbody").innerHTML =
        '<tr><td colspan="6" class="text-center">No articles found</td></tr>';
      return;
    }

    table.querySelector("tbody").innerHTML = articles
      .map(
        (article) => `
      <tr data-id="${article.id}">
        <td>${article.title}</td>
        <td>${article.author}</td>
        <td>${Utils.formatDate(article.date)}</td>
        <td>${article.views}</td>
        <td><span class="badge ${
          article.status === "Published" ? "bg-success" : "bg-warning"
        }">${article.status}</span></td>
        <td>
          <button type="button" class="btn btn-sm btn-primary btn-edit" data-id="${
            article.id
          }" aria-label="Edit article">Edit</button>
          <button type="button" class="btn btn-sm btn-danger btn-delete" data-id="${
            article.id
          }" aria-label="Delete article">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  },

  handleForm() {
    const form = document.getElementById("article-form");
    if (!form) return;

    const editId = Utils.getUrlParam("edit");

    if (editId) {
      const article = DB.load("articles").find((a) => a.id == editId);
      if (article) {
        Object.keys(article).forEach((key) => {
          if (form.elements[key]) {
            form.elements[key].value = article[key];
          }
        });

        const imagePreview = document.getElementById("image-preview");
        if (imagePreview && article.image) {
          imagePreview.src = article.image;
          imagePreview.style.display = "block";
        }
      }
    } else {
      const dateInput = form.elements["date"];
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    }

    const imageInput = document.getElementById("image-upload");
    if (imageInput) {
      imageInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const imagePreview = document.getElementById("image-preview");
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const articleData = Object.fromEntries(formData.entries());
      const articles = DB.load("articles");

      const imageFile = formData.get("image-file");
      if (imageFile && imageFile.name) {
        articleData.image = "https://via.placeholder.com/300";
      } else if (!articleData.image && editId) {
        const existingArticle = articles.find((a) => a.id == editId);
        if (existingArticle) articleData.image = existingArticle.image;
      }

      if (editId) {
        const index = articles.findIndex((a) => a.id == editId);
        if (index === -1) {
          Utils.showAlert("Artikel tidak ditemukan!", "danger");
          return;
        }
        articles[index] = {
          ...articles[index],
          ...articleData,
          id: parseInt(editId),
        };
        Utils.showAlert("Artikel berhasil diperbarui!");
      } else {
        articleData.id = DB.getNextId("articles");
        articleData.views = 0;
        articles.push(articleData);
        Utils.showAlert("Artikel berhasil ditambahkan!");
      }

      DB.save("articles", articles);
      setTimeout(() => Utils.redirect("manage-articles.html"), 1500);
    });
  },

  deleteArticle(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const articles = DB.load("articles").filter((a) => a.id != id);
      DB.save("articles", articles);
      this.renderList();
      Utils.showAlert("Artikel berhasil dihapus!", "danger");
    }
  },
};

// ======================
// USERS CRUD
// ======================
const Users = {
  renderList() {
    const users = DB.load("users");
    const table = document.getElementById("users-table");
    if (!table) return;

    if (users.length === 0) {
      table.querySelector("tbody").innerHTML =
        '<tr><td colspan="6" class="text-center">No users found</td></tr>';
      return;
    }

    table.querySelector("tbody").innerHTML = users
      .map(
        (user) => `
      <tr data-id="${user.id}">
        <td>
          <div class="d-flex align-items-center">
            <img src="https://i.pravatar.cc/40?u=${
              user.id
            }" class="rounded-circle me-2" alt="${user.name}">
            ${user.name}
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${Utils.formatDate(user.joined)}</td>
        <td><span class="badge ${
          user.status === "Active" ? "bg-success" : "bg-danger"
        }">${user.status}</span></td>
        <td>
          <button type="button" class="btn btn-sm btn-primary btn-edit" data-id="${
            user.id
          }" aria-label="Edit user">Edit</button>
          <button type="button" class="btn btn-sm btn-danger btn-delete" data-id="${
            user.id
          }" aria-label="Delete user">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  },

  handleForm() {
    const form = document.getElementById("user-form");
    if (!form) return;

    const editId = Utils.getUrlParam("edit");

    if (editId) {
      const user = DB.load("users").find((u) => u.id == editId);
      if (user) {
        Object.keys(user).forEach((key) => {
          if (form.elements[key]) {
            form.elements[key].value = user[key];
          }
        });
      } else {
        Utils.showAlert("Pengguna tidak ditemukan!", "danger");
        setTimeout(() => Utils.redirect("manage-users.html"), 1500);
        return;
      }
    } else {
      const dateInput = form.elements["joined"];
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());
      const users = DB.load("users");

      if (editId) {
        const index = users.findIndex((u) => u.id == editId);
        if (index === -1) {
          Utils.showAlert("Pengguna tidak ditemukan!", "danger");
          return;
        }
        users[index] = {
          ...users[index],
          ...userData,
          id: parseInt(editId),
        };
        Utils.showAlert("Pengguna berhasil diperbarui!");
      } else {
        userData.id = DB.getNextId("users");
        users.push(userData);
        Utils.showAlert("Pengguna berhasil ditambahkan!");
      }

      DB.save("users", users);
      setTimeout(() => Utils.redirect("manage-users.html"), 1500);
    });
  },

  deleteUser(id) {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const users = DB.load("users").filter((u) => u.id != id);
      DB.save("users", users);
      this.renderList();
      Utils.showAlert("Pengguna berhasil dihapus!", "danger");
    }
  },
};

// ======================
// TRANSACTIONS CRUD
// ======================
const Transactions = {
  renderList() {
    const transactions = DB.load("transactions");
    console.log("Transactions:", transactions); // Debugging log
    const table = document.getElementById("transactions-table");
    if (!table) {
      console.error("Table with ID 'transactions-table' not found");
      return;
    }

    if (transactions.length === 0) {
      table.innerHTML =
        '<tr><td colspan="7" class="text-center">No transactions found</td></tr>';
      return;
    }

    table.innerHTML = transactions
      .map(
        (transaction) => `
      <tr data-id="${transaction.id}">
        <td data-label="Order ID">${transaction.id}</td>
        <td data-label="Customer">${transaction.customer}</td>
        <td data-label="Date">${Utils.formatDate(transaction.date)}</td>
        <td data-label="Amount">Rp${transaction.amount.toFixed(2)}</td>
        <td data-label="Payment">${transaction.payment}</td>
        <td data-label="Status"><span class="badge ${
          transaction.status === "Completed"
            ? "bg-success"
            : transaction.status === "Processing"
            ? "bg-warning"
            : transaction.status === "Shipped"
            ? "bg-info"
            : "bg-danger"
        }">${transaction.status}</span></td>
        <td data-label="Actions">
          <button type="button" class="btn btn-sm btn-primary btn-view" data-id="${
            transaction.id
          }" aria-label="View transaction">View</button>
        </td>
      </tr>
    `
      )
      .join("");
  },

  showDetails(id) {
    const transaction = DB.load("transactions").find((t) => t.id === id);
    if (!transaction) {
      Utils.showAlert("Transaksi tidak ditemukan!", "danger");
      return;
    }

    alert(
      `Detail Transaksi\n\nID: ${transaction.id}\nPelanggan: ${
        transaction.customer
      }\nTanggal: ${Utils.formatDate(
        transaction.date
      )}\nJumlah: Rp${transaction.amount.toFixed(2)}\nMetode Pembayaran: ${
        transaction.payment
      }\nStatus: ${transaction.status}\nItems: ${transaction.items
        .map((item) => `Product ID ${item.productId} (Qty: ${item.quantity})`)
        .join(", ")}`
    );
  },
};

// ======================
// DASHBOARD
// ======================
const Dashboard = {
  init() {
    this.renderStats();
  },

  renderStats() {
    const products = DB.load("products");
    const articles = DB.load("articles");
    const users = DB.load("users");
    const transactions = DB.load("transactions");

    const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = transactions.filter(
      (t) => t.status === "Completed"
    ).length;

    const totalProductsEl = document.getElementById("total-products");
    const totalArticlesEl = document.getElementById("total-articles");
    const totalUsersEl = document.getElementById("total-users");
    const totalSalesEl = document.getElementById("total-sales");
    const completedOrdersEl = document.getElementById("completed-orders");

    if (totalProductsEl) totalProductsEl.textContent = products.length;
    if (totalArticlesEl) totalArticlesEl.textContent = articles.length;
    if (totalUsersEl) totalUsersEl.textContent = users.length;
    if (totalSalesEl) totalSalesEl.textContent = `Rp${totalSales.toFixed(2)}`;
    if (completedOrdersEl)
      completedOrdersEl.textContent = completedTransactions;

    const tableBody = document.querySelector("#recent-transactions tbody");
    if (tableBody) {
      const recentTransactions = transactions.slice(0, 5);
      tableBody.innerHTML = recentTransactions
        .map(
          (transaction) => `
        <tr>
          <td data-label="Order ID">${transaction.id}</td>
          <td data-label="Customer">${transaction.customer}</td>
          <td data-label="Date">${Utils.formatDate(transaction.date)}</td>
          <td data-label="Amount">Rp${transaction.amount.toFixed(2)}</td>
          <td data-label="Status"><span class="badge ${
            transaction.status === "Completed" ? "bg-success" : "bg-warning"
          }">${transaction.status}</span></td>
        </tr>
      `
        )
        .join("");
    }
  },
};

// ======================
// LOGIN
// ======================
const Login = {
  init() {
    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.elements["email"].value;
      const password = form.elements["password"].value;

      if (email === "admin@pawparadise.com" && password === "admin123") {
        localStorage.setItem("isAuthenticated", "true");
        Utils.redirect("dashboard.html");
      } else {
        Utils.showAlert("Kredensial salah!", "danger");
      }
    });
  },
};

// ======================
// AUTHENTICATION CHECK
// ======================
const Auth = {
  check() {
    if (window.location.pathname.includes("login.html")) return true;

    if (localStorage.getItem("isAuthenticated")) {
      return true;
    } else {
      Utils.redirect("login.html");
      return false;
    }
  },

  logout() {
    localStorage.removeItem("isAuthenticated");
    Utils.redirect("../index.html"); // Redirect to PAWPARADISE/index.html
  },
};

// ======================
// INITIALIZE APP
// ======================
document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.check()) return;

  const path = window.location.pathname;

  // Initialize page-specific logic
  if (path.includes("dashboard.html")) {
    console.log("Initializing Dashboard...");
    Dashboard.init();
  } else if (path.includes("manage-products.html")) {
    console.log("Rendering Products list...");
    Products.renderList();
  } else if (path.includes("add-product.html")) {
    console.log("Handling Product form...");
    Products.handleForm();
  } else if (path.includes("manage-articles.html")) {
    console.log("Rendering Articles list...");
    Articles.renderList();
  } else if (path.includes("add-article.html")) {
    console.log("Handling Article form...");
    Articles.handleForm();
  } else if (path.includes("manage-users.html")) {
    console.log("Rendering Users list...");
    Users.renderList();
  } else if (path.includes("add-user.html")) {
    console.log("Handling User form...");
    Users.handleForm();
  } else if (path.includes("manage-transactions.html")) {
    console.log("Rendering Transactions list...");
    Transactions.renderList();
  } else if (path.includes("login.html")) {
    console.log("Initializing Login...");
    Login.init();
  }

  // Hamburger Menu Setup
  let hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".admin-nav-links");
  const sidebar = document.querySelector(".admin-sidebar");

  // Jika elemen hamburger tidak ada dan bukan halaman login, tambahkan secara dinamis
  if (!hamburger && !path.includes("login.html")) {
    hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    hamburger.setAttribute("aria-label", "Toggle menu");
    hamburger.innerHTML = '<i class="fas fa-bars"></i>'; // Menggunakan Font Awesome
    const navbar = document.querySelector(".admin-navbar");
    if (navbar) {
      navbar.appendChild(hamburger);
    }
  }

  if (hamburger && navLinks && sidebar) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        sidebar.classList.remove("active");
      }
    });
  }

  // Event listeners for buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      if (path.includes("manage-products.html")) {
        Products.deleteProduct(e.target.dataset.id);
      } else if (path.includes("manage-articles.html")) {
        Articles.deleteArticle(e.target.dataset.id);
      } else if (path.includes("manage-users.html")) {
        Users.deleteUser(e.target.dataset.id);
      }
    }
    if (e.target.classList.contains("btn-edit")) {
      if (path.includes("manage-products.html")) {
        Utils.redirect(`add-product.html?edit=${e.target.dataset.id}`);
      } else if (path.includes("manage-articles.html")) {
        Utils.redirect(`add-article.html?edit=${e.target.dataset.id}`);
      } else if (path.includes("manage-users.html")) {
        Utils.redirect(`add-user.html?edit=${e.target.dataset.id}`);
      }
    }
    if (e.target.classList.contains("btn-view")) {
      Transactions.showDetails(e.target.dataset.id);
    }
    if (e.target.id === "btn-logout") {
      Auth.logout();
    }
  });
});
