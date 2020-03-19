/* eslint-disable no-undef */
import 'babel-polyfill'
import { formatDate } from '../jhuapi/api'

describe('formatDate', () => {
  test('formats a date properly', () => {
    expect(formatDate(new Date('December 17, 1995 03:24:00')) === '12-17-1995')
  })
})
