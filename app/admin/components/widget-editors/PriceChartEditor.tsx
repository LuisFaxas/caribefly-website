'use client'

import { Widget, WidgetSettings } from '@/types/dashboard'

interface PriceChartEditorProps {
  widget: Widget
  onChange: (widget: Widget) => void
}

export default function PriceChartEditor({
  widget,
  onChange,
}: PriceChartEditorProps) {
  const updateSettings = (settings: Partial<WidgetSettings>) => {
    onChange({
      ...widget,
      settings: {
        ...widget.settings,
        ...settings,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Auto Update
        </label>
        <div className="mt-1">
          <input
            type="checkbox"
            checked={widget.settings?.autoUpdate || false}
            onChange={(e) => updateSettings({ autoUpdate: e.target.checked })}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-500">
            Automatically update prices from charter systems
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Update Interval (minutes)
        </label>
        <input
          type="number"
          value={widget.settings?.refreshInterval || 60}
          onChange={(e) =>
            updateSettings({ refreshInterval: parseInt(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min="5"
          step="5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Display Format
        </label>
        <select
          value={widget.settings?.layout || 'grid'}
          onChange={(e) =>
            updateSettings({
              layout: e.target.value as WidgetSettings['layout'],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price Sources
        </label>
        <div className="mt-2 space-y-2">
          {['XAEL', 'Cubazul', 'Invicta'].map((source) => (
            <div key={source} className="flex items-center">
              <input
                type="checkbox"
                checked={widget.settings?.sources?.[source] || false}
                onChange={(e) => {
                  const currentSources = widget.settings?.sources || {}
                  updateSettings({
                    sources: {
                      ...currentSources,
                      [source]: e.target.checked,
                    },
                  })
                }}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700">{source}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
