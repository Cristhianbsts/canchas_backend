// src/utils/asyncHandler.js
// Wrapper para evitar try/catch en controllers.
// Cualquier error async se manda al error middleware con next(err)

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  export default asyncHandler;