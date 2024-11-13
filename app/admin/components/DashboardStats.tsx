'use client'

import { useState } from 'react'
import { DashboardData } from '@/types/dashboard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStatsProps {
  data: DashboardData | null
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Loading dashboard data...
        </div>
      </div>
    )
  }

  // Calculate trends (percentage changes)
  const calculateTrend = (current: number, previous: number): number => {
    return previous ? ((current - previous) / previous) * 100 : 0
  }

  const stats = [
    {
      name: 'Total Flights',
      value: data.totalFlights,
      trend: calculateTrend(data.totalFlights, data.totalFlights - 5),
      color: 'bg-blue-500',
    },
    {
      name: 'Active Promotions',
      value: data.activePromotions,
      trend: calculateTrend(data.activePromotions, data.activePromotions - 2),
      color: 'bg-green-500',
    },
    {
      name: 'Active Announcements',
      value: data.activeAnnouncements,
      trend: calculateTrend(
        data.activeAnnouncements,
        data.activeAnnouncements - 1
      ),
      color: 'bg-purple-500',
    },
    {
      name: 'Recent Bookings',
      value: data.recentBookings,
      trend: calculateTrend(data.recentBookings, data.recentBookings - 3),
      color: 'bg-yellow-500',
    },
  ]

  // Sample chart data
  const chartData = [
    { name: 'Jan', bookings: 65, revenue: 4800, visitors: 2400 },
    { name: 'Feb', bookings: 59, revenue: 5200, visitors: 2800 },
    { name: 'Mar', bookings: 80, revenue: 6100, visitors: 3200 },
    { name: 'Apr', bookings: 81, revenue: 6400, visitors: 3600 },
    { name: 'May', bookings: 56, revenue: 5900, visitors: 3100 },
    { name: 'Jun', bookings: 55, revenue: 5700, visitors: 3000 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stat.value.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend).toFixed(1)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">
                from previous period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Timeframe Selector */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-medium text-gray-900">
          Performance Metrics
        </h2>
        <div className="flex rounded-lg shadow-sm">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${
                t === 'daily'
                  ? 'rounded-l-lg'
                  : t === 'monthly'
                    ? 'rounded-r-lg'
                    : ''
              } border border-gray-200`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(data.metrics[timeframe]).map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-500 capitalize">
              {key}
            </h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {key === 'revenue'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Performance Overview
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3B82F6"
                  name="Bookings"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  name="Revenue"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8B5CF6"
                  name="Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  type: 'booking',
                  message: 'New booking received',
                  time: '5 minutes ago',
                },
                {
                  type: 'promotion',
                  message: 'Summer promotion updated',
                  time: '2 hours ago',
                },
                {
                  type: 'announcement',
                  message: 'New announcement published',
                  time: '4 hours ago',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'booking'
                        ? 'bg-green-500'
                        : activity.type === 'promotion'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                    }`}
                  />
                  <span className="flex-1 text-gray-600">
                    {activity.message}
                  </span>
                  <span className="text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: 'New Promotion',
                  color: 'bg-blue-600 hover:bg-blue-700',
                },
                {
                  label: 'Add Announcement',
                  color: 'bg-purple-600 hover:bg-purple-700',
                },
                {
                  label: 'Update Prices',
                  color: 'bg-green-600 hover:bg-green-700',
                },
                {
                  label: 'View Reports',
                  color: 'bg-yellow-600 hover:bg-yellow-700',
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`${action.color} text-white text-sm font-medium px-4 py-2 rounded-lg transition`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
