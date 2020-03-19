/* eslint-disable no-undef */
import 'babel-polyfill'
import {
  formatDate,
  getDataForDay,
  getDataForToday,
  getNumberActive,
  getNumberConfirmed
} from '../jhuapi/api'

describe('formatDate', () => {
  test('formats a date properly', () => {
    expect(formatDate(new Date('December 17, 1995 03:24:00')) === '12-17-1995')
  })
})

describe('getDataForDay', () => {
  test('gets data for a particular day', () => {
    return getDataForDay(new Date('March 18, 2020 09:50:00')).then(data =>
      expect(data)
    )
  })
})

describe('getDataForToday', () => {
  test('gets data for today', () => {
    return getDataForToday().then(data => expect(data))
  })
})

describe('getNumberConfirmed', () => {
  test('gets the number of confirmed cases globally', () => {
    return getDataForToday().then(data => expect(getNumberConfirmed(data) > 0))
  })

  test('gets the number of confirmed cases in the United States', () => {
    return getDataForToday().then(data =>
      expect(getNumberConfirmed(data, 'US') > 0)
    )
  })

  test('gets the number of confirmed cases in New York', () => {
    return getDataForToday().then(data => {
      console.log(data['US']['New York']['numConfirmed'])
      expect(getNumberConfirmed(data, 'US', 'New York') > 0)
    })
  })
})
