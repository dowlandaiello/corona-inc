import axios from 'axios'

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

  // Perform the request
  return (await axios.get(rawFileURI)).data
}

/**
 * Gets a copy of corona virus data for today in CSV format.
 */
export const getDataForToday = async () => {
  // Get data for today
  return await getDataForDay(new Date())
}
