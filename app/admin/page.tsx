import { supabase } from '@/lib/supabase/client';

export default async function AdminDashboard() {
  // Récupération des données depuis votre vue SQL
  const { data: stats } = await supabase
    .from('vw_seller_performance')
    .select('*');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord M.A.Mshop</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exemple de carte stat */}
        <div className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-gray-500">Total Ventes</h2>
          <p className="text-2xl font-bold">
            {stats?.reduce((acc, curr) => acc + (curr.total_sales || 0), 0)}
          </p>
        </div>
        
        {/* Ajoutez ici vos autres indicateurs */}
      </div>
      
      <h2 className="text-xl mt-10 mb-4">Performance des produits</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th>Produit</th>
            <th>Ventes</th>
            <th>Revenu</th>
          </tr>
        </thead>
        <tbody>
          {stats?.map((product) => (
            <tr key={product.product_id} className="border-b">
              <td>{product.name}</td>
              <td>{product.total_sales}</td>
              <td>{product.revenue} FCFA</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
