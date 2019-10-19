function query ({ cube, vocab }) {
  return `    
    SELECT ?observationSet ?cube WHERE {
      <${cube.value}> <${vocab.observations.value}> ?observationSet

      OPTIONAL {
        ?cube  <${vocab.observations.value}> ?observationSet .
        ?cube a <${vocab.Cube.value}> .
      }
    }
  `
}

module.exports = query
