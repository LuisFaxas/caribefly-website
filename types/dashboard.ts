export interface DashboardMetrics {
  bookings: number
  revenue: number
  visitors: number
}

export interface DashboardData {
  totalFlights: number
  activePromotions: number
  activeAnnouncements: number
  recentBookings: number
  metrics: {
    daily: DashboardMetrics
    weekly: DashboardMetrics
    monthly: DashboardMetrics
  }
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'alert'
  priority: 'high' | 'normal' | 'low'
  validFrom: Date
  validUntil: Date
  active: boolean
  order: number // Added this field
}

export interface Promotion {
  id: string
  title: string
  imageUrl: string
  description: string
  validFrom: Date
  validUntil: Date
  active: boolean
  order: number
  charter?: string
  type: 'standard' | 'featured' | 'banner'
}

export interface WidgetSettings {
  autoUpdate?: boolean
  refreshInterval?: number
  displayLimit?: number
  layout?: 'grid' | 'list' | 'carousel'
  sources?: Record<string, boolean>
  style?: string
  position?: string
  showIcon?: boolean
  dismissible?: boolean
  persistent?: boolean
}

export interface Widget {
  id: string
  type: 'priceChart' | 'promotionImage' | 'announcement' | 'info'
  title: string
  content: any
  settings?: WidgetSettings
  order: number
}

export interface FlightTab {
  id: string
  title: string
  description?: string
  order: number
  widgets: Widget[]
  active: boolean
}

interface SubTab {
  id: string
  title: string
  order: number
  widgets: Widget[]
}

interface TabSection {
  id: string
  title: string
  subTabs: SubTab[]
}

// Price chart specific types
interface ChartPrice {
  charter: string
  route: string
  price: number
  lastUpdated: Date
  source: 'manual' | 'automated'
}

interface PriceChartWidget extends Widget {
  type: 'priceChart'
  content: {
    prices: ChartPrice[]
    updateFrequency: number // in minutes
  }
}

interface PromotionWidget extends Widget {
  type: 'promotionImage'
  content: {
    imageUrl: string
    link?: string
    validUntil?: Date
  }
}

interface AdminCharter {
  id: string
  title: string
  flights: Flight[]
}

interface Flight {
  route: string
  price: string
}
