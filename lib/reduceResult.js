function reduceResult ({ rows, key, add, extend }) {
  return new Set([...rows.reduce((objects, row) => {
    let object = objects.get(row[key].value)

    if (!object) {
      object = add(row)
      objects.set(row[key].value, object)
    }

    if (typeof extend === 'function') {
      extend(object, row)
    }

    return objects
  }, new Map()).values()])
}

module.exports = reduceResult
