function query ({ observationSet, vocab }) {
  return `
    PREFIX bcube: <http://ns.bergnet.org/cube/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT DISTINCT ?observer ?label ?type WHERE {
      {
        SELECT DISTINCT ?observer WHERE {
          {
            SELECT ?observation WHERE {
              <${observationSet.value}> <${vocab.observation.value}> ?observation .
            } LIMIT 100
          }

          ?observation <${vocab.observedBy.value}> ?observer .
        }
      }

      OPTIONAL {
        ?observer rdfs:label ?label.
      }

      OPTIONAL {
        ?observer rdf:type ?type.
      }
    }
  `
}

module.exports = query
