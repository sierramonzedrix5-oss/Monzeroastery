// script.js - Monze Roastery with Custom Error Modal Messagebox

const initialProducts = [
  { id: 1, title: "Signature Espresso", category: "hot", price: 120.00, stock: 15, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80", description: "Rich, full-bodied single-shot espresso.", featured: true },
  { id: 2, title: "Monze Creamy Latte", category: "hot", price: 150.00, stock: 8, image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80", description: "Silky steamed milk poured over fresh espresso.", featured: true },
  { id: 3, title: "Iced Spanish Latte", category: "cold", price: 165.00, stock: 0, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", description: "Espresso combined with chilled whole milk.", featured: true },
  { id: 4, title: "Ethiopia Yirgacheffe Beans", category: "beans", price: 450.00, stock: 12, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80", description: "Light-medium roast featuring floral aromas.", featured: false },
  { id: 5, title: "Fresh Butter Croissant", category: "pastry", price: 95.00, stock: 5, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80", description: "Flaky French pastry baked fresh daily.", featured: false }
];

let products = JSON.parse(localStorage.getItem('monze_products')) || initialProducts;
let orders = JSON.parse(localStorage.getItem('monze_orders')) || [];
let inbox = JSON.parse(localStorage.getItem('monze_inbox')) || [
  { id: 1, name: "Maria Santos", email: "maria@gmail.com", message: "Do you offer bulk delivery for events?", date: "2026-11-02" }
];
let currentUser = JSON.parse(localStorage.getItem('monze_current_user')) || null;

function setErrorState(inputElement, message, isError) {
  if (!inputElement) return;
  const parent = inputElement.closest('.form-group') || inputElement.parentElement;
  
  let existingMsg = parent.querySelector('.inline-error-msg');
  if (existingMsg) existingMsg.remove();

  if (isError) {
    inputElement.classList.add('input-error');
    if (message) {
      const errSpan = document.createElement('span');
      errSpan.className = 'inline-error-msg';
      errSpan.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.3rem; display: block; font-weight: 600;';
      errSpan.textContent = message;
      parent.appendChild(errSpan);
    }
  } else {
    inputElement.classList.remove('input-error');
  }
}

function highlightError(inputElement, errorMessage) {
  if (inputElement) {
    setErrorState(inputElement, errorMessage, true);
    inputElement.focus();
    const clearHandler = () => {
      setErrorState(inputElement, '', false);
      inputElement.removeEventListener('input', clearHandler);
    };
    inputElement.addEventListener('input', clearHandler);
  }
  
  // Trigger Custom Error Modal Messagebox
  const errorModal = document.getElementById('customErrorModal');
  const errorMsgP = document.getElementById('customErrorMsg');
  if (errorModal && errorMsgP) {
    errorMsgP.textContent = `Error! ${errorMessage}`;
    errorModal.classList.add('active');
  }
}

function autoCapitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function validateLettersOnly(inputElement, fieldName) {
  let val = inputElement.value ? inputElement.value.trim() : '';
  if (val === '') {
    highlightError(inputElement, `${fieldName} cannot be empty.`);
    return false;
  }
  const regex = /^[A-Za-z\sñÑ.]+$/;
  if (!regex.test(val)) {
    highlightError(inputElement, `${fieldName} must contain letters only.`);
    return false;
  }
  val = autoCapitalizeWords(val);
  inputElement.value = val;
  setErrorState(inputElement, '', false);
  return true;
}

function validateEmail(inputElement) {
  const email = inputElement.value ? inputElement.value.trim() : '';
  if (email === '') {
    highlightError(inputElement, 'Email Address cannot be empty.');
    return false;
  }
  if (!email.includes('@') || email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) {
    highlightError(inputElement, 'Please enter a valid email address containing "@".');
    return false;
  }
  setErrorState(inputElement, '', false);
  return true;
}

function validatePassword(inputElement) {
  const pass = inputElement.value ? inputElement.value.trim() : '';
  if (pass.length < 8) {
    highlightError(inputElement, 'Password must be at least 8 characters long.');
    return false;
  }
  setErrorState(inputElement, '', false);
  return true;
}

function validatePhoneNumber(inputElement) {
  let phone = inputElement.value ? inputElement.value.trim() : '';
  phone = phone.replace(/\D/g, '');
  inputElement.value = phone;

  if (phone === '') {
    highlightError(inputElement, 'Phone Number cannot be empty.');
    return false;
  }
  if (phone.length !== 11) {
    highlightError(inputElement, 'Phone Number must be exactly 11 digits.');
    return false;
  }
  setErrorState(inputElement, '', false);
  return true;
}

function validateNumbersOnly(inputElement, fieldName) {
  let val = inputElement.value ? inputElement.value.trim() : '';
  if (val === '') {
    highlightError(inputElement, `${fieldName} cannot be empty.`);
    return false;
  }
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
  if (!regex.test(val)) {
    highlightError(inputElement, `${fieldName} must contain numbers only.`);
    return false;
  }
  setErrorState(inputElement, '', false);
  return true;
}

function setupAutoErrorPrevention() {
  document.querySelectorAll('#regName, #contactName, #admTitle, #editUserName').forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      let val = input.value;
      let cleaned = val.replace(/[^A-Za-z\sñÑ.]/g, '');
      if (cleaned !== val) {
        input.value = cleaned;
      }
      if (cleaned.trim().length > 0) {
        setErrorState(input, '', false);
      }
    });
  });

  document.querySelectorAll('#regPhone, #editUserPhone').forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '').slice(0, 11);
      input.value = val;
      if (val.length === 11) {
        setErrorState(input, '', false);
      }
    });
  });

  document.querySelectorAll('#admPrice, #admStock, #orderQty').forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      let val = input.value.replace(/[^0-9.]/g, '');
      input.value = val;
      if (val.trim() !== '') {
        setErrorState(input, '', false);
      }
    });
  });
}

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0, 0);
}

