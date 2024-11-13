// types/admin.ts
import type { Charter, Flight } from './flight'

export interface AdminCharter {
  id: string
  title: string
  flights: Flight[]
}

// Convert between admin and full charter types
export const toAdminCharter = (charter: Charter): AdminCharter => {
  return {
    id: charter.id,
    title: charter.title,
    flights: charter.flights || [],
  }
}

export const toFullCharter = (adminCharter: AdminCharter): Charter => {
  return {
    id: adminCharter.id,
    title: adminCharter.title,
    system: 'custom',
    flights: adminCharter.flights,
    // These are optional in the Charter interface, so we can omit them
    routes: [],
    pricing: {},
  }
}
