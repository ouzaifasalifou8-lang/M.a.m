// Initialisation correcte du client Supabase
const SUPABASE_URL = 'https://dzbomxdmnznzykppbguh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_09bNEz6hpAH_QeD91-dhZw_ufVBhDlS'; // REMPLACEZ PAR VOTRE VRAIE CLÉ

// On crée le client de manière globale
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
