'use client'

import { useState } from 'react'
import { FlightTab, Widget } from '@/types/dashboard'
import dynamic from 'next/dynamic'

const WidgetEditor = dynamic(() => import('./WidgetEditor'), {
  ssr: false,
})

export interface TabContentEditorProps {
  tab: FlightTab
  onSave: (tab: FlightTab) => Promise<void>
  onCancel: () => void
}

export default function TabContentEditor({
  tab,
  onSave,
  onCancel,
}: TabContentEditorProps) {
  const [editingTab, setEditingTab] = useState<FlightTab>(tab)
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)
  const [deleteWidgetConfirm, setDeleteWidgetConfirm] = useState<string | null>(
    null
  )

  const handleAddWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type} Widget`,
      content: {},
      order: editingTab.widgets.length,
      settings: {},
    }
    setEditingWidget(newWidget)
  }

  const handleSaveWidget = (widget: Widget) => {
    const isNew = !editingTab.widgets.find((w) => w.id === widget.id)
    const updatedWidgets = isNew
      ? [...editingTab.widgets, widget]
      : editingTab.widgets.map((w) => (w.id === widget.id ? widget : w))

    setEditingTab({
      ...editingTab,
      widgets: updatedWidgets,
    })
    setEditingWidget(null)
  }

  const handleDeleteWidget = (widgetId: string) => {
    setEditingTab({
      ...editingTab,
      widgets: editingTab.widgets.filter((w) => w.id !== widgetId),
    })
    setDeleteWidgetConfirm(null)
  }

  const handleSaveTab = () => {
    onSave(editingTab)
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {tab.id.startsWith('tab-') ? 'Create New Tab' : 'Edit Tab'}
          </h3>

          {/* Tab Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={editingTab.title}
                onChange={(e) =>
                  setEditingTab({ ...editingTab, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editingTab.description}
                onChange={(e) =>
                  setEditingTab({ ...editingTab, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editingTab.active}
                onChange={(e) =>
                  setEditingTab({ ...editingTab, active: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>
          </div>

          {/* Widgets Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Widgets</h4>
              <div className="flex space-x-2">
                <select
                  onChange={(e) =>
                    handleAddWidget(e.target.value as Widget['type'])
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Add Widget
                  </option>
                  <option value="priceChart">Price Chart</option>
                  <option value="promotionImage">Promotion Image</option>
                  <option value="announcement">Announcement</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>

            {/* Widgets List */}
            <div className="space-y-4">
              {editingTab.widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {widget.title}
                      </h5>
                      <p className="text-sm text-gray-500 capitalize">
                        {widget.type}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingWidget(widget)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      {deleteWidgetConfirm === widget.id ? (
                        <>
                          <button
                            onClick={() => handleDeleteWidget(widget.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteWidgetConfirm(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteWidgetConfirm(widget.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTab}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Widget Editor Modal */}
      {editingWidget && (
        <WidgetEditor
          widget={editingWidget}
          onSave={handleSaveWidget}
          onCancel={() => setEditingWidget(null)}
        />
      )}
    </div>
  )
}
