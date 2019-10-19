function query ({ observationSet, vocab }) {
  return `
    PREFIX qudt: <http://qudt.org/1.1/schema/qudt#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?property ?label ?unit ?unitLabel ?datatype WHERE {
      {
        SELECT DISTINCT ?property ?datatype WHERE {
          {
            SELECT DISTINCT ?observation WHERE {
              <${observationSet.value}> <${vocab.observation.value}> ?observation .
            } LIMIT 100
          }

          ?observation ?property ?value .

          BIND(datatype(?value) AS ?datatype)
        }
      }

      OPTIONAL {
        ?property rdfs:label ?label .
      }

      OPTIONAL {
        ?property qudt:unit ?unit .

        BIND (STRAFTER(STR(?unit), "#")  AS ?unitLabel )
      }
    }
  `
}

module.exports = query
