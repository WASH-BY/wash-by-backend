const AysncHandler = (controllerFunctions) => (req, res, next) =>
  Promise.resolve(controllerFunctions(req, res, next)).catch(next);

  module.exports = AysncHandler;