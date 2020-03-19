export const databaseRepo =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19'

/**
 * Formats a JavaScript date object in the following manner: MONTH-DAY-YEAR
 *
 * @param {Date} d the date that should be formatted in accordance with the JHU format
 */
export const formatDate = d => {
  return `${d.getMonth()}-${d.getDay()}-${d.getYear()}`
}

/**
 * Downloads a copy of corona virus data pertaining to a particular day from github user content.
 *
 * @param {Date} d the date for which data should be requested
 */
export const dataForDay = async d => {
  // Get a link to the file store this particular day's information
  const rawFileURI = `${databaseRepo}/master/csse_covid_19_data/csse_covid_19_daily_reports/${formatDate(
    d
  )}`

  return await fetch(rawFileURI)
}

/**
 * Gets a copy of corona virus data for today in CSV format.
 */
export const dataForToday = async () => {
  // Get data for today
  return await dataForDay(new Date())
}
