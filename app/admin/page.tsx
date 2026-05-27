'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShoppingBag, 
  Users, 
  Truck, 
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
  Wrench
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSellers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    totalTechnicians: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // Statistiques commandes
      const { data: orders } = await supabase
        .from('orders')
        .select('*')

      if (orders) {
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
        const pendingOrders = orders.filter(o => o.status === 'pending').length
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          pendingOrders: pendingOrders
        }))
      }

      // Statistiques utilisateurs
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: totalSellers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'seller')

      setStats(prev => ({
        ...prev,
        totalUsers: totalUsers || 0,
        totalSellers: totalSellers || 0
      }))

      // Dernières commandes
      const { data: recent } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles (display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentOrders(recent || [])
    } catch (error) {
      toast.error('Erreur chargement données')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Chiffre d\'affaires', value: `${stats.totalRevenue.toLocaleString()} FCFA`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Commandes', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'En attente', value: stats.pendingOrders, icon: Package, color: 'bg-yellow-500' },
    { title: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { title: 'Vendeurs', value: stats.totalSellers, icon: TrendingUp, color: 'bg-indigo-500' },
    { title: 'Livraisons actives', value: stats.activeDeliveries, icon: Truck, color: 'bg-orange-500' },
    { title: 'Techniciens', value: stats.totalTechnicians, icon: Wrench, color: 'bg-red-500' },
    { title: 'Zones couvertes', value: '8 régions', icon: MapPin, color: 'bg-teal-500' },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard M.A.Mshop</h1>
        <p className="text-gray-600 mt-2">Bienvenue dans l'interface d'administration - Niamey, Banizounbou 2</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', ventes: 4000 },
                  { month: 'Fév', ventes: 3000 },
                  { month: 'Mar', ventes: 5000 },
                  { month: 'Avr', ventes: 7000 },
                  { month: 'Mai', ventes: 6000 },
                  { month: 'Juin', ventes: 8000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ventes" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Livrées', value: 45, color: '#10b981' },
                      { name: 'En cours', value: 25, color: '#f59e0b' },
                      { name: 'En attente', value: 20, color: '#ef4444' },
                      { name: 'Installation', value: 10, color: '#8b5cf6' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[45, 25, 20, 10].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernières commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Montant</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-2">{order.user_profiles?.display_name || 'Client'}</td>
                    <td className="px-4 py-2">{order.total.toLocaleString()} FCFA</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:text-blue-800">Voir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info entreprise */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">M.A.Mshop</h2>
            <p className="mt-2">Quartier Banizounbou 2 - Niamey, Niger</p>
            <p className="text-sm opacity-90">Livraison disponible sur tout le Niger 🇳🇪</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Services exclusifs :</p>
            <p className="text-sm">✅ Antennes paraboliques</p>
            <p className="text-sm">✅ Installation Starlink</p>
            <p className="text-sm">✅ Service à domicile</p>
          </div>
        </div>
      </div>
    </div>
  )
}
