// Configuration Supabase
const SUPABASE_URL = 'https://dzbomxdmnznzykppbguh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_09bNEz6hpAH_QeD91-dhZw_ufVBhDlS';

// Initialisation Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Vérifier session utilisateur
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Se déconnecter
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Mettre à jour l'UI selon l'utilisateur
async function updateAuthUI() {
    const user = await checkUser();
    const authButtons = document.getElementById('authButtons');
    
    if (user && authButtons) {
        // Récupérer le rôle de l'utilisateur
        const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
        
        if (userRole?.role === 'admin') {
            authButtons.innerHTML = `
                <a href="admin/index.html" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                                    <i class="fas fa-chart-line mr-2"></i>Admin
                </a>
                <button onclick="logout()" class="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
                    Déconnexion
                </button>
            `;
        } else if (userRole?.role === 'seller') {
            authButtons.innerHTML = `
                <a href="seller/dashboard.html" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    <i class="fas fa-store mr-2"></i>Vendeur
                </a>
                <button onclick="logout()" class="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
                    Déconnexion
                </button>
            `;
        } else {
            authButtons.innerHTML = `
                <span class="text-gray-700">Bonjour, ${user.email}</span>
                <button onclick="logout()" class="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
                    Déconnexion
                </button>
            `;
        }
    }
}

// Charger l'utilisateur au chargement
document.addEventListener('DOMContentLoaded', updateAuthUI);
