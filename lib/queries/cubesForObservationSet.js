function query ({ observationSet, vocab }) {
  return `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?cube ?label ?observationSet WHERE {  
      ?cube a <${vocab.Cube.value}> ;
        <${vocab.observations.value}> <${observationSet.value}> .

      OPTIONAL {
        ?cube rdfs:label ?label .
      }

      OPTIONAL {
        ?cube <${vocab.observations.value}> ?observationSet .
      }
    }
  `
}

module.exports = query
