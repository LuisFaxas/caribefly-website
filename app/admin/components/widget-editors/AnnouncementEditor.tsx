// app/admin/components/widget-editors/AnnouncementEditor.tsx
'use client'

import { Widget } from '@/types/dashboard'

interface AnnouncementEditorProps {
  widget: Widget
  onChange: (widget: Widget) => void
}

export default function AnnouncementEditor({
  widget,
  onChange,
}: AnnouncementEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Announcement Type
        </label>
        <select
          value={widget.content.type || 'info'}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, type: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="info">Information</option>
          <option value="warning">Warning</option>
          <option value="alert">Alert</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          value={widget.content.text || ''}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, text: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={4}
          placeholder="Enter announcement text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={widget.content.priority || 'normal'}
          onChange={(e) =>
            onChange({
              ...widget,
              content: { ...widget.content, priority: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Display From
          </label>
          <input
            type="datetime-local"
            value={widget.content.displayFrom || ''}
            onChange={(e) =>
              onChange({
                ...widget,
                content: { ...widget.content, displayFrom: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Display Until
          </label>
          <input
            type="datetime-local"
            value={widget.content.displayUntil || ''}
            onChange={(e) =>
              onChange({
                ...widget,
                content: { ...widget.content, displayUntil: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Display Settings
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={widget.settings?.dismissible || false}
              onChange={(e) =>
                onChange({
                  ...widget,
                  settings: {
                    ...widget.settings,
                    dismissible: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 text-sm text-gray-700">
              Allow users to dismiss this announcement
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={widget.settings?.showIcon || false}
              onChange={(e) =>
                onChange({
                  ...widget,
                  settings: {
                    ...widget.settings,
                    showIcon: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 text-sm text-gray-700">Show type icon</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={widget.settings?.persistent || false}
              onChange={(e) =>
                onChange({
                  ...widget,
                  settings: {
                    ...widget.settings,
                    persistent: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 text-sm text-gray-700">
              Keep visible until expiration (override user dismiss)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Display Style
          </label>
          <select
            value={widget.settings?.style || 'banner'}
            onChange={(e) =>
              onChange({
                ...widget,
                settings: {
                  ...widget.settings,
                  style: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="banner">Full Width Banner</option>
            <option value="card">Card</option>
            <option value="toast">Toast Notification</option>
          </select>
        </div>

        {widget.settings?.style === 'toast' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Toast Position
            </label>
            <select
              value={widget.settings?.position || 'top-right'}
              onChange={(e) =>
                onChange({
                  ...widget,
                  settings: {
                    ...widget.settings,
                    position: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
