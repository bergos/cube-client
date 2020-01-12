const Base = require('./Base')
const TermSet = require('@rdfjs/term-set')

class RangeFilter {
  constructor ({ property, from, to }) {
    this.property = property
    this.from = from
    this.to = to
  }

  toString (variable) {
    return `
      FILTER (?${variable} >= "${this.from.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>)
      FILTER (?${variable} < "${this.to.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>)
    `
  }
}

class Sort {
  constructor ({ property, descending = false }) {
    this.property = property
    this.descending = descending
  }

  toString (variable) {
    if (this.descending) {
      return `DESC(${variable})`
    }

    return variable
  }
}

class Property extends Base {
  constructor ({ datatypes = new TermSet(), factory, fetcher, label, term, unit, unitLabel, vocab }) {
    super({ factory, fetcher, vocab })

    this.term = term
    this.datatypes = datatypes
    this.label = label
    this.unit = unit
    this.unitLabel = unitLabel
  }

  rangeFilter (from, to) {
    return new RangeFilter({ property: this, from, to })
  }

  sort (descending = false) {
    return new Sort({ property: this, descending })
  }
}

module.exports = Property
