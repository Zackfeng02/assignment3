export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    if (process.env.NODE_ENV === 'development') {
      res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        stack: err.stack
      });
    } else {
      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  };