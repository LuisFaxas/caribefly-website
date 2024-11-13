export const XAEL_CONFIG = {
  credentials: {
    username: process.env.XAEL_USERNAME || '',
    password: process.env.XAEL_PASSWORD || '',
  },
  baseUrl: 'https://xaelsuite.com',
  endpoints: {
    login: '/login.aspx',
    newReservation: '/Reservations/NewReservation.aspx',
    flightSchedule: '/Reservations/FlightSchedule.aspx',
  },
  selectors: {
    loginForm: {
      username: '#txtUserName',
      password: '#txtPassword',
      submitButton: '#btnLogin',
    },
    searchForm: {
      origin: '#DropDownList_Origin',
      destination: '#DropDownList_Dest',
      date: '#DatePicker_Travel',
      searchButton: '#ButtonInquiry',
    },
    results: {
      flightGrid: '.flight-grid',
      flightRow: '.flight-grid tr',
      availabilityCell: 'td:nth-child(4)',
    },
  },
}
