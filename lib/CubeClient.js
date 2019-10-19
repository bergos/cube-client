const Base = require('./Base')
const factory = require('./factory')
const cubesQuery = require('./queries/cubes')
const cubesForObservationSetQuery = require('./queries/cubesForObservationSet')
const defaultVocab = require('./defaultVocab')
const Fetcher = require('./Fetcher')
const observationSetsQuery = require('./queries/observationSets')
const reduceResult = require('./reduceResult')

class CubeClient extends Base {
  constructor ({ debug, endpointUrl, fetch, vocab = defaultVocab }) {
    super({ factory, fetcher: new Fetcher({ debug, endpointUrl, fetch }), vocab })

    this.cache = {}
  }

  async cubes ({ force = false } = {}) {
    if (this.cache.cubes && !force) {
      return this.cache.cubes
    }

    const rows = await this.fetcher.fetch(cubesQuery({ vocab: this.vocab }))

    this.cache.cubes = reduceResult({
      rows,
      key: 'cube',
      add: row => {
        return this.factory.cube(this, { term: row.cube })
      }
    })

    return this.cache.cubes
  }

  async cubesByObservationSet ({ force = false, observationSet }) {
    this.cache.cubesByObservationSet = this.cache.cubesByObservationSet || {}

    if (this.cache.cubesByObservationSet[observationSet.term.value] && !force) {
      return this.cache.cubesByObservationSet[observationSet.term.value]
    }

    const rows = await this.fetcher.fetch(cubesForObservationSetQuery({
      observationSet: observationSet.term,
      vocab: this.vocab
    }))

    this.cache.cubesByObservationSet[observationSet.term.value] = reduceResult({
      rows,
      key: 'cube',
      add: row => {
        return this.factory.cube(this, {
          label: row.label,
          term: row.cube
        })
      }
    })

    return this.cache.cubesByObservationSet[observationSet.term.value]
  }

  async observationSets ({ force = false } = {}) {
    if (this.cache.observationSets && !force) {
      return this.cache.observationSets
    }

    const rows = await this.fetcher.fetch(observationSetsQuery({ vocab: this.vocab }))

    this.cache.observationSets = reduceResult({
      rows,
      key: 'observationSet',
      add: row => {
        return this.factory.observationSet(this, {
          term: row.observationSet
        })
      },
      extend: (observationSet, row) => {
        if (row.cube) {
          observationSet.cubeTerms.add(row.cube)
        }
      }
    })

    return this.cache.observationSets
  }
}

module.exports = CubeClient
