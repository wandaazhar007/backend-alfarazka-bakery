export const getHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Alfarazka Bakery API is healthy",
    timestamp: new Date().toISOString(),
  });
};