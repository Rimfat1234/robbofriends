// QuickDelivery Platform JavaScript
class QuickDelivery {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.products = [];
        this.orders = [];
        this.users = [];
        this.cart = [];
        this.isAdmin = false;
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.loadMockData();
        this.checkAuthStatus();
        this.updateStats();
        this.updateCartCount();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Authentication forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Checkout form
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCheckout();
        });

        // Add product form (Admin)
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddProduct();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    loadMockData() {
        // Mock users
        this.users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+234-123-456-7890',
                role: 'customer'
            },
            {
                id: 2,
                name: 'Admin User',
                email: 'admin@quickdelivery.com',
                phone: '+234-987-654-3210',
                role: 'admin'
            }
        ];

        // Mock products
        this.products = [
            {
                id: 1,
                name: 'Margherita Pizza',
                category: 'food',
                description: 'Fresh tomatoes, mozzarella cheese, basil leaves',
                price: 2500,
                stock: 20,
                image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'
            },
            {
                id: 2,
                name: 'Chicken Burger',
                category: 'food',
                description: 'Grilled chicken breast with lettuce and tomato',
                price: 1800,
                stock: 15,
                image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
            },
            {
                id: 3,
                name: 'iPhone 15',
                category: 'electronics',
                description: 'Latest iPhone with advanced camera system',
                price: 450000,
                stock: 5,
                image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
            },
            {
                id: 4,
                name: 'Samsung Galaxy Buds',
                category: 'electronics',
                description: 'Wireless earbuds with noise cancellation',
                price: 35000,
                stock: 12,
                image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg'
            },
            {
                id: 5,
                name: 'Fresh Milk (1L)',
                category: 'groceries',
                description: 'Fresh cow milk, pasteurized',
                price: 800,
                stock: 30,
                image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg'
            },
            {
                id: 6,
                name: 'Bread Loaf',
                category: 'groceries',
                description: 'Fresh baked white bread',
                price: 500,
                stock: 25,
                image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg'
            },
            {
                id: 7,
                name: 'Paracetamol',
                category: 'pharmacy',
                description: 'Pain relief medication, 500mg tablets',
                price: 300,
                stock: 50,
                image: 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg'
            },
            {
                id: 8,
                name: 'Vitamin C',
                category: 'pharmacy',
                description: 'Immune system support, 1000mg tablets',
                price: 1200,
                stock: 40,
                image: 'https://images.pexels.com/photos/208518/pexels-photo-208518.jpeg'
            }
        ];

        // Mock orders
        this.orders = [
            {
                id: 'ORD-001',
                userId: 1,
                items: [
                    { productId: 1, quantity: 2, price: 2500 },
                    { productId: 2, quantity: 1, price: 1800 }
                ],
                total: 6800,
                deliveryFee: 200,
                grandTotal: 7000,
                status: 'delivered',
                deliveryAddress: '123 Main Street, Victoria Island, Lagos',
                houseNumber: '123A',
                landmark: 'Near City Mall',
                phoneNumber: '+234-123-456-7890',
                paymentMethod: 'cash',
                specialInstructions: 'Ring the doorbell twice',
                orderDate: new Date('2024-01-15T10:30:00'),
                deliveryDate: new Date('2024-01-15T11:15:00')
            },
            {
                id: 'ORD-002',
                userId: 1,
                items: [
                    { productId: 3, quantity: 1, price: 450000 }
                ],
                total: 450000,
                deliveryFee: 200,
                grandTotal: 450200,
                status: 'preparing',
                deliveryAddress: '456 Oak Avenue, Ikeja, Lagos',
                houseNumber: '456B',
                landmark: 'Opposite Police Station',
                phoneNumber: '+234-123-456-7890',
                paymentMethod: 'card',
                specialInstructions: 'Call before delivery',
                orderDate: new Date('2024-01-16T14:20:00'),
                deliveryDate: null
            }
        ];

        // Store in localStorage
        localStorage.setItem('qd_users', JSON.stringify(this.users));
        localStorage.setItem('qd_products', JSON.stringify(this.products));
        localStorage.setItem('qd_orders', JSON.stringify(this.orders));
        localStorage.setItem('qd_cart', JSON.stringify(this.cart));
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('qd_currentUser');
        const savedCart = localStorage.getItem('qd_cart');
        
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAdmin = this.currentUser.role === 'admin';
            this.updateUIForLoggedInUser();
        }
        
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    updateUIForLoggedInUser() {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.currentUser.role;
        
        if (this.isAdmin) {
            document.querySelector('.admin-only').style.display = 'block';
        }
    }

    navigateToSection(section) {
        // Check admin access
        if (section === 'admin' && !this.isAdmin) {
            this.showNotification('Access denied. Admin privileges required.', 'error');
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${section}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        switch (section) {
            case 'products':
                this.loadProducts();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'admin':
                this.loadAdminDashboard();
                break;
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Find user
        const user = this.users.find(u => u.email === email);

        if (user) {
            this.currentUser = user;
            this.isAdmin = user.role === 'admin';
            localStorage.setItem('qd_currentUser', JSON.stringify(this.currentUser));
            
            this.updateUIForLoggedInUser();
            this.hideModal('auth-modal');
            this.showSuccessModal('Login Successful!', `Welcome back, ${user.name}!`);
            
            // Reset form
            document.getElementById('login-form').reset();
        } else {
            this.showNotification('Invalid email or password. Please try again.', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;

        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);

        if (existingUser) {
            this.showNotification('User with this email already exists.', 'error');
            return;
        }

        // Validate inputs
        if (!this.validateRegistrationInputs(name, email, phone, password)) {
            return;
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            phone,
            role: 'customer',
            registeredAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('qd_users', JSON.stringify(this.users));

        // Auto-login
        this.currentUser = newUser;
        localStorage.setItem('qd_currentUser', JSON.stringify(this.currentUser));
        
        this.updateUIForLoggedInUser();
        this.hideModal('register-modal');
        this.updateStats();
        this.showSuccessModal('Registration Successful!', `Welcome to QuickDelivery, ${name}!`);
        
        // Reset form
        document.getElementById('register-form').reset();
    }

    validateRegistrationInputs(name, email, phone, password) {
        // Name validation
        if (name.length < 2) {
            this.showNotification('Name must be at least 2 characters long.', 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            this.showNotification('Please enter a valid phone number.', 'error');
            return false;
        }

        // Password validation
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long.', 'error');
            return false;
        }

        return true;
    }

    loadProducts(filter = 'all') {
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';

        let filteredProducts = this.products;
        if (filter !== 'all') {
            filteredProducts = this.products.filter(product => product.category === filter);
        }

        if (filteredProducts.length === 0) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box"></i>
                    <h3>No Products Found</h3>
                    <p>No products match your current filter.</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            productsList.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-image"></i>'}
            </div>
            <div class="product-info">
                <div class="product-category ${product.category}">${this.getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-price">₦${product.price.toLocaleString()}</div>
                        <div class="product-stock">${product.stock} in stock</div>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" onclick="app.addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    getCategoryName(category) {
        const categoryNames = {
            food: 'Food & Beverages',
            electronics: 'Electronics',
            groceries: 'Groceries',
            pharmacy: 'Pharmacy'
        };
        return categoryNames[category] || category;
    }

    addToCart(productId) {
        if (!this.currentUser) {
            this.showNotification('Please login to add items to cart.', 'error');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            this.showNotification('Product is out of stock.', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
                this.showNotification(`${product.name} quantity updated in cart.`, 'success');
            } else {
                this.showNotification('Cannot add more items. Stock limit reached.', 'warning');
                return;
            }
        } else {
            this.cart.push({
                productId: productId,
                quantity: 1,
                price: product.price
            });
            this.showNotification(`${product.name} added to cart.`, 'success');
        }

        this.updateCartCount();
        this.saveCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.updateCartCount();
        this.saveCart();
        this.loadCart();
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.productId === productId);
        const product = this.products.find(p => p.id === productId);
        
        if (item && product) {
            const newQuantity = item.quantity + change;
            
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else if (newQuantity <= product.stock) {
                item.quantity = newQuantity;
                this.updateCartCount();
                this.saveCart();
                this.loadCart();
            } else {
                this.showNotification('Cannot add more items. Stock limit reached.', 'warning');
            }
        }
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    }

    saveCart() {
        localStorage.setItem('qd_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
            document.getElementById('cart-total').textContent = '0';
            return;
        }

        let total = 0;

        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                const itemTotal = item.quantity * item.price;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">₦${item.price.toLocaleString()} each</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.productId}, -1)">-</button>
                        <span class="cart-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.productId}, 1)">+</button>
                        <button class="btn btn-outline" onclick="app.removeFromCart(${item.productId})" style="margin-left: 1rem; padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            }
        });

        document.getElementById('cart-total').textContent = total.toLocaleString();
    }

    proceedToCheckout() {
        if (!this.currentUser) {
            this.showNotification('Please login to proceed with checkout.', 'error');
            return;
        }

        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty.', 'error');
            return;
        }

        // Pre-fill phone number if available
        document.getElementById('phone-number').value = this.currentUser.phone || '';

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const deliveryFee = 200;
        const total = subtotal + deliveryFee;

        document.getElementById('checkout-subtotal').textContent = subtotal.toLocaleString();
        document.getElementById('delivery-fee').textContent = deliveryFee.toLocaleString();
        document.getElementById('checkout-total').textContent = total.toLocaleString();

        this.hideModal('cart-modal');
        this.showModal('checkout-modal');
    }

    handleCheckout() {
        const deliveryAddress = document.getElementById('delivery-address').value;
        const houseNumber = document.getElementById('house-number').value;
        const landmark = document.getElementById('landmark').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const specialInstructions = document.getElementById('special-instructions').value;

        // Validate required fields
        if (!deliveryAddress || !houseNumber || !phoneNumber || !paymentMethod) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const deliveryFee = 200;
        const grandTotal = subtotal + deliveryFee;

        // Create order
        const order = {
            id: this.generateOrderId(),
            userId: this.currentUser.id,
            items: [...this.cart],
            total: subtotal,
            deliveryFee: deliveryFee,
            grandTotal: grandTotal,
            status: 'pending',
            deliveryAddress: deliveryAddress,
            houseNumber: houseNumber,
            landmark: landmark,
            phoneNumber: phoneNumber,
            paymentMethod: paymentMethod,
            specialInstructions: specialInstructions,
            orderDate: new Date(),
            deliveryDate: null
        };

        // Add to orders
        this.orders.push(order);
        localStorage.setItem('qd_orders', JSON.stringify(this.orders));

        // Update product stock
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.stock -= item.quantity;
            }
        });
        localStorage.setItem('qd_products', JSON.stringify(this.products));

        // Clear cart
        this.cart = [];
        this.updateCartCount();
        this.saveCart();

        // Update stats
        this.updateStats();

        // Close modal and show success
        this.hideModal('checkout-modal');
        this.showSuccessModal('Order Placed Successfully!', 
            `Your order ${order.id} has been placed and will be delivered soon.`);

        // Reset form
        document.getElementById('checkout-form').reset();

        // Refresh orders if on orders page
        if (this.currentSection === 'orders') {
            this.loadOrders();
        }
    }

    generateOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    loadOrders() {
        if (!this.currentUser) {
            document.getElementById('orders-list').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user"></i>
                    <h3>Login Required</h3>
                    <p>Please login to view your orders.</p>
                    <button class="btn btn-primary" onclick="showAuthModal()">Login Now</button>
                </div>
            `;
            return;
        }

        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';

        const userOrders = this.orders.filter(order => order.userId === this.currentUser.id);

        if (userOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Start shopping!</p>
                    <button class="btn btn-primary" onclick="app.navigateToSection('products')">Browse Products</button>
                </div>
            `;
            return;
        }

        userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        userOrders.forEach(order => {
            const orderCard = this.createOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }

    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        const orderItems = order.items.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            return product ? {
                ...item,
                name: product.name
            } : null;
        }).filter(Boolean);

        const itemsHtml = orderItems.map(item => `
            <div class="order-item">
                <div>
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="order-item-price">₦${(item.quantity * item.price).toLocaleString()}</div>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
            </div>
            <div class="order-items">
                ${itemsHtml}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: ₦${order.grandTotal.toLocaleString()}</div>
                <div class="order-date">${order.orderDate.toLocaleDateString()}</div>
            </div>
        `;
        
        return card;
    }

    loadAdminDashboard() {
        if (!this.isAdmin) {
            return;
        }

        this.updateAdminStats();
        this.loadAdminOrders();
    }

    updateAdminStats() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const completedOrders = this.orders.filter(o => o.status === 'delivered').length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.grandTotal, 0);

        document.getElementById('admin-total-orders').textContent = totalOrders;
        document.getElementById('admin-pending-orders').textContent = pendingOrders;
        document.getElementById('admin-completed-orders').textContent = completedOrders;
        document.getElementById('admin-total-revenue').textContent = `₦${totalRevenue.toLocaleString()}`;
    }

    loadAdminOrders() {
        const adminOrdersList = document.getElementById('admin-orders-list');
        adminOrdersList.innerHTML = '';

        if (this.orders.length === 0) {
            adminOrdersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No Orders</h3>
                    <p>No orders have been placed yet.</p>
                </div>
            `;
            return;
        }

        // Sort orders by date (newest first)
        const sortedOrders = [...this.orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        sortedOrders.forEach(order => {
            const adminOrderCard = this.createAdminOrderCard(order);
            adminOrdersList.appendChild(adminOrderCard);
        });
    }

    createAdminOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'admin-order-card';
        
        const user = this.users.find(u => u.id === order.userId);
        const userName = user ? user.name : 'Unknown User';

        card.innerHTML = `
            <div class="admin-order-info">
                <h4>Order #${order.id}</h4>
                <p><strong>Customer:</strong> ${userName}</p>
                <p><strong>Phone:</strong> ${order.phoneNumber}</p>
                <p><strong>Total:</strong> ₦${order.grandTotal.toLocaleString()}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
            </div>
            <div class="admin-order-address">
                <strong>Delivery Address:</strong><br>
                ${order.deliveryAddress}<br>
                House: ${order.houseNumber}<br>
                ${order.landmark ? `Landmark: ${order.landmark}<br>` : ''}
                ${order.specialInstructions ? `Instructions: ${order.specialInstructions}` : ''}
            </div>
            <div class="admin-order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn btn-primary" onclick="app.updateOrderStatus('${order.id}', 'preparing')">
                        Start Preparing
                    </button>
                ` : ''}
                ${order.status === 'preparing' ? `
                    <button class="btn btn-primary" onclick="app.updateOrderStatus('${order.id}', 'delivering')">
                        Out for Delivery
                    </button>
                ` : ''}
                ${order.status === 'delivering' ? `
                    <button class="btn btn-primary" onclick="app.updateOrderStatus('${order.id}', 'delivered')">
                        Mark Delivered
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="app.viewOrderDetails('${order.id}')">
                    View Details
                </button>
            </div>
        `;
        
        return card;
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            if (newStatus === 'delivered') {
                order.deliveryDate = new Date();
            }
            localStorage.setItem('qd_orders', JSON.stringify(this.orders));
            this.updateAdminStats();
            this.loadAdminOrders();
            this.showNotification(`Order ${orderId} status updated to ${newStatus}.`, 'success');
        }
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const user = this.users.find(u => u.id === order.userId);
        const orderItems = order.items.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            return product ? `${product.name} x${item.quantity} - ₦${(item.quantity * item.price).toLocaleString()}` : 'Unknown Product';
        }).join('<br>');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Order Details - ${order.id}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <h4>Customer Information</h4>
                        <p><strong>Name:</strong> ${user ? user.name : 'Unknown'}</p>
                        <p><strong>Email:</strong> ${user ? user.email : 'Unknown'}</p>
                        <p><strong>Phone:</strong> ${order.phoneNumber}</p>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <h4>Delivery Information</h4>
                        <p><strong>Address:</strong> ${order.deliveryAddress}</p>
                        <p><strong>House Number:</strong> ${order.houseNumber}</p>
                        ${order.landmark ? `<p><strong>Landmark:</strong> ${order.landmark}</p>` : ''}
                        ${order.specialInstructions ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>` : ''}
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <h4>Order Items</h4>
                        <div style="background: var(--background-color); padding: 1rem; border-radius: var(--border-radius);">
                            ${orderItems}
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <h4>Payment Information</h4>
                        <p><strong>Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Subtotal:</strong> ₦${order.total.toLocaleString()}</p>
                        <p><strong>Delivery Fee:</strong> ₦${order.deliveryFee.toLocaleString()}</p>
                        <p><strong>Total:</strong> ₦${order.grandTotal.toLocaleString()}</p>
                    </div>
                    <div>
                        <h4>Order Timeline</h4>
                        <p><strong>Order Date:</strong> ${order.orderDate.toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
                        ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${order.deliveryDate.toLocaleString()}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    handleAddProduct() {
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const image = document.getElementById('product-image').value;

        // Validate inputs
        if (!name || !category || !description || !price || !stock) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (price <= 0 || stock < 0) {
            this.showNotification('Price must be greater than 0 and stock cannot be negative.', 'error');
            return;
        }

        // Create new product
        const newProduct = {
            id: this.products.length + 1,
            name,
            category,
            description,
            price,
            stock,
            image: image || null
        };

        this.products.push(newProduct);
        localStorage.setItem('qd_products', JSON.stringify(this.products));

        this.hideModal('add-product-modal');
        this.showSuccessModal('Product Added!', `${name} has been added to the catalog.`);
        
        // Reset form
        document.getElementById('add-product-form').reset();

        // Refresh products if on products page
        if (this.currentSection === 'products') {
            this.loadProducts();
        }
    }

    handleFilterChange(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Load filtered products
        this.loadProducts(filter);
    }

    updateStats() {
        document.getElementById('total-products').textContent = `${this.products.length}+`;
        document.getElementById('total-orders').textContent = this.orders.length.toLocaleString();
        
        // Calculate average delivery time (mock data)
        const avgDeliveryTime = 15;
        document.getElementById('delivery-time').textContent = avgDeliveryTime;
        
        // Calculate customer rating (mock data)
        const customerRating = 4.8;
        document.getElementById('customer-rating').textContent = customerRating;
    }

    exportOrdersData() {
        if (!this.isAdmin) {
            this.showNotification('Access denied.', 'error');
            return;
        }

        const exportData = {
            orders: this.orders,
            users: this.users,
            products: this.products,
            exportDate: new Date().toISOString(),
            totalRevenue: this.orders.reduce((sum, order) => sum + order.grandTotal, 0)
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quickdelivery_orders_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('Orders data exported successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            padding: 1rem;
            max-width: 400px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        const color = type === 'error' ? 'var(--error-color)' : 
                     type === 'success' ? 'var(--success-color)' : 
                     type === 'warning' ? 'var(--warning-color)' :
                     'var(--primary-color)';
        
        notification.style.borderLeft = `4px solid ${color}`;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; font-size: 0.875rem;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 1.25rem; padding: 0;">&times;</button>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showSuccessModal(title, message) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').classList.add('active');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    logout() {
        this.currentUser = null;
        this.isAdmin = false;
        this.cart = [];
        localStorage.removeItem('qd_currentUser');
        localStorage.removeItem('qd_cart');
        
        document.getElementById('login-btn').style.display = 'inline-flex';
        document.getElementById('register-btn').style.display = 'inline-flex';
        document.getElementById('user-info').style.display = 'none';
        document.querySelector('.admin-only').style.display = 'none';
        
        this.updateCartCount();
        this.navigateToSection('home');
        this.showNotification('You have been logged out successfully.', 'info');
    }
}

// Global functions for HTML onclick handlers
function showAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('register-modal').classList.add('active');
}

function switchToRegister() {
    app.hideModal('auth-modal');
    setTimeout(() => showRegisterModal(), 100);
}

function switchToLogin() {
    app.hideModal('register-modal');
    setTimeout(() => showAuthModal(), 100);
}

function showCart() {
    app.loadCart();
    app.showModal('cart-modal');
}

function showAddProductModal() {
    if (!app.isAdmin) {
        app.showNotification('Access denied.', 'error');
        return;
    }
    app.showModal('add-product-modal');
}

function hideModal(modalId) {
    app.hideModal(modalId);
}

function logout() {
    app.logout();
}

function navigateToSection(section) {
    app.navigateToSection(section);
}

function exportOrdersData() {
    app.exportOrdersData();
}

// Initialize the application
const app = new QuickDelivery();

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);