const Cube = require('./Cube')
const ObservationSet = require('./ObservationSet')
const Observer = require('./Observer')
const Property = require('./Property')

function cube (parent, options) {
  return new Cube({ factory: parent.factory, fetcher: parent.fetcher, vocab: parent.vocab, ...options })
}

function observationSet (parent, options) {
  return new ObservationSet({ factory: parent.factory, fetcher: parent.fetcher, vocab: parent.vocab, ...options })
}

function observer (parent, options) {
  return new Observer({ factory: parent.factory, fetcher: parent.fetcher, vocab: parent.vocab, ...options })
}

function property (parent, options) {
  return new Property({ factory: parent.factory, fetcher: parent.fetcher, vocab: parent.vocab, ...options })
}

module.exports = {
  cube,
  observationSet,
  observer,
  property
}
