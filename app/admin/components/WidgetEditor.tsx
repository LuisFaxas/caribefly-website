'use client'

import { useState } from 'react'
import { Widget } from '@/types/dashboard'
import PriceChartEditor from './widget-editors/PriceChartEditor'
import PromotionImageEditor from './widget-editors/PromotionImageEditor'
import AnnouncementEditor from './widget-editors/AnnouncementEditor'

interface WidgetEditorProps {
  widget: Widget
  onSave: (widget: Widget) => void
  onCancel: () => void
}

export default function WidgetEditor({
  widget,
  onSave,
  onCancel,
}: WidgetEditorProps) {
  const [editingWidget, setEditingWidget] = useState<Widget>(widget)

  const handleSave = () => {
    onSave(editingWidget)
  }

  const renderWidgetTypeEditor = () => {
    switch (editingWidget.type) {
      case 'priceChart':
        return (
          <PriceChartEditor
            widget={editingWidget}
            onChange={(updatedWidget: Widget) =>
              setEditingWidget(updatedWidget)
            }
          />
        )
      case 'promotionImage':
        return (
          <PromotionImageEditor
            widget={editingWidget}
            onChange={(updatedWidget: Widget) =>
              setEditingWidget(updatedWidget)
            }
          />
        )
      case 'announcement':
        return (
          <AnnouncementEditor
            widget={editingWidget}
            onChange={(updatedWidget: Widget) =>
              setEditingWidget(updatedWidget)
            }
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Edit {editingWidget.type} Widget
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Common Widget Settings */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Widget Title
              </label>
              <input
                type="text"
                value={editingWidget.title}
                onChange={(e) =>
                  setEditingWidget({ ...editingWidget, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={editingWidget.order}
                onChange={(e) =>
                  setEditingWidget({
                    ...editingWidget,
                    order: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
          </div>

          {/* Widget-specific Editor */}
          {renderWidgetTypeEditor()}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
