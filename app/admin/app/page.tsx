import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Truck, Wrench, CreditCard, Shield, Star, MapPin, Satellite } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(8)
    .order('created_at', { ascending: false })

  const { data: popularProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              M.A.Mshop - Le Niger Achete et Vends
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Découvrez la première marketplace générale du Niger. 
              Achetez, vendez et faites installer vos équipements partout au pays.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Commander maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/installation">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  Service installation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services exclusifs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos services exclusifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Satellite className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Starlink & Antennes</h3>
              <p className="text-gray-600">Vente d'antennes paraboliques et kits Starlink haut débit</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Wrench className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Installation pro</h3>
              <p className="text-gray-600">Installation à domicile par nos techniciens qualifiés</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Truck className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Livraison Niger</h3>
              <p className="text-gray-600">Livraison rapide partout au Niger</p>
            </div>
          </div>
        </div>
      </section>

      {/* Produits populaires */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Produits populaires</h2>
            <Link href="/products" className="text-blue-600 hover:underline flex items-center">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi M.A.Mshop */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir M.A.Mshop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-gray-600">Orange Money, Moov Money, TMoney</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Livraison nationale</h3>
              <p className="text-gray-600">De Niamey à Diffa, partout au Niger</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Service client</h3>
              <p className="text-gray-600">Support WhatsApp 7j/7</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Vendeurs vérifiés</h3>
              <p className="text-gray-600">Tous nos vendeurs sont certifiés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre localisation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Nous trouver à Niamey</h3>
                <p className="mb-2">Quartier Banizounbou 2, Niamey - Niger</p>
                <p className="opacity-90">Ouvert du lundi au samedi de 8h à 19h</p>
                <p className="opacity-90">📞 +227 XX XX XX XX</p>
              </div>
              <Button variant="secondary" size="lg" className="mt-4 md:mt-0">
                Nous contacter sur WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
