'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PromotionWidget } from '@/types/dashboard'

export const PromotionCard: React.FC<PromotionWidget> = ({ content }) => {
  const { imageUrl, link, validUntil } = content

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-video relative">
        <Image
          src={imageUrl}
          alt="Promotion"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {validUntil && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Valid until {new Date(validUntil).toLocaleDateString()}
        </div>
      )}
      {link && (
        <Link
          href={link}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
        >
          <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
            Learn More
          </span>
        </Link>
      )}
    </div>
  )
}
