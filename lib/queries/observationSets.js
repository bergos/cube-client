function query ({ vocab }) {
  return `    
    SELECT ?observationSet ?cube WHERE {
      {
        SELECT DISTINCT ?observationSet WHERE {  
          ?observationSet <${vocab.observation.value}> ?observation .
        }
      }

      OPTIONAL {
        ?cube  <${vocab.observations.value}> ?observationSet .
        ?cube a <${vocab.Cube.value}> .
      }
    }
  `
}

module.exports = query
