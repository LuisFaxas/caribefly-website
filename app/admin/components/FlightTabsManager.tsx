'use client'

import { useState } from 'react'
import { FlightTab } from '@/types/dashboard'
import dynamic from 'next/dynamic'

const TabContentEditor = dynamic(() => import('./TabContentEditor'), {
  ssr: false,
})

interface FlightTabsManagerProps {
  tabs: FlightTab[]
  onUpdate: (tabs: FlightTab[]) => Promise<void>
}

export default function FlightTabsManager({
  tabs,
  onUpdate,
}: FlightTabsManagerProps) {
  const [editingTab, setEditingTab] = useState<FlightTab | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreateTab = () => {
    const newTab: FlightTab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      description: '',
      order: tabs.length,
      widgets: [],
      active: true,
    }
    setEditingTab(newTab)
    setIsCreating(true)
  }

  const handleSaveTab = async (tab: FlightTab) => {
    try {
      const updatedTabs = isCreating
        ? [...tabs, tab]
        : tabs.map((t) => (t.id === tab.id ? tab : t))

      await onUpdate(updatedTabs)
      setEditingTab(null)
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving tab:', error)
    }
  }

  const handleDeleteTab = async (tabId: string) => {
    try {
      const updatedTabs = tabs.filter((t) => t.id !== tabId)
      // Reorder remaining tabs
      updatedTabs.forEach((tab, index) => {
        tab.order = index
      })
      await onUpdate(updatedTabs)
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting tab:', error)
    }
  }

  const handleMoveTab = async (tabId: string, direction: 'up' | 'down') => {
    const currentIndex = tabs.findIndex((t) => t.id === tabId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === tabs.length - 1)
    ) {
      return
    }

    const updatedTabs = [...tabs]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const [movedTab] = updatedTabs.splice(currentIndex, 1)
    updatedTabs.splice(newIndex, 0, movedTab)

    // Update order property
    updatedTabs.forEach((tab, index) => {
      tab.order = index
    })

    await onUpdate(updatedTabs)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Manage Flight Section Tabs
        </h2>
        <button
          onClick={handleCreateTab}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add New Tab
        </button>
      </div>

      {/* Tabs List */}
      <div className="grid gap-6">
        {tabs
          .sort((a, b) => a.order - b.order)
          .map((tab, index) => (
            <div
              key={tab.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleMoveTab(tab.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveTab(tab.id, 'down')}
                          disabled={index === tabs.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {tab.title}
                        </h3>
                        {tab.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {tab.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tab.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tab.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tab.widgets.length} widgets
                          </span>
                          <span className="text-xs text-gray-500">
                            Order: {tab.order}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingTab(tab)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    {deleteConfirm === tab.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteTab(tab.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(tab.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Tab Editor Modal */}
      {editingTab && (
        <TabContentEditor
          tab={editingTab}
          onSave={handleSaveTab}
          onCancel={() => {
            setEditingTab(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
