const namespace = require('@rdfjs/namespace')

const bergnetCube = namespace('http://ns.bergnet.org/cube/')

const vocab = {
  Cube: bergnetCube.Cube,
  observation: bergnetCube.observation,
  observations: bergnetCube.observations,
  observedBy: bergnetCube.observedBy
}

module.exports = vocab
