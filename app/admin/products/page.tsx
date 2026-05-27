// Exemple simplifié de la logique pour ajouter un produit
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);

  async function handleAddProduct(formData: FormData) {
    setLoading(true);
    const { data, error } = await supabase.from('products').insert([
      {
        name: formData.get('name'),
        price: parseFloat(formData.get('price') as string),
        stock: parseInt(formData.get('stock') as string),
        description: formData.get('description'),
        seller_id: 'ID_DU_VENDEUR_PRINCIPAL' // À récupérer dynamiquement
      }
    ]);
    setLoading(false);
    if (!error) alert("Produit ajouté avec succès !");
  }

  return (
    <form action={handleAddProduct} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-bold">Ajouter un produit</h2>
      <input name="name" placeholder="Nom du produit (ex: Antenne Starlink)" className="w-full border p-2" required />
      <input name="price" type="number" placeholder="Prix (FCFA)" className="w-full border p-2" required />
      <input name="stock" type="number" placeholder="Quantité en stock" className="w-full border p-2" required />
      <textarea name="description" placeholder="Description détaillée" className="w-full border p-2" />
      <button disabled={loading} className="bg-blue-600 text-white p-2 rounded">
        {loading ? 'Enregistrement...' : 'Ajouter au catalogue'}
      </button>
    </form>
  );
}
