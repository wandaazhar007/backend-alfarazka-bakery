// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.statusCode || err.status || 500; // default 500
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};