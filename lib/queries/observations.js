function query ({ filters, observationSet, sorts = [], variables, vocab }) {
  const variablesString = [...variables.values()].map(variable => `?${variable}`).join(' ')
  const patternsString = [...variables].map(([property, variable]) => {
    return `?observation <${property.term.value}> ?${variable} .`
  }).join('\n')
  const filtersString = !filters ? '' : [...filters].map(filter => {
    return filter.toString(variables.get(filter.property))
  }).join('\n')
  const sortString = sorts.map(sort => {
    return `?${sort.toString(variables.get(sort.property))}`
  }).join(' ')

  return `
    SELECT DISTINCT ${variablesString} WHERE {
      <${observationSet.term.value}> <${vocab.observation.value}> ?observation .
      ${patternsString}
      ${filtersString}
    } ${sortString ? 'ORDER BY' : ''} ${sortString}
  `
}

module.exports = query
