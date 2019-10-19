const defaultFetch = require('isomorphic-fetch')
const { SparqlEndpointFetcher } = require('fetch-sparql-endpoint')
const getStream = require('get-stream')
const PromiseQueue = require('promise-queue')

class Fetcher {
  constructor ({ debug, endpointUrl, fetch }) {
    this.debug = debug
    this.endpointUrl = endpointUrl
    this.fetcher = new SparqlEndpointFetcher({
      fetch: fetch || defaultFetch
    })
    this.queue = new PromiseQueue(4)
  }

  async fetch (query) {
    if (this.debug) {
      console.log(`run query: ${query}`)
    }

    return this.queue.add(async () => {
      return getStream.array(await this.fetcher.fetchBindings(this.endpointUrl, query))
    })
  }
}

module.exports = Fetcher
