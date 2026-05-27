'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, MapPin, Wrench, Satellite, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InstallationPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    city: 'Niamey',
    service_type: 'antenna',
    installation_date: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('installations')
        .insert({
          user_id: user?.id,
          ...formData,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Demande d\'installation envoyée ! Un technicien vous contactera')
      setFormData({
        customer_name: '',
        phone: '',
        address: '',
        city: 'Niamey',
        service_type: 'antenna',
        installation_date: '',
        notes: ''
      })
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Service d'installation</h1>
        <p className="text-center text-gray-600 mb-8">
          Installation d'antennes paraboliques et kits Starlink à domicile
        </p>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-4">
            <Wrench className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold">Techniciens qualifiés</h3>
            <p className="text-sm text-gray-600">Installation professionnelle garantie</p>
          </div>
          <div className="text-center p-4">
            <Clock className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold">Intervention rapide</h3>
            <p className="text-sm text-gray-600">Sous 48h maximum</p>
          </div>
          <div className="text-center p-4">
            <CheckCircle className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold">Garantie 6 mois</h3>
            <p className="text-sm text-gray-600">Sur toutes nos installations</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Demander une installation</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customer_name">Nom complet *</Label>
                <Input
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse complète *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <select
                  id="city"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option>Niamey</option>
                  <option>Zinder</option>
                  <option>Maradi</option>
                  <option>Agadez</option>
                  <option>Tahoua</option>
                  <option>Diffa</option>
                  <option>Dosso</option>
                  <option>Tillabéri</option>
                </select>
              </div>

              <div>
                <Label htmlFor="service_type">Type d'installation *</Label>
                <select
                  id="service_type"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                >
                  <option value="antenna">Antenne parabolique</option>
                  <option value="starlink">Kit Starlink</option>
                  <option value="both">Antenne + Starlink</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="installation_date">Date souhaitée</Label>
              <Input
                id="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={(e) => setFormData({...formData, installation_date: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="notes">Informations complémentaires</Label>
              <Textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Précisions sur le lieu, type de toit, etc."
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Envoi en cours...' : 'Demander l\'installation'}
            </Button>
          </form>
        </div>

        {/* Tarifs */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Tarifs d'installation</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span>Antenne parabolique standard</span>
              <span className="font-semibold">15 000 FCFA</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Kit Starlink</span>
              <span className="font-semibold">35 000 FCFA</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Déplacement (hors Niamey)</span>
              <span className="font-semibold">Sur devis</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Matériel non inclus - Disponible à la vente dans notre boutique
          </p>
        </div>
      </div>
    </div>
  )
        }i
