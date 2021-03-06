import axios from 'axios'
import Papa from 'papaparse'

export const databaseRepo =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19'

/**
 * Formats a JavaScript date object in the following manner: MONTH-DAY-YEAR
 *
 * @param {Date} d the date that should be formatted in accordance with the JHU format
 */
export const formatDate = d => {
  const format = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const [
    { value: mo },
    ,
    { value: da },
    ,
    { value: ye }
  ] = format.formatToParts(d)

  return `${mo}-${da}-${ye}`
}

/**
 * Gets a timestamp corresponding to the closest day to the provided timestamp, where some dataset
 * exists in the JHU api for such a date.
 *
 * @param {Date} d the date to which the closest data set should be found
 */
export const closestDayWithData = async d => {
  // Get a link to the file store this particular day's information
  const rawFileURI = `${databaseRepo}/master/csse_covid_19_data/csse_covid_19_daily_reports/${formatDate(
    d
  )}.csv`

  try {
    await axios.get(rawFileURI)

    return d
  } catch (e) {
    if (e.response && e.response.status === 404) {
      // Use data from yesterday
      d.setDate(d.getDate() - 1)

      return closestDayWithData(d)
    } else {
      throw e
    }
  }
}

/**
 * Downloads a copy of corona virus data pertaining to a particular day from github user content.
 *
 * @param {Date} d the date for which data should be requested
 * @param {Object} opts configuration options for the JHU data parser, where opts is defined as such:
 * {
 *  includeHistoricalData: Boolean
 * }
 */
export const getDataForDay = async (d, opts) => {
  // Get a link to the file store this particular day's information
  const rawFileURI = `${databaseRepo}/master/csse_covid_19_data/csse_covid_19_daily_reports/${formatDate(
    d
  )}.csv`

  // Make the papa parser more easy to work with
  const parse = (uri, step) => {
    return new Promise((complete, error) => {
      Papa.parse(uri, { complete, error, step: step })
    })
  }

  // Make a hashmap of the results
  let results = {}

  // Data from the previous day
  let historical = false

  // Collect data from yesterday, if applicable
  if (opts && opts.includeHistoricalData) {
    const yesterday = new Date()
    yesterday.setDate(d.getDate() - 1)

    historical = (await getDataForDay(yesterday, { includeHistorical: false }))
      .today
  }

  // The response from JHU
  const resp = (await axios.get(rawFileURI)).data

  // Perform the request
  await parse(resp, row => {
    // Get the name of the region
    const regionName = row.data[3] ? row.data[3].replace(`'`, '') : ''

    // Get the name of the country associated with this row.
    // This is necessary, as we want to record both information regarding
    // localities and countries.
    const countryName = row.data[4] ? row.data[4].replace(`'`, '') : ''

    if ((!regionName && !countryName) || countryName === 'Country/Region') {
      return
    }

    // Get the number of cases, deaths, recoveries, and active cases in this region
    const data = {
      numConfirmed: parseInt(row.data[7]),
      numDeaths: parseInt(row.data[8]),
      numRecovered: parseInt(row.data[9]),
      numActive:
        parseInt(row.data[3]) - (parseInt(row.data[4]) + parseInt(row.data[5])),
      latitude: row.data[5],
      longitude: row.data[6],
      identifier: regionName ? regionName : countryName
    }

    if (results[countryName] === undefined) {
      results[countryName] = {
        numConfirmed: 0,
        numDeaths: 0,
        numRecovered: 0,
        numActive: 0,
        latitude: '',
        longitude: '',
        identifier: countryName
      }
    }

    // Add whatever values we have here, which might be on a local level, to any pre-existing (other province) data
    for (const key in data) {
      if (typeof data[key] === 'number') {
        results[countryName][key] += data[key]

        if (results[key]) {
          results[key] += data[key]
        } else {
          results[key] = data[key]
        }

        continue
      }

      if (!results[countryName][key] || results[countryName][key] == '') {
        results[countryName][key] = data[key]
      }
    }

    if (regionName) {
      // And on a local level
      results[countryName][regionName] = Object.assign({}, data)
    }
  })

  return {
    today: results,
    yesterday: historical || undefined
  }
}

/**
 * Gets a copy of corona virus data for today in CSV format.
 *
 * @param {Object} opts configuration options for the JHU data parser, where opts is defined as such:
 * {
 *  includeHistoricalData: Boolean
 * }
 */
export const getDataForToday = async opts => {
  // Get data for today
  return await getDataForDay(await closestDayWithData(new Date()), opts)
}

/**
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} key the key for which data should be found
 * @param {String} country the country for which data should be found (optional)
 * @param {String} region the province or region for which data should be found (optional)
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getKey = (data, key, country, region, historical) => {
  const timeframe = historical ? 'yesterday' : 'today'
  if (!data[timeframe]) {
    return ''
  }

  if (!country) {
    return data[timeframe][key] || 0
  }

  if (region) {
    return ((data[timeframe][country] || {})[region] || {})[key] || 0
  }

  return (data[timeframe][country] || {})[key] || 0
}

/**
 * Gets the number of confirmed, but not necessarily active infections in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getNumberConfirmed = (data, country, region, historical) => {
  return getKey(data, 'numConfirmed', country, region, historical)
}

/**
 * Gets the number of deaths in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getNumberDead = (data, country, region, historical) => {
  return getKey(data, 'numDeaths', country, region, historical)
}

/**
 * Gets the number of recoveries in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getNumberRecovered = (data, country, region, historical) => {
  return getKey(data, 'numRecovered', country, region, historical)
}

/**
 * Gets the number of active infections in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getNumberActive = (data, country, region, historical) => {
  return getKey(data, 'numActive', country, region, historical)
}

/**
 * Gets the longitude associated with the given location (region optional).
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getLongitude = (data, country, region, historical) => {
  return getKey(data, 'longitude', country, region, historical)
}

/**
 * Gets the latitude associated with the given location (region optional).
 *
 * @param {Object} data
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 * @param {Boolean} historical whether the value should be fetched for today or yesterday
 */
export const getLatitude = (data, country, region, historical) => {
  return getKey(data, 'latitude', country, region, historical)
}
