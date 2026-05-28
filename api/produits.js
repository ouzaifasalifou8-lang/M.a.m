import { createClient } from '@supabase/supabase-js';

// Utilisez Vercel pour stocker vos clés réelles à l'avenir
const supabase = createClient(
  'https://wnvlziwpoznslrumwgin.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY // Mettez votre clé secrète dans les variables d'env Vercel
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nom, image_url } = req.body;
    const { data, error } = await supabase.from('Produits').insert([{ nom, image_url }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } else {
    const { data, error } = await supabase.from('Produits').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  }
}
