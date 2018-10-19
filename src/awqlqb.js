import moment from 'moment'

class AWQLQB {
  constructor () {
    /** @type{object} */
    this.query = {}
    /** @type{array} */
    this.filterRules = []
  }

  /**
   * SELECT ... FROM (level)
   * @param {string} level
   */
  from (level) {
    this.query = { ...this.query, level }
    return this
  }

  /**
   * SELECT (fields) FROM ...
   * @param {array} fields
   */
  select (fields) {
    this.query = { ...this.query, fields }
    return this
  }

  /**
   * SELECT ... FROM ... WHERE (filtering)
   * @param {{ field: string, operator: string, value: any }}
   */
  where ({ field, operator, value }) {
    if (value !== undefined) {
      const filtering = { field, operator, values: value }
      this.filterRules = this.filterRules.concat(filtering)
    }
    return this
  }

  /**
   * ... DURING [since, until]
   * @param {{ since: string, until: string }}
   */
  during ({ since, until }) {
    if (since) {
      this.query = { ...this.query, timeRange: { ...this.query.timeRange, since: moment(since).format('YYYYMMDD') } }
    }
    if (until) {
      this.query = { ...this.query, timeRange: { ...this.query.timeRange, until: moment(until).format('YYYYMMDD') } }
    }
    return this
  }

  /**
   * @return {string}
   */
  asAWQL () {
    const { level, fields, timeRange } = this.query

    let fieldsString = ''
    let timeRangeString = ''
    let filteringsString = ''

    if (fields) fieldsString += fields.join(' , ')
    if (timeRange) timeRangeString += `${timeRange.since}, ${timeRange.until}`
    const filterings = this.filterRules.map((rule) => {
      let ruleString = `${rule.field} ${rule.operator} `
      ruleString += typeof (rule.values) === 'string' ? rule.values : `[${rule.values.join(' , ')}]`
      return ruleString
    })
    filteringsString = filterings.join(' AND ')

    let queryString = ''
    if (fieldsString) queryString = `SELECT ${fieldsString} `
    if (level) queryString += `FROM ${level} `
    if (filteringsString) queryString += `WHERE ${filteringsString} `
    if (timeRangeString) queryString += `DURING ${timeRangeString} `

    return queryString
  }
}

export default AWQLQB
