```javascript
// js/supabase.js
// Configuration Supabase
const SUPABASE_URL = 'https://rqoaclfelpezlbbnjwrl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Kyg7s5KiLMYrUll4YwT0OA_mFsQ2onr';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb2FjbGZlbHBlemxiYm5qd3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDAwMTA3OSwiZXhwIjoyMDk1NTc3MDc5fQ.p1EeOztTw_c-r-LRu6nNuLzsFpO_sZvUkAK5poWfd0c';

// Initialiser le client Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions génériques
async function getProducts(featuredOnly = false) {
    let query = supabase.from('products').select('*').eq('is_active', true);
    if (featuredOnly) {
        query = query.eq('is_featured', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
        console.error('Erreur produits:', error);
        return [];
    }
    return data;
}

async function getProductById(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data;
}

async function getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) return [];
    return data;
}

async function getTestimonials() {
    const { data, error } = await supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

async function getServices() {
    const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
    if (error) return [];
    return data;
}

async function addToCart(productId, productName, price, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, name: productName, price: price, quantity: quantity, image: null });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

async function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

async function clearCart() {
    localStorage.removeItem('cart');
}

function getImageUrl(bucket, path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

async function uploadImage(file, bucket, folder = '') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    
    return getImageUrl(bucket, filePath);
}

// Fonction pour rendre les produits
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-state">Aucun produit disponible pour le moment</div>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="product-card" onclick="location.href='produit.html?id=${p.id}'">
            <div class="product-img">
                ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}">` : '<span>🛍️</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">${(p.price || 0).toLocaleString()} FCFA</p>
                ${p.compare_price ? `<p class="product-old-price">${p.compare_price.toLocaleString()} FCFA</p>` : ''}
                <button class="btn-add-cart" onclick="event.stopPropagation(); addToCartAndToast('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

async function addToCartAndToast(id, name, price) {
    await addToCart(id, name, price);
    showToast(`${name} ajouté au panier !`);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (count > 0) {
            el.textContent = count;
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    });
}
