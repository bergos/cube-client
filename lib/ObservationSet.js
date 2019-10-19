const Base = require('./Base')
const observationsQuery = require('./queries/observations')
const observerQuery = require('./queries/observer')
const propertiesQuery = require('./queries/properties')
const reduceResult = require('./reduceResult')
const TermSet = require('@rdfjs/term-set')

class ObservationSet extends Base {
  constructor ({ cubeTerms = new TermSet(), factory, fetcher, term, vocab }) {
    super({ factory, fetcher, vocab })

    this.term = term
    this.cubeTerms = cubeTerms
    this.cache = {}
  }

  async observations ({ filters, sorts } = {}) {
    const properties = await this.properties()
    const variables = new Map([...properties].map((property, index) => {
      return [property, `v${index}`]
    }))

    const rows = await this.fetcher.fetch(observationsQuery({
      filters,
      observationSet: this,
      sorts,
      variables,
      vocab: this.vocab
    }))

    return rows.map(row => {
      return [...variables.entries()].reduce((result, [property, variable]) => {
        result[property.term.value] = row[variable]

        return result
      }, {})
    })
  }

  async observers ({ force = false } = {}) {
    if (this.cache.observers && !force) {
      return this.cache.observers
    }

    const rows = await this.fetcher.fetch(observerQuery({
      observationSet: this.term,
      vocab: this.vocab
    }))

    this.cache.observers = reduceResult({
      rows,
      key: 'observer',
      add: row => {
        return this.factory.observer(this, {
          label: row.label,
          term: row.observer
        })
      },
      extend: (observer, row) => {
        if (row.type) {
          observer.types.add(row.type)
        }
      }
    })

    return this.cache.observers
  }

  async properties ({ force = false } = {}) {
    if (this.cache.properties && !force) {
      return this.cache.properties
    }

    const rows = await this.fetcher.fetch(propertiesQuery({
      observationSet: this.term,
      vocab: this.vocab
    }))

    this.cache.properties = reduceResult({
      rows,
      key: 'property',
      add: row => {
        return this.factory.property(this, {
          label: row.label,
          term: row.property,
          unit: row.unit,
          unitLabel: row.unitLabel
        })
      },
      extend: (property, row) => {
        if (row.datatype) {
          property.datatypes.add(row.datatype)
        }
      }
    })

    return this.cache.properties
  }
}

module.exports = ObservationSet
