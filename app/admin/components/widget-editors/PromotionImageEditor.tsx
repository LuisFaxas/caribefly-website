'use client'

import { Widget } from '@/types/dashboard'

interface PromotionImageEditorProps {
  widget: Widget
  onChange: (widget: Widget) => void
}

export default function PromotionImageEditor({
  widget,
  onChange,
}: PromotionImageEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Promotion Type
        </label>
        <select
          value={widget.content.type || 'standard'}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, type: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="standard">Standard</option>
          <option value="featured">Featured</option>
          <option value="banner">Banner</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          value={widget.content.imageUrl || ''}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, imageUrl: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Link URL (Optional)
        </label>
        <input
          type="text"
          value={widget.content.linkUrl || ''}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, linkUrl: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="https://example.com/promotion"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valid From
          </label>
          <input
            type="datetime-local"
            value={widget.content.validFrom || ''}
            onChange={(e) =>
              onChange({
                ...widget,
                content: { ...widget.content, validFrom: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valid Until
          </label>
          <input
            type="datetime-local"
            value={widget.content.validUntil || ''}
            onChange={(e) =>
              onChange({
                ...widget,
                content: { ...widget.content, validUntil: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
