const Base = require('./Base')
const TermSet = require('@rdfjs/term-set')

class Observer extends Base {
  constructor ({ factory, fetcher, label, term, types = new TermSet(), vocab }) {
    super({ factory, fetcher, vocab })

    this.term = term
    this.label = label
    this.types = types
  }
}

module.exports = Observer
