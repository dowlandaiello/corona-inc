/* eslint-disable no-undef */
import 'babel-polyfill'
import {
  formatDate,
  getDataForDay,
  getDataForToday,
  getNumberOfInfections
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

describe('getNumberOfInfections', () => {
  test('gets the number of infections globally', () => {
    return getDataForToday().then(data => getNumberOfInfections(data))
  })
})
