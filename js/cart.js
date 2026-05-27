// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Produit ajouté au panier !');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
    showToast('Produit retiré du panier');
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<div class="text-center py-8"><p class="text-gray-500">Votre panier est vide</p><a href="products.html" class="text-blue-600 hover:underline mt-4 inline-block">Continuer vos achats</a></div>';
            if (cartTotal) cartTotal.innerHTML = '0 FCFA';
            return;
        }
        
        cartContainer.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center border-b py-4">
                <div class="flex-1">
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-gray-600">${item.price.toLocaleString()} FCFA</p>
                </div>
                <div class="flex items-center space-x-4">
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           class="w-20 px-2 py-1 border rounded"
                           onchange="updateQuantity('${item.id}', parseInt(this.value))">
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        const total = getCartTotal();
        if (cartTotal) {
            cartTotal.innerHTML = `${total.toLocaleString()} FCFA`;
        }
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialiser l'affichage du panier
if (document.getElementById('cartItems')) {
    displayCart();
}
updateCartCount();
