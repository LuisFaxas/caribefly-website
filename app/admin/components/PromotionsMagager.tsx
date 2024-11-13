// app/adimn / components / PromotionsManager.tsx(continued)
;('use client')

import { useState } from 'react'
import { Promotion } from '@/types/dashboard'

interface PromotionsManagerProps {
  promotions: Promotion[]
  onUpdate: (promotions: Promotion[]) => void
}

export default function PromotionsManager({
  promotions,
  onUpdate,
}: PromotionsManagerProps) {
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  )
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleSavePromotion = async (promotion: Promotion) => {
    const updatedPromotions = promotions.map((p) =>
      p.id === promotion.id ? promotion : p
    )
    onUpdate(updatedPromotions)
    setEditingPromotion(null)
  }

  const handleDeletePromotion = (id: string) => {
    const updatedPromotions = promotions.filter((p) => p.id !== id)
    onUpdate(updatedPromotions)
    setDeleteConfirm(null)
  }

  const handleAddPromotion = () => {
    const newPromotion: Promotion = {
      id: `promo-${Date.now()}`,
      title: 'New Promotion',
      imageUrl: '',
      description: '',
      validFrom: new Date(),
      validUntil: new Date(),
      active: true,
      order: promotions.length,
      charter: '',
      type: 'standard',
    }
    onUpdate([...promotions, newPromotion])
    setEditingPromotion(newPromotion)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Promotions</h2>
        <button
          onClick={handleAddPromotion}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((promotion) => (
            <div key={promotion.id} className="border rounded-lg p-4">
              {editingPromotion?.id === promotion.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingPromotion.title}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editingPromotion.imageUrl}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                  />
                  <textarea
                    value={editingPromotion.description}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">
                        Valid From
                      </label>
                      <input
                        type="date"
                        value={
                          editingPromotion.validFrom.toISOString().split('T')[0]
                        }
                        onChange={(e) =>
                          setEditingPromotion({
                            ...editingPromotion,
                            validFrom: new Date(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        value={
                          editingPromotion.validUntil
                            .toISOString()
                            .split('T')[0]
                        }
                        onChange={(e) =>
                          setEditingPromotion({
                            ...editingPromotion,
                            validUntil: new Date(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Type</label>
                    <select
                      value={editingPromotion.type}
                      onChange={(e) =>
                        setEditingPromotion({
                          ...editingPromotion,
                          type: e.target.value as
                            | 'standard'
                            | 'featured'
                            | 'banner',
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="standard">Standard</option>
                      <option value="featured">Featured</option>
                      <option value="banner">Banner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Charter (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingPromotion.charter}
                      onChange={(e) =>
                        setEditingPromotion({
                          ...editingPromotion,
                          charter: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Charter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editingPromotion.order || 0}
                      onChange={(e) =>
                        setEditingPromotion({
                          ...editingPromotion,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPromotion.active}
                      onChange={(e) =>
                        setEditingPromotion({
                          ...editingPromotion,
                          active: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-600">Active</label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSavePromotion(editingPromotion)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPromotion(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {promotion.imageUrl ? (
                      <img
                        src={promotion.imageUrl}
                        alt={promotion.title}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="bg-gray-200 rounded flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold">{promotion.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {promotion.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        promotion.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promotion.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="ml-2 text-gray-500">
                      Order: {promotion.order || 0}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingPromotion(promotion)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    {deleteConfirm === promotion.id ? (
                      <>
                        <button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(promotion.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