function renderHomeFeatured() {
  const grid = document.getElementById('featuredGrid');
  const featured = products.filter(p => p.featured);
  grid.innerHTML = (featured.length ? featured : products.slice(0, 3)).map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.title}">
        <span class="product-category">${p.category}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">₱${Number(p.price).toFixed(2)}</span>
          <button class="btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.85rem;" onclick="openLoginPrompt()">Order</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFullMenu(filter = 'all') {
  const grid = document.getElementById('fullMenuGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.title}"><span class="product-category">${p.category}</span></div>
      <div class="product-info">
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">₱${Number(p.price).toFixed(2)}</span>
          <button class="btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.85rem;" onclick="openLoginPrompt()">Order</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderUserDashboardMenu() {
  const grid = document.getElementById('userMenuGrid');
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.title}"><span class="product-category">${p.category}</span></div>
      <div class="product-info">
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <p style="font-size:0.85rem; margin-bottom:0.5rem; font-weight:600; color:${p.stock > 0 ? 'green':'red'};">Stock: ${p.stock > 0 ? p.stock + ' available' : 'Out of Stock'}</p>
        <div class="product-bottom">
          <span class="product-price">₱${Number(p.price).toFixed(2)}</span>
          <button class="btn btn-primary" style="padding:0.4rem 0.9rem; font-size:0.85rem;" onclick="handleUserOrderClick(${p.id})">Order Product</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderAdminData() {
  document.getElementById('adminProductList').innerHTML = products.map(p => `
    <div class="admin-product-item">
      <span><strong>${p.title}</strong> - ₱${p.price} (Stock: ${p.stock})</span>
      <div>
        <button class="btn btn-outline" style="padding:0.2rem 0.5rem; font-size:0.8rem;" onclick="editProduct(${p.id})">Edit</button>
        <button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.8rem; border-color:red; color:red;" onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    </div>
  `).join('');

  document.getElementById('adminOrdersList').innerHTML = orders.length ? orders.map(o => `
    <div class="order-item-card">
      <div>
        <strong>Order #${o.id}</strong> - User: ${o.userEmail}<br>
        Item: ${o.productId} | Qty: ${o.qty} | Address: ${o.address} | Status: <span style="color:var(--primary); font-weight:bold;">${o.status}</span>
      </div>
      <div>
        ${o.status !== 'Prepared' ? `<button class="btn btn-outline" style="font-size:0.8rem;" onclick="updateOrderStatus(${o.id}, 'Prepared')">Mark Prepared</button>` : ''}
        ${o.status !== 'On Delivery' ? `<button class="btn btn-primary" style="font-size:0.8rem;" onclick="updateOrderStatus(${o.id}, 'On Delivery')">On Delivery</button>` : ''}
      </div>
    </div>
  `).join('') : '<p>No orders received yet.</p>';

  document.getElementById('adminInboxList').innerHTML = inbox.map(i => `
    <div class="inbox-item">
      <div><strong>${i.name}</strong> (${i.email}):<br>${i.message}</div>
      <small>${i.date}</small>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHomeFeatured();
  setupAutoErrorPrevention();

  // Custom Error Modal close action
  const closeErrBtn = document.getElementById('closeCustomErrorBtn');
  const errModal = document.getElementById('customErrorModal');
  if (closeErrBtn && errModal) {
    closeErrBtn.addEventListener('click', () => {
      errModal.classList.remove('active');
    });
  }

  document.getElementById('loginNavBtn').addEventListener('click', () => switchView('loginView'));
  document.getElementById('exploreMenuBtn').addEventListener('click', () => { switchView('menuView'); renderFullMenu('all'); });
  document.getElementById('ourStoryBtn').addEventListener('click', () => switchView('storyView'));
  document.querySelectorAll('.back-home-btn').forEach(btn => btn.addEventListener('click', () => switchView('homeView')));
  document.getElementById('homeBrandLink').addEventListener('click', (e) => { e.preventDefault(); switchView('homeView'); });

  document.getElementById('togglePasswordBtn').addEventListener('click', () => {
    const passInput = document.getElementById('loginPassword');
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('toggleRegPass').addEventListener('click', () => {
    const p = document.getElementById('regPass');
    p.type = p.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('toggleRegPassConfirm').addEventListener('click', () => {
    const p = document.getElementById('regPassConfirm');
    p.type = p.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('goToRegisterBtn').addEventListener('click', () => switchView('registerView'));
  document.querySelectorAll('.back-to-login-btn').forEach(btn => btn.addEventListener('click', () => switchView('loginView')));

  document.getElementById('menuFilters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderFullMenu(e.target.getAttribute('data-filter'));
    }
  });

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailElem = document.getElementById('loginEmail');
    const passElem = document.getElementById('loginPassword');

    if (!validateEmail(emailElem)) return;
    if (!passElem.value.trim()) {
      highlightError(passElem, "Password field cannot be empty.");
      return;
    }

    const email = emailElem.value.trim();
    const pass = passElem.value.trim();

    if (email === 'admin@monze.com' && pass === 'admin123') {
      currentUser = { role: 'admin', email: email, name: 'Administrator' };
      switchView('adminDashboardView');
      renderAdminData();
    } else {
      let registeredUsers = JSON.parse(localStorage.getItem('monze_users')) || [];
      let found = registeredUsers.find(u => u.email === email && u.pass === pass);
      if (found || (email === 'user@monze.com' && pass === 'password')) {
        currentUser = found || { name: 'Valued Customer', email: email, phone: '09123456789', city: 'Irosin', pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' };
        localStorage.setItem('monze_current_user', JSON.stringify(currentUser));
        loadUserDashboard();
        switchView('userDashboardView');
      } else {
        highlightError(passElem, 'Incorrect email or password.');
      }
    }
  });

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameElem = document.getElementById('regName');
    const emailElem = document.getElementById('regEmail');
    const passElem = document.getElementById('regPass');
    const passConfElem = document.getElementById('regPassConfirm');
    const phoneElem = document.getElementById('regPhone');
    const barangayElem = document.getElementById('regBarangay');
    const termsElem = document.getElementById('regTerms');

    if (!validateLettersOnly(nameElem, "Full Name")) return;
    if (!validateEmail(emailElem)) return;
    if (!validatePassword(passElem)) return;
    if (passElem.value !== passConfElem.value) { 
      highlightError(passConfElem, 'Passwords do not match.'); 
      return; 
    }
    if (!validatePhoneNumber(phoneElem)) return;
    if (!barangayElem.value) { 
      highlightError(barangayElem, 'Please select a Barangay in Irosin.'); 
      return; 
    }
    if (termsElem.value !== 'yes') { 
      highlightError(termsElem, 'You must agree to the Terms & Conditions.'); 
      return; 
    }

    let users = JSON.parse(localStorage.getItem('monze_users')) || [];
    const newUser = { 
      name: nameElem.value.trim(), 
      email: emailElem.value.trim(), 
      pass: passElem.value.trim(), 
      phone: phoneElem.value.trim(), 
      city: "Irosin", 
      barangay: barangayElem.value, 
      pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' 
    };
    users.push(newUser);
    localStorage.setItem('monze_users', JSON.stringify(users));
    alert('Registration successful! Please login with your account.');
    switchView('loginView');
  });

  document.getElementById('userLogoutBtn').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('monze_current_user');
    alert("You have logged out successfully.");
    switchView('homeView');
  });

  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('monze_current_user');
    alert("Admin logged out successfully.");
    switchView('homeView');
  });

  const addModal = document.getElementById('addProductModal');
  document.getElementById('openAddProductModalBtn').addEventListener('click', () => addModal.classList.add('active'));
  document.getElementById('closeAddProductModal').addEventListener('click', () => addModal.classList.remove('active'));
  document.getElementById('cancelAddProductModal').addEventListener('click', () => addModal.classList.remove('active'));

  document.getElementById('adminAddProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const titleElem = document.getElementById('admTitle');
    const priceElem = document.getElementById('admPrice');
    const stockElem = document.getElementById('admStock');
    const descElem = document.getElementById('admDesc');
    const category = document.getElementById('admCategory').value;
    const fileInput = document.getElementById('admImageFile');
    const urlInput = document.getElementById('admImageUrl').value.trim();

    if (!validateLettersOnly(titleElem, "Product Name")) return;
    if (!validateNumbersOnly(priceElem, "Price")) return;
    if (!validateNumbersOnly(stockElem, "Stock Quantity")) return;
    if (!descElem.value.trim()) { 
      highlightError(descElem, "Product Description cannot be empty."); 
      return; 
    }

    const saveProduct = (imgSrc) => {
      const newProd = {
        id: Date.now(),
        title: titleElem.value.trim(), 
        category, 
        price: parseFloat(priceElem.value), 
        stock: parseInt(stockElem.value),
        image: imgSrc || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        description: descElem.value.trim(),
        featured: false
      };
      products.unshift(newProd);
      localStorage.setItem('monze_products', JSON.stringify(products));
      renderAdminData();
      renderUserDashboardMenu();
      addModal.classList.remove('active');
      this.reset();
      alert('New coffee product added successfully!');
    };

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(evt) { saveProduct(evt.target.result); };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      saveProduct(urlInput);
    }
  });

  document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nameElem = document.getElementById('editUserName');
    const phoneElem = document.getElementById('editUserPhone');
    const urlPic = document.getElementById('editProfilePicUrl').value.trim();
    const filePic = document.getElementById('editProfilePicFile');

    if (!validateLettersOnly(nameElem, "Full Name")) return;
    if (!validatePhoneNumber(phoneElem)) return;

    const applyProfileUpdate = (imgSrc) => {
      currentUser.name = nameElem.value.trim();
      currentUser.phone = phoneElem.value.trim();
      currentUser.city = "Irosin";
      if (imgSrc) currentUser.pic = imgSrc;
      localStorage.setItem('monze_current_user', JSON.stringify(currentUser));
      document.getElementById('userProfilePicPreview').src = currentUser.pic;
      alert('Profile updated successfully!');
    };

    if (filePic.files && filePic.files[0]) {
      const reader = new FileReader();
      reader.onload = function(evt) { applyProfileUpdate(evt.target.result); };
      reader.readAsDataURL(filePic.files[0]);
    } else {
      applyProfileUpdate(urlPic);
    }
  });

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameElem = document.getElementById('contactName');
    const emailElem = document.getElementById('contactEmail');
    const msgElem = document.getElementById('contactMsg');

    if (!validateLettersOnly(nameElem, "Full Name")) return;
    if (!validateEmail(emailElem)) return;
    if (!msgElem.value.trim()) { 
      highlightError(msgElem, "Message field cannot be empty."); 
      return; 
    }

    inbox.unshift({ id: Date.now(), name: nameElem.value.trim(), email: emailElem.value.trim(), message: msgElem.value.trim(), date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('monze_inbox', JSON.stringify(inbox));
    alert('Thank you! Your message has been sent to the admin inbox.');
    e.target.reset();
  });
});

function openLoginPrompt() {
  const errorModal = document.getElementById('customErrorModal');
  const errorMsgP = document.getElementById('customErrorMsg');
  if (errorModal && errorMsgP) {
    errorMsgP.textContent = `Error! Please login first to place an order.`;
    errorModal.classList.add('active');
  }
  switchView('loginView');
}

function handleUserOrderClick(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod || prod.stock <= 0) {
    const errorModal = document.getElementById('customErrorModal');
    const errorMsgP = document.getElementById('customErrorMsg');
    if (errorModal && errorMsgP) {
      errorMsgP.textContent = `Error! Sorry! This product is out of stock.`;
      errorModal.classList.add('active');
    }
    return;
  }
  document.getElementById('orderProductId').value = productId;
  document.getElementById('orderModalTitle').textContent = `Order: ${prod.title}`;
  document.getElementById('orderModal').classList.add('active');
}

document.getElementById('closeOrderModal').addEventListener('click', () => document.getElementById('orderModal').classList.remove('active'));
document.getElementById('cancelOrderModal').addEventListener('click', () => document.getElementById('orderModal').classList.remove('active'));

document.getElementById('placeOrderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const prodId = parseInt(document.getElementById('orderProductId').value);
  const qtyElem = document.getElementById('orderQty');
  const addressElem = document.getElementById('orderAddress');
  const payment = document.getElementById('orderPayment').value;

  if (!validateNumbersOnly(qtyElem, "Quantity")) return;
  if (!addressElem.value.trim()) { 
    highlightError(addressElem, "Delivery Address cannot be empty."); 
    return; 
  }

  const qtyVal = parseInt(qtyElem.value);
  if (qtyVal < 1) { 
    highlightError(qtyElem, "Quantity must be at least 1."); 
    return; 
  }

  const prod = products.find(p => p.id === prodId);
  if (prod.stock < qtyVal) {
    const errorModal = document.getElementById('customErrorModal');
    const errorMsgP = document.getElementById('customErrorMsg');
    if (errorModal && errorMsgP) {
      errorMsgP.textContent = `Error! ${prod.stock} items left in stock.`;
      errorModal.classList.add('active');
    }
    return;
  }

  prod.stock -= qtyVal;
  localStorage.setItem('monze_products', JSON.stringify(products));

  orders.unshift({
    id: Date.now().toString().slice(-5),
    productId: prod.title,
    qty: qtyVal, address: addressElem.value.trim(), payment,
    userEmail: currentUser.email,
    status: 'Pending Confirmation'
  });
  localStorage.setItem('monze_orders', JSON.stringify(orders));

  document.getElementById('orderModal').classList.remove('active');
  renderUserDashboardMenu();
  alert('Order placed successfully! Order status sent to admin dashboard.');
});

function loadUserDashboard() {
  if (!currentUser) return;
  document.getElementById('editUserName').value = currentUser.name || '';
  document.getElementById('editUserEmail').value = currentUser.email || '';
  document.getElementById('editUserPhone').value = currentUser.phone || '';
  document.getElementById('editUserCity').value = "Irosin";
  document.getElementById('editProfilePicUrl').value = currentUser.pic || '';
  document.getElementById('userProfilePicPreview').src = currentUser.pic || '';
  renderUserDashboardMenu();
}

function updateOrderStatus(orderId, status) {
  const order = orders.find(o => o.id == orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('monze_orders', JSON.stringify(orders));
    renderAdminData();
  }
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('monze_products', JSON.stringify(products));
    renderAdminData();
    renderUserDashboardMenu();
  }
}

function editProduct(id) {
  const p = products.find(prod => prod.id === id);
  const newPrice = prompt("Enter new price (numbers only):", p.price);
  if (newPrice === null) return;
  if (isNaN(newPrice) || parseFloat(newPrice) <= 0) {
    const errorModal = document.getElementById('customErrorModal');
    const errorMsgP = document.getElementById('customErrorMsg');
    if (errorModal && errorMsgP) {
      errorMsgP.textContent = `Error! Invalid input: Price must be a positive number.`;
      errorModal.classList.add('active');
    }
    return;
  }
  const newStock = prompt("Enter new stock quantity (numbers only):", p.stock);
  if (newStock === null) return;
  if (isNaN(newStock) || parseInt(newStock) < 0) {
    const errorModal = document.getElementById('customErrorModal');
    const errorMsgP = document.getElementById('customErrorMsg');
    if (errorModal && errorMsgP) {
      errorMsgP.textContent = `Error! Invalid input: Stock must be a valid non-negative number.`;
      errorModal.classList.add('active');
    }
    return;
  }
  p.price = parseFloat(newPrice);
  p.stock = parseInt(newStock);
  localStorage.setItem('monze_products', JSON.stringify(products));
  renderAdminData();
  renderUserDashboardMenu();
  alert("Product updated successfully!");
}