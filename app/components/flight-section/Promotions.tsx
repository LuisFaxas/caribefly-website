// app/components/flight-section/Promotions.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

export interface PromotionImage {
  id: string
  url: string
  title: string
  description?: string
  validUntil?: Date
  linkUrl?: string
  type: 'standard' | 'featured' | 'banner'
}

interface PromotionsProps {
  images: PromotionImage[]
  onPromotionClick?: (promotion: PromotionImage) => void
  className?: string
}

export default function Promotions({
  images,
  onPromotionClick,
  className = '',
}: PromotionsProps) {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({})

  // Handle image loading errors
  const handleImageError = (id: string) => {
    setImageError((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  // Filter out inactive promotions
  const activePromotions = images.filter(
    (promo) => !promo.validUntil || new Date(promo.validUntil) > new Date()
  )

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {activePromotions.map((promotion) => (
        <div
          key={promotion.id}
          onClick={() => onPromotionClick?.(promotion)}
          className={`
            relative bg-white rounded-lg shadow-md overflow-hidden 
            transition-transform duration-300 ease-in-out
            ${promotion.linkUrl || onPromotionClick ? 'cursor-pointer hover:scale-105' : ''}
            ${promotion.type === 'featured' ? 'md:col-span-2 lg:col-span-3' : ''}
          `}
        >
          {/* Image Container with aspect ratio */}
          <div className="relative aspect-video">
            {!imageError[promotion.id] ? (
              <Image
                src={promotion.url}
                alt={promotion.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => handleImageError(promotion.id)}
                priority={promotion.type === 'featured'}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}

            {/* Valid until badge */}
            {promotion.validUntil && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Ends {new Date(promotion.validUntil).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{promotion.title}</h3>
            {promotion.description && (
              <p className="text-gray-600 text-sm">{promotion.description}</p>
            )}

            {/* Call to action for clickable promotions */}
            {(promotion.linkUrl || onPromotionClick) && (
              <div className="mt-4 flex justify-end">
                <span className="text-blue-600 text-sm hover:text-blue-800">
                  Learn more →
                </span>
              </div>
            )}
          </div>

          {/* Type indicator */}
          {promotion.type === 'featured' && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {activePromotions.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No active promotions at the moment</p>
        </div>
      )}
    </div>
  )
}
