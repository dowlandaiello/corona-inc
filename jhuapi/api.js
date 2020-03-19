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
 * Downloads a copy of corona virus data pertaining to a particular day from github user content.
 *
 * @param {Date} d the date for which data should be requested
 */
export const getDataForDay = async d => {
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

  // Perform the request
  await parse((await axios.get(rawFileURI)).data, row => {
    // Get the name of the region
    const regionName = row.data[0] ? row.data[0].replace(`'`, '') : ''

    // Get the name of the country associated with this row.
    // This is necessary, as we want to record both information regarding
    // localities and countries.
    const countryName = row.data[1] ? row.data[1].replace(`'`, '') : ''

    if (!regionName && !countryName) {
      return
    }

    // Get the number of cases, deaths, recoveries, and active cases in this region
    const data = {
      numConfirmed: parseInt(row.data[3]),
      numDeaths: parseInt(row.data[4]),
      numRecovered: parseInt(row.data[5]),
      numActive:
        parseInt(row.data[3]) - (parseInt(row.data[4]) + parseInt(row.data[5])),
      latitude: row.data[6],
      longitude: row.data[7]
    }

    if (results[countryName] === undefined) {
      results[countryName] = data
    } else {
      // Add whatever values we have here, which might be on a local level, to any pre-existing (other province) data
      for (const key in data) {
        if (typeof data[key] === 'number') {
          results[countryName][key] += data[key]

          continue
        }
      }
    }

    if (regionName) {
      // And on a local level
      results[countryName][regionName] = Object.assign({}, data)
    }
  })

  return results
}

/**
 * Gets a copy of corona virus data for today in CSV format.
 */
export const getDataForToday = async () => {
  // Get data for today
  return await getDataForDay(new Date())
}

/**
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} key the key for which data should be found
 * @param {String} country the country for which data should be found
 * @param {String} region the province or region for which data should be found (optional)
 */
export const getKey = (data, key, country, region) => {
  if (region) {
    return data[country][region][key]
  }

  return data[country][key]
}

/**
 * Gets the number of confirmed, but not necessarily active infections in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 */
export const getNumberConfirmed = (data, country, region) => {
  return getKey(data, country, region, 'numConfirmed')
}

/**
 * Gets the number of deaths in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 */
export const getNumberDead = (data, country, region) => {
  return getKey(data, country, region, 'numDeaths')
}

/**
 * Gets the number of recoveries in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 */
export const getNumberRecovered = (data, country, region) => {
  return getKey(data, country, region, 'numRecovered')
}

/**
 * Gets the number of active infections in the provided region.
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 */
export const getNumberActive = (data, country, region) => {
  return getKey(data, country, region, 'numActive')
}

/**
 * Gets the longitude associated with the given location (region optional).
 *
 * @param {Object} data data returned by the getDataForDay method
 * @param {String} country the name of a country from which data should be found
 * @param {String} region the name of a province or region from which data should be found
 */
export const getLongitude = (data, country, region) => {
  return getKey(data, country, region, 'longitude')
}

/**
 * Gets the latitude associated with the given location (region optional).
 *
 * @param {Object} data
 * @param {*} country
 * @param {*} region
 */
export const getLatitude = (data, country, region) => {
  return getKey(data, country, region, 'latitude')
}
