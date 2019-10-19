const Base = require('./Base')
const observationSetsForCubeQuery = require('./queries/observationSetsForCube')
const reduceResult = require('./reduceResult')

class Cube extends Base {
  constructor ({ factory, fetcher, label, term, vocab }) {
    super({ factory, fetcher, vocab })

    this.term = term
    this.label = label
    this.cache = {}
  }

  async observationSets ({ force = false } = {}) {
    if (this.cache.observationSets && !force) {
      return this.cache.observationSets
    }

    const rows = await this.fetcher.fetch(observationSetsForCubeQuery({ cube: this.term, vocab: this.vocab }))

    this.cache.observationSets = reduceResult({
      rows,
      key: 'observationSet',
      add: row => {
        return this.factory.observationSet(this, { term: row.observationSet })
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

module.exports = Cube
