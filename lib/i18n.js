export const translations = {
  fr: {
    home: "Accueil", shop: "Boutique", services: "Services",
    marketplace: "Marketplace", about: "A propos", cart: "Panier",
    login: "Connexion", register: "S'inscrire", admin: "Admin",
    seller: "Vendeur", welcome: "Bienvenue sur MAM Shop",
    hero_sub: "Votre marketplace de confiance au Niger",
    featured: "Produits vedettes", order_whatsapp: "Commander sur WhatsApp",
    add_cart: "Ajouter au panier", price: "Prix", stock: "Stock",
    category: "Categorie", search: "Rechercher", contact: "Nous contacter",
    antenna_title: "Installation Antennes & Starlink",
    antenna_sub: "Service professionnel d'installation",
    testimonials: "Temoignages", gallery: "Galerie",
    sell_with_us: "Vendre avec nous", register_seller: "Devenir vendeur",
    about_us: "A propos de nous", copyright: "2026 MAM Shop - Tous droits reserves",
    settings: "Parametres", logout: "Deconnexion", dashboard: "Tableau de bord",
    products: "Produits", orders: "Commandes", users: "Utilisateurs",
    revenue: "Revenu", add_product: "Ajouter produit", edit: "Modifier",
    delete: "Supprimer", save: "Enregistrer", cancel: "Annuler",
    name: "Nom", description: "Description", upload_photo: "Telecharger photo",
    promo: "Promotion", whatsapp: "WhatsApp"
  },
  en: {
    home: "Home", shop: "Shop", services: "Services",
    marketplace: "Marketplace", about: "About", cart: "Cart",
    login: "Login", register: "Register", admin: "Admin",
    seller: "Seller", welcome: "Welcome to MAM Shop",
    hero_sub: "Your trusted marketplace in Niger",
    featured: "Featured Products", order_whatsapp: "Order on WhatsApp",
    add_cart: "Add to cart", price: "Price", stock: "Stock",
    category: "Category", search: "Search", contact: "Contact us",
    antenna_title: "Antenna & Starlink Installation",
    antenna_sub: "Professional installation service",
    testimonials: "Testimonials", gallery: "Gallery",
    sell_with_us: "Sell with us", register_seller: "Become a seller",
    about_us: "About us", copyright: "2026 MAM Shop - All rights reserved",
    settings: "Settings", logout: "Logout", dashboard: "Dashboard",
    products: "Products", orders: "Orders", users: "Users",
    revenue: "Revenue", add_product: "Add product", edit: "Edit",
    delete: "Delete", save: "Save", cancel: "Cancel",
    name: "Name", description: "Description", upload_photo: "Upload photo",
    promo: "Promotion", whatsapp: "WhatsApp"
  },
  ha: {
    home: "Gida", shop: "Kantin", services: "Ayyuka",
    marketplace: "Kasuwa", about: "Game da mu", cart: "Kwandon saye",
    login: "Shiga", register: "Yi rajista", admin: "Admin",
    seller: "Mai siyarwa", welcome: "Barka da zuwa MAM Shop",
    hero_sub: "Kasuwarku ta aminci a Nijar",
    featured: "Kayayyakin da aka zaba", order_whatsapp: "Oda ta WhatsApp",
    add_cart: "Zuba a kwando", price: "Farashi", stock: "Adadi",
    category: "Rukuni", search: "Bincika", contact: "Tuntubar mu",
    antenna_title: "Shigar da Antenna da Starlink",
    antenna_sub: "Sabis na sana'a na shigarwa",
    testimonials: "Shaidu", gallery: "Hotuna",
    sell_with_us: "Sayar tare da mu", register_seller: "Zama mai siyarwa",
    about_us: "Game da mu", copyright: "2026 MAM Shop - Duk hakkin da aka kiyaye",
    settings: "Saituna", logout: "Fita", dashboard: "Allon kula",
    products: "Kayayyaki", orders: "Oda", users: "Masu amfani",
    revenue: "Kudin shiga", add_product: "Kara kaya", edit: "Gyara",
    delete: "Share", save: "Ajiye", cancel: "Soke",
    name: "Suna", description: "Bayani", upload_photo: "Loda hoto",
    promo: "Rangwame", whatsapp: "WhatsApp"
  }
};

export function getLang() {
  if (typeof navigator === "undefined") return "fr";
  const lang = navigator.language?.substring(0, 2).toLowerCase();
  return ["fr", "en", "ha"].includes(lang) ? lang : "fr";
}

export function t(key) {
  const lang = getLang();
  return translations[lang]?.[key] || translations["fr"][key] || key;
    }
