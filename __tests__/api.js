/* eslint-disable no-undef */
import 'babel-polyfill'
import {
  formatDate,
  getDataForDay,
  getDataForToday,
  getNumberActive,
  getNumberConfirmed,
  getNumberDead,
  getNumberRecovered
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
    return getDataForToday().then(data =>
      expect(getNumberConfirmed(data, 'US', 'New York') > 0)
    )
  })
})

describe('getNumberDead', () => {
  test('gets the number of deaths globally', () => {
    return getDataForToday().then(data => expect(getNumberDead(data) > 0))
  })

  test('gets the number of deaths in the United States', () => {
    return getDataForToday().then(data => expect(getNumberDead(data, 'US') > 0))
  })

  test('gets the number of deaths in New York', () => {
    return getDataForToday().then(data =>
      expect(getNumberDead(data, 'US', 'New York') > 0)
    )
  })
})

describe('getNumberRecovered', () => {
  test('gets the number of recoveries globally', () => {
    return getDataForDay(new Date('March 18, 2020')).then(data =>
      expect(getNumberRecovered(data) > 0)
    )
  })

  test('gets the number of recoveries in the United States', () => {
    return getDataForDay(new Date('March 18, 2020')).then(data =>
      expect(getNumberRecovered(data, 'US') === 0)
    )
  })

  test('gets the number of recoveries in New York', () => {
    return getDataForDay(new Date('March 18, 2020')).then(
      data => expect(getNumberRecovered(data, 'US', 'New York')) === 0
    )
  })
})

describe('getNumberActive', () => {
  test('gets the number of active cases globally', () => {
    return getDataForToday().then(data => expect(getNumberActive(data) > 0))
  })

  test('gets the number of active cases in the United States', () => {
    return getDataForToday().then(data =>
      expect(getNumberActive(data, 'US') > 0)
    )
  })

  test('gets the number of active cases in New York', () => {
    return getDataForToday().then(data =>
      expect(getNumberActive(data, 'US', 'New York') > 0)
    )
  })
})
