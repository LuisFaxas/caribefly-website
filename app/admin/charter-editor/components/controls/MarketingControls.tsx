// src/components/controls/MarketingControls.tsx
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

interface MarketingControlsProps {
  onLogoUpload: (image: string) => void
  onPromotionalImageUpload: (image: string) => void
}

export const MarketingControls: React.FC<MarketingControlsProps> = ({
  onLogoUpload,
  onPromotionalImageUpload,
}) => {
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'promo'
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'logo') {
          onLogoUpload(result)
        } else {
          onPromotionalImageUpload(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Added Section Header */}
        <h2 className="text-xl font-bold mb-4">Marketing</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUpload">Logo de la Agencia</Label>
            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'logo')}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('logoUpload')?.click()}
              variant="outline"
              className="w-full mt-2"
            >
              Subir Logo
            </Button>
          </div>

          <div>
            <Label htmlFor="promoUpload">Imagen Promocional</Label>
            <input
              id="promoUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'promo')}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('promoUpload')?.click()}
              variant="outline"
              className="w-full mt-2"
            >
              Subir Imagen Promocional
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
