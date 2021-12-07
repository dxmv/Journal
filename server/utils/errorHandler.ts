
/*
  This is a function that is called at the end of the request
  if the error was encountered during the request processing 
*/

const errorHandler=(err, req, res, next)=>{
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({
    "msg":"Internal Server Error"
  })
};
export default errorHandler;