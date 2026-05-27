'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Eye, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SellersManagement() {
  const supabase = createClient()
  const [sellers, setSellers] = useState([])
  const [pendingSellers, setPendingSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  async function fetchSellers() {
    setLoading(true)
    try {
      // Récupérer les vendeurs
      const { data: sellersData } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          user_profiles (
            id,
            display_name,
            phone,
            email
          )
        `)
        .eq('role', 'seller')

      setSellers(sellersData || [])
    } catch (error) {
      toast.error('Erreur chargement')
    } finally {
      setLoading(false)
    }
  }

  async function approveSeller(userId: string) {
    try {
      // Mettre à jour le rôle
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'seller' })
        .eq('user_id', userId)

      if (error) throw error

      toast.success('Vendeur approuvé !')
      fetchSellers()
    } catch (error) {
      toast.error('Erreur approbation')
    }
  }

  async function rejectSeller(userId: string) {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      toast.success('Vendeur rejeté')
      fetchSellers()
    } catch (error) {
      toast.error('Erreur suppression')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des vendeurs</h1>

      {/* Vendeurs actifs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendeurs actifs ({sellers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Téléphone</th>
                  <th className="px-4 py-2 text-left">Produits</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller: any) => (
                  <tr key={seller.user_id} className="border-t">
                    <td className="px-4 py-2">{seller.user_profiles?.display_name || 'N/A'}</td>
                    <td className="px-4 py-2">{seller.user_profiles?.email || 'N/A'}</td>
                    <td className="px-4 py-2">{seller.user_profiles?.phone || 'N/A'}</td>
                    <td className="px-4 py-2">0</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Mail className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
