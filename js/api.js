// js/api.js
// Configuration Turso
const TURSO_URL = 'https://mam-ouzaif.aws-eu-west-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ';

// Fonction pour exécuter des requêtes SQL sur Turso
async function dbQuery(sql) {
    try {
        const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TURSO_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [{ type: "execute", stmt: { sql: sql } }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const result = data.results?.[0]?.response?.result;
        
        if (!result || !result.rows) {
            return [];
        }
        
        // Convertir les résultats en objets
        const cols = result.cols?.map(c => c.name) || [];
        const rows = result.rows || [];
        
        return rows.map(row => {
            const obj = {};
            cols.forEach((col, idx) => {
                let value = row[idx]?.value;
                // Convertir les types si nécessaire
                if (row[idx]?.type === 'integer') value = parseInt(value);
                if (row[idx]?.type === 'real') value = parseFloat(value);
                obj[col] = value;
            });
            return obj;
        });
    } catch (error) {
        console.error('Turso error:', error);
        return [];
    }
}

// Fonction pour exécuter une requête sans retour (INSERT, UPDATE, DELETE)
async function dbExec(sql) {
    try {
        const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TURSO_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [{ type: "execute", stmt: { sql: sql } }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.results?.[0]?.response;
    } catch (error) {
        console.error('Turso exec error:', error);
        throw error;
    }
}

// Initialiser la base de données
async function initDatabase() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            compare_price REAL,
            stock INTEGER DEFAULT 0,
            category_id TEXT,
            is_featured INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            image_url TEXT,
            seller_id TEXT DEFAULT 'admin',
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE,
            is_active INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            password TEXT,
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS sellers (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            shop_name TEXT,
            shop_description TEXT,
            email TEXT,
            phone TEXT,
            rating REAL DEFAULT 0,
            sales INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            total REAL,
            status TEXT,
            payment_method TEXT,
            shipping_address TEXT,
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS order_items (
            id TEXT PRIMARY KEY,
            order_id TEXT,
            product_id TEXT,
            quantity INTEGER,
            price REAL
        )`,
        `CREATE TABLE IF NOT EXISTS galleries (
            id TEXT PRIMARY KEY,
            image TEXT,
            caption TEXT,
            type TEXT,
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS testimonials (
            id TEXT PRIMARY KEY,
            name TEXT,
            text TEXT,
            rating INTEGER,
            created_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`
    ];
    
    for (const sql of tables) {
        try { await dbExec(sql); } catch(e) { console.log('Table creation error:', e); }
    }
    
    // Vérifier et insérer les catégories par défaut
    const cats = await dbQuery("SELECT COUNT(*) as count FROM categories");
    if (cats.length === 0 || cats[0].count === 0) {
        await dbExec("INSERT INTO categories (id, name, slug, is_active, sort_order) VALUES ('cat_1', 'Mode & Vêtements', 'mode-vetements', 1, 1)");
        await dbExec("INSERT INTO categories (id, name, slug, is_active, sort_order) VALUES ('cat_2', 'Accessoires', 'accessoires', 1, 2)");
        await dbExec("INSERT INTO categories (id, name, slug, is_active, sort_order) VALUES ('cat_3', 'Électronique', 'electronique', 1, 3)");
        await dbExec("INSERT INTO categories (id, name, slug, is_active, sort_order) VALUES ('cat_4', 'Maison & Déco', 'maison-deco', 1, 4)");
    }
    
    // Produits par défaut si aucun
    const products = await dbQuery("SELECT COUNT(*) as count FROM products");
    if (products.length === 0 || products[0].count === 0) {
        await dbExec(`INSERT INTO products (id, name, description, price, stock, category_id, is_featured, is_active, image_url, created_at) VALUES 
            ('prd_1', 'Qamis Blanc Premium', 'Qamis de qualité supérieure en tissu 100% coton', 25000, 50, 'cat_1', 1, 1, '', datetime('now')),
            ('prd_2', 'Boubou Cérémonie', 'Boubou traditionnel pour grandes occasions', 45000, 25, 'cat_1', 1, 1, '', datetime('now')),
            ('prd_3', 'Montre Connectée', 'Montre intelligente avec Bluetooth', 35000, 30, 'cat_2', 1, 1, '', datetime('now')),
            ('prd_4', 'Tapis de Prière', 'Tapis de prière confortable', 8000, 100, 'cat_4', 1, 1, '', datetime('now'))`);
    }
}

// Fonction pour afficher les produits
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b">Aucun produit disponible</div>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}">` : '🛍️'}
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">${(p.price || 0).toLocaleString()} XOF</p>
                ${p.compare_price ? `<p class="product-old-price">${p.compare_price.toLocaleString()} XOF</p>` : ''}
                <button class="btn-add-cart" onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

// Appeler l'initialisation
initDatabase();
