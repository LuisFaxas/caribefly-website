import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import { FlightAvailability, FlightSchedule, FlightPrice } from '@/types/flight'

interface XaelCredentials {
  username: string
  password: string
}

interface XaelFlightData {
  flightNumber: string
  departure: string
  arrival: string
  seatsAvailable: number
  price: {
    regular: number
    firstClass?: number
  }
}

export class XaelService {
  private browser: Browser | null = null
  private page: Page | null = null
  private isLoggedIn: boolean = false

  constructor(private credentials: XaelCredentials) {}

  private async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true, // Set to false for debugging
      })
    }
  }

  private async handleModal() {
    if (!this.page) return

    try {
      // Wait for potential modal with a short timeout
      await this.page.waitForSelector('div[role="dialog"]', { timeout: 3000 })

      // If modal exists, try different potential close buttons
      const closeButtons = await this.page.$$(
        [
          'button[class*="close"]',
          'button[class*="modal-close"]',
          'button[aria-label="Close"]',
          '.modal-close-button',
          '.close-button',
        ].join(',')
      )

      if (closeButtons.length > 0) {
        await closeButtons[0].click()
        // Wait for modal to disappear
        await this.page.waitForSelector('div[role="dialog"]', {
          hidden: true,
          timeout: 3000,
        })
      }
    } catch (error) {
      // No modal found or timeout, continue normally
      console.log('No modal found or already closed')
    }
  }

  async login() {
    try {
      await this.initialize()
      if (!this.browser) throw new Error('Browser not initialized')

      this.page = await this.browser.newPage()

      // Navigate to XAEL login page
      await this.page.goto('https://xaelsuite.com/login.aspx')

      // Handle any initial modal
      await this.handleModal()

      // Fill login form
      await this.page.type('#txtUserName', this.credentials.username)
      await this.page.type('#txtPassword', this.credentials.password)
      await this.page.click('#btnLogin')

      // Wait for navigation
      await this.page.waitForNavigation()

      // Handle potential post-login modal
      await this.handleModal()

      // Check if login was successful
      const isLoggedIn = await this.page.evaluate(() => {
        return !document.querySelector('.login-error')
      })

      if (!isLoggedIn) {
        throw new Error('Login failed')
      }

      this.isLoggedIn = true
    } catch (error) {
      console.error('XAEL login error:', error)
      throw error
    }
  }

  async getAvailability(
    from: string,
    to: string,
    date: Date
  ): Promise<FlightAvailability[]> {
    try {
      if (!this.isLoggedIn) {
        await this.login()
      }

      if (!this.page) throw new Error('Page not initialized')

      // Navigate to flight search page
      await this.page.goto(
        'https://xaelsuite.com/Reservations/NewReservation.aspx'
      )

      // Handle any modal that might appear
      await this.handleModal()

      // Fill search form
      await this.page.select('#DropDownList_Origin', from)
      await this.page.select('#DropDownList_Dest', to)
      await this.page.type(
        '#DatePicker_Travel',
        date.toISOString().split('T')[0]
      )

      // Handle any modal that might appear before search
      await this.handleModal()

      await this.page.click('#ButtonInquiry')

      // Wait for results and extract data
      await this.page.waitForSelector('.flight-grid')

      // Handle any modal that might appear after search
      await this.handleModal()

      const flights = await this.page.evaluate(() => {
        const rows = document.querySelectorAll('.flight-grid tr')
        const flightData: XaelFlightData[] = []

        rows.forEach((row) => {
          const cells = row.querySelectorAll('td')
          if (cells.length >= 4) {
            flightData.push({
              flightNumber: cells[0].textContent?.trim() || '',
              departure: cells[1].textContent?.trim() || '',
              arrival: cells[2].textContent?.trim() || '',
              seatsAvailable: parseInt(cells[3].textContent?.trim() || '0', 10),
              price: {
                regular: parseFloat(
                  cells[4].textContent?.replace('$', '').trim() || '0'
                ),
                firstClass: cells[5]?.textContent
                  ? parseFloat(cells[5].textContent.replace('$', '').trim())
                  : undefined,
              },
            })
          }
        })

        return flightData
      })

      // Transform XAEL data to our format
      return flights.map((flight: XaelFlightData) => ({
        date: date.toISOString(),
        seatsTotal: 10,
        seatsAvailable: flight.seatsAvailable,
        status:
          flight.seatsAvailable > 3
            ? 'AVAILABLE'
            : flight.seatsAvailable > 0
              ? 'LIMITED'
              : 'SOLD_OUT',
        schedule: {
          flightNumber: flight.flightNumber,
          departure: flight.departure,
          arrival: flight.arrival,
        },
        pricing: {
          regular: {
            base: flight.price.regular,
            tax: flight.price.regular * 0.0725,
            total: flight.price.regular * 1.0725,
          },
          ...(flight.price.firstClass && {
            firstClass: {
              base: flight.price.firstClass,
              tax: flight.price.firstClass * 0.0725,
              total: flight.price.firstClass * 1.0725,
            },
          }),
        },
      }))
    } catch (error) {
      console.error('Error fetching XAEL availability:', error)
      throw error
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
      this.isLoggedIn = false
    }
  }
}
